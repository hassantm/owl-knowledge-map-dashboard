# Test Plan — OWL Knowledge Map Frontend

## Scope

Unit and integration tests for the graph data pipeline. The 3D render itself (ForceGraph3D, WebGL) is excluded — that's visual and requires a browser. Everything tested here is pure logic.

---

## Test areas

### 1. `graphUtils` — data transformation (unit tests)

These are the most important tests: all the filter + build logic lives here now, isolated from React.

| ID | Function | Scenario | Expected |
|----|----------|----------|----------|
| GU-01 | `filterEdges` | All natures selected | Returns all edges |
| GU-02 | `filterEdges` | Only 'extension' selected | Returns only extension edges |
| GU-03 | `filterEdges` | `crossSubjectOnly=true` | Returns only cross_subject edges |
| GU-04 | `filterEdges` | Empty edge list | Returns empty array |
| GU-05 | `filterNodes` | Nodes with no active edges | Excluded from result |
| GU-06 | `filterNodes` | Node with active edge but excluded subject | Excluded from result |
| GU-07 | `filterNodes` | All subjects selected | All active-edge nodes returned |
| GU-08 | `degreeMap` | Two edges sharing a node | That node has degree 2 |
| GU-09 | `degreeMap` | Empty edge list | Returns empty object |
| GU-10 | `buildFGData` | Normal filter | Nodes sized by degree, links coloured by nature |
| GU-11 | `buildFGData` | Community mode | Node colour from palette, not subject colour |
| GU-12 | `buildFGData` | Duplicate edges (same src/tgt) | Only one link in output |
| GU-13 | `buildFGData` | Edge references missing node | Edge excluded from links |
| GU-14 | `buildSemanticFGData` | Normal input | Nodes have fx/fy/fz pinned, links empty |
| GU-15 | `nodeNeighbours` | Node with 2 connections | Returns 2 neighbours |
| GU-16 | `nodeNeighbours` | Node with no connections | Returns empty array |
| GU-17 | `communityColour` | id=0 | Returns first palette colour |
| GU-18 | `communityColour` | id > palette length | Wraps around (modulo) |

### 2. `api.ts` — API fetch functions (unit tests, fetch mocked)

| ID | Function | Scenario | Expected |
|----|----------|----------|----------|
| API-01 | `fetchGraph` | 200 response | Returns parsed GraphResponse |
| API-02 | `fetchGraph` | yearFrom/yearTo params | Correct query params in URL |
| API-03 | `fetchGraph` | 500 response | Throws error with status |
| API-04 | `fetchSemanticClusters` | n_clusters param | Correct query param in URL |
| API-05 | `fetchSemanticClusters` | 200 response | Returns SemanticClusterResponse |

### 3. `ConceptChip`, `StatCard`, `OccurrenceCard` — component smoke tests

| ID | Component | Scenario | Expected |
|----|-----------|----------|----------|
| CM-01 | `StatCard` | Renders with label + value | Both visible in output |
| CM-02 | `ConceptChip` | Renders term | Term text visible |
| CM-03 | `OccurrenceCard` | Renders occurrence | Key fields rendered |

---

## Out of scope

- ForceGraph3D rendering (WebGL, no DOM in vitest)
- Sigma rendering (same reason)
- Backend API routes (separate pytest suite)
- End-to-end browser tests (future: Playwright)

