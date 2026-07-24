import { useEffect, useRef, useState } from 'react'

type Options = {
  /** Animation duration in ms (default 1200). */
  duration?: number
  /** Decimal places to keep while animating (default 0). */
  decimals?: number
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** easeOutCubic */
const ease = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Counts a number from 0 to `target` over ~1.2s the first time the ref element
 * enters the viewport. Jumps straight to the target under reduced-motion.
 * Returns the ref to attach and the current (rounded) value.
 */
export function useCountUp<T extends HTMLElement = HTMLSpanElement>(
  target: number,
  { duration = 1200, decimals = 0 }: Options = {},
) {
  const ref = useRef<T | null>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setValue(target)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return
        started.current = true
        observer.disconnect()

        const start = performance.now()
        const step = (now: number) => {
          const t = Math.min((now - start) / duration, 1)
          setValue(target * ease(t))
          if (t < 1) requestAnimationFrame(step)
          else setValue(target)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  const factor = 10 ** decimals
  const rounded = Math.round(value * factor) / factor

  return { ref, value: rounded }
}
