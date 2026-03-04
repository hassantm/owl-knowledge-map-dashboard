from fastapi import APIRouter, Query
from typing import Optional
from api.db import get_conn, TERM_ORDER_SQL

router = APIRouter()


@router.get("")
def list_occurrences(
    subject: Optional[str] = None,
    year: Optional[int] = None,
    term: Optional[str] = None,
    q: Optional[str] = None,
    page: int = 0,
    page_size: int = Query(50, alias="pageSize"),
) -> dict:
    """Paginated corpus browser with filters."""
    conditions = ["o.validation_status = 'confirmed'"]
    params: list = []

    if subject:
        conditions.append("o.subject = ?")
        params.append(subject)
    if year is not None:
        conditions.append("o.year = ?")
        params.append(year)
    if term:
        conditions.append("o.term = ?")
        params.append(term)
    if q:
        conditions.append("c.term LIKE ?")
        params.append(f"%{q}%")

    where = " AND ".join(conditions)

    count_sql = f"""
        SELECT COUNT(*) FROM occurrences o
        JOIN concepts c ON o.concept_id = c.concept_id
        WHERE {where}
    """
    select_sql = f"""
        SELECT o.occurrence_id, c.concept_id, c.term,
               o.subject, o.year, o.term AS term_period,
               o.unit, o.chapter, o.slide_number,
               o.is_introduction, o.term_in_context
        FROM occurrences o
        JOIN concepts c ON o.concept_id = c.concept_id
        WHERE {where}
        ORDER BY o.year, {TERM_ORDER_SQL}, o.subject, c.term
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

    return {"rows": rows, "total": total, "page": page, "page_size": page_size}
