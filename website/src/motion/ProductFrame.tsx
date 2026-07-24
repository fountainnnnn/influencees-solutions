import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

type ProductFrameProps = {
  children: ReactNode
  /** Mono URL shown in the chrome pill. */
  url?: string
  /** Subtle scroll-linked vertical parallax (max +-12px). Off by default. */
  tilt?: boolean
  className?: string
  /** Padding applied to the content area (Tailwind classes). */
  bodyClassName?: string
}

const MAX_OFFSET = 12

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * A SaaS "screenshot" frame: rounded window with browser chrome (traffic-light
 * dots + a mono URL pill) wrapping recreated product UI. With `tilt`, it drifts
 * a few px as it moves through the viewport. Parallax reads native scroll, so it
 * works with or without Lenis, and is disabled under reduced-motion.
 */
export default function ProductFrame({
  children,
  url = 'app.influencees.com',
  tilt = false,
  className = '',
  bodyClassName = 'p-4',
}: ProductFrameProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (!tilt || prefersReducedMotion()) return

    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      // -1 when the element sits low in the viewport, +1 when high.
      const progress = (rect.top + rect.height / 2 - vh / 2) / (vh / 2)
      const clamped = Math.max(-1, Math.min(1, progress))
      setOffset(-clamped * MAX_OFFSET)
    }
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [tilt])

  const style: CSSProperties | undefined = tilt
    ? { transform: `translate3d(0, ${offset}px, 0)`, willChange: 'transform' }
    : undefined

  return (
    <div
      ref={ref}
      style={style}
      className={`overflow-hidden rounded-xl border border-line bg-surface shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-line bg-paper px-3.5 py-2.5">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-line" />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-center">
          <span className="inline-flex max-w-full items-center truncate rounded-md border border-line bg-surface px-3 py-1 font-mono text-[11px] text-ink-3">
            {url}
          </span>
        </div>
        <div className="hidden w-[42px] shrink-0 sm:block" aria-hidden="true" />
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  )
}
