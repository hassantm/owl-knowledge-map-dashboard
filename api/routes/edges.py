from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from pydantic import BaseModel
from datetime import date
from api.db import get_conn

router = APIRouter()

VALID_NATURES = {"reinforcement", "extension", "application"}


@router.get("")
def list_edges(
    edge_type: Optional[str] = Query(None, alias="edgeType"),
    edge_nature: Optional[str] = Query(None, alias="edgeNature"),
    subject: Optional[str] = None,
) -> dict:
    """All confirmed edges with occurrence metadata."""
    sql = """
        SELECT e.from_occurrence, e.to_occurrence, e.edge_type, e.edge_nature,
               e.confirmed_by, e.confirmed_date,
               c.concept_id, c.term,
               ofrom.subject AS from_subject, ofrom.year AS from_year,
               ofrom.term AS from_term, ofrom.unit AS from_unit,
               ofrom.chapter AS from_chapter,
               oto.subject AS to_subject, oto.year AS to_year,
               oto.term AS to_term, oto.unit AS to_unit,
               oto.chapter AS to_chapter
        FROM edges e
        JOIN occurrences ofrom ON e.from_occurrence = ofrom.occurrence_id
        JOIN occurrences oto   ON e.to_occurrence   = oto.occurrence_id
        JOIN concepts c        ON ofrom.concept_id  = c.concept_id
        WHERE e.confirmed_by IS NOT NULL
    """
    params: list = []
    if edge_type:
        sql += " AND e.edge_type = ?"
        params.append(edge_type)
    if edge_nature:
        sql += " AND e.edge_nature = ?"
        params.append(edge_nature)
    if subject:
        sql += " AND (ofrom.subject = ? OR oto.subject = ?)"
        params += [subject, subject]
    sql += " ORDER BY ofrom.year, ofrom.term, c.term"

    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(sql, params)
        rows = [dict(r) for r in cur.fetchall()]
    finally:
        conn.close()

    return {"edges": rows, "total": len(rows)}


class EdgeUpdate(BaseModel):
    edge_nature: str
    confirmed_by: Optional[str] = None


@router.patch("/{from_occurrence}/{to_occurrence}")
def update_edge(from_occurrence: int, to_occurrence: int, body: EdgeUpdate) -> dict:
    """Update edge_nature for a confirmed edge."""
    if body.edge_nature not in VALID_NATURES:
        raise HTTPException(
            status_code=400,
            detail=f"edge_nature must be one of: {', '.join(sorted(VALID_NATURES))}"
        )

    conn = get_conn()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT rowid FROM edges WHERE from_occurrence=? AND to_occurrence=?",
            (from_occurrence, to_occurrence)
        )
        row = cur.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Edge not found")

        cur.execute("""
            UPDATE edges SET edge_nature=?, confirmed_by=?, confirmed_date=?
            WHERE from_occurrence=? AND to_occurrence=?
        """, (
            body.edge_nature,
            body.confirmed_by or "Hassan Mamdani",
            date.today().isoformat(),
            from_occurrence, to_occurrence,
        ))
        conn.commit()
    finally:
        conn.close()

    return {"ok": True, "edge_nature": body.edge_nature}
