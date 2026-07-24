import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Check, Minus } from 'lucide-react'
import Container from '../components/Container'
import Section from '../components/Section'
import Button from '../components/Button'
import FAQItem from '../components/FAQItem'
import Reveal from '../motion/Reveal'
import CountUp from '../motion/CountUp'
import {
  brandPlans,
  creatorPlans,
  comparisonTable,
  pricingFaqs,
} from '../data/pricing'
import type { BrandPlan, CreatorPlan, ComparisonRow } from '../data/pricing'

type Audience = 'brands' | 'creators'
type Billing = 'monthly' | 'annual'

/* ------------------------------------------------------------------ *
 * Section 1 — Hero + controls
 * ------------------------------------------------------------------ */

function Hero({
  audience,
  setAudience,
  billing,
  setBilling,
}: {
  audience: Audience
  setAudience: (a: Audience) => void
  billing: Billing
  setBilling: (b: Billing) => void
}) {
  return (
    <section className="border-b border-line">
      <Container className="py-16 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-gradient-brand mb-3 text-xs font-semibold uppercase tracking-[0.08em]">
            Pricing
          </p>
          <h1 className="font-display text-[2.75rem] font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-5xl">
            One price list. No surprises.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-2">
            All prices in USD, billed via Stripe. Start free, upgrade when
            ready.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <SegmentedControl
            options={[
              { value: 'brands', label: 'For brands' },
              { value: 'creators', label: 'For creators' },
            ]}
            value={audience}
            onChange={(v) => setAudience(v as Audience)}
            ariaLabel="Choose audience"
          />
          <SegmentedControl
            options={[
              { value: 'monthly', label: 'Monthly' },
              { value: 'annual', label: 'Annual' },
            ]}
            value={billing}
            onChange={(v) => setBilling(v as Billing)}
            ariaLabel="Choose billing period"
            trailing={
              <span className="ml-1 rounded border border-ok/30 bg-ok/8 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-ok">
                Save up to 20%
              </span>
            }
          />
        </div>
      </Container>
    </section>
  )
}

function SegmentedControl({
  options,
  value,
  onChange,
  ariaLabel,
  trailing,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  ariaLabel: string
  trailing?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="inline-flex rounded-md border border-line bg-surface p-0.5"
      >
        {options.map((o) => {
          const active = o.value === value
          return (
            <button
              key={o.value}
              role="tab"
              aria-selected={active}
              onClick={() => onChange(o.value)}
              className={`rounded px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-ink text-white'
                  : 'text-ink-2 hover:text-ink'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
      {trailing}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Section 2 — Brand plan cards
 * ------------------------------------------------------------------ */

function BrandPlans({ billing }: { billing: Billing }) {
  return (
    <Container className="py-16 lg:py-20">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {brandPlans.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 80} className="h-full">
            <BrandCard plan={plan} billing={billing} />
          </Reveal>
        ))}
      </div>
    </Container>
  )
}

function BrandCard({ plan, billing }: { plan: BrandPlan; billing: Billing }) {
  const custom = plan.monthlyPriceUSD === null
  const monthly = plan.monthlyPriceUSD
  const annual = plan.annualPriceUSD

  return (
    <div
      className={`flex h-full flex-col p-6 ${
        plan.popular
          ? 'rounded-[20px] border border-accent/40 shadow-[0_10px_30px_-10px_rgba(27,16,82,0.12)]'
          : 'rounded-lg border border-line bg-surface'
      }`}
      style={
        plan.popular
          ? {
              background:
                'radial-gradient(circle at 50% 0%, #DD87FF 0%, #BFA8FF 24%, #F7F6FB 55%, #F7F6FB 100%)',
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-ink">{plan.name}</h3>
        {plan.popular && (
          <span className="rounded-full border border-accent/30 bg-accent/8 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-accent">
            Best value
          </span>
        )}
      </div>

      <div className="mt-4 min-h-[3.5rem]">
        {custom ? (
          <div className="font-mono text-3xl font-semibold tracking-tight text-ink">
            {plan.priceLabel}
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5">
              <span className="tabular font-mono text-3xl font-semibold tracking-tight text-ink">
                <CountUp
                  key={billing}
                  value={
                    billing === 'annual'
                      ? Math.round((annual as number) / 12)
                      : (monthly as number)
                  }
                  prefix="$"
                />
              </span>
              <span className="font-mono text-sm text-ink-3">/mo</span>
            </div>
            {billing === 'annual' && (
              <p className="mt-1 font-mono text-xs text-ink-3">
                billed annually ${annual?.toLocaleString()}/yr
              </p>
            )}
            {billing === 'monthly' && (
              <p className="mt-1 font-mono text-xs text-ink-3">
                billed monthly
              </p>
            )}
          </>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-2">{plan.tagline}</p>

      <ul className="mt-5 flex-1 space-y-2.5 border-t border-line pt-5">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2.5 text-sm text-ink-2">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              aria-hidden="true"
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Button
          to="/brands"
          variant={plan.popular ? 'primary' : 'secondary'}
          size="md"
          className="w-full"
        >
          {plan.cta}
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Section 3 — Creator plan cards
 * ------------------------------------------------------------------ */

function CreatorPlans({ billing }: { billing: Billing }) {
  return (
    <Container className="py-16 lg:py-20">
      <div className="grid gap-5 md:grid-cols-2">
        {creatorPlans.map((plan, i) => (
          <Reveal key={plan.name} delay={i * 80} className="h-full">
            <CreatorCard plan={plan} billing={billing} />
          </Reveal>
        ))}
      </div>
      <p className="mt-6 font-mono text-sm text-ink-2">
        Founding members get 3 months of Pro free.
      </p>
    </Container>
  )
}

function CreatorCard({
  plan,
  billing,
}: {
  plan: CreatorPlan
  billing: Billing
}) {
  const free = plan.monthlyPriceUSD === 0
  const popular = plan.name === 'CreatorPro'

  return (
    <div
      className={`flex h-full flex-col p-8 ${
        popular
          ? 'rounded-[20px] border border-accent/40 shadow-[0_10px_30px_-10px_rgba(27,16,82,0.12)]'
          : 'rounded-lg border border-line bg-surface'
      }`}
      style={
        popular
          ? {
              background:
                'radial-gradient(circle at 50% 0%, #DD87FF 0%, #BFA8FF 24%, #F7F6FB 55%, #F7F6FB 100%)',
            }
          : undefined
      }
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-ink">
          {plan.name === 'CreatorPro' ? 'Creator Pro' : 'Starter'}
        </h3>
        {popular && (
          <span className="rounded-full border border-accent/30 bg-accent/8 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-accent">
            Most popular
          </span>
        )}
      </div>

      <div className="mt-4 min-h-[3.5rem]">
        {free ? (
          <div className="font-mono text-3xl font-semibold tracking-tight text-ink">
            Free
            <span className="ml-2 text-sm font-normal text-ink-3">forever</span>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1.5">
              <span className="tabular font-mono text-3xl font-semibold tracking-tight text-ink">
                <CountUp
                  key={billing}
                  value={
                    billing === 'annual'
                      ? Math.round(plan.annualPriceUSD / 12)
                      : plan.monthlyPriceUSD
                  }
                  prefix="$"
                />
              </span>
              <span className="font-mono text-sm text-ink-3">/mo</span>
            </div>
            <p className="mt-1 font-mono text-xs text-ink-3">
              {billing === 'annual'
                ? `billed annually $${plan.annualPriceUSD}/yr`
                : 'billed monthly'}
            </p>
          </>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-2">{plan.tagline}</p>

      <ul className="mt-5 flex-1 space-y-2.5 border-t border-line pt-5">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2.5 text-sm text-ink-2">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              aria-hidden="true"
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Button
          to="/creators"
          variant={popular ? 'primary' : 'secondary'}
          size="md"
          className="w-full"
        >
          {plan.cta}
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Section 4 — Comparison table (brands only)
 * ------------------------------------------------------------------ */

function BoolCell({ value }: { value: boolean }) {
  return value ? (
    <Check className="mx-auto h-4 w-4 text-ok" aria-label="Yes" />
  ) : (
    <Minus className="mx-auto h-4 w-4 text-ink-3" aria-label="No" />
  )
}

function ComparisonTable() {
  const cols: { key: keyof ComparisonRow; label: string }[] = [
    { key: 'sgFocused', label: 'SG-focused' },
    { key: 'trustCheck', label: 'Trust Check' },
    { key: 'tiktokTCM', label: 'TikTok TCM' },
    { key: 'campaigns', label: 'Campaigns' },
    { key: 'aiTools', label: 'AI tools' },
  ]

  return (
    <section className="border-y border-line bg-surface">
      <Container className="py-16 lg:py-20">
        <Reveal>
          <Section
            eyebrow="Compare"
            heading="How Influencees compares"
            lead="Publicly listed competitor pricing, converted to USD per month, next to the Growth plan."
          />
        </Reveal>

        <Reveal className="mt-10 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-paper text-left">
                <th className="sticky left-0 z-10 bg-paper px-4 py-3 font-medium text-ink-3">
                  Provider
                </th>
                <th className="px-4 py-3 text-right font-medium text-ink-3">
                  Price / mo
                </th>
                {cols.map((c) => (
                  <th
                    key={c.key}
                    className="px-4 py-3 text-center font-medium text-ink-3"
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonTable.map((row, i) => {
                const highlight = i === 0
                return (
                  <tr
                    key={row.provider}
                    className={`border-t border-line ${
                      highlight ? 'bg-accent/5' : ''
                    }`}
                  >
                    <th
                      scope="row"
                      className={`sticky left-0 z-10 px-4 py-3 text-left font-medium ${
                        highlight ? 'bg-accent/5 text-ink' : 'bg-surface text-ink'
                      }`}
                    >
                      {row.provider}
                    </th>
                    <td className="tabular px-4 py-3 text-right font-mono text-ink">
                      {row.monthlyPrice}
                    </td>
                    {cols.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-center">
                        <BoolCell value={row[c.key] as boolean} />
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Reveal>

        <p className="mt-4 max-w-3xl font-mono text-xs leading-relaxed text-ink-3">
          * Competitor prices are publicly listed estimates, converted to USD
          per month. Actual pricing varies.
        </p>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Section 5 — FAQ
 * ------------------------------------------------------------------ */

function FAQ() {
  return (
    <Container className="py-16 lg:py-20">
      <Section eyebrow="FAQ" heading="Pricing questions." />
      <div className="mt-10 max-w-3xl">
        {pricingFaqs.map((f, i) => (
          <FAQItem key={f.q} question={f.q} defaultOpen={i === 0}>
            {f.a}
          </FAQItem>
        ))}
      </div>
    </Container>
  )
}

/* ------------------------------------------------------------------ *
 * Section 6 — Final CTA band
 * ------------------------------------------------------------------ */

function FinalCTA() {
  return (
    <section className="bg-deep">
      <Container className="py-16 text-center lg:py-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Founding members: claim 3 months free.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-paper/70">
            Lock in early pricing while the workspace is still taking shape. No
            card required to start.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/brands" variant="primary" size="lg">
              Start as a brand
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Link
              to="/contact"
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border border-white/20 px-6 text-base font-medium text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              Talk to us
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export default function Pricing() {
  const [audience, setAudience] = useState<Audience>('brands')
  const [billing, setBilling] = useState<Billing>('monthly')

  return (
    <>
      <Hero
        audience={audience}
        setAudience={setAudience}
        billing={billing}
        setBilling={setBilling}
      />
      {audience === 'brands' ? (
        <>
          <BrandPlans billing={billing} />
          <ComparisonTable />
        </>
      ) : (
        <CreatorPlans billing={billing} />
      )}
      <FAQ />
      <FinalCTA />
    </>
  )
}
