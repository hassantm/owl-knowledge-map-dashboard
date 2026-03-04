"""
OWL Knowledge Map — FastAPI Backend
Thin REST API over the existing SQLite database.

Run with:
    cd owl-web
    source venv/bin/activate
    uvicorn api.main:app --reload --port 8000

Interactive docs at: http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import stats, graph, concepts, occurrences, edges
from api.db import DB_PATH

app = FastAPI(
    title="OWL Knowledge Map API",
    description="Curriculum knowledge graph for Opening Worlds humanities curriculum",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stats.router,       prefix="/api",            tags=["stats"])
app.include_router(graph.router,       prefix="/api/graph",      tags=["graph"])
app.include_router(concepts.router,    prefix="/api/concepts",   tags=["concepts"])
app.include_router(occurrences.router, prefix="/api/occurrences",tags=["occurrences"])
app.include_router(edges.router,       prefix="/api/edges",      tags=["edges"])


@app.get("/")
def root():
    return {
        "status": "ok",
        "db": str(DB_PATH),
        "db_exists": DB_PATH.exists(),
        "docs": "/docs",
    }
