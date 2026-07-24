import type { ReactNode } from 'react'

type StatProps = {
  /** The metric value — rendered in mono, tabular figures. */
  value: ReactNode
  label: ReactNode
  className?: string
}

/** A mono number paired with a small caption label. */
export default function Stat({ value, label, className = '' }: StatProps) {
  return (
    <div className={className}>
      <div className="tabular font-mono text-3xl font-medium tracking-tight text-ink">
        {value}
      </div>
      <div className="mt-1 text-sm text-ink-2">{label}</div>
    </div>
  )
}
