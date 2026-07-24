import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowUp } from 'lucide-react'
import StatusChip from './StatusChip'
import Avatar from './Avatar'
import AiKyoAvatar from './AiKyoAvatar'
import { creators } from '../data/creators'

/* ------------------------------------------------------------------ *
 * Ai-kyo: a self-contained mock chat. No API. Canned replies chosen by
 * simple keyword matching, with rotating defaults so repeat sends do
 * not read identically.
 * ------------------------------------------------------------------ */

type Msg = { id: number; role: 'user' | 'ai'; content: ReactNode }

const pick = (handle: string) => creators.find((c) => c.handle === handle)!

function MatchRow({ handle, er }: { handle: string; er: string }) {
  const c = pick(handle)
  return (
    <div className="flex items-center gap-2">
      <Avatar src={c.avatar} name={c.name} size={24} />
      <span className="min-w-0 truncate font-mono text-xs text-ink" title={c.name}>
        {c.platforms[0].handle}
      </span>
      <span className="tabular ml-auto shrink-0 font-mono text-xs text-ink-2">
        {er} ER
      </span>
    </div>
  )
}

function matchedReply(): ReactNode {
  return (
    <div>
      Three verified SG creators that fit:
      <div className="mt-2.5 space-y-2">
        <MatchRow handle="clarity" er="4.8%" />
        <MatchRow handle="riona" er="5.1%" />
        <MatchRow handle="janae-chua" er="6.2%" />
      </div>
      <p className="mt-2.5 font-mono text-[11px] text-ink-3">
        Metrics are estimates for demonstration.
      </p>
    </div>
  )
}

function briefReply(): ReactNode {
  return (
    <div>
      Draft brief outline:
      <ul className="mt-2 space-y-1 font-mono text-xs text-ink-2">
        <li>Deliverables: 1 reel, 3 stories</li>
        <li>Timeline: shoot week 1, live week 2</li>
        <li>Usage rights: 30 days paid, organic only</li>
        <li>Budget: S$900 to S$1,200</li>
      </ul>
    </div>
  )
}

function pricingReply(): ReactNode {
  return (
    <div>
      Brand plans:
      <ul className="mt-2 space-y-1 font-mono text-xs text-ink-2">
        <li>Starter $49/mo</li>
        <li>Growth $119/mo</li>
        <li>Brand Pro $249/mo</li>
      </ul>
      <p className="mt-2 text-ink-2">
        Creators start free. Creator Pro is $16/mo.
      </p>
    </div>
  )
}

const DEFAULTS: ReactNode[] = [
  'I can find creators, draft a campaign brief, or explain pricing. Try "find beauty creators in Singapore".',
  'Ask me to shortlist SG creators by niche and engagement, draft a brief, or break down the plans.',
  'I work from verified data. Ask for matches, a brief outline, or what a plan costs.',
]

let seq = 3
function reply(text: string, defaultTurn: number): ReactNode {
  const t = text.toLowerCase()
  if (/(creator|find|beauty|food|engagement|shortlist|match)/.test(t)) return matchedReply()
  if (/(brief|draft|pitch|outline)/.test(t)) return briefReply()
  if (/(pric|plan|cost|\$|budget|how much)/.test(t)) return pricingReply()
  return DEFAULTS[defaultTurn % DEFAULTS.length]
}

export default function AiKyoChat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      role: 'user',
      content: 'Find beauty micro-creators in Singapore with 4%+ engagement.',
    },
    { id: 2, role: 'ai', content: matchedReply() },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const defaultTurn = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing])

  function send() {
    const text = input.trim()
    if (!text || typing) return
    const userMsg: Msg = { id: ++seq, role: 'user', content: text }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setTyping(true)
    const turn = defaultTurn.current++
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: ++seq, role: 'ai', content: reply(text, turn) }])
      setTyping(false)
    }, 1000)
  }

  return (
    <div className="mx-auto flex h-[460px] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-[0_10px_30px_-10px_rgba(27,16,82,0.25)]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <AiKyoAvatar size={28} />
        <span className="font-mono text-sm font-medium text-ink">Ai-kyo</span>
        <StatusChip status="BETA" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
        {messages.map((m) =>
          m.role === 'user' ? (
            <div
              key={m.id}
              className="ml-auto max-w-[85%] break-words rounded-2xl rounded-br-sm bg-ink px-3.5 py-2 text-white"
            >
              {m.content}
            </div>
          ) : (
            <div
              key={m.id}
              className="max-w-[92%] break-words rounded-2xl rounded-bl-sm border border-line bg-paper px-3.5 py-2 text-ink"
            >
              {m.content}
            </div>
          ),
        )}
        {typing && (
          <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-sm border border-line bg-paper px-3 py-2.5">
            <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-3" />
            <span
              className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-3"
              style={{ animationDelay: '0.15s' }}
            />
            <span
              className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-3"
              style={{ animationDelay: '0.3s' }}
            />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-2 rounded-full border border-line bg-white pl-4 pr-1.5 focus-within:border-ink-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                send()
              }
            }}
            placeholder="Ask Ai-kyo anything"
            aria-label="Ask Ai-kyo"
            className="h-9 w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-3"
          />
          <button
            type="button"
            onClick={send}
            aria-label="Send"
            className="btn btn-primary inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-0"
          >
            <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
