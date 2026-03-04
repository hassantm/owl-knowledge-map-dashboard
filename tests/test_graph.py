"""Tests for GET /api/graph endpoint."""


def test_graph_returns_required_keys(client):
    r = client.get("/api/graph")
    assert r.status_code == 200
    data = r.json()
    for key in ("nodes", "edges", "node_count", "edge_count"):
        assert key in data


def test_graph_counts_match_lists(client):
    data = client.get("/api/graph").json()
    assert data["node_count"] == len(data["nodes"])
    assert data["edge_count"] == len(data["edges"])


def test_graph_node_has_curriculum_position(client):
    """curriculum_position = year * 10 + term_order (Autumn1=1)."""
    nodes = client.get("/api/graph").json()["nodes"]
    assert len(nodes) > 0
    for node in nodes:
        assert "curriculum_position" in node
        # position must be plausible for Y3–Y6 curriculum
        assert 30 <= node["curriculum_position"] <= 67


def test_graph_node_shape(client):
    node = client.get("/api/graph").json()["nodes"][0]
    for key in ("id", "term", "concept_id", "subject", "year", "term_period",
                "unit", "is_introduction", "curriculum_position"):
        assert key in node


def test_graph_edge_shape(client):
    edge = client.get("/api/graph").json()["edges"][0]
    for key in ("source", "target", "edge_type", "edge_nature"):
        assert key in edge


def test_graph_filter_by_edge_nature_application(client):
    data = client.get("/api/graph?edgeNature=application").json()
    assert all(e["edge_nature"] == "application" for e in data["edges"])
    # extension and reinforcement edges must be absent
    natures = {e["edge_nature"] for e in data["edges"]}
    assert "extension" not in natures
    assert "reinforcement" not in natures


def test_graph_filter_by_edge_nature_extension(client):
    data = client.get("/api/graph?edgeNature=extension").json()
    assert all(e["edge_nature"] == "extension" for e in data["edges"])


def test_graph_filter_by_subject(client):
    """?subject=Geography should return only edges where at least one end is Geography."""
    data = client.get("/api/graph?subject=Geography").json()
    # trade (Geography) has no confirmed edges in seed data, so expect empty
    assert data["edge_count"] == 0


def test_graph_filter_by_subject_religion(client):
    data = client.get("/api/graph?subject=Religion").json()
    assert data["edge_count"] > 0
    # Nodes must include Religion occurrences
    subjects = {n["subject"] for n in data["nodes"]}
    assert "Religion" in subjects


def test_graph_year_filter_excludes_out_of_range(client):
    """yearFrom=5 should exclude Y3/Y4 occurrences as from-endpoints."""
    data = client.get("/api/graph?yearFrom=5").json()
    for node in data["nodes"]:
        assert node["year"] >= 5


def test_graph_no_unconfirmed_edges(client):
    """Occurrence 6 is unconfirmed — it must never appear in the graph."""
    data = client.get("/api/graph").json()
    node_ids = {n["id"] for n in data["nodes"]}
    assert 6 not in node_ids
