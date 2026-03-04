"""Tests for GET /api/stats and /api/insights/* endpoints."""


def test_stats_shape(client):
    r = client.get("/api/stats")
    assert r.status_code == 200
    data = r.json()
    for key in ("concepts", "confirmed_concepts", "occurrences", "confirmed_edges",
                "units", "by_subject", "by_nature", "by_type", "application_flows"):
        assert key in data, f"missing key: {key}"


def test_stats_counts(client):
    data = client.get("/api/stats").json()
    assert data["concepts"] == 3
    assert data["confirmed_edges"] == 3
    # 5 confirmed occurrences (occ 6 is unconfirmed)
    assert data["occurrences"] == 5


def test_stats_by_subject(client):
    by_subject = client.get("/api/stats").json()["by_subject"]
    assert by_subject["History"] == 3   # occ 1, 2, 4
    assert by_subject["Religion"] == 1  # occ 3
    assert by_subject["Geography"] == 1 # occ 5


def test_stats_by_nature(client):
    by_nature = client.get("/api/stats").json()["by_nature"]
    assert by_nature["extension"] == 1
    assert by_nature["application"] == 1
    assert by_nature["reinforcement"] == 1


def test_density_returns_rows_ordered_by_intros(client):
    rows = client.get("/api/insights/density").json()
    assert len(rows) > 0
    intros = [r["intros"] for r in rows]
    assert intros == sorted(intros, reverse=True)


def test_density_row_shape(client):
    row = client.get("/api/insights/density").json()[0]
    for key in ("subject", "year", "term", "unit", "intros", "total", "intro_pct"):
        assert key in row


def test_density_intro_pct_range(client):
    for row in client.get("/api/insights/density").json():
        assert 0.0 <= row["intro_pct"] <= 100.0


def test_year_progression_all_years(client):
    rows = client.get("/api/insights/year-progression").json()
    years = [r["year"] for r in rows]
    # seed has Y3, Y4, Y5 confirmed occurrences
    assert 3 in years
    assert 4 in years
    assert 5 in years


def test_year_progression_recurrence_pct_range(client):
    for row in client.get("/api/insights/year-progression").json():
        assert 0.0 <= row["recurrence_pct"] <= 100.0


def test_year_progression_totals_add_up(client):
    for row in client.get("/api/insights/year-progression").json():
        assert row["new_terms"] + row["recurrences"] == row["total"]


def test_cross_subject_only_multi_subject_concepts(client):
    rows = client.get("/api/insights/cross-subject").json()
    # trade is single-subject (Geography only) — must not appear
    terms = [r["term"] for r in rows]
    assert "trade" not in terms


def test_cross_subject_persecution_spans_two_subjects(client):
    rows = client.get("/api/insights/cross-subject").json()
    match = next((r for r in rows if r["term"] == "persecution"), None)
    assert match is not None
    assert match["subject_count"] == 2
    assert set(match["subjects"]) == {"History", "Religion"}


def test_longevity_ordered_by_years_active(client):
    rows = client.get("/api/insights/longevity").json()
    spans = [r["years_active"] for r in rows]
    assert spans == sorted(spans, reverse=True)


def test_longevity_limit_param(client):
    rows = client.get("/api/insights/longevity?limit=1").json()
    assert len(rows) == 1


def test_filters_shape(client):
    data = client.get("/api/filters").json()
    assert "subjects" in data
    assert "years" in data
    assert "terms" in data
    assert "History" in data["subjects"]
