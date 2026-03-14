from fastapi import APIRouter
from psycopg2.extras import RealDictCursor
from api.db import get_conn

router = APIRouter()


@router.get("/stats")
def get_stats() -> dict:
    """Dashboard summary statistics."""
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT COUNT(*) FROM concepts")
            concepts = cur.fetchone()["count"]

            cur.execute("SELECT COUNT(*) FROM edges WHERE confirmed_by IS NOT NULL")
            confirmed_edges = cur.fetchone()["count"]

            cur.execute("""
                SELECT subject, COUNT(*) AS cnt
                FROM occurrences
                WHERE validation_status = 'confirmed'
                GROUP BY subject ORDER BY subject
            """)
            by_subject = {r["subject"]: r["cnt"] for r in cur.fetchall()}
            occurrences = sum(by_subject.values())

            cur.execute("""
                SELECT COUNT(DISTINCT concept_id) FROM occurrences
                WHERE validation_status = 'confirmed'
            """)
            confirmed_concepts = cur.fetchone()["count"]

            cur.execute("""
                SELECT COUNT(DISTINCT unit || subject || CAST(year AS TEXT))
                FROM occurrences WHERE validation_status = 'confirmed'
            """)
            units = cur.fetchone()["count"]

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
                intros_by_subject.setdefault(r["subject"], {})[r["year"]] = r["cnt"]

            cur.execute("""
                SELECT edge_nature, COUNT(*) AS cnt FROM edges
                WHERE confirmed_by IS NOT NULL
                GROUP BY edge_nature
            """)
            by_nature = {r["edge_nature"]: r["cnt"] for r in cur.fetchall()}

            cur.execute("""
                SELECT edge_type, COUNT(*) AS cnt FROM edges
                WHERE confirmed_by IS NOT NULL
                GROUP BY edge_type
            """)
            by_type = {r["edge_type"]: r["cnt"] for r in cur.fetchall()}

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
                {"from": r["subject"], "to": r["subject"], "count": r["cnt"]}
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


@router.get("/insights/density")
def get_unit_density() -> list:
    """Vocabulary density per unit — introductions count and intro%."""
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT subject, year, term, unit,
                       SUM(CASE WHEN is_introduction = 1 THEN 1 ELSE 0 END) AS intros,
                       COUNT(*) AS total
                FROM occurrences
                WHERE validation_status = 'confirmed'
                GROUP BY subject, year, term, unit
                ORDER BY intros DESC
            """)
            rows = cur.fetchall()
    finally:
        conn.close()
    return [
        {
            "subject": r["subject"], "year": r["year"],
            "term": r["term"], "unit": r["unit"],
            "intros": r["intros"], "total": r["total"],
            "intro_pct": round(r["intros"] / r["total"] * 100, 1),
        }
        for r in rows
    ]


@router.get("/insights/year-progression")
def get_year_progression() -> list:
    """New vs recurring ratio per year — shows curriculum becoming cumulative."""
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT year,
                       SUM(CASE WHEN is_introduction = 1 THEN 1 ELSE 0 END) AS new_terms,
                       SUM(CASE WHEN is_introduction = 0 THEN 1 ELSE 0 END) AS recurrences,
                       COUNT(*) AS total
                FROM occurrences
                WHERE validation_status = 'confirmed'
                GROUP BY year
                ORDER BY year
            """)
            rows = cur.fetchall()
    finally:
        conn.close()
    return [
        {
            "year": r["year"], "new_terms": r["new_terms"],
            "recurrences": r["recurrences"], "total": r["total"],
            "recurrence_pct": round(r["recurrences"] / r["total"] * 100, 1) if r["total"] else 0,
        }
        for r in rows
    ]


@router.get("/insights/cross-subject")
def get_cross_subject_bridges() -> list:
    """Terms that span multiple subjects — the curriculum's cross-subject connectors."""
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT c.term,
                       STRING_AGG(DISTINCT o.subject, ',' ORDER BY o.subject) AS subjects,
                       COUNT(DISTINCT o.subject) AS subject_count,
                       COUNT(*) AS total_occ,
                       MIN(o.year) AS first_year,
                       MAX(o.year) AS last_year
                FROM occurrences o
                JOIN concepts c ON o.concept_id = c.concept_id
                WHERE o.validation_status = 'confirmed'
                GROUP BY c.concept_id, c.term
                HAVING COUNT(DISTINCT o.subject) > 1
                ORDER BY subject_count DESC, total_occ DESC, c.term
            """)
            rows = cur.fetchall()
    finally:
        conn.close()
    return [
        {
            "term": r["term"],
            "subjects": r["subjects"].split(","),
            "subject_count": r["subject_count"],
            "total_occurrences": r["total_occ"],
            "first_year": r["first_year"],
            "last_year": r["last_year"],
        }
        for r in rows
    ]


@router.get("/insights/longevity")
def get_longest_lived_terms(limit: int = 40) -> list:
    """Terms most active across years — the curriculum's conceptual spine."""
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT c.term, o.subject, MIN(o.year) AS intro_year, MAX(o.year) AS last_year,
                       MAX(o.year) - MIN(o.year) AS years_active,
                       COUNT(*) AS occurrences
                FROM occurrences o
                JOIN concepts c ON o.concept_id = c.concept_id
                WHERE o.is_introduction = 1 AND o.validation_status = 'confirmed'
                GROUP BY c.concept_id, c.term, o.subject
                HAVING MAX(o.year) - MIN(o.year) > 0
                ORDER BY years_active DESC, occurrences DESC
                LIMIT %s
            """, (limit,))
            rows = cur.fetchall()
    finally:
        conn.close()
    return [
        {
            "term": r["term"], "intro_subject": r["subject"],
            "intro_year": r["intro_year"], "last_year": r["last_year"],
            "years_active": r["years_active"], "occurrences": r["occurrences"],
        }
        for r in rows
    ]


@router.get("/filters")
def get_filter_options() -> dict:
    """Distinct values for filter dropdowns."""
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT DISTINCT subject FROM occurrences ORDER BY subject")
            subjects = [r["subject"] for r in cur.fetchall()]
            cur.execute("SELECT DISTINCT year FROM occurrences ORDER BY year")
            years = [r["year"] for r in cur.fetchall()]
            cur.execute("SELECT DISTINCT term FROM occurrences ORDER BY term")
            terms = [r["term"] for r in cur.fetchall()]
    finally:
        conn.close()
    return {"subjects": subjects, "years": years, "terms": terms}
