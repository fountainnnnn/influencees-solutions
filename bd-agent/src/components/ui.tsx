import type { ReactNode } from 'react'
import type { EffectiveMode, Stage } from '../types'

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

// ---- Feature status chip: LIVE / BETA / SOON ----
export function FeatureChip({ status }: { status: 'LIVE' | 'BETA' | 'SOON' }) {
  const map = {
    LIVE: 'text-ok border-ok/30 bg-ok/8',
    BETA: 'text-warn border-warn/30 bg-warn/8',
    SOON: 'text-info border-info/30 bg-info/8',
  } as const
  return (
    <span className={cx('mono inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium tracking-wide', map[status])}>
      {status}
    </span>
  )
}

// ---- Generic small chip ----
export function Chip({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: 'neutral' | 'accent' | 'ok' | 'warn' | 'info'
  className?: string
}) {
  const map = {
    neutral: 'text-ink-2 border-line bg-surface',
    accent: 'text-accent border-accent/30 bg-accent/8',
    ok: 'text-ok border-ok/30 bg-ok/8',
    warn: 'text-warn border-warn/30 bg-warn/8',
    info: 'text-info border-info/30 bg-info/8',
  } as const
  return (
    <span className={cx('inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium', map[tone], className)}>
      {children}
    </span>
  )
}

const stageMeta: Record<Stage, { label: string; tone: 'neutral' | 'accent' | 'ok' | 'warn' | 'info' }> = {
  discovered: { label: 'Discovered', tone: 'neutral' },
  researching: { label: 'Researching', tone: 'info' },
  scored: { label: 'Scored', tone: 'neutral' },
  queued: { label: 'Queued', tone: 'warn' },
  contacted: { label: 'Contacted', tone: 'info' },
  replied: { label: 'Replied', tone: 'ok' },
  negotiating: { label: 'Negotiating', tone: 'warn' },
  meeting: { label: 'Meeting', tone: 'accent' },
  rejected: { label: 'Rejected', tone: 'neutral' },
}

export function StageChip({ stage }: { stage: Stage }) {
  const m = stageMeta[stage]
  return <Chip tone={m.tone}>{m.label}</Chip>
}

export function ModeChip({ mode, size = 'sm' }: { mode: EffectiveMode; size?: 'sm' | 'xs' }) {
  const map = {
    human: { label: 'Human approval', tone: 'info' as const },
    auto: { label: 'Autonomous', tone: 'accent' as const },
    paused: { label: 'Paused', tone: 'neutral' as const },
  }
  const m = map[mode]
  return (
    <Chip tone={m.tone} className={size === 'xs' ? 'px-1 text-[10px]' : undefined}>
      {m.label}
    </Chip>
  )
}

// ---- Fit / score bar ----
export function FitBar({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 shrink-0 text-[12px] text-ink-2">{label}</div>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
        <div
          className={cx('h-full rounded-full transition-all duration-500', accent ? 'bg-accent' : 'bg-ink')}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
      <div className="mono w-8 shrink-0 text-right text-[12px] tabular text-ink">{value}</div>
    </div>
  )
}

// ---- Inline mini score bar for tables ----
export function MiniScore({ value }: { value: number }) {
  const tone = value >= 80 ? 'bg-ok' : value >= 65 ? 'bg-warn' : 'bg-ink-3'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line">
        <div className={cx('h-full rounded-full', tone)} style={{ width: `${value}%` }} />
      </div>
      <span className="mono w-6 text-right text-[12px] tabular text-ink">{value}</span>
    </div>
  )
}

export function Confidence({ value }: { value: number }) {
  return <span className="mono text-[12px] tabular text-ink-2">{value.toFixed(2)}</span>
}

// ---- Card ----
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx('rounded-[14px] border border-line bg-surface', className)}>{children}</div>
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cx('bd-spin inline-block rounded-full border-2 border-line border-t-accent', className ?? 'h-3.5 w-3.5')}
      aria-hidden
    />
  )
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line px-6 py-12 text-center">
      <div className="text-[13px] font-medium text-ink-2">{title}</div>
      {hint && <div className="text-[12px] text-ink-3">{hint}</div>}
    </div>
  )
}

// ---- Section heading ----
export function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="mono text-[11px] uppercase tracking-wider text-ink-3">{children}</div>
}

export function relTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date('2026-07-24T18:00:00+08:00').getTime()
  const diff = now - d.getTime()
  const mins = Math.round(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.round(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.round(hrs / 24)
  return `${days}d ago`
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-SG', { day: '2-digit', month: 'short' })
}

export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', hour12: false })
}
