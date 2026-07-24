import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, Pencil, CheckSquare } from 'lucide-react'
import { useStore } from '../state/store'
import { Card, Chip, EmptyState, SectionLabel, relTime, cx } from '../components/ui'
import type { Approval } from '../types'

function ApprovalCard({ ap }: { ap: Approval }) {
  const lead = useStore((s) => s.leads.find((l) => l.id === ap.leadId))
  const approve = useStore((s) => s.approve)
  const reject = useStore((s) => s.reject)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(ap.draftText)

  const citedEvidence = lead?.evidence.filter((e) => ap.citesEvidenceIds.includes(e.id)) ?? []

  return (
    <Card className="bd-fade-in px-4 py-3.5">
      <div className="flex items-center gap-2">
        <Link to={`/leads/${ap.leadId}`} className="text-[13px] font-medium text-ink hover:text-accent">{lead?.company}</Link>
        <Chip tone={ap.reasonKind === 'escalation' ? 'warn' : ap.reasonKind === 'reply' ? 'info' : 'neutral'}>{ap.reason}</Chip>
        <span className="mono ml-auto text-[11px] text-ink-3">{relTime(ap.createdAt)}</span>
      </div>
      <div className="mt-1 text-[11px] text-ink-3">{lead?.contact.name} · {lead?.contact.role} · {lead?.niche}</div>

      {editing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          className="mt-3 w-full resize-none rounded-md border border-line bg-surface px-3 py-2 text-[13px] leading-relaxed text-ink outline-none focus:border-accent/50"
        />
      ) : (
        <p className="mt-3 rounded-md border border-line bg-paper px-3 py-2.5 text-[13px] leading-relaxed text-ink">{ap.draftText}</p>
      )}

      {citedEvidence.length > 0 && (
        <div className="mt-2.5">
          <SectionLabel>Cites evidence</SectionLabel>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {citedEvidence.map((e) => (
              <Chip key={e.id} tone="neutral" className="max-w-full">
                <span className="truncate">{e.claim}</span>
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => approve(ap.id, editing ? text : undefined)}
          className="btn btn-xs btn-ok"
        >
          <Check className="h-3.5 w-3.5" /> {editing ? 'Save & approve' : 'Approve & send'}
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
        <Link to={`/inbox/${ap.conversationId}`} className="mono ml-auto text-[11px] text-ink-3 hover:text-ink">Open thread →</Link>
      </div>
    </Card>
  )
}

export default function Approvals() {
  const approvals = useStore((s) => s.approvals)
  const pending = approvals.filter((a) => a.status === 'pending')
  const resolved = approvals.filter((a) => a.status !== 'pending')
  const [showResolved, setShowResolved] = useState(false)

  return (
    <div className="mx-auto max-w-3xl px-6 py-6">
      <div className="mb-4 flex items-center gap-2">
        <CheckSquare className="h-4 w-4 text-ink-2" strokeWidth={1.75} />
        <SectionLabel>Approval queue · {pending.length} pending</SectionLabel>
        {resolved.length > 0 && (
          <button
            type="button"
            onClick={() => setShowResolved((v) => !v)}
            className="mono ml-auto text-[11px] text-ink-3 hover:text-ink"
          >
            {showResolved ? 'Hide' : 'Show'} resolved ({resolved.length})
          </button>
        )}
      </div>

      {pending.length === 0 ? (
        <EmptyState title="Nothing awaiting approval" hint="Agent drafts and escalations will appear here for your review." />
      ) : (
        <div className="space-y-3">
          {pending.map((ap) => (
            <ApprovalCard key={ap.id} ap={ap} />
          ))}
        </div>
      )}

      {showResolved && resolved.length > 0 && (
        <div className="mt-6 space-y-2">
          <SectionLabel>Resolved</SectionLabel>
          {resolved.map((ap) => (
            <ResolvedRow key={ap.id} ap={ap} />
          ))}
        </div>
      )}
    </div>
  )
}

function ResolvedRow({ ap }: { ap: Approval }) {
  const lead = useStore((s) => s.leads.find((l) => l.id === ap.leadId))
  return (
    <div className="flex items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-[12px]">
      <span className="font-medium text-ink">{lead?.company}</span>
      <span className="text-ink-3">{ap.reason}</span>
      <span
        className={cx('mono ml-auto rounded px-1.5 py-0.5 text-[10px] uppercase', ap.status === 'approved' ? 'text-ok' : 'text-ink-3')}
      >
        {ap.status}
      </span>
    </div>
  )
}
