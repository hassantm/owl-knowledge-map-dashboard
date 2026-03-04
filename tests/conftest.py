"""
Shared test fixtures for OWL Knowledge Map FastAPI tests.

Uses an in-memory SQLite database seeded with a small, known dataset
so tests are fast, isolated, and independent of the real DB.

Two gotchas solved here:
1. Routes use `from api.db import get_conn` (direct import), so we must patch
   the name in each route module, not just in api.db.
2. Routes call conn.close() which would destroy an in-memory connection.
   We patch close() to be a no-op so the connection stays alive across requests.
"""

import sqlite3
import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from api.main import app

# ─── Schema ───────────────────────────────────────────────────────────────────

CREATE_SCHEMA = """
CREATE TABLE concepts (
    concept_id   INTEGER PRIMARY KEY,
    term         TEXT NOT NULL,
    subject_area TEXT
);

CREATE TABLE occurrences (
    occurrence_id     INTEGER PRIMARY KEY,
    concept_id        INTEGER REFERENCES concepts(concept_id),
    subject           TEXT NOT NULL,
    year              INTEGER NOT NULL,
    term              TEXT NOT NULL,
    unit              TEXT NOT NULL,
    chapter           TEXT,
    slide_number      INTEGER,
    is_introduction   INTEGER NOT NULL,
    term_in_context   TEXT,
    source_path       TEXT,
    needs_review      INTEGER DEFAULT 0,
    review_reason     TEXT,
    validation_status TEXT,
    vocab_confidence  REAL,
    vocab_match_type  TEXT,
    vocab_source      TEXT,
    audit_decision    TEXT,
    audit_notes       TEXT
);

CREATE TABLE edges (
    edge_id         INTEGER PRIMARY KEY,
    from_occurrence INTEGER REFERENCES occurrences(occurrence_id),
    to_occurrence   INTEGER REFERENCES occurrences(occurrence_id),
    edge_type       TEXT,
    edge_nature     TEXT,
    confirmed_by    TEXT,
    confirmed_date  TEXT
);
"""

# ─── Seed data ────────────────────────────────────────────────────────────────
# 3 concepts, 6 occurrences (1 unconfirmed), 3 edges

SEED_DATA = """
INSERT INTO concepts VALUES (1, 'empire',      'History');
INSERT INTO concepts VALUES (2, 'persecution', NULL);
INSERT INTO concepts VALUES (3, 'trade',       'Geography');

-- empire: intro History Y3 Autumn1, recurs History Y4 Spring2
INSERT INTO occurrences VALUES
  (1,1,'History',3,'Autumn1','Ancient Egypt',           '1. Pharaohs',3,1,'The Roman empire spread.',NULL,0,NULL,'confirmed',NULL,NULL,NULL,NULL,NULL);
INSERT INTO occurrences VALUES
  (2,1,'History',4,'Spring2','Christianity in 3 empires','1. To the lions',5,1,'Three empires coexisted.',NULL,0,NULL,'confirmed',NULL,NULL,NULL,NULL,NULL);

-- persecution: intro Religion Y4 Spring1, recurs History Y5 Autumn2
INSERT INTO occurrences VALUES
  (3,2,'Religion',4,'Spring1','Christ 3',     '2. Martyrs',7,1,'Christians faced persecution.',NULL,0,NULL,'confirmed',NULL,NULL,NULL,NULL,NULL);
INSERT INTO occurrences VALUES
  (4,2,'History', 5,'Autumn2','Anglo Saxons', '3. Kingdoms',12,0,'Persecution drove migration.',NULL,0,NULL,'confirmed',NULL,NULL,NULL,NULL,NULL);

-- trade: single Geography occurrence (not load-bearing, not cross-subject)
INSERT INTO occurrences VALUES
  (5,3,'Geography',3,'Autumn1','Rivers','4. Trade routes',9,1,'Trade along rivers.',NULL,0,NULL,'confirmed',NULL,NULL,NULL,NULL,NULL);

-- unconfirmed occurrence (must be excluded everywhere)
INSERT INTO occurrences VALUES
  (6,1,'History',6,'Spring1','Manchester',NULL,1,0,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,NULL);

-- 3 confirmed edges
INSERT INTO edges VALUES (1,1,2,'within_subject', 'extension',    'Hassan Mamdani','2026-03-01');
INSERT INTO edges VALUES (2,3,4,'cross_subject',  'application',  'Hassan Mamdani','2026-03-01');
INSERT INTO edges VALUES (3,1,3,'cross_subject',  'reinforcement','Hassan Mamdani','2026-03-01');
"""

# ─── Fixture ──────────────────────────────────────────────────────────────────

ROUTE_MODULES = [
    "api.routes.stats.get_conn",
    "api.routes.graph.get_conn",
    "api.routes.concepts.get_conn",
    "api.routes.occurrences.get_conn",
    "api.routes.edges.get_conn",
]


class _UnclosableConnection:
    """Wraps a sqlite3.Connection so that close() is a no-op.

    Routes call conn.close() in their finally blocks; we need the in-memory
    DB to survive across multiple requests within a single test.
    """
    def __init__(self, conn: sqlite3.Connection):
        self._conn = conn

    def close(self):
        pass  # intentional no-op

    def __getattr__(self, name):
        return getattr(self._conn, name)


@pytest.fixture
def client():
    """TestClient backed by a fresh in-memory SQLite DB for each test."""
    # check_same_thread=False is required because FastAPI runs route handlers
    # in a thread pool, which is a different thread from the test fixture.
    _conn = sqlite3.connect(":memory:", check_same_thread=False)
    _conn.row_factory = sqlite3.Row
    _conn.executescript(CREATE_SCHEMA + SEED_DATA)
    conn = _UnclosableConnection(_conn)

    def get_test_conn():
        return conn

    # Routes use `from api.db import get_conn` so we must patch the name
    # in each route module, not just in api.db.
    patches = [patch(target, get_test_conn) for target in ROUTE_MODULES]
    for p in patches:
        p.start()

    with TestClient(app) as c:
        yield c

    for p in patches:
        p.stop()

    _conn.close()
