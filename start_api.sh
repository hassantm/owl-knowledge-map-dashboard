#!/bin/bash
# Start the OWL Knowledge Map API
cd "$(dirname "$0")"
source venv/bin/activate
uvicorn api.main:app --reload --port 8000
