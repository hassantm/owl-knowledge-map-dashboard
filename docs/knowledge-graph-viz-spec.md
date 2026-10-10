# OWL Knowledge Graph — Revised Viz Spec + Data Enrichment Plan

*Drafted 2026-03-27. Context: current 3D force graph at http://100.106.59.61:5173 is sparse and clunky. Two goals: (1) better viz, (2) richer data.*

---

## Part 1: Viz Spec

### Core Design Principles

The curriculum is chronological, subject-integrated, and knowledge-building. The viz should *reflect* that — not fight it with an abstract node-cloud that requires domain knowledge to navigate.

Three principles:
- **Timeline-first:** show when concepts enter the curriculum, not just that they're connected
- **Search-first, browse-second:** don't force teachers to navigate a hair ball
- **Context on click:** every node click reveals something useful, not just connected nodes

---

### Layout: Timeline Matrix

Replace 3D force graph with a 2D timeline matrix.

```
            Y3         Y4         Y5         Y6
         A1 A2 S1 S2 U1 U2 | A1 A2 S1 S2 U1 U2 | ...
History  ●  ●  ●  ●  ●  ●  |  ●  ●  ●  ●  ●  ●  |
Geog     ●  ●  ●  ●  ●  ●  |  ●  ●  ●  ●  ●  ●  |
R&W      ●  ●  ●  ●  ●  ●  |  ●  ●  ●  ●  ●  ●  |
```

- **X axis:** 24 half-terms (Y3 Aut1 → Y6 Sum2), labelled by unit name
- **Y axis:** three subject rows (History / Geography / R&W)
- **Nodes:** concepts positioned at first appearance in the curriculum
- **Edges:** arcs connecting recurrences across units — longer arc = wider gap in curriculum
- **Node size:** frequency (how many units contain this concept)
- **Node colour:** subject of primary occurrence (History = amber, Geography = teal, R&W = rose)
- **Cross-subject nodes:** split-colour or outlined when concept appears in multiple subjects

**Why this works:** The chronological layout makes the curriculum's own logic visible. A teacher can immediately see that "empire" enters in Y3, recurs across Y4–5, and surfaces in a new context in Y6. The progression document's core argument becomes visually legible.

---

### Interaction Model

**Search-first:**
- Prominent search box at top
- Typing filters to matching concepts, highlighting them in the timeline
- Results listed below with unit/year/subject badges
- Click result → zoom to first occurrence, show recurrence arcs

**Node hover:**
- Tooltip: concept name + unit count

**Node click → side panel:**
- Concept name + definition (if extractable from booklets)
- Unit list: each occurrence as a badge (Y3 Aut1 Egypt · History)
- Relationship type (vocabulary recurrence / cross-subject / progression link / generalisation)
- Snippet of curriculum text from one unit (the richest occurrence)
- Related concepts (nodes connected by edges)

**Filter bar:**
- Subject: All / History / Geography / R&W
- Year group: All / Y3 / Y4 / Y5 / Y6
- Frequency: Any / 2+ units / 3+ units / 5+ units
- Edge type: All / Recurrence / Cross-subject / Progression

**Zoom / pan:**
- Standard — scroll to zoom, drag to pan
- "Reset view" button

---

### Optional: Graph View (secondary)

Keep the force-directed graph as an optional mode — "Graph view" vs "Timeline view" toggle. Graph view is useful for exploring connections from a single concept; Timeline view is useful for understanding the curriculum as a whole. Currently the graph view is the only view, which is why it feels abstract.

---

### Stack

Stick with React (already running). Recommend:
- **D3.js** for the timeline matrix (gives precise control over layout) — replace react-force-graph for the primary view
- Keep react-force-graph for the optional Graph view
- Shadcn/Tailwind for the side panel and filter UI
- FastAPI backend already running — just needs new endpoints

---

## Part 2: Data Enrichment Plan

### The Problem

Current state: 2,829 concepts, 3,025 occurrences, 174 edges. That's 0.06 edges per concept — genuinely sparse. The issue isn't the viz; it's that the graph is only capturing co-occurrence or direct links within units. The curriculum has far richer structure.

---

### What the Documents Already Contain (unused)

**From the Progression Document:**

The five vocabulary progression mechanisms define *edge types* — not just that two concepts are connected, but *how*:

| Edge Type | Mechanism | Example |
|---|---|---|
| `recognition` | Same word, same meaning, new context | "protect" (Egypt → Indus Valley) |
| `contextual_shift` | Same word, meaning expands/shifts | "empire", "tradition", "authority" |
| `generalisation` | Specific → abstract prototype | pyramid, ziggurat → **monument** |
| `specificity_expansion` | Abstract → increasingly specific | ruler → consul, tribune, senator, caliph |
| `analytical` | Cross-unit analytical vocabulary | Year 6 pupils use both period-specific and general terms |

These are currently absent from the schema. Adding `edge_type` to the edges table would transform the graph from "these concepts are connected" to "here's *how* they're connected."

**Explicitly stated cross-unit links in the progression doc:**
- Euphrates/Tigris (Y3 Cradles) → Alexander's conquests (Y3 Summer)
- Howard Carter / archaeological puzzles (Y3 Egypt, Y3 Indus) → complex conditional text (Y5 Anglo-Saxons)
- Indus-Mesopotamia cultural fusion → Constantinople → Viking-Saxon hogbacks (Y5)
- Simple empire concept (Y3) → Roman Republic (Y4) → Caliphate (Y4-5) → Mali/Benin (Y6)

These are high-confidence directed edges. They can be extracted and inserted directly.

**Named recurring themes (cross-unit backbone):**
- Art and architecture
- Government and politics
- Warfare

**Disciplinary concepts per unit** (the pink enquiry questions in the curriculum map):
- Causation, change/continuity, similarity/difference, evidential thinking, significance

These should be nodes (or tags) in their own right — connecting units that share a disciplinary focus.

**From the Curriculum Map:**

Cross-subject links in the same term are explicitly designed — the rationale names them:
- River Indus (Geography) ↔ Indus Valley Civilisation (History) ↔ Hinduism origins (R&W) — Y3 Aut1/Spr1
- Ancient Middle East (History) ↔ Jewish/Christian/Islamic stories (R&W)
- Ethiopia geography ↔ Medieval African kingdoms ↔ Ethiopian Christianity — Y6 Aut2

These cross-subject links are currently invisible in the graph. Adding them would reveal the horizontal coherence the curriculum is designed around.

---

### Proposed Schema Additions

**`units` table** (new):
```sql
CREATE TABLE units (
  id SERIAL PRIMARY KEY,
  unit_key TEXT UNIQUE,           -- e.g. 'y3_aut1_history'
  year INT,                        -- 3, 4, 5, 6
  term TEXT,                       -- 'aut1', 'aut2', 'spr1', 'spr2', 'sum1', 'sum2'
  subject TEXT,                    -- 'history', 'geography', 'rw'
  title TEXT,
  disciplinary_focus TEXT,         -- 'causation', 'similarity_difference', etc.
  notes TEXT
);
```

**`concept_occurrences` table** (extend existing):
Add `unit_key` FK linking each occurrence to the unit table. Currently occurrences are linked to units by some mechanism — make it explicit and queryable.

**`edges` table** (extend existing):
Add `edge_type TEXT` column with values: `recognition`, `contextual_shift`, `generalisation`, `specificity_expansion`, `cross_subject`, `progression`, `disciplinary`, `analytical`.

Add `direction TEXT` column: `null` (undirected) or `from_unit → to_unit` (directed progression link).

---

### Enrichment Pipeline: What to Extract from Documents

**Phase 1 — Structured extraction (doable now):**

1. Populate `units` table from curriculum map (24 units × 3 subjects = 72 rows) — I can do this from the PDF summary I already have.

2. Insert high-confidence progression edges from the progression doc (the explicitly named cross-unit connections above) — ~10-15 directed edges.

3. Insert cross-subject edges from the curriculum map rationale — ~15-20 edges per year group.

4. Insert disciplinary concept nodes and edges — link each unit to its disciplinary focus.

**Phase 2 — NLP extraction from booklets:**

This is the big one. Each booklet contains:
- 20-40 vocabulary terms (explicitly introduced)
- Proper nouns (people, places, events) — currently captured as concepts
- Hedging language ("historians believe...", "we are not sure...") — marks disciplinary passages
- Named scholars and primary sources
- Comparative passages ("unlike Egypt, the Indus Valley...") — implicit similarity/difference edges

Running a lightweight NLP extraction pipeline (spaCy or similar) over the booklet text would yield:
- Vocabulary with sentence context (for the side panel)
- Explicit comparison signals (→ similarity/difference edge type)
- Causation language ("because", "led to", "caused") → causation edges
- Continuity/change language ("continued", "changed", "however") → change/continuity edges

This would densify the graph substantially and make it genuinely useful for curriculum navigation.

---

### Immediate Next Steps (in priority order)

1. **Add `units` table and populate it** — foundation for everything else; can be done from existing data + curriculum map PDF
2. **Add `edge_type` column to edges** — retag existing 174 edges where type is known
3. **Build timeline matrix viz** — the single highest-impact change for usability
4. **Add node side panel** — context on click, using existing occurrence data
5. **Extract and insert cross-subject and progression edges** from the two PDFs — Phase 1 enrichment
6. **NLP extraction from booklets** — Phase 2 (needs booklet text in DB or as files)

---

---

## Part 3: Browser Redesign

The current Browse page is a database table masquerading as a UI — individual occurrence cards at the most granular level, no hierarchy, no entry point. Three specific problems:

1. **Wrong abstraction level.** Browsing occurrences when users want to browse *concepts*. "Empire" appears 47 times but shows as 47 separate cards.
2. **No entry point.** Blank search box + dropdowns gives no signal about what's interesting in the data.
3. **Most valuable content buried.** The `term_in_context` snippet is the headline — it's currently at the bottom of each card, cut off.

### Proposed redesign

**Default state:** Grouped by concept, sorted by frequency.
- Each row: `empire · 12 units · History / Geography`
- Click → expand to occurrence cards for that concept
- Search filters the concept list, not the occurrence list
- Dropdowns become progressive filters on the concept list (subject/year/term chips)

**Entry state options:** Most frequent concepts / concepts that span multiple subjects / recently confirmed

This is a restructure, not a tweak. Should replace the existing Browser page.

---

*This is a sketch, not a build spec. Priorities and approach subject to H's direction.*

## Related
- [[curriculum/CONTEXT|Curriculum Context]]
- [[OWL|Opening Worlds Ltd]]
