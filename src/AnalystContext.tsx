import { createContext, useContext, useState, type ReactNode } from 'react'
import type { ChatMessage } from './claude'

// ---------------------------------------------------------------------------
// AnalystContext
//
// Holds the Claude analyst's conversation state at the App level so it
// survives tab switches (the AIAnalyst component only renders inside the
// Overview tab, so without this the messages would reset every time the
// user navigates away and back).
// ---------------------------------------------------------------------------

interface AnalystContextValue {
  messages: ChatMessage[]
  setMessages: (m: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void
  input: string
  setInput: (s: string) => void
  busy: boolean
  setBusy: (b: boolean) => void
  apiKey: string
  setApiKey: (k: string) => void
}

const AnalystContext = createContext<AnalystContextValue | null>(null)

const STORAGE_KEY = 'mediapulse_anthropic_key'

export function AnalystProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [apiKey, setApiKeyState] = useState<string>(() =>
    typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) ?? '' : '',
  )

  const setApiKey = (k: string) => {
    setApiKeyState(k)
    if (typeof window !== 'undefined') {
      if (k) localStorage.setItem(STORAGE_KEY, k)
      else localStorage.removeItem(STORAGE_KEY)
    }
  }

  return (
    <AnalystContext.Provider
      value={{ messages, setMessages, input, setInput, busy, setBusy, apiKey, setApiKey }}
    >
      {children}
    </AnalystContext.Provider>
  )
}

export function useAnalyst(): AnalystContextValue {
  const ctx = useContext(AnalystContext)
  if (!ctx) throw new Error('useAnalyst must be used inside <AnalystProvider>')
  return ctx
}
