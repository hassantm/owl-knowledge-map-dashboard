from fastapi import APIRouter, Query
from typing import Optional
from api.db import get_conn, TERM_ORDER

router = APIRouter()


@router.get("")
def get_graph(
    subject: Optional[str] = None,
    year_from: Optional[int] = Query(None, alias="yearFrom"),
    year_to: Optional[int] = Query(None, alias="yearTo"),
    edge_type: Optional[str] = Query(None, alias="edgeType"),
    edge_nature: Optional[str] = Query(None, alias="edgeNature"),
) -> dict:
    """
    Return nodes and edges for the graph view.

    Nodes are occurrence endpoints of confirmed edges only.
    Each node includes curriculum position for timeline layout.
    Each edge includes type and nature for colour coding.
    """
    conn = get_conn()
    try:
        cur = conn.cursor()

        sql = """
            SELECT e.from_occurrence, e.to_occurrence, e.edge_type, e.edge_nature,
                   c.concept_id, c.term,
                   ofrom.subject  AS from_subject,
                   ofrom.year     AS from_year,
                   ofrom.term     AS from_term,
                   ofrom.unit     AS from_unit,
                   ofrom.chapter  AS from_chapter,
                   ofrom.is_introduction AS from_is_intro,
                   ofrom.term_in_context AS from_context,
                   oto.subject    AS to_subject,
                   oto.year       AS to_year,
                   oto.term       AS to_term,
                   oto.unit       AS to_unit,
                   oto.chapter    AS to_chapter,
                   oto.is_introduction AS to_is_intro,
                   oto.term_in_context AS to_context
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
        if year_from is not None:
            sql += " AND ofrom.year >= ? AND oto.year >= ?"
            params += [year_from, year_from]
        if year_to is not None:
            sql += " AND ofrom.year <= ? AND oto.year <= ?"
            params += [year_to, year_to]

        cur.execute(sql, params)
        raw_edges = [dict(r) for r in cur.fetchall()]

    finally:
        conn.close()

    # Build deduplicated node list from edge endpoints
    nodes: dict[int, dict] = {}

    def _add_node(occ_id, term, concept_id, subj, year, term_period, unit, chapter, is_intro, context):
        if occ_id in nodes:
            return
        nodes[occ_id] = {
            "id": occ_id,
            "term": term,
            "concept_id": concept_id,
            "subject": subj,
            "year": year,
            "term_period": term_period,
            "unit": unit or "",
            "chapter": chapter or "",
            "is_introduction": bool(is_intro),
            "term_in_context": context or "",
            "curriculum_position": year * 10 + TERM_ORDER.get(term_period, 0),
        }

    edges_out = []
    for e in raw_edges:
        _add_node(e["from_occurrence"], e["term"], e["concept_id"],
                  e["from_subject"], e["from_year"], e["from_term"],
                  e["from_unit"], e["from_chapter"], e["from_is_intro"], e.get("from_context"))
        _add_node(e["to_occurrence"], e["term"], e["concept_id"],
                  e["to_subject"], e["to_year"], e["to_term"],
                  e["to_unit"], e["to_chapter"], e["to_is_intro"], e.get("to_context"))
        edges_out.append({
            "source": e["from_occurrence"],
            "target": e["to_occurrence"],
            "edge_type": e["edge_type"],
            "edge_nature": e["edge_nature"],
        })

    return {
        "nodes": list(nodes.values()),
        "edges": edges_out,
        "node_count": len(nodes),
        "edge_count": len(edges_out),
    }
