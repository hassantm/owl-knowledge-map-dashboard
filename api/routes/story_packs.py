from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from api.db import get_conn

router = APIRouter()


class ApproveRequest(BaseModel):
    approved_by: str


@router.get("")
def list_story_packs(
    approved_only: bool = False,
    subject: Optional[str] = None,
    year: Optional[int] = None,
) -> list[dict]:
    conn = get_conn()
    try:
        conditions = []
        params = []

        if approved_only:
            conditions.append("sp.human_approved = true")
        if subject:
            conditions.append("u.subject = %s")
            params.append(subject)
        if year:
            conditions.append("u.year = %s")
            params.append(year)

        where = ("WHERE " + " AND ".join(conditions)) if conditions else ""

        with conn.cursor() as cur:
            cur.execute(f"""
                SELECT
                    sp.id,
                    sp.unit_id,
                    u.subject,
                    u.year,
                    u.term,
                    u.unit,
                    sp.model,
                    sp.input_tokens,
                    sp.output_tokens,
                    sp.human_approved,
                    sp.approved_by,
                    sp.approved_at,
                    sp.created_at,
                    sp.warnings,
                    array_length(sp.warnings, 1) AS warning_count,
                    CASE WHEN sp.fact_check_results IS NOT NULL
                         THEN jsonb_array_length(sp.fact_check_results)
                         ELSE 0 END AS fact_check_count,
                    CASE WHEN sp.rubric_scores IS NOT NULL AND sp.rubric_scores != '{{}}'::jsonb
                         THEN ROUND(
                             (SELECT AVG((value->>'score')::numeric)
                              FROM jsonb_each(sp.rubric_scores))
                         , 1)
                         ELSE NULL END AS avg_rubric_score
                FROM generated_story_packs sp
                JOIN units u ON u.unit_id = sp.unit_id
                {where}
                ORDER BY u.year, u.subject, u.term
            """, params)
            return [dict(r) for r in cur.fetchall()]
    finally:
        conn.close()


@router.get("/{pack_id}")
def get_story_pack(pack_id: int) -> dict:
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT
                    sp.*,
                    u.subject,
                    u.year,
                    u.term,
                    u.unit
                FROM generated_story_packs sp
                JOIN units u ON u.unit_id = sp.unit_id
                WHERE sp.id = %s
            """, (pack_id,))
            row = cur.fetchone()
    finally:
        conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Story pack not found")
    return dict(row)


@router.patch("/{pack_id}/approve")
def approve_story_pack(pack_id: int, body: ApproveRequest) -> dict:
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE generated_story_packs
                SET human_approved = true,
                    approved_by    = %s,
                    approved_at    = now()
                WHERE id = %s
                RETURNING id, human_approved, approved_by, approved_at
            """, (body.approved_by, pack_id))
            row = cur.fetchone()
        conn.commit()
    finally:
        conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Story pack not found")
    return dict(row)


@router.patch("/{pack_id}/unapprove")
def unapprove_story_pack(pack_id: int) -> dict:
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE generated_story_packs
                SET human_approved = false,
                    approved_by    = NULL,
                    approved_at    = NULL
                WHERE id = %s
                RETURNING id, human_approved
            """, (pack_id,))
            row = cur.fetchone()
        conn.commit()
    finally:
        conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Story pack not found")
    return dict(row)
