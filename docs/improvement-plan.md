# OWL Knowledge Map — Improvement Plan

_Date: 2026-03-28_

## Overview

The app has a solid foundation: good TypeScript coverage, clean component structure, and sensible data flow. The gaps are mostly visual consistency, discoverability in the browse views, and two specific rendering bugs in the timeline. This plan is sequenced so fixes build on each other.

---

## Area 1 — Visual Design

### 1.1 Subject colour inconsistency (Critical)

**What's wrong:** There are two separate, conflicting colour systems for subjects.

- `src/lib/colours.ts` uses **blue / green / red** (hex) for History / Geography / Religion
- `TimelineView.tsx` defines its own local `SUBJECT_COLOURS` using **amber / teal / rose** (Tailwind classes)

The result: History is amber-gold in the timeline but blue everywhere else. The `rw` key is used in the timeline but `Religion` (capitalised, full word) is used in the global colours file. These diverged silently.

**Fix:** Delete the local `SUBJECT_COLOURS` block in `TimelineView.tsx`. Extend `src/lib/colours.ts` to export a Tailwind-class map keyed on both `rw` / `history` / `geography` (lowercase DB keys) *and* `History` / `Geography` / `Religion` (API-display keys). Single source of truth, one palette throughout.

---

### 1.2 Sidebar navigation icons (High)

**What's wrong:** Nav icons are ambiguous Unicode box-drawing characters (▤, ◎, ⊞, ◈, ≡). They are not universally recognisable and render inconsistently across OSes.

**Fix:** Replace with named SVG icons from Heroicons. Suggested mapping:
- Dashboard → `squares-2x2`
- Graph View → `share` (network nodes)
- Timeline → `calendar-days`
- Concepts → `tag`
- Browse → `magnifying-glass`

---

### 1.3 Page header hierarchy is inconsistent (Medium)

**What's wrong:**
- Dashboard, Browser, Concepts → `text-2xl font-bold text-slate-900`
- Timeline → `text-xl font-bold text-slate-800` (smaller, different colour)
- Dashboard subtitle spacing → `mb-8`; Browser/Concepts → `mb-6`

**Fix:** Establish a single page header pattern: `text-2xl font-bold text-slate-900 mb-1` + `text-sm text-slate-500 mb-6`. Apply to all five pages including Timeline.

---

### 1.4 Stat cards on Dashboard have no visual weight (Medium)

**What's wrong:** All four `StatCard` components are identical in appearance — large number + label with no colour accent. There is no way to distinguish cards at a glance without reading the label.

**Fix:** Pass a `color` prop to `StatCard` and render a 3px left border in that colour (matching the pattern on `OccurrenceCard`). Optionally add a small Heroicons icon to the top-right corner of each card.

---

### 1.5 OccurrenceCard border is nearly invisible (Low)

**What's wrong:** Cards use `border border-slate-100` — a near-white border on a near-white background. The coloured left border used elsewhere is absent from the Browse grid entirely.

**Fix:** Change `border-slate-100` → `border-slate-200` for base border. Add a 3px left border in the subject colour, giving instant subject scanning in the Browse grid.

---

### 1.6 Browser filter bar lacks visual grouping (Low)

**What's wrong:** The four inputs (text search + 3 selects) sit in a plain `flex flex-wrap gap-3` row with no labels. On wide screens the selects float disconnected from the search field.

**Fix:** Add a subtle label above each control (`Search`, `Subject`, `Year`, `Term`) using `<label>` elements. Change filter bar background from white to `bg-slate-50` for distinction from the card grid below.

---

### 1.7 Dashboard density chart has no axis or scale (Low)

**What's wrong:** The "Vocabulary Density by Unit" section is a hand-rolled HTML bar chart. Numbers are rendered as white text inside bars — if a bar is narrow the number overflows or is hidden. There is no X-axis or scale indicator.

**Fix:** Replace the hand-rolled bars with a `<BarChart>` from Recharts (already imported), with a proper Y-axis, tooltip, and consistent styling with the two charts above it.

---

## Area 2 — Browse / Search / Filter UX

### 2.1 No "clear all filters" button (High)

**What's wrong:** Once subject + year + term filters are applied, the user must reset three dropdowns individually. There is no shortcut to return to the unfiltered state.

**Fix:** Show a "Clear filters" button that is only visible when at least one filter is non-empty. Clicking it resets all three dropdowns and page to 0 in a single call.

---

### 2.2 No visual indicator of active filter state (High)

**What's wrong:** When filters are set, nothing in the UI summarises what is active. The result count gives no hint that subject = "History" and year = "Year 4" are reducing it.

**Fix:** Render active filter chips below the filter bar — small dismissible pill badges for each active filter (e.g. `History ×`, `Year 4 ×`). Clicking × removes that individual filter.

---

### 2.3 Pagination is unusable for large result sets (High)

**What's wrong:** With 1000+ occurrences and PAGE_SIZE = 20, there are 50+ pages. The only controls are Previous / Next. Reaching page 40 requires 39 clicks.

**Fix:** Replace with a proper paginator:
- First / Last page buttons
- Numbered page buttons for ±2 pages around current (e.g. `1 … 11 [12] 13 … 58`)
- Or a small "Go to page" `<input type="number">` field as a minimum viable alternative

---

### 2.4 Concepts page subject filter is hardcoded (Medium)

**What's wrong:** `Concepts.tsx` has three hardcoded `<option>` values (`History`, `Geography`, `Religion`) rather than using `fetchFilters()` as `Browser.tsx` does. If a subject is renamed or added in the DB, Browser updates automatically but Concepts breaks silently.

**Fix:** Use `fetchFilters()` in `Concepts.tsx` (already imported from `api.ts`), consistent with Browser.

---

### 2.5 Concepts table has no sortable columns (Medium)

**What's wrong:** Column headers (Term, Subjects, Years, Occurrences) are plain static text. Current sort order is implicit. Users who want alphabetical order or to find newest-introduced terms have no mechanism.

**Fix:** Add click-to-sort on Term (alpha asc/desc) and Occurrences (count asc/desc) columns. Store `sortBy` / `sortDir` in local state. With 50 items per page, client-side sort is sufficient — no API changes needed.

---

### 2.6 No route from OccurrenceCard back to Timeline context (Medium)

**What's wrong:** Clicking an `OccurrenceCard` navigates to `/concepts/{id}`. There is no way to jump to the Timeline to see the concept in the curriculum matrix.

**Fix:** On `ConceptDetail`, add a "View in Timeline" button that navigates to `/timeline?search={term}`. The Timeline search box should read the `search` URL param on mount and pre-fill the input.

---

### 2.7 Search placeholder text is ambiguous (Low)

**What's wrong:** Both Browser and Concepts search boxes say "Search term…" — ambiguous because the primary data entity is also called a *term*.

**Fix:**
- Browser → `"Search occurrences…"`
- Concepts → `"Filter concepts…"`

---

### 2.8 Empty state is text-only (Low)

**What's wrong:** "No results found" is plain `text-slate-400` centered text with no suggestion.

**Fix:** Add a suggestion line: _"Try removing a filter or broadening your search."_

---

## Area 3 — Timeline Jitter Fix

### Root cause analysis

Three distinct causes of visual instability, each with a different remedy.

---

### 3.1 `unitMap` and `conceptUnitMap` rebuilt on every render (Primary bug)

**Location:** `TimelineView.tsx:54–63`

```typescript
// These run on EVERY render — hover, search keystroke, anything
const unitMap = new Map<string, Unit>()
for (const u of units) unitMap.set(u.key, u)

const conceptUnitMap = new Map<number, string[]>()
for (const u of units) { ... }
```

Neither map is memoized. Every render (hover event, search keystroke) rebuilds both maps from scratch. More critically, `conceptUnitMap` is listed as a `useCallback` dependency:

```typescript
const handleConceptHover = useCallback((conceptId: number | null) => {
  ...
}, [conceptUnitMap])   // ← new Map instance every render → callback is never stable
```

Because `conceptUnitMap` is a new `Map` object on every render, `useCallback` never returns the cached version. Every chip receives a new `onMouseEnter`/`onMouseLeave` function reference each render, causing React to batch-update all chip props simultaneously.

**Fix:** Wrap both maps in `useMemo([units])`. Since `units` only changes once (after initial fetch), the maps are built once and reused. `handleConceptHover` then has a stable dependency and `useCallback` works as intended.

---

### 3.2 Cell heights snap without animation when search filters chips (Primary bug)

**Location:** `TimelineView.tsx:172–189`

```typescript
<div className="flex flex-wrap gap-0.5">
  {unit.concepts
    .filter(c => !searchLower || conceptMatchesSearch(c))  // chips removed instantly
    .map(c => <span ...>{c.name}</span>)}
</div>
```

When the user types, chips are removed from the DOM instantly. The `flex flex-wrap` container shrinks, the `<td>` shrinks, and if no other cell in the row is taller, the row height jumps. On fast typing (every keystroke fires a state update), this causes rapid successive layout shifts visible as vertical jitter.

**Fix (three-part):**
1. Add `transition-opacity duration-150` to `<td>` elements so the `opacity-25` dimming animates rather than snapping
2. Set `min-h-8` (or equivalent) on the chip container `<div>` so cells never fully collapse when all chips are filtered
3. Wrap the search string fed into the filter with React 18's `useDeferredValue` — this defers the expensive chip filtering to a lower-priority render tick, keeping the input responsive while the table catches up

---

### 3.3 Hover ring border appears/disappears as an instant paint (Secondary bug)

**Location:** `TimelineView.tsx:160–164`

```typescript
className={`... ${isHighlighted ? 'ring-2 ring-inset ring-blue-400' : ''} ...`}
```

The `ring-2` class is added/removed via className toggle with no transition. All cells containing the hovered concept update simultaneously, producing a flash.

**Fix:** Add `transition-all duration-100` to the `<td>` className. One class addition.

---

### 3.4 Status bar mounts/unmounts on hover, causing layout shift (Minor bug)

**Location:** `TimelineView.tsx:100–106`

```typescript
{hoveredConceptId !== null && (
  <div className="mb-2 text-xs text-slate-500">
    Highlighting <strong>{name}</strong> — appears in N units
  </div>
)}
```

The status bar mounts and unmounts on every hover-in/hover-out, shifting the table's vertical position by ~20px each time.

**Fix:** Always render the status bar div. When `hoveredConceptId` is null, render it with `visibility: hidden` or `opacity-0` to reserve the space without showing content. No layout shift.

---

## Prioritised Task Order

| Priority | Task | Depends on | Effort |
|---|---|---|---|
| **P0** | 3.1 Memoize `unitMap` and `conceptUnitMap` with `useMemo` | — | 15 min |
| **P0** | 3.4 Reserve status bar space (stop layout shift) | — | 5 min |
| **P0** | 3.3 Add `transition-all duration-100` to `<td>` hover ring | — | 5 min |
| **P0** | 3.2a Add `transition-opacity` + `min-height` to chip container | — | 10 min |
| **P1** | 3.2b `useDeferredValue` for search string | P0 3.1 done first | 10 min |
| **P1** | 1.1 Unify subject colour system (single source of truth) | — | 30 min |
| **P1** | 2.1 + 2.2 Clear filters button + active filter chips | — | 45 min |
| **P1** | 2.3 Pagination — first/last/numbered pages | — | 30 min |
| **P2** | 1.2 Replace sidebar Unicode icons with Heroicons SVGs | — | 30 min |
| **P2** | 1.3 Normalise page header hierarchy across all pages | — | 20 min |
| **P2** | 2.4 Fix Concepts subject filter (use `fetchFilters`) | — | 15 min |
| **P2** | 2.5 Sortable columns in Concepts table | — | 45 min |
| **P2** | 2.7 Fix ambiguous search placeholder text | — | 5 min |
| **P3** | 1.4 StatCard colour accent + icon | 1.1 colour unification | 30 min |
| **P3** | 1.5 OccurrenceCard left border accent | 1.1 colour unification | 10 min |
| **P3** | 1.6 Browser filter bar labels and background | — | 15 min |
| **P3** | 1.7 Replace density chart with Recharts component | — | 45 min |
| **P3** | 2.6 "View in Timeline" link from ConceptDetail | — | 20 min |
| **P3** | 2.8 Improve empty state messaging | — | 10 min |

**Start with P0 timeline jitter fixes** — they are tiny diffs, zero visual regression risk, and have immediate perceptible impact. The colour unification (P1) touches the most files and should land in a single commit to avoid a half-migrated state. Browse UX improvements (P1 clear/active filters + pagination) are self-contained and can follow in any order.
