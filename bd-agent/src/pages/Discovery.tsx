import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Radar, Play, ChevronRight } from 'lucide-react'
import { useStore } from '../state/store'
import { runDiscovery } from '../sim/engine'
import { Card, Chip, MiniScore, Confidence, StageChip, SectionLabel, Spinner, cx } from '../components/ui'

const criteria = [
  { k: 'Market', v: 'Singapore only' },
  { k: 'Company size', v: '10 to 200 staff' },
  { k: 'Niches', v: 'F&B · Beauty · Fitness · Fintech · Retail · Travel' },
  { k: 'Signal', v: 'Active campaign, launch, pop-up or hiring' },
  { k: 'Channel', v: 'Instagram + TikTok presence' },
  { k: 'Exclude', v: 'B2B-only · agencies · no SG presence' },
]

export default function Discovery() {
  const leads = useStore((s) => s.leads)
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const cancelRef = useRef<(() => void) | null>(null)
  const logEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => () => cancelRef.current?.(), [])
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [log])

  const start = () => {
    if (running) return
    setLog([])
    setRunning(true)
    cancelRef.current = runDiscovery({
      onLog: (line) => setLog((l) => [...l, line]),
      onDone: () => setRunning(false),
    })
  }

  // most-recently discovered first
  const rows = [...leads].sort((a, b) => (a.discoveredAt < b.discoveredAt ? 1 : -1))

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Targeting criteria */}
        <Card className="lg:col-span-1">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <div className="text-[13px] font-medium text-ink">Targeting criteria</div>
            <Chip tone="neutral" className="ml-auto">Editable</Chip>
          </div>
          <dl className="divide-y divide-line">
            {criteria.map((c) => (
              <div key={c.k} className="px-4 py-2.5">
                <dt className="text-[11px] text-ink-3">{c.k}</dt>
                <dd className="mt-0.5 text-[13px] text-ink">{c.v}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* Run + streaming log */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3">
            <Radar className={cx('h-4 w-4 text-ink-2', running && 'text-accent')} strokeWidth={1.75} />
            <div className="text-[13px] font-medium text-ink">Discovery run</div>
            <button
              type="button"
              onClick={start}
              disabled={running}
              className={cx('btn btn-xs ml-auto', running ? 'btn-disabled' : 'btn-primary')}
            >
              {running ? <Spinner /> : <Play className="h-3.5 w-3.5" strokeWidth={2} />}
              {running ? 'Searching…' : 'Run discovery'}
            </button>
          </div>
          <div className="h-56 overflow-auto px-4 py-3">
            {log.length === 0 && !running ? (
              <div className="flex h-full items-center justify-center px-6 text-center text-[12px] text-ink-3">
                Run discovery to find SG companies that match the criteria. New leads stream in and score live.
              </div>
            ) : (
              <ul className="space-y-1.5">
                {log.map((line, i) => (
                  <li key={i} className="bd-fade-in mono flex items-start gap-2 text-[12px] text-ink-2">
                    <span className="text-ink-3">›</span>
                    <span>{line}</span>
                  </li>
                ))}
                {running && (
                  <li className="mono flex items-center gap-2 text-[12px] text-ink-3">
                    <Spinner /> working…
                  </li>
                )}
                <div ref={logEndRef} />
              </ul>
            )}
          </div>
        </Card>
      </div>

      {/* Results table */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <SectionLabel>Pipeline · {rows.length} leads</SectionLabel>
        </div>
        <Card className="overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line text-[11px] uppercase tracking-wide text-ink-3">
                <th className="px-4 py-2.5 font-medium">Company</th>
                <th className="px-3 py-2.5 font-medium">Niche</th>
                <th className="px-3 py-2.5 font-medium">Fit</th>
                <th className="px-3 py-2.5 font-medium">Conf.</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium">Suggested contact</th>
                <th className="px-4 py-2.5 font-medium">Reason</th>
                <th className="px-3 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((l) => (
                <tr key={l.id} className="group bd-fade-in align-top transition-colors hover:bg-paper">
                  <td className="px-4 py-3">
                    <Link to={`/leads/${l.id}`} className="text-[13px] font-medium text-ink hover:text-accent">
                      {l.company}
                    </Link>
                    <div className="text-[11px] text-ink-3">{l.location}</div>
                  </td>
                  <td className="px-3 py-3 text-[12px] text-ink-2">{l.niche}</td>
                  <td className="px-3 py-3">
                    {l.stage === 'researching' ? (
                      <span className="mono inline-flex items-center gap-1.5 text-[12px] text-ink-3"><Spinner /> scoring…</span>
                    ) : l.stage === 'discovered' ? (
                      <span className="mono text-[12px] text-ink-3">not scored</span>
                    ) : (
                      <MiniScore value={l.fitScore} />
                    )}
                  </td>
                  <td className="px-3 py-3"><Confidence value={l.confidence} /></td>
                  <td className="px-3 py-3"><StageChip stage={l.stage} /></td>
                  <td className="px-3 py-3">
                    <div className="text-[12px] text-ink">{l.contact.name}</div>
                    <div className="text-[11px] text-ink-3">{l.contact.role}</div>
                  </td>
                  <td className="max-w-[220px] px-4 py-3">
                    <span className={cx('text-[12px]', l.rejectReason ? 'text-ink-3' : 'text-ink-2')}>
                      {l.rejectReason ?? l.qualifyReason ?? 'Pending review'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Link to={`/leads/${l.id}`} className="inline-flex text-ink-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  )
}
