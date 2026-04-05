// MediaPulse analyst proxy — runs on Cloudflare Workers.
//
// Accepts POST { model, system, messages, max_tokens } from the browser,
// injects the Anthropic API key from a Worker secret, and forwards the
// request to api.anthropic.com. This keeps the key off the client.
//
// Deploy:
//   npm install
//   npx wrangler secret put ANTHROPIC_API_KEY   # paste sk-ant-... once
//   npx wrangler deploy
//
// Then set VITE_ANALYST_URL=https://<your-worker>.workers.dev/api/analyst
// when you build the frontend.

export interface Env {
  ANTHROPIC_API_KEY: string
  // Comma-separated list of allowed origins; '*' allows all. Optional.
  ALLOWED_ORIGINS?: string
}

interface AnalystRequest {
  model?: string
  system?: string
  messages?: Array<{ role: 'user' | 'assistant'; content: string }>
  max_tokens?: number
}

const DEFAULT_MODEL = 'claude-sonnet-4-20250514'
const MAX_TOKENS_CAP = 1024

function corsHeaders(origin: string | null, env: Env): HeadersInit {
  const allowed = (env.ALLOWED_ORIGINS ?? '*').split(',').map((s) => s.trim())
  const allow =
    allowed.includes('*') || (origin && allowed.includes(origin)) ? origin ?? '*' : allowed[0]
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin')
    const cors = corsHeaders(origin, env)
    const url = new URL(request.url)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors })
    }

    if (url.pathname !== '/api/analyst') {
      return new Response('Not found', { status: 404, headers: cors })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: cors })
    }

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Worker is missing ANTHROPIC_API_KEY secret' }),
        { status: 500, headers: { ...cors, 'Content-Type': 'application/json' } },
      )
    }

    let body: AnalystRequest
    try {
      body = (await request.json()) as AnalystRequest
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const { model, system, messages, max_tokens } = body
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: '`messages` array required' }), {
        status: 400,
        headers: { ...cors, 'Content-Type': 'application/json' },
      })
    }

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model ?? DEFAULT_MODEL,
        max_tokens: Math.min(max_tokens ?? 600, MAX_TOKENS_CAP),
        system: system ?? '',
        messages,
      }),
    })

    const text = await upstream.text()
    return new Response(text, {
      status: upstream.status,
      headers: {
        ...cors,
        'Content-Type': upstream.headers.get('Content-Type') ?? 'application/json',
      },
    })
  },
}
