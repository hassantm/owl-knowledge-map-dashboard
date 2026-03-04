"""Tests for GET /api/concepts and GET /api/concepts/{id} endpoints."""


def test_list_concepts_returns_all(client):
    data = client.get("/api/concepts").json()
    assert data["total"] == 3
    assert len(data["rows"]) == 3


def test_list_concepts_shape(client):
    row = client.get("/api/concepts").json()["rows"][0]
    for key in ("concept_id", "term", "occ_count", "subjects", "first_year", "last_year"):
        assert key in row


def test_list_concepts_subjects_is_list(client):
    for row in client.get("/api/concepts").json()["rows"]:
        assert isinstance(row["subjects"], list)


def test_list_concepts_ordered_by_occ_count_desc(client):
    rows = client.get("/api/concepts").json()["rows"]
    counts = [r["occ_count"] for r in rows]
    assert counts == sorted(counts, reverse=True)


def test_list_concepts_search_match(client):
    data = client.get("/api/concepts?q=empire").json()
    assert data["total"] == 1
    assert data["rows"][0]["term"] == "empire"


def test_list_concepts_search_no_match(client):
    data = client.get("/api/concepts?q=zzznomatch").json()
    assert data["total"] == 0
    assert data["rows"] == []


def test_list_concepts_search_partial(client):
    # "emp" should match "empire"
    data = client.get("/api/concepts?q=emp").json()
    assert data["total"] >= 1


def test_list_concepts_load_bearing_only(client):
    """load-bearing = 2+ occurrences. 'trade' has 1 occ so must be excluded."""
    data = client.get("/api/concepts?loadBearingOnly=true").json()
    terms = [r["term"] for r in data["rows"]]
    assert "trade" not in terms
    assert "empire" in terms
    assert "persecution" in terms


def test_list_concepts_subject_filter(client):
    data = client.get("/api/concepts?subject=Geography").json()
    assert data["total"] == 1
    assert data["rows"][0]["term"] == "trade"


def test_list_concepts_subject_filter_no_match(client):
    # No concept has occurrences in a non-existent subject
    data = client.get("/api/concepts?subject=Mathematics").json()
    assert data["total"] == 0


def test_list_concepts_pagination(client):
    page0 = client.get("/api/concepts?page=0&pageSize=2").json()
    page1 = client.get("/api/concepts?page=1&pageSize=2").json()
    assert len(page0["rows"]) == 2
    assert len(page1["rows"]) == 1
    assert page0["total"] == 3
    # No overlap between pages
    ids0 = {r["concept_id"] for r in page0["rows"]}
    ids1 = {r["concept_id"] for r in page1["rows"]}
    assert ids0.isdisjoint(ids1)


def test_get_concept_detail(client):
    r = client.get("/api/concepts/1")
    assert r.status_code == 200
    data = r.json()
    assert "concept" in data
    assert "occurrences" in data
    assert "edges" in data
    assert data["concept"]["term"] == "empire"


def test_get_concept_occurrences_sorted(client):
    """Occurrences must come back in curriculum order (Y3 Autumn1 before Y4 Spring2)."""
    occs = client.get("/api/concepts/1").json()["occurrences"]
    positions = [o["year"] * 10 for o in occs]
    assert positions == sorted(positions)


def test_get_concept_includes_edges(client):
    """empire (concept 1) is in edges 1 and 3."""
    edges = client.get("/api/concepts/1").json()["edges"]
    assert len(edges) >= 2


def test_get_concept_404(client):
    r = client.get("/api/concepts/9999")
    assert r.status_code == 404
