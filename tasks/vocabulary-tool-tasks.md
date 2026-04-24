# Vocabulary Explorer Tool — Task List

> Companion to `docs/vocabulary-tool-plan.md` and the design spec `docs/vocabulary-explorer-tool.md`.

Each task is self-contained and should fit in one sitting. Order matters — later tasks depend on earlier ones. `T01` (deps) and `T15` (tests) are required before merge.

| Status legend |
|---|
| `TODO` — not started |
| `IN PROGRESS` — in flight |
| `DONE` — complete |
| `BLOCKED` — awaiting something (add note) |

---

## T01 — Dependencies & environment
**Status:** TODO
**Effort:** 15 min
**Depends on:** —

Append to `requirements.txt`:
```
anthropic>=0.70.0
networkx>=3.4
```
Then `pip install -r requirements.txt`. Ensure `ANTHROPIC_API_KEY` is in the environment (add to `start_api.sh` via `export` or a `.env` loader). Verify `from networkx.algorithms.community import louvain_communities` works at the Python REPL.

**Acceptance:** `python -c "import anthropic, networkx; from networkx.algorithms.community import louvain_communities; print('ok')"` prints `ok` and `echo $ANTHROPIC_API_KEY` is non-empty.

---

## T02 — Backend scaffold
**Status:** TODO
**Effort:** 20 min
**Depends on:** T01

- Create `api/routes/vocabulary.py` with `router = APIRouter()` and a stub `@router.get("/navigation")` returning `{"subjects": [], "hierarchy": {}}`.
- Register in `api/main.py`: import and `app.include_router(vocabulary.router, prefix="/api/vocabulary", tags=["vocabulary"])`.

**Acceptance:** `curl http://localhost:8000/api/vocabulary/navigation` returns `{"subjects":[],"hierarchy":{}}` with 200.

---

## T03 — Navigation endpoint (real)
**Status:** TODO
**Effort:** 45 min
**Depends on:** T02

Implement the single-query hierarchy assembly per plan §"Endpoint 1". Wrap in `@lru_cache(maxsize=1)` over a JSON-string helper. Add `POST /api/vocabulary/navigation/invalidate` that calls `_load_navigation.cache_clear()`.

**Acceptance:** Response contains all three subjects, nested years → units → chapters, with only `enrichment_status='approved'` concepts contributing. Second call is measurably faster than the first.

---

## T04 — Chapter-clusters endpoint (no LLM)
**Status:** TODO
**Effort:** 90 min
**Depends on:** T03

Implement spec §5.1/5.2/5.3/5.4/5.5 per plan §"Endpoint 2" steps 1–5. Use a placeholder label `f"{centre_term} cluster"` with `label_generated: false`. Full response shape. Empty chapter returns `{unit, chapter, clusters: []}` with 200. Coerce `any_introduction == 1` to `bool` at the API boundary.

**Acceptance:** `curl "http://localhost:8000/api/vocabulary/chapter-clusters?unit=...&chapter=..."` for a known chapter returns well-formed clusters with a centre_concept, is_bridge flags, and the chapter's full concept set. Running twice gives identical cluster membership (Louvain `seed=42`).

---

## T05 — Cluster labelling
**Status:** TODO
**Effort:** 60 min
**Depends on:** T04

- Implement `_cluster_label_cached` (sync wrapper over `AsyncAnthropic` Haiku call).
- Parallelise the N calls with `asyncio.gather`.
- Cache key: `sha1(f"{unit}|{chapter}|{','.join(map(str, sorted(cluster_ids)))}")`.
- Fallback on LLM failure / missing API key: `f"{centre_term} & related"`, `label_generated: false`. Log the failure; never fail the endpoint.
- Singletons use `centre_term.title()` with `label_generated: false`.

**Acceptance:** First call to a chapter takes ≲1 s for label generation; second call is near-instant (cache hit). Labels are 2–4 words. Forcing an Anthropic error (bad key) still returns clusters with fallback labels.

---

## T06 — Word-detail context (non-streaming)
**Status:** TODO
**Effort:** 60 min
**Depends on:** T04

Implement `_get_word_detail_context` — the four SQL queries in spec §5.7. Expose a temporary `GET /api/vocabulary/word-detail-context?concept_id=&unit=` that returns the dict as plain JSON. Validates SQL before streaming complexity. **Remove this route once T07 lands.**

Extend neighbourhood SELECT to include `c2.concept_id AS concept_id`.

**Acceptance:** Response matches the JSON sidecar shape in the plan. Null etymology/definition render as `null` in JSON (frontend later handles display). `enrichment_status='pending'` concepts yield 404.

---

## T07 — Word-detail streaming endpoint
**Status:** TODO
**Effort:** 2 hrs
**Depends on:** T06

Replace the temporary context route with `GET /api/vocabulary/word-detail` returning `StreamingResponse(media_type="text/event-stream")`.

- `_sse(event, data)` helper: `f"event: {event}\ndata: {json.dumps(data)}\n\n"`.
- Close DB connection before opening Anthropic stream.
- Frame order: one `context` → N `token` → one `done`. On error: `error` then `done`.
- Anthropic call: Opus 4.7, `max_tokens=400`, with `cache_control: ephemeral` on the system prompt and on the stable-knowledge user block. **`current_unit` must live in the volatile block**, never the cached block.
- Prompt builder: render `(not recorded)` for null etymology/definition; omit word-family line when null/empty.
- `MAX_LLM_CALLS_PER_MINUTE` env var (default 60) — in-process counter, 429 when exceeded.

**Acceptance:** `curl -N` shows `event: context` first, then `event: token` frames in real time, then `event: done` with usage counts. Second call for the same concept shows `cache_read_input_tokens > 0` in the `done` frame. Invalid `concept_id` returns 404 with no streaming.

---

## T08 — Frontend route & nav
**Status:** TODO
**Effort:** 20 min
**Depends on:** —

- `src/App.tsx`: import `VocabularyView` and add `<Route path="/vocabulary" element={<VocabularyView />} />`.
- `src/components/Layout.tsx`: import `Sparkles` from `lucide-react` (line 2), append `{ to: '/vocabulary', label: 'Vocabulary', Icon: Sparkles }` to `NAV`.
- Stub `src/pages/VocabularyView.tsx` with a placeholder heading.

**Acceptance:** `/vocabulary` renders the placeholder with the Layout chrome and the "Vocabulary" nav link is active.

---

## T09 — ChapterSelector + URL state
**Status:** TODO
**Effort:** 90 min
**Depends on:** T03, T08

- Add `fetchVocabNavigation()` + `NavigationResponse` type to `src/lib/api.ts`.
- Implement `src/components/vocabulary/ChapterSelector.tsx` as a fully controlled component.
- Wire `useSearchParams` in `VocabularyView` per the plan's URL-state pattern: read `subject/year/unit/chapter/conceptId`; writing an upstream key clears downstream keys.
- Cascading filters: subject drives years, year drives units, unit drives chapters.

**Acceptance:** Selecting subject populates year dropdown; changing subject resets year/unit/chapter; URL reflects selections; refreshing the page preserves them.

---

## T10 — Cluster cards
**Status:** TODO
**Effort:** 2 hrs
**Depends on:** T04, T09

- Add `fetchChapterClusters` + `Cluster`, `ClusterConcept`, `ChapterClustersResponse` types to `src/lib/api.ts`.
- Implement `ClusterCardsView`, `ClusterCard`, `WordChip`, `BridgeCallout` per the plan's file table and styling palette.
- On chapter change, fetch clusters and render grid. Loading skeleton + empty state.
- Clicking a word sets `conceptId` param (for now, console.log — drawer lands in T11).

**Acceptance:** Pick a known chapter → 3–7 cards render with labels, centre-node highlighted, bridge icons where appropriate, intro indicator on new concepts. Clicking a chip updates the URL.

---

## T11 — WordDetailPanel shell
**Status:** TODO
**Effort:** 90 min
**Depends on:** T10

- Implement `src/components/vocabulary/WordDetailPanel.tsx` as a slide-in drawer (inline Tailwind transform/transition — no separate primitive).
- Open/close driven by `conceptId` param in URL; close via Esc key, backdrop click (mobile), close button.
- Focus management: on open, focus close button; on close, restore previous active element.
- Placeholder body ("Loading...").

**Acceptance:** Clicking a word slides in the panel; Esc and close button dismiss; URL updates to drop `conceptId`; focus returns to the word chip.

---

## T12 — Streaming consumer + TeacherBriefing
**Status:** TODO
**Effort:** 2 hrs
**Depends on:** T07, T11

- Add `streamWordDetail(conceptId, unit, chapter, cb)` + `WordDetailStreamCallbacks` to `src/lib/api.ts`. Use `response.body.getReader()` + `TextDecoder` + `\n\n`-delimited SSE frame parser.
- Wire into `WordDetailPanel`: on `conceptId` change, start the stream; on close or `conceptId` change, abort via `AbortController`.
- Implement `src/components/vocabulary/TeacherBriefing.tsx`: renders streamed text, blinking cursor while `status !== 'done'`, copy-to-clipboard button, error/retry state.

**Acceptance:** Open a word → `context` frame populates immediately → briefing text appears a token at a time → cursor disappears on `done`. Closing the drawer mid-stream cancels the fetch. Copy button copies the full briefing.

---

## T13 — NeighbourhoodCloud + TrajectoryTimeline
**Status:** TODO
**Effort:** 90 min
**Depends on:** T12

- Implement `src/components/vocabulary/NeighbourhoodCloud.tsx`: size-by-weight chips, cross-subject chips in owl-green, clicks navigate by `concept_id` (sets URL param).
- Implement `src/components/vocabulary/TrajectoryTimeline.tsx`: ordered list of year/term · unit/chapter · INTRO/RECUR badge. Reuse badge classes from `src/components/OccurrenceCard.tsx:28`.

**Acceptance:** Panel shows 10 chips sized by weight, cross-subject ones clearly distinct. Trajectory shows every occurrence with the correct intro/recur label. Clicking a neighbourhood chip re-opens the drawer for the new concept with a fresh stream.

---

## T14 — Polish
**Status:** TODO
**Effort:** 90 min
**Depends on:** T13

- Loading skeletons for cluster cards and drawer body.
- Error states with retry for navigation, cluster, and streaming failures.
- `AbortController` cancellation on drawer close already in T12 — verify.
- Explicit empty-state message for chapters with no approved concepts.
- Keyboard focus outline visible on all interactive elements.
- Verify no new colour tokens were introduced.

**Acceptance:** Disconnect network → every view degrades to a retry button, not a blank screen. Keyboard-only user can navigate subject → year → unit → chapter → word → close without a mouse.

---

## T15 — Tests
**Status:** TODO
**Effort:** 3 hrs
**Depends on:** T07, T13

**Backend:** Extend `tests/conftest.py:22-60`:
- Add `tier`, `register`, `definition`, `etymology`, `word_family`, `enrichment_status`, `enrichment_notes`, `enriched_at`, `enriched_by` columns to `concepts`.
- Add `co_occurrences` table with spec §2 shape.
- Seed two shared-chapter concepts + one cross-subject co-occurrence + one isolated concept + one `enrichment_status='pending'` concept.
- Append `"api.routes.vocabulary.get_conn"` to `ROUTE_MODULES` at `tests/conftest.py:98`.

Write `tests/test_vocabulary.py` with the 5 unit tests + 6 endpoint tests from the plan's Testing section.

**Frontend:** Write the 5 component/api tests from the plan.

**Acceptance:** `pytest tests/test_vocabulary.py -v` all pass; `npm test -- vocabulary` all pass; existing 48 tests still green.

---

## T16 — Docs & smoke test
**Status:** TODO
**Effort:** 30 min
**Depends on:** T15

- Update `README.md` with a "Vocabulary Explorer Tool" section documenting the `ANTHROPIC_API_KEY` setup and the `MAX_LLM_CALLS_PER_MINUTE` env var.
- PR description includes the E2E smoke script from the plan.
- Amend `docs/vocabulary-explorer-tool.md` to reflect the SSE protocol decision (resolves the §6.7 ambiguity) and the neighbourhood `concept_id` addition in §5.7.

**Acceptance:** Fresh clone → install deps → export API key → run smoke script → ticks every box.
