import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, Search, X } from 'lucide-react'
import Container from '../components/Container'
import Button from '../components/Button'
import Avatar from '../components/Avatar'
import { GlowCard } from '../components/Glow'
import { creators } from '../data/creators'
import type { Creator, CreatorPlatform } from '../data/creators'

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

/** Compact number: 472000 -> "472K", 1200000 -> "1.2M". */
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

/** SGD rate: 5200 -> "S$5.2K", 420 -> "S$420". */
function rate(n: number): string {
  return `S$${compact(n)}`
}

/** Highest follower count across platforms. */
function peakFollowers(c: Creator): number {
  return Math.max(...c.platforms.map((p) => p.followers))
}

type SizeTier = 'nano' | 'micro' | 'mid' | 'macro'

function sizeTier(c: Creator): SizeTier {
  const f = peakFollowers(c)
  if (f < 10_000) return 'nano'
  if (f < 100_000) return 'micro'
  if (f < 500_000) return 'mid'
  return 'macro'
}

/** Platform to represent in the card (the one with the most reach). */
function leadPlatform(c: Creator, only?: PlatformFilter): CreatorPlatform {
  const pool =
    only && only !== 'All' ? c.platforms.filter((p) => p.platform === only) : c.platforms
  const list = pool.length ? pool : c.platforms
  return list.reduce((a, b) => (b.followers > a.followers ? b : a))
}

/** Trust-score colour band. */
function trustTone(score: number): string {
  if (score >= 90) return 'text-ok border-ok/30 bg-ok/8'
  if (score >= 75) return 'text-ink-2 border-line bg-paper'
  return 'text-warn border-warn/30 bg-warn/8'
}

/* ------------------------------------------------------------------ *
 * Static filter config
 * ------------------------------------------------------------------ */

const NICHES = [
  'Food',
  'Beauty',
  'Fitness',
  'Finance',
  'Lifestyle',
  'Tech',
  'Travel',
  'Parenting',
] as const

type PlatformFilter = 'All' | 'instagram' | 'tiktok'
type SizeFilter = 'All' | SizeTier
type SortKey = 'trust' | 'followers' | 'engagement'

const SIZE_OPTIONS: { value: SizeFilter; label: string }[] = [
  { value: 'All', label: 'All sizes' },
  { value: 'nano', label: 'Nano · <10K' },
  { value: 'micro', label: 'Micro · 10-100K' },
  { value: 'mid', label: 'Mid · 100-500K' },
  { value: 'macro', label: 'Macro · 500K+' },
]

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'trust', label: 'Trust score' },
  { value: 'followers', label: 'Followers' },
  { value: 'engagement', label: 'Engagement rate' },
]

/* ------------------------------------------------------------------ *
 * Platform icon
 * ------------------------------------------------------------------ */

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
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.4c-1.3.1-2.5-.3-3.6-1v5.9c0 3.4-2.5 5.8-5.6 5.8-3 0-5.3-2.3-5.3-5.2 0-3.2 2.8-5.5 6.2-4.9v2.5c-.5-.1-1-.2-1.5-.1-1.3.2-2.2 1.1-2.1 2.6.1 1.4 1.2 2.3 2.5 2.2 1.3-.1 2.2-1.1 2.2-2.6V3h3.3Z" />
    </svg>
  )
}

function PlatformIcons({ platforms }: { platforms: CreatorPlatform[] }) {
  return (
    <span className="flex items-center gap-1.5 text-ink-3">
      {platforms.map((p) =>
        p.platform === 'instagram' ? (
          <InstagramIcon key={p.platform} className="h-4 w-4" />
        ) : (
          <TikTokIcon key={p.platform} className="h-4 w-4" />
        ),
      )}
    </span>
  )
}

/* ------------------------------------------------------------------ *
 * Creator card
 * ------------------------------------------------------------------ */

function CreatorCard({
  creator,
  platformFilter,
  animateIn,
  index = 0,
}: {
  creator: Creator
  platformFilter: PlatformFilter
  /** Only true on the very first render, so filter changes stay instant. */
  animateIn?: boolean
  index?: number
}) {
  const lead = leadPlatform(creator, platformFilter)
  return (
    <Link
      to={`/directory/${creator.handle}`}
      className={`group flex h-full flex-col rounded-lg border border-line bg-surface p-5 transition-colors hover:border-ink-3 ${
        animateIn ? 'animate-rise' : ''
      }`}
      style={
        animateIn
          ? { animationDelay: `${Math.min(index * 40, 400)}ms` }
          : undefined
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar src={creator.avatar} name={creator.name} size={44} className="text-sm" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-ink">{creator.name}</span>
              {creator.verified && (
                <Check className="h-3.5 w-3.5 text-accent" aria-label="Verified" />
              )}
            </div>
            <div className="font-mono text-xs text-ink-3">{lead.handle}</div>
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full border px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none ${trustTone(
            creator.trustScore,
          )}`}
          title="Trust score"
        >
          {creator.trustScore}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="rounded border border-line bg-paper px-2 py-0.5 text-xs text-ink-2">
          {creator.niche}
        </span>
        <PlatformIcons platforms={creator.platforms} />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-4">
        <CardStat value={compact(lead.followers)} label="Followers" />
        <CardStat value={`${lead.engagementRate}%`} label="Engagement" />
        <CardStat value={compact(lead.avgViews)} label="Avg views" />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <span className="text-xs text-ink-3">Est. rate / post</span>
        <span className="tabular font-mono text-sm font-medium text-ink">
          {rate(creator.estRateSGD.min)}-{rate(creator.estRateSGD.max).replace('S$', '')}
        </span>
      </div>
    </Link>
  )
}

function CardStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="tabular font-mono text-base font-medium text-ink">{value}</div>
      <div className="mt-0.5 text-[11px] text-ink-3">{label}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Active-filter chip
 * ------------------------------------------------------------------ */

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1 text-xs text-ink-2 transition-colors hover:border-ink-3 hover:text-ink"
    >
      {label}
      <X className="h-3 w-3" aria-hidden="true" />
      <span className="sr-only">Clear filter</span>
    </button>
  )
}

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function Directory() {
  const [query, setQuery] = useState('')
  const [niche, setNiche] = useState<'All' | (typeof NICHES)[number]>('All')
  const [platform, setPlatform] = useState<PlatformFilter>('All')
  const [size, setSize] = useState<SizeFilter>('All')
  const [sort, setSort] = useState<SortKey>('trust')

  // Stagger cards in on first paint only; every filter change stays instant.
  const firstRenderRef = useRef(true)
  const animateIn = firstRenderRef.current
  useEffect(() => {
    firstRenderRef.current = false
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = creators.filter((c) => {
      if (niche !== 'All' && c.niche !== niche) return false
      if (platform !== 'All' && !c.platforms.some((p) => p.platform === platform))
        return false
      if (size !== 'All' && sizeTier(c) !== size) return false
      if (q) {
        const hay = `${c.name} ${c.handle} ${c.bio} ${c.platforms
          .map((p) => p.handle)
          .join(' ')}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })

    const sorted = [...filtered].sort((a, b) => {
      if (sort === 'followers') return peakFollowers(b) - peakFollowers(a)
      if (sort === 'engagement')
        return leadPlatform(b, platform).engagementRate -
          leadPlatform(a, platform).engagementRate
      return b.trustScore - a.trustScore
    })
    return sorted
  }, [query, niche, platform, size, sort])

  const hasFilters =
    query.trim() !== '' || niche !== 'All' || platform !== 'All' || size !== 'All'

  function clearAll() {
    setQuery('')
    setNiche('All')
    setPlatform('All')
    setSize('All')
  }

  const selectClass =
    'h-9 rounded-md border border-line bg-surface px-2.5 text-sm text-ink focus:border-ink-3 focus:outline-none'

  return (
    <>
      {/* Hero */}
      <section className="border-b border-line">
        <Container className="py-14 lg:py-20">
          <p className="animate-rise text-gradient-brand mb-4 text-xs font-semibold uppercase tracking-[0.08em]">
            Creator directory
          </p>
          <h1
            className="animate-rise max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl"
            style={{ animationDelay: '80ms' }}
          >
            Every creator here is Singapore-based. Every number is tracked.
          </h1>
          <p
            className="animate-rise mt-5 max-w-xl text-lg leading-relaxed text-ink-2"
            style={{ animationDelay: '160ms' }}
          >
            Browse the sample index by niche, platform, audience size and real
            engagement, not follower counts alone.
          </p>
          <p className="mt-6 font-mono text-xs text-ink-3">
            {creators.length} creators · Sample data
          </p>
          <p className="mt-1.5 max-w-md text-xs text-ink-3">
            The live index is invite-vetted. Every profile is a Singapore creator with
            stats synced from public Instagram and TikTok.
          </p>
        </Container>
      </section>

      {/* Filter bar */}
      <div className="sticky top-0 z-20 border-b border-line bg-paper/90 backdrop-blur">
        <Container className="py-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[220px] flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, handle or bio"
                  aria-label="Search creators"
                  className="h-9 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-sm text-ink placeholder:text-ink-3 focus:border-ink-3 focus:outline-none"
                />
              </div>

              {/* Platform toggle */}
              <div className="inline-flex rounded-md border border-line bg-surface p-0.5">
                {(['All', 'instagram', 'tiktok'] as PlatformFilter[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`h-8 rounded px-2.5 text-xs font-medium capitalize transition-colors ${
                      platform === p
                        ? 'bg-ink text-white'
                        : 'text-ink-2 hover:text-ink'
                    }`}
                  >
                    {p === 'All' ? 'All' : p}
                  </button>
                ))}
              </div>

              <select
                value={size}
                onChange={(e) => setSize(e.target.value as SizeFilter)}
                aria-label="Filter by audience size"
                className={selectClass}
              >
                {SIZE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                aria-label="Sort creators"
                className={selectClass}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    Sort: {o.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Niche chips */}
            <div className="flex flex-wrap gap-1.5">
              {(['All', ...NICHES] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNiche(n)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                    niche === n
                      ? 'border-accent bg-accent/8 text-accent'
                      : 'border-line bg-surface text-ink-2 hover:border-ink-3 hover:text-ink'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>

            {/* Active filters */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
                  Active
                </span>
                {query.trim() && (
                  <FilterChip label={`"${query.trim()}"`} onClear={() => setQuery('')} />
                )}
                {niche !== 'All' && (
                  <FilterChip label={niche} onClear={() => setNiche('All')} />
                )}
                {platform !== 'All' && (
                  <FilterChip
                    label={platform === 'instagram' ? 'Instagram' : 'TikTok'}
                    onClear={() => setPlatform('All')}
                  />
                )}
                {size !== 'All' && (
                  <FilterChip
                    label={SIZE_OPTIONS.find((o) => o.value === size)?.label ?? size}
                    onClear={() => setSize('All')}
                  />
                )}
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-medium text-accent hover:text-accent-ink"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Results */}
      <Container className="py-10 lg:py-14">
        <p className="mb-6 font-mono text-xs text-ink-3">
          {results.length} {results.length === 1 ? 'creator' : 'creators'}
        </p>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line py-20 text-center">
            <p className="text-lg font-medium text-ink">No creators match.</p>
            <p className="mt-2 max-w-sm text-sm text-ink-2">
              Try a broader niche or size, or clear the filters to see the full index.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-ink"
            >
              Clear filters
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((c, i) => (
              <CreatorCard
                key={c.handle}
                creator={c}
                platformFilter={platform}
                animateIn={animateIn}
                index={i}
              />
            ))}
          </div>
        )}
      </Container>

      {/* Bottom CTA band */}
      <Container className="py-16 lg:py-20">
        <GlowCard glow={2} mesh minHeight={0}>
          <div className="relative z-[2] flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center lg:p-10">
            <div>
              <p className="text-gradient-brand text-xs font-semibold uppercase tracking-[0.08em]">
                For creators
              </p>
              <h2 className="mt-3 text-2xl font-medium tracking-tight text-ink">
                Are you an SG creator?
              </h2>
              <p className="mt-2 max-w-md leading-relaxed text-ink-2">
                List your Instagram and TikTok, get your stats tracked from the
                source, and be found by brands that do their homework.
              </p>
            </div>
            <Button to="/creators" variant="primary" size="lg">
              Join the index
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </GlowCard>
      </Container>
    </>
  )
}
