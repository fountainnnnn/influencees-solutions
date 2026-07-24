import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, Search } from 'lucide-react'
import Container from '../components/Container'
import Button from '../components/Button'
import StatusChip from '../components/StatusChip'
import Avatar from '../components/Avatar'
import AiKyoAvatar from '../components/AiKyoAvatar'
import AiKyoChat from '../components/AiKyoChat'
import { SectionHeader, GlowCard } from '../components/Glow'
import Reveal from '../motion/Reveal'
import ProductFrame from '../motion/ProductFrame'
import CountUp from '../motion/CountUp'
import { useLenis } from '../motion/LenisProvider'
import { creators } from '../data/creators'

/** Smooth-scroll to an on-page section id (Lenis when available). */
function useScrollToId() {
  const lenis = useLenis()
  return (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -80 })
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/* ------------------------------------------------------------------ *
 * Featured creators drawn from the real directory data.
 * ------------------------------------------------------------------ */

const FEATURED_HANDLES = ['clarity', 'janae-chua', 'amy-lien', 'kelvins-grill']
const FEATURED = FEATURED_HANDLES.map(
  (h) => creators.find((c) => c.handle === h)!,
).filter(Boolean)

/** Lead platform (most followers) for a creator. */
function lead(c: (typeof creators)[number]) {
  return c.platforms.reduce((a, b) => (b.followers > a.followers ? b : a))
}

/* ------------------------------------------------------------------ *
 * Section 1 — Hero
 * ------------------------------------------------------------------ */

function Hero() {
  return (
      <section id="hero" className="relative overflow-hidden">
      <Container className="grid gap-14 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div>
          <p className="animate-rise text-gradient-brand mb-5 text-xs font-semibold uppercase tracking-[0.08em]">
            Singapore's creator trust platform
          </p>
          <h1
            className="animate-rise font-display text-[2.75rem] font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-5xl"
            style={{ animationDelay: '80ms' }}
          >
            Creator marketing,{' '}
            <span className="text-gradient-brand">with receipts</span>.
          </h1>
          <p
            className="animate-rise mt-5 max-w-lg text-lg leading-relaxed text-ink-2"
            style={{ animationDelay: '160ms' }}
          >
            Verified Instagram and TikTok data for Singapore creators, with the
            campaign tools to act on it.
          </p>
          <div
            className="animate-rise mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '240ms' }}
          >
            <Button to="/brands" variant="primary" size="lg">
              I'm a brand
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to="/creators" variant="secondary" size="lg">
              I'm a creator
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <p
            className="animate-rise mt-6 font-mono text-xs text-ink-3"
            style={{ animationDelay: '320ms' }}
          >
            Instagram + TikTok · Every creator SG-based
          </p>
        </div>

        <div className="animate-rise" style={{ animationDelay: '400ms' }}>
          <HeroVisual />
        </div>
      </Container>
    </section>
  )
}

/** Real product screenshot inside a glow card, with floating glass props. */
function HeroVisual() {
  const scrollToId = useScrollToId()
  const cluster = ['clarity', 'riona', 'brooke']
    .map((h) => creators.find((c) => c.handle === h)!)
    .filter(Boolean)

  return (
    <GlowCard glow={0} mesh minHeight={0} className="p-5 sm:p-6">
      <div className="relative z-[2]">
        <ProductFrame url="influencees.com" tilt bodyClassName="p-0">
          <img
            src="/shots/home.png"
            alt="The Influencees home page on the live site"
            className="block w-full"
          />
        </ProductFrame>
      </div>

      {/* Floating glass prop: real creator cluster */}
      <div className="absolute left-1 top-8 z-[3] hidden items-center gap-2 rounded-full border border-line bg-white/80 px-3 py-1.5 shadow-[0_8px_30px_rgba(27,16,82,0.1)] backdrop-blur-xl sm:flex">
        <span className="flex items-center">
          {cluster.map((c, i) => (
            <Avatar
              key={c.handle}
              src={c.avatar}
              name={c.name}
              size={26}
              className={i === 0 ? '' : '-ml-2'}
            />
          ))}
        </span>
        <span className="font-mono text-[11px] font-medium text-ink">
          1,200+ SG creators
        </span>
      </div>

      {/* Floating glass prop: Try Ai-kyo button with cursor arrow */}
      <div className="absolute bottom-9 right-2 z-[3] hidden sm:block">
        <button
          type="button"
          onClick={() => scrollToId('ai-kyo')}
          className="inline-flex items-center gap-1.5 rounded-full border border-ink bg-white/90 px-3.5 py-1 text-xs font-semibold text-ink shadow-[0_8px_30px_rgba(27,16,82,0.12)] backdrop-blur-xl transition-colors hover:bg-ink hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="text-base text-accent">✦</span>
          Try Ai-kyo
        </button>
        <svg
          viewBox="0 0 24 24"
          className="absolute -bottom-4 left-14 h-6 w-6 drop-shadow"
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
    </GlowCard>
  )
}

/* ------------------------------------------------------------------ *
 * Section 2 — Two-path selector
 * ------------------------------------------------------------------ */

type PathCard = {
  audience: string
  title: string
  bullets: string[]
  to: string
  cta: string
}

const PATHS: PathCard[] = [
  {
    audience: 'For brands',
    title: 'Find creators whose numbers you can trust.',
    bullets: [
      'Filter SG creators by niche, platform and real engagement',
      'Compare shortlists side by side, with no inflated follower counts',
      'Brief, budget and report from one campaign workspace',
    ],
    to: '/brands',
    cta: 'Explore for brands',
  },
  {
    audience: 'For creators',
    title: 'Know your worth. Land better deals.',
    bullets: [
      'Stats synced from your IG and TikTok, not self-reported',
      'An SGD rate card built from real market data',
      'Spot low-ball offers and usage-rights traps before you sign',
    ],
    to: '/creators',
    cta: 'Explore for creators',
  },
]

function TwoPath() {
  return (
    <Container className="py-20 lg:py-24">
      <Reveal>
        <SectionHeader
          eyebrow="Two sides, one platform"
          title="Pick the side you are on."
          subtitle="The verified data is shared. The tools are built for the job you actually do."
        />
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {PATHS.map((p, i) => (
          <Reveal key={p.audience} delay={i * 90} className="h-full">
            <GlowCard glow={i === 0 ? 0 : 1} minHeight={0}>
              <div className="relative z-[2] flex h-full flex-col p-6">
                <p className="text-gradient-brand text-xs font-semibold uppercase tracking-[0.08em]">
                  {p.audience}
                </p>
                <div className="mt-4 rounded-xl bg-white p-5 shadow-[0_6px_20px_-8px_rgba(27,16,82,0.18)]">
                  <h3 className="text-xl font-semibold tracking-tight text-ink">
                    {p.title}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {p.bullets.map((b) => (
                      <li key={b} className="flex gap-2.5 text-sm text-ink-2">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                          aria-hidden="true"
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to={p.to}
                  className="group mt-6 inline-flex w-fit items-center gap-1.5 rounded-full border border-ink bg-white px-4 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white"
                >
                  {p.cta}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </Container>
  )
}

/* ------------------------------------------------------------------ *
 * Section 3 — Core features (three gradient cards)
 * ------------------------------------------------------------------ */

function CoreFeatures() {
  const clusterAvatars = ['clarity', 'riona', 'brooke', 'janae-chua']
    .map((h) => creators.find((c) => c.handle === h)!)
    .filter(Boolean)

  return (
    <section className="border-y border-line">
      <Container className="py-20 lg:py-24">
        <Reveal>
          <SectionHeader
            eyebrow="Core features"
            title="Built on trust, not vanity metrics."
            subtitle="Everything a brand needs to go from search to signed creator."
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 — Ask Ai-kyo */}
          <Reveal className="h-full">
            <GlowCard glow={0} label="Ask Ai-kyo anything">
              <div className="absolute inset-x-6 top-7 z-[2]">
                <div className="rounded-xl bg-white p-4 text-[0.8rem] leading-relaxed text-ink-2 shadow-[0_6px_20px_-8px_rgba(27,16,82,0.25)]">
                  Find{' '}
                  <span className="text-gradient-brand font-semibold">
                    beauty micro-creators
                  </span>{' '}
                  in{' '}
                  <span className="text-gradient-brand font-semibold">
                    Singapore
                  </span>{' '}
                  with{' '}
                  <span className="text-gradient-brand font-semibold">
                    engagement above 4%
                  </span>{' '}
                  and draft a campaign brief
                </div>
                <div className="relative mt-6 ml-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-ink bg-white px-3.5 py-1 text-xs font-semibold text-ink">
                    <span className="text-base text-accent">✦</span>
                    Ask Ai-kyo
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    className="absolute left-16 top-6 h-6 w-6 drop-shadow"
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
          </Reveal>

          {/* Card 2 — Trust Check (real screenshot crop) */}
          <Reveal className="h-full" delay={90}>
            <GlowCard
              glow={1}
              label="Trust Check every post"
              chip={<StatusChip status="BETA" />}
            >
              <div className="absolute inset-x-6 top-6 bottom-[76px] z-[2]">
                <div className="h-full overflow-hidden rounded-xl border border-white/70 bg-white shadow-[0_10px_30px_-10px_rgba(27,16,82,0.3)]">
                  <img
                    src="/shots/check.png"
                    alt="Trust Check report on the live Influencees product"
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
              </div>
            </GlowCard>
          </Reveal>

          {/* Card 3 — The Creator Index */}
          <Reveal className="h-full" delay={180}>
            <GlowCard glow={2} mesh label="The Creator Index">
              <div className="absolute left-1/2 top-11 z-[2] flex -translate-x-1/2 items-center">
                {clusterAvatars.map((c, i) => (
                  <Avatar
                    key={c.handle}
                    src={c.avatar}
                    name={c.name}
                    size={60}
                    className={i === 0 ? '' : '-ml-4'}
                  />
                ))}
                <span className="-ml-2 inline-flex h-7 items-center rounded-full border border-ink/10 bg-white px-2 font-mono text-[10px] font-semibold text-ink shadow-sm">
                  SG
                </span>
              </div>
              <div className="absolute left-1/2 top-[220px] z-[2] -translate-x-1/2">
                <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-ink bg-white px-4 py-1.5 text-xs font-medium text-ink">
                  <Search className="h-3.5 w-3.5 text-ink-3" aria-hidden="true" />
                  Search 1,200+ SG creators
                </span>
              </div>
            </GlowCard>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Section 4 — Product tour (3 alternating rows)
 * ------------------------------------------------------------------ */

function ProductTour() {
  const rows: {
    label: string
    chip: 'LIVE' | 'BETA' | 'SOON'
    glow: number
    visual: ReactNode
  }[] = [
    { label: 'Discover and compare', chip: 'LIVE', glow: 0, visual: <CompareVisual /> },
    { label: 'Campaign workspace', chip: 'LIVE', glow: 1, visual: <PipelineVisual /> },
    { label: 'Ai-kyo assistant', chip: 'BETA', glow: 2, visual: <ChatVisual /> },
  ]
  return (
    <Container className="py-20 lg:py-28">
      <Reveal>
        <SectionHeader
          eyebrow="The workspace"
          title="From shortlist to signed-off report."
          subtitle="Everything a campaign needs, without leaving one tab."
        />
      </Reveal>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {rows.map((r, i) => (
          <Reveal key={r.label} delay={i * 90} className="h-full">
            <GlowCard
              glow={r.glow}
              minHeight={0}
              label={r.label}
              chip={<StatusChip status={r.chip} />}
            >
              <div className="relative z-[2] p-5">{r.visual}</div>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </Container>
  )
}

const cr = (handle: string) => creators.find((c) => c.handle === handle)!

/** Discover and compare: a compact 3-creator shortlist, recreated as product UI. */
function CompareVisual() {
  const rows: { slug: string; er: string; best?: boolean }[] = [
    { slug: 'clarity', er: '4.8%', best: true },
    { slug: 'riona', er: '5.1%' },
    { slug: 'brooke', er: '5.4%' },
  ]
  return (
    <ProductFrame url="influencees.com/discover" tilt bodyClassName="p-0">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
        <span className="min-w-0 truncate text-sm font-medium text-ink">
          Compare shortlist
        </span>
        <span className="shrink-0 rounded-md border border-accent/30 bg-accent/8 px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider text-accent">
          3 selected
        </span>
      </div>
      <div className="divide-y divide-line">
        {rows.map((r) => {
          const c = cr(r.slug)
          return (
            <div
              key={r.slug}
              className="flex items-center justify-between gap-3 px-4 py-2.5"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Avatar src={c.avatar} name={c.name} size={24} />
                <span
                  className="min-w-0 truncate font-mono text-xs text-ink"
                  title={c.name}
                >
                  {c.platforms[0].handle}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {r.best && (
                  <span className="rounded bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] font-medium text-accent">
                    Top ER
                  </span>
                )}
                <span className="tabular font-mono text-xs font-medium text-ink">
                  {r.er}
                </span>
              </span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-line bg-paper px-4 py-2.5 font-mono text-[11px] text-ink-3">
        <span className="min-w-0 truncate">Tracked from the source</span>
        <span className="shrink-0">12 Jul</span>
      </div>
    </ProductFrame>
  )
}

/** Campaign workspace: a 4-column kanban pipeline, recreated as product UI. */
function PipelineVisual() {
  const cols: { stage: string; tone: string; cards: string[] }[] = [
    { stage: 'Brief', tone: 'text-ink-3', cards: ['janae-chua', 'amy-lien'] },
    { stage: 'Review', tone: 'text-info', cards: ['riona'] },
    { stage: 'Live', tone: 'text-ok', cards: ['brooke'] },
    { stage: 'Report', tone: 'text-accent', cards: ['clarity'] },
  ]
  return (
    <ProductFrame url="influencees.com/campaigns" tilt bodyClassName="p-3.5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-sm font-medium text-ink">
          Hawker Series Q3
        </span>
        <span className="shrink-0 font-mono text-[11px] text-ink-3">
          5 creators
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {cols.map((col) => (
          <div
            key={col.stage}
            className="min-w-0 overflow-hidden rounded-md bg-paper p-1.5"
          >
            <div className="mb-1.5 flex items-center justify-between gap-1 px-0.5">
              <span
                className={`min-w-0 truncate font-mono text-[9px] font-medium uppercase tracking-wide ${col.tone}`}
              >
                {col.stage}
              </span>
              <span className="shrink-0 font-mono text-[9px] text-ink-3">
                {col.cards.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {col.cards.map((slug) => {
                const c = cr(slug)
                return (
                  <div
                    key={slug}
                    className="flex items-center gap-1 overflow-hidden rounded border border-line bg-surface px-1 py-1"
                  >
                    <Avatar src={c.avatar} name={c.name} size={16} />
                    <span
                      className="min-w-0 truncate font-mono text-[9px] text-ink"
                      title={c.platforms[0].handle}
                    >
                      {c.platforms[0].handle}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-2.5 text-xs text-ink-2">
        <span className="min-w-0 truncate">Budget used</span>
        <span className="tabular shrink-0 font-mono text-ink">S$4.2K / 6K</span>
      </div>
    </ProductFrame>
  )
}

/** Ai-kyo: a compact chat panel, recreated as product UI. */
function ChatVisual() {
  return (
    <ProductFrame url="influencees.com/ai-kyo" tilt bodyClassName="p-0">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <AiKyoAvatar size={24} />
        <span className="min-w-0 truncate font-mono text-sm font-medium text-ink">
          Ai-kyo
        </span>
        <StatusChip status="BETA" />
      </div>
      <div className="space-y-3 px-4 py-4 text-sm">
        <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-ink px-3 py-2 text-white">
          Find SG food creators with 5%+ engagement.
        </div>
        <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-line bg-paper px-3 py-2 text-ink">
          Three verified matches:
          <div className="mt-2 space-y-1.5">
            {['clarity', 'riona', 'brooke'].map((slug) => {
              const c = cr(slug)
              return (
                <div key={slug} className="flex items-center gap-2">
                  <Avatar src={c.avatar} name={c.name} size={20} />
                  <span
                    className="min-w-0 truncate font-mono text-xs text-ink-2"
                    title={c.name}
                  >
                    {c.platforms[0].handle}
                  </span>
                  <span className="tabular ml-auto shrink-0 font-mono text-xs text-ink-2">
                    {c.platforms[0].engagementRate}% ER
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-sm border border-line bg-paper px-3 py-2.5">
          <span className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-3" />
          <span
            className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-3"
            style={{ animationDelay: '0.15s' }}
          />
          <span
            className="typing-dot h-1.5 w-1.5 rounded-full bg-ink-3"
            style={{ animationDelay: '0.3s' }}
          />
        </div>
      </div>
    </ProductFrame>
  )
}

/* ------------------------------------------------------------------ *
 * The platform today — a real screenshot of the live site
 * ------------------------------------------------------------------ */

function PlatformToday() {
  return (
    <section className="border-y border-line bg-surface">
      <Container className="py-20 lg:py-28">
        <Reveal>
          <SectionHeader
            eyebrow="Inside the workspace"
            title="The product, doing the work."
            subtitle="One request turns into creator matches, audience overlap, reach forecasts and budget pacing."
          />
        </Reveal>
        <Reveal className="mt-12 mx-auto max-w-4xl">
          <ProductFrame
            url="app.influencees.com/campaigns"
            tilt
            bodyClassName="bg-paper p-0"
          >
            <img
              src="/shots/live-ai-kyo-workspace.png"
              alt="The live Influencees workspace showing Ai-kyo creator matches, campaign insight, audience overlap and performance forecasts"
              loading="lazy"
              className="block w-full"
            />
          </ProductFrame>
          <div className="mt-6 grid gap-4 border-t border-line pt-5 text-sm sm:grid-cols-3">
            <p className="text-ink-2">
              <span className="font-medium text-ink">Match:</span> shortlist
              creators against the campaign and budget.
            </p>
            <p className="text-ink-2">
              <span className="font-medium text-ink">Forecast:</span> see reach,
              engagement and audience overlap before committing.
            </p>
            <p className="text-ink-2">
              <span className="font-medium text-ink">Manage:</span> keep spend,
              stages and next actions in the same workspace.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Ai-kyo — interactive mock chat
 * ------------------------------------------------------------------ */

function AiKyoSection() {
  return (
    <section id="ai-kyo" className="scroll-mt-24 border-y border-line">
      <Container className="py-20 lg:py-28">
        <Reveal>
          <SectionHeader
            eyebrow="Ai-kyo"
            title="Ask in plain English."
            subtitle="Find creators, draft a brief or check a plan. Try it below, it runs right here."
          />
        </Reveal>
        <Reveal className="mt-12">
          <GlowCard glow={0} mesh minHeight={0} className="p-5 sm:p-8">
            <div className="relative z-[2]">
              <AiKyoChat />
            </div>
          </GlowCard>
        </Reveal>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Section 5 — Featured creators strip
 * ------------------------------------------------------------------ */

function FeaturedStrip() {
  return (
    <section className="border-y border-line bg-surface">
      <Container className="py-20 lg:py-24">
        <Reveal>
          <SectionHeader
            eyebrow="From the directory"
            title="Real creators, real avatars."
            subtitle="Names, handles and top posts are real. Metrics are estimates for demonstration."
          />
          <div className="mt-6 flex justify-center">
            <Link
              to="/directory"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-accent"
            >
              Browse the directory
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED.map((c, i) => {
            const p = lead(c)
            return (
              <Reveal key={c.handle} delay={i * 70} className="h-full">
                <Link
                  to={`/directory/${c.handle}`}
                  className="group flex h-full flex-col rounded-lg border border-line bg-paper p-5 transition-colors hover:border-ink-3"
                >
                  <div className="flex items-start justify-between">
                    <Avatar src={c.avatar} name={c.name} size={44} className="text-sm" />
                    <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-ink-3">
                      SG
                    </span>
                  </div>
                  <div className="mt-4 font-medium text-ink">{c.name}</div>
                  <div className="font-mono text-xs text-ink-3">{p.handle}</div>
                  <div className="mt-3 flex-1 text-sm text-ink-2">{c.niche}</div>
                  <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                    <span className="font-mono text-xs text-ink-3">
                      IG · TikTok
                    </span>
                    <span className="tabular font-mono text-sm font-medium text-ink">
                      <CountUp value={p.engagementRate} decimals={1} suffix="%" />
                      <span className="ml-1 text-xs font-normal text-ink-3">
                        ER
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Section 6 — Pricing preview
 * ------------------------------------------------------------------ */

function PricingPreview() {
  return (
    <Container className="py-20 lg:py-24">
      <Reveal>
        <SectionHeader
          eyebrow="Pricing"
          title="Priced for both sides of the deal."
          subtitle="One honest price set, with no plan you can't find later."
        />
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Reveal className="h-full">
          <PriceCard
            glow={0}
            audience="For brands"
            headline="From $49/mo"
            sub="Discovery, Trust Check and match scores on the Starter plan. Ai-kyo and campaign analytics from Growth ($119/mo)."
            bullets={['1 campaign, 10 creators', 'Discovery + Trust Check', 'Match score and basic reports']}
          />
        </Reveal>
        <Reveal delay={90} className="h-full">
          <PriceCard
            glow={1}
            audience="For creators"
            headline="Free"
            sub="Starter is free forever. Creator Pro unlocks your live stats dashboard, rate card and Brief Analyzer for $16/mo."
            bullets={['Community, badges and leaderboard', 'Get discovered by brands', 'Upgrade to Pro anytime']}
            accentPrice="Pro $16/mo"
          />
        </Reveal>
      </div>
      <div className="mt-8 flex justify-center">
        <Button to="/pricing" variant="secondary" size="md">
          See full pricing
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </Container>
  )
}

function PriceCard({
  glow,
  audience,
  headline,
  sub,
  bullets,
  accentPrice,
}: {
  glow: number
  audience: string
  headline: string
  sub: string
  bullets: string[]
  accentPrice?: string
}) {
  return (
    <GlowCard glow={glow} minHeight={0}>
      <div className="relative z-[2] flex h-full flex-col p-6">
        <p className="text-gradient-brand text-xs font-semibold uppercase tracking-[0.08em]">
          {audience}
        </p>
        <div className="mt-4 rounded-xl bg-white p-5 shadow-[0_6px_20px_-8px_rgba(27,16,82,0.18)]">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-3xl font-semibold tracking-tight text-ink">
              {headline}
            </span>
            {accentPrice && (
              <span className="font-mono text-sm text-ink-3">{accentPrice}</span>
            )}
          </div>
          <p className="mt-3 leading-relaxed text-ink-2">{sub}</p>
          <ul className="mt-5 space-y-2.5">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 text-sm text-ink-2">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlowCard>
  )
}

/* ------------------------------------------------------------------ *
 * Section 7 — Final CTA band
 * ------------------------------------------------------------------ */

function FinalCTA() {
  return (
    <section className="bg-deep">
      <Container className="py-20 text-center lg:py-28">
        <Reveal className="mx-auto max-w-2xl">
          <img
            src="/brand/logo-horizontal-white.svg"
            alt="Influencees"
            className="mx-auto mb-8 h-7 w-auto"
          />
          <div className="mb-6 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider text-paper/60">
            <Search className="h-4 w-4" aria-hidden="true" />
            The trust layer for Singapore's creator economy
          </div>
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Do your homework.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-paper/70">
            Verified data and campaign tools for brands, a fairer deal for
            creators. Pick your side.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/brands" variant="primary" size="lg">
              Start as a brand
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Link
              to="/creators"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border border-white/20 px-6 text-base font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              Join as a creator
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <>
      <Hero />
      <TwoPath />
      <CoreFeatures />
      <ProductTour />
      <AiKyoSection />
      <PlatformToday />
      <FeaturedStrip />
      <PricingPreview />
      <FinalCTA />
    </>
  )
}
