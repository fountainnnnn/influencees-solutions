import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'

/**
 * Exposes the active Lenis instance (or null when smooth scroll is disabled,
 * e.g. under prefers-reduced-motion). Components can subscribe to scroll via
 * `lenis.on('scroll', ...)` if they need it; most parallax here reads the
 * native scroll position instead, which stays correct with or without Lenis.
 */
const LenisContext = createContext<Lenis | null>(null)

export function useLenis() {
  return useContext(LenisContext)
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Initialises Lenis smooth scroll with a single shared raf loop, respects
 * reduced-motion (no init), and keeps react-router's scroll-to-top behaviour
 * intact by jumping to the top immediately on every route change.
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    if (prefersReducedMotion()) return

    const instance = new Lenis({ lerp: 0.1 })
    setLenis(instance)

    let frame = 0
    const raf = (time: number) => {
      instance.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  // Route changes must land at the top. ScrollToTop handles the native path;
  // this keeps Lenis's internal position in sync so it never animates back down.
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
  }, [pathname, lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
