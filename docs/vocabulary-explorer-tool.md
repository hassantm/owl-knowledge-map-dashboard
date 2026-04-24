# Opening Worlds — Vocabulary Tool: Dashboard Spec
## Design & Functional Specification — Class Teacher View
 
**Project:** Opening Worlds Knowledge Map — Phase 3 Vocabulary Tool  
**Depends on:** Phase 2 enrichment pipeline and co_occurrences table (functional spec v2026-04-22)  
**Status:** Ready for implementation  
 
---
 
## 1. Overview
 
This spec covers the class teacher-facing vocabulary tool — a new panel within the existing dashboard that surfaces vocabulary intelligence derived from the knowledge graph without exposing graph topology directly.
 
Four integrated surfaces are built as a single coherent teacher journey:
 
| Surface | Entry point | Primary question answered |
|---------|-------------|--------------------------|
| **Chapter Cluster Cards** | Unit + chapter selection | What vocabulary clusters am I activating in this chapter? |
| **Semantic Neighbourhood Cloud** | Click on any word | What conceptual company does this word keep? |
| **LLM Teacher Briefing** | Click on any word | What do I need to know to teach this word well? |
| **Bridge Word Callout** | Conditional — appears within cards and briefing | Does this word connect to another subject? |
 
Bridge word callouts are a **property** surfaced across the other three surfaces, not a standalone view.
 
---
 
## 2. Schema Reference (live `owl` database)
 
Relevant columns used in this spec:
 
```
concepts:    concept_id, term, subject_area, definition, etymology,
             word_family, register, tier, enrichment_status
 
occurrences: occurrence_id, concept_id, subject, year, term (period),
             unit (text), chapter (text), slide_number,
             is_introduction (int 0/1), term_in_context
 
co_occurrences: id, concept_a_id, concept_b_id, subject_a, subject_b,
                granularity, weight, is_cross_subject (generated bool)
```
 
Key schema constraints to respect in all queries:
- Unit identity = TEXT equality on `occurrences.unit` (no numeric unit_id)
- Chapter identity = TEXT equality on `occurrences.chapter`
- Lesson co-occurrence join: `unit` AND `slide_number` must both match
- Chapter co-occurrence join: `unit` AND `chapter` must both match
- `is_introduction` is INTEGER (0/1), not BOOLEAN
- `subject` values: `'History'`, `'Geography'`, `'Religion'`
- Only concepts with `enrichment_status = 'approved'` should appear in the teacher-facing UI
---
 
## 3. User Journey
 
### 3.1 Entry: Unit and Chapter Selection
 
Teacher selects from cascading dropdowns:
 
```
Subject → Year → Unit → Chapter
```
 
These are populated from distinct values in the `occurrences` table — no separate lookup table needed.
 
```sql
-- Subjects
SELECT DISTINCT subject FROM occurrences ORDER BY subject;
 
-- Years for subject
SELECT DISTINCT year FROM occurrences
WHERE subject = :subject ORDER BY year;
 
-- Units for subject + year
SELECT DISTINCT unit FROM occurrences
WHERE subject = :subject AND year = :year ORDER BY unit;
 
-- Chapters for unit
SELECT DISTINCT chapter FROM occurrences
WHERE unit = :unit AND chapter IS NOT NULL ORDER BY chapter;
```
 
On chapter selection → fetch and render cluster cards.
 
### 3.2 Word selection
 
Clicking any word chip anywhere in the UI (cluster card, neighbourhood cloud) → opens the word detail panel showing neighbourhood cloud + briefing for that word. The panel is a slide-in drawer or persistent right panel depending on screen width.
 
---
 
## 4. Backend API Endpoints
 
All endpoints are added to the existing Flask/FastAPI backend. Prefix: `/api/vocabulary`
 
### 4.1 `GET /api/vocabulary/navigation`
 
Returns the full subject → year → unit → chapter hierarchy for populating the selection UI.
 
**Response:**
```json
{
  "subjects": ["Geography", "History", "Religion"],
  "hierarchy": {
    "History": {
      "4": {
        "The Roman Empire": ["The rise of Rome", "Roman Britain", "The fall of Rome"],
        "...": []
      }
    }
  }
}
```
 
### 4.2 `GET /api/vocabulary/chapter-clusters`
 
**Params:** `unit`, `chapter`
 
**Processing (server-side):**
1. Fetch all approved concepts appearing in this chapter
2. Fetch chapter-level co-occurrence pairs scoped to this chapter
3. Build weighted graph in NetworkX
4. Run Louvain community detection → clusters
5. Score centre node per cluster
6. Flag bridge words
7. Generate cluster labels via LLM (one call per cluster)
8. Return structured response
**Response:**
```json
{
  "unit": "The Roman Empire",
  "chapter": "The rise of Rome",
  "clusters": [
    {
      "cluster_id": 0,
      "label": "Power & Governance",
      "label_generated": true,
      "centre_concept": {
        "concept_id": 12,
        "term": "empire",
        "tier": 3,
        "is_bridge": true,
        "bridge_subjects": ["Geography"]
      },
      "concepts": [
        {
          "concept_id": 12,
          "term": "empire",
          "tier": 3,
          "is_introduction": true,
          "is_centre": true,
          "is_bridge": true,
          "bridge_subjects": ["Geography"]
        },
        {
          "concept_id": 15,
          "term": "conquest",
          "tier": 3,
          "is_introduction": false,
          "is_centre": false,
          "is_bridge": false,
          "bridge_subjects": []
        }
      ]
    }
  ]
}
```
 
### 4.3 `GET /api/vocabulary/word-detail`
 
**Params:** `concept_id`, `unit` (for trajectory context), `chapter` (for neighbourhood scoping)
 
**Processing (server-side):**
1. Fetch precomputed fields from concepts table (free — no LLM call)
2. Fetch curriculum trajectory from occurrences (ordered by year, term)
3. Fetch semantic neighbourhood from co_occurrences (lesson granularity, top 10 by weight)
4. Fetch bridge details (cross-subject co-occurrences)
5. Assemble context dict
6. Single LLM call → teacher briefing (streamed)
**Response (streamed):**
```json
{
  "concept": {
    "concept_id": 12,
    "term": "empire",
    "definition": "...",
    "etymology": "...",
    "word_family": ["empire", "imperial", "imperialism", "emperor"],
    "register": "subject-specific",
    "tier": 3
  },
  "trajectory": [
    {"year": 3, "term_period": "Autumn1", "unit": "...", "chapter": "...", "is_introduction": 1},
    {"year": 4, "term_period": "Spring1", "unit": "...", "chapter": "...", "is_introduction": 0}
  ],
  "neighbourhood": [
    {"term": "conquest", "weight": 4, "is_cross_subject": false, "subject_a": "History", "subject_b": "History"},
    {"term": "Mediterranean", "weight": 2, "is_cross_subject": true, "subject_a": "History", "subject_b": "Geography"}
  ],
  "bridge_details": [
    {"subject": "Geography", "units": ["Coasts and Rivers"], "weight": 2}
  ],
  "briefing": "...streamed text..."
}
```
 
---
 
## 5. Server-Side Processing
 
### 5.1 Chapter Concept Fetch
 
```python
def get_chapter_concepts(conn, unit: str, chapter: str) -> list[dict]:
    """Fetch all approved concepts appearing in a given chapter."""
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute("""
            SELECT DISTINCT
                c.concept_id,
                c.term,
                c.tier,
                c.register,
                MIN(o.is_introduction) AS any_introduction
            FROM occurrences o
            JOIN concepts c ON c.concept_id = o.concept_id
            WHERE o.unit    = %s
              AND o.chapter = %s
              AND c.enrichment_status = 'approved'
            GROUP BY c.concept_id, c.term, c.tier, c.register
            ORDER BY c.term
        """, (unit, chapter))
        return cur.fetchall()
```
 
### 5.2 Chapter Co-occurrence Fetch
 
Chapter-level co-occurrence: two concepts sharing the same unit + chapter (not necessarily the same slide).
 
```python
def get_chapter_cooccurrences(conn, unit: str, chapter: str) -> list[dict]:
    """
    Fetch co-occurrence pairs for concepts within a specific chapter.
    Uses a direct join on occurrences rather than the co_occurrences table,
    so we get chapter-scoped pairs regardless of granularity stored.
    """
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute("""
            SELECT
                LEAST(o1.concept_id, o2.concept_id)    AS concept_a_id,
                GREATEST(o1.concept_id, o2.concept_id) AS concept_b_id,
                COUNT(DISTINCT o1.slide_number)         AS weight
            FROM occurrences o1
            JOIN occurrences o2
                ON  o1.unit        = o2.unit
                AND o1.chapter     = o2.chapter
                AND o1.concept_id != o2.concept_id
                AND o1.concept_id  < o2.concept_id
            JOIN concepts c1 ON c1.concept_id = o1.concept_id
                             AND c1.enrichment_status = 'approved'
            JOIN concepts c2 ON c2.concept_id = o2.concept_id
                             AND c2.enrichment_status = 'approved'
            WHERE o1.unit    = %s
              AND o1.chapter = %s
            GROUP BY
                LEAST(o1.concept_id, o2.concept_id),
                GREATEST(o1.concept_id, o2.concept_id)
            HAVING COUNT(DISTINCT o1.slide_number) > 0
        """, (unit, chapter))
        return cur.fetchall()
```
 
Note: this queries occurrences directly (not co_occurrences) because chapter is a sub-granularity not stored in co_occurrences. The co_occurrences table is used for the neighbourhood cloud and bridge detection where the precomputed data is appropriate.
 
### 5.3 Clustering (NetworkX + Louvain)
 
```python
import networkx as nx
from networkx.algorithms.community import louvain_communities
 
def build_clusters(concepts: list[dict], pairs: list[dict]) -> list[list[int]]:
    """
    Build a weighted graph and run Louvain community detection.
    Returns a list of clusters, each a list of concept_ids.
    """
    G = nx.Graph()
 
    # Add all concepts as nodes (even isolated ones not in any pair)
    for c in concepts:
        G.add_node(c['concept_id'], term=c['term'], tier=c['tier'])
 
    # Add weighted edges
    for pair in pairs:
        G.add_edge(
            pair['concept_a_id'],
            pair['concept_b_id'],
            weight=pair['weight']
        )
 
    # Handle isolated nodes: they form their own single-node clusters
    # Louvain handles this, but with seed for reproducibility
    communities = louvain_communities(G, weight='weight', seed=42)
 
    # Return as list of lists of concept_ids
    return [list(community) for community in communities]
```
 
### 5.4 Centre Node Scoring
 
```python
def score_centre_node(
    cluster_concept_ids: list[int],
    concepts_by_id: dict,
    pairs: list[dict],
    bridge_concept_ids: set[int]
) -> int:
    """
    Score each concept in a cluster and return the concept_id of the centre node.
 
    Scoring dimensions:
    - within_cluster_degree (0.5): edges to other concepts in this cluster
    - is_introduction      (0.2): first appearance in curriculum = anchor concept
    - bridge_score         (0.2): cross-subject co-occurrence connections
    - tier_weight          (0.1): Tier 3 > Tier 2 > Tier 1 (subject-specific preferred)
    """
    # Build adjacency counts within cluster
    cluster_set = set(cluster_concept_ids)
    degree_within = {cid: 0 for cid in cluster_concept_ids}
 
    for pair in pairs:
        a, b = pair['concept_a_id'], pair['concept_b_id']
        if a in cluster_set and b in cluster_set:
            degree_within[a] = degree_within.get(a, 0) + pair['weight']
            degree_within[b] = degree_within.get(b, 0) + pair['weight']
 
    max_degree = max(degree_within.values(), default=1) or 1
 
    scores = {}
    for cid in cluster_concept_ids:
        c = concepts_by_id[cid]
 
        within_cluster  = (degree_within.get(cid, 0) / max_degree) * 0.5
        is_intro        = (1 if c.get('any_introduction') == 1 else 0) * 0.2
        bridge          = (1 if cid in bridge_concept_ids else 0) * 0.2
        tier_weight     = ((c.get('tier') or 1) / 3) * 0.1
 
        scores[cid] = within_cluster + is_intro + bridge + tier_weight
 
    return max(scores, key=lambda cid: scores[cid])
```
 
### 5.5 Bridge Word Detection
 
```python
def get_bridge_concept_ids(conn, concept_ids: list[int]) -> dict[int, list[str]]:
    """
    For a list of concept_ids, return those with cross-subject co-occurrences
    and the subjects they bridge to.
    """
    if not concept_ids:
        return {}
 
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute("""
            SELECT
                CASE WHEN concept_a_id = ANY(%s) THEN concept_a_id
                     ELSE concept_b_id END        AS concept_id,
                CASE WHEN concept_a_id = ANY(%s) THEN subject_b
                     ELSE subject_a END            AS other_subject
            FROM co_occurrences
            WHERE (concept_a_id = ANY(%s) OR concept_b_id = ANY(%s))
              AND is_cross_subject = true
              AND granularity = 'lesson'
        """, (concept_ids, concept_ids, concept_ids, concept_ids))
        rows = cur.fetchall()
 
    result = {}
    for row in rows:
        cid = row['concept_id']
        if cid not in result:
            result[cid] = []
        if row['other_subject'] not in result[cid]:
            result[cid].append(row['other_subject'])
 
    return result  # {concept_id: ['Geography', ...]}
```
 
### 5.6 Cluster Label Generation
 
One LLM call per cluster. Small, fast — naming not explanation.
 
```python
def generate_cluster_label(terms: list[str], centre_term: str) -> str:
    """Generate a 2–4 word thematic label for a vocabulary cluster."""
    import anthropic
    client = anthropic.Anthropic()
 
    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=20,
        messages=[{
            "role": "user",
            "content": f"""These vocabulary words appear together in a KS2 history/geography lesson.
The central word is: {centre_term}
All words: {', '.join(terms)}
 
Give a 2–4 word thematic label for this vocabulary cluster.
Respond with ONLY the label, nothing else. No punctuation."""
        }]
    )
    return response.content[0].text.strip()
```
 
### 5.7 Teacher Briefing Generation
 
Full context assembly and LLM call, streamed.
 
```python
def get_word_detail_context(conn, concept_id: int, unit: str) -> dict:
    """Assemble all DB context for a concept before the LLM call."""
 
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
 
        # 1. Precomputed fields
        cur.execute("""
            SELECT concept_id, term, definition, etymology,
                   word_family, register, tier
            FROM concepts
            WHERE concept_id = %s AND enrichment_status = 'approved'
        """, (concept_id,))
        concept = cur.fetchone()
        if not concept:
            return None
 
        # 2. Curriculum trajectory
        cur.execute("""
            SELECT year, term AS term_period, unit, chapter,
                   is_introduction, term_in_context
            FROM occurrences
            WHERE concept_id = %s
            ORDER BY year, term
        """, (concept_id,))
        trajectory = cur.fetchall()
 
        # 3. Semantic neighbourhood (lesson granularity, top 10)
        cur.execute("""
            SELECT
                c2.term,
                co.weight,
                co.is_cross_subject,
                co.subject_a,
                co.subject_b
            FROM co_occurrences co
            JOIN concepts c2
                ON c2.concept_id = CASE
                    WHEN co.concept_a_id = %s THEN co.concept_b_id
                    ELSE co.concept_a_id END
            WHERE (co.concept_a_id = %s OR co.concept_b_id = %s)
              AND co.granularity = 'lesson'
              AND c2.enrichment_status = 'approved'
            ORDER BY co.is_cross_subject DESC, co.weight DESC
            LIMIT 10
        """, (concept_id, concept_id, concept_id))
        neighbourhood = cur.fetchall()
 
        # 4. Bridge details
        cur.execute("""
            SELECT
                CASE WHEN concept_a_id = %s THEN subject_b
                     ELSE subject_a END AS other_subject,
                SUM(weight)             AS weight,
                granularity
            FROM co_occurrences
            WHERE (concept_a_id = %s OR concept_b_id = %s)
              AND is_cross_subject = true
            GROUP BY other_subject, granularity
            ORDER BY weight DESC
        """, (concept_id, concept_id, concept_id))
        bridge_details = cur.fetchall()
 
    return {
        'concept':       concept,
        'trajectory':    trajectory,
        'neighbourhood': neighbourhood,
        'bridge_details': bridge_details,
        'current_unit':  unit
    }
 
 
def build_briefing_prompt(ctx: dict) -> str:
    c = ctx['concept']
 
    trajectory_str = '\n'.join([
        f"  - Year {t['year']}, {t['term_period']}: {t['unit']}"
        f"{' — Chapter: ' + t['chapter'] if t['chapter'] else ''}"
        f" ({'first introduction' if t['is_introduction'] == 1 else 'recurrence'})"
        for t in ctx['trajectory']
    ])
 
    neighbourhood_str = '\n'.join([
        f"  - '{n['term']}'"
        f" ({'cross-subject: ' + n['subject_a'] + ' → ' + n['subject_b'] if n['is_cross_subject'] else 'within ' + n['subject_a']},"
        f" co-occurrence weight: {n['weight']})"
        for n in ctx['neighbourhood']
    ])
 
    bridge_str = '\n'.join([
        f"  - Connects to {b['other_subject']} (weight: {b['weight']}, at {b['granularity']} level)"
        for b in ctx['bridge_details']
    ]) if ctx['bridge_details'] else '  None identified'
 
    return f"""You are a curriculum knowledge assistant for a KS2 humanities programme \
grounded in Core Knowledge principles (E.D. Hirsch). Your audience is a primary school \
teacher who is preparing to teach this vocabulary word. Write as a knowledgeable \
colleague, not a textbook. Plain, collegial English. No bullet points.
 
WORD: {c['term']}
 
STABLE KNOWLEDGE:
- Definition: {c['definition']}
- Etymology: {c['etymology']}
- Word family: {', '.join(c['word_family'] or [])}
- Register: {c['register']}
- Vocabulary tier (Beck): {c['tier']}
 
CURRICULUM TRAJECTORY:
{trajectory_str}
 
CONCEPTUAL NEIGHBOURHOOD (words taught alongside this one):
{neighbourhood_str}
 
CROSS-SUBJECT BRIDGE CONNECTIONS:
{bridge_str}
 
TASK:
Write a 150–200 word teacher briefing covering:
1. What this word means and where it comes from
2. Why it appears at this point in the curriculum sequence
3. What conceptual cluster it belongs to in this unit
4. Any cross-subject connections worth making explicit to pupils
 
The briefing should read like advice from a deeply knowledgeable colleague, \
not a dictionary entry. Avoid bullet points. Do not use the word 'delve'."""
```
 
---
 
## 6. Frontend Components
 
### 6.1 Component Tree
 
```
<VocabularyTool>
  <ChapterSelector />              ← cascading dropdowns
  <ClusterCardsView>               ← main chapter view
    <ClusterCard />                ← one per community
      <WordChip />                 ← one per concept in cluster
      <BridgeCallout />            ← conditional, cross-subject words
  <WordDetailPanel>                ← slide-in on word click
    <NeighbourhoodCloud />         ← chip cloud sized by weight
    <TeacherBriefing />            ← streamed LLM output
    <TrajectoryTimeline />         ← when does this word appear?
```
 
### 6.2 ChapterSelector
 
Cascading selects. On final selection (chapter), calls `/api/vocabulary/chapter-clusters`.
 
```jsx
// State: { subject, year, unit, chapter }
// Each selection fetches options for the next level
// Chapter selection triggers cluster fetch
```
 
### 6.3 ClusterCard
 
```jsx
function ClusterCard({ cluster }) {
  return (
    <div className="cluster-card">
      <div className="cluster-header">
        <span className="cluster-label">{cluster.label}</span>
        {cluster.centre_concept.is_bridge && (
          <BridgeCallout subjects={cluster.centre_concept.bridge_subjects} />
        )}
      </div>
      <div className="word-chips">
        {cluster.concepts.map(concept => (
          <WordChip
            key={concept.concept_id}
            concept={concept}
            onClick={() => onWordSelect(concept.concept_id)}
          />
        ))}
      </div>
    </div>
  )
}
```
 
### 6.4 WordChip
 
Displays a single word. Visual variants:
 
| State | Style |
|-------|-------|
| Default | Neutral chip |
| Centre node | Slightly larger, bold |
| First introduction | Underline or dot indicator |
| Bridge word | Coloured border or icon |
| Centre + bridge | Both |
 
```jsx
function WordChip({ concept, onClick }) {
  const classes = [
    'word-chip',
    concept.is_centre        ? 'word-chip--centre'    : '',
    concept.is_introduction  ? 'word-chip--new'       : '',
    concept.is_bridge        ? 'word-chip--bridge'    : '',
    `word-chip--tier-${concept.tier}`
  ].filter(Boolean).join(' ')
 
  return (
    <button className={classes} onClick={onClick}>
      {concept.term}
      {concept.is_bridge && (
        <span className="bridge-icon" title={`Also in: ${concept.bridge_subjects.join(', ')}`}>
          ↗
        </span>
      )}
    </button>
  )
}
```
 
### 6.5 BridgeCallout
 
Small contextual marker shown on cluster cards where the centre node is a bridge word.
 
```jsx
function BridgeCallout({ subjects }) {
  return (
    <span className="bridge-callout">
      Also in: {subjects.join(', ')}
    </span>
  )
}
```
 
### 6.6 NeighbourhoodCloud
 
Renders the concept's co-occurrence neighbourhood as a chip cloud. Size encodes co-occurrence weight; cross-subject chips use a distinct colour.
 
```jsx
function NeighbourhoodCloud({ neighbourhood, onWordSelect }) {
  const maxWeight = Math.max(...neighbourhood.map(n => n.weight))
 
  return (
    <div className="neighbourhood-cloud">
      {neighbourhood.map(n => {
        const size = 0.75 + (n.weight / maxWeight) * 0.75  // 0.75rem to 1.5rem
        return (
          <button
            key={n.term}
            className={`neighbour-chip ${n.is_cross_subject ? 'neighbour-chip--cross' : ''}`}
            style={{ fontSize: `${size}rem` }}
            onClick={() => onWordSelect(n.term)}
            title={n.is_cross_subject
              ? `Cross-subject: ${n.subject_a} ↔ ${n.subject_b}`
              : `Co-occurrence weight: ${n.weight}`}
          >
            {n.term}
            {n.is_cross_subject && <span className="cross-subject-marker">↗</span>}
          </button>
        )
      })}
    </div>
  )
}
```
 
### 6.7 TeacherBriefing
 
Streams the LLM response. Shows a loading state while generating.
 
```jsx
function TeacherBriefing({ conceptId, unit, chapter }) {
  const [briefing, setBriefing] = useState('')
  const [loading, setLoading]   = useState(true)
 
  useEffect(() => {
    setBriefing('')
    setLoading(true)
 
    const params = new URLSearchParams({ concept_id: conceptId, unit, chapter })
 
    fetch(`/api/vocabulary/word-detail?${params}`)
      .then(res => {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
 
        function read() {
          reader.read().then(({ done, value }) => {
            if (done) { setLoading(false); return }
            setBriefing(prev => prev + decoder.decode(value))
            read()
          })
        }
        read()
      })
 
  }, [conceptId, unit, chapter])
 
  return (
    <div className="teacher-briefing">
      {loading && <span className="briefing-cursor">▋</span>}
      <p>{briefing}</p>
    </div>
  )
}
```
 
### 6.8 WordDetailPanel
 
Slide-in panel triggered by word selection. Contains neighbourhood cloud, briefing, and trajectory.
 
```
┌──────────────────────────────────────────────┐
│  empire                    Tier 3 · History  │
│  ↗ Bridge word: also in Geography            │
│──────────────────────────────────────────────│
│  CONCEPTUAL NEIGHBOURHOOD                    │
│                                              │
│   conquest   senate  ↗Mediterranean  emperor│
│   (large)    (med)       (sm, geo)    (med)  │
│                                              │
│──────────────────────────────────────────────│
│  TEACHER BRIEFING                    [copy]  │
│                                              │
│  Empire derives from the Latin imperium...   │
│  ▋ (streaming)                               │
│                                              │
│──────────────────────────────────────────────│
│  CURRICULUM TRAJECTORY                       │
│  Yr3 Aut1 → [introduced]                     │
│  Yr4 Spr1 → [recurrence]                     │
│  Yr5 Aut2 → [recurrence]                     │
└──────────────────────────────────────────────┘
```
 
---
 
## 7. Integration with Existing Dashboard
 
The vocabulary tool is added as a new tab or route within the existing dashboard — it does not replace the Cytoscape graph view. Recommended routing:
 
```
/dashboard/graph          ← existing Cytoscape view (unchanged)
/dashboard/vocabulary     ← new teacher vocabulary tool
```
 
The two views share the same backend but serve different user roles:
- Graph view: curriculum designers, system administrators
- Vocabulary view: class teachers
No changes are required to the existing graph view.
 
---
 
## 8. Data Flow Summary
 
```
Teacher selects chapter
        │
        ▼
GET /api/vocabulary/chapter-clusters?unit=...&chapter=...
        │
        ├─ get_chapter_concepts()        ← occurrences JOIN concepts
        ├─ get_chapter_cooccurrences()   ← occurrences self-join
        ├─ build_clusters()              ← NetworkX + Louvain
        ├─ score_centre_node()           ← composite score
        ├─ get_bridge_concept_ids()      ← co_occurrences WHERE is_cross_subject
        └─ generate_cluster_label()      ← 1 LLM call per cluster (small)
        │
        ▼
Cluster cards render
        │
Teacher clicks word
        │
        ▼
GET /api/vocabulary/word-detail?concept_id=...&unit=...
        │
        ├─ concepts (precomputed fields) ← free
        ├─ occurrences (trajectory)      ← free
        ├─ co_occurrences (neighbourhood)← free
        └─ build_briefing_prompt()
           → 1 LLM call (streamed)       ← 150–200 words
        │
        ▼
WordDetailPanel renders (streaming)
```
 
---
 
## 9. Dependencies
 
**Backend additions:**
```
python-louvain       # Louvain community detection (wraps NetworkX)
networkx             # already in stack
anthropic            # already in stack
```
 
**Frontend additions:**
None — built with existing React stack.
 
**Install:**
```bash
pip install python-louvain --break-system-packages
```
 
Note: `python-louvain` exposes as `community` in Python. NetworkX 3.x also includes `louvain_communities` natively in `networkx.algorithms.community` — use whichever matches the installed NetworkX version. Check with `import networkx; print(networkx.__version__)`.
 
---
 
## 10. Execution Order
 
```bash
# 1. Verify enrichment is complete before building UI
psql owl -c "SELECT enrichment_status, COUNT(*) FROM concepts GROUP BY 1"
# All or majority should be 'approved'
 
# 2. Verify co_occurrences table is populated
psql owl -c "SELECT granularity, COUNT(*) FROM co_occurrences GROUP BY 1"
psql owl -c "SELECT COUNT(*) FROM co_occurrences WHERE is_cross_subject = true"
 
# 3. Install Louvain
pip install python-louvain --break-system-packages
 
# 4. Add backend endpoints to existing Flask/FastAPI app
 
# 5. Test clustering endpoint with a known chapter
curl "http://localhost:5000/api/vocabulary/chapter-clusters?unit=Christianity+in+3+empires&chapter=..."
 
# 6. Build and integrate React components
 
# 7. Smoke test full journey: select chapter → click word → verify briefing streams
```
 
---
 
## 11. Implementation Notes for Claude Code
 
- Chapter co-occurrence is computed on-the-fly from occurrences (not from the co_occurrences table) because chapter is a sub-granularity not stored there. This is intentional.
- The co_occurrences table IS used for neighbourhood cloud and bridge detection, where precomputed lesson-level data is appropriate and more accurate.
- Louvain is non-deterministic by default — pass `seed=42` for reproducible cluster assignments across page loads.
- Isolated concepts (appearing in a chapter but with no co-occurring partners) will form single-node clusters. These should render as small single-chip cards rather than being suppressed.
- Cluster label LLM calls are made server-side at request time. For the PoC this is fine. A caching layer (e.g. store generated labels in a `chapter_cluster_labels` table keyed on unit+chapter+cluster_member_hash) can be added later.
- Stream the briefing using Server-Sent Events or chunked transfer encoding depending on the existing backend framework.
- Only concepts with `enrichment_status = 'approved'` should appear in any teacher-facing surface. Enforce this in every query, not just at the API boundary.
- The `term` column on `occurrences` means teaching period (e.g. 'Autumn1'). The `term` column on `concepts` means the vocabulary word itself. These are the same column name on different tables — be careful in joins.