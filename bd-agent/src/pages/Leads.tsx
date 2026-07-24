import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { useStore } from '../state/store'
import { Card, MiniScore, Confidence, StageChip, cx } from '../components/ui'
import type { Niche } from '../types'

const niches: (Niche | 'All')[] = ['All', 'F&B', 'Beauty', 'Fitness', 'Fintech', 'Retail', 'Travel']

export default function Leads() {
  const leads = useStore((s) => s.leads)
  const [filter, setFilter] = useState<Niche | 'All'>('All')

  const rows = useMemo(() => {
    const list = filter === 'All' ? leads : leads.filter((l) => l.niche === filter)
    return [...list].sort((a, b) => b.fitScore - a.fitScore)
  }, [leads, filter])

  return (
    <div className="mx-auto max-w-6xl px-6 py-6">
      <div className="mb-4 flex items-center gap-1.5">
        {niches.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setFilter(n)}
            className={cx(
              'rounded-md border px-2.5 py-1 text-[12px] transition-colors duration-150',
              filter === n ? 'border-accent/30 bg-accent/8 text-accent' : 'border-line text-ink-2 hover:text-ink',
            )}
          >
            {n}
          </button>
        ))}
        <span className="mono ml-auto text-[11px] text-ink-3">{rows.length} leads</span>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-line text-[11px] uppercase tracking-wide text-ink-3">
              <th className="px-4 py-2.5 font-medium">Company</th>
              <th className="px-3 py-2.5 font-medium">Niche</th>
              <th className="px-3 py-2.5 font-medium">Staff</th>
              <th className="px-3 py-2.5 font-medium">Fit</th>
              <th className="px-3 py-2.5 font-medium">Conf.</th>
              <th className="px-3 py-2.5 font-medium">Stage</th>
              <th className="px-4 py-2.5 font-medium">Partnership angle</th>
              <th className="px-3 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((l) => (
              <tr key={l.id} className="group align-top transition-colors hover:bg-paper">
                <td className="px-4 py-3">
                  <Link to={`/leads/${l.id}`} className="text-[13px] font-medium text-ink hover:text-accent">
                    {l.company}
                  </Link>
                  <div className="text-[11px] text-ink-3">{l.contact.name} · {l.contact.role}</div>
                </td>
                <td className="px-3 py-3 text-[12px] text-ink-2">{l.niche}</td>
                <td className="px-3 py-3 mono text-[12px] tabular text-ink-2">{l.staff}</td>
                <td className="px-3 py-3"><MiniScore value={l.fitScore} /></td>
                <td className="px-3 py-3"><Confidence value={l.confidence} /></td>
                <td className="px-3 py-3"><StageChip stage={l.stage} /></td>
                <td className="max-w-[260px] px-4 py-3 text-[12px] text-ink-2">{l.partnershipAngle}</td>
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
  )
}
