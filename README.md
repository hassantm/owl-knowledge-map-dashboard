# OWL Knowledge Map — Dashboard

A React frontend for exploring the conceptual architecture of the [Opening Worlds](https://openingworldsresources.com/) KS2 humanities curriculum. Built as a companion to the [owl-knowledge-map](https://github.com/hassantm/owl-knowledge-map) backend, which extracts and structures the curriculum's vocabulary from the original booklet source material.

---

## Background

Opening Worlds is a KS2 humanities curriculum covering History, Geography, and Religion across Years 3–6. It is deliberately designed around a shared conceptual vocabulary — terms that recur across subjects and years, building understanding incrementally rather than treating each unit as isolated content.

The OWL Knowledge Map project makes that conceptual architecture visible. It extracts vocabulary from the curriculum booklets, identifies where each term is introduced and where it recurs, and builds a graph of the connections between them: which concepts reinforce each other, which extend each other, and which apply across subject boundaries.

This dashboard is the visualisation and analysis layer — a tool for exploring, interrogating, and demonstrating the curriculum's structure.

---

## Features

### Dashboard
Summary statistics and charts across the full curriculum: concept counts by subject and year, connection type breakdown, cross-subject bridges, longest-lived terms, and vocabulary density by unit.

### Graph View
A 3D interactive knowledge graph built with [`3d-force-graph`](https://github.com/vasturiano/3d-force-graph). Three layout modes:

- **Force** — 3D physics simulation. Connected concepts pull together; distinct clusters emerge from the data. Node size encodes connection count, so the curriculum's load-bearing concepts are immediately visible.
- **Community** — Louvain community detection colours nodes by cluster. Concepts grouped by connection density, regardless of year or subject.
- **Semantic** — Concepts positioned by the meaning of their paragraph context, using sentence embeddings and 3D PCA projection (see below). Reveals thematic territories that exist independently of the curriculum's designed structure.

Click any node to see the concept's subject, year, unit, and the paragraph it was extracted from (with the key term highlighted). Connections are listed with their type (reinforcement, extension, or application).

### Concepts Browser
Searchable, filterable list of all confirmed concepts with subject, year range, and occurrence counts.

### Occurrence Browser
Full occurrence-level detail — every appearance of every concept across the curriculum, with source context.

---

## Semantic Analysis

The semantic view is the most analytically novel part of the dashboard. Each concept is embedded using its source paragraph (not just the bare term) via [`sentence-transformers`](https://www.sbert.net/) (`all-MiniLM-L6-v2`). Concepts are then clustered by cosine similarity using K-means, and the resulting embedding space is projected to 3D via PCA.

This answers a specific question: **what conceptual territories would emerge from the curriculum's language if you knew nothing about its intended structure?** The results can then be compared against the curriculum's designed graph to see where the two align — and where the curriculum is making more adventurous connections than a naive reading would predict.

A full analysis at k=10 is documented in [`docs/semantic-analysis-report.md`](docs/semantic-analysis-report.md). The headline finding: the language model independently recovers OWL's cross-subject design. The Islamic civilisation cluster spans History and Religion almost equally (51/49); the river civilisations cluster bridges History and Geography — both found by a model that had no access to subject labels or curriculum structure.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Graph rendering | [3d-force-graph](https://github.com/vasturiano/3d-force-graph), [graphology](https://graphology.github.io/) |
| Charts | [Recharts](https://recharts.org/) |
| Backend | FastAPI, SQLite |
| Semantic clustering | sentence-transformers, scikit-learn, NumPy |
| Tests | Vitest |

---

## Running locally

**Backend** (requires the `owl-knowledge-map` repo in `../owl-knowledge-map`):

```bash
cd owl-web
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
```

**Frontend:**

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Related

- [owl-knowledge-map](https://github.com/hassantm/owl-knowledge-map) — extraction pipeline, graph builder, and Anvil uplink
- [Opening Worlds](https://openingworldsresources.com/) — the curriculum itself
