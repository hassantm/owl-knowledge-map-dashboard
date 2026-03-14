"""
Database connection for OWL FastAPI.
Connects to PostgreSQL owl database on localhost.

Migrated from SQLite: 2026-03-14
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor

PG_CONN_STRING = os.environ.get(
    "OWL_DB_URL",
    "dbname=owl user=htmadmin password=dev host=localhost port=5432"
)

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


def get_conn() -> psycopg2.extensions.connection:
    return psycopg2.connect(PG_CONN_STRING)
