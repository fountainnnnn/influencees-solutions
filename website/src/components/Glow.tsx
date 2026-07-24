import type { CSSProperties, ReactNode } from 'react'

/* ------------------------------------------------------------------ *
 * Shared "Core Features" grammar primitives.
 *
 * SectionHeader: centered gradient eyebrow + Sora title (ends with a
 * period) + one-line subtitle.
 *
 * GlowCard: rounded-[20px] card on the #F7F6FB base with a radial top
 * glow, soft shadow, optional mesh overlay, and an h3 label pinned to
 * the bottom-left. Real props (screenshots, avatars, mini-panels) are
 * passed as children and positioned by the caller.
 * ------------------------------------------------------------------ */

/** Brand-hue top glows. Rotate between adjacent cards so they differ. */
export const GLOWS = [
  'radial-gradient(circle at 50% 0%, #DD87FF 0%, #BFA8FF 30%, #F7F6FB 60%, #F7F6FB 100%)',
  'radial-gradient(circle at 50% 0%, #FF6FAE 0%, #F8ACA0 30%, #F7F6FB 60%, #F7F6FB 100%)',
  'radial-gradient(circle at 50% 0%, #BFA8FF 0%, #DD87FF 30%, #F7F6FB 60%, #F7F6FB 100%)',
]

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  className = '',
}: {
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
  className?: string
}) {
  return (
    <div className={`mx-auto max-w-2xl text-center ${className}`}>
      <p className="text-gradient-brand text-xs font-semibold uppercase tracking-[0.08em]">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-4xl font-medium tracking-tight text-ink">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-2">
          {subtitle}
        </p>
      )}
    </div>
  )
}

/** Faint mesh grid, masked to fade toward the bottom. */
export function MeshOverlay() {
  return (
    <div
      className="absolute inset-0"
      aria-hidden="true"
      style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
        backgroundSize: '16px 16px',
        WebkitMaskImage:
          'radial-gradient(circle at center top, black 0%, transparent 80%)',
        maskImage:
          'radial-gradient(circle at center top, black 0%, transparent 80%)',
      }}
    />
  )
}

export function GlowCard({
  glow = 0,
  label,
  chip,
  mesh = false,
  minHeight = 340,
  children,
  className = '',
}: {
  /** Index into GLOWS; rotate between adjacent cards. */
  glow?: number
  label?: ReactNode
  chip?: ReactNode
  mesh?: boolean
  minHeight?: number
  children?: ReactNode
  className?: string
}) {
  const style: CSSProperties = { minHeight, backgroundColor: '#F7F6FB' }
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-[20px] shadow-[0_10px_30px_-10px_rgba(27,16,82,0.12)] ${className}`}
      style={style}
    >
      <div
        className="absolute inset-0"
        style={{ background: GLOWS[glow % GLOWS.length] }}
        aria-hidden="true"
      />
      {mesh && <MeshOverlay />}
      {children}
      {label && (
        <h3 className="relative z-[2] mt-auto flex items-center gap-2 p-6 text-[1.05rem] font-semibold text-ink">
          {label}
          {chip}
        </h3>
      )}
    </article>
  )
}
