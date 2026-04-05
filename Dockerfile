# syntax=docker/dockerfile:1.6
#
# MediaPulse — Hugging Face Space (Docker SDK)
#
# Two-stage build:
#   1. node:20  →  build the React frontend into dist/
#   2. python   →  install FastAPI, copy dist/, serve everything on :7860
#
# HF Spaces pass secrets (ANTHROPIC_API_KEY) as runtime env vars, so the
# Python stage reads the key at request time — never baked into the image.

# ----------------------------------------------------------------------
# Stage 1 — build the frontend
# ----------------------------------------------------------------------
FROM node:20-alpine AS web

WORKDIR /web

# Install deps first for better layer caching.
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the frontend source and build.
# VITE_ANALYST_URL is baked into the bundle at build time so the app
# calls the same-origin /api/analyst endpoint on the Space.
COPY index.html ./
COPY vite.config.ts tsconfig.json tsconfig.node.json tsconfig.app.json* ./
COPY tailwind.config.js postcss.config.js ./
COPY src ./src
COPY public ./public

ENV VITE_ANALYST_URL=/api/analyst
RUN npm run build

# ----------------------------------------------------------------------
# Stage 2 — Python runtime that serves dist/ + /api/analyst
# ----------------------------------------------------------------------
FROM python:3.11-slim

WORKDIR /app

# Non-root user — HF Spaces best practice.
RUN useradd -m -u 1000 app

COPY server/requirements.txt ./server/requirements.txt
RUN pip install --no-cache-dir -r server/requirements.txt

COPY server ./server
COPY --from=web /web/dist ./dist

RUN chown -R app:app /app
USER app

ENV DIST_DIR=/app/dist
ENV PORT=7860
EXPOSE 7860

CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "7860"]
