import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Button from '../components/Button'
import Container from '../components/Container'
import Section from '../components/Section'
import Stat from '../components/Stat'
import StatusChip from '../components/StatusChip'

type ToolkitItem = {
  name: string
  description: string
  status: 'LIVE' | 'BETA' | 'SOON'
}

const CREATOR_TOOLKIT: ToolkitItem[] = [
  { name: 'Media Kit', description: 'A clean, shareable record of your work and audience.', status: 'LIVE' },
  { name: 'Rate Card', description: 'SGD benchmarks grounded in real market data.', status: 'LIVE' },
  { name: 'Creator Profile', description: 'Instagram and TikTok stats tracked from the source.', status: 'LIVE' },
  { name: 'Creator Index', description: 'Ranked by real engagement, not follower count alone.', status: 'LIVE' },
]

const BRAND_TOOLKIT: ToolkitItem[] = [
  { name: 'Creator Discovery', description: 'Search Singapore creators by niche, platform and evidence.', status: 'LIVE' },
  { name: 'Side-by-Side Compare', description: 'Put up to four creators against the same useful metrics.', status: 'LIVE' },
  { name: 'Campaign Workspace', description: 'Keep shortlists, budgets, briefs and reporting together.', status: 'LIVE' },
  { name: 'AI Content Insights', description: 'Review content signals without replacing human judgement.', status: 'BETA' },
]

function ToolkitCard({ eyebrow, title, items, to, cta }: {
  eyebrow: string
  title: string
  items: ToolkitItem[]
  to: string
  cta: string
}) {
  return (
    <article className='flex flex-col rounded-lg border border-line bg-surface p-6 sm:p-8'>
      <p className='font-mono text-xs font-medium uppercase tracking-wider text-accent'>{eyebrow}</p>
      <h3 className='mt-3 text-2xl font-semibold tracking-tight text-ink'>{title}</h3>
      <ul className='mt-7 flex-1 divide-y divide-line border-y border-line'>
        {items.map((item) => (
          <li key={item.name} className='py-4'>
            <div className='flex flex-wrap items-center gap-2'><span className='font-medium text-ink'>{item.name}</span><StatusChip status={item.status} /></div>
            <p className='mt-1.5 text-sm leading-relaxed text-ink-2'>{item.description}</p>
          </li>
        ))}
      </ul>
      <div className='mt-7'><Button to={to} variant='secondary' size='md'>{cta}<ArrowRight className='h-4 w-4' aria-hidden='true' /></Button></div>
    </article>
  )
}

export default function About() {
  return (
    <>
      <section className='border-b border-line'>
        <Container className='py-20 lg:py-28'>
          <div className='max-w-4xl'>
            <p className='mb-5 font-mono text-xs font-medium uppercase tracking-wider text-accent'>About</p>
            <h1 className='text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl'>Built for the people making and backing Singapore&apos;s creators</h1>
            <p className='mt-6 max-w-2xl text-lg leading-relaxed text-ink-2'>Influencees is the trust layer for Singapore&apos;s creator economy: verified creator data and practical tools for both sides of the deal.</p>
          </div>
        </Container>
      </section>
      <Container className='py-20 lg:py-24'>
        <Section eyebrow='Why we built this' heading='Good work was being judged badly.'>
          <div className='mt-8 max-w-2xl space-y-5 text-lg leading-relaxed text-ink-2'>
            <p>Singapore&apos;s creator scene is thriving. The infrastructure around it is not. Brands still struggle to evaluate creators at scale, with useful evidence scattered across profiles, decks and spreadsheets.</p>
            <p>Creators carry the other half of the burden. They pitch screenshot by screenshot, DM by DM, repeatedly proving the same audience and the same body of work.</p>
            <p>Influencees gives both sides a shared source of truth, then puts the working tools around it.</p>
          </div>
        </Section>
      </Container>
      <section className='border-y border-line bg-surface'>
        <Container className='grid gap-10 py-14 md:grid-cols-3 md:py-16'>
          <Stat value='SG-first' label='Every creator Singapore-based' />
          <Stat value='2 platforms' label='Instagram + TikTok, tracked from the source' />
          <Stat value='Both sides' label='Tools for creators and brands' />
        </Container>
      </section>
      <Container className='py-20 lg:py-24'>
        <Section eyebrow='The platform' heading='One platform, two sides' lead='The data is shared. The jobs to be done are different.' />
        <div className='mt-12 grid gap-6 md:grid-cols-2'>
          <ToolkitCard eyebrow='For creators' title='A toolkit for showing your work' items={CREATOR_TOOLKIT} to='/creators' cta='Explore creator tools' />
          <ToolkitCard eyebrow='For brands' title='A workspace for doing the homework' items={BRAND_TOOLKIT} to='/brands' cta='Explore brand tools' />
        </div>
      </Container>
      <section className='border-y border-line bg-surface'>
        <Container className='py-20 lg:py-24'>
          <Section eyebrow='Founder note' heading='The same problem, seen twice.' />
          <figure className='mt-10 max-w-3xl rounded-lg border border-line bg-paper p-6 sm:p-8 lg:p-10'>
            <blockquote className='text-xl leading-relaxed tracking-tight text-ink sm:text-2xl'>“I kept seeing the same problem from both sides. Brands needed a clearer way to assess creators, while creators were still proving their value one screenshot and one DM at a time. Influencees is our attempt to give both sides better evidence and a shared place to work.”</blockquote>
            <figcaption className='mt-8 flex items-center gap-4 border-t border-line pt-6'>
              <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-mono text-sm font-medium text-ink' aria-hidden='true'>DC</span>
              <span className='text-sm font-medium text-ink'>Davidson Chua, Founder, Influencees</span>
            </figcaption>
          </figure>
        </Container>
      </section>
      <Container className='py-20 lg:py-24'>
        <div className='rounded-lg border border-line bg-surface p-6 sm:p-10 lg:flex lg:items-end lg:justify-between lg:gap-12'>
          <div className='max-w-2xl'>
            <p className='font-mono text-xs font-medium uppercase tracking-wider text-accent'>Pick your side</p>
            <h2 className='mt-3 text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl'>Whether you create content or commission it</h2>
            <p className='mt-4 leading-relaxed text-ink-2'>
              Start with the tools built for your work, or write to us at{' '}
              <a href='mailto:hello@influencees.com' className='font-medium text-ink underline decoration-line underline-offset-4 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'>hello@influencees.com</a>.
            </p>
          </div>
          <div className='mt-8 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0'>
            <Button to='/creators' variant='primary' size='lg'>For creators<ArrowUpRight className='h-4 w-4' aria-hidden='true' /></Button>
            <Button to='/brands' variant='secondary' size='lg'>For brands<ArrowUpRight className='h-4 w-4' aria-hidden='true' /></Button>
          </div>
        </div>
      </Container>
    </>
  )
}
