"""Tests for GET /api/occurrences endpoint."""


def test_list_occurrences_returns_confirmed_only(client):
    data = client.get("/api/occurrences").json()
    # 5 confirmed occurrences in seed (occ 6 is unconfirmed)
    assert data["total"] == 5


def test_list_occurrences_shape(client):
    row = client.get("/api/occurrences").json()["rows"][0]
    for key in ("occurrence_id", "concept_id", "term", "subject", "year",
                "term_period", "unit", "is_introduction"):
        assert key in row


def test_list_occurrences_filter_subject(client):
    data = client.get("/api/occurrences?subject=Geography").json()
    assert data["total"] == 1
    assert data["rows"][0]["subject"] == "Geography"


def test_list_occurrences_filter_year(client):
    data = client.get("/api/occurrences?year=3").json()
    assert data["total"] == 2  # occ 1 (History Y3) + occ 5 (Geography Y3)
    assert all(r["year"] == 3 for r in data["rows"])


def test_list_occurrences_filter_term(client):
    data = client.get("/api/occurrences?term=Autumn1").json()
    assert data["total"] == 2
    assert all(r["term_period"] == "Autumn1" for r in data["rows"])


def test_list_occurrences_search(client):
    data = client.get("/api/occurrences?q=empire").json()
    assert data["total"] == 2  # occ 1 and occ 2
    assert all(r["term"] == "empire" for r in data["rows"])


def test_list_occurrences_search_no_match(client):
    data = client.get("/api/occurrences?q=zzznomatch").json()
    assert data["total"] == 0


def test_list_occurrences_pagination(client):
    page0 = client.get("/api/occurrences?page=0&pageSize=3").json()
    page1 = client.get("/api/occurrences?page=1&pageSize=3").json()
    assert len(page0["rows"]) == 3
    assert len(page1["rows"]) == 2
    ids0 = {r["occurrence_id"] for r in page0["rows"]}
    ids1 = {r["occurrence_id"] for r in page1["rows"]}
    assert ids0.isdisjoint(ids1)


def test_list_occurrences_combined_filters(client):
    data = client.get("/api/occurrences?subject=History&year=3").json()
    assert data["total"] == 1
    assert data["rows"][0]["occurrence_id"] == 1
