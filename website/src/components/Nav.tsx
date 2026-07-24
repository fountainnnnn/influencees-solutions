import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Button from './Button'
import StatusChip from './StatusChip'

type NavItem = { label: string; to: string; beta?: boolean }

const NAV_ITEMS: NavItem[] = [
  { label: 'For Brands', to: '/brands' },
  { label: 'For Creators', to: '/creators' },
  { label: 'Directory', to: '/directory' },
  { label: 'Trust Check', to: '/trust-check', beta: true },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
]

/** Real horizontal logo, linked home. */
function Logo() {
  return (
    <Link
      to="/"
      className="inline-flex items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label="Influencees home"
    >
      <img
        src="/brand/logo-horizontal-color.svg"
        alt="Influencees"
        className="h-6 w-auto"
      />
    </Link>
  )
}

function linkClass({ isActive }: { isActive: boolean }) {
  return `text-sm transition-colors ${
    isActive ? 'text-ink' : 'text-ink-2 hover:text-ink'
  }`
}

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const { pathname } = useLocation()

  // Detach into a floating glass island once the page is scrolled a little.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile panel whenever the route changes.
  useEffect(() => setOpen(false), [pathname])

  // Close on Escape + focus trap while the mobile panel is open.
  useEffect(() => {
    if (!open) return

    const panel = panelRef.current
    const focusable = panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    )
    focusable?.[0]?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
        return
      }
      if (e.key !== 'Tab' || !focusable || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-50 px-3 pt-3">
      <nav
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 transition-all duration-300 sm:px-5 ${
          scrolled || open
            ? 'border border-line bg-white/70 shadow-[0_8px_30px_rgba(27,16,82,0.08)] backdrop-blur-xl'
            : 'border border-transparent bg-transparent'
        }`}
      >
        <div className="flex items-center gap-8">
          <Logo />
          <ul className="hidden items-center gap-6 lg:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className={linkClass}>
                  <span className="inline-flex items-center gap-1.5">
                    {item.label}
                    {item.beta && <StatusChip status="BETA" />}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href="https://www.influencees.com/signin" variant="ghost" size="sm">
            Sign in
          </Button>
          <Button to="/join" variant="primary" size="sm">
            Get started
          </Button>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-ink hover:bg-line/50 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="mx-auto mt-2 max-w-6xl rounded-2xl border border-line bg-white/90 backdrop-blur-xl lg:hidden"
        >
          <div className="flex flex-col gap-1 p-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-md px-2 py-2.5 text-ink hover:bg-line/50"
              >
                {item.label}
                {item.beta && <StatusChip status="BETA" />}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-line pt-4">
              <Button href="https://www.influencees.com/signin" variant="secondary" size="md">
                Sign in
              </Button>
              <Button to="/join" variant="primary" size="md">
                Get started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
