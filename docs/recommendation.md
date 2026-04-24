# Recommendation: Which Plan to Follow

_2026-03-28_

---

## Summary

Both plans agree on the core problems: the timeline jitter has four fixable causes, the browse UX needs filter visibility and better pagination, and the colour system is fragmented. The technical fixes are essentially identical. The difference is in what each plan *sees as the job*.

## Where Sonnet's plan falls short

Sonnet wrote a correct engineering plan. It identified the right bugs, proposed the right React patterns (`useMemo`, `useDeferredValue`, `transition-all`), and sequenced them sensibly. If you followed it, the app would work better.

But it would still look like a generic Tailwind dashboard. Sonnet's plan:

1. **Doesn't use the house font.** Source Sans Pro is the brand typeface. The plan never mentions it. Typography is the single fastest way to make a web app look intentional rather than default.

2. **Doesn't use the house colours.** `#865595` and `#699940` aren't mentioned. The colour unification would consolidate three palettes into one — but it would still be a Tailwind default palette, not the client's.

3. **Missed the third colour palette** in `graphUtils.ts`. The 3D graph (the centrepiece page) would still show History as indigo while the rest of the app shows it as blue.

4. **Doesn't address the serif font situation.** `font-serif` falls through to Times New Roman. The PLAN.md explicitly calls for an editorial serif for curriculum text. This is a one-line fix that Sonnet didn't flag.

These aren't optional — the user specified the house font and colours. A plan that doesn't incorporate them is solving the wrong problem at the top level while getting the details right.

## What to use from Sonnet

Keep these items from Sonnet's plan — they're well-specified and correct:

- **Timeline jitter fixes 3.1–3.4** — identical diagnosis, both plans agree
- **`useDeferredValue` for search** — good React 18 technique, Opus keeps it as P1-5
- **Filter chips + clear button** — same approach, same priority
- **Pagination component** — same approach
- **Hardcoded subject options fix** — same
- **"View in Timeline" cross-link** — same
- **Density chart Recharts migration** — same

## What Opus adds

1. **Typography as P0.** Source Sans Pro + Source Serif Pro, configured in Tailwind. 10 minutes, transforms everything.
2. **House colours integrated into the palette.** Geography gets `#699940` (brand green). Sidebar gets `#865595` (brand purple).
3. **All three colour palettes unified**, not just two.
4. **Serif font explicitly loaded** so `font-serif` isn't Times New Roman.
5. **Sidebar identity** — purple background rather than Tailwind slate-900.

## Verdict

**Follow the Opus plan.** It subsumes everything correct in Sonnet's plan and adds the brand identity layer that makes this presentable to Counsell and Mastin. The technical fixes are the same; the difference is whether the result looks like *their* tool or a template.

Start with P0 (typography + jitter fixes). That's 40 minutes of work and the single biggest transformation in how the app feels.
