---
title: MediaPulse
emoji: 📊
colorFrom: yellow
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
---

# MediaPulse

A paid-media analytics dashboard with an embedded Claude analyst. Built with React + TypeScript + Vite + Tailwind + Recharts on the frontend, and a small FastAPI proxy on the backend that holds the Anthropic key server-side so visitors don't need their own.

**Live demo:** _set once deployed_
**Source:** this repo
**Aesthetic:** Warm Light — IBM Plex Sans, cream paper, a single terracotta accent.

## What's in here

```
mediapulse/
├── src/                    React app (dashboard UI, components, data)
├── server/                 FastAPI proxy — serves dist/ and /api/analyst
│   ├── main.py
│   └── requirements.txt
├── Dockerfile              Multi-stage: builds React, then runs FastAPI
├── .github/workflows/      GitHub → Hugging Face Space mirror on push
├── mockups/                Design exploration (8 HTML mockups from early rounds)
└── worker/                 Optional Cloudflare Worker proxy (alternative host)
```

## How the AI analyst is wired

The React bundle is built with `VITE_ANALYST_URL=/api/analyst`, so every call from the browser hits a same-origin relative path. Inside the container, FastAPI reads `ANTHROPIC_API_KEY` from the environment at request time and forwards to `api.anthropic.com`. The key is never shipped to the browser and never baked into the Docker image — it's a Hugging Face Space secret.

A global in-memory daily cap (default: 500 calls/day) protects the key from runaway costs. The counter resets on UTC midnight or Space restart. Raise, lower or swap it for an IP-based limit in `server/main.py`.

## Local development

```bash
# Frontend only (uses BYO-key fallback if no analyst URL is set)
npm install
npm run dev
```

To exercise the full stack locally (frontend + Python proxy):

```bash
# Terminal 1: build the frontend so dist/ exists
VITE_ANALYST_URL=/api/analyst npm run build

# Terminal 2: run the proxy, pointing at the built dist/
export ANTHROPIC_API_KEY=sk-ant-...
pip install -r server/requirements.txt
uvicorn server.main:app --reload --port 7860
```

Then open <http://localhost:7860>.

## Deploy

Full step-by-step setup (GitHub repo → Hugging Face Space → auto-sync) is in [DEPLOY.md](./DEPLOY.md).

The short version: push to GitHub's `main` branch and a GitHub Action mirrors the repo to a Hugging Face Space. The Space is a Docker build that produces a single image serving both the React frontend and the analyst proxy. Set `ANTHROPIC_API_KEY` once in the Space's **Settings → Repository secrets** and it's available to every build.

## Tech stack

- React 18, TypeScript, Vite 5
- Tailwind CSS 3, IBM Plex Sans / Plex Mono
- Recharts 2, lucide-react
- FastAPI, uvicorn, httpx (proxy)
- Hugging Face Spaces (Docker SDK) for hosting
- GitHub Actions (CI) for automatic mirroring

## Customising the data

All synthetic data lives in `src/data.ts`. Each period exports a `PeriodData` object with weeks, channels, campaigns, funnel stages, and aggregate KPIs. Swap in real numbers and the whole dashboard updates.
