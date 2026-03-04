# OWL Knowledge Map — Web Frontend Plan

**Created:** 2026-03-04
**Purpose:** Replace Anvil with a proper web frontend that presents the curriculum knowledge graph clearly and beautifully — suitable for showing to Christine Counsell, Steve Mastin, and teachers.

---

## Why Replace Anvil

Anvil is holding us back in three specific ways:
1. **No real graph library** — we're using Plotly's scatter plot as a graph, which doesn't support interaction, physics-based layout, or edge highlighting
2. **No control over typography or layout** — everything looks like a generic form builder
3. **Skulpt Python limitations** — f-strings, regex, nested dicts all have quirks that slow down development

The new stack keeps Python on the backend (same SQLite, same queries, familiar language) and uses modern web tools only where they're better than Python — primarily for the visual layer.

---

## Proposed Stack

### Backend — FastAPI (Python)
A thin Python API layer over the existing SQLite database. Same queries as the Anvil uplink, exposed as JSON endpoints instead of Anvil server calls. FastAPI auto-generates interactive docs, handles CORS, and runs locally alongside the database.

**Why not keep the Anvil uplink?**
The uplink is tightly coupled to Anvil's serialisation. FastAPI gives us a standard REST API that any frontend — or future tool — can call.

### Frontend — React + TypeScript
A single-page application with client-side routing. TypeScript catches errors early and makes the codebase easier to maintain as it grows.

### Graph Visualisation — Sigma.js
Sigma.js is built specifically for network graph rendering. Unlike Plotly (which is a charting library doing graph-shaped things), Sigma:
- Uses WebGL for hardware-accelerated rendering (handles thousands of nodes smoothly)
- Supports physics-based layout (ForceAtlas2, same algorithm as Gephi)
- Has built-in node/edge highlighting, hover states, click events
- Designed for exactly this use case: knowledge and social graphs

### Charts — Recharts
React-native charting library for the dashboard stats (bar charts, distributions). Simpler than D3 for standard chart types.

### Styling — Tailwind CSS
Utility-first CSS. Produces polished, consistent UIs without writing custom CSS files. Education/publishing-appropriate typography built in.

### Routing — React Router
Standard client-side routing for concept detail pages, filter state in URLs (shareable links to specific views).

---

## Application Structure

```
owl-web/
├── api/                    # FastAPI backend
│   ├── main.py             # App entry point, CORS config
│   ├── routes/
│   │   ├── graph.py        # /graph/figure, /graph/stats
│   │   ├── concepts.py     # /concepts, /concepts/{id}
│   │   ├── occurrences.py  # /occurrences, filtered
│   │   └── edges.py        # /edges, edge confirmation
│   ├── db.py               # SQLite connection, shared queries
│   └── models.py           # Pydantic response models
│
├── src/                    # React frontend
│   ├── pages/
│   │   ├── Dashboard.tsx       # Stat cards + overview charts
│   │   ├── GraphView.tsx       # Full-screen Sigma.js graph
│   │   ├── ConceptDetail.tsx   # Single concept trajectory
│   │   ├── Browser.tsx         # Paginated corpus browser
│   │   └── EdgeReview.tsx      # Human review workflow
│   ├── components/
│   │   ├── KnowledgeGraph.tsx  # Sigma.js wrapper component
│   │   ├── ConceptChip.tsx     # Subject-coloured term badge
│   │   ├── EdgeCard.tsx        # Edge display with nature badge
│   │   ├── OccurrenceCard.tsx  # Location + context display
│   │   ├── StatCard.tsx        # Dashboard metric tile
│   │   └── FilterBar.tsx       # Subject / year / nature filters
│   ├── hooks/
│   │   ├── useGraph.ts         # Graph data fetching + state
│   │   └── useFilters.ts       # Filter state + URL sync
│   └── lib/
│       ├── api.ts              # Typed API client functions
│       └── colours.ts          # Subject + edge_nature colour constants
│
├── package.json
├── vite.config.ts          # Vite dev server (fast HMR)
└── tailwind.config.ts
```

---

## Pages — What Each Should Show

### Dashboard
- Four stat cards: total concepts, load-bearing concepts, confirmed edges, corpus units
- Bar chart: concepts introduced per year (Y3–Y6), split by subject
- Donut chart: edge nature breakdown (reinforcement / extension / application)
- Flow diagram: cross-subject application arrows (Religion→History 11, History→Geography 11, etc.)
- "Most connected" concepts list: `persecution`, `descended`, `exile`, `udasi`

### Graph View — the centrepiece
Full-screen Sigma.js graph with:
- **Physics layout (ForceAtlas2)** — nodes pulled together by edges, pushed apart by repulsion. Connected clusters naturally emerge.
- **Node colour** by subject: History=blue, Geography=green, Religion=red
- **Node size** by occurrence count (load-bearing concepts larger)
- **Edge colour** by nature: reinforcement=grey, extension=amber, application=violet
- **Edge thickness** by nature: application edges thicker to make them prominent
- Hover on node → tooltip showing term, subject, year, unit
- Hover on edge → tooltip showing edge_nature and both locations
- Click node → navigate to Concept Detail page
- **Filter panel** (collapsible sidebar):
  - Subject toggle (History / Geography / Religion)
  - Year range slider (3–6)
  - Edge nature toggle (show/hide reinforcement, extension, application)
  - "Cross-subject only" quick filter to isolate the most interesting connections
- **Legend**: subject colours + edge nature colours

The graph should default to showing *only application and extension edges* — hiding reinforcement collapses the noise and reveals the curriculum's intellectual architecture immediately.

### Concept Detail
For a single concept (e.g. "persecution"):
- Term heading with subject chip(s)
- **Timeline strip**: all occurrences plotted left-to-right by year, connected by arrows coloured by edge_nature
- Each occurrence card shows: Year · Term · Subject · Unit · Chapter · the term highlighted in context (full paragraph)
- Edge cards between occurrences explaining the nature of each connection with the reasoning from the classification

### Corpus Browser
- Search box + subject / year / term filters
- Paginated list of occurrences
- Each row: INTRO/recur badge, bold term, location, highlighted context paragraph
- Click term → Concept Detail

### Edge Review (internal tool, lower priority)
- Queue of edges to review / update nature
- Side-by-side from/to context with current classification
- Buttons to change edge_nature, add notes

---

## Key Design Decisions

### Default graph view: extension + application only
The most important thing the graph needs to communicate is that the curriculum has deliberate cross-subject intellectual architecture. Showing all 174 edges including 111 reinforcement edges makes this harder to see, not easier. Default to showing extension (36) + application (27) = 63 edges — the signal without the noise.

### Curriculum timeline as alternative layout
Alongside the physics layout, offer a structured "curriculum timeline" view:
- X-axis: Year 3 → Year 6 (with term subdivisions)
- Y-axis: three horizontal subject lanes
- Same nodes and edges, but positioned deterministically by curriculum location
- Better for showing the sequencing logic; worse for showing clustering

This was the approach built for the Anvil graph and can be ported directly.

### Shareable URLs
Every graph filter state should be encoded in the URL query string so that specific views (e.g. "all cross-subject application edges involving Religion") can be shared as links with Christine Counsell or Steve Mastin.

### The term_in_context display
This is what makes the tool feel scholarly rather than administrative. Every occurrence should show the full paragraph with the term bolded. Use a clean serif font (e.g. Georgia or a web serif) for the context text to signal that this is curriculum content, not interface chrome.

---

## Backend API Endpoints

```
GET  /api/stats                          Dashboard summary stats
GET  /api/graph                          Full graph: nodes + edges (filtered)
     ?subject=History&year_from=3&year_to=6&edge_nature=application
GET  /api/concepts                       Paginated concept list
     ?q=empire&subject=History&page=0&page_size=50
GET  /api/concepts/{concept_id}          Single concept with all occurrences + edges
GET  /api/occurrences                    Paginated occurrence browser
     ?subject=History&year=4&term=Spring1&q=empire
GET  /api/edges                          Edge list (filtered)
     ?edge_nature=application&edge_type=cross_subject
PATCH /api/edges/{edge_id}              Update edge_nature (review workflow)
```

All responses are JSON. The frontend fetches data on mount and re-fetches when filters change.

---

## Build and Run

```bash
# Backend
cd owl-web/api
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000

# Frontend (separate terminal)
cd owl-web
npm install
npm run dev          # Vite dev server on http://localhost:5173
```

In production, Vite builds a static bundle that FastAPI can serve directly — no separate hosting needed. The whole thing runs locally, exactly like the Anvil uplink pattern, but with no dependency on the Anvil platform.

---

## Build Sequence

**Phase 1 — API + scaffolding** (backend first, test with browser)
1. `api/main.py` with CORS and `/api/stats` endpoint
2. `api/db.py` connecting to existing SQLite
3. All route files with query logic ported from `uplink.py`
4. Test all endpoints in FastAPI's auto-generated `/docs` interface

**Phase 2 — Graph view** (highest priority, most distinctive)
1. Sigma.js wrapper component with ForceAtlas2 layout
2. Node/edge colour encoding
3. Hover tooltips
4. Filter panel wired to API
5. Click-to-concept-detail navigation

**Phase 3 — Supporting pages**
1. Dashboard with stat cards and charts
2. Concept Detail timeline
3. Browser with search and pagination

**Phase 4 — Polish**
1. Responsive layout (tablet/desktop)
2. URL-encoded filter state
3. Loading states and empty states
4. Typography and spacing pass

---

## What This Achieves Over Anvil

| Capability | Anvil | This stack |
|---|---|---|
| Graph layout | Plotly scatter (static) | Sigma.js ForceAtlas2 (physics, interactive) |
| Edge hover/highlight | Not possible | Built-in |
| Node size by degree | Limited | Full control |
| Typography | Generic widget font | Custom serif for context text |
| URL-shareable views | Not possible | Encoded in query string |
| Mobile/responsive | Not possible | Tailwind responsive utilities |
| Deployment | Anvil platform dependent | Runs entirely locally, or static host |
| Dev iteration speed | Slow (Skulpt quirks) | Fast (Vite HMR, TypeScript) |
