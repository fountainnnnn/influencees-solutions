import { Link } from 'react-router-dom'
import { Activity, ShieldCheck, Zap } from 'lucide-react'
import { useStore } from '../state/store'
import { Card, SectionLabel, relTime, cx } from '../components/ui'

const eventTone: Record<string, string> = {
  discovery: 'bg-info',
  draft: 'bg-warn',
  send: 'bg-ok',
  mode: 'bg-accent',
  reply: 'bg-ink',
  approval: 'bg-warn',
  system: 'bg-ink-3',
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <Card className="stat-tint px-4 py-3.5">
      <div className="text-[12px] text-ink-2">{label}</div>
      <div className="mono mt-1 text-[26px] font-medium leading-none tabular text-ink">{value}</div>
      {sub && <div className="mt-1.5 text-[11px] text-ink-3">{sub}</div>}
    </Card>
  )
}

export default function Overview() {
  const leads = useStore((s) => s.leads)
  const conversations = useStore((s) => s.conversations)
  const messages = useStore((s) => s.messages)
  const approvals = useStore((s) => s.approvals)
  const events = useStore((s) => s.agentEvents)
  const globalMode = useStore((s) => s.settings.globalMode)

  const weekStart = new Date('2026-07-18T00:00:00+08:00').getTime()
  const leadsThisWeek = leads.filter((l) => new Date(l.discoveredAt).getTime() >= weekStart).length
  const sent = messages.filter((m) => m.author === 'agent' && m.status !== 'draft').length
  const replies = messages.filter((m) => m.author === 'contact').length
  const contacted = conversations.filter((c) => c.stage !== 'queued' && c.stage !== 'scored').length
  const replyRate = contacted > 0 ? Math.round((replies / contacted) * 100) : 0
  const positive = messages.filter((m) => m.author === 'contact' && m.intent === 'Interested').length
  const meetings = leads.filter((l) => l.stage === 'meeting').length
  const pending = approvals.filter((a) => a.status === 'pending').length

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Stat label="Leads this week" value={String(leadsThisWeek)} sub="discovered + scored" />
        <Stat label="Messages sent" value={String(sent)} sub="agent + approved" />
        <Stat label="Reply rate" value={`${replyRate}%`} sub={`${replies} of ${contacted} contacted`} />
        <Stat label="Positive" value={String(positive)} sub="classified Interested" />
        <Stat label="Meetings" value={String(meetings)} sub="booked" />
        <Stat label="Awaiting approval" value={String(pending)} sub="in your queue" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Activity feed */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <Activity className="h-4 w-4 text-ink-2" strokeWidth={1.75} />
            <div className="text-[13px] font-medium text-ink">Live agent activity</div>
            <div className="mono ml-auto text-[11px] text-ink-3">audit feed</div>
          </div>
          <ul className="divide-y divide-line">
            {events.slice(0, 12).map((e) => (
              <li key={e.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className={cx('inline-block h-1.5 w-1.5 shrink-0 rounded-full', eventTone[e.type] ?? 'bg-ink-3')} />
                <span className="min-w-0 flex-1 truncate text-[13px] text-ink" title={e.text}>{e.text}</span>
                <span className="mono shrink-0 text-[11px] text-ink-3">{relTime(e.ts)}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Mode callout */}
        <div className="flex flex-col gap-4">
          <Card className="px-4 py-4">
            <SectionLabel>Current mode</SectionLabel>
            <div className="mt-2 flex items-center gap-2">
              {globalMode === 'auto' ? (
                <Zap className="h-4 w-4 text-accent" strokeWidth={1.75} />
              ) : (
                <ShieldCheck className="h-4 w-4 text-info" strokeWidth={1.75} />
              )}
              <span className={cx('text-[15px] font-semibold', globalMode === 'auto' ? 'text-accent' : 'text-info')}>
                {globalMode === 'auto' ? 'Autonomous' : 'Human approval'}
              </span>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-ink-2">
              {globalMode === 'auto'
                ? 'Agent sends after a policy check. Pricing, legal, hostile, opt-out and low-confidence still escalate to Approvals.'
                : 'Every draft waits in Approvals. Nothing sends without your click.'}
            </p>
            <div className="mt-3 flex gap-2">
              <Link to="/approvals" className="btn btn-xs btn-secondary">
                {pending} awaiting →
              </Link>
              <Link to="/inbox" className="btn btn-xs btn-secondary">
                Open Inbox →
              </Link>
            </div>
          </Card>

          <Card className="px-4 py-4">
            <SectionLabel>Pipeline</SectionLabel>
            <ul className="mt-2 space-y-1.5">
              {(['scored', 'queued', 'contacted', 'replied', 'negotiating', 'meeting'] as const).map((st) => {
                const n = leads.filter((l) => l.stage === st).length
                return (
                  <li key={st} className="flex items-center justify-between text-[12px]">
                    <span className="capitalize text-ink-2">{st}</span>
                    <span className="mono tabular text-ink">{n}</span>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
