from fastapi import APIRouter
from api.db import get_conn

router = APIRouter()


@router.get("/stats")
def get_stats() -> dict:
    """Dashboard summary statistics."""
    conn = get_conn()
    try:
        cur = conn.cursor()

        cur.execute("SELECT COUNT(*) FROM concepts")
        concepts = cur.fetchone()[0]

        cur.execute("SELECT COUNT(*) FROM edges WHERE confirmed_by IS NOT NULL")
        confirmed_edges = cur.fetchone()[0]

        cur.execute("""
            SELECT subject, COUNT(*) AS cnt
            FROM occurrences
            WHERE validation_status = 'confirmed'
            GROUP BY subject ORDER BY subject
        """)
        by_subject = {r[0]: r[1] for r in cur.fetchall()}
        occurrences = sum(by_subject.values())

        cur.execute("""
            SELECT COUNT(DISTINCT concept_id) FROM occurrences
            WHERE validation_status = 'confirmed'
        """)
        confirmed_concepts = cur.fetchone()[0]

        cur.execute("""
            SELECT COUNT(DISTINCT unit || subject || CAST(year AS TEXT))
            FROM occurrences WHERE validation_status = 'confirmed'
        """)
        units = cur.fetchone()[0]

        # Introductions per year per subject
        cur.execute("""
            SELECT subject, year, COUNT(*) AS cnt
            FROM occurrences
            WHERE is_introduction = 1 AND validation_status = 'confirmed'
            GROUP BY subject, year
            ORDER BY subject, year
        """)
        intros_raw = cur.fetchall()
        intros_by_subject: dict = {}
        for r in intros_raw:
            intros_by_subject.setdefault(r[0], {})[r[1]] = r[2]

        # Edge nature breakdown
        cur.execute("""
            SELECT edge_nature, COUNT(*) FROM edges
            WHERE confirmed_by IS NOT NULL
            GROUP BY edge_nature
        """)
        by_nature = {r[0]: r[1] for r in cur.fetchall()}

        # Edge type breakdown
        cur.execute("""
            SELECT edge_type, COUNT(*) FROM edges
            WHERE confirmed_by IS NOT NULL
            GROUP BY edge_type
        """)
        by_type = {r[0]: r[1] for r in cur.fetchall()}

        # Cross-subject application flows
        cur.execute("""
            SELECT ofrom.subject, oto.subject, COUNT(*) AS cnt
            FROM edges e
            JOIN occurrences ofrom ON e.from_occurrence = ofrom.occurrence_id
            JOIN occurrences oto   ON e.to_occurrence   = oto.occurrence_id
            WHERE e.edge_nature = 'application' AND e.confirmed_by IS NOT NULL
            GROUP BY ofrom.subject, oto.subject
            ORDER BY cnt DESC
        """)
        app_flows = [
            {"from": r[0], "to": r[1], "count": r[2]}
            for r in cur.fetchall()
        ]

    finally:
        conn.close()

    return {
        "concepts": concepts,
        "confirmed_concepts": confirmed_concepts,
        "occurrences": occurrences,
        "confirmed_edges": confirmed_edges,
        "units": units,
        "by_subject": by_subject,
        "intros_by_subject": intros_by_subject,
        "by_nature": by_nature,
        "by_type": by_type,
        "application_flows": app_flows,
    }


@router.get("/filters")
def get_filter_options() -> dict:
    """Distinct values for filter dropdowns."""
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute("SELECT DISTINCT subject FROM occurrences ORDER BY subject")
        subjects = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT DISTINCT year FROM occurrences ORDER BY year")
        years = [r[0] for r in cur.fetchall()]
        cur.execute("SELECT DISTINCT term FROM occurrences ORDER BY term")
        terms = [r[0] for r in cur.fetchall()]
    finally:
        conn.close()
    return {"subjects": subjects, "years": years, "terms": terms}
