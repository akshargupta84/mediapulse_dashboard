# Deploying MediaPulse

This walks through the full one-time setup: creating the GitHub repo, creating the Hugging Face Space, wiring the secrets, and making the first push. After step 7 every `git push` to `main` automatically rebuilds the Space.

## Architecture at a glance

```
    GitHub repo  ──(Actions on push)──▶  Hugging Face Space (Docker)
       main                                 │
        │                                   ├─ builds Dockerfile
        │                                   │     stage 1: vite build  → dist/
        │                                   │     stage 2: python + FastAPI
        │                                   │
        └──────────────── you edit here     └─ runs uvicorn on :7860
                                                ├─ GET /           → React app
                                                └─ POST /api/analyst → Anthropic
                                                       (uses ANTHROPIC_API_KEY
                                                        from Space secrets)
```

## Prerequisites

- A GitHub account
- A Hugging Face account
- An Anthropic API key with credit on it (`sk-ant-...`)

---

## 1. Create the GitHub repo

From inside `mediapulse/`:

```bash
git init
git add .
git commit -m "Initial MediaPulse dashboard"
```

Then create a new empty repo on <https://github.com/new> (name it `mediapulse`, any visibility). Copy the push commands GitHub gives you — they look like:

```bash
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/mediapulse.git
git push -u origin main
```

## 2. Create the Hugging Face Space

1. Go to <https://huggingface.co/new-space>
2. **Space name:** `mediapulse` (or whatever you want)
3. **License:** pick one (MIT is fine)
4. **SDK:** **Docker** → **Blank**
5. **Visibility:** Public
6. Click **Create Space**

You'll land on an empty Space. Leave the browser tab open — you'll need to click into **Settings** in a minute.

## 3. Add the Anthropic key as a Space secret

On the Space page → **Settings** (top right) → scroll to **Variables and secrets** → **New secret**.

- **Name:** `ANTHROPIC_API_KEY`
- **Value:** your `sk-ant-...` key

Click **Save**. This secret is injected as an environment variable at container start — the FastAPI server reads it via `os.environ["ANTHROPIC_API_KEY"]`. It is **never** exposed to the browser or baked into the image.

Optional extra secrets if you want to override defaults:

- `ANALYST_DAILY_CAP` — integer, default `500`
- `ANALYST_MODEL` — Anthropic model string, default `claude-sonnet-4-20250514`

## 4. Create a Hugging Face access token

GitHub Actions needs a token to push to the Space on your behalf.

1. Go to <https://huggingface.co/settings/tokens>
2. Click **+ Create new token**
3. **Token type:** **Write** (important — read-only tokens can't push)
4. **Name:** `github-actions-mediapulse`
5. Click **Create token** and copy the value immediately.

## 5. Add secrets to GitHub Actions

On your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Add three:

| Name           | Value                                                         |
| -------------- | ------------------------------------------------------------- |
| `HF_TOKEN`     | The HF write token you just created                            |
| `HF_USERNAME`  | Your HF username (e.g. `akshargupta`)                          |
| `HF_SPACE`     | The Space name (e.g. `mediapulse`)                             |

## 6. Trigger the first sync

Make any trivial commit and push:

```bash
git commit --allow-empty -m "Trigger first HF sync"
git push
```

Watch it run:

- **GitHub → Actions tab** — should show a job titled "Sync to Hugging Face Space" running, then green.
- **HF Space page** — within ~30 seconds you should see a **Building** banner, then ~2–4 minutes of Docker build logs, then **Running**.

The Space URL is `https://huggingface.co/spaces/<YOUR_HF_USERNAME>/mediapulse`. Click the arrow icon (top right) to open it full-screen.

## 7. Verify the analyst works

Open the live Space in a new tab. The analyst panel should show a **Proxy** badge (not **Direct**). Ask it a question like "which channel has the best ROAS?" — if it answers, the key is wired correctly.

If it errors with "ANTHROPIC_API_KEY not configured on the server":

- Double-check the secret name in Space settings is exactly `ANTHROPIC_API_KEY` (case-sensitive)
- Hit **Factory rebuild** in the Space settings to force a fresh container with the secret injected

## From now on

```bash
# edit stuff
git add .
git commit -m "Tweak KPI card spacing"
git push
```

That's it. GitHub Actions mirrors to HF, HF rebuilds the Docker image, the Space swaps to the new container. End-to-end typically 3–5 minutes.

## Troubleshooting

**Action fails with "Missing one of HF_TOKEN / HF_USERNAME / HF_SPACE secrets"**
One of the three GitHub secrets in step 5 is missing or misspelled.

**Action fails with `remote: Invalid username or password`**
The `HF_TOKEN` secret is either the wrong token or a read-only token. Generate a new **Write** token and update the secret.

**HF build fails at `npm ci`**
Make sure `package-lock.json` is committed to the repo. It is by default, but check `git status` doesn't show it as ignored.

**Space says "Building" forever**
Click into the Space's **Logs** tab. Docker build errors show up there. The most common one is missing `postcss.config.js` or `tsconfig.app.json` — the Dockerfile copies them explicitly.

**Analyst says "Daily cap reached"**
You (or a visitor) hit the 500-call daily cap. It resets at UTC midnight, or you can trigger **Factory rebuild** in Space settings to restart the counter. To raise the cap, add `ANALYST_DAILY_CAP=2000` as a Space variable (not secret) and rebuild.

**I want to test the Docker image locally before pushing**
```bash
docker build -t mediapulse .
docker run -p 7860:7860 -e ANTHROPIC_API_KEY=sk-ant-... mediapulse
open http://localhost:7860
```
