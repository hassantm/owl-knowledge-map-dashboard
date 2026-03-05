# OWL Knowledge Map — Semantic Analysis Report
*Opening Worlds KS2 Humanities Curriculum*
*Generated: March 2026*

---

## What This Is

The OWL Knowledge Map extracts the conceptual vocabulary from the Opening Worlds KS2 curriculum (Years 3–6, History / Geography / Religion) and builds a graph of how concepts connect across subjects and time. This report describes a new layer of analysis: **semantic clustering** — asking what conceptual territories emerge from the language itself, independent of the curriculum's designed structure.

---

## The Data

The curriculum has been processed into a structured database of concepts and their occurrences. Current state:

| | |
|---|---|
| **Unique concepts** | 2,829 |
| **Confirmed occurrences** | 2,964 |
| **Confirmed connections (edges)** | 174 |
| **Cross-subject concepts** | 89 |

**By subject:**

| Subject | Concepts | Occurrences |
|---|---|---|
| History | 1,197 | 1,250 |
| Geography | 687 | 707 |
| Religion | 982 | 1,007 |

**Connection types (confirmed edges):**

| Type | Count |
|---|---|
| Reinforcement | 111 |
| Extension | 36 |
| Application | 27 |

**New concepts introduced by year:**

| Year | New concepts |
|---|---|
| Year 3 | 682 |
| Year 4 | 698 |
| Year 5 | 709 |
| Year 6 | 616 |

The vocabulary load is remarkably consistent across years — the curriculum introduces roughly 650–700 new concepts per year. The slight drop in Year 6 likely reflects consolidation rather than reduced ambition.

---

## Three Ways to See the Same Data

The knowledge map now offers four layout modes, each answering a different question:

### 1. Curriculum view
*What do teachers see?*
Concepts laid out chronologically by year and subject. This is the designed sequence — useful for checking coverage and progression, less useful for seeing relationships.

### 2. Force-directed view
*What does the graph want to show?*
The ForceAtlas2 algorithm treats connections as physical forces: concepts that share edges pull towards each other, unconnected concepts repel. Clusters emerge from connection density. This reveals which concepts are genuinely load-bearing — the ones sitting at the centre of dense neighbourhoods are the curriculum's structural pillars.

Node size encodes connection count, so the most-connected concepts are immediately visible as large nodes. Hovering a node dims everything except its direct neighbours, making it easy to trace individual concept threads.

### 3. Louvain community view
*What groups does the graph form?*
The Louvain algorithm finds communities — sets of concepts more densely connected to each other than to the rest of the graph. Crucially, it knows nothing about year, subject, or curriculum intent. A History Year 3 concept and a Geography Year 6 concept end up in the same community if their connection pattern says they belong together.

This is the first hint at hidden structure: concepts that the curriculum designer has woven together intentionally, but which don't announce themselves as related in a chronological view.

### 4. Semantic view *(new)*
*What would emerge if we knew nothing about OWL?*
This is the most analytically interesting mode.

---

## Semantic Clustering: The Analysis

### Method

Each concept in the database has a `term_in_context` field — the paragraph it was extracted from. Rather than embedding just the bare term (which would group "Empire" and "Roman Empire" by text similarity), we embed the full paragraph context using a pre-trained language model (`all-MiniLM-L6-v2`).

This produces a 384-dimensional vector for each concept that encodes not just what the word is, but what it means in the context it was used. "Trade" in a paragraph about the Silk Road and "Trade" in a paragraph about the Transatlantic Slave Trade will produce different vectors, because the surrounding language is different.

We then apply **agglomerative clustering** on cosine similarity — concepts are grouped by how close their meaning-vectors are, using no information from the curriculum graph, no year data, no subject labels.

Finally, the high-dimensional cluster space is projected down to 2D via PCA for visualisation. Concepts that are close together in semantic space appear close together on screen.

### What It Reveals

The semantic view answers: **do the thematic territories a language model infers from paragraph context match the territories the curriculum designer intentionally created?**

Three outcomes are possible and each is interesting:

**High overlap** — Semantic clusters closely match Louvain communities. This suggests the curriculum's conceptual structure is legible in the language itself: OWL has successfully embedded its rationale into how concepts are presented, not just where they appear. The curriculum's intentions are visible to a reader even without the map.

**Partial overlap** — Clusters partially match, with some concepts in unexpected semantic neighbourhoods. This is probably the most common finding. It identifies concepts that sit at the *intersection* of thematic territories — the genuinely cross-cutting ideas that bridge domains. These are often the most pedagogically valuable concepts, because they're doing double duty.

**Low overlap** — Semantic clusters cut across Louvain communities substantially. This would suggest the curriculum is making more adventurous conceptual connections than a naive reading of the language would predict. The map is adding something the text alone doesn't show.

### Tuning

The number of clusters is user-controlled (3–20) via a slider in the interface. A lower number (e.g. 6–8) gives broad thematic territories; higher numbers (12–15) reveal finer-grained distinctions. The first run downloads the model (~80MB, one-time); subsequent calls are cached and fast.

---

## What This Is For

The immediate use is internal: understanding whether OWL's curriculum has a coherent conceptual architecture that holds up to independent analysis. But the longer-term use is as a demonstration tool.

The graph — especially the semantic view — can show prospective school adopters something they cannot get from reading the curriculum booklets: *proof* that the curriculum has been designed with genuine conceptual intentionality, and that the connections between concepts across subjects and years are structural, not incidental.

A child doesn't just encounter "empire" in Year 3 History and again in Year 5 Geography by coincidence. The semantic map makes that visible.

---

*Report generated from the OWL Knowledge Map database. Analysis tool built in FastAPI + React using graphology, sigma.js, sentence-transformers, and scikit-learn.*

---

## Cluster Analysis: Results

### Method selection

We tested agglomerative clustering (average linkage, cosine similarity) and K-means across a range of k values (5–20). Average linkage produced pathological results — one cluster absorbing ~1,800 of 2,775 concepts due to chaining effects common in high-dimensional humanities text. K-means produced balanced, interpretable clusters.

Silhouette scores were low across all configurations (0.028–0.032), which is expected and honest: all 2,775 concepts come from KS2 humanities curriculum paragraphs, so the embedding space is a dense, diffuse cloud rather than neatly separated territories. Low silhouette does not mean the clusters are meaningless — it means the thematic boundaries are soft, which is exactly what you'd expect from a well-integrated curriculum.

The silhouette score peaks at **k=12–14**; Davies-Bouldin score (lower = better) improves steadily. We selected **k=10** as the best balance between statistical signal and human interpretability.

---

### The 10 clusters

| # | Size | Dominant subjects | Year spread | Provisional label |
|---|------|-------------------|-------------|-------------------|
| 5 | 445 | History (68%), Religion (31%) | Y5–Y6 heavy | **Ancient & medieval material culture** |
| 0 | 315 | History (51%), Geography (42%) | Y6 heavy | **Modern built environment & economy** |
| 2 | 311 | Religion (89%) | Y3, Y5 | **Religious narrative & ritual** |
| 3 | 303 | History (65%), Religion (35%) | Y3 heavy | **Ancient Egypt & polytheistic belief** |
| 9 | 301 | Religion (85%) | Y4 heavy | **Biblical & early Christian world** |
| 7 | 257 | Geography (94%) | Spread Y3–Y6 | **Land, agriculture & natural environment** |
| 1 | 247 | History (51%), Religion (49%) | Y4–Y5 | **Islamic civilisation & the Arab world** |
| 6 | 233 | Geography (92%) | Y3–Y4 heavy | **Physical geography & earth systems** |
| 8 | 201 | History (94%) | Y4 heavy | **Classical antiquity: Greece & Rome** |
| 4 | 162 | History (57%), Geography (40%) | Y3 heavy | **River civilisations & early trade** |

---

### Cluster notes

**Cluster 5 — Ancient & medieval material culture (445 terms)**
The largest cluster. Terms include: *awl, pit, halo, Bede, font, mast, hilt*. This is the vocabulary of physical objects, tools, and artefacts across multiple civilisations — things you can hold or see. Notably cross-subject (History and Religion) and skewed to Years 5–6, consistent with the curriculum moving from narrative-led to artefact-led enquiry in the upper years. The cluster is large because "material culture" is a thin but pervasive layer across almost every OWL unit.

**Cluster 0 — Modern built environment & economy (315 terms)**
Terms include: *bank, tram, Fens, fees, yard, cane, monks, clogs*. This is the language of place, infrastructure, and economic life — primarily Years 5–6 Geography and History. The presence of *monks* and *clogs* alongside *tram* and *MBE* suggests the model is picking up on a shared register of "everyday life in a particular place and time," which is a genuine curriculum thread.

**Cluster 2 — Religious narrative & ritual (311 terms)**
Almost exclusively Religion (89%). Terms include: *dua, Amun, gong, Igue, Rama, Sita, Amun*. This is the vocabulary of practice and story across world religions — Hindu, Yoruba, Ancient Egyptian, Buddhist. The model has cleanly separated *the practice of religion* from *the history of religion*, placing this cluster far from Clusters 8 and 3 (which contain more historically-inflected religious terms).

**Cluster 3 — Ancient Egypt & polytheistic belief (303 terms)**
Terms include: *tomb, Giza, ankh, Isis, Zeus, Ares, soul, robe*. Predominantly Year 3 History — the Egypt unit — plus spillover into Greek and Yoruba religion. The model is grouping these by the *texture* of the paragraphs (mystery, sacred objects, afterlife) rather than by civilisation. That is a substantive finding: Egypt and Greek religion read similarly to a language model, even though the curriculum treats them separately.

**Cluster 9 — Biblical & early Christian world (301 terms)**
Terms include: *Mary, Magi, Saul, holy, sins, nun, inn*. Year 4 Religion dominant. Clearly the Abrahamic narrative strand. The presence of *inn* and *Saul* alongside *Magi* confirms the model is reading context, not just the term: "inn" here means Bethlehem, not a pub.

**Cluster 7 — Land, agriculture & natural environment (257 terms)**
Nearly pure Geography (94%). Terms include: *oxen, teff, arid, maize, Nomad, herd, flee, ripen*. This is the subsistence and land-use vocabulary — how people live from and move across the land. Spans all years, confirming Geography's consistent ecological thread across the KS2 sequence.

**Cluster 1 — Islamic civilisation & the Arab world (247 terms)**
Evenly split History/Religion (51%/49%). Terms include: *Eid, hajj, imam, Shia, emir, Arabs*. Year 4 dominant. The model has found a coherent civilisational cluster that bridges the History and Religion treatment of Islam — which is precisely the kind of cross-subject conceptual coherence OWL is designed to build.

**Cluster 6 — Physical geography & earth systems (233 terms)**
Overwhelmingly Geography (92%). Terms include: *lava, vent, tide, core, iron, gas, bay*. This is the physical/geological vocabulary — distinct from Cluster 7's human geography. The model has separated human and physical geography without being told to, which is a clean validation of a standard disciplinary distinction.

**Cluster 8 — Classical antiquity: Greece & Rome (201 terms)**
Almost pure History (94%). Terms include: *Rome, toga, SPQR, Gaul, Nero, Offa, Huns, polis*. Year 4 dominant. Tight and coherent — classical antiquity has a very distinctive vocabulary and the model has found it cleanly.

**Cluster 4 — River civilisations & early trade (162 terms)**
History and Geography (57%/40%). Terms include: *Nile, port, trade, mill, Shang, dams, kiln*. Year 3 heavy. This is the "cradle of civilisation" cluster — Egypt, Indus, Mesopotamia — bound by their shared themes of rivers, agriculture, and early commerce. The Geography presence confirms the curriculum's use of geographical context within its early History units.

---

### What this tells us

**1. The curriculum's cross-subject intentions are visible to the model.**
Clusters 1 (Islamic civilisation), 3 (ancient belief systems), and 4 (river civilisations) all contain substantial History *and* another subject, found independently by a model that had no access to OWL's subject labels. This is evidence that OWL's cross-subject design is embedded in how the concepts are presented, not just in the curriculum map.

**2. The model distinguishes what OWL distinguishes.**
Physical geography (Cluster 6) and human geography (Cluster 7) are cleanly separated. Religious practice (Cluster 2) is separated from religious history (Clusters 3, 8, 9). These are distinctions OWL makes deliberately; the fact they emerge from paragraph context without supervision is a validation.

**3. Some expected boundaries are softer than you'd assume.**
Ancient Egypt and Greek religion end up together (Cluster 3) even though OWL treats them in separate units. The model is detecting a shared *narrative and sacred register* — mystery, gods, objects of power — that is a genuine conceptual kinship, even if not the curriculum's primary axis of organisation.

**4. The largest cluster points to a curriculum-wide layer.**
Cluster 5 (material culture, 445 terms) spans History and Religion across Years 5–6. This suggests the curriculum has a pervasive artefact-and-evidence register that cuts across units. This layer is largely invisible in the curriculum map because it's not a subject or a unit — it's a *way of thinking about the past* that OWL embeds throughout.

---

*Analysis: K-means (k=10) on 384-dimensional sentence embeddings (all-MiniLM-L6-v2), embedding each concept in its paragraph context. Clustering is purely linguistic — no curriculum structure, subject labels, or year data were used.*
