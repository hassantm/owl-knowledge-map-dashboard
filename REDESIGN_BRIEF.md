# OWL Knowledge Map — Redesign Brief

**Date:** 2026-03-28  
**For:** Claude Opus (greenfield redesign)  
**Audience:** Christine Counsell (curriculum consultant), Steve Mastin (CEO Opening Worlds), classroom teachers  
**Status:** Internal prototype → stakeholder pitch tool

---

## What This Is

The OWL Knowledge Map is a visual tool that surfaces the curriculum architecture of the **Opening Worlds** KS2 humanities programme — a four-year sequence of History, Geography, and Religion & Worldviews booklets used in ~200 UK primary schools.

The data is a **PostgreSQL database** (running on a Pi at `openclaw-gateway`, port 5432, db `owl`) containing:
- **3001 concepts** (vocabulary terms extracted from booklets, e.g. "persecution", "tributary", "caliph")
- **3232 occurrences** (concept × unit × year × term × subject, with context paragraph)
- **178 edges** (manually confirmed concept-to-concept links, each typed by nature)

A **FastAPI backend** (`api/main.py`, port 8000) exposes all this as JSON. The API is working and well-tested.

The existing React frontend (`src/`) works but is visually underwhelming — it looks like a developer tool, not something you'd show to curriculum professionals to get buy-in.

---

## The Pedagogical Core (read this carefully)

The Opening Worlds curriculum was developed by Steve Mastin and Christine Counsell based on the works of Hirsch and Willingham. It is built on four drivers: **Scope, Rigour, Coherence, Sequencing**.

The curriculum design document states explicitly:
> "Prior knowledge from Year 3 transforms pupils' ability to make sense of content in Years 4, 5, and 6."

The entire curriculum is architected so that earlier vocabulary unlocks access to later content. The question the knowledge map answers is:

> **"What do children already know when they arrive at this unit?"**

This is not a secondary use case — it is *the* pedagogical reason this tool is worth building. When a teacher is about to start Y5 Amazon, they should be able to see: "these pupils have already met 'biome' (Y3 Climate), 'nutrient cycle' (Y3 Summer 2), 'indigenous' (Y4 Americas)..." That prior knowledge reframes what they can expect from children.

The **edges** in the graph encode this. Three edge types:
- **Reinforcement** — same concept recurs in a later unit (same meaning, more practice)
- **Extension** — concept recurs and deepens (e.g. "settlement" → "conurbation" → "megacity")
- **Application** — concept from one subject is applied in another (e.g. a geographical term applied in a history unit)

**Application** edges are the most intellectually significant — they reveal the cross-subject architecture. **Extension** edges show how vocabulary deepens across years. Together these are the signal. Reinforcement is noise for this purpose.

---

## Current Stack

- Backend: FastAPI (Python), connects to PostgreSQL on `openclaw-gateway` via SSH tunnel
- Frontend: React + TypeScript + Vite + Tailwind CSS + Sigma.js + Recharts
- Repo: `~/ai-projects-local/owl/it/owl-web/`
- API available at `http://localhost:8000` when running
- Full plan: `PLAN.md` (worth reading — the intent is right, the execution needs rethinking)

### API Endpoints (all working)

```
GET /api/stats
GET /api/graph          ?subject=&year_from=&year_to=&edge_nature=
GET /api/concepts       ?q=&subject=&page=0&page_size=50
GET /api/concepts/{id}  (full detail with occurrences + edges)
GET /api/occurrences    ?subject=&year=&term=&q=
GET /api/edges          ?edge_nature=&edge_type=
PATCH /api/edges/{id}
```

---

## What Needs Redesigning

**You have complete freedom on framework, visual style, and structure.** You can use any web framwork you choose, you don't have to stick to React.  If you want to replace Sigma.js with a different graph library (Cytoscape.js, D3, Reagraph, etc.), that's fine. If you want to restructure the pages, that's fine. Keep the FastAPI backend as-is.

### The core ask

The redesign should make a *curriculum professional* — not a software developer — immediately understand what they're looking at and why it matters.

### Specific problems with the current design

1. **It doesn't lead with the question.** The dashboard shows stats (3001 concepts, 174 edges) with no context. These numbers mean nothing to someone who doesn't already know what the tool is. The opening screen should answer: "What do children already know?"

2. **The graph is impressive but not legible.** 3001 nodes in a force-directed layout is a wall of text. The useful graph has ~174 edges. Default to showing only **extension + application edges** (63 edges), with the option to add reinforcement. The meaningful insight is in the structure of connections, not the count of nodes.

3. **There's no teacher entry point.** A teacher doesn't think "show me the graph". They think "I'm teaching Y5 Summer 2 Amazon — what do my pupils already know?" The UI should support that question directly.

4. **The typography is generic.** The curriculum content — the `term_in_context` paragraphs — should feel scholarly and warm, not like database output. Use a serif font for content text. The tool should feel like something Opening Worlds would be proud to show.

### What success looks like

- Christine Counsell (a curriculum designer) opens the tool and within 30 seconds understands what it's showing her
- A teacher can navigate to their unit and see the prior knowledge their pupils carry
- The graph view communicates curriculum architecture, not data complexity
- It looks professional enough that Steve Mastin wouldn't need to apologise for the aesthetics before showing it to a school

---

## Suggested Structure (adapt freely)

### Entry point: "Prepare for a unit"
Replace the dashboard with a unit-selection screen. Pick Year + Term + Subject → see the concepts children arrive with, where they first met them, and how they've been extended since. This is the teacher use case.

### Graph view: Architecture lens
The graph should communicate the curriculum's intellectual architecture. Default filter: extension + application edges only, all subjects, all years. Make the cross-subject application edges visually prominent (distinctive colour/thickness). Add a "unit focus" mode where clicking a unit dims everything except that unit's concepts and their prior history.

### Concept detail: Trajectory view
For a single concept, show its full curriculum journey as a timeline — where it was introduced, where it recurred, how it deepened, where it crossed into another subject. Include the full context paragraph (serif font, warm background) so the pedagogical intent is visible.

### Stats/overview (lower priority)
Keep it simple. A few headline numbers, perhaps a curriculum grid showing coverage by year/subject.

---

## Data Notes

- **Subject colours** (from existing code): `History` = blue, `Geography` = green, `Religion & Worldviews` = amber/warm  
- **Edge nature colours**: reinforcement = slate, extension = amber, application = violet  
- The most connected concepts (worth highlighting): "persecution", "descended", "exile", "empire", "settlement"  
- 174 edges is the full set; 63 are extension + application combined
- The graph is sparse by design — most concepts are unit-specific vocabulary. The connected nodes are the pedagogically significant ones.

---

## Tone / Visual Direction

Opening Worlds' branding is warm, intellectual, globally-minded. Think a good university press textbook, not a SaaS analytics dashboard. 

The house identity is **Source Sans Pro** and two brand colours: **purple `#865595`** and **green `#699940`**. This should be respected.

Avoid:

- Dark mode
- Neon accent colours
- Heavy shadowing
- Aggressive data density

Aim for:
- Off-white / warm paper background
- Deep navy or charcoal for text
- Colour used purposefully (subject colours, edge types)
- Generous whitespace
- Clear hierarchy

The tool should feel like it belongs in a CPD session with curriculum professionals, not a dev standup.

---

## Constraints

- Keep the FastAPI backend (`api/`) unchanged
- The PostgreSQL DB is on the Pi — the API handles the connection
- Don't break the existing routes structure; add new endpoints if needed
- The tool runs locally (no cloud hosting requirement for now)
- Prioritise the teacher use case and the graph view; the edge review workflow is lowest priority
- Respect the brand identity
