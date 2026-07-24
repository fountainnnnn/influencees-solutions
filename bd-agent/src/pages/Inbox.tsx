import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Bot,
  UserCheck,
  Send,
  Sparkles,
  Check,
  X,
  Pencil,
  ExternalLink,
  Clock,
  Radar,
  FastForward,
  ThumbsUp,
  DollarSign,
  Ban,
} from 'lucide-react'
import { useStore, getEffectiveMode } from '../state/store'
import type { SendGateResult } from '../state/store'
import { injectReply, advanceTime, runSequence } from '../sim/engine'
import { useRuntime } from '../state/runtime'
import {
  Chip,
  ModeChip,
  StageChip,
  SectionLabel,
  EmptyState,
  Spinner,
  fmtDate,
  fmtTime,
  cx,
} from '../components/ui'
import type { Conversation, Message, ActivityEntry, ModeOverride } from '../types'

// ---- Conversation list (column a) ----
function ConversationRow({ conv, selected, onClick }: { conv: Conversation; selected: boolean; onClick: () => void }) {
  const lead = useStore((s) => s.leads.find((l) => l.id === conv.leadId))
  const messages = useStore((s) => s.messages)
  const settings = useStore((s) => s.settings)
  const last = [...messages].filter((m) => m.conversationId === conv.id && m.status !== 'draft').at(-1)
  const eff = getEffectiveMode(conv, settings)

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'w-full border-b border-line px-3 py-2.5 text-left transition-colors duration-150',
        selected ? 'bg-accent/6' : 'hover:bg-paper',
      )}
    >
      <div className="flex items-center gap-1.5">
        {conv.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
        <span className="flex-1 truncate text-[13px] font-medium text-ink">{lead?.company}</span>
        {conv.owner === 'human' ? (
          <UserCheck className="h-3.5 w-3.5 text-ink-2" strokeWidth={1.75} />
        ) : (
          <Bot className="h-3.5 w-3.5 text-ink-3" strokeWidth={1.75} />
        )}
      </div>
      <div className="mt-0.5 truncate text-[12px] text-ink-3">
        {last ? `${last.author === 'contact' ? lead?.contact.name.split(' ')[0] : last.author === 'human' ? 'You' : 'Agent'}: ${last.text}` : 'No messages yet'}
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <StageChip stage={conv.stage} />
        <ModeChip mode={eff} size="xs" />
      </div>
    </button>
  )
}

// ---- Timeline item (message or system/audit line) ----
type TimelineItem =
  | { kind: 'message'; ts: string; msg: Message }
  | { kind: 'system'; ts: string; entry: ActivityEntry }

function MessageBubble({ msg, contactName }: { msg: Message; contactName: string }) {
  const isAgent = msg.author === 'agent'
  const isHuman = msg.author === 'human'
  const label = isAgent ? 'Agent' : isHuman ? 'You' : contactName
  return (
    <div
      className={cx(
        'bd-fade-in rounded-md border-l-2 bg-surface px-3 py-2',
        isAgent ? 'border-accent' : isHuman ? 'border-ink' : 'border-line',
      )}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className={cx('text-[11px] font-semibold', isAgent ? 'text-accent' : isHuman ? 'text-ink' : 'text-ink-2')}>{label}</span>
        {msg.intent && (
          <Chip tone={msg.intent === 'Interested' ? 'ok' : msg.intent.startsWith('Pricing') ? 'warn' : 'neutral'} className="py-0">
            Intent: {msg.intent} <span className="mono">({msg.confidence?.toFixed(2)})</span>
          </Chip>
        )}
        <span className="mono ml-auto text-[10px] text-ink-3">{fmtTime(msg.ts)}</span>
      </div>
      <p className="text-[13px] leading-relaxed text-ink">{msg.text}</p>
      {msg.status && (
        <div className="mono mt-1 text-[10px] uppercase tracking-wide text-ink-3">{msg.status}</div>
      )}
    </div>
  )
}

function SystemLine({ text }: { text: string }) {
  return (
    <div className="bd-fade-in flex items-center gap-2 py-0.5">
      <span className="h-px flex-1 bg-line" />
      <span className="mono text-[10px] text-ink-3">{text}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  )
}

// ---- Inline approval card (draft pending) ----
function InlineApproval({ approvalId }: { approvalId: string }) {
  const ap = useStore((s) => s.approvals.find((a) => a.id === approvalId))
  const approve = useStore((s) => s.approve)
  const reject = useStore((s) => s.reject)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(ap?.draftText ?? '')
  if (!ap || ap.status !== 'pending') return null

  return (
    <div className="bd-fade-in rounded-md border-2 border-dashed border-accent/60 bg-accent/4 px-3 py-2.5">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="mono rounded bg-accent/12 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">Awaiting approval</span>
        <Chip tone={ap.reasonKind === 'escalation' ? 'warn' : 'info'} className="py-0 ml-auto">{ap.reason}</Chip>
      </div>
      {editing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full resize-none rounded-md border border-line bg-surface px-2.5 py-2 text-[13px] leading-relaxed text-ink outline-none focus:border-accent/50"
          rows={5}
        />
      ) : (
        <p className="text-[13px] leading-relaxed text-ink">{ap.draftText}</p>
      )}
      <div className="mt-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => approve(ap.id, editing ? text : undefined)}
          className="btn btn-xs btn-ok"
        >
          <Check className="h-3.5 w-3.5" /> {editing ? 'Save & approve' : 'Approve'}
        </button>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="btn btn-xs btn-secondary"
        >
          <Pencil className="h-3.5 w-3.5" /> {editing ? 'Cancel edit' : 'Edit'}
        </button>
        <button
          type="button"
          onClick={() => reject(ap.id)}
          className="btn btn-xs btn-secondary hover:!text-accent"
        >
          <X className="h-3.5 w-3.5" /> Reject
        </button>
      </div>
    </div>
  )
}

// ---- Thread (column b) ----
function Thread({ conv }: { conv: Conversation }) {
  const lead = useStore((s) => s.leads.find((l) => l.id === conv.leadId))
  const allMessages = useStore((s) => s.messages)
  const allApprovals = useStore((s) => s.approvals)
  const settings = useStore((s) => s.settings)
  const messages = useMemo(() => allMessages.filter((m) => m.conversationId === conv.id), [allMessages, conv.id])
  const approvals = useMemo(
    () => allApprovals.filter((a) => a.conversationId === conv.id && a.status === 'pending'),
    [allApprovals, conv.id],
  )
  const humanSend = useStore((s) => s.humanSend)
  const rtBegin = useRuntime((s) => s.begin)
  const rtEnd = useRuntime((s) => s.end)

  const [composer, setComposer] = useState('')
  const [agentDrafting, setAgentDrafting] = useState(false)
  const cancelRef = useRef<(() => void) | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => () => cancelRef.current?.(), [])
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, approvals.length])

  const eff = getEffectiveMode(conv, settings)
  const humanOwned = conv.owner === 'human'

  // Build interleaved timeline (messages + activity), drafts excluded (shown as approvals).
  const timeline = useMemo<TimelineItem[]>(() => {
    const items: TimelineItem[] = []
    for (const m of messages) if (m.status !== 'draft') items.push({ kind: 'message', ts: m.ts, msg: m })
    for (const a of conv.activity) items.push({ kind: 'system', ts: a.ts, entry: a })
    return items.sort((x, y) => (x.ts < y.ts ? -1 : x.ts > y.ts ? 1 : 0))
  }, [messages, conv.activity])

  const send = () => {
    if (!composer.trim()) return
    humanSend(conv.id, composer)
    setComposer('')
  }

  // "Ask agent to draft": visible mini draft cycle routed through sendGate.
  const askAgent = () => {
    if (agentDrafting || humanOwned) return
    setAgentDrafting(true)
    rtBegin()
    const draft = `Thanks for the note. I can put a short sample shortlist together and walk through the match score on a quick call this week. Would that be useful?`
    cancelRef.current = runSequence([
      { delay: 900, run: () => {} },
      {
        delay: 900,
        run: () => {
          useStore.getState().sendGate({
            conversationId: conv.id,
            draftText: draft,
            reasonKind: 'reply',
            reason: 'Reply to inbound',
            citesEvidenceIds: lead?.evidence.slice(0, 1).map((e) => e.id) ?? [],
          })
          rtEnd()
          setAgentDrafting(false)
        },
      },
    ])
  }

  // group timeline by date
  const groups: { date: string; items: TimelineItem[] }[] = []
  for (const it of timeline) {
    const d = fmtDate(it.ts)
    const g = groups.at(-1)
    if (g && g.date === d) g.items.push(it)
    else groups.push({ date: d, items: [it] })
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* thread header */}
      <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2.5">
        <div className="min-w-0">
          <SectionLabel>Thread</SectionLabel>
          <div className="mt-1 truncate text-[13px] font-medium text-ink">{lead?.company}</div>
          <div className="truncate text-[11px] text-ink-3">{lead?.contact.name} · {lead?.contact.role}</div>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <StageChip stage={conv.stage} />
          <ModeChip mode={eff} />
          {humanOwned ? (
            <Chip tone="neutral"><UserCheck className="h-3 w-3" /> You own</Chip>
          ) : (
            <Chip tone="neutral"><Bot className="h-3 w-3" /> Agent owns</Chip>
          )}
        </div>
      </div>

      {/* messages */}
      <div className="min-h-0 flex-1 space-y-2 overflow-auto px-4 py-3">
        {groups.map((g, gi) => (
          <div key={gi} className="space-y-2">
            <div className="flex items-center justify-center py-1">
              <span className="mono rounded-full border border-line bg-surface px-2 py-0.5 text-[10px] text-ink-3">{g.date}</span>
            </div>
            {g.items.map((it) =>
              it.kind === 'message' ? (
                <MessageBubble key={it.msg.id} msg={it.msg} contactName={lead?.contact.name.split(' ')[0] ?? 'Contact'} />
              ) : (
                <SystemLine key={it.entry.id} text={it.entry.text} />
              ),
            )}
          </div>
        ))}

        {/* pending drafts inline */}
        {approvals.map((a) => (
          <InlineApproval key={a.id} approvalId={a.id} />
        ))}

        {agentDrafting && (
          <div className="mono flex items-center gap-1.5 px-1 py-1 text-[11px] text-accent">
            <Spinner className="h-3 w-3" /> Agent drafting a reply…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* composer */}
      <div className="border-t border-line px-4 py-3">
        {humanOwned && (
          <div className="mono mb-2 text-[10px] text-ink-3">You own this thread. The agent will not send.</div>
        )}
        <textarea
          value={composer}
          onChange={(e) => setComposer(e.target.value)}
          placeholder="Write a message as You…"
          className="w-full resize-none rounded-md border border-line bg-surface px-3 py-2 text-[13px] leading-relaxed text-ink outline-none transition-colors focus:border-accent/50"
          rows={2}
        />
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={send}
            disabled={!composer.trim()}
            className={cx('btn btn-xs', composer.trim() ? 'btn-primary' : 'btn-disabled')}
          >
            <Send className="h-3.5 w-3.5" strokeWidth={2} /> Send as You
          </button>
          <button
            type="button"
            onClick={askAgent}
            disabled={humanOwned || agentDrafting}
            title={humanOwned ? 'Agent is paused, you own this thread' : 'Agent drafts a reply, routed by the effective mode'}
            className={cx('btn btn-xs', humanOwned || agentDrafting ? 'btn-disabled' : 'btn-secondary')}
          >
            <Sparkles className="h-3.5 w-3.5" /> Ask agent to draft
          </button>
          <span className="mono ml-auto text-[10px] text-ink-3">Channel: LinkedIn (simulated)</span>
        </div>
      </div>
    </div>
  )
}

// ---- Context panel (column c) ----
function ContextPanel({ conv }: { conv: Conversation }) {
  const lead = useStore((s) => s.leads.find((l) => l.id === conv.leadId))
  const setOverride = useStore((s) => s.setOverride)
  const takeOver = useStore((s) => s.takeOver)
  const returnToAgent = useStore((s) => s.returnToAgent)
  const [injecting, setInjecting] = useState(false)
  const [advancing, setAdvancing] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  const cancelRef = useRef<(() => void) | null>(null)
  useEffect(() => () => cancelRef.current?.(), [])

  const humanOwned = conv.owner === 'human'

  const runInject = (kind: 'positive' | 'pricing' | 'notinterested') => {
    if (injecting) return
    setInjecting(true)
    setNote(null)
    cancelRef.current = injectReply(conv.id, kind, {
      onResult: (r: SendGateResult) => {
        setInjecting(false)
        setNote(
          r === 'sent'
            ? 'Reply auto-sent after policy check.'
            : r === 'approval'
              ? 'Response routed to Approvals for review.'
              : r === 'blocked'
                ? 'Agent send blocked, you own this thread.'
                : 'Response held (thread paused).',
        )
      },
    })
  }

  const runAdvance = () => {
    if (advancing || !conv.nextFollowUp) return
    setAdvancing(true)
    setNote(null)
    cancelRef.current = advanceTime(conv.id, {
      onResult: (r) => {
        setAdvancing(false)
        if (r === 'none') setNote('No follow-up scheduled.')
        else if (r === 'sent') setNote('Follow-up auto-sent after policy check.')
        else if (r === 'approval') setNote('Follow-up routed to Approvals.')
        else if (r === 'blocked') setNote('Follow-up blocked, you own this thread.')
        else setNote('Follow-up held (thread paused).')
      },
    })
  }

  return (
    <div className="flex w-80 shrink-0 flex-col overflow-auto border-l border-line bg-paper">
      {/* zone header */}
      <div className="sticky top-0 z-10 border-b border-line bg-paper px-4 py-2.5">
        <SectionLabel>Context</SectionLabel>
      </div>

      {/* company */}
      <section className="border-b border-line px-4 py-4">
        <SectionLabel>Company</SectionLabel>
        <div className="mt-2 text-[13px] font-medium text-ink">{lead?.company}</div>
        <div className="mono mt-0.5 text-[11px] text-ink-3">{lead?.niche} · {lead?.staff} staff · fit {lead?.fitScore}</div>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-2">{lead?.profile}</p>
      </section>

      {/* summary */}
      <section className="border-b border-line px-4 py-4">
        <SectionLabel>Agent summary</SectionLabel>
        <p className="mt-2 text-[12px] leading-relaxed text-ink-2">{conv.summary}</p>
      </section>

      {/* controls: autonomy + owner + follow-up */}
      <section className="border-b border-line px-4 py-4">
        <SectionLabel>Controls</SectionLabel>
        <select
          value={conv.modeOverride}
          onChange={(e) => setOverride(conv.id, e.target.value as ModeOverride)}
          aria-label="Autonomy for this thread"
          className="mt-2 w-full rounded-md border border-line bg-surface px-2.5 py-2 text-[12px] text-ink outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30"
        >
          <option value="inherit">Autonomy: inherit global</option>
          <option value="human">Autonomy: force human approval</option>
          <option value="auto">Autonomy: force autonomous</option>
          <option value="paused">Autonomy: paused</option>
        </select>

        {humanOwned ? (
          <button
            type="button"
            onClick={() => returnToAgent(conv.id)}
            className="btn btn-secondary mt-2 w-full"
          >
            <Bot className="h-3.5 w-3.5" /> Return to agent
          </button>
        ) : (
          <button
            type="button"
            onClick={() => takeOver(conv.id)}
            className="btn btn-secondary mt-2 w-full"
          >
            <UserCheck className="h-3.5 w-3.5" /> Take over
          </button>
        )}

        <div className="mt-2.5 flex items-center gap-1.5 text-[12px]">
          <Clock className="h-3.5 w-3.5 shrink-0 text-ink-3" />
          {conv.nextFollowUp ? (
            <span className="mono text-ink">Follow-up {conv.nextFollowUp}</span>
          ) : (
            <span className="text-ink-3">No follow-up scheduled</span>
          )}
        </div>
      </section>

      {/* evidence */}
      <section className="border-b border-line px-4 py-4">
        <SectionLabel>Evidence · {lead?.evidence.length}</SectionLabel>
        <div className="mt-2 space-y-1.5">
          {lead?.evidence.map((e) => (
            <div key={e.id} className="rounded-md border border-line bg-surface px-2.5 py-2">
              <div className="text-[12px] leading-snug text-ink">{e.claim}</div>
              <a
                href={`https://${e.sourceUrl}`}
                onClick={(ev) => ev.preventDefault()}
                className="mono mt-1 inline-flex items-center gap-1 text-[10px] text-info hover:underline"
                title="Simulated source"
              >
                <ExternalLink className="h-2.5 w-2.5" /> {fmtDate(e.retrievedAt)}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* activity log */}
      <section className="border-b border-line px-4 py-4">
        <SectionLabel>Thread activity</SectionLabel>
        <ul className="mt-2 space-y-1.5">
          {[...conv.activity].reverse().map((a) => (
            <li key={a.id} className="flex items-start gap-2 text-[11px] text-ink-2">
              <span className="mono shrink-0 text-ink-3">{fmtDate(a.ts)}</span>
              <span className="min-w-0">{a.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* demo controls */}
      <div className="mt-auto m-4 rounded-[14px] border border-line bg-white/60 px-3 py-3 backdrop-blur-md">
        <div className="mb-2 flex items-center gap-1.5">
          <Radar className="h-3.5 w-3.5 text-ink-3" />
          <span className="mono text-[10px] uppercase tracking-wider text-ink-3">Demo controls</span>
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          <button
            type="button"
            disabled={injecting}
            onClick={() => runInject('positive')}
            className="btn btn-xs btn-secondary w-full justify-start hover:!text-ok disabled:opacity-50"
          >
            <ThumbsUp className="h-3.5 w-3.5" /> Inject positive reply
          </button>
          <button
            type="button"
            disabled={injecting}
            onClick={() => runInject('pricing')}
            className="btn btn-xs btn-secondary w-full justify-start hover:!text-warn disabled:opacity-50"
          >
            <DollarSign className="h-3.5 w-3.5" /> Inject pricing question
          </button>
          <button
            type="button"
            disabled={injecting}
            onClick={() => runInject('notinterested')}
            className="btn btn-xs btn-secondary w-full justify-start hover:!text-accent disabled:opacity-50"
          >
            <Ban className="h-3.5 w-3.5" /> Inject not-interested
          </button>
          <button
            type="button"
            disabled={advancing || !conv.nextFollowUp}
            onClick={runAdvance}
            title={conv.nextFollowUp ? 'Fast-forward to the scheduled follow-up' : 'No follow-up scheduled'}
            className="btn btn-xs btn-secondary w-full justify-start disabled:opacity-50"
          >
            <FastForward className="h-3.5 w-3.5" /> Advance time
          </button>
        </div>
        {(injecting || advancing) && (
          <div className="mono mt-2 flex items-center gap-1.5 text-[10px] text-ink-3"><Spinner className="h-3 w-3" /> simulating…</div>
        )}
        {note && <div className="mt-2 text-[11px] text-ink-2">{note}</div>}
      </div>
    </div>
  )
}

export default function Inbox() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const conversations = useStore((s) => s.conversations)
  const markRead = useStore((s) => s.markRead)

  const ordered = useMemo(
    () => [...conversations].sort((a, b) => (a.unread === b.unread ? 0 : a.unread ? -1 : 1)),
    [conversations],
  )
  const selectedId = conversationId ?? ordered[0]?.id
  const conv = conversations.find((c) => c.id === selectedId)

  useEffect(() => {
    if (selectedId) markRead(selectedId)
  }, [selectedId, markRead])

  return (
    <div className="flex h-full min-h-0">
      {/* column a: conversation list */}
      <div className="flex w-64 shrink-0 flex-col overflow-auto border-r border-line bg-surface">
        <div className="sticky top-0 z-10 border-b border-line bg-surface px-3 py-2.5">
          <SectionLabel>Conversations · {conversations.length}</SectionLabel>
        </div>
        {ordered.map((c) => (
          <ConversationRow
            key={c.id}
            conv={c}
            selected={c.id === selectedId}
            onClick={() => navigate(`/inbox/${c.id}`)}
          />
        ))}
      </div>

      {/* column b: thread */}
      {conv ? (
        <Thread key={conv.id} conv={conv} />
      ) : (
        <div className="flex flex-1 items-center justify-center p-6">
          <EmptyState title="No conversation selected" hint="Pick a thread from the list." />
        </div>
      )}

      {/* column c: context */}
      {conv && <ContextPanel key={`ctx-${conv.id}`} conv={conv} />}
    </div>
  )
}
