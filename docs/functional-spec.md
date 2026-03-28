# OWL Knowledge Map — Functional Specification

_Derived from `docs/opus-improvement-plan.md` · Last updated: 2026-03-28_

---

## Overview

This document translates the prioritised improvement plan into testable acceptance criteria, listing current behaviour, target behaviour, and the files that must change for each item.

---

## P0 — Critical / Unblock

### P0-1 · Typography system

**Current behaviour:** All text uses Tailwind's default sans-serif stack (Inter / system-ui). Components that use `font-serif` (OccurrenceCard, ConceptDetail) fall through to the browser default — usually Times New Roman. No OWL brand font is loaded.

**Target behaviour:**
- `index.html` loads Source Sans Pro (weights 400, 600, 700) and Source Serif Pro (weights 400, 600) via Google Fonts `<link>`.
- `tailwind.config.js` sets `fontFamily.sans` to `['Source Sans Pro', ...defaultTheme.fontFamily.sans]`.
- `tailwind.config.js` sets `fontFamily.serif` to `['Source Serif Pro', ...defaultTheme.fontFamily.serif]`.
- All UI chrome (nav, headings, labels) renders in Source Sans Pro automatically via the Tailwind default.
- All `font-serif` usage (curriculum quotations in OccurrenceCard, ConceptDetail) renders in Source Serif Pro.

**Acceptance criteria:**
- [ ] `index.html` contains a `<link>` tag for both Source Sans Pro and Source Serif Pro from Google Fonts.
- [ ] `tailwind.config.js` `theme.fontFamily.sans` includes `'Source Sans Pro'` as first entry.
- [ ] `tailwind.config.js` `theme.fontFamily.serif` includes `'Source Serif Pro'` as first entry.
- [ ] No component imports a font directly — all font loading is via `index.html`.

**Files affected:** `index.html`, `tailwind.config.js`

---

### P0-2 · Timeline — memoize `unitMap` and `conceptUnitMap`

**Current behaviour:** `TimelineView.tsx` computes `unitMap` (Map<string, Unit>) and `conceptUnitMap` (Map<number, string[]>) as bare variables inside the component body, re-running on every render. `handleConceptHover` depends on `conceptUnitMap` via `useCallback`, but because `conceptUnitMap` is a new Map object every render, the callback is also recreated every render. Every chip in the matrix receives a new function prop, causing all ~200+ chips to re-render on every hover event.

**Target behaviour:** Both maps are wrapped in `useMemo([units])`. They are recomputed only when `units` changes (once, on data load). `handleConceptHover` is stable between renders.

**Acceptance criteria:**
- [ ] `unitMap` is assigned via `useMemo`.
- [ ] `conceptUnitMap` is assigned via `useMemo`.
- [ ] Both memos have `[units]` as their dependency array.
- [ ] `handleConceptHover` `useCallback` dependency list contains `conceptUnitMap` (which is now stable).
- [ ] No perceptible re-render flash when hovering chips (manual smoke test).

**Files affected:** `src/pages/TimelineView.tsx`

---

### P0-3 · Timeline — fix status bar layout shift

**Current behaviour:** The hover status bar (`"Highlighting X — appears in N units"`) is conditionally mounted: `{hoveredConceptId !== null && <div ...>}`. When hover state changes, the div mounts/unmounts, shifting the table down or up by ~20px. On fast mouse movement this oscillates visibly.

**Target behaviour:** The div is always in the DOM with a fixed height (`h-5`). When `hoveredConceptId` is null the div is `invisible` (CSS `visibility: hidden` — takes space, shows nothing). When a concept is hovered the text renders inside the already-present div.

**Acceptance criteria:**
- [ ] The status bar div is rendered unconditionally (no `&&` guard around the outer div).
- [ ] When `hoveredConceptId === null`, the div has the `invisible` class.
- [ ] The div has a fixed height class (e.g. `h-5`) that does not vary.
- [ ] No layout shift visible when moving the cursor on/off chips (manual smoke test).

**Files affected:** `src/pages/TimelineView.tsx`

---

### P0-4 · Timeline — add transition to `<td>` cells

**Current behaviour:** The highlight ring (`ring-2 ring-inset ring-blue-400`) and opacity dimming (`opacity-25`) on timeline `<td>` cells appear and disappear instantly. Combined with the re-render cost of P0-2, this produces a visible flash across many cells simultaneously.

**Target behaviour:** Each `<td>` in the matrix has `transition-all duration-100` so that ring and opacity changes animate smoothly.

**Acceptance criteria:**
- [ ] The `<td>` className in the matrix includes `transition-all duration-100`.
- [ ] Hover highlight fades in/out over ~100ms (manual smoke test).

**Files affected:** `src/pages/TimelineView.tsx`

---

### P0-5 · Timeline — prevent search reflow jitter

**Current behaviour:** When the user types in the timeline search box, non-matching chips are `.filter()`-ed out of the array and removed from the DOM. The flex container shrinks, and if that cell was the tallest in its row the whole row height changes. Multiple rows reflow simultaneously on each keystroke.

**Target behaviour:** Non-matching chips remain in the DOM but are visually hidden (`opacity-0 pointer-events-none`). Cell heights are preserved. `transition-opacity duration-150` is added to `<td>` cells so the `opacity-25` dimming animates.

**Acceptance criteria:**
- [ ] Non-matching chips are not removed from the DOM when search is active — they are made invisible via CSS.
- [ ] Chip container has a minimum height class (e.g. `min-h-[3rem]`) as a fallback.
- [ ] `<td>` cells include `transition-opacity duration-150`.
- [ ] Typing in the search box does not cause visible row-height jumps (manual smoke test).

**Files affected:** `src/pages/TimelineView.tsx`

---

## P1 — High Priority

### P1-1 · Unified subject colour system

**Current behaviour:** Three divergent colour palettes exist for the three subjects:
- `src/lib/colours.ts` `SUBJECT_COLOURS`: History=blue `#3B82F6`, Geography=green `#22C55E`, Religion=red `#EF4444`
- `src/lib/graphUtils.ts` `SUBJECT_COLOURS`: History=indigo `#6366f1`, Geography=green `#22c55e`, Religion=amber `#f59e0b`
- `TimelineView.tsx` local map: History=amber, Geography=teal, Religion=rose

The same concept appears in different colours on Browse, Timeline, and the 3D graph. None of the palettes use the house colours.

**Target behaviour:** A single source of truth in `src/lib/colours.ts`:
- **History:** `#3B82F6` (blue)
- **Geography:** `#699940` (house green)
- **Religion:** `#D97706` (warm amber)

`SUBJECT_COLOURS` is keyed on both API forms (`History`, `Geography`, `Religion`) and DB forms (`history`, `geography`, `rw`). `SUBJECT_BG` and `SUBJECT_CHIP` Tailwind class exports cover all canonical keys. House colours are exported as named constants (`HOUSE_PURPLE`, `HOUSE_GREEN`). Duplicate declarations in `graphUtils.ts` and `TimelineView.tsx` are deleted and replaced with imports from `colours.ts`.

**Acceptance criteria:**
- [ ] `src/lib/colours.ts` exports `HOUSE_PURPLE = '#865595'` and `HOUSE_GREEN = '#699940'`.
- [ ] `SUBJECT_COLOURS` in `colours.ts` has entries for `History`, `Geography`, `Religion`, `history`, `geography`, `rw`.
- [ ] `SUBJECT_BG` returns a Tailwind class string for all six keys.
- [ ] `SUBJECT_CHIP` returns a Tailwind class string for all six keys.
- [ ] No `SUBJECT_COLOURS` declaration exists in `graphUtils.ts`.
- [ ] No local subject colour map exists in `TimelineView.tsx`.
- [ ] History is blue, Geography is `#699940` green, Religion is `#D97706` amber in all three views.

**Files affected:** `src/lib/colours.ts`, `src/lib/graphUtils.ts`, `src/pages/TimelineView.tsx`

---

### P1-2 · Sidebar brand identity

**Current behaviour:** Sidebar is `bg-slate-900`. Nav icons are Unicode box-drawing characters (▤, ◎, ⊞, ◈, ≡) that render inconsistently. The brand name has no visual weight or house colour.

**Target behaviour:**
1. Sidebar header block uses house purple (`bg-[#865595]`) or the full sidebar is repainted.
2. Unicode icons replaced with Lucide React icons: `LayoutDashboard`, `Share2`, `CalendarRange`, `Bookmark`, `Search`.
3. Sidebar text is Source Sans Pro 600 (semi-bold) — flows from P0-1.

**Acceptance criteria:**
- [ ] Sidebar background or header block uses `#865595` or `bg-[#865595]`.
- [ ] No Unicode box-drawing characters remain as nav icons.
- [ ] All five nav items use a named Lucide icon component.
- [ ] `lucide-react` is listed in `package.json` dependencies.

**Files affected:** `src/components/Layout.tsx`, `package.json`

---

### P1-3 · Active filter chips + clear button

**Current behaviour:** When filters are applied in Browser or Concepts, there is no visible summary of active filters. The user must inspect each dropdown. There is no "clear all" action.

**Target behaviour:** A `<FilterChips>` component renders between the filter row and the results grid. Each active filter shows as a pill: `History ×`. Clicking × removes that filter. A "Clear all" link appears when any filter is active. The component renders nothing when no filters are active.

**Acceptance criteria:**
- [ ] `src/components/FilterChips.tsx` exists.
- [ ] Component renders nothing when `activeFilters` is empty.
- [ ] One chip per active filter, labelled with the filter value.
- [ ] Clicking × on a chip calls the `onRemove` callback with the correct filter key.
- [ ] "Clear all" link is visible when one or more filters are active.
- [ ] Clicking "Clear all" calls the `onClearAll` callback.
- [ ] "Clear all" does not render when no filters are active.
- [ ] `<FilterChips>` is used in both `Browser.tsx` and `Concepts.tsx`.

**Files affected:** `src/components/FilterChips.tsx` (new), `src/pages/Browser.tsx`, `src/pages/Concepts.tsx`

---

### P1-4 · Numbered pagination component

**Current behaviour:** Browser and Concepts pages show only Previous / Next buttons. With ~3,000 occurrences and PAGE_SIZE=20 (~148 pages), navigating beyond the first few pages requires many clicks.

**Target behaviour:** A shared `<Paginator>` component replaces Previous/Next in both pages. It shows: `← [1] … [n-1] [n] [n+1] … [last] →`. First and last pages are always visible. A ±1 window surrounds the current page. Ellipsis (`…`) fills gaps. Previous is disabled on page 0; Next is disabled on the last page. Component does not render when `totalPages ≤ 1`.

**Acceptance criteria:**
- [ ] `src/components/Paginator.tsx` exists.
- [ ] Renders Previous (`←`) and Next (`→`) buttons.
- [ ] Shows page numbers around the current page with ±1 window.
- [ ] Shows ellipsis when the page count exceeds the visible window.
- [ ] Page 1 and the last page are always rendered as numbered buttons.
- [ ] Previous button is disabled (or absent) when on page 0.
- [ ] Next button is disabled (or absent) when on the last page.
- [ ] Clicking a page number calls `onPageChange` with the correct 0-based index.
- [ ] Does not render when `totalPages ≤ 1`.
- [ ] `<Paginator>` replaces Previous/Next in both `Browser.tsx` and `Concepts.tsx`.

**Files affected:** `src/components/Paginator.tsx` (new), `src/pages/Browser.tsx`, `src/pages/Concepts.tsx`

---

### P1-5 · `useDeferredValue` for timeline search

**Current behaviour:** Every keystroke in the timeline search box triggers an immediate re-render that re-filters all chips across all cells. With P0-2 applied, the memoized maps are stable, but the filter pass itself still runs synchronously on each keystroke.

**Target behaviour:** The search query is passed through `useDeferredValue` so that React can defer the expensive filter re-render while the user is still typing. The input remains responsive; the matrix updates are batched.

**Acceptance criteria:**
- [ ] `useDeferredValue` from React 18 is used for the timeline search query.
- [ ] The deferred value (not the raw state) is used for chip filtering and cell opacity calculations.
- [ ] The input field is bound to the raw (non-deferred) state so it updates instantly.

**Files affected:** `src/pages/TimelineView.tsx`

---

## P2 — Medium Priority

### P2-1 · OccurrenceCard coloured left border

**Current behaviour:** Browse page OccurrenceCards have `border-slate-100` — a nearly invisible border. The ConceptDetail `OccurrenceTimelineCard` has a coloured top border, but Browse cards do not.

**Target behaviour:** Each OccurrenceCard in Browse has a 3px coloured left border matching the subject colour (`border-l-4` with subject colour). This enables instant visual subject scanning without reading the badge.

**Acceptance criteria:**
- [ ] OccurrenceCard applies a `border-l-4` class.
- [ ] The left border colour corresponds to the card's subject using `SUBJECT_COLOURS` from `colours.ts`.
- [ ] History cards have a blue left border, Geography cards a green left border, Religion cards an amber left border.

**Files affected:** `src/components/OccurrenceCard.tsx`

---

### P2-2 · Dashboard stat card accents

**Current behaviour:** The four Dashboard stat cards are identical white rectangles with no visual differentiation.

**Target behaviour:** Each stat card has a 3px coloured top or left accent bar. Colours are either house purple/green or per-metric colours. The accent gives each card a distinct identity without changing the layout.

**Acceptance criteria:**
- [ ] Each of the four stat cards has a visible accent bar (top or left border).
- [ ] Accent colours are drawn from `colours.ts` constants (not hardcoded inline).
- [ ] No two stat cards share the same accent colour.

**Files affected:** `src/components/StatCard.tsx`, `src/pages/Dashboard.tsx`

---

### P2-3 · Page header normalisation

**Current behaviour:** Page heading styles are inconsistent:
- Dashboard: `text-2xl font-bold text-slate-900 mb-1` + subtitle `mb-8`
- Browser, Concepts: `text-2xl font-bold text-slate-900 mb-1` + subtitle `mb-6`
- Timeline: `text-xl font-bold text-slate-800` (smaller, different colour, no subtitle)
- ConceptDetail: `text-3xl font-bold text-slate-900 mb-2`
- GraphView: no heading

**Target behaviour:** Every page except GraphView (which is full-bleed) uses:
```html
<h1 className="text-2xl font-bold text-slate-900 mb-1">{title}</h1>
<p className="text-sm text-slate-500 mb-6">{subtitle}</p>
```
No `PageHeader` component is extracted — this is a find-and-replace.

**Acceptance criteria:**
- [ ] Dashboard, Browser, Concepts, Timeline, and ConceptDetail all use `text-2xl font-bold text-slate-900 mb-1` for the `<h1>`.
- [ ] All pages with a subtitle use `text-sm text-slate-500 mb-6` for the subtitle.
- [ ] GraphView is unchanged (it is full-bleed with no page heading).

**Files affected:** `src/pages/Dashboard.tsx`, `src/pages/Browser.tsx`, `src/pages/Concepts.tsx`, `src/pages/TimelineView.tsx`, `src/pages/ConceptDetail.tsx`

---

### P2-4 · "View in Timeline" link from ConceptDetail

**Current behaviour:** ConceptDetail shows a concept's full occurrence trajectory as a vertical card list. There is no link to the Timeline matrix, which would show the concept relative to all other concepts taught in the same term.

**Target behaviour:**
1. ConceptDetail has a "View in timeline" button linking to `/timeline?search={concept.term}`.
2. TimelineView reads the `search` URL param on mount and seeds the search input.

**Acceptance criteria:**
- [ ] ConceptDetail renders a link/button with text "View in timeline".
- [ ] The link navigates to `/timeline?search=<term>` where `<term>` is the URL-encoded concept term.
- [ ] TimelineView reads `?search=` from `useSearchParams` on mount and populates the search input.
- [ ] Typing in the timeline search box after arrival still works normally.

**Files affected:** `src/pages/ConceptDetail.tsx`, `src/pages/TimelineView.tsx`

---

### P2-5 · Concepts subject filter — dynamic options

**Current behaviour:** `Concepts.tsx` has three hardcoded `<option>` elements for subject. `Browser.tsx` correctly uses `fetchFilters()` to populate them dynamically. If the data changes, Browser adapts; Concepts does not.

**Target behaviour:** Concepts calls `fetchFilters()` on mount and populates the subject dropdown from the API response, matching Browser's pattern.

**Acceptance criteria:**
- [ ] `Concepts.tsx` calls `fetchFilters()` on mount.
- [ ] Subject dropdown options are generated from the API response, not hardcoded.
- [ ] No hardcoded `<option value="History">`, `<option value="Geography">`, or `<option value="Religion">` remain in `Concepts.tsx`.

**Files affected:** `src/pages/Concepts.tsx`

---

### P2-6 · Search placeholder text

**Current behaviour:** Browser and Concepts search inputs both say `"Search term…"`. "term" is also the name of the primary data entity, causing ambiguity.

**Target behaviour:**
- Browser: `"Search by concept or keyword…"`
- Concepts: `"Filter by name…"`
- Timeline: `"Highlight a concept…"`

**Acceptance criteria:**
- [ ] Browser search input placeholder is `"Search by concept or keyword…"`.
- [ ] Concepts search input placeholder is `"Filter by name…"`.
- [ ] Timeline search input placeholder is `"Highlight a concept…"`.
- [ ] No input placeholder reads `"Search term…"`.

**Files affected:** `src/pages/Browser.tsx`, `src/pages/Concepts.tsx`, `src/pages/TimelineView.tsx`

---

## P3 — Polish / Low Priority

### P3-1 · Sortable columns in Concepts table

**Current behaviour:** Concepts table has static column headers (Term, Subjects, Years, Occurrences). Sort order is server-determined.

**Target behaviour:** Clicking the "Term" column header sorts alphabetically (asc/desc toggle). Clicking "Occurrences" sorts by count (desc/asc toggle). Active sort column shows a ▲ or ▼ indicator. Sort is client-side (no API change).

**Acceptance criteria:**
- [ ] Term column header is clickable and toggles A→Z / Z→A sort.
- [ ] Occurrences column header is clickable and toggles high→low / low→high sort.
- [ ] Active sort column displays a ▲ or ▼ chevron.
- [ ] Sort state resets to default when the page changes.
- [ ] No API changes required.

**Files affected:** `src/pages/Concepts.tsx`

---

### P3-2 · Filter bar visual grouping

**Current behaviour:** Filter bar is `bg-white` with the same card treatment as result cards, making it appear at the same visual depth.

**Target behaviour:** Filter bar uses `bg-slate-50 border-slate-200` so it recedes visually, making the results grid the foreground. Filter labels (Subject, Year, Term) appear above or beside their controls.

**Acceptance criteria:**
- [ ] Filter bar container has `bg-slate-50` background (not white).
- [ ] Filter bar container border is `border-slate-200`.
- [ ] Visible label is present for each filter control.

**Files affected:** `src/pages/Browser.tsx`, `src/pages/Concepts.tsx`

---

### P3-3 · Dashboard density chart → Recharts

**Current behaviour:** "Vocabulary Density by Unit" is a custom HTML bar chart. Narrow bars clip white number text. No axis, no scale, no tooltip. The two charts above it use Recharts.

**Target behaviour:** Replace the custom chart with a Recharts horizontal `<BarChart>`. Tooltips, axis labels, and consistent styling with the other dashboard charts.

**Acceptance criteria:**
- [ ] The density chart is rendered using Recharts `<BarChart>` with horizontal layout.
- [ ] Chart has a tooltip showing the exact value on hover.
- [ ] Chart has an X-axis with a readable scale.
- [ ] No custom HTML bar chart markup remains in `Dashboard.tsx`.

**Files affected:** `src/pages/Dashboard.tsx`

---

### P3-4 · GraphView inline styles → Tailwind

**Current behaviour:** `GraphView.tsx` contains ~180 lines of inline `style={{...}}` objects for the filter panel, selected node panel, stats badge, and semantic legend. Every other page uses Tailwind.

**Target behaviour:** All inline styles converted to Tailwind utility classes. The dark-on-dark palette (`bg-slate-900/95`, `border-slate-700`, etc.) uses Tailwind equivalents. No `style={{}}` props remain on structural elements.

**Acceptance criteria:**
- [ ] No `style={{ ... }}` prop on any structural element in `GraphView.tsx`.
- [ ] All colours expressed as Tailwind classes.
- [ ] Visual output is identical to before the change.

**Files affected:** `src/pages/GraphView.tsx`

---

### P3-5 · Empty state messaging

**Current behaviour:** Zero-result states display bare grey text: "No results found." No suggestion for next action.

**Target behaviour:** Each empty state includes a one-line suggestion: _"Try broadening your search or removing a filter."_

**Acceptance criteria:**
- [ ] Browser zero-result state includes the suggestion text.
- [ ] Concepts zero-result state includes the suggestion text.
- [ ] Dashboard "No cross-subject terms found" includes the suggestion text.
- [ ] Suggestion text is rendered as a distinct `<p>` element below the primary message.

**Files affected:** `src/pages/Browser.tsx`, `src/pages/Concepts.tsx`, `src/pages/Dashboard.tsx`

---

_End of spec. For task tracking see `tasks/tasks.md`._
