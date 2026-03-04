"""Tests for GET /api/edges and PATCH /api/edges/{from}/{to} endpoints."""


def test_list_edges_returns_all(client):
    data = client.get("/api/edges").json()
    assert data["total"] == 3
    assert len(data["edges"]) == 3


def test_list_edges_shape(client):
    edge = client.get("/api/edges").json()["edges"][0]
    for key in ("from_occurrence", "to_occurrence", "edge_type", "edge_nature",
                "confirmed_by", "term", "from_subject", "from_year", "to_subject", "to_year"):
        assert key in edge


def test_list_edges_filter_by_nature_application(client):
    data = client.get("/api/edges?edgeNature=application").json()
    assert data["total"] == 1
    assert data["edges"][0]["edge_nature"] == "application"


def test_list_edges_filter_by_nature_extension(client):
    data = client.get("/api/edges?edgeNature=extension").json()
    assert all(e["edge_nature"] == "extension" for e in data["edges"])


def test_list_edges_filter_by_type_cross_subject(client):
    data = client.get("/api/edges?edgeType=cross_subject").json()
    assert data["total"] == 2
    assert all(e["edge_type"] == "cross_subject" for e in data["edges"])


def test_list_edges_filter_by_subject(client):
    """?subject=Geography should return edges where at least one side is Geography."""
    data = client.get("/api/edges?subject=Geography").json()
    # trade (Geography) has no edges in seed data
    assert data["total"] == 0


def test_list_edges_filter_by_subject_religion(client):
    data = client.get("/api/edges?subject=Religion").json()
    assert data["total"] > 0


def test_patch_edge_updates_nature(client):
    r = client.patch("/api/edges/1/2", json={"edge_nature": "reinforcement"})
    assert r.status_code == 200
    body = r.json()
    assert body["ok"] is True
    assert body["edge_nature"] == "reinforcement"


def test_patch_edge_persists_in_subsequent_list(client):
    client.patch("/api/edges/1/2", json={"edge_nature": "reinforcement"})
    edges = client.get("/api/edges?edgeNature=reinforcement").json()["edges"]
    froms = [e["from_occurrence"] for e in edges]
    assert 1 in froms


def test_patch_edge_invalid_nature(client):
    r = client.patch("/api/edges/1/2", json={"edge_nature": "nonsense"})
    assert r.status_code == 400
    assert "edge_nature" in r.json()["detail"].lower()


def test_patch_edge_not_found(client):
    r = client.patch("/api/edges/999/998", json={"edge_nature": "extension"})
    assert r.status_code == 404


def test_patch_edge_custom_confirmed_by(client):
    r = client.patch("/api/edges/1/2", json={"edge_nature": "extension", "confirmed_by": "Test User"})
    assert r.status_code == 200
    # Verify the name was stored
    edges = client.get("/api/edges?edgeNature=extension").json()["edges"]
    match = next((e for e in edges if e["from_occurrence"] == 1 and e["to_occurrence"] == 2), None)
    assert match is not None
    assert match["confirmed_by"] == "Test User"
