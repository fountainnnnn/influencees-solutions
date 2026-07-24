import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import type { CSSProperties } from 'react'
import { GlowCard } from '../components/Glow'
import './intro.css'

/* ------------------------------------------------------------------ *
 * Onboarding intro overlay.
 *
 * Scroll-driven, mobile-onboarding style: 5 full-screen scenes the
 * user snaps through with wheel / trackpad / swipe / arrow keys /
 * progress dots / Next. onDone() is the only exit (parent unmounts).
 * ------------------------------------------------------------------ */

type IntroProps = { onDone: () => void }

const SCENE_COUNT = 5

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** Mono count-up that runs when `active` flips true. Respects reduced motion. */
function CountUp({
  end,
  active,
  reduced,
  duration = 1100,
  delay = 200,
  format = (n: number) => Math.round(n).toLocaleString('en-US'),
  className = '',
}: {
  end: number
  active: boolean
  reduced: boolean
  duration?: number
  delay?: number
  format?: (n: number) => string
  className?: string
}) {
  const [val, setVal] = useState(0)
  const raf = useRef<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!active) {
      setVal(0)
      return
    }
    if (reduced) {
      setVal(end)
      return
    }
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        setVal(end * eased)
        if (t < 1) raf.current = requestAnimationFrame(tick)
      }
      raf.current = requestAnimationFrame(tick)
    }
    timer.current = setTimeout(run, delay)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      if (timer.current) clearTimeout(timer.current)
    }
  }, [active, reduced, end, duration, delay])

  return <span className={className}>{format(val)}</span>
}

/* Tiny inline status chip (self-contained, mirrors the site StatusChip). */
function Chip({
  status,
}: {
  status: 'LIVE' | 'BETA' | 'SOON'
}) {
  const styles: Record<string, string> = {
    LIVE: 'text-ok border-ok/30 bg-ok/10',
    BETA: 'text-warn border-warn/30 bg-warn/10',
    SOON: 'text-info border-info/30 bg-info/10',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase leading-none tracking-wider ${styles[status]}`}
    >
      <span aria-hidden className="inline-block h-1 w-1 rounded-full bg-current" />
      {status}
    </span>
  )
}

const d = (ms: number): CSSProperties => ({ ['--d' as string]: `${ms}ms` })

/* ================================================================== *
 * Scene 1 — The problem
 * ================================================================== */

function SceneProblem() {
  return (
    <div className="intro-inner grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <p
          className="reveal text-gradient-brand mb-5 text-xs font-semibold uppercase tracking-[0.08em]"
          style={d(60)}
        >
          The problem
        </p>
        <h2
          className="reveal font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          style={d(140)}
        >
          Follower counts lie.
        </h2>
        <p
          className="reveal mt-6 max-w-md text-lg leading-relaxed text-ink-2"
          style={d(240)}
        >
          Screenshots, self-reported stats, bought engagement. Brands cannot
          tell what is real.
        </p>
      </div>

      <div className="reveal" style={d(320)}>
        <GlowCard glow={1} minHeight={320} label="Corrected from the source">
          <div className="absolute inset-x-6 top-7 z-[2]">
            <div className="rounded-xl bg-white p-5 shadow-[0_6px_20px_-8px_rgba(27,16,82,0.2)]">
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <img
                  src="/avatars/bella.jpg"
                  alt=""
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                />
                <div>
                  <div className="text-sm font-medium text-ink">bella</div>
                  <div className="font-mono text-xs text-ink-3">@bella</div>
                </div>
              </div>
              <div className="pt-5">
                <div className="font-mono text-xs uppercase tracking-wider text-ink-3">
                  Followers
                </div>
                <div className="relative mt-1 h-14">
                  <div className="fake-wrap glitch-num absolute inset-0 flex items-center">
                    <span className="glitch-fake font-mono text-4xl font-semibold tracking-tight text-ink-3">
                      220K
                    </span>
                    <span className="strike" aria-hidden />
                  </div>
                  <div className="real-wrap absolute inset-0 flex items-baseline gap-2">
                    <span className="font-mono text-4xl font-semibold tracking-tight text-accent">
                      130K
                    </span>
                    <span className="font-mono text-xs text-ok">tracked</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  )
}

/* ================================================================== *
 * Scene 2 — Tracked from the source
 * ================================================================== */

function SceneSource({
  active,
  reduced,
}: {
  active: boolean
  reduced: boolean
}) {
  return (
    <div className="intro-inner grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <p
          className="reveal text-gradient-brand mb-5 text-xs font-semibold uppercase tracking-[0.08em]"
          style={d(60)}
        >
          Tracked from the source
        </p>
        <h2
          className="reveal font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          style={d(140)}
        >
          Numbers with receipts.
        </h2>
        <p
          className="reveal mt-6 max-w-md text-lg leading-relaxed text-ink-2"
          style={d(240)}
        >
          Every creator on Influencees is Singapore-based, with engagement
          tracked independently from the source.
        </p>
      </div>

      <div className="reveal" style={d(300)}>
        <GlowCard glow={2} minHeight={320} label="Synced from public profile">
          <div className="absolute inset-x-6 top-7 z-[2]">
            <div className="rounded-xl bg-white p-5 shadow-[0_6px_20px_-8px_rgba(27,16,82,0.2)]">
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <img
                  src="/avatars/janae-chua.jpg"
                  alt=""
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                />
                <div>
                  <div className="text-sm font-medium text-ink">Janae Chua</div>
                  <div className="font-mono text-xs text-ink-3">@janaechua</div>
                </div>
                <span className="ml-auto rounded border border-line px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-ink-3">
                  IG + TikTok
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 py-5">
                <div className="reveal" style={d(420)}>
                  <CountUp
                    end={48000}
                    active={active}
                    reduced={reduced}
                    delay={480}
                    format={(n) => `${(n / 1000).toFixed(0)}K`}
                    className="tabular font-mono text-2xl font-semibold text-ink"
                  />
                  <div className="mt-1 font-mono text-[11px] text-ink-3">
                    Followers
                  </div>
                </div>
                <div className="reveal" style={d(560)}>
                  <CountUp
                    end={6.2}
                    active={active}
                    reduced={reduced}
                    delay={600}
                    format={(n) => `${n.toFixed(1)}%`}
                    className="tabular font-mono text-2xl font-semibold text-ink"
                  />
                  <div className="mt-1 font-mono text-[11px] text-ink-3">
                    Engagement
                  </div>
                </div>
                <div className="reveal" style={d(700)}>
                  <CountUp
                    end={14000}
                    active={active}
                    reduced={reduced}
                    delay={720}
                    format={(n) => `${(n / 1000).toFixed(0)}K`}
                    className="tabular font-mono text-2xl font-semibold text-ink"
                  />
                  <div className="mt-1 font-mono text-[11px] text-ink-3">
                    Avg views
                  </div>
                </div>
              </div>
              <div className="border-t border-line pt-3 font-mono text-[11px] text-ink-3">
                Refreshed 12 Jul
              </div>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  )
}

/* ================================================================== *
 * Scene 3 — Trust Check
 * ================================================================== */

function SceneTrustCheck({ active }: { active: boolean }) {
  const signals = [
    { label: 'Scam signals', value: 'Pass', tone: 'ok', delay: 1300 },
    { label: 'AI content', value: 'Flagged 86%', tone: 'warn', delay: 1520 },
    { label: 'Bot signals', value: '1.9% suspicious', tone: 'ok', delay: 1740 },
  ]
  return (
    <div className="intro-inner grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
      <div>
        <div
          className="reveal text-gradient-brand mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em]"
          style={d(60)}
        >
          Trust Check
          <Chip status="BETA" />
        </div>
        <h2
          className="reveal font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          style={d(140)}
        >
          Every post, checked.
        </h2>
        <p
          className="reveal mt-6 max-w-md text-lg leading-relaxed text-ink-2"
          style={d(240)}
        >
          Scam patterns, AI content, bot signals. Checked before you commit
          budget.
        </p>
      </div>

      <div className="reveal" style={d(300)}>
        <GlowCard glow={1} minHeight={340} label="Reviewed, low risk">
          <div className="absolute inset-x-6 top-6 z-[2]">
            <div className="overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_10px_30px_-10px_rgba(27,16,82,0.3)]">
              <div className="relative h-28 overflow-hidden border-b border-line">
                {active && <span className="scan-line" aria-hidden />}
                <img
                  src="/shots/check.png"
                  alt=""
                  className="w-full object-cover object-top"
                />
              </div>
              <div className="divide-y divide-line">
                {signals.map((s) => (
                  <div
                    key={s.label}
                    className="reveal flex items-center justify-between px-4 py-2.5"
                    style={d(s.delay)}
                  >
                    <span className="text-sm text-ink-2">{s.label}</span>
                    <span
                      className={`tabular font-mono text-xs font-medium ${
                        s.tone === 'warn' ? 'text-warn' : 'text-ok'
                      }`}
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  )
}

/* ================================================================== *
 * Scene 4 — Run the campaign
 * ================================================================== */

function SceneCampaign({
  active,
  reduced,
}: {
  active: boolean
  reduced: boolean
}) {
  const stages = ['Shortlist', 'Brief', 'Live', 'Report']
  // translate offsets tuned to the 4-column grid (~25% steps).
  const moverStyle = {
    ['--s1' as string]: '100%',
    ['--s2' as string]: '200%',
    ['--s3' as string]: '300%',
  } as CSSProperties
  return (
    <div className="intro-inner">
      <div className="mx-auto max-w-2xl text-center">
        <p
          className="reveal text-gradient-brand mb-5 text-xs font-semibold uppercase tracking-[0.08em]"
          style={d(60)}
        >
          Run the campaign
        </p>
        <h2
          className="reveal font-display text-4xl font-medium leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          style={d(140)}
        >
          Brief to report, one workspace.
        </h2>
        <p
          className="reveal mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-2"
          style={d(240)}
        >
          Compare, budget, brief and report without spreadsheets. Ai-kyo drafts
          alongside you.
        </p>
      </div>

      <div className="reveal mx-auto mt-10 max-w-3xl" style={d(340)}>
        <GlowCard glow={0} minHeight={0}>
          <div className="relative z-[2] p-6">
            <div className="rounded-xl bg-white p-5 shadow-[0_6px_20px_-8px_rgba(27,16,82,0.18)]">
              <div className="relative grid grid-cols-4 gap-3">
                {stages.map((s, i) => (
                  <div key={s}>
                    <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-ink-3">
                      {s}
                    </div>
                    <div className="h-12 rounded-md border border-dashed border-line bg-paper/60" />
                    {i === 3 && (
                      <div className="mt-2 flex items-center justify-between font-mono text-[11px] text-ink-2">
                        <span>Reach</span>
                        <CountUp
                          end={128000}
                          active={active}
                          reduced={reduced}
                          delay={3600}
                          className="tabular text-ink"
                        />
                      </div>
                    )}
                  </div>
                ))}

                {/* the creator card that travels across the four stages */}
                <div
                  className="mover absolute left-0 top-[26px] w-[calc(25%-9px)]"
                  style={moverStyle}
                >
                  <div className="flex items-center gap-2 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-2 shadow-sm">
                    <img
                      src="/avatars/janae-chua.jpg"
                      alt=""
                      className="h-6 w-6 rounded-full object-cover ring-2 ring-white"
                    />
                    <div>
                      <div className="font-mono text-[11px] font-medium text-accent">
                        @janaechua
                      </div>
                      <div className="font-mono text-[9px] text-ink-3">6.2% ER</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-3 font-mono text-[11px] text-ink-2">
                <span>Budget used</span>
                <span className="tabular text-ink">$4,200 / $6,000</span>
              </div>
            </div>

            {/* black-outline pill + cursor arrow prop */}
            <div className="relative mt-5 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink bg-white px-3.5 py-1 text-xs font-semibold text-ink">
                <span className="text-base text-accent">✦</span>
                Ask Ai-kyo to draft the brief
              </span>
              <svg
                viewBox="0 0 24 24"
                className="absolute left-[62%] top-6 h-6 w-6 drop-shadow"
                aria-hidden="true"
              >
                <path
                  d="M4 2L20 11L11 13L9 22L4 2Z"
                  fill="#0D0C0A"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </GlowCard>
      </div>
    </div>
  )
}

/* ================================================================== *
 * Scene 5 — Finale (deep purple)
 * ================================================================== */

function SceneFinale({
  active,
  reduced,
}: {
  active: boolean
  reduced: boolean
}) {
  return (
    <div className="intro-inner text-center">
      <p
        className="reveal mb-6 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-paper/70"
        style={d(40)}
      >
        Introducing
      </p>
      <img
        src="/brand/logo-horizontal-white.svg"
        alt="Influencees"
        className="intro-logo-pop mx-auto h-12 w-auto sm:h-14 lg:h-16"
      />
      <p
        className="reveal mx-auto mt-8 max-w-xl text-lg leading-relaxed text-paper/70"
        style={d(320)}
      >
        Where Singapore's creators get found, by brands that actually do their
        homework.
      </p>

      <div
        className="reveal mx-auto mt-10 grid max-w-lg grid-cols-2 gap-x-10 sm:gap-x-16"
        style={d(320)}
      >
        <div className="text-center">
          <CountUp
            end={1240}
            active={active}
            reduced={reduced}
            delay={420}
            className="tabular font-display text-3xl font-medium tracking-[-0.03em] text-paper sm:text-4xl"
          />
          <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-paper/55">
            Creators indexed
          </div>
        </div>
        <div className="text-center">
          <CountUp
            end={38500}
            active={active}
            reduced={reduced}
            delay={520}
            className="tabular font-display text-3xl font-medium tracking-[-0.03em] text-paper sm:text-4xl"
          />
          <div className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-paper/55">
            Posts checked
          </div>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== *
 * Root
 * ================================================================== */

export default function Intro({ onDone }: IntroProps) {
  const [index, setIndex] = useState(0)
  const reduced = usePrefersReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const doneRef = useRef(false)
  const [exiting, setExiting] = useState(false)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    if (reduced) {
      onDone()
      return
    }
    // Play the overlay's own exit (fade + slight scale up) over the page
    // beneath, then hand off.
    setExiting(true)
    window.setTimeout(onDone, 700)
  }, [onDone, reduced])

  const go = useCallback(
    (dir: 1 | -1) => {
      setIndex((prev) => {
        const next = prev + dir
        if (next < 0) return 0
        if (next >= SCENE_COUNT) {
          finish()
          return prev
        }
        return next
      })
    },
    [finish],
  )

  const isFinale = index === SCENE_COUNT - 1
  const onDark = isFinale

  // Body scroll lock while mounted (keeps the page beneath pinned at 0).
  useLayoutEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
    }
  }, [])

  // Move keyboard focus into the overlay on mount.
  useEffect(() => {
    rootRef.current?.focus()
  }, [])

  // Auto-advance: each scene holds briefly, then crossfades on. The finale
  // holds a beat, then auto-fades the whole intro out (no confirmation).
  useEffect(() => {
    const hold = isFinale ? (reduced ? 900 : 2200) : reduced ? 1400 : 3200
    const t = window.setTimeout(() => (isFinale ? finish() : go(1)), hold)
    return () => window.clearTimeout(t)
  }, [index, isFinale, reduced, go, finish])

  // Swallow wheel/touch so the intro never scrolls the page beneath it.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const swallow = (e: Event) => e.preventDefault()
    el.addEventListener('wheel', swallow, { passive: false })
    el.addEventListener('touchmove', swallow, { passive: false })
    return () => {
      el.removeEventListener('wheel', swallow)
      el.removeEventListener('touchmove', swallow)
    }
  }, [])

  // Keyboard: Escape skips; any other key advances early.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        finish()
        return
      }
      if (isFinale) return
      e.preventDefault()
      go(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, finish, isFinale])

  return (
    <div
      ref={rootRef}
      className="intro-root"
      role="dialog"
      aria-modal="true"
      aria-label="Introduction"
      tabIndex={-1}
      onClick={() => {
        if (!isFinale) go(1)
      }}
      style={{
        backgroundColor: onDark ? 'var(--color-deep)' : 'var(--color-paper)',
        transition: exiting
          ? 'opacity 0.7s ease, transform 0.7s ease'
          : 'background-color 0.6s ease',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.04)' : 'none',
      }}
    >
      {/* Static ambient orb behind the scenes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: onDark
            ? 'radial-gradient(circle at 50% 50%, rgba(122,92,255,0.55) 0%, rgba(221,135,255,0.28) 45%, rgba(122,92,255,0) 72%)'
            : 'radial-gradient(circle at 50% 50%, rgba(122,92,255,0.40) 0%, rgba(221,135,255,0.22) 45%, rgba(122,92,255,0) 72%)',
          filter: 'blur(120px)',
          opacity: onDark ? 0.35 : 0.12,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* Scenes */}
      {([0, 1, 2, 3, 4] as const).map((i) => {
        const state =
          i === index ? 'active' : i < index ? 'past' : 'upcoming'
        const active = i === index
        return (
          <section
            key={i}
            className="intro-scene"
            data-state={state}
            aria-hidden={!active}
          >
            {i === 0 && <SceneProblem />}
            {i === 1 && <SceneSource active={active} reduced={reduced} />}
            {i === 2 && <SceneTrustCheck active={active} />}
            {i === 3 && <SceneCampaign active={active} reduced={reduced} />}
            {i === 4 && <SceneFinale active={active} reduced={reduced} />}
          </section>
        )
      })}

      {/* Skip (quiet, top-right) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          finish()
        }}
        className={`fixed right-5 top-5 z-10 inline-flex h-9 items-center rounded-md px-3 font-mono text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          onDark
            ? 'text-paper/70 hover:bg-paper/10 hover:text-paper'
            : 'text-ink-3 hover:bg-line/60 hover:text-ink'
        }`}
      >
        Skip
      </button>
    </div>
  )
}
