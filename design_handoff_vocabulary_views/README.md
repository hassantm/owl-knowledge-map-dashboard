# Handoff: Vocabulary Views (Knowledge Map)

## Overview
Three complementary views for displaying curriculum vocabulary, designed as alternatives / additions to the existing OWL Knowledge Map "Timeline Matrix":

1. **Refined Timeline Matrix** — the existing pill grid, evolved. Same year × subject layout, but every word carries a small unit-count badge and recurring vocabulary (3+ units) is visually emphasised.
2. **Word Atlas** — a word-first index across the whole curriculum, ranked by reach and tiered by unit count.
3. **Booklet Library** — booklets shown as cards with words rendered as flowing text whose size scales with curriculum reach.

All three share the same data model (booklet → chapter → words, each word with a unit-count) and a common "highlight recurrences" interaction surface.

## About the Design Files
The HTML/JSX files in this bundle are **design references**, not production code. They were authored as prototypes to show intended look, behaviour, and information density. The task is to recreate these views in the target codebase using its existing framework (React, Vue, etc.), patterns, design tokens, and component library — not to ship the HTML directly. If the project has no established framework yet, pick whichever is most appropriate for the host application.

## Fidelity
**High-fidelity.** Colours, type sizes, spacing, control affordances, and interactions are all final design intent. Recreate pixel-faithfully against the codebase's design system. Where the prototype uses generic system fonts, swap in the project's brand font stack.

## Data model

```ts
type Subject = "History" | "Geography" | "Religion";
type Term = "Autumn1" | "Autumn2" | "Spring1" | "Spring2" | "Summer1" | "Summer2";

interface Word { w: string; u: number; }            // u = unit-count (how many curriculum units this word recurs in across the WHOLE dataset)
interface Chapter { n: number; title: string; words: Word[]; }
interface Booklet { id: string; title: string; chapters: Chapter[]; }
interface MatrixRow { year: string; term: Term; cols: Record<Subject, Booklet[]>; }
interface VocabData {
  meta: {
    subjects: Record<Subject, { name: string; color: string; soft: string; ink: string }>;
    termLabels: Record<Term, string>;  // e.g. Autumn1 -> "Aut 1"
  };
  rows: MatrixRow[];
}
```

The reference dataset (`data.js`) was derived from a CSV export with columns:
`id, word, chapter, booklet (=subject), unit (=booklet name), term, year` — note the upstream column-naming quirk: the CSV's `booklet` column is actually the **subject**, and its `unit` column is the **booklet name**.

Compute `word.u` once across the whole curriculum: for each unique word, count how many distinct booklets (year+term+booklet-name combinations) it appears in.

## Design tokens

### Subject palette
```
History    color #7AA8E8   soft #E1ECF9   ink #2C4F7C
Geography  color #86C28A   soft #E2F0E4   ink #36633A
Religion   color #E8B547   soft #F8EBC9   ink #7A5610
```
`color` is the accent stroke / column rule. `soft` is the pill / card-header background. `ink` is foreground text on `soft`.

### Neutrals
```
Page bg          #fcfcfa
Card bg          #ffffff
Page ink         #1a1a1a
Body grey        #6b665b
Mid grey         #8a857a
Hairline         #ece9e3
Soft hairline    #e7e5e0
Page chrome      #f0eee9
```

### Type
- Family: `'Söhne', 'Inter', system-ui, sans-serif` (substitute the project's brand stack)
- Page title: 32px / 500 / -0.01em
- Section title: 18px / 600
- Booklet title: 16-17px / 600
- Chapter eyebrow: 10.5-11px / 600 / uppercase / 0.06em tracking
- Pill body: 12.5px / 500 (600 when recurring)
- Eyebrow / labels: 11-12px / 600 / uppercase / 0.14em tracking

### Spacing
8px grid. Card padding 12-20px. Row vertical padding 18px. Pill gap 5px. Section gap 24-32px.

### Border radius
Pills 13px. Cards 6px. Buttons / segmented controls 12-14px. Status badges 9px.

### Shadow / outline conventions
- Recurring (≥3 units) pills: 1px solid `subject.color` border, weight bumped to 600.
- Highlight overlay: 1.5px solid + 2px tint halo using the highlight colour token.
- No drop shadows on the matrix; cards rely on hairlines.

## View 1 · Refined Timeline Matrix
**Purpose:** Replace today's flat pill grid with the same shape, but make recurrence visible. Teachers should be able to scan a single Year/Term row and immediately see which words are load-bearing.

**Layout:**
- Page padding 32px 40px, max-width 1640px.
- Header row: title block left + control cluster right (Year segmented control + Highlight-≥ segmented control).
- Sticky column-header row: `grid-template-columns: 84px 1fr 1fr 1fr`. Each subject heading carries a 3px left rule in `subject.color` and uppercase 11px label in `subject.ink`.
- Body rows: same 4-column grid. Left column shows `YEAR N` (11px / 600 / mid-grey) above the term label (18px / 500). Hairline divider on top of each row.
- Within each subject cell: Booklet title (16/600), then chapters, each chapter is a numbered circle (18px, `subject.soft` bg, `subject.ink` text) + chapter title eyebrow + a flex-wrap row of pills.

**Pill component:**
- 13px radius, `subject.soft` bg, `subject.ink` text, 12.5px / 500.
- Right-aligned 18px circle badge with the unit count when `u > 1` (light-grey for u=2, `subject.color` filled when recurring).
- Recurring (u ≥ 3): 1px solid `subject.color` border, weight 600.
- Below highlight-threshold: opacity 0.28.
- Hover: bg → `subject.color`, text → white.

**Controls:**
- Year segmented: `all | Y3 | Y4 | Y5 | Y6`. Active = #1a1a1a fill, white text.
- Highlight-≥ segmented: `all | 2+ | 3+ | 4+`. Same active style. Dims pills below threshold.

## View 2 · Word Atlas
**Purpose:** Flip the data on its head — show the curriculum from the words' point of view. Useful for spotting the small set of words that recur most, and for searching any specific word.

**Layout:**
- Header row: title + a search input (240px wide, 16px radius pill, hairline border, white bg) + subject legend.
- Four collapsible tier sections (Across 4 / 3 / 2 / 1 units), each with a tier header row (badge + label + description + word count + chevron) and a grid of word entries.

**Tier badge colours:**
```
Tier 4  bg #1a1a1a   ("Curriculum cornerstones")
Tier 3  bg #3a3631   ("Repeated touchpoints")
Tier 2  bg #8a857a   ("Cross-referenced")
Tier 1  bg #c8c4bc   ("Specific to one topic")
```

**Word entry, full (tiers 3-4):**
- 26px circle with the unit count (#1a1a1a bg, white text, 11/700)
- Word (14/500)
- Below word: row of small subject-coloured chips listing every booklet the word appears in. Chip = `subject.soft` bg, `subject.ink` text, 10/500, 8px radius, 2/6px padding.
- Two-column grid (`repeat(2, 1fr)`).

**Word entry, compact (tiers 1-2):**
- Row of up to 4 6px subject-colour dots
- Word (13/400)
- Four-column grid (`repeat(4, 1fr)`).

**Truncation:** Tier 1 caps at 200 entries with a "+N more single-unit words" footer. Tiers 2-4 show all.

**Search:** Live substring match against `word`. When empty, all tiers show their full content.

## View 3 · Booklet Library
**Purpose:** Browse the curriculum booklet by booklet, with high-frequency vocabulary visually self-announcing through type weight and size.

**Layout:**
- Header row: title + Year tabs (Y3-Y6 segmented control) + a Reach scale legend (the digits 1-4 rendered at the same sizes used in cards, as a key).
- For each term in the selected year: a thin uppercase term-bar header followed by a 3-column grid of booklet cards (one column per subject).
- Empty cell: dashed-border placeholder reading "No <Subject> booklet this term".

**Booklet card:**
- White card, 6px radius, 1px hairline border.
- Header: `subject.soft` bg, 12-16px padding, 2px bottom border in `subject.color`. Contains:
  - Subject eyebrow with 6px circle dot + name (uppercase 9/700)
  - Booklet title (17/600)
  - Stat row: chapter count, word count, "recur 3+" count.
- Body: each chapter as a small numbered eyebrow (chapter number in `subject.color`, dashed bottom rule) followed by the words rendered as inline text.

**Reach-weighted type scale (each word):**
```
u=1   12px / 400 / opacity 0.7
u=2   15px / 500 / opacity 0.92
u=3   19px / 650 / opacity 1.0   + superscript "3" in subject.color
u=4   24px / 700 / opacity 1.0   + superscript "4" in subject.color
```
Color shifts to `subject.ink` for recurring (u ≥ 3); leading -0.01em on those.

## Shared interaction · Highlight recurrences
A single global "highlighting" surface drives all three views.

**Tokens (state):**
```
highlightOn: boolean       // master toggle
minRecur: 2 | 3 | 4        // threshold
highlightColor: hex        // accent for highlights
boldRecurrences: boolean   // bump weight on highlighted words
traceWord: string          // free-text "find this word"
dimNonMatching: boolean    // when tracing, fade non-matches
```

**Behaviour:**
- When `highlightOn` AND `word.u >= minRecur`: apply a 1.5px outline + ~14% tint halo in `highlightColor` to the word's pill / card / row. If `boldRecurrences`, also push weight to 700-800.
- When `traceWord` is non-empty and substring-matches a word (case-insensitive): apply a stronger highlight (filled background in `highlightColor` for pills; tinted bg for atlas rows; tinted bg + colour for atlas/booklet word).
- When tracing AND `dimNonMatching`: opacity 0.18-0.25 on non-matching items.

**Default highlight colour:** `#c96442`.

## Files in this bundle
- `Knowledge Map.html` — top-level shell. Loads the three direction modules onto a pan/zoom Design Canvas with a Tweaks side-panel.
- `direction-1.jsx` — Refined Timeline Matrix
- `direction-2.jsx` — Word Atlas
- `direction-3.jsx` — Booklet Library
- `data.js` — full Y3-Y6 dataset (3,148 word entries, 2,916 unique words). The dataset shape matches the TypeScript interface above.
- `design-canvas.jsx` / `tweaks-panel.jsx` — purely demo chrome (canvas + tweaks panel). NOT part of the design to ship.
- `reference.png` — the original Timeline Matrix screenshot for context.

## Recommended implementation order
1. Build the data layer + the unit-count derivation (it's the same for all three views — compute once, share).
2. Implement View 1 (closest to the existing UI; smallest user-facing change).
3. Add the highlight tokens and wire them into View 1.
4. Implement Views 2 and 3 against the same highlight contract.
5. Wire the highlight controls into wherever the host app keeps view-level user preferences.

## Notes on the data
- Frequency genuinely tops out at 4 in the source data (only `exile` and `decree`). Don't design for higher tiers.
- Some upstream chapter titles are truncated (e.g. `"5. How does the food"`). Pass them through verbatim; surfacing the truncation is a data-quality signal, not a bug.
- Words like `Mediterranean Sea` and `Indus` cross subject boundaries — the Word Atlas surfaces this naturally; the matrix relies on the highlight system.
