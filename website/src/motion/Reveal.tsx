import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

type RevealProps = {
  children: ReactNode
  /** Delay before the transition starts, in ms (use to stagger grids). */
  delay?: number
  className?: string
  /** Element to render as. Defaults to a div. */
  as?: ElementType
  /** Vertical travel distance in px (default 20). */
  y?: number
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Fades + lifts its children into view the first time they cross the viewport.
 * Only transform/opacity animate (no layout shift). Renders visible immediately
 * under prefers-reduced-motion.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
  y = 20,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const style: CSSProperties = {
    opacity: shown ? 1 : 0,
    transform: shown ? 'translateY(0)' : `translateY(${y}px)`,
    transition:
      'opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1)',
    transitionDelay: shown ? `${delay}ms` : '0ms',
    willChange: shown ? 'auto' : 'opacity, transform',
  }

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  )
}
