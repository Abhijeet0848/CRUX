"""
ASGI Application Entrypoint for Vercel Services
================================================
Imports and exports the FastAPI application instance for Vercel deployment.
"""

import sys
import os
import types

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(CURRENT_DIR)

if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)
if PARENT_DIR not in sys.path:
    sys.path.insert(0, PARENT_DIR)

# When deployed as an isolated Vercel service with root="backend",
# register a virtual "backend" package in sys.modules pointing to CURRENT_DIR
# so all `from backend.app...` imports resolve cleanly in the serverless bundle.
if "backend" not in sys.modules:
    backend_pkg = types.ModuleType("backend")
    backend_pkg.__path__ = [CURRENT_DIR]
    sys.modules["backend"] = backend_pkg

try:
    from backend.app.main import app as _app
except ImportError:
    from app.main import app as _app

# Top-level ASGI application instances for Vercel Python runtime AST detection
app = _app
application = app
handler = app

