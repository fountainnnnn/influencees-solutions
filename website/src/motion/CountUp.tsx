import { useCountUp } from './useCountUp'

type CountUpProps = {
  /** Final numeric value to count up to. */
  value: number
  /** Format the current number into display text (e.g. compact, thousands). */
  format?: (n: number) => string
  prefix?: string
  suffix?: string
  /** Decimal places (default 0). */
  decimals?: number
  duration?: number
  className?: string
}

/** Compact number format: 128000 -> "128K", 1_200_000 -> "1.2M". */
export function compact(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)}M`
  }
  if (n >= 1_000) {
    const v = n / 1_000
    return `${v >= 100 ? Math.round(v) : v.toFixed(1)}K`
  }
  return String(Math.round(n))
}

/** Thousands-separated integer: 82400 -> "82,400". */
export function thousands(n: number): string {
  return Math.round(n).toLocaleString('en-US')
}

/**
 * Animated number that counts up when scrolled into view. Renders in mono with
 * tabular figures so its width never jumps between frames.
 */
export default function CountUp({
  value,
  format,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration,
  className = '',
}: CountUpProps) {
  const { ref, value: current } = useCountUp<HTMLSpanElement>(value, {
    decimals,
    duration,
  })

  const text = format
    ? format(current)
    : current.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })

  return (
    <span ref={ref} className={`tabular font-mono ${className}`}>
      {prefix}
      {text}
      {suffix}
    </span>
  )
}
