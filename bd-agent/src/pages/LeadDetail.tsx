import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Send, AlertTriangle, MessageSquare, ShieldCheck, Zap } from 'lucide-react'
import { useStore, getEffectiveMode } from '../state/store'
import type { SendGateResult } from '../state/store'
import { draftOutreach } from '../sim/engine'
import { Card, Chip, FitBar, StageChip, SectionLabel, Spinner, fmtDate, cx } from '../components/ui'

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const lead = useStore((s) => s.leads.find((l) => l.id === id))
  const conversations = useStore((s) => s.conversations)
  const settings = useStore((s) => s.settings)

  const [drafting, setDrafting] = useState(false)
  const [step, setStep] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const [result, setResult] = useState<SendGateResult | null>(null)
  const cancelRef = useRef<(() => void) | null>(null)

  useEffect(() => () => cancelRef.current?.(), [])

  if (!lead) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-10 text-center text-[13px] text-ink-2">
        Lead not found. <Link to="/leads" className="text-accent">Back to leads</Link>
      </div>
    )
  }

  const conv = conversations.find((c) => c.id === lead.conversationId)
  const effMode = conv ? getEffectiveMode(conv, settings) : settings.globalMode

  const startDraft = () => {
    if (drafting) return
    setDrafting(true)
    setResult(null)
    setTyped('')
    setStep('Starting…')
    cancelRef.current = draftOutreach(lead.id, {
      onStep: (label) => setStep(label),
      onType: (partial) => setTyped(partial),
      onResult: (r) => {
        setResult(r)
        setDrafting(false)
        setStep(null)
      },
    })
  }

  const breakdown = lead.fitBreakdown

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 rounded-[10px] px-2 py-1 text-[12px] text-ink-2 transition-colors hover:bg-accent/5 hover:text-ink">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      {/* Header */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[20px] font-semibold text-ink">{lead.company}</h2>
            <StageChip stage={lead.stage} />
          </div>
          <div className="mt-1 text-[13px] text-ink-2">{lead.niche} · {lead.staff} staff · {lead.location}</div>
          <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-ink-2">{lead.profile}</p>
        </div>
        <Card className="w-56 shrink-0 px-4 py-3">
          <SectionLabel>Fit score</SectionLabel>
          <div className="mono mt-1 text-[34px] font-medium leading-none tabular text-ink">{lead.fitScore}</div>
          <div className="mt-1 text-[11px] text-ink-3">confidence {lead.confidence.toFixed(2)}</div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: fit + evidence */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="px-4 py-4">
            <SectionLabel>Fit breakdown</SectionLabel>
            <div className="mt-3 space-y-2.5">
              <FitBar label="ICP match" value={breakdown.icpMatch} />
              <FitBar label="Spend signal" value={breakdown.spendSignal} />
              <FitBar label="Timing" value={breakdown.timing} accent />
              <FitBar label="Reachability" value={breakdown.reachability} />
            </div>
            <p className="mt-4 border-t border-line pt-3 text-[13px] leading-relaxed text-ink-2">{lead.fitExplanation}</p>
          </Card>

          <div>
            <SectionLabel>Evidence · {lead.evidence.length} items</SectionLabel>
            <div className="mt-2 space-y-2.5">
              {lead.evidence.map((e) => (
                <Card key={e.id} className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <div className="text-[13px] font-medium text-ink">{e.claim}</div>
                      <p className="mono mt-1.5 line-clamp-2 border-l-2 border-line pl-2.5 text-[12px] italic leading-relaxed text-ink-2" title={e.excerpt}>
                        {e.excerpt}
                      </p>
                    </div>
                    <Chip tone="neutral" className="shrink-0">{e.sourceType}</Chip>
                  </div>
                  <div className="mt-2.5 flex items-center gap-3 text-[11px] text-ink-3">
                    <a
                      href={`https://${e.sourceUrl}`}
                      onClick={(ev) => ev.preventDefault()}
                      className="mono inline-flex items-center gap-1 text-info hover:underline"
                      title="Simulated source, no navigation in demo"
                    >
                      <ExternalLink className="h-3 w-3" /> {e.sourceUrl}
                    </a>
                    <span className="mono">retrieved {fmtDate(e.retrievedAt)}</span>
                    <span className="mono ml-auto">conf {e.confidence.toFixed(2)}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right: angle, risks, action */}
        <div className="space-y-6">
          <Card className="px-4 py-4">
            <SectionLabel>Partnership angle</SectionLabel>
            <p className="mt-2 text-[13px] leading-relaxed text-ink">{lead.partnershipAngle}</p>
          </Card>

          <Card className="px-4 py-4">
            <SectionLabel>Risks</SectionLabel>
            <ul className="mt-2 space-y-1.5">
              {lead.risks.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] text-ink-2">
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn" strokeWidth={1.75} />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Draft outreach action */}
          <Card className="px-4 py-4">
            <div className="flex items-center gap-2">
              <SectionLabel>Outreach</SectionLabel>
              <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-ink-3">
                {effMode === 'auto' ? <Zap className="h-3 w-3 text-accent" /> : <ShieldCheck className="h-3 w-3 text-info" />}
                {effMode === 'auto' ? 'Autonomous' : effMode === 'paused' ? 'Paused' : 'Human approval'}
              </span>
            </div>

            {lead.stage === 'rejected' ? (
              <p className="mt-2 text-[12px] text-ink-3">Rejected. {lead.rejectReason}</p>
            ) : (
              <>
                {(drafting || typed) && (
                  <div className="mt-3 rounded-md border border-dashed border-accent/40 bg-accent/4 px-3 py-2.5">
                    {step && (
                      <div className="mono mb-1.5 flex items-center gap-1.5 text-[11px] text-accent">
                        <Spinner className="h-3 w-3" /> {step}
                      </div>
                    )}
                    <p className="text-[12px] leading-relaxed text-ink">
                      {typed}
                      {drafting && <span className="bd-blink">▍</span>}
                    </p>
                  </div>
                )}

                {result && (
                  <div className="mt-3 rounded-md border border-line bg-paper px-3 py-2.5 text-[12px] text-ink-2">
                    {result === 'sent' && <span className="text-ok">Policy check passed. Auto-sent into the thread.</span>}
                    {result === 'approval' && <span className="text-warn">Routed to Approvals for your review.</span>}
                    {result === 'blocked' && <span className="text-ink-3">Blocked. Thread is owned by You.</span>}
                    {result === 'paused' && <span className="text-ink-3">Held. Thread is paused.</span>}
                    <div className="mt-1.5 flex gap-2">
                      {result === 'approval' && <Link to="/approvals" className="text-accent hover:underline">Open Approvals →</Link>}
                      {lead.conversationId && <Link to={`/inbox/${lead.conversationId}`} className="text-accent hover:underline">Open thread →</Link>}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={startDraft}
                  disabled={drafting}
                  className={cx('btn mt-3 w-full', drafting ? 'btn-disabled' : 'btn-primary')}
                >
                  {drafting ? <Spinner /> : <Send className="h-3.5 w-3.5" strokeWidth={2} />}
                  {drafting ? 'Drafting…' : result ? 'Draft again' : 'Draft outreach'}
                </button>
              </>
            )}

            {lead.conversationId && (
              <Link
                to={`/inbox/${lead.conversationId}`}
                className="btn btn-secondary mt-2 w-full"
              >
                <MessageSquare className="h-3.5 w-3.5" /> View conversation
              </Link>
            )}
          </Card>

          <Card className="px-4 py-4">
            <SectionLabel>Suggested contact</SectionLabel>
            <div className="mt-2 text-[13px] font-medium text-ink">{lead.contact.name}</div>
            <div className="text-[12px] text-ink-2">{lead.contact.role}</div>
            <a
              href={`https://${lead.contact.linkedin}`}
              onClick={(ev) => ev.preventDefault()}
              className="mono mt-1.5 inline-flex items-center gap-1 text-[11px] text-info hover:underline"
              title="Simulated profile, no navigation in demo"
            >
              <ExternalLink className="h-3 w-3" /> {lead.contact.linkedin}
            </a>
          </Card>
        </div>
      </div>
    </div>
  )
}
