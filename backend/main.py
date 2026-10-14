"""
ASGI Application Entrypoint for Vercel Services
================================================
Imports and exports the FastAPI application instance for Vercel deployment.
"""

import sys
import os

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)

if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

try:
    from backend.app.main import app
except ImportError:
    from app.main import app

__all__ = ["app"]
