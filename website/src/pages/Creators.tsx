import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, AlertTriangle } from 'lucide-react'
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
            For creators
          </p>
          <h1
            className="animate-rise font-display text-[2.75rem] font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-5xl"
            style={{ animationDelay: '80ms' }}
          >
            Know your worth.{' '}
            <span className="text-gradient-brand">Land better deals</span>.
          </h1>
          <p
            className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-ink-2"
            style={{ animationDelay: '160ms' }}
          >
            Verified stats synced from your own IG and TikTok, an SGD rate card
            built from real numbers, a brief analyzer that flags low-ball
            offers, and Ai-kyo to help you pitch. Everything you need to stop
            guessing what you’re owed.
          </p>
          <div
            className="animate-rise mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '240ms' }}
          >
            <Button to="/join" variant="primary" size="lg">
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button to="/pricing" variant="secondary" size="lg">
              See creator pricing
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <p
            className="animate-rise mt-6 font-mono text-xs text-ink-3"
            style={{ animationDelay: '320ms' }}
          >
            Free to start · Creator Pro $16/mo
          </p>
        </div>

        <div className="animate-rise" style={{ animationDelay: '400ms' }}>
          <HeroVisual />
        </div>
      </Container>
    </section>
  )
}

/** Profile-card vignette: verified stats + a rate range. */
function HeroVisual() {
  return (
    <ProductFrame url="app.influencees.com/me/stats" bodyClassName="p-5">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <Avatar src={cr('janae-chua').avatar} name="Janae Chua" size={40} />
          <div>
            <div className="text-sm font-medium text-ink">Janae Chua</div>
            <div className="font-mono text-xs text-ink-3">@janaechua</div>
          </div>
        </div>
        <StatusChip status="LIVE" />
      </div>

      <div className="grid grid-cols-3 gap-4 py-5">
        <Stat value={<CountUp value={128000} format={compact} />} label="Followers" />
        <Stat value={<CountUp value={6.4} decimals={1} suffix="%" />} label="Engagement" />
        <Stat value={<CountUp value={21300} format={compact} />} label="Avg. reach" />
      </div>

      <div className="rounded-md border border-line bg-paper px-4 py-3">
        <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
          Suggested rate · IG reel
        </div>
        <div className="tabular mt-1 font-mono text-lg font-medium text-ink">
          <CountUp value={850} prefix="$" format={thousands} />
          <span className="text-ink-3">-</span>
          <CountUp value={1200} prefix="$" format={thousands} />
        </div>
      </div>

      <p className="mt-4 font-mono text-[11px] text-ink-3">
        Synced from IG on 12 Jul
      </p>
    </ProductFrame>
  )
}

/* ------------------------------------------------------------------ *
 * Section 2 — Pillars
 * ------------------------------------------------------------------ */

type Pillar = {
  title: string
  body: string
}

const PILLARS: Pillar[] = [
  {
    title: 'Verified, not self-reported',
    body: 'Sync your Instagram and TikTok and your stats update from your real public profiles, the same numbers brands see, so there’s nothing to talk yourself up or down on.',
  },
  {
    title: 'Built so you never get underpaid',
    body: 'An SGD rate card from real market data, a brief analyzer that flags low-ball offers and usage-rights traps, and benchmarks that show where you sit against your niche.',
  },
  {
    title: 'One workspace, end to end',
    body: 'Profile, rate card, brand CRM, pitch templates and your Brand Passport in one place, from first DM to signed deal, without stitching together five apps.',
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
 * Section 3 — The toolkit (4 numbered rows)
 * ------------------------------------------------------------------ */

function Toolkit() {
  const cards: {
    label: string
    chip: 'LIVE' | 'BETA' | 'SOON'
    glow: number
    visual: ReactNode
  }[] = [
    { label: 'Verified stats', chip: 'LIVE', glow: 0, visual: <StatsVisual /> },
    { label: 'SGD rate card', chip: 'LIVE', glow: 1, visual: <RateCardVisual /> },
    { label: 'Deal toolkit', chip: 'LIVE', glow: 2, visual: <BriefAnalyzerVisual /> },
    { label: 'Ai-kyo content co-pilot', chip: 'BETA', glow: 0, visual: <ChatVisual /> },
  ]
  return (
    <Container className="py-20 lg:py-28">
      <Reveal>
        <SectionHeader
          eyebrow="The toolkit"
          title="Everything you need to get paid what you’re worth."
          subtitle="Verified numbers, a rate card built from them, and the tools to close deals on your terms."
        />
      </Reveal>
      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {cards.map((c, i) => (
          <Reveal key={c.label} delay={i * 90} className="h-full">
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

/** Mini stats-card vignette. */
function StatsVisual() {
  return (
    <ProductFrame url="app.influencees.com/me/stats" tilt bodyClassName="p-5">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <span className="text-sm font-medium text-ink">Your live stats</span>
        <StatusChip status="LIVE" />
      </div>
      <div className="grid grid-cols-3 gap-4 py-5">
        <Stat value={<CountUp value={128000} format={compact} />} label="Followers" />
        <Stat value={<CountUp value={6.4} decimals={1} suffix="%" />} label="Engagement" />
        <Stat value={<CountUp value={21300} format={compact} />} label="Avg. reach" />
      </div>
      <div className="space-y-2.5 border-t border-line pt-4">
        <SplitRow label="Instagram" value={82400} />
        <SplitRow label="TikTok" value={45600} />
      </div>
      <p className="mt-4 font-mono text-[11px] text-ink-3">
        Synced from IG on 12 Jul
      </p>
    </ProductFrame>
  )
}

function SplitRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-ink-2">{label}</span>
      <span className="tabular font-mono text-ink">
        <CountUp value={value} format={thousands} />
      </span>
    </div>
  )
}

/** SGD rate range card vignette. */
function RateCardVisual() {
  const rows = [
    { fmt: 'IG reel', range: '$850-$1,200' },
    { fmt: 'IG story (3-frame)', range: '$400-$600' },
    { fmt: 'TikTok video', range: '$900-$1,400' },
  ]
  return (
    <ProductFrame url="app.influencees.com/me/rate-card" tilt bodyClassName="p-5">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <span className="text-sm font-medium text-ink">Your rate card</span>
        <span className="font-mono text-xs text-ink-3">SGD</span>
      </div>
      <div className="divide-y divide-line">
        {rows.map((r) => (
          <div
            key={r.fmt}
            className="flex items-center justify-between py-3 text-sm"
          >
            <span className="text-ink-2">{r.fmt}</span>
            <span className="tabular font-mono font-medium text-ink">
              {r.range}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 border-t border-line pt-3 font-mono text-[11px] text-ink-3">
        Built from market data · food & dining niche
      </p>
    </ProductFrame>
  )
}

/** Brief Analyzer vignette flagging a low-ball offer. */
function BriefAnalyzerVisual() {
  return (
    <ProductFrame url="app.influencees.com/me/brief-analyzer" tilt bodyClassName="p-5">
      <div className="mb-4 flex items-center gap-2 border-b border-line pb-3">
        <span className="text-sm font-medium text-ink">Brief Analyzer</span>
        <StatusChip status="LIVE" />
      </div>
      <div className="space-y-2.5">
        <div className="flex items-start gap-2 rounded-md border border-warn/30 bg-warn/8 px-3 py-2.5">
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0 text-warn"
            aria-hidden="true"
          />
          <div className="text-sm text-ink">
            Offer is $350, below your $850 floor for an IG reel.
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-md border border-warn/30 bg-warn/8 px-3 py-2.5">
          <AlertTriangle
            className="mt-0.5 h-4 w-4 shrink-0 text-warn"
            aria-hidden="true"
          />
          <div className="text-sm text-ink">
            Perpetual usage rights requested, no extra fee.
          </div>
        </div>
        <div className="flex items-center gap-2 px-1 pt-1 font-mono text-[11px] text-ink-3">
          <span>2 flags · counter-offer suggested</span>
        </div>
      </div>
    </ProductFrame>
  )
}

/** Ai-kyo content co-pilot vignette. */
function ChatVisual() {
  return (
    <ProductFrame url="influencees.com/ai-kyo" tilt bodyClassName="p-0">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <AiKyoAvatar size={24} />
        <span className="font-mono text-sm font-medium text-ink">Ai-kyo</span>
        <StatusChip status="BETA" />
      </div>
      <div className="space-y-3 px-4 py-4 text-sm">
        <div className="ml-auto max-w-[82%] rounded-md rounded-br-sm bg-ink px-3 py-2 text-white">
          Draft a reply countering the $350 offer.
        </div>
        <div className="max-w-[92%] rounded-md rounded-bl-sm border border-line bg-paper px-3 py-2 text-ink">
          Here’s a polite counter at $900, noting your 6.4% engagement and the
          usage-rights terms:
          <div className="mt-2 font-mono text-xs text-ink-2">
            “Thanks for the brief. For a reel with perpetual rights, my rate is
            $900…”
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

/* ------------------------------------------------------------------ *
 * Section 4 — How it works
 * ------------------------------------------------------------------ */

const STEPS: { n: string; title: string; body: string }[] = [
  {
    n: '01',
    title: 'Build your profile',
    body: 'Sync your IG and TikTok and you’re set up in about 3 minutes. Your stats come straight from your public profiles, nothing to fill in by hand.',
  },
  {
    n: '02',
    title: 'Get equipped',
    body: 'Your rate card, brief analyzer, brand CRM and pitch templates are ready to use. Know your numbers and your worth before the next DM lands.',
  },
  {
    n: '03',
    title: 'Get discovered',
    body: 'Show up in the SG creator index and share your Brand Passport, one link, private until you send it, so brands can find and vet you fast.',
  },
]

function HowItWorks() {
  return (
    <section className="border-y border-line bg-surface">
      <Container className="py-20 lg:py-24">
        <Reveal>
          <SectionHeader eyebrow="How it works" title="Set up in about 3 minutes." />
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
 * Section 5 — Free vs Pro comparison
 * ------------------------------------------------------------------ */

const STARTER = [
  'Community: rate & review creators',
  'Public creator profile',
  'Badges & XP',
  'Creator leaderboard',
]

const PRO = [
  'Live stats dashboard',
  'SGD rate card + benchmarks',
  'Brief Analyzer',
  'Brand CRM',
  'AI pitch templates',
  'Media kit + PDF export',
  'Content calendar',
  'ER benchmarking',
]

function Plans() {
  return (
    <Container className="py-20 lg:py-24">
      <Reveal>
        <SectionHeader
          eyebrow="Plans"
          title="Start free. Upgrade when it pays for itself."
          subtitle="Starter is free forever. Creator Pro unlocks the full toolkit for $16/mo."
        />
      </Reveal>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Reveal className="h-full">
          <PlanCard
            glow={0}
            name="Starter"
            price="Free"
            note="forever"
            features={STARTER}
          />
        </Reveal>
        <Reveal delay={90} className="h-full">
          <PlanCard
            glow={2}
            name="Creator Pro"
            price="$16"
            note="/mo"
            features={PRO}
            featured
          />
        </Reveal>
      </div>
      <div className="mt-8 flex justify-center">
        <Button to="/pricing" variant="secondary" size="md">
          See creator pricing
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </Container>
  )
}

function PlanCard({
  glow,
  name,
  price,
  note,
  features,
  featured,
}: {
  glow: number
  name: string
  price: string
  note: string
  features: string[]
  featured?: boolean
}) {
  return (
    <GlowCard glow={glow} minHeight={0}>
      <div className="relative z-[2] flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <p className="text-gradient-brand text-xs font-semibold uppercase tracking-[0.08em]">
            {name}
          </p>
          {featured && (
            <span className="rounded border border-line bg-white/70 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-ink-3">
              8 FEATURES
            </span>
          )}
        </div>
        <div className="mt-4 rounded-xl bg-white p-5 shadow-[0_6px_20px_-8px_rgba(27,16,82,0.18)]">
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-3xl font-semibold tracking-tight text-ink">
              {price}
            </span>
            <span className="font-mono text-sm text-ink-3">{note}</span>
          </div>
          <ul className="mt-5 space-y-2.5">
            {features.map((f) => (
              <li key={f} className="flex gap-3 text-sm text-ink-2">
                <Check
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                  aria-hidden="true"
                />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlowCard>
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
          <SectionHeader eyebrow="FAQ" title="Questions creators ask." />
        </Reveal>
        <Reveal className="mx-auto mt-10 max-w-3xl">
          <FAQItem question="Is it free?" defaultOpen>
            The Starter plan is free forever: a public profile, the community,
            badges and the leaderboard. Creator Pro adds the full toolkit
            (live stats, rate card, Brief Analyzer and more) for $16/mo.
          </FAQItem>
          <FAQItem question="How do my stats sync?">
            Connect your Instagram and TikTok and your followers, engagement and
            reach update from your public profiles. Nothing is self-reported, so
            brands see the same verified numbers you do.
          </FAQItem>
          <FAQItem question="What is the rate card?">
            A suggested rate range in SGD for each content format, built from
            real market data and your own numbers. It gives you a floor to
            negotiate from before a brand names a figure.
          </FAQItem>
          <FAQItem question="What is Ai-kyo?">
            Ai-kyo is your content co-pilot (BETA). It can draft a pitch, tighten
            a caption or plan a content angle, working from your stats and your
            niche, so it sounds like you, not a template.
          </FAQItem>
          <FAQItem question="What is a Brand Passport?">
            One shareable link that packages your verified stats, rate card and
            media kit. It stays private until you send it, so you decide exactly
            which brands see your numbers.
          </FAQItem>
          <FAQItem question="How do I get started?">
            Create a profile and sync your accounts, about 3 minutes. Some tiers
            are invite-based; if you have a code, you can{' '}
            <Link to="/join" className="text-accent hover:text-accent-ink">
              apply to join
            </Link>
            .
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
            For creators
          </p>
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Your work deserves to be seen.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-paper/70">
            Verified stats, a rate card built from real numbers, and the tools
            to land better deals. Free to start.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/join" variant="primary" size="lg">
              Get started
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Link
              to="/pricing"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border border-white/20 px-6 text-base font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              See creator pricing
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export default function Creators() {
  return (
    <>
      <Hero />
      <Pillars />
      <Toolkit />
      <HowItWorks />
      <Plans />
      <FAQ />
      <FinalCTA />
    </>
  )
}
