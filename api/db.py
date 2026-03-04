"""
Database connection for OWL FastAPI.
Points at the existing SQLite database in the owl-knowledge-map project.
"""

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent.parent / "owl-knowledge-map" / "db" / "owl_knowledge_map.db"

TERM_ORDER_SQL = """
    CASE o.term
        WHEN 'Autumn1' THEN 1 WHEN 'Autumn2' THEN 2
        WHEN 'Spring1' THEN 3 WHEN 'Spring2' THEN 4
        WHEN 'Summer1' THEN 5 WHEN 'Summer2' THEN 6
        ELSE 7
    END
"""

TERM_ORDER = {
    'Autumn1': 1, 'Autumn2': 2,
    'Spring1': 3, 'Spring2': 4,
    'Summer1': 5, 'Summer2': 6,
}


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
