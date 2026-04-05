export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// If VITE_ANALYST_URL is set at build time, the app talks to that URL
// (a Cloudflare Worker / serverless function that holds the API key
// server-side). Otherwise it falls back to a direct browser → Anthropic
// call using a user-provided key from localStorage (BYO-key mode).
export const ANALYST_URL: string | undefined = (
  import.meta.env.VITE_ANALYST_URL as string | undefined
)?.trim() || undefined

export const USES_PROXY = !!ANALYST_URL

export async function askClaude(
  apiKey: string,
  system: string,
  messages: ChatMessage[],
  model = 'claude-sonnet-4-20250514',
): Promise<string> {
  if (ANALYST_URL) {
    // Proxy mode: the Worker holds the key and injects it server-side.
    const res = await fetch(ANALYST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, system, messages, max_tokens: 600 }),
    })
    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Proxy ${res.status}: ${errText.slice(0, 200)}`)
    }
    const data = await res.json()
    return data?.content?.[0]?.text ?? data?.reply ?? 'No response generated.'
  }

  // BYO-key mode: direct browser → Anthropic.
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 600,
      system,
      messages,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`API ${res.status}: ${errText.slice(0, 200)}`)
  }

  const data = await res.json()
  return data?.content?.[0]?.text ?? 'No response generated.'
}
