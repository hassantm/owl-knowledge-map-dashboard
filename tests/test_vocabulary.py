"""
Backend tests for the Vocabulary Explorer Tool endpoints and helpers.

Uses the in-memory SQLite fixture from conftest.py.
"""

import json
import re
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from api.routes.vocabulary import (
    _build_clusters,
    _get_bridge_map,
    _get_chapter_concepts,
    _get_chapter_cooccurrences,
    _score_centre_node,
)


# ── Unit tests (no TestClient, import helpers directly) ───────────────────────

class FakeConn:
    """Minimal SQLite-backed connection wrapper for direct helper tests."""
    def __init__(self, conn):
        self._conn = conn

    def cursor(self, cursor_factory=None):
        return _DictCursor(self._conn.cursor())

    def close(self):
        pass


class _DictCursor:
    def __init__(self, cur):
        self._cur = cur

    def __enter__(self):
        return self

    def __exit__(self, *args):
        pass

    def execute(self, sql, params=()):
        sql = sql.replace("LEAST(", "MIN(").replace("GREATEST(", "MAX(")
        sql = re.sub(r"::\w+", "", sql)
        sql = sql.replace("%s", "?")
        self._cur.execute(sql, params)

    def fetchall(self):
        cols = [d[0] for d in self._cur.description]
        return [dict(zip(cols, row)) for row in self._cur.fetchall()]

    def fetchone(self):
        row = self._cur.fetchone()
        if row is None:
            return None
        cols = [d[0] for d in self._cur.description]
        return dict(zip(cols, row))


def test_build_clusters_handles_isolated_nodes():
    concepts = [
        {"concept_id": 1, "term": "empire", "tier": 3},
        {"concept_id": 2, "term": "republic", "tier": 3},
    ]
    pairs = []  # no co-occurrences → two singletons
    clusters = _build_clusters(concepts, pairs)
    assert len(clusters) == 2
    assert {1} in [set(c) for c in clusters]
    assert {2} in [set(c) for c in clusters]


def test_build_clusters_is_deterministic_with_seed():
    concepts = [{"concept_id": i, "term": f"word{i}", "tier": 2} for i in range(1, 8)]
    pairs = [
        {"concept_a_id": 1, "concept_b_id": 2, "weight": 3},
        {"concept_a_id": 2, "concept_b_id": 3, "weight": 2},
        {"concept_a_id": 4, "concept_b_id": 5, "weight": 4},
        {"concept_a_id": 5, "concept_b_id": 6, "weight": 1},
    ]
    first  = [sorted(c) for c in _build_clusters(concepts, pairs)]
    second = [sorted(c) for c in _build_clusters(concepts, pairs)]
    assert first == second


def test_score_centre_node_prefers_high_degree():
    concepts_by_id = {
        1: {"term": "empire",   "tier": 3, "any_introduction": 0},
        2: {"term": "republic", "tier": 3, "any_introduction": 0},
        3: {"term": "senate",   "tier": 2, "any_introduction": 0},
    }
    pairs = [
        {"concept_a_id": 1, "concept_b_id": 2, "weight": 5},
        {"concept_a_id": 1, "concept_b_id": 3, "weight": 4},
    ]
    centre = _score_centre_node([1, 2, 3], concepts_by_id, pairs, set())
    # concept 1 has edges to both others — highest within-cluster degree
    assert centre == 1


def test_score_centre_node_tier_breaks_ties():
    concepts_by_id = {
        10: {"term": "consul",   "tier": 3, "any_introduction": 0},
        11: {"term": "plebeian", "tier": 1, "any_introduction": 0},
    }
    # No edges → degree is 0 for both; tier 3 beats tier 1
    centre = _score_centre_node([10, 11], concepts_by_id, [], set())
    assert centre == 10


def test_score_centre_node_bridge_contribution():
    concepts_by_id = {
        1: {"term": "empire", "tier": 2, "any_introduction": 0},
        2: {"term": "trade",  "tier": 2, "any_introduction": 0},
    }
    # No edges, same tier — bridge set decides
    centre = _score_centre_node([1, 2], concepts_by_id, [], {2})
    assert centre == 2


# ── Endpoint tests ────────────────────────────────────────────────────────────

def test_navigation_hierarchy_shape(client):
    res = client.get("/api/vocabulary/navigation")
    assert res.status_code == 200
    data = res.json()
    assert "subjects" in data
    assert "hierarchy" in data
    assert isinstance(data["subjects"], list)
    # History is in the seed data
    assert "History" in data["subjects"]
    # Nested structure: subjects → years → units → chapters
    for subj, years in data["hierarchy"].items():
        for yr, units in years.items():
            for unit, chapters in units.items():
                assert isinstance(chapters, list)


def test_chapter_clusters_returns_expected_shape(client):
    with patch("api.routes.vocabulary._cluster_label_cached") as mock_label:
        mock_label.return_value = ("Power & Governance", True)

        async def fake_label(*args, **kwargs):
            return ("Power & Governance", True)

        mock_label.side_effect = fake_label

        res = client.get(
            "/api/vocabulary/chapter-clusters",
            params={"unit": "Ancient Egypt", "chapter": "1. Pharaohs"},
        )
    assert res.status_code == 200
    data = res.json()
    assert data["unit"] == "Ancient Egypt"
    assert data["chapter"] == "1. Pharaohs"
    assert "clusters" in data
    for cluster in data["clusters"]:
        assert "cluster_id" in cluster
        assert "label" in cluster
        assert "centre_concept" in cluster
        assert "concepts" in cluster
        for c in cluster["concepts"]:
            assert "concept_id" in c
            assert "term" in c
            assert "is_introduction" in c
            assert isinstance(c["is_introduction"], bool)


def test_chapter_clusters_only_approved_concepts(client):
    res = client.get(
        "/api/vocabulary/chapter-clusters",
        params={"unit": "Ancient Egypt", "chapter": "1. Pharaohs"},
    )
    assert res.status_code == 200
    data = res.json()
    all_terms = [c["term"] for cluster in data["clusters"] for c in cluster["concepts"]]
    assert "pending_word" not in all_terms


def test_chapter_clusters_empty_chapter_returns_empty_list(client):
    res = client.get(
        "/api/vocabulary/chapter-clusters",
        params={"unit": "NONEXISTENT UNIT", "chapter": "NONEXISTENT CHAPTER"},
    )
    assert res.status_code == 200
    data = res.json()
    assert data["clusters"] == []


def test_word_detail_404_on_unknown_concept(client):
    res = client.get(
        "/api/vocabulary/word-detail",
        params={"concept_id": 99999, "unit": "Ancient Egypt", "chapter": "1. Pharaohs"},
    )
    assert res.status_code == 404


def test_word_detail_sse_context_frame_first(client):
    """The first SSE frame emitted must be event:context with a valid JSON payload."""
    mock_stream_ctx = MagicMock()
    mock_stream_ctx.__enter__ = MagicMock(return_value=mock_stream_ctx)
    mock_stream_ctx.__exit__ = MagicMock(return_value=False)
    mock_stream_ctx.text_stream = iter(["Empire ", "is key."])

    mock_final = MagicMock()
    mock_final.usage.input_tokens = 100
    mock_final.usage.output_tokens = 50
    mock_final.usage.cache_read_input_tokens = 0
    mock_final.usage.cache_creation_input_tokens = 0
    mock_stream_ctx.get_final_message = MagicMock(return_value=mock_final)

    mock_anthropic_client = MagicMock()
    mock_anthropic_client.messages.stream = MagicMock(return_value=mock_stream_ctx)

    with patch("api.routes.vocabulary.anthropic.Anthropic", return_value=mock_anthropic_client):
        res = client.get(
            "/api/vocabulary/word-detail",
            params={"concept_id": 1, "unit": "Ancient Egypt", "chapter": "1. Pharaohs"},
        )

    assert res.status_code == 200
    raw = res.text
    frames = [f.strip() for f in raw.split("\n\n") if f.strip()]
    assert len(frames) >= 1

    first_frame = frames[0]
    assert "event: context" in first_frame

    data_line = next(l for l in first_frame.split("\n") if l.startswith("data: "))
    payload = json.loads(data_line[6:])
    assert "concept" in payload
    assert "trajectory" in payload
    assert "neighbourhood" in payload
    assert "bridge_details" in payload
    assert payload["concept"]["term"] == "empire"
