# OWL Knowledge Map — Improvement Plan (Opus)

_Date: 2026-03-28_

---

## Preamble: who is this for?

This is a tool for showing to Christine Counsell, Steve Mastin, and teachers. It needs to look like the work of people who take the curriculum seriously — not a prototype dashboard hastily assembled from Tailwind defaults. The house identity is **Source Sans Pro** and two brand colours: **purple `#865595`** and **green `#699940`**. Nothing in the current UI reflects this.

---

## Area 1 — Visual Design

### 1.1 The app has no typographic identity (Critical)

**What's wrong:** The entire app uses Tailwind's default sans-serif stack (Inter/system-ui). The house font is Source Sans Pro. The PLAN.md specifically says _"use a clean serif font (e.g. Georgia or a web serif) for the context text to signal that this is curriculum content, not interface chrome"_ — and the codebase does use `font-serif` in OccurrenceCard and ConceptDetail, but that falls through to the browser default (Times New Roman on most systems). The result is two anonymous system fonts with no connection to the OWL brand.

**Fix:**
1. Add `Source Sans Pro` (400, 600, 700) via Google Fonts `<link>` in `index.html`. Set it as the Tailwind `fontFamily.sans` in `tailwind.config.js`.
2. Add a specific editorial serif — **Source Serif Pro** (its natural companion) or **Literata** — as `fontFamily.serif` in the Tailwind config. This replaces the browser's default serif for all `font-serif` usage (`term_in_context` paragraphs).
3. The result: all UI chrome is Source Sans Pro (matching OWL print materials), all curriculum quotations are a deliberate editorial serif.

This single change transforms the app from "generic React dashboard" to "this was designed by someone".

---

### 1.2 Three separate, contradictory colour systems for subjects (Critical)

**What's wrong:** There are _three_ divergent subject colour mappings, not two:

| File | History | Geography | Religion |
|---|---|---|---|
| `src/lib/colours.ts` `SUBJECT_COLOURS` | `#3B82F6` (blue) | `#22C55E` (green) | `#EF4444` (red) |
| `src/lib/graphUtils.ts` `SUBJECT_COLOURS` | `#6366f1` (indigo) | `#22c55e` (green) | `#f59e0b` (amber) |
| `TimelineView.tsx` `SUBJECT_COLOURS` | amber | teal | rose |

Sonnet's plan identified the first and third. It missed `graphUtils.ts:48–50`, which means the 3D graph uses *a third palette*. This is the most disorienting inconsistency in the app — the same concept changes colour depending on which page you're looking at.

Additionally, none of these use the house colours (`#865595` purple, `#699940` green).

**Fix:** Define the canonical subject palette once in `src/lib/colours.ts`, keyed on both API forms (`History` / `Geography` / `Religion`) and DB forms (`history` / `geography` / `rw`). Export hex, Tailwind bg classes, Tailwind chip classes, and header classes from that single source. Delete the duplicates in `graphUtils.ts` and `TimelineView.tsx`. The palette itself should incorporate the house green (`#699940`) for Geography and use the house purple (`#865595`) as the sidebar/brand accent — not necessarily as a subject colour, but as the identity anchor.

Proposed unified palette:
- **History:** `#3B82F6` (blue) — established in the PLAN.md and intuitive
- **Geography:** `#699940` (house green) — aligns with the brand
- **Religion:** `#D97706` (warm amber) — distinct from both, warm, legible on light backgrounds

---

### 1.3 Sidebar brand treatment (High)

**What's wrong:** The sidebar is `bg-slate-900` with system-font text. The brand name "OWL Knowledge Map" has no visual distinction — no logo, no house colour, no typographic weight. The nav icons are Unicode box-drawing characters (▤, ◎, ⊞, ◈, ≡) that render inconsistently across platforms and look like placeholder code.

**Fix:**
1. Paint the sidebar `bg-[#865595]` (house purple) instead of slate-900, or use it for the brand header block. This immediately gives the app its own visual identity rather than looking like every Tailwind sidebar template.
2. Replace Unicode nav icons with Lucide or Heroicons (Lucide is smaller and already widely used with Tailwind). Specific icons: `layout-dashboard`, `share-2` (graph), `calendar-range` (timeline), `bookmark` (concepts), `search` (browse).
3. Set the sidebar type to Source Sans Pro 600 (semi-bold).

---

### 1.4 Page header pattern is inconsistent (Medium)

**What's wrong:**
- Dashboard: `text-2xl font-bold text-slate-900 mb-1` + subtitle `mb-8`
- Browser, Concepts: `text-2xl font-bold text-slate-900 mb-1` + subtitle `mb-6`
- Timeline: `text-xl font-bold text-slate-800` (smaller, different shade, no subtitle)
- ConceptDetail: `text-3xl font-bold text-slate-900 mb-2`
- GraphView: no page heading at all

**Fix:** Create a standard page header pattern. Every page (except GraphView, which is full-bleed) gets:
```
<h1 className="text-2xl font-bold text-slate-900 mb-1">{title}</h1>
<p className="text-sm text-slate-500 mb-6">{subtitle}</p>
```
This is a 5-minute find-and-replace, not an abstraction. Don't extract a `PageHeader` component — just make them consistent.

---

### 1.5 Card and surface hierarchy is flat (Medium)

**What's wrong:** Every card uses the same treatment: `bg-white rounded-xl border border-slate-100 shadow-sm`. This is fine for any individual card. The problem is when *everything* has the same depth — stat cards, chart panels, occurrence cards, the filter bar, the edge cards, the concept table wrapper. Nothing stands out because nothing recedes. The visual hierarchy is monotone.

The OccurrenceCard border (`border-slate-100`) is nearly invisible. The ConceptDetail OccurrenceTimelineCard *does* have a coloured top border — a good pattern that the Browse page's OccurrenceCard lacks.

**Fix:**
1. Add a 3px coloured left border to OccurrenceCards in the Browse grid (subject colour). This is the single biggest bang-for-buck change in Browse — it gives instant subject scanning.
2. Make the filter bar recede: `bg-slate-50` background instead of white, `border-slate-200` border. This pushes filters into the background and lets the results grid be the visual foreground.
3. Dashboard stat cards: add a coloured left border or top accent bar (3px) using the house purple or a per-metric colour. Currently all four are identical white rectangles.

---

### 1.6 GraphView sidebar uses inline styles, not Tailwind (Low)

**What's wrong:** `GraphView.tsx` has ~180 lines of inline `style={{...}}` objects (the filter panel, selected node panel, stats badge, semantic legend). Every other page uses Tailwind classes. This is a maintenance and consistency issue — you can't search for Tailwind classes to find where a colour is used.

**Fix:** Convert the GraphView panels to Tailwind. This doesn't change behaviour — it's a cleanup for consistency. The dark-on-dark palette (`bg-slate-900/95`, `border-slate-700`, etc.) already has Tailwind equivalents. Low priority but worth noting.

---

### 1.7 Dashboard density chart is hand-rolled HTML (Low)

**What's wrong:** "Vocabulary Density by Unit" is a custom HTML bar chart. Narrow bars clip the white number text inside them. No axis, no scale, no tooltip. The two charts above it use Recharts — this one should too.

**Fix:** Replace with a horizontal `<BarChart>` from Recharts. This is already in the dependency tree.

---

## Area 2 — Browse / Search / Filter UX

### 2.1 Filter state is invisible and hard to reset (High)

**What's wrong:** Two related problems:
1. When filters are applied, there's no summary of what's active. The user has to inspect each dropdown individually.
2. There's no "clear all" action. Resetting three dropdowns + clearing the search input is tedious.

**Fix:** Add an "active filter chips" bar between the filter row and the results grid. Each active filter renders as a small pill badge (`History ×`, `Year 4 ×`). Clicking × removes that filter. If *any* filter is active, show a "Clear all" link at the end. This is a standard search-UI pattern and the implementation is ~40 lines.

---

### 2.2 Pagination only offers Previous / Next (High)

**What's wrong:** With ~3,000 occurrences and PAGE_SIZE=20, that's 148 pages. Previous/Next is the only navigation. Reaching page 80 requires 79 clicks. This is present in both Browser and Concepts pages.

**Fix:** Build a simple numbered paginator component (reuse across both pages):
- Show: `[1] … [n-1] [n] [n+1] … [last]` with ellipsis gaps
- First/last always visible
- ±1 window around current page
- Keep Previous/Next as arrow buttons on the ends

This is a standard component, ~60 lines. No library needed.

---

### 2.3 No way to get from Concept Detail back to the Timeline (Medium)

**What's wrong:** The `ConceptDetail` page shows a concept's full trajectory — but only as a vertical card list. There's no link to the Timeline matrix, which would show *where that concept sits relative to every other concept taught in the same term*. The Timeline has a search box that could accept a pre-filled term, but there's no route from the detail page to it.

**Fix:**
1. On ConceptDetail, add a "View in timeline" button that links to `/timeline?search={concept.term}`.
2. In TimelineView, read `search` from the URL search params on mount and seed the input.
3. This creates a natural loop: Browse → Concept Detail → Timeline → (click chip) → Concept Detail.

---

### 2.4 Concepts page has hardcoded subject options (Medium)

**What's wrong:** `Concepts.tsx:66–69` has three hardcoded `<option>` elements. `Browser.tsx` correctly uses `fetchFilters()` to populate them dynamically. If the data changes, Browser adapts; Concepts breaks silently.

**Fix:** Call `fetchFilters()` in Concepts, same as Browser. Five lines.

---

### 2.5 Search placeholder text is ambiguous (Low)

**What's wrong:** Both search boxes say "Search term…" — but "term" is also the name of the primary data entity. A teacher might read this as "type in the name of a school term."

**Fix:**
- Browser: `"Search by concept or keyword…"`
- Concepts: `"Filter by name…"`
- Timeline: `"Highlight a concept…"` (this one is already better than the others — `"Search concepts…"` — but could be more descriptive)

---

### 2.6 Empty and zero-result states are bare (Low)

**What's wrong:** "No results found" is plain grey text. No suggestion for what to do next. "No cross-subject terms found" on the Dashboard is similarly bare.

**Fix:** Add a one-line suggestion: _"Try broadening your search or removing a filter."_ This is one `<p>` tag per empty state.

---

### 2.7 Concepts table has no sortable columns (Low)

**What's wrong:** The table shows Term, Subjects, Years, and Occurrences as static column headers. There's no way to sort alphabetically or by occurrence count. The default order is implicit (server-determined).

**Fix:** Add click-to-sort on Term (alpha) and Occurrences (count). 50 rows per page is small enough for client-side sort — no API change needed. Add a small ▲/▼ chevron to the active sort column header.

---

## Area 3 — Timeline Jitter Fix

### Root cause diagnosis

I read `TimelineView.tsx` line by line. The jitter has **four distinct causes**, listed in order of severity:

---

### 3.1 `unitMap` and `conceptUnitMap` are recomputed on every render — and the `useCallback` is consequently never stable (Primary)

**Location:** `TimelineView.tsx:54–68`

```typescript
// Runs on EVERY render — not memoized
const unitMap = new Map<string, Unit>()
for (const u of units) unitMap.set(u.key, u)

const conceptUnitMap = new Map<number, string[]>()
for (const u of units) {
  for (const c of u.concepts) { ... }
}

// conceptUnitMap is a new Map every render, so this callback
// is recreated on every render despite useCallback:
const handleConceptHover = useCallback((conceptId: number | null) => {
  setHoveredConceptId(conceptId)
  setHoveredUnitKeys(conceptId ? new Set(conceptUnitMap.get(conceptId) ?? []) : new Set())
}, [conceptUnitMap])  // ← always a new ref → always a new callback
```

**Impact:** Every chip in the matrix receives a new `onMouseEnter` / `onMouseLeave` function prop every render. React doesn't short-circuit prop diffing for function references, so every `<span>` in the table is re-rendered on every hover event. With ~200+ chips, this is a significant DOM churn.

**Fix:**
```typescript
const unitMap = useMemo(() => {
  const m = new Map<string, Unit>()
  for (const u of units) m.set(u.key, u)
  return m
}, [units])

const conceptUnitMap = useMemo(() => {
  const m = new Map<number, string[]>()
  for (const u of units) {
    for (const c of u.concepts) {
      if (!m.has(c.id)) m.set(c.id, [])
      m.get(c.id)!.push(u.key)
    }
  }
  return m
}, [units])
```

Now `handleConceptHover`'s `useCallback` has a stable dependency and is only recreated when `units` changes (once, on load).

---

### 3.2 The hover status bar mounts and unmounts, causing a 20px layout shift (Primary)

**Location:** `TimelineView.tsx:100–106`

```typescript
{hoveredConceptId !== null && (
  <div className="mb-2 text-xs text-slate-500">
    Highlighting <strong>...</strong> — appears in N units
  </div>
)}
```

When `hoveredConceptId` changes from null to a value, this `<div>` mounts into the DOM, pushing the table down by its full height (~20px including `mb-2`). When hover ends, it unmounts and the table jumps back up. On rapid mouse movement over chips, this oscillates visibly.

**Fix:** Always render the div. When `hoveredConceptId` is null, render it with `invisible` (Tailwind `visibility: hidden`) to reserve the space:

```typescript
<div className={`mb-2 text-xs text-slate-500 h-5 ${hoveredConceptId === null ? 'invisible' : ''}`}>
  {hoveredConceptId !== null && (
    <>Highlighting <strong>...</strong> — appears in N units</>
  )}
</div>
```

Fixed height (`h-5`) guarantees no layout shift. `invisible` keeps the box in flow but hides the text.

---

### 3.3 Search filtering removes chips from the DOM, causing cell height reflow (Secondary)

**Location:** `TimelineView.tsx:173–174`

```typescript
{unit.concepts
  .filter(c => !searchLower || conceptMatchesSearch(c))
  .map(c => <span ...>{c.name}</span>)}
```

When the user types, non-matching chips are filtered out of the array and removed from the DOM entirely. The `flex flex-wrap gap-0.5` container shrinks. If that cell was the tallest in its row, the whole row height changes. Multiple rows change simultaneously on each keystroke.

**Fix (two-part):**
1. Instead of removing non-matching chips, keep them in the DOM but make them invisible: `opacity-0 h-0 overflow-hidden` (or `hidden` if you prefer). This preserves the cell's height during search. Matching chips remain fully visible; non-matching ones collapse vertically without removing their width contribution.

   Actually, the simpler fix: set a `min-h-[3rem]` on the chip container `<div>`. This doesn't preserve exact heights but prevents cells from collapsing entirely. The remaining height variation is small enough not to jitter.

2. Add `transition-opacity duration-150` to the `<td>` elements so the `opacity-25` dimming effect on non-matching cells animates smoothly rather than snapping.

---

### 3.4 Hover ring border has no transition (Minor)

**Location:** `TimelineView.tsx:162`

```typescript
${isHighlighted ? 'ring-2 ring-inset ring-blue-400' : ''}
```

The ring appears and disappears instantly across multiple cells simultaneously. Combined with the re-render cost of 3.1, this produces a visible flash.

**Fix:** Add `transition-all duration-100` to the `<td>` className. Tailwind's `ring` is a box-shadow, which transitions smoothly.

---

## Area 4 — Review of Sonnet's Plan

### What Sonnet got right

1. **Timeline jitter root causes:** Sonnet correctly identified the unmemoized maps (3.1), the status bar mount/unmount (3.4), the search chip removal (3.2), and the ring transition (3.3). The diagnosis was accurate and the proposed fixes are sound.

2. **The `useDeferredValue` suggestion** for search is a good React 18 technique. I'd keep it as a P1 follow-up after the memoization fix — memoizing the maps is the primary fix, and `useDeferredValue` is a further refinement.

3. **Browse UX items:** The filter chips idea (2.2), clear filters button (2.1), pagination improvement (2.3), hardcoded subject options (2.4), sortable columns (2.5), and ambiguous placeholders (2.7) are all correct and well-articulated.

4. **Prioritisation structure:** P0 for jitter, P1 for colour and core UX, P2 for secondary UX, P3 for polish — this sequencing is right.

### What Sonnet missed or got wrong

1. **The third colour system in `graphUtils.ts`.** Sonnet identified two conflicting palettes (`colours.ts` vs `TimelineView.tsx`) but missed the third in `graphUtils.ts:48–50`. This means the 3D graph — the centrepiece of the app — also uses a different palette. The unification task is larger than Sonnet estimated.

2. **No mention of the house font (Source Sans Pro).** The user specified this as the house font. Sonnet proposed Heroicons and Tailwind defaults but didn't address typography at all. This is the single highest-impact visual change — it transforms the entire app from "generic" to "branded" in one move.

3. **No mention of the house colours (`#865595`, `#699940`).** The user specified these. Sonnet's colour unification plan would consolidate to one palette, but it would still be a Tailwind default palette, not the client's actual brand colours.

4. **The sidebar brand treatment.** Sonnet suggested replacing Unicode icons with Heroicons (correct) but didn't address the sidebar's visual identity at all — it would remain `bg-slate-900`, the default dark Tailwind sidebar. Using the house purple here is a significant brand improvement that Sonnet didn't consider.

5. **The `font-serif` falling through to Times New Roman.** Sonnet didn't notice that `OccurrenceCard.tsx:61` and `ConceptDetail.tsx:32` use `font-serif` for curriculum text, but no serif font is actually loaded. The browser default (usually Times New Roman) is doing the work. This undermines the PLAN.md's explicit design decision.

6. **GraphView's inline-style inconsistency.** 180+ lines of inline `style={{}}` in GraphView while every other page uses Tailwind. Not a bug, but a maintenance issue Sonnet didn't flag.

7. **The search chip filtering strategy.** Sonnet proposed `min-h-8` on the container, which helps but doesn't fully solve the problem. The more elegant fix is to keep non-matching chips in the DOM at zero opacity, which preserves the exact layout. Or at minimum, set a `min-height` on the `<td>` rather than the chip container, since it's the table row height that jitters.

### What I'd keep from Sonnet's plan

- The `useMemo` fix for maps (3.1) — identical to mine, correct
- The `useDeferredValue` idea as a P1 follow-up (3.2b) — good React 18 technique
- The status bar height reservation (3.4) — identical approach
- The filter chips + clear button (2.1, 2.2) — well-specified
- The pagination improvement (2.3) — correct, needs doing
- The "View in Timeline" cross-link (2.6) — good navigation improvement
- The density chart Recharts migration (1.7) — correct, low priority

### What I'd change from Sonnet's plan

- **Elevate typography to P0.** Adding Source Sans Pro is a ~10-minute task (one `<link>` tag, two lines in `tailwind.config.js`) with the single largest visual impact.
- **Colour unification must include `graphUtils.ts`** — Sonnet's plan would leave the 3D graph on a different palette.
- **Incorporate house colours** into the palette and sidebar rather than sticking with Tailwind defaults.
- **The search chip fix** should preserve DOM presence rather than just adding min-height.

---

## Prioritised Task Order

| # | Task | Depends on | Effort | Impact |
|---|---|---|---|---|
| **P0-1** | Add Source Sans Pro + Source Serif Pro to Tailwind config | — | 10 min | Transforms entire app typography |
| **P0-2** | Memoize `unitMap` + `conceptUnitMap` with `useMemo` | — | 10 min | Eliminates primary jitter source |
| **P0-3** | Fix status bar layout shift (always render, fixed height) | — | 5 min | Eliminates hover bounce |
| **P0-4** | Add `transition-all duration-100` to timeline `<td>` | — | 5 min | Smooth ring + opacity transitions |
| **P0-5** | Add `min-h-[3rem]` to chip containers + `transition-opacity` on cells | — | 10 min | Eliminates search reflow jitter |
| **P1-1** | Unify subject colours: delete duplicates in `graphUtils.ts` + `TimelineView.tsx`, extend `colours.ts` | — | 40 min | Consistent identity across all views |
| **P1-2** | Sidebar: house purple bg + Lucide icons + Source Sans Pro | P0-1 | 30 min | Brand identity |
| **P1-3** | Filter chips + clear button (Browser + Concepts) | — | 45 min | Core browse UX |
| **P1-4** | Numbered pagination component (shared) | — | 40 min | Core browse UX |
| **P1-5** | `useDeferredValue` for timeline search | P0-2 | 10 min | Smoother search rendering |
| **P2-1** | OccurrenceCard coloured left border | P1-1 | 10 min | Subject scanning in Browse |
| **P2-2** | Dashboard stat cards: coloured accent + icon | P1-1 | 20 min | Dashboard visual weight |
| **P2-3** | Normalise page headers across all pages | P0-1 | 15 min | Consistent hierarchy |
| **P2-4** | "View in timeline" link from ConceptDetail | — | 15 min | Navigation loop |
| **P2-5** | Concepts subject filter: use `fetchFilters()` | — | 10 min | Data consistency |
| **P2-6** | Fix search placeholder text (all three pages) | — | 5 min | Clarity |
| **P3-1** | Sortable columns in Concepts table | — | 45 min | Power-user feature |
| **P3-2** | Filter bar visual grouping (labels, bg-slate-50) | P0-1 | 15 min | Filter discoverability |
| **P3-3** | Replace density chart with Recharts | — | 40 min | Chart consistency |
| **P3-4** | Convert GraphView inline styles to Tailwind | P0-1 | 60 min | Maintenance |
| **P3-5** | Empty state messaging | — | 10 min | Polish |

---

## Execution strategy

**Phase 1 (P0 — 40 minutes):** Typography + timeline jitter. These are all tiny diffs that don't interact with each other. Ship as one commit. The app will look noticeably different after this phase — branded type and a stable timeline.

**Phase 2 (P1 — 2.5 hours):** Colour unification + sidebar rebrand + browse UX. The colour unification is the riskiest change (touches 3 files, affects all views) and should be done in a single commit. The browse UX items (filter chips, pagination) are independent of each other.

**Phase 3 (P2/P3 — as time allows):** Card accents, page headers, cross-links, sorting, GraphView cleanup. These are all independent polish tasks. Do them in any order.
