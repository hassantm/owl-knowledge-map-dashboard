"""
Semantic clustering endpoint.

Uses sentence-transformers (all-MiniLM-L6-v2) to embed each concept's
term_in_context paragraphs, then agglomerative clustering to find semantic
groups — completely independently of the curriculum's graph structure.

Result: what conceptual territories emerge if you *don't* know the rationale?
"""

from __future__ import annotations
import json
from functools import lru_cache
from typing import Optional

from fastapi import APIRouter, Query
from pydantic import BaseModel

from api.db import get_conn

router = APIRouter()


class SemanticNode(BaseModel):
    concept_id: int
    term: str
    subject: str
    year: int
    cluster: int
    cluster_label: str
    x: float
    y: float
    z: float


class SemanticClusterResponse(BaseModel):
    nodes: list[SemanticNode]
    num_clusters: int
    cluster_labels: dict[int, str]


@lru_cache(maxsize=4)
def _compute_clusters(n_clusters: int, context_weight: float) -> str:
    """Compute and cache clusters (serialised as JSON string for lru_cache compat)."""
    import numpy as np
    from sentence_transformers import SentenceTransformer
    from sklearn.cluster import AgglomerativeClustering
    from sklearn.preprocessing import normalize
    from sklearn.decomposition import PCA

    db = get_conn()

    # Pull confirmed concepts + all their context paragraphs
    rows = db.execute("""
        SELECT
            c.concept_id,
            c.term,
            o.subject,
            o.year,
            o.term_in_context
        FROM concepts c
        JOIN occurrences o ON o.concept_id = c.concept_id
        WHERE o.validation_status IN ('confirmed', 'confirmed_with_flag')
          AND o.term_in_context IS NOT NULL
          AND o.term_in_context != ''
        ORDER BY c.concept_id, o.year
    """).fetchall()

    if not rows:
        return json.dumps({"nodes": [], "num_clusters": 0, "cluster_labels": {}})

    # Aggregate: one record per concept (first subject/year, all context joined)
    from collections import defaultdict
    concept_data: dict[int, dict] = {}
    concept_contexts: dict[int, list[str]] = defaultdict(list)

    for concept_id, term, subject, year, ctx in rows:
        if concept_id not in concept_data:
            concept_data[concept_id] = {"term": term, "subject": subject, "year": year}
        concept_contexts[concept_id].append(ctx)

    concept_ids = list(concept_data.keys())

    # Build embedding inputs: "TERM: <term>. CONTEXT: <joined contexts>"
    # Weighting the term more heavily helps distinguish same-context concepts
    texts = []
    for cid in concept_ids:
        d = concept_data[cid]
        ctx_text = " | ".join(concept_contexts[cid][:3])  # cap at 3 paragraphs
        # Repeat term to give it more weight in the embedding
        term_rep = (d["term"] + ". ") * max(1, round(context_weight))
        texts.append(f"{term_rep}{ctx_text}")

    # Embed — model is cached by sentence_transformers after first download
    model = SentenceTransformer("all-MiniLM-L6-v2")
    embeddings = model.encode(texts, show_progress_bar=False, normalize_embeddings=True)

    # Cluster
    clustering = AgglomerativeClustering(n_clusters=n_clusters, metric="cosine", linkage="average")
    labels = clustering.fit_predict(embeddings)

    # 2D projection for layout (UMAP would be better but needs extra dep; PCA is fine)
    pca = PCA(n_components=3)
    coords = pca.fit_transform(embeddings)
    # Scale to roughly ±300
    coords = coords / (np.abs(coords).max() + 1e-9) * 300

    # Auto-label clusters: find the most distinctive terms per cluster
    cluster_terms: dict[int, list[str]] = defaultdict(list)
    for i, cid in enumerate(concept_ids):
        cluster_terms[labels[i]].append(concept_data[cid]["term"])

    cluster_labels: dict[int, str] = {}
    for cid_cluster, terms in cluster_terms.items():
        # Pick shortest, most distinctive terms as label (skip very long ones)
        short = sorted([t for t in terms if len(t) < 20], key=len)[:3]
        cluster_labels[int(cid_cluster)] = ", ".join(short) if short else f"Cluster {cid_cluster}"

    nodes = []
    for i, cid in enumerate(concept_ids):
        d = concept_data[cid]
        nodes.append({
            "concept_id": cid,
            "term": d["term"],
            "subject": d["subject"],
            "year": d["year"],
            "cluster": int(labels[i]),
            "cluster_label": cluster_labels[int(labels[i])],
            "x": float(coords[i, 0]),
            "y": float(coords[i, 1]),
            "z": float(coords[i, 2]),
        })

    return json.dumps({
        "nodes": nodes,
        "num_clusters": n_clusters,
        "cluster_labels": {str(k): v for k, v in cluster_labels.items()},
    })


@router.get("/semantic-clusters", response_model=SemanticClusterResponse)
def get_semantic_clusters(
    n_clusters: int = Query(default=8, ge=2, le=30, description="Number of semantic clusters"),
    context_weight: float = Query(default=2.0, ge=1.0, le=5.0, description="How much to weight term vs context"),
):
    """
    Embed all confirmed concepts using their paragraph context, cluster by
    semantic similarity, and return 2D PCA coordinates for visualisation.

    This reveals thematic territories that exist independently of the
    curriculum's explicit graph structure.
    """
    result = _compute_clusters(n_clusters, context_weight)
    data = json.loads(result)
    return SemanticClusterResponse(**data)


@router.post("/semantic-clusters/invalidate")
def invalidate_cache():
    """Clear the cluster cache (call after new concepts are confirmed)."""
    _compute_clusters.cache_clear()
    return {"status": "cache cleared"}
