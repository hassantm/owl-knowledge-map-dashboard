# Vocabulary Explorer Tool — Implementation Plan

> Companion to `docs/vocabulary-explorer-tool.md` (the design & functional spec).
> Task list: `tasks/vocabulary-tool-tasks.md`.

## Context

The spec describes a new teacher-facing surface in the existing OWL dashboard. It depends on the Phase 2 enrichment pipeline (all 2,928 concepts are already `enrichment_status='approved'`) and the `co_occurrences` table (2.04M rows, lesson/unit/year_group granularities). Both preconditions are confirmed live against the `owl` Postgres database.

The feature adds a `/vocabulary` route that lets a class teacher:

1. Select a chapter via cascading dropdowns (subject → year → unit → chapter).
2. See the vocabulary of that chapter as thematic cluster cards (Louvain community detection over chapter-scoped co-occurrence).
3. Click any word to open a slide-in panel showing its semantic neighbourhood, an LLM-streamed teacher briefing, and a curriculum trajectory.
4. See "bridge word" callouts where concepts also appear in another subject.

This is a **new, additive** surface — no changes to existing views. `/`, `/architecture`, `/timeline`, `/concepts`, `/browse`, `/overview` are untouched.

---

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Briefing model | `claude-opus-4-7` | Pedagogical reasoning matters for 150–200 word briefings. Prompt caching on system + stable-knowledge blocks brings per-call cost to ~$0.03–0.05 uncached, much less on cache hit. |
| Cluster-label model | `claude-haiku-4-5-20251001` | 2–4 word output; cheap and fast; batched N-per-chapter. |
| URL state | Query params via `useSearchParams` | Deep-linkable, survives refresh, browser back navigates within the tool. |
| Cluster-label cache | In-process `@lru_cache` | Keyed on `(unit, chapter, sorted-member-hash)`. No schema change; ~10 lines; survives process lifetime. |
| Louvain library | Native `networkx.algorithms.community.louvain_communities` | `networkx 3.6.1` already installed; `python-louvain` would pollute `community` namespace. Spec §9 explicitly says to use whichever matches the installed NetworkX. |
| Streaming protocol | Server-Sent Events | Resolves the spec §6.7 ambiguity — a plain-text stream can't carry the JSON sidecar. SSE emits `context` → `token*` → `done`. |

---

## Backend (`api/routes/vocabulary.py` — new file)

Register in `api/main.py` alongside the existing routers:

```python
from api.routes import stats, graph, concepts, occurrences, edges, semantic, timeline, vocabulary
app.include_router(vocabulary.router, prefix="/api/vocabulary", tags=["vocabulary"])
```

Internals split into private helpers so unit tests can import them directly:
`_get_chapter_concepts`, `_get_chapter_cooccurrences`, `_build_clusters`,
`_score_centre_node`, `_get_bridge_map`, `_cluster_label_cached`,
`_get_word_detail_context`, `_build_briefing_prompt`, `_stream_briefing`.

### Endpoint 1 — `GET /api/vocabulary/navigation`

Single query over `occurrences JOIN concepts` filtered on `enrichment_status='approved'` AND `chapter IS NOT NULL`. Returns:

```json
{ "subjects": [...], "hierarchy": { "<subject>": { "<year>": { "<unit>": ["<chapter>", ...] } } } }
```

Wrap in `@lru_cache(maxsize=1)` over a JSON-string helper. Sibling `POST /api/vocabulary/navigation/invalidate` mirrors the pattern at `api/routes/semantic.py:144`.

### Endpoint 2 — `GET /api/vocabulary/chapter-clusters?unit=&chapter=`

Pipeline (spec §5):

1. `_get_chapter_concepts` — spec §5.1 SQL verbatim.
2. `_get_chapter_cooccurrences` — spec §5.2 SQL verbatim. Direct `occurrences` self-join, **not** `co_occurrences`, because chapter isn't stored at that granularity.
3. `_get_bridge_map` — spec §5.5 SQL over `co_occurrences` WHERE `is_cross_subject=true`, `granularity='lesson'`.
4. `_build_clusters` — NetworkX graph + `louvain_communities(G, weight='weight', seed=42)`. Isolated nodes → singleton communities (spec §11).
5. `_score_centre_node` per cluster — spec §5.4 weights (within-cluster degree 0.5, is_introduction 0.2, bridge 0.2, tier 0.1). Cap tier at `min(tier or 1, 3) / 3` for NULL-safety.
6. `_cluster_label_cached` per cluster of size ≥ 2 — Haiku call. Singletons use `centre_term.title()` with `label_generated: false`. Cache key: `sha1(f"{unit}|{chapter}|{','.join(map(str, sorted(cluster_ids)))}")`.
7. Parallelise the N label calls with `asyncio.gather` over an `AsyncAnthropic` client. Cuts cold-cache first-view latency from ~N × 500 ms to ~500 ms.
8. Fallback on LLM failure or missing `ANTHROPIC_API_KEY`: label = `f"{centre_term} & related"`, `label_generated: false`. **Do not fail the endpoint.**
9. Empty chapter returns `{unit, chapter, clusters: []}` with 200. Frontend renders an explicit empty state.

Coerce `any_introduction == 1` to `bool` at the API boundary; never leak INTEGER to the wire.

### Endpoint 3 — `GET /api/vocabulary/word-detail?concept_id=&unit=&chapter=` (streamed)

Mechanism: `fastapi.responses.StreamingResponse(media_type="text/event-stream")`.

Sequence:

1. Run the four SQL queries in spec §5.7 (concept fields, trajectory, neighbourhood, bridge_details). Extend the neighbourhood SELECT to include `c2.concept_id AS concept_id` so the frontend navigates by ID, not by term (terms aren't globally unique).
2. 404 if concept missing or not approved.
3. Close the DB connection **before** opening the Anthropic stream.
4. Yield `event: context\ndata: {...}\n\n` with the full context payload.
5. Open Anthropic stream. Yield `event: token\ndata: {"text": delta}\n\n` for each `stream.text_stream` chunk.
6. Yield `event: done\ndata: {input_tokens, output_tokens, cache_read_input_tokens, cache_creation_input_tokens}\n\n`.
7. On error mid-stream, yield `event: error\ndata: {"message": ...}\n\n` then `done`.

Anthropic call shape:

```python
with client.messages.stream(
    model="claude-opus-4-7",
    max_tokens=400,
    system=[{"type": "text", "text": BRIEFING_SYSTEM_PROMPT,
             "cache_control": {"type": "ephemeral"}}],
    messages=[{"role": "user", "content": [
        {"type": "text", "text": stable_knowledge_block,
         "cache_control": {"type": "ephemeral"}},
        {"type": "text", "text": volatile_context_block},
    ]}],
) as stream:
    for delta in stream.text_stream:
        yield _sse("token", {"text": delta})
    final = stream.get_final_message()
    yield _sse("done", {...})
```

**Cache-key invariant:** `current_unit` and the trajectory/neighbourhood/bridge sections must live in the volatile block, never the cached block — otherwise the cache only hits for the exact same unit context.

Prompt content follows spec §5.7 — render `(not recorded)` for null etymology/definition and omit the word-family line entirely when `word_family` is null/empty. Otherwise `None` pollutes the cached stable-knowledge block.

### Rate-limiting guard

Add `MAX_LLM_CALLS_PER_MINUTE` env var (default 60). Simple in-process counter; return 429 when exceeded. Cheap defensive shim since there's no auth layer.

### New dependencies

Append to `requirements.txt`:

```
anthropic>=0.70.0
networkx>=3.4
```

---

## Frontend

### Files to create

| File | Role |
|---|---|
| `src/pages/VocabularyView.tsx` | Top-level page. Reads/writes URL state via `useSearchParams`. Composes ChapterSelector + ClusterCardsView + WordDetailPanel. |
| `src/components/vocabulary/ChapterSelector.tsx` | Cascading `<select>` tags, fully controlled. Clearing a higher level cascades reset downward. |
| `src/components/vocabulary/ClusterCardsView.tsx` | Grid of cards. Loading skeleton + empty state. |
| `src/components/vocabulary/ClusterCard.tsx` | One card: label + BridgeCallout (if centre is bridge) + word chips. |
| `src/components/vocabulary/WordChip.tsx` | Chip with state variants (centre, intro, bridge, tier). |
| `src/components/vocabulary/BridgeCallout.tsx` | Small "Also in: X, Y" pill. |
| `src/components/vocabulary/WordDetailPanel.tsx` | Slide-in drawer (inline Tailwind transform/transition — no separate primitive yet). Esc-to-close, backdrop on mobile, focus stash/restore. |
| `src/components/vocabulary/NeighbourhoodCloud.tsx` | Size-by-weight chips; cross-subject chips in owl-green. |
| `src/components/vocabulary/TeacherBriefing.tsx` | Streamed text + blinking cursor + copy button + error/retry state. |
| `src/components/vocabulary/TrajectoryTimeline.tsx` | Ordered list: year/term · unit/chapter · INTRO/RECUR badge (reuse badge classes from `src/components/OccurrenceCard.tsx:28`). |

### Files to modify

- `src/App.tsx:11-23` — import `VocabularyView`, add `<Route path="/vocabulary" element={<VocabularyView />} />`.
- `src/components/Layout.tsx:4-11` — append `{ to: '/vocabulary', label: 'Vocabulary', Icon: Sparkles }` to `NAV`; add `Sparkles` to the lucide-react import on line 2.
- `src/lib/api.ts` — add types (`NavigationResponse`, `Cluster`, `ClusterConcept`, `ChapterClustersResponse`, `WordDetailContext`), fetchers (`fetchVocabNavigation`, `fetchChapterClusters`), and `streamWordDetail(conceptId, unit, chapter, {onContext, onToken, onDone, onError, signal})` — an SSE consumer using `response.body.getReader()` + `TextDecoder` + a `\n\n`-delimited frame parser.

### URL-state pattern

```tsx
const [params, setParams] = useSearchParams()
// Read: params.get('subject'), etc.
// Write: changing an upstream key clears downstream keys.
```

Use `replace: false` so the browser back button navigates within the tool.

### Styling palette (using existing tokens only)

| State | Tailwind |
|---|---|
| Default chip | `inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white text-ink text-sm px-3 py-1 hover:bg-slate-50` |
| Centre node | + `text-base font-semibold ring-1 ring-owl-purple/30 shadow-sm` |
| First introduction | + `underline decoration-owl-green underline-offset-2` (or trailing green dot via `after:`) |
| Bridge word | `border-owl-green/60 text-owl-green bg-owl-green/5` + trailing `<ArrowUpRight size={12}/>` |
| Cluster card | `bg-white border border-slate-200 rounded-xl p-4 shadow-sm` |
| Cluster label | `font-serif text-lg text-ink` |
| Page background | `bg-cream` |
| Cross-subject chip | `bg-owl-green/10 text-owl-green border-owl-green/30` |
| Streaming cursor | `animate-pulse text-owl-purple` |
| Drawer surface | `fixed top-0 right-0 h-screen w-full md:w-[520px] z-50 bg-cream border-l border-slate-200 shadow-2xl transition-transform duration-300 transform translate-x-0` (open) / `translate-x-full` (closed) |
| Mobile backdrop | `fixed inset-0 bg-ink/30 z-40 md:hidden` |

No new colour tokens.

### Reusable building blocks already in the repo

- `api/routes/concepts.py:9-64` — reference for new GET endpoints (RealDictCursor pattern, pagination).
- `api/routes/semantic.py:134/144` — in-process cache + invalidate POST pattern.
- `src/lib/api.ts:225-239` — `apiFetch()` helper.
- `src/components/OccurrenceCard.tsx:28` — INTRO/RECUR badge classes to reuse in TrajectoryTimeline.
- `src/pages/PrepareView.tsx:140` — Tailwind spinner.

---

## Testing

### Backend (`tests/test_vocabulary.py`)

The existing `tests/conftest.py` SQLite schema (lines 22–60) pre-dates Phase 2 enrichment and `co_occurrences`. Non-destructive extension needed:

- Add `tier`, `register`, `definition`, `etymology`, `word_family`, `enrichment_status`, `enrichment_notes`, `enriched_at`, `enriched_by` columns to the `concepts` table.
- Add the `co_occurrences` table with the spec §2 shape.
- Seed: two concepts sharing a chapter, one cross-subject co-occurrence, one isolated chapter concept, one `enrichment_status='pending'` concept (must be excluded everywhere).
- Append `"api.routes.vocabulary.get_conn"` to `ROUTE_MODULES` at `tests/conftest.py:98`.

**Unit tests** (direct import, no TestClient):

- `test_score_centre_node_prefers_high_degree`
- `test_score_centre_node_tier_breaks_ties`
- `test_score_centre_node_bridge_contribution`
- `test_build_clusters_handles_isolated_nodes`
- `test_build_clusters_is_deterministic_with_seed`

**Endpoint tests** (TestClient, Anthropic patched):

- `test_navigation_hierarchy_shape`
- `test_chapter_clusters_returns_expected_shape`
- `test_chapter_clusters_only_approved_concepts`
- `test_chapter_clusters_empty_chapter_returns_empty_list`
- `test_word_detail_404_on_unknown_concept`
- `test_word_detail_sse_context_frame_first` — mock `anthropic.Anthropic`, parse SSE response body, assert first frame is `event: context` with correct JSON shape.

### Frontend (Vitest / React Testing Library)

- `WordChip.test.tsx` — full state matrix (centre × intro × bridge × tier).
- `ClusterCard.test.tsx` — shows BridgeCallout iff centre is bridge.
- `ChapterSelector.test.tsx` — picking a subject clears downstream values.
- `VocabularyView.test.tsx` — `vi.stubGlobal('fetch', ...)` canned navigation + clusters; three cards render; word click updates search params.
- `api.test.ts` — `streamWordDetail` with a mocked `ReadableStream` emitting context/token/token/done frames; callbacks fire in order.

### End-to-end smoke (in PR description)

1. Start API (`./start_api.sh`) and Vite (`npm run dev`).
2. Open `/vocabulary`; pick History → Yr 4 → "The Roman Empire" → first chapter.
3. Confirm cluster cards render with LLM labels.
4. Click a word; drawer opens; context populates instantly; briefing streams visibly; trajectory and neighbourhood render.
5. Copy URL, open in new tab — same view loads.
6. Server log: `cache_read_input_tokens > 0` on second view of same concept (prompt cache hit).

---

## Risks & open questions

**A. Streaming protocol.** Spec §6.7 shows plain-text `reader.read()` but the response also needs JSON sidecar (concept/trajectory/neighbourhood). This plan uses SSE to carry both cleanly. Semantics unchanged; the spec should be amended to reflect SSE.

**B. Neighbourhood click target.** Spec §6.6 clicks use `n.term`; terms aren't guaranteed globally unique. Spec §5.7 step 3 SELECT extended to include `c2.concept_id AS concept_id`; frontend navigates by ID.

**C. `term` column collision.** `concepts.term` vs `occurrences.term` (period). Always alias in trajectory SQL: `term AS term_period`. Preserve in frontend types.

**D. `is_introduction` int→bool coercion.** DB stores INTEGER 0/1; API boundary emits boolean; frontend types declare boolean.

**E. Missing enrichment fields.** Not every `approved` concept has etymology/word_family populated. Prompt builder handles null gracefully: `(not recorded)` for etymology; omit the word-family line entirely when null/empty — otherwise `None` pollutes the cached stable-knowledge block.

**F. Louvain determinism on data changes.** `seed=42` makes a given graph reproducible, but adding/removing one edge can reshuffle. Cluster-label cache will miss when data changes — acceptable at Haiku pricing.

**G. Cost envelope.** Per chapter view: ~5 Haiku label calls (cached on repeat) ≈ $0.0001. Per word view: 1 Opus 4.7 call with ~600 cached input tokens + ~400 output ≈ $0.03–0.05 uncached, much less on cache hit. A teacher prep session of ~30 word views ≈ sub-dollar. Acceptable for teacher-facing; revisit if pupil-facing.

**H. Auth.** No auth layer exists. The rate-limiting shim is a belt-and-braces for the current localhost + Tailscale exposure; real auth is a separate project.

**I. Drawer body-scroll on mobile.** Known; acceptable for PoC.

**J. `conftest.py` extension.** Existing test schema pre-dates Phase 2 enrichment and `co_occurrences`. T15 is the only place this friction appears — flagged separately so it isn't forgotten.

**K. Anthropic-SDK concurrency.** Use `AsyncAnthropic` for parallel cluster labelling (`asyncio.gather`). The streaming endpoint uses the sync `Anthropic` client inside a generator — FastAPI's `StreamingResponse` handles sync generators fine.

**L. Spec amendment.** Items A, B and the SSE response shape in §4.3 should be reflected back into `docs/vocabulary-explorer-tool.md` so the two documents stay coherent.

---

## Verification

After all tasks land:

- `pytest tests/test_vocabulary.py` passes (unit + endpoint tests).
- `npm test` passes (component + `streamWordDetail` tests).
- Manual smoke (above) passes end-to-end.
- `curl -N http://localhost:8000/api/vocabulary/word-detail?concept_id=12&unit=The%20Roman%20Empire&chapter=The%20rise%20of%20Rome` prints `event: context` then `event: token` frames then `event: done` in real time.
