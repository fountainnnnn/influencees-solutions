import { NavLink, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import {
  LayoutDashboard,
  Radar,
  Users,
  Inbox as InboxIcon,
  CheckSquare,
  Brain,
  Settings as SettingsIcon,
} from 'lucide-react'
import { useStore } from '../state/store'
import { useRuntime } from '../state/runtime'
import { cx } from './ui'
import AmbientBackground from './AmbientBackground'

const nav = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/discovery', label: 'Discovery', icon: Radar },
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/inbox', label: 'Inbox', icon: InboxIcon },
  { to: '/approvals', label: 'Approvals', icon: CheckSquare },
  { to: '/brain', label: 'Business Brain', icon: Brain },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

function AutonomySwitch() {
  const mode = useStore((s) => s.settings.globalMode)
  const setGlobalMode = useStore((s) => s.setGlobalMode)
  return (
    <div
      className="relative inline-grid grid-cols-2 rounded-full border border-line bg-white/60 p-0.5 backdrop-blur-md"
      role="group"
      aria-label="Global autonomy"
    >
      {/* sliding solid thumb */}
      <span
        aria-hidden
        className={cx(
          'pointer-events-none absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full transition-transform duration-200 ease-out',
          mode === 'auto'
            ? 'translate-x-full bg-accent shadow-[0_1px_2px_rgba(27,16,82,.18),0_4px_12px_rgba(122,92,255,.28)]'
            : 'translate-x-0 bg-info shadow-[0_1px_2px_rgba(16,32,82,.18),0_4px_12px_rgba(37,99,235,.24)]',
        )}
      />
      <button
        type="button"
        onClick={() => setGlobalMode('human')}
        className={cx(
          'relative z-10 rounded-full px-3 py-1 text-[12px] font-medium transition-colors duration-200',
          mode === 'human' ? 'text-white' : 'text-ink-2 hover:text-ink',
        )}
      >
        Human approval
      </button>
      <button
        type="button"
        onClick={() => setGlobalMode('auto')}
        className={cx(
          'relative z-10 rounded-full px-3 py-1 text-[12px] font-medium transition-colors duration-200',
          mode === 'auto' ? 'text-white' : 'text-ink-2 hover:text-ink',
        )}
      >
        Autonomous
      </button>
    </div>
  )
}

function AgentStatus() {
  const status = useRuntime((s) => s.status)
  const working = status === 'working'
  return (
    <div className="inline-flex items-center gap-1.5 text-[12px] text-ink-2">
      <span
        className={cx(
          'inline-block h-2 w-2 rounded-full',
          working ? 'bd-blink bg-accent' : 'bg-ok',
        )}
      />
      <span className="mono">{working ? 'working' : 'idle'}</span>
    </div>
  )
}

function pageTitle(path: string): string {
  if (path === '/') return 'Overview'
  if (path.startsWith('/discovery')) return 'Discovery'
  if (path.startsWith('/leads')) return 'Leads'
  if (path.startsWith('/inbox')) return 'Inbox'
  if (path.startsWith('/approvals')) return 'Approvals'
  if (path.startsWith('/brain')) return 'Business Brain'
  if (path.startsWith('/settings')) return 'Settings'
  return ''
}

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const pendingApprovals = useStore((s) => s.approvals.filter((a) => a.status === 'pending').length)

  return (
    <div className="flex h-full">
      <AmbientBackground />
      {/* Sidebar */}
      <aside className="flex w-56 shrink-0 flex-col border-r border-line bg-white/65 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-4">
          <div className="leading-tight">
            <img src="/brand/logo-horizontal-color.svg" alt="Influencees" className="h-5 w-auto" />
            <div className="gradient-text mono mt-1 text-[10px] font-semibold uppercase tracking-wider">BD Agent</div>
          </div>
        </div>
        <nav className="flex flex-col gap-0.5 px-2 py-2">
          {nav.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cx(
                    'group flex items-center gap-2.5 rounded-[10px] px-2.5 py-1.5 text-[13px] transition-colors duration-150',
                    isActive ? 'bg-accent/10 font-medium text-accent' : 'text-ink-2 hover:bg-accent/5 hover:text-ink',
                  )
                }
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                <span className="flex-1">{item.label}</span>
                {item.to === '/approvals' && pendingApprovals > 0 && (
                  <span className="mono grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-medium text-white">
                    {pendingApprovals}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>
        <div className="mt-auto border-t border-line px-4 py-4 text-[11px] text-ink-3">
          <div className="mono">SG · Simulation POC</div>
          <div>Internal tool. Not customer-facing.</div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-line bg-white/70 px-6 py-2.5 backdrop-blur-xl">
          <h1 className="font-display text-[16px] font-semibold tracking-tight text-ink">{pageTitle(location.pathname)}</h1>
          <div className="ml-auto flex items-center gap-4">
            <AutonomySwitch />
            <AgentStatus />
          </div>
        </header>

        {/* Page */}
        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
