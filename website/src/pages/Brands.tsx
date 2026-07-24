import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import Container from '../components/Container'
import { SectionHeader, GlowCard } from '../components/Glow'
import Button from '../components/Button'
import StatusChip from '../components/StatusChip'
import Stat from '../components/Stat'
import Avatar from '../components/Avatar'
import AiKyoAvatar from '../components/AiKyoAvatar'
import FAQItem from '../components/FAQItem'
import Reveal from '../motion/Reveal'
import ProductFrame from '../motion/ProductFrame'
import CountUp, { compact, thousands } from '../motion/CountUp'
import { creators } from '../data/creators'

const cr = (handle: string) => creators.find((c) => c.handle === handle)!

/* ------------------------------------------------------------------ *
 * Section 1 — Hero
 * ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="border-b border-line">
      <Container className="grid gap-14 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div>
          <p className="animate-rise text-gradient-brand mb-5 text-xs font-semibold uppercase tracking-[0.08em]">
            For brands
          </p>
          <h1
            className="animate-rise font-display text-[2.75rem] font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-5xl"
            style={{ animationDelay: '80ms' }}
          >
            Find the right Singapore creators.{' '}
            <span className="text-gradient-brand">Trust the data</span>.
          </h1>
          <p
            className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-ink-2"
            style={{ animationDelay: '160ms' }}
          >
            Engagement tracked from the source, not self-reported, not
            third-party aggregated. Ai-kyo helps you find, compare and brief
            creators, and an end-to-end workspace takes each campaign from
            shortlist to client-ready report.
          </p>
          <div
            className="animate-rise mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '240ms' }}
          >
            <Button to="/pricing" variant="primary" size="lg">
              See plans
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to="/directory" variant="secondary" size="lg">
              Browse the directory
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <p
            className="animate-rise mt-6 font-mono text-xs text-ink-3"
            style={{ animationDelay: '320ms' }}
          >
            Plans from $49/mo · Founding members get 3 months free
          </p>
        </div>

        <div className="animate-rise" style={{ animationDelay: '400ms' }}>
          <HeroVisual />
        </div>
      </Container>
    </section>
  )
}

/** Discovery-panel vignette: filters + matched creator rows. */
function HeroVisual() {
  const matches: { slug: string; er: number; rate: number }[] = [
    { slug: 'janae-chua', er: 6.2, rate: 1200 },
    { slug: 'amy-lien', er: 6.6, rate: 980 },
    { slug: 'brooke', er: 5.4, rate: 1350 },
  ]
  return (
    <ProductFrame url="influencees.com/discover" bodyClassName="p-5">
      <div className="flex items-center justify-between gap-2 border-b border-line pb-4">
        <span className="min-w-0 truncate text-sm font-medium text-ink">
          Discover creators
        </span>
        <span className="shrink-0 font-mono text-xs text-ink-3">
          Metrics are estimates
        </span>
      </div>

      <div className="flex flex-wrap gap-2 py-4">
        {['Lifestyle', 'IG · TikTok', 'ER 5%+', '< $1,500'].map((f) => (
          <span
            key={f}
            className="rounded-md border border-line bg-paper px-2.5 py-1 font-mono text-[11px] text-ink-2"
          >
            {f}
          </span>
        ))}
      </div>

      <div className="space-y-2.5 border-t border-line pt-4">
        {matches.map((m) => {
          const c = cr(m.slug)
          return (
            <div
              key={m.slug}
              className="flex items-center justify-between gap-3 rounded-md border border-line bg-paper px-3 py-2"
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
              <span className="tabular flex shrink-0 items-center gap-3 font-mono text-xs text-ink-2">
                <span>
                  <CountUp value={m.er} decimals={1} suffix="% ER" />
                </span>
                <span className="text-ink">
                  <CountUp value={m.rate} prefix="$" format={thousands} />
                </span>
              </span>
            </div>
          )
        })}
      </div>

      <p className="mt-4 font-mono text-[11px] text-ink-3">
        Tracked from the source · refreshed 12 Jul
      </p>
    </ProductFrame>
  )
}

/* ------------------------------------------------------------------ *
 * Section 2 — Trust pillars
 * ------------------------------------------------------------------ */

type Pillar = {
  title: string
  body: string
}

const PILLARS: Pillar[] = [
  {
    title: 'Data tracked from the source',
    body: 'Engagement pulled from public Instagram and TikTok profiles and refreshed regularly. No third-party aggregators, no self-reported numbers to take on faith.',
  },
  {
    title: 'Works with your team',
    body: 'Run it alongside your agency or in-house team. Influencees is the workspace and the data layer, so it doesn’t replace the people who run your campaigns.',
  },
  {
    title: 'Singapore-focused, any niche',
    body: 'Every creator in the index is SG-based, across food, tech, fashion, fitness and more, ranked by real engagement rather than follower count alone.',
  },
]

function Pillars() {
  return (
    <section className="border-b border-line bg-surface">
      <Container className="py-20 lg:py-24">
        <div className="grid gap-10 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
              <div className="border-t-2 border-accent pt-4">
                <span className="font-mono text-sm text-ink-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 font-medium text-ink">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-2">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Section 3 — What you get (4 numbered rows)
 * ------------------------------------------------------------------ */

function WhatYouGet() {
  const cards: {
    label: string
    chip: 'LIVE' | 'BETA' | 'SOON'
    glow: number
    visual: ReactNode
  }[] = [
    { label: 'Ai-kyo campaign assistant', chip: 'BETA', glow: 0, visual: <ChatVisual /> },
    { label: 'Source-tracked data', chip: 'LIVE', glow: 1, visual: <DataVisual /> },
    { label: 'End-to-end workspace', chip: 'LIVE', glow: 2, visual: <PipelineVisual /> },
    { label: 'Add off-platform creators', chip: 'LIVE', glow: 0, visual: <OffPlatformVisual /> },
  ]
  return (
    <Container className="py-20 lg:py-28">
      <Reveal>
        <SectionHeader
          eyebrow="What you get"
          title="Everything a campaign needs, in one workspace."
          subtitle="Verified data, an assistant that works from it, and the tools to run the campaign end to end."
        />
      </Reveal>
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 90} className="min-w-0 h-full">
            <GlowCard
              glow={c.glow}
              minHeight={0}
              label={c.label}
              chip={<StatusChip status={c.chip} />}
            >
              <div className="relative z-[2] p-5">{c.visual}</div>
            </GlowCard>
          </Reveal>
        ))}
      </div>
    </Container>
  )
}

/** Ai-kyo chat vignette (find / compare / brief / UTM from one chat). */
function ChatVisual() {
  return (
    <ProductFrame url="influencees.com/ai-kyo" tilt bodyClassName="p-0">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <AiKyoAvatar size={24} />
        <span className="font-mono text-sm font-medium text-ink">Ai-kyo</span>
        <StatusChip status="BETA" />
      </div>
      <div className="space-y-3 px-4 py-4 text-sm">
        <div className="ml-auto max-w-[82%] rounded-2xl rounded-br-sm bg-ink px-3 py-2 text-white">
          Compare @janaechua and @amylien, then draft a brief for a hawker
          series.
        </div>
        <div className="max-w-[92%] rounded-2xl rounded-bl-sm border border-line bg-paper px-3 py-2 text-ink">
          @amylien leads on engagement (6.6% vs 6.2%). Draft brief ready, 3
          deliverables, UTM links attached.
          <div className="mt-2 space-y-1 font-mono text-xs text-ink-2">
            <div>brief-hawker-series.pdf</div>
            <div>utm: ?utm_campaign=hawker_q3</div>
          </div>
        </div>
        <div className="flex w-fit items-center gap-1.5 rounded-md rounded-bl-sm border border-line bg-paper px-3 py-2.5">
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

/** Source-tracked data vignette: a metric readout. */
function DataVisual() {
  return (
    <ProductFrame url="influencees.com/creators/janaechua" tilt bodyClassName="p-5">
      <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={cr('janae-chua').avatar} name="Janae Chua" size={40} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-ink">Janae Chua</div>
            <div className="font-mono text-xs text-ink-3">@janaechua</div>
          </div>
        </div>
        <StatusChip status="LIVE" />
      </div>
      <div className="grid grid-cols-3 gap-4 py-5">
        <Stat value={<CountUp value={128000} format={compact} />} label="Followers" />
        <Stat value={<CountUp value={6.4} decimals={1} suffix="%" />} label="Engagement" />
        <Stat value={<CountUp value={21300} format={compact} />} label="Avg. views" />
      </div>
      <div className="space-y-2.5 border-t border-line pt-4">
        <MetricRow label="Followers, IG" value={82400} />
        <MetricRow label="Followers, TikTok" value={45600} />
        <MetricRow label="Suspicious follower ratio" value={1.9} percent ok />
      </div>
      <p className="mt-4 font-mono text-[11px] text-ink-3">
        Tracked from the source · refreshed 12 Jul
      </p>
    </ProductFrame>
  )
}

function MetricRow({
  label,
  value,
  ok,
  percent,
}: {
  label: string
  value: number
  ok?: boolean
  percent?: boolean
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-2">{label}</span>
      <span className={`tabular font-mono ${ok ? 'text-ok' : 'text-ink'}`}>
        {percent ? (
          <CountUp value={value} decimals={1} suffix="%" />
        ) : (
          <CountUp value={value} format={thousands} />
        )}
      </span>
    </div>
  )
}

/** Campaign pipeline vignette. */
function PipelineVisual() {
  const cols: { stage: string; cards: string[] }[] = [
    { stage: 'Shortlisted', cards: ['janae-chua', 'amy-lien'] },
    { stage: 'Briefed', cards: ['riona'] },
    { stage: 'Live', cards: ['brooke'] },
  ]
  return (
    <ProductFrame url="influencees.com/campaigns" tilt bodyClassName="p-4">
      <div className="grid grid-cols-3 gap-3">
        {cols.map((col) => (
          <div key={col.stage} className="min-w-0">
            <div className="mb-2 flex items-center justify-between gap-1">
              <span className="min-w-0 truncate font-mono text-[11px] uppercase tracking-wider text-ink-3">
                {col.stage}
              </span>
              <span className="shrink-0 font-mono text-[11px] text-ink-3">
                {col.cards.length}
              </span>
            </div>
            <div className="space-y-2">
              {col.cards.map((slug) => {
                const c = cr(slug)
                return (
                  <div
                    key={slug}
                    className="flex items-center gap-1.5 overflow-hidden rounded-md border border-line bg-paper px-2 py-1.5"
                  >
                    <Avatar src={c.avatar} name={c.name} size={18} />
                    <span
                      className="min-w-0 truncate font-mono text-[11px] text-ink"
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
      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-xs text-ink-2">
        <span>Budget used</span>
        <span className="tabular font-mono text-ink">
          <CountUp value={4200} prefix="$" format={thousands} /> / $6,000
        </span>
      </div>
    </ProductFrame>
  )
}

/** Off-platform creator vignette. */
function OffPlatformVisual() {
  return (
    <ProductFrame url="app.influencees.com/campaigns/add" tilt bodyClassName="p-5">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <span className="text-sm font-medium text-ink">Add creator</span>
        <span className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-ink-3">
          MANUAL
        </span>
      </div>
      <div className="space-y-2.5 py-4">
        <FieldRow label="Name" value="Elena Koh" />
        <FieldRow label="Handle" value="@elenakoh" />
        <FieldRow label="Est. rate / post" value="$1,100" />
      </div>
      <div className="flex items-center gap-2 border-t border-line pt-3 text-xs text-ink-2">
        <Check className="h-4 w-4 text-ok" aria-hidden="true" />
        <span>Added to “Hawker Series Q3”</span>
      </div>
    </ProductFrame>
  )
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-line bg-paper px-3 py-2 text-sm">
      <span className="text-ink-3">{label}</span>
      <span className="tabular font-mono text-ink">{value}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Real screenshots — the live brand experience
 * ------------------------------------------------------------------ */

function RealScreens() {
  return (
    <section className="border-y border-line bg-surface">
      <Container className="py-20 lg:py-24">
        <Reveal>
          <SectionHeader
            eyebrow="Product proof"
            title="From a shortlist to a report you can send."
            subtitle="Real screens from the live Influencees workspace, framed in the redesigned experience."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <ProductFrame
              url="app.influencees.com/discovery"
              tilt
              bodyClassName="bg-paper p-0"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/shots/live-discovery.png"
                  alt="Live Influencees creator evaluation showing content examples, collaboration score and suitability signals"
                  loading="lazy"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </ProductFrame>
            <div className="mt-4 max-w-lg">
              <h3 className="font-medium text-ink">
                Evaluate the fit, not only the following
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                Review recent content alongside commercial, diligence and
                broadcasting signals before adding a creator to the campaign.
              </p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <ProductFrame
              url="app.influencees.com/reports"
              tilt
              bodyClassName="bg-paper p-0"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src="/shots/live-campaign-alt.png"
                  alt="Live Influencees client-ready campaign report showing total impressions, reach and engagement rate"
                  loading="lazy"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </ProductFrame>
            <div className="mt-4 max-w-lg">
              <h3 className="font-medium text-ink">
                Finish with a report clients can read
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                Turn campaign results into a clear, downloadable summary
                without rebuilding the story in a separate deck.
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Section 4 — How it works
 * ------------------------------------------------------------------ */

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: '01',
    title: 'Discover with Trust Check',
    body: 'Filter SG creators by niche, platform and real engagement, then run Trust Check to screen for scam signals and AI-generated content before you reach out.',
  },
  {
    n: '02',
    title: 'Build the campaign',
    body: 'Set a budget, compare your shortlist side by side and have Ai-kyo draft the brief. Add off-platform creators where you need to.',
  },
  {
    n: '03',
    title: 'Track & report',
    body: 'Move creators through the pipeline, track UTM links and export a client-ready report when the campaign wraps.',
  },
]

function HowItWorks() {
  return (
    <section className="border-y border-line bg-surface">
      <Container className="py-20 lg:py-24">
        <Reveal>
          <SectionHeader eyebrow="How it works" title="Three steps, one tab." />
        </Reveal>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90} className="h-full">
              <div className="h-full rounded-lg border border-line bg-paper p-6">
                <span className="font-mono text-sm text-ink-3">{s.n}</span>
                <h3 className="mt-3 font-medium text-ink">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-2">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Section 5 — Brand Brief Builder callout band
 * ------------------------------------------------------------------ */

function BriefBuilderBand() {
  return (
    <Container className="py-20 lg:py-24">
      <Reveal className="flex flex-col gap-6 rounded-lg border border-line bg-surface p-8 md:flex-row md:items-center md:justify-between lg:p-10">
        <div className="max-w-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-gradient-brand font-mono text-xs font-semibold uppercase tracking-[0.08em]">
              Brief Builder
            </span>
            <StatusChip status="BETA" />
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink">
            Brand Brief Builder
          </h3>
          <p className="mt-4 leading-relaxed text-ink-2">
            Generate a professional creator brief in seconds. Deliverables,
            timelines, usage rights and tone, ready to send. Edit it, or hand
            it to Ai-kyo to refine.
          </p>
        </div>
        <Button to="/pricing" variant="secondary" size="md">
          See plans
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </Reveal>
    </Container>
  )
}

/* ------------------------------------------------------------------ *
 * Section 6 — FAQ
 * ------------------------------------------------------------------ */

function FAQ() {
  return (
    <section className="border-t border-line bg-surface">
      <Container className="py-20 lg:py-24">
        <Reveal>
          <SectionHeader eyebrow="FAQ" title="Questions brands ask." />
        </Reveal>
        <Reveal className="mx-auto mt-10 max-w-3xl">
          <FAQItem question="What is Ai-kyo?" defaultOpen>
            Ai-kyo is the campaign assistant. From one chat it can find and
            compare creators, draft a brief and generate UTM links, always
            working from the same verified data you see in the workspace, so
            it doesn’t invent follower counts or engagement numbers.
          </FAQItem>
          <FAQItem question="Does it fit our existing workflow?">
            Yes. Influencees runs alongside your agency or in-house team as the
            data layer and the workspace. You can also add off-platform
            creators you’re already working with, so every creator on a
            campaign sits in one view.
          </FAQItem>
          <FAQItem question="What is Trust Check?">
            Trust Check (BETA) scans a creator’s posts for scam signals and
            AI-generated content flags before you reach out, built for
            Singapore’s online trust landscape. It sits inside discovery, so
            you can screen a shortlist without leaving the workspace.
          </FAQItem>
          <FAQItem question="Can I add creators who aren’t in the index?">
            Yes. Add off-platform creators manually with their handle and rate,
            and manage them in the same campaign workspace as everyone else.
          </FAQItem>
          <FAQItem question="What’s in the campaign workspace?">
            Shortlisting, budgets, side-by-side compare, briefs, UTM links and
            a client-ready report. The full path from first pick to final wrap
            in one place, without exporting to a spreadsheet in between.
          </FAQItem>
          <FAQItem question="How much does it cost?">
            Brand plans start at $49/mo (Starter), $119/mo (Growth) and
            $249/mo (Brand Pro), with a custom Enterprise tier. Founding members
            get 3 months free. See{' '}
            <Link to="/pricing" className="text-accent hover:text-accent-ink">
              full pricing
            </Link>{' '}
            for what’s in each plan.
          </FAQItem>
        </Reveal>
      </Container>
    </section>
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
          <p className="mb-6 font-mono text-xs uppercase tracking-wider text-paper/60">
            For brands
          </p>
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Brief with confidence.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-paper/70">
            Verified Singapore creator data and the tools to run the campaign
            end to end. Plans from $49/mo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/pricing" variant="primary" size="lg">
              See plans
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Link
              to="/directory"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border border-white/20 px-6 text-base font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              Browse the directory
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export default function Brands() {
  return (
    <>
      <Hero />
      <Pillars />
      <WhatYouGet />
      <RealScreens />
      <HowItWorks />
      <BriefBuilderBand />
      <FAQ />
      <FinalCTA />
    </>
  )
}
