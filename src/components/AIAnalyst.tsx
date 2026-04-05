import { useEffect, useMemo, useRef, useState } from 'react'
import { KeyRound, Send, Sparkles } from 'lucide-react'
import { askClaude, USES_PROXY, type ChatMessage } from '../claude'
import { buildAnalystContext } from '../data'
import { usePeriod } from '../PeriodContext'

const STORAGE_KEY = 'mediapulse_anthropic_key'

const SAMPLE_QS = [
  { short: 'Best channel', full: 'Which channel has the best ROAS and why?' },
  { short: 'Rebalance', full: 'How should I rebalance next quarter based on this one?' },
  { short: 'CPA drivers', full: 'What drove the change in CPA over this period?' },
  { short: 'Summary', full: 'Give me a 5-bullet executive summary of this period.' },
]

export function AIAnalyst() {
  const { period } = usePeriod()
  const systemPrompt = useMemo(() => buildAnalystContext(period), [period])

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: 'assistant',
      content: `Context loaded: ${period.label} (${period.sublabel}).\n\nAsk me about campaign performance, budget allocation, or optimization opportunities.`,
    },
  ])

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `Context reloaded: ${period.label} (${period.sublabel}).\n\nAsk me about performance, budget, or optimization.`,
      },
    ])
  }, [period.id, period.label, period.sublabel])

  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [apiKey, setApiKey] = useState<string>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) ?? '' : '',
  )
  const [keyOpen, setKeyOpen] = useState(false)
  const [tempKey, setTempKey] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  async function send(q?: string) {
    const text = (q ?? input).trim()
    if (!text || busy) return
    if (!USES_PROXY && !apiKey) {
      setKeyOpen(true)
      return
    }
    setInput('')
    const next: ChatMessage[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setBusy(true)
    try {
      const reply = await askClaude(apiKey, systemPrompt, next)
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'request failed'
      setMessages([
        ...next,
        {
          role: 'assistant',
          content: `Error: ${msg}. Check ${USES_PROXY ? 'proxy status' : 'API key / network'}.`,
        },
      ])
    } finally {
      setBusy(false)
    }
  }

  function saveKey() {
    const k = tempKey.trim()
    if (!k) return
    setApiKey(k)
    localStorage.setItem(STORAGE_KEY, k)
    setTempKey('')
    setKeyOpen(false)
  }

  return (
    <div className="bg-card border border-line rounded-lg shadow-card flex flex-col overflow-hidden min-h-[430px]">
      <div className="px-4 py-3 border-b border-line flex items-center gap-2 flex-shrink-0 bg-bg2/50">
        <Sparkles size={13} className="text-accent" />
        <span className="text-[13px] font-semibold text-ink">Claude analyst</span>
        <span className="ml-auto text-[10px] text-ink3 border border-line rounded-full px-2 py-0.5 font-medium">
          {USES_PROXY ? 'Proxy' : 'Direct'}
        </span>
        {!USES_PROXY && (
          <button
            onClick={() => setKeyOpen(true)}
            className="text-ink3 hover:text-ink transition-colors"
            title="Set API key"
          >
            <KeyRound size={13} />
          </button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0 max-h-[310px]"
      >
        {messages.map((m, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div
              className={`text-[10px] font-semibold uppercase tracking-[0.04em] ${
                m.role === 'user' ? 'text-accent' : 'text-ink3'
              }`}
            >
              {m.role === 'user' ? 'You' : 'Claude'}
            </div>
            <div
              className={`whitespace-pre-wrap text-[12.5px] leading-[1.55] rounded-md px-3 py-2 ${
                m.role === 'user'
                  ? 'bg-bg2 text-ink'
                  : 'bg-card text-ink border border-line'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-ink3 text-[12px] px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.04em]">Claude</span>
            <span>thinking</span>
            <span className="flex gap-0.5">
              <Dot delay={0} />
              <Dot delay={200} />
              <Dot delay={400} />
            </span>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-line flex-shrink-0">
        <div className="flex items-center gap-2 border border-line rounded-md px-3 py-1.5 focus-within:border-ink3 transition-colors bg-card">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                void send()
              }
            }}
            placeholder="Ask about performance, budgets, optimization…"
            className="flex-1 bg-transparent outline-none text-[12.5px] placeholder:text-ink3 text-ink"
          />
          <button
            onClick={() => void send()}
            disabled={busy || !input.trim()}
            className="text-ink2 hover:text-accent disabled:opacity-30 transition-colors"
            aria-label="Send"
          >
            <Send size={14} />
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {SAMPLE_QS.map((q) => (
            <button
              key={q.full}
              onClick={() => void send(q.full)}
              className="text-[10.5px] text-ink2 bg-bg2 border border-line rounded-full px-2.5 py-1 hover:border-ink3 hover:text-ink transition-colors font-medium"
            >
              {q.short}
            </button>
          ))}
        </div>
      </div>

      {keyOpen && !USES_PROXY && (
        <div
          className="fixed inset-0 bg-ink/30 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
          onClick={() => setKeyOpen(false)}
        >
          <div
            className="bg-card border border-line rounded-lg p-6 max-w-[460px] w-full shadow-card-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[11px] text-ink3 font-medium uppercase tracking-[0.04em] mb-1">
              Authentication
            </div>
            <div className="text-[18px] font-semibold text-ink mb-2 tracking-[-0.01em]">
              Anthropic API key
            </div>
            <div className="text-[12.5px] text-ink2 mb-4 leading-relaxed">
              Required to power the analyst. Stored only in your browser's localStorage and sent
              directly to <span className="text-accent font-medium">api.anthropic.com</span> — never
              to any third party. Get one at{' '}
              <a
                href="https://console.anthropic.com"
                target="_blank"
                rel="noreferrer"
                className="text-accent underline"
              >
                console.anthropic.com
              </a>
              .
            </div>
            <div className="border border-line rounded-md px-3 py-2 bg-bg focus-within:border-ink3 transition-colors mb-3">
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="sk-ant-..."
                className="w-full bg-transparent text-[12.5px] font-mono outline-none text-ink placeholder:text-ink3"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setKeyOpen(false)}
                className="px-3 py-1.5 text-[12px] text-ink2 hover:text-ink border border-line rounded-md font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveKey}
                className="px-3 py-1.5 text-[12px] text-card bg-ink hover:bg-ink2 rounded-md font-medium"
              >
                Save key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="text-ink3"
      style={{
        animation: `blink 1.2s ${delay}ms step-end infinite`,
      }}
    >
      •
    </span>
  )
}
