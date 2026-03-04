from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from api.db import get_conn, TERM_ORDER_SQL

router = APIRouter()


@router.get("")
def list_concepts(
    q: Optional[str] = None,
    subject: Optional[str] = None,
    load_bearing_only: bool = Query(False, alias="loadBearingOnly"),
    page: int = 0,
    page_size: int = Query(50, alias="pageSize"),
) -> dict:
    """Paginated concept list with optional search and filters."""
    conditions = ["o.validation_status = 'confirmed'"]
    params: list = []

    if q:
        conditions.append("c.term LIKE ?")
        params.append(f"%{q}%")
    if subject:
        conditions.append("o.subject = ?")
        params.append(subject)

    where = " AND ".join(conditions)
    having = "HAVING COUNT(*) >= 2" if load_bearing_only else ""

    count_sql = f"""
        SELECT COUNT(DISTINCT c.concept_id)
        FROM concepts c JOIN occurrences o ON c.concept_id = o.concept_id
        WHERE {where}
    """
    select_sql = f"""
        SELECT c.concept_id, c.term, c.subject_area,
               COUNT(*) AS occ_count,
               GROUP_CONCAT(DISTINCT o.subject) AS subjects,
               MIN(o.year) AS first_year,
               MAX(o.year) AS last_year,
               SUM(CASE WHEN o.is_introduction = 1 THEN 1 ELSE 0 END) AS intro_count
        FROM concepts c JOIN occurrences o ON c.concept_id = o.concept_id
        WHERE {where}
        GROUP BY c.concept_id
        {having}
        ORDER BY occ_count DESC, c.term
        LIMIT ? OFFSET ?
    """

    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(count_sql, params)
        total = cur.fetchone()[0]
        cur.execute(select_sql, params + [page_size, page * page_size])
        rows = [dict(r) for r in cur.fetchall()]
    finally:
        conn.close()

    # Split subjects string into list
    for r in rows:
        r["subjects"] = sorted(r["subjects"].split(",")) if r["subjects"] else []

    return {"rows": rows, "total": total, "page": page, "page_size": page_size}


@router.get("/{concept_id}")
def get_concept(concept_id: int) -> dict:
    """Full concept detail: metadata + all occurrences + all edges."""
    conn = get_conn()
    try:
        cur = conn.cursor()

        cur.execute("SELECT * FROM concepts WHERE concept_id = ?", (concept_id,))
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Concept not found")
        concept = dict(row)

        cur.execute(f"""
            SELECT o.*
            FROM occurrences o
            WHERE o.concept_id = ?
            ORDER BY o.year, {TERM_ORDER_SQL}, o.slide_number
        """, (concept_id,))
        occurrences = [dict(r) for r in cur.fetchall()]

        occ_ids = [o["occurrence_id"] for o in occurrences]
        edges = []
        if occ_ids:
            ph = ",".join("?" * len(occ_ids))
            cur.execute(f"""
                SELECT e.rowid AS edge_id, e.from_occurrence, e.to_occurrence,
                       e.edge_type, e.edge_nature, e.confirmed_by, e.confirmed_date,
                       ofrom.year AS from_year, ofrom.term AS from_term,
                       ofrom.subject AS from_subject, ofrom.unit AS from_unit,
                       oto.year AS to_year, oto.term AS to_term,
                       oto.subject AS to_subject, oto.unit AS to_unit
                FROM edges e
                JOIN occurrences ofrom ON e.from_occurrence = ofrom.occurrence_id
                JOIN occurrences oto   ON e.to_occurrence   = oto.occurrence_id
                WHERE e.from_occurrence IN ({ph}) OR e.to_occurrence IN ({ph})
                ORDER BY ofrom.year, ofrom.term
            """, occ_ids + occ_ids)
            edges = [dict(r) for r in cur.fetchall()]

    finally:
        conn.close()

    return {"concept": concept, "occurrences": occurrences, "edges": edges}
