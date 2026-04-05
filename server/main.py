"""
MediaPulse — analyst proxy + static host.

This tiny FastAPI app does two jobs:

  1. Serves the built React app (dist/) at the root, so visiting the
     Space URL just loads the dashboard.
  2. Exposes POST /api/analyst which forwards chat requests to the
     Anthropic API using the server-side key stored in the
     ANTHROPIC_API_KEY env var (set as a secret on the Hugging Face
     Space). The frontend is built with VITE_ANALYST_URL=/api/analyst
     so it hits this endpoint automatically.

To keep costs bounded we enforce a simple in-memory global daily cap.
It's deliberately not a database — the Space restarts periodically and
resetting the counter on restart is fine. One user can still burn the
whole daily budget; if that happens in practice, swap this for an
IP-based counter or gate the Space with an access code.
"""

from __future__ import annotations

import os
from datetime import date
from pathlib import Path
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "").strip()
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"
DEFAULT_MODEL = os.environ.get("ANALYST_MODEL", "claude-sonnet-4-20250514").strip()

# Global daily call cap. Override via env var on the Space if needed.
DAILY_CAP = int(os.environ.get("ANALYST_DAILY_CAP", "500"))

# Where the built frontend lives. In the Docker image we copy dist/ to
# /app/dist in the final stage; during local dev against a checked-out
# repo we fall back to ../dist relative to this file.
DIST_DIR = Path(os.environ.get("DIST_DIR", "/app/dist"))
if not DIST_DIR.exists():
    DIST_DIR = Path(__file__).resolve().parent.parent / "dist"

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------

app = FastAPI(title="MediaPulse")

# Same-origin in production, but allow localhost during dev so you can
# run `npm run dev` against this server with VITE_ANALYST_URL=http://localhost:7860/api/analyst
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# ---------------------------------------------------------------------------
# Rate limit state
# ---------------------------------------------------------------------------

_counter: dict[str, Any] = {"day": None, "count": 0}


def _bump_counter() -> tuple[bool, int]:
    """Increment and return (allowed, remaining). Resets daily."""
    today = date.today().isoformat()
    if _counter["day"] != today:
        _counter["day"] = today
        _counter["count"] = 0
    if _counter["count"] >= DAILY_CAP:
        return False, 0
    _counter["count"] += 1
    return True, DAILY_CAP - _counter["count"]


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/api/health")
def health() -> dict[str, Any]:
    return {
        "ok": True,
        "has_key": bool(ANTHROPIC_API_KEY),
        "model": DEFAULT_MODEL,
        "daily_cap": DAILY_CAP,
        "used_today": _counter["count"] if _counter["day"] == date.today().isoformat() else 0,
    }


@app.post("/api/analyst")
async def analyst(req: Request) -> JSONResponse:
    if not ANTHROPIC_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="ANTHROPIC_API_KEY not configured on the server.",
        )

    allowed, remaining = _bump_counter()
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail=(
                f"Daily analyst cap of {DAILY_CAP} requests reached. "
                "Resets at 00:00 UTC."
            ),
        )

    body = await req.json()
    model = (body.get("model") or DEFAULT_MODEL).strip()
    system = body.get("system") or ""
    messages = body.get("messages") or []
    max_tokens = int(body.get("max_tokens") or 600)

    if not isinstance(messages, list) or not messages:
        raise HTTPException(status_code=400, detail="`messages` must be a non-empty list.")

    payload = {
        "model": model,
        "max_tokens": max_tokens,
        "system": system,
        "messages": messages,
    }
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": ANTHROPIC_VERSION,
        "content-type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(ANTHROPIC_URL, json=payload, headers=headers)
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Upstream error: {e}") from e

    if r.status_code >= 400:
        # Bubble up a short, safe error message without leaking the key.
        detail = r.text[:300] if r.text else f"Anthropic returned {r.status_code}"
        raise HTTPException(status_code=r.status_code, detail=detail)

    data = r.json()
    return JSONResponse(
        {
            **data,
            "_remaining_today": remaining,
        }
    )


# ---------------------------------------------------------------------------
# Static frontend (mounted last so API routes win)
# ---------------------------------------------------------------------------

if DIST_DIR.exists():
    app.mount(
        "/assets",
        StaticFiles(directory=str(DIST_DIR / "assets")),
        name="assets",
    )

    @app.get("/{full_path:path}")
    async def spa(full_path: str) -> FileResponse:
        """SPA fallback — always serve index.html for non-API, non-asset routes."""
        candidate = DIST_DIR / full_path
        if full_path and candidate.is_file():
            return FileResponse(candidate)
        return FileResponse(DIST_DIR / "index.html")

else:

    @app.get("/")
    def root_placeholder() -> dict[str, str]:
        return {
            "status": "frontend not built",
            "hint": "Run `npm run build` in the project root before starting the server.",
        }
