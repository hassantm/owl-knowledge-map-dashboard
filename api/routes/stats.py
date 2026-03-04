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


@router.get("/insights/density")
def get_unit_density() -> list:
    """Vocabulary density per unit — introductions count and intro%."""
    conn = get_conn()
    try:
        cur = conn.cursor()
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
            "subject": r[0], "year": r[1], "term": r[2], "unit": r[3],
            "intros": r[4], "total": r[5],
            "intro_pct": round(r[4] / r[5] * 100, 1),
        }
        for r in rows
    ]


@router.get("/insights/year-progression")
def get_year_progression() -> list:
    """New vs recurring ratio per year — shows curriculum becoming cumulative."""
    conn = get_conn()
    try:
        cur = conn.cursor()
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
            "year": r[0], "new_terms": r[1], "recurrences": r[2], "total": r[3],
            "recurrence_pct": round(r[2] / r[3] * 100, 1) if r[3] else 0,
        }
        for r in rows
    ]


@router.get("/insights/cross-subject")
def get_cross_subject_bridges() -> list:
    """Terms that span multiple subjects — the curriculum's cross-subject connectors."""
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT c.term,
                   GROUP_CONCAT(DISTINCT o.subject ORDER BY o.subject) AS subjects,
                   COUNT(DISTINCT o.subject) AS subject_count,
                   COUNT(*) AS total_occ,
                   MIN(o.year) AS first_year,
                   MAX(o.year) AS last_year
            FROM occurrences o
            JOIN concepts c ON o.concept_id = c.concept_id
            WHERE o.validation_status = 'confirmed'
            GROUP BY c.concept_id
            HAVING COUNT(DISTINCT o.subject) > 1
            ORDER BY subject_count DESC, total_occ DESC, c.term
        """)
        rows = cur.fetchall()
    finally:
        conn.close()
    return [
        {
            "term": r[0],
            "subjects": r[1].split(","),
            "subject_count": r[2],
            "total_occurrences": r[3],
            "first_year": r[4],
            "last_year": r[5],
        }
        for r in rows
    ]


@router.get("/insights/longevity")
def get_longest_lived_terms(limit: int = 40) -> list:
    """Terms most active across years — the curriculum's conceptual spine."""
    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT c.term, o.subject, MIN(o.year) AS intro_year, MAX(o.year) AS last_year,
                   MAX(o.year) - MIN(o.year) AS years_active,
                   COUNT(*) AS occurrences
            FROM occurrences o
            JOIN concepts c ON o.concept_id = c.concept_id
            WHERE o.is_introduction = 1 AND o.validation_status = 'confirmed'
            GROUP BY c.concept_id
            HAVING years_active > 0
            ORDER BY years_active DESC, occurrences DESC
            LIMIT ?
        """, (limit,))
        rows = cur.fetchall()
    finally:
        conn.close()
    return [
        {
            "term": r[0], "intro_subject": r[1],
            "intro_year": r[2], "last_year": r[3],
            "years_active": r[4], "occurrences": r[5],
        }
        for r in rows
    ]


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
