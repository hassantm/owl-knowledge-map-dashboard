# OWL Knowledge Map — Task List

_Derived from `docs/opus-improvement-plan.md` · Spec: `docs/functional-spec.md` · Last updated: 2026-03-28_

Statuses: `TODO` / `IN PROGRESS` / `DONE`

| ID  | Priority | Task                                                           | Files                                                                   | Effort | Status | Blocked by |
| --- | -------- | -------------------------------------------------------------- | ----------------------------------------------------------------------- | ------ | ------ | ---------- |
| T01 | P0       | Add Source Sans Pro + Source Serif Pro to Tailwind config      | `index.html`, `tailwind.config.js`                                      | 10 min | DONE   | —          |
| T02 | P0       | Memoize `unitMap` + `conceptUnitMap` with `useMemo`            | `src/pages/TimelineView.tsx`                                            | 10 min | DONE   | —          |
| T03 | P0       | Fix status bar layout shift (always render, fixed height)      | `src/pages/TimelineView.tsx`                                            | 5 min  | DONE   | —          |
| T04 | P0       | Add `transition-all duration-100` to timeline `<td>` cells     | `src/pages/TimelineView.tsx`                                            | 5 min  | DONE   | —          |
| T05 | P0       | Keep non-matching chips in DOM + `transition-opacity` on cells | `src/pages/TimelineView.tsx`                                            | 10 min | DONE   | —          |
| T06 | P1       | Unify subject colours across `colours.ts`, `graphUtils.ts`, `TimelineView.tsx` | `src/lib/colours.ts`, `src/lib/graphUtils.ts`, `src/pages/TimelineView.tsx` | 40 min | DONE   | —          |
| T07 | P1       | Sidebar: house purple + Lucide icons + Source Sans Pro 600     | `src/components/Layout.tsx`, `package.json`                             | 30 min | DONE   | T01        |
| T08 | P1       | Filter chips + clear button (Browser + Concepts)               | `src/components/FilterChips.tsx` (new), `src/pages/Browser.tsx`, `src/pages/Concepts.tsx` | 45 min | DONE   | —          |
| T09 | P1       | Numbered pagination component (shared, replaces Prev/Next)     | `src/components/Paginator.tsx` (new), `src/pages/Browser.tsx`, `src/pages/Concepts.tsx` | 40 min | DONE   | —          |
| T10 | P1       | `useDeferredValue` for timeline search input                   | `src/pages/TimelineView.tsx`                                            | 10 min | DONE   | T02        |
| T11 | P2       | OccurrenceCard coloured left border (subject colour)           | `src/components/OccurrenceCard.tsx`                                     | 10 min | DONE   | T06        |
| T12 | P2       | Dashboard stat cards: coloured accent bar                      | `src/components/StatCard.tsx`, `src/pages/Dashboard.tsx`                | 20 min | DONE   | T06        |
| T13 | P2       | Normalise page headers across all pages                        | `src/pages/Dashboard.tsx`, `src/pages/Browser.tsx`, `src/pages/Concepts.tsx`, `src/pages/TimelineView.tsx`, `src/pages/ConceptDetail.tsx` | 15 min | DONE   | T01        |
| T14 | P2       | "View in Timeline" link from ConceptDetail                     | `src/pages/ConceptDetail.tsx`, `src/pages/TimelineView.tsx`             | 15 min | DONE   | —          |
| T15 | P2       | Concepts subject filter: use `fetchFilters()` (remove hardcoded options) | `src/pages/Concepts.tsx`                                                | 10 min | DONE   | —          |
| T16 | P2       | Fix search placeholder text (Browser, Concepts, Timeline)      | `src/pages/Browser.tsx`, `src/pages/Concepts.tsx`, `src/pages/TimelineView.tsx` | 5 min  | DONE   | —          |
| T17 | P3       | Sortable columns in Concepts table (Term, Occurrences)         | `src/pages/Concepts.tsx`                                                | 45 min | DONE   | —          |
| T18 | P3       | Filter bar visual grouping (`bg-slate-50`, labels)             | `src/pages/Browser.tsx`, `src/pages/Concepts.tsx`                       | 15 min | DONE   | T01        |
| T19 | P3       | Replace density chart with Recharts `<BarChart>`               | `src/pages/Dashboard.tsx`                                               | 40 min | DONE   | —          |
| T20 | P3       | Convert GraphView inline styles to Tailwind                    | `src/pages/GraphView.tsx`                                               | 60 min | DONE   | T01        |

| T21 | P1       | Vocab data layer: convert data.js → vocabData.ts + vocabHelpers.ts | `src/lib/vocabData.ts` (new), `src/lib/vocabHelpers.ts` (new), `src/components/vocabulary/highlightTypes.ts` (new), `src/lib/colours.ts` | 90 min | DONE   | —          |
| T22 | P1       | VocabTimelineView: VocabPill + HighlightControls + BookletCard + page | `src/components/vocabulary/VocabPill.tsx` (new), `HighlightControls.tsx` (new), `BookletCard.tsx` (new), `src/pages/VocabTimelineView.tsx` (new), `src/App.tsx`, `src/components/Layout.tsx` | 3 hr   | DONE   | T21        |
| T23 | P1       | WordAtlasView: WordAtlasTier + page                            | `src/components/vocabulary/WordAtlasTier.tsx` (new), `src/pages/WordAtlasView.tsx` (new)                                                | 2 hr   | DONE   | T21        |

---

T01–T20 completed 2026-03-28. T21–T23 completed 2026-04-30.
