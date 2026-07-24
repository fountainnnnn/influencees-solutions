import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronRight,
  MinusCircle,
  Share2,
} from 'lucide-react'
import Container from '../components/Container'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import StatusChip from '../components/StatusChip'
import Stat from '../components/Stat'
import CountUp, { compact as compactNum } from '../motion/CountUp'
import { creators } from '../data/creators'
import type { Creator, CreatorPlatform } from '../data/creators'

/* ------------------------------------------------------------------ *
 * Helpers (page-local; kept small and self-contained)
 * ------------------------------------------------------------------ */

function compact(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)}M`
  }
  if (n >= 1_000) {
    const v = n / 1_000
    return `${v >= 100 ? Math.round(v) : v.toFixed(1)}K`
  }
  return String(n)
}

function rate(n: number): string {
  return `S$${compact(n)}`
}

/** Deterministic "synced N days ago" caption, seeded from the handle. */
function syncedAgo(c: Creator): string {
  let h = 0
  for (let i = 0; i < c.handle.length; i++) h = (h + c.handle.charCodeAt(i)) % 18
  const days = h + 2
  return days === 1 ? 'synced yesterday' : `synced ${days} days ago`
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.4c-1.3.1-2.5-.3-3.6-1v5.9c0 3.4-2.5 5.8-5.6 5.8-3 0-5.3-2.3-5.3-5.2 0-3.2 2.8-5.5 6.2-4.9v2.5c-.5-.1-1-.2-1.5-.1-1.3.2-2.2 1.1-2.1 2.6.1 1.4 1.2 2.3 2.5 2.2 1.3-.1 2.2-1.1 2.2-2.6V3h3.3Z" />
    </svg>
  )
}

function platformLabel(p: CreatorPlatform['platform']): string {
  return p === 'instagram' ? 'Instagram' : 'TikTok'
}

function PlatformGlyph({
  platform,
  className,
}: {
  platform: CreatorPlatform['platform']
  className?: string
}) {
  return platform === 'instagram' ? (
    <InstagramIcon className={className} />
  ) : (
    <TikTokIcon className={className} />
  )
}

/* ------------------------------------------------------------------ *
 * Not found
 * ------------------------------------------------------------------ */

function NotFound({ handle }: { handle?: string }) {
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-20">
      <p className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-accent">
        Not found
      </p>
      <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        No creator at that handle.
      </h1>
      <p className="mt-4 max-w-md text-ink-2">
        {handle ? (
          <>
            We don&apos;t have a profile for{' '}
            <span className="font-mono text-ink">@{handle}</span> in the sample index.
          </>
        ) : (
          'That profile could not be found in the sample index.'
        )}
      </p>
      <Link
        to="/directory"
        className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to the directory
      </Link>
    </Container>
  )
}

/* ------------------------------------------------------------------ *
 * Trust signals
 * ------------------------------------------------------------------ */

type Signal = { label: string; tone: 'pass' | 'note' }

function buildSignals(c: Creator): Signal[] {
  const lead = c.platforms.reduce((a, b) => (b.followers > a.followers ? b : a))
  return [
    {
      label: `Engagement at ${lead.engagementRate}% is consistent with a ${compact(
        lead.followers,
      )}-follower audience`,
      tone: 'pass',
    },
    {
      label: `Audience ${c.audience.sgPct}% Singapore-based`,
      tone: c.audience.sgPct >= 80 ? 'pass' : 'note',
    },
    { label: 'No scam-pattern flags in recent captions', tone: 'pass' },
    {
      label: c.verified
        ? 'Profile ownership verified with the platform'
        : 'Profile ownership not yet verified',
      tone: c.verified ? 'pass' : 'note',
    },
  ]
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Trust-score bar that grows from 0 to `score`% when scrolled into view. */
function TrustBar({ score }: { score: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setWidth(score)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect()
          setWidth(score)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [score])

  return (
    <div
      ref={ref}
      className="mt-4 h-2 w-full overflow-hidden rounded-full bg-line"
    >
      <div
        className="bar-grow h-full rounded-full bg-accent"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function CreatorProfile() {
  const { handle } = useParams<{ handle: string }>()
  const creator = creators.find((c) => c.handle === handle)

  if (!creator) return <NotFound handle={handle} />

  const firstName = creator.name.split(' ')[0]
  const signals = buildSignals(creator)

  return (
    <>
      {/* Header */}
      <section className="border-b border-line">
        <Container className="py-12 lg:py-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-sm">
            <Link to="/directory" className="text-ink-2 hover:text-ink">
              Directory
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-ink-3" aria-hidden="true" />
            <span className="text-ink">{creator.name}</span>
          </nav>

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-5">
              <Avatar src={creator.avatar} name={creator.name} size={80} className="text-2xl" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-semibold tracking-tight text-ink">
                    {creator.name}
                  </h1>
                  {creator.verified && (
                    <Check className="h-5 w-5 text-accent" aria-label="Verified" />
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded border border-line bg-paper px-2 py-0.5 text-ink-2">
                    {creator.niche}
                  </span>
                  <span className="text-ink-2">🇸🇬 Singapore-based</span>
                  <span
                    className="rounded-full border border-warn/30 bg-warn/8 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-warn"
                  >
                    Sample profile · demonstration data
                  </span>
                </div>
                <p className="mt-4 max-w-xl leading-relaxed text-ink-2">{creator.bio}</p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap gap-3">
              <Button variant="primary" size="md">
                Shortlist for campaign
              </Button>
              <Button variant="secondary" size="md">
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Share profile
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats band — per platform */}
      <Container className="py-12 lg:py-16">
        <h2 className="mb-6 font-mono text-xs font-medium uppercase tracking-wider text-accent">
          Tracked platforms
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {creator.platforms.map((p) => (
            <div key={p.platform} className="rounded-lg border border-line bg-surface p-5">
              <div className="flex items-center gap-2 border-b border-line pb-4">
                <PlatformGlyph platform={p.platform} className="h-4 w-4 text-ink" />
                <span className="font-medium text-ink">{platformLabel(p.platform)}</span>
                <span className="font-mono text-xs text-ink-3">{p.handle}</span>
              </div>
              <div className="grid grid-cols-3 gap-3 py-4">
                <Stat
                  value={<CountUp value={p.followers} format={compactNum} />}
                  label="Followers"
                />
                <Stat
                  value={<CountUp value={p.engagementRate} decimals={1} suffix="%" />}
                  label="Engagement"
                />
                <Stat
                  value={<CountUp value={p.avgViews} format={compactNum} />}
                  label="Avg views"
                />
              </div>
              <p className="font-mono text-[11px] text-ink-3">
                Synced from public profile · {syncedAgo(creator)}
              </p>
            </div>
          ))}
        </div>
      </Container>

      {/* Trust panel */}
      <section className="border-y border-line bg-surface">
        <Container className="py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold tracking-tight text-ink">
                  Trust score
                </h2>
                <StatusChip status="BETA" />
              </div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="tabular font-mono text-6xl font-semibold tracking-tight text-ink">
                  <CountUp value={creator.trustScore} />
                </span>
                <span className="font-mono text-2xl text-ink-3">/100</span>
              </div>
              <TrustBar score={creator.trustScore} />
              <p className="mt-4 text-sm leading-relaxed text-ink-3">
                Trust signals are indicative, not a guarantee. They summarise public
                engagement patterns, so always brief and contract directly.
              </p>
            </div>

            <ul className="space-y-3">
              {signals.map((s) => (
                <li
                  key={s.label}
                  className="flex items-start gap-3 rounded-lg border border-line bg-paper px-4 py-3"
                >
                  {s.tone === 'pass' ? (
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-ok"
                      aria-hidden="true"
                    />
                  ) : (
                    <MinusCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-warn"
                      aria-hidden="true"
                    />
                  )}
                  <span className="text-sm text-ink-2">
                    {s.label}
                    <span
                      className={`ml-2 font-mono text-xs ${
                        s.tone === 'pass' ? 'text-ok' : 'text-warn'
                      }`}
                    >
                      {s.tone === 'pass' ? 'pass' : 'note'}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* Audience snapshot */}
      <Container className="py-12 lg:py-16">
        <h2 className="mb-6 font-mono text-xs font-medium uppercase tracking-wider text-accent">
          Audience snapshot
        </h2>
        <div className="grid grid-cols-1 gap-6 rounded-lg border border-line bg-surface p-8 sm:grid-cols-3">
          <Stat value={creator.audience.topAgeRange} label="Top age range" />
          <Stat
            value={<CountUp value={creator.audience.femalePct} suffix="%" />}
            label="Female audience"
          />
          <Stat
            value={<CountUp value={creator.audience.sgPct} suffix="%" />}
            label="Singapore audience"
          />
        </div>
      </Container>

      {/* Content examples */}
      <section className="border-y border-line bg-surface">
        <Container className="py-12 lg:py-16">
          <h2 className="mb-6 font-mono text-xs font-medium uppercase tracking-wider text-accent">
            Recent content
          </h2>
          <div className="divide-y divide-line rounded-lg border border-line bg-paper">
            {creator.contentExamples.map((ex) => (
              <div
                key={ex.title}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <PlatformGlyph
                    platform={ex.platform}
                    className="h-4 w-4 shrink-0 text-ink-3"
                  />
                  <span className="text-sm text-ink">{ex.title}</span>
                </div>
                <div className="flex shrink-0 items-center gap-6 pl-7 sm:pl-0">
                  <div className="text-right">
                    <div className="tabular font-mono text-sm font-medium text-ink">
                      {compact(ex.views)}
                    </div>
                    <div className="text-[11px] text-ink-3">views</div>
                  </div>
                  <div className="text-right">
                    <div className="tabular font-mono text-sm font-medium text-ink">
                      {compact(ex.likes)}
                    </div>
                    <div className="text-[11px] text-ink-3">likes</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Rate card */}
      <Container className="py-12 lg:py-16">
        <div className="rounded-lg border border-line bg-surface p-8">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">
            Estimated rate (SGD)
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="tabular font-mono text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {rate(creator.estRateSGD.min)}
            </span>
            <span className="font-mono text-2xl text-ink-3">to</span>
            <span className="tabular font-mono text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {rate(creator.estRateSGD.max)}
            </span>
            <span className="ml-1 text-sm text-ink-3">per post</span>
          </div>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-2">
            Estimated from reach and engagement benchmarks. Actual rates are set by the
            creator.
          </p>
        </div>
      </Container>

      {/* Bottom band */}
      <section className="bg-deep">
        <Container className="flex flex-col items-start justify-between gap-6 py-16 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Work with {firstName}.
            </h2>
            <p className="mt-2 max-w-md leading-relaxed text-paper/70">
              Shortlist this profile, compare it against your other candidates, and brief
              from one campaign workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button to="/brands" variant="primary" size="lg">
              Start a campaign
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Link
              to="/directory"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/20 px-6 text-base font-medium text-white transition-colors hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to directory
            </Link>
          </div>
        </Container>
      </section>
    </>
  )
}
