"""
Timeline endpoint — returns concepts grouped by unit (subject × year × term).
Used by the Timeline Matrix view.
"""

from fastapi import APIRouter
from psycopg2.extras import RealDictCursor
from api.db import get_conn, TERM_ORDER

router = APIRouter()

SUBJECT_NORM = {
    "History": "history",
    "Geography": "geography",
    "Religion": "rw",
}

def unit_key(subject: str, year: int, term: str) -> str:
    subj = SUBJECT_NORM.get(subject, subject.lower())
    term_key = term.lower().replace("autumn", "aut").replace("spring", "spr").replace("summer", "sum")
    return f"y{year}_{term_key}_{subj}"


@router.get("/timeline")
def get_timeline():
    """
    Returns all units with their concepts, ordered chronologically.
    Shape: { units: [ { key, subject, year, term, title, concepts: [{id, name, freq}] } ] }
    """
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Get all distinct units with concept counts
            cur.execute("""
                SELECT
                    o.subject,
                    o.year,
                    o.term,
                    o.unit AS title,
                    c.concept_id AS id,
                    c.term AS name,
                    COUNT(*) AS freq
                FROM occurrences o
                JOIN concepts c ON c.concept_id = o.concept_id
                WHERE o.validation_status IS DISTINCT FROM 'rejected'
                GROUP BY o.subject, o.year, o.term, o.unit, c.concept_id, c.term
                ORDER BY
                    o.year,
                    CASE o.term
                        WHEN 'Autumn1' THEN 1 WHEN 'Autumn2' THEN 2
                        WHEN 'Spring1' THEN 3 WHEN 'Spring2' THEN 4
                        WHEN 'Summer1' THEN 5 WHEN 'Summer2' THEN 6
                        ELSE 7
                    END,
                    CASE o.subject
                        WHEN 'History' THEN 1
                        WHEN 'Geography' THEN 2
                        WHEN 'Religion' THEN 3
                        ELSE 4
                    END
            """)
            rows = cur.fetchall()

        # Group by unit
        units: dict = {}
        for row in rows:
            key = unit_key(row["subject"], row["year"], row["term"])
            if key not in units:
                units[key] = {
                    "key": key,
                    "subject": SUBJECT_NORM.get(row["subject"], row["subject"].lower()),
                    "year": row["year"],
                    "term": row["term"],
                    "title": row["title"],
                    "concepts": [],
                }
            units[key]["concepts"].append({
                "id": row["id"],
                "name": row["name"],
                "freq": row["freq"],
            })

        return {"units": list(units.values())}
    finally:
        conn.close()


@router.get("/timeline/concept/{concept_id}/units")
def get_concept_units(concept_id: int):
    """Returns all unit keys containing this concept — for hover highlighting."""
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT DISTINCT o.subject, o.year, o.term
                FROM occurrences o
                WHERE o.concept_id = %s
            """, (concept_id,))
            rows = cur.fetchall()
        return {
            "concept_id": concept_id,
            "unit_keys": [unit_key(r["subject"], r["year"], r["term"]) for r in rows],
        }
    finally:
        conn.close()
