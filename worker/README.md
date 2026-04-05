# MediaPulse Analyst Worker

Tiny Cloudflare Worker that proxies the MediaPulse dashboard's AI analyst requests to the Anthropic Messages API. The Anthropic key lives as a Worker secret and is never shipped to the browser.

## One-time setup

```bash
cd worker
npm install
npx wrangler login                       # opens browser, free tier is fine
npx wrangler secret put ANTHROPIC_API_KEY # paste sk-ant-... once
npx wrangler deploy
```

Wrangler prints a URL like `https://mediapulse-analyst.<you>.workers.dev`. The analyst endpoint is that URL + `/api/analyst`.

## Point the frontend at it

In the `mediapulse/` project root, build the dashboard with:

```bash
VITE_ANALYST_URL=https://mediapulse-analyst.<you>.workers.dev/api/analyst npm run build
```

The built site now calls the Worker instead of `api.anthropic.com`, and the API key prompt disappears from the UI.

## Locking down origins (optional but recommended)

Uncomment the `[vars]` block in `wrangler.toml` and add the domains that should be allowed to call the Worker (e.g. your Hugging Face Space URL). Re-deploy with `npx wrangler deploy`.

## Local dev

```bash
npx wrangler dev     # serves at http://localhost:8787
```

Then run the frontend with `VITE_ANALYST_URL=http://localhost:8787/api/analyst npm run dev` in a second terminal.
