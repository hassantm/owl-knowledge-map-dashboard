"""
Vocabulary Explorer Tool — backend endpoints.

Three routes:
  GET /api/vocabulary/navigation          — full subject→year→unit→chapter hierarchy
  GET /api/vocabulary/chapter-clusters    — Louvain clusters for a chapter
  GET /api/vocabulary/word-detail         — streamed SSE: context frame + LLM briefing
  POST /api/vocabulary/navigation/invalidate — drop the navigation cache
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import os
import time
from functools import lru_cache
from typing import Any

import anthropic
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
from networkx.algorithms.community import louvain_communities
from psycopg2.extras import RealDictCursor

import networkx as nx

from api.db import get_conn

router = APIRouter()

# ── Rate-limit shim ───────────────────────────────────────────────────────────

_MAX_LLM_PER_MIN = int(os.environ.get("MAX_LLM_CALLS_PER_MINUTE", 60))
_llm_calls: list[float] = []


def _check_rate_limit() -> None:
    now = time.monotonic()
    _llm_calls[:] = [t for t in _llm_calls if now - t < 60]
    if len(_llm_calls) >= _MAX_LLM_PER_MIN:
        raise HTTPException(status_code=429, detail="LLM rate limit exceeded")
    _llm_calls.append(now)


# ── SQL helpers ───────────────────────────────────────────────────────────────

def _get_chapter_concepts(conn, unit: str, chapter: str) -> list[dict]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT DISTINCT
                c.concept_id,
                c.term,
                c.tier,
                c.register,
                MIN(o.is_introduction) AS any_introduction
            FROM occurrences o
            JOIN concepts c ON c.concept_id = o.concept_id
            WHERE o.unit    = %s
              AND o.chapter = %s
              AND c.enrichment_status = 'approved'
            GROUP BY c.concept_id, c.term, c.tier, c.register
            ORDER BY c.term
        """, (unit, chapter))
        return [dict(r) for r in cur.fetchall()]


def _get_chapter_cooccurrences(conn, unit: str, chapter: str) -> list[dict]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT
                LEAST(o1.concept_id, o2.concept_id)    AS concept_a_id,
                GREATEST(o1.concept_id, o2.concept_id) AS concept_b_id,
                COUNT(DISTINCT o1.slide_number)         AS weight
            FROM occurrences o1
            JOIN occurrences o2
                ON  o1.unit        = o2.unit
                AND o1.chapter     = o2.chapter
                AND o1.concept_id != o2.concept_id
                AND o1.concept_id  < o2.concept_id
            JOIN concepts c1 ON c1.concept_id = o1.concept_id
                             AND c1.enrichment_status = 'approved'
            JOIN concepts c2 ON c2.concept_id = o2.concept_id
                             AND c2.enrichment_status = 'approved'
            WHERE o1.unit    = %s
              AND o1.chapter = %s
            GROUP BY
                LEAST(o1.concept_id, o2.concept_id),
                GREATEST(o1.concept_id, o2.concept_id)
            HAVING COUNT(DISTINCT o1.slide_number) > 0
        """, (unit, chapter))
        return [dict(r) for r in cur.fetchall()]


def _get_bridge_map(conn, concept_ids: list[int]) -> dict[int, list[str]]:
    if not concept_ids:
        return {}
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT
                CASE WHEN concept_a_id = ANY(%s) THEN concept_a_id
                     ELSE concept_b_id END        AS concept_id,
                CASE WHEN concept_a_id = ANY(%s) THEN subject_b
                     ELSE subject_a END            AS other_subject
            FROM co_occurrences
            WHERE (concept_a_id = ANY(%s) OR concept_b_id = ANY(%s))
              AND is_cross_subject = true
              AND granularity = 'lesson'
        """, (concept_ids, concept_ids, concept_ids, concept_ids))
        rows = cur.fetchall()
    result: dict[int, list[str]] = {}
    for row in rows:
        cid = row["concept_id"]
        subj = row["other_subject"]
        if cid not in result:
            result[cid] = []
        if subj not in result[cid]:
            result[cid].append(subj)
    return result


def _get_word_detail_context(conn, concept_id: int, unit: str) -> dict | None:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT concept_id, term, definition, etymology,
                   word_family, register, tier
            FROM concepts
            WHERE concept_id = %s AND enrichment_status = 'approved'
        """, (concept_id,))
        concept = cur.fetchone()
        if not concept:
            return None
        concept = dict(concept)

        cur.execute("""
            SELECT year, term AS term_period, unit, chapter,
                   is_introduction, term_in_context
            FROM occurrences
            WHERE concept_id = %s
            ORDER BY year, term
        """, (concept_id,))
        trajectory = [dict(r) for r in cur.fetchall()]

        cur.execute("""
            SELECT
                c2.concept_id,
                c2.term,
                co.weight,
                co.is_cross_subject,
                co.subject_a,
                co.subject_b
            FROM co_occurrences co
            JOIN concepts c2
                ON c2.concept_id = CASE
                    WHEN co.concept_a_id = %s THEN co.concept_b_id
                    ELSE co.concept_a_id END
            WHERE (co.concept_a_id = %s OR co.concept_b_id = %s)
              AND co.granularity = 'lesson'
              AND c2.enrichment_status = 'approved'
            ORDER BY co.is_cross_subject DESC, co.weight DESC
            LIMIT 10
        """, (concept_id, concept_id, concept_id))
        neighbourhood = [dict(r) for r in cur.fetchall()]

        cur.execute("""
            SELECT
                CASE WHEN concept_a_id = %s THEN subject_b
                     ELSE subject_a END AS other_subject,
                SUM(weight)             AS weight,
                granularity
            FROM co_occurrences
            WHERE (concept_a_id = %s OR concept_b_id = %s)
              AND is_cross_subject = true
            GROUP BY other_subject, granularity
            ORDER BY weight DESC
        """, (concept_id, concept_id, concept_id))
        bridge_details = [dict(r) for r in cur.fetchall()]

    return {
        "concept":       concept,
        "trajectory":    trajectory,
        "neighbourhood": neighbourhood,
        "bridge_details": bridge_details,
        "current_unit":  unit,
    }


# ── Clustering helpers ────────────────────────────────────────────────────────

def _build_clusters(concepts: list[dict], pairs: list[dict]) -> list[list[int]]:
    G = nx.Graph()
    for c in concepts:
        G.add_node(c["concept_id"], term=c["term"], tier=c["tier"])
    for pair in pairs:
        G.add_edge(pair["concept_a_id"], pair["concept_b_id"], weight=pair["weight"])
    communities = louvain_communities(G, weight="weight", seed=42)
    return [list(community) for community in communities]


def _score_centre_node(
    cluster_concept_ids: list[int],
    concepts_by_id: dict,
    pairs: list[dict],
    bridge_concept_ids: set[int],
) -> int:
    cluster_set = set(cluster_concept_ids)
    degree_within: dict[int, int] = {cid: 0 for cid in cluster_concept_ids}
    for pair in pairs:
        a, b = pair["concept_a_id"], pair["concept_b_id"]
        if a in cluster_set and b in cluster_set:
            degree_within[a] = degree_within.get(a, 0) + pair["weight"]
            degree_within[b] = degree_within.get(b, 0) + pair["weight"]

    max_degree = max(degree_within.values(), default=1) or 1
    scores = {}
    for cid in cluster_concept_ids:
        c = concepts_by_id[cid]
        tier = min(c.get("tier") or 1, 3)
        scores[cid] = (
            (degree_within.get(cid, 0) / max_degree) * 0.5
            + (1 if c.get("any_introduction") == 1 else 0) * 0.2
            + (1 if cid in bridge_concept_ids else 0) * 0.2
            + (tier / 3) * 0.1
        )
    return max(scores, key=lambda cid: scores[cid])


# ── LLM label helpers ─────────────────────────────────────────────────────────

def _label_cache_key(unit: str, chapter: str, cluster_ids: list[int]) -> str:
    raw = f"{unit}|{chapter}|{','.join(map(str, sorted(cluster_ids)))}"
    return hashlib.sha1(raw.encode()).hexdigest()


async def _cluster_label_llm(terms: list[str], centre_term: str) -> str:
    client = anthropic.AsyncAnthropic()
    response = await client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=20,
        messages=[{
            "role": "user",
            "content": (
                f"These vocabulary words appear together in a KS2 history/geography lesson.\n"
                f"The central word is: {centre_term}\n"
                f"All words: {', '.join(terms)}\n\n"
                f"Give a 2-4 word thematic label for this vocabulary cluster.\n"
                f"Respond with ONLY the label, nothing else. No punctuation."
            ),
        }],
    )
    return response.content[0].text.strip()


_label_cache: dict[str, str] = {}


async def _cluster_label_cached(
    unit: str, chapter: str, cluster_ids: list[int],
    terms: list[str], centre_term: str,
) -> tuple[str, bool]:
    key = _label_cache_key(unit, chapter, cluster_ids)
    if key in _label_cache:
        return _label_cache[key], True
    try:
        label = await _cluster_label_llm(terms, centre_term)
        if len(_label_cache) >= 512:
            _label_cache.pop(next(iter(_label_cache)))
        _label_cache[key] = label
        return label, True
    except Exception:
        return f"{centre_term} & related", False


# ── Briefing prompt ───────────────────────────────────────────────────────────

BRIEFING_SYSTEM_PROMPT = (
    "You are a curriculum knowledge assistant for the Opening Worlds KS2 humanities programme, "
    "a complete, sequenced curriculum for Years 3–6 authored by Christine Counsell and Steve Mastin. "
    "You have access to the full knowledge graph of every concept taught across every unit, year and subject. "
    "Your audience is a teacher delivering this programme. "
    "Write as a knowledgeable colleague who knows exactly what this teacher's pupils have already encountered "
    "and exactly what they will encounter next — because the full curriculum sequence is in front of you. "
    "Never hedge with 'if pupils encounter' or 'they may come across' — you know the programme. "
    "Speak in certainties: 'pupils met this in Y4', 'this recurs in Y6 Geography', 'by this point they will have...'. "
    "Plain, collegial English. No bullet points. No more than 200 words."
)


def _build_briefing_prompt(ctx: dict) -> tuple[str, str]:
    """Return (stable_knowledge_block, volatile_context_block)."""
    c = ctx["concept"]

    word_family_line = ""
    if c.get("word_family"):
        family = c["word_family"]
        if isinstance(family, list):
            family = ", ".join(family)
        word_family_line = f"- Word family: {family}\n"

    etymology = c.get("etymology") or "(not recorded)"
    definition = c.get("definition") or "(not recorded)"

    stable = (
        f"WORD: {c['term']}\n\n"
        f"STABLE KNOWLEDGE:\n"
        f"- Definition: {definition}\n"
        f"- Etymology: {etymology}\n"
        f"{word_family_line}"
        f"- Register: {c.get('register') or 'unknown'}\n"
        f"- Vocabulary tier (Beck): {c.get('tier') or 'unknown'}\n"
    )

    trajectory_str = "\n".join(
        f"  - Year {t['year']}, {t['term_period']}: {t['unit']}"
        + (f" — Chapter: {t['chapter']}" if t.get("chapter") else "")
        + (" (first introduction)" if t.get("is_introduction") == 1 else " (recurrence)")
        for t in ctx["trajectory"]
    ) or "  None recorded"

    neighbourhood_str = "\n".join(
        f"  - '{n['term']}'"
        + (
            f" (cross-subject: {n['subject_a']} → {n['subject_b']}"
            if n.get("is_cross_subject")
            else f" (within {n.get('subject_a', 'unknown')}"
        )
        + f", co-occurrence weight: {n['weight']})"
        for n in ctx["neighbourhood"]
    ) or "  None recorded"

    bridge_str = "\n".join(
        f"  - Connects to {b['other_subject']} (weight: {b['weight']}, at {b['granularity']} level)"
        for b in ctx["bridge_details"]
    ) or "  None identified"

    volatile = (
        f"CURRICULUM TRAJECTORY:\n{trajectory_str}\n\n"
        f"CONCEPTUAL NEIGHBOURHOOD (words taught alongside this one):\n{neighbourhood_str}\n\n"
        f"CROSS-SUBJECT BRIDGE CONNECTIONS:\n{bridge_str}\n\n"
        f"CURRENT UNIT: {ctx.get('current_unit', '')}\n\n"
        f"TASK:\n"
        f"Write a 150-200 word teacher briefing covering:\n"
        f"1. What this word means and where it comes from\n"
        f"2. Why it appears at this point in the curriculum sequence — use the trajectory data above to say exactly when pupils first met it and when it recurs\n"
        f"3. What conceptual cluster it belongs to in this unit\n"
        f"4. Any cross-subject connections the teacher should be aware of\n\n"
        f"Use the trajectory data as fact, not speculation. If the word appears in Y5 Geography, say so. "
        f"If it only appears once in the programme, say so. "
        f"The briefing should read like advice from a colleague who has mapped this curriculum in detail. "
        f"Do not use the word 'delve'. Do not hedge with 'if' or 'may'."
    )

    return stable, volatile


# ── SSE helper ────────────────────────────────────────────────────────────────

def _sse(event: str, data: Any) -> str:
    return f"event: {event}\ndata: {json.dumps(data, default=str)}\n\n"


# ── Navigation ────────────────────────────────────────────────────────────────

@lru_cache(maxsize=1)
def _load_navigation() -> str:
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT DISTINCT o.subject, o.year, o.unit, o.chapter
                FROM occurrences o
                JOIN concepts c ON c.concept_id = o.concept_id
                WHERE c.enrichment_status = 'approved'
                  AND o.chapter IS NOT NULL
                ORDER BY o.subject, o.year, o.unit, o.chapter
            """)
            rows = cur.fetchall()
    finally:
        conn.close()

    hierarchy: dict = {}
    subjects: list[str] = []
    for row in rows:
        subj = row["subject"]
        yr   = str(row["year"])
        unit = row["unit"]
        chap = row["chapter"]
        if subj not in hierarchy:
            hierarchy[subj] = {}
            subjects.append(subj)
        if yr not in hierarchy[subj]:
            hierarchy[subj][yr] = {}
        if unit not in hierarchy[subj][yr]:
            hierarchy[subj][yr][unit] = []
        if chap not in hierarchy[subj][yr][unit]:
            hierarchy[subj][yr][unit].append(chap)

    return json.dumps({"subjects": sorted(subjects), "hierarchy": hierarchy})


@router.get("/navigation")
def get_navigation():
    return json.loads(_load_navigation())


@router.post("/navigation/invalidate")
def invalidate_navigation():
    _load_navigation.cache_clear()
    return {"status": "cache cleared"}


# ── Chapter clusters ──────────────────────────────────────────────────────────

@router.get("/chapter-clusters")
async def get_chapter_clusters(
    unit:    str = Query(...),
    chapter: str = Query(...),
):
    conn = get_conn()
    try:
        concepts  = _get_chapter_concepts(conn, unit, chapter)
        pairs     = _get_chapter_cooccurrences(conn, unit, chapter)
        concept_ids = [c["concept_id"] for c in concepts]
        bridge_map  = _get_bridge_map(conn, concept_ids)
    finally:
        conn.close()

    if not concepts:
        return {"unit": unit, "chapter": chapter, "clusters": []}

    concepts_by_id = {c["concept_id"]: c for c in concepts}
    bridge_ids_set = set(bridge_map.keys())
    communities    = _build_clusters(concepts, pairs)

    # Build label tasks in parallel
    label_tasks = []
    centre_ids  = []
    for community in communities:
        centre_id = _score_centre_node(community, concepts_by_id, pairs, bridge_ids_set)
        centre_ids.append(centre_id)
        terms = [concepts_by_id[cid]["term"] for cid in community]
        centre_term = concepts_by_id[centre_id]["term"]
        if len(community) >= 2:
            label_tasks.append(_cluster_label_cached(unit, chapter, community, terms, centre_term))
        else:
            async def _singleton(ct: str = centre_term) -> tuple[str, bool]:
                return (ct.title(), False)
            label_tasks.append(_singleton())

    label_results = await asyncio.gather(*label_tasks, return_exceptions=True)

    clusters = []
    for idx, (community, centre_id) in enumerate(zip(communities, centre_ids)):
        result = label_results[idx]
        if isinstance(result, Exception) or result is None:
            label, label_generated = f"{concepts_by_id[centre_id]['term']} & related", False
        else:
            label, label_generated = result

        centre = concepts_by_id[centre_id]
        centre_is_bridge = centre_id in bridge_ids_set

        concept_list = []
        for cid in community:
            c = concepts_by_id[cid]
            concept_list.append({
                "concept_id":    cid,
                "term":          c["term"],
                "tier":          c.get("tier"),
                "is_introduction": bool(c.get("any_introduction") == 1),
                "is_centre":     cid == centre_id,
                "is_bridge":     cid in bridge_ids_set,
                "bridge_subjects": bridge_map.get(cid, []),
            })

        clusters.append({
            "cluster_id":      idx,
            "label":           label,
            "label_generated": label_generated,
            "centre_concept": {
                "concept_id":    centre_id,
                "term":          centre["term"],
                "tier":          centre.get("tier"),
                "is_bridge":     centre_is_bridge,
                "bridge_subjects": bridge_map.get(centre_id, []),
            },
            "concepts": concept_list,
        })

    return {"unit": unit, "chapter": chapter, "clusters": clusters}


# ── Word detail (streaming) ───────────────────────────────────────────────────

@router.get("/word-detail")
def get_word_detail(
    concept_id: int = Query(...),
    unit:       str = Query(...),
    chapter:    str = Query(""),
):
    _check_rate_limit()

    conn = get_conn()
    try:
        ctx = _get_word_detail_context(conn, concept_id, unit)
    finally:
        conn.close()

    if ctx is None:
        raise HTTPException(status_code=404, detail="Concept not found or not approved")

    stable, volatile = _build_briefing_prompt(ctx)

    def event_stream():
        context_payload = {
            "concept":       ctx["concept"],
            "trajectory":    ctx["trajectory"],
            "neighbourhood": ctx["neighbourhood"],
            "bridge_details": ctx["bridge_details"],
        }
        yield _sse("context", context_payload)

        try:
            client = anthropic.Anthropic()
            with client.messages.stream(
                model="claude-sonnet-4-6",
                max_tokens=400,
                system=[{
                    "type": "text",
                    "text": BRIEFING_SYSTEM_PROMPT,
                    "cache_control": {"type": "ephemeral"},
                }],
                messages=[{"role": "user", "content": [
                    {
                        "type": "text",
                        "text": stable,
                        "cache_control": {"type": "ephemeral"},
                    },
                    {
                        "type": "text",
                        "text": volatile,
                    },
                ]}],
            ) as stream:
                for delta in stream.text_stream:
                    yield _sse("token", {"text": delta})
                final = stream.get_final_message()
                usage = final.usage
                yield _sse("done", {
                    "input_tokens":               usage.input_tokens,
                    "output_tokens":              usage.output_tokens,
                    "cache_read_input_tokens":    getattr(usage, "cache_read_input_tokens", 0),
                    "cache_creation_input_tokens": getattr(usage, "cache_creation_input_tokens", 0),
                })
        except Exception as exc:
            yield _sse("error", {"message": str(exc)})
            yield _sse("done", {})

    return StreamingResponse(event_stream(), media_type="text/event-stream")
