import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Check, Link2, Minus, Search, X } from 'lucide-react'
import Container from '../components/Container'
import Section from '../components/Section'
import { SectionHeader, GlowCard } from '../components/Glow'
import Button from '../components/Button'
import StatusChip from '../components/StatusChip'
import ProductFrame from '../motion/ProductFrame'
import Reveal from '../motion/Reveal'
import CountUp from '../motion/CountUp'
import { trustSignals, sampleReport } from '../data/trust'
import type { TrustSignal, TrustReport } from '../data/trust'

const REPORT_ID = 'sample-report'

/* ------------------------------------------------------------------ *
 * Section 1 — Hero + inert input
 * ------------------------------------------------------------------ */

function Hero() {
  const [url, setUrl] = useState('')

  function scrollToReport() {
    document
      .getElementById(REPORT_ID)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="border-b border-line">
      <Container className="py-16 lg:py-20">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-gradient-brand text-xs font-semibold uppercase tracking-[0.08em]">
              Trust Check
            </span>
            <StatusChip status="BETA" />
          </div>
          <h1 className="font-display text-[2.75rem] font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-5xl">
            Is this post real?
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
            Paste a TikTok or Instagram link and get an instant trust report:
            scam signals, AI-content flags, and suspicious patterns, laid out in
            plain English.
          </p>

          <form
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              scrollToReport()
            }}
          >
            <div className="flex flex-1 items-center gap-2.5 rounded-md border border-line bg-surface px-3.5 focus-within:border-ink-3">
              <Link2
                className="h-4 w-4 shrink-0 text-ink-3"
                aria-hidden="true"
              />
              <input
                type="text"
                inputMode="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@handle/video/..."
                aria-label="Post URL to check"
                className="h-11 w-full bg-transparent font-mono text-sm text-ink outline-none placeholder:text-ink-3"
              />
            </div>
            <Button type="submit" variant="primary" size="lg">
              Run check
              <Search className="h-4 w-4" aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-ink-3">
            <span className="inline-flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-ok" aria-hidden="true" />
              TikTok
            </span>
            <span className="inline-flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-ok" aria-hidden="true" />
              Instagram
            </span>
            <span>Sample demonstration below</span>
          </p>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Section 2 — What we analyse
 * ------------------------------------------------------------------ */

function SignalCard({ signal, glow }: { signal: TrustSignal; glow: number }) {
  const soon = signal.status === 'soon'
  return (
    <GlowCard
      glow={glow}
      minHeight={0}
      label={signal.name}
      chip={<StatusChip status={soon ? 'SOON' : 'LIVE'} />}
      className={soon ? 'opacity-70' : ''}
    >
      <div className="relative z-[2] px-6 pt-6">
        <p className="text-sm leading-relaxed text-ink-2">
          {signal.description}
        </p>
      </div>
    </GlowCard>
  )
}

function WhatWeAnalyse() {
  const live = trustSignals.filter((s) => s.status === 'live')
  const soon = trustSignals.filter((s) => s.status === 'soon')

  return (
    <Container className="py-16 lg:py-20">
      <Reveal>
        <SectionHeader
          eyebrow="What we analyse"
          title="Six signals live, two on the way."
          subtitle="Each check looks at one dimension of a post, shown separately so you can see what the verdict is built from."
        />
      </Reveal>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {live.map((s, i) => (
          <Reveal key={s.name} delay={i * 70} className="h-full">
            <SignalCard signal={s} glow={i % 3} />
          </Reveal>
        ))}
      </div>
      <div className="mt-8">
        <p className="mb-4 text-center font-mono text-xs uppercase tracking-wider text-ink-3">
          In development
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {soon.map((s, i) => (
            <SignalCard key={s.name} signal={s} glow={i % 3} />
          ))}
        </div>
      </div>
    </Container>
  )
}

/* ------------------------------------------------------------------ *
 * Section 3 — Sample report
 * ------------------------------------------------------------------ */

const RISK_META: Record<
  TrustReport['riskLevel'],
  { label: string; wrap: string; bar: string; text: string }
> = {
  high: {
    label: 'High risk',
    wrap: 'border-accent/40 bg-accent/5',
    bar: 'bg-accent',
    text: 'text-accent',
  },
  medium: {
    label: 'Medium risk',
    wrap: 'border-warn/40 bg-warn/5',
    bar: 'bg-warn',
    text: 'text-warn',
  },
  low: {
    label: 'Low risk',
    wrap: 'border-ok/40 bg-ok/5',
    bar: 'bg-ok',
    text: 'text-ok',
  },
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Confidence bar that grows from 0 to `score`% the first time it is scrolled
 *  into view, with an optional stagger. */
function ConfidenceBar({ score, delay = 0 }: { score: number; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) {
      setWidth(score)
      return
    }
    let timer = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect()
          timer = window.setTimeout(() => setWidth(score), delay)
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      window.clearTimeout(timer)
    }
  }, [score, delay])

  return (
    <div
      ref={ref}
      className="h-1.5 w-full overflow-hidden rounded-full bg-line"
      role="img"
      aria-label={`Confidence ${score} of 100`}
    >
      <div
        className="bar-grow h-full rounded-full bg-ink"
        style={{ width: `${width}%` }}
      />
    </div>
  )
}

function SampleReport() {
  const risk = RISK_META[sampleReport.riskLevel]

  return (
    <section id={REPORT_ID} className="scroll-mt-24 border-y border-line bg-surface">
      <Container className="py-16 lg:py-20">
        <Reveal>
          <SectionHeader
            eyebrow="Sample report"
            title="A worked example."
            subtitle="Demonstration data. This is how a Trust Check report reads once a post is scanned."
          />
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-3xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-ink-3">
            The live Trust Check today
          </p>
          <ProductFrame url="influencees.com/check" tilt bodyClassName="p-0">
            <div className="aspect-[16/11] w-full overflow-hidden">
              <img
                src="/shots/check.png"
                alt="The live Trust Check page on influencees.com"
                loading="lazy"
                className="w-full object-cover object-top"
              />
            </div>
          </ProductFrame>
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-lg border border-line bg-paper">
          {/* Checked URL */}
          <div className="border-b border-line px-6 py-4">
            <div className="font-mono text-[11px] uppercase tracking-wider text-ink-3">
              Checked post
            </div>
            <div className="mt-1 break-all font-mono text-sm text-ink">
              {sampleReport.url}
            </div>
          </div>

          {/* Verdict banner */}
          <Reveal className={`border-l-4 ${risk.wrap} border-b border-line`}>
            <div className="px-6 py-5">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider ${risk.text} border-current`}
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                  {risk.label}
                </span>
              </div>
              <p className="mt-3 max-w-2xl leading-relaxed text-ink">
                {sampleReport.overallVerdict}
              </p>
            </div>
          </Reveal>

          {/* Signal rows */}
          <div className="divide-y divide-line">
            {sampleReport.signals.map((s, i) => (
              <div key={s.name} className="px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium text-ink">{s.name}</span>
                  <span className="tabular shrink-0 font-mono text-sm text-ink-2">
                    <CountUp value={s.score0to100} />
                    <span className="text-ink-3">/100</span>
                  </span>
                </div>
                <div className="mt-2">
                  <ConfidenceBar score={s.score0to100} delay={i * 90} />
                </div>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-2">
                  {s.finding}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Section 4 — What Trust Check does NOT determine
 * ------------------------------------------------------------------ */

function Limits() {
  const items = [
    'It does not prove a human made the content, only that AI-generation signals are or are not present.',
    'It does not guarantee brand safety, endorsement suitability, or that a creator is a good fit.',
    'Findings are indicative, not conclusive. A high score is a reason to look closer, not a final judgement.',
  ]

  return (
    <Container className="py-16 lg:py-20">
      <Reveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Section
          eyebrow="Honesty"
          heading="What Trust Check does not determine."
          lead="A trust report narrows the question. It does not close it."
        />
        <div>
          <ul className="space-y-4">
            {items.map((t) => (
              <li key={t} className="flex gap-3 text-ink-2">
                <Minus
                  className="mt-1 h-4 w-4 shrink-0 text-ink-3"
                  aria-hidden="true"
                />
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-line pt-6 text-sm leading-relaxed text-ink-2">
            Use Trust Check as one input alongside your own review. Treat every
            score as a prompt to verify, and confirm anything material before
            you act on it.
          </p>
        </div>
      </Reveal>
    </Container>
  )
}

/* ------------------------------------------------------------------ *
 * Section 5 — CTA band
 * ------------------------------------------------------------------ */

function CTA() {
  return (
    <section className="bg-deep">
      <Container className="py-16 text-center lg:py-24">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built into the brand workspace.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-paper/70">
            Run Trust Check on any creator or post as you build a shortlist. The
            report sits right next to their verified stats.
          </p>
          <div className="mt-8 flex justify-center">
            <Button to="/brands" variant="primary" size="lg">
              Explore the brand workspace
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export default function TrustCheck() {
  return (
    <>
      <Hero />
      <WhatWeAnalyse />
      <SampleReport />
      <Limits />
      <CTA />
    </>
  )
}
