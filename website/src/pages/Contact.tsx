import type { ComponentType, SVGProps } from 'react'
import { ArrowRight, ArrowUpRight, Link as Linkedin, Mail, Send } from 'lucide-react'
import Container from '../components/Container'
import Section from '../components/Section'

type Icon = ComponentType<SVGProps<SVGSVGElement>>

type Channel = {
  title: string
  description: string
  action: string
  href: string
  icon: Icon
}

const CHANNELS: Channel[] = [
  { title: 'Email', description: 'Best for brand enquiries, partnerships, anything needing a paper trail.', action: 'hello@influencees.com', href: 'mailto:hello@influencees.com', icon: Mail },
  { title: 'Telegram', description: 'Fastest for quick questions.', action: '@influenceesHQ', href: 'https://t.me/influenceesHQ', icon: Send },
  { title: 'LinkedIn', description: 'Follow updates.', action: 'Influencees', href: 'https://www.linkedin.com/company/influencees', icon: Linkedin },
]

const INTENTS = [
  { label: 'Brand workspace enquiry', subject: 'Brand%20workspace%20enquiry' },
  { label: 'Creator listing request', subject: 'Creator%20listing%20request' },
  { label: 'Partnership or press', subject: 'Partnership%20or%20press' },
  { label: 'Report an issue', subject: 'Report%20an%20issue' },
]

export default function Contact() {
  return (
    <>
      <section className='border-b border-line'>
        <Container className='py-20 lg:py-28'>
          <div className='max-w-3xl'>
            <p className='mb-5 font-mono text-xs font-medium uppercase tracking-wider text-accent'>Contact</p>
            <h1 className='text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl'>Get in touch</h1>
            <p className='mt-6 max-w-2xl text-lg leading-relaxed text-ink-2'>We are a small team. We read every message and reply within 1-2 business days.</p>
          </div>
        </Container>
      </section>
      <Container className='py-20 lg:py-24'>
        <Section eyebrow='Contact channels' heading='Choose the useful one.' lead='No support maze. Each route reaches the same small team.' />
        <div className='mt-12 grid grid-cols-1 gap-5 md:grid-cols-3'>
          {CHANNELS.map((channel) => {
            const ChannelIcon = channel.icon
            const external = channel.href.startsWith('http')
            return (
              <article key={channel.title} className='flex min-h-64 flex-col rounded-lg border border-line bg-surface p-6'>
                <div className='flex h-10 w-10 items-center justify-center rounded-md border border-line bg-paper text-ink'><ChannelIcon className='h-5 w-5' aria-hidden='true' /></div>
                <h2 className='mt-6 text-xl font-semibold tracking-tight text-ink'>{channel.title}</h2>
                <p className='mt-2 flex-1 text-sm leading-relaxed text-ink-2'>{channel.description}</p>
                <a href={channel.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className='mt-7 inline-flex items-center gap-1.5 self-start text-sm font-medium text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'>
                  {channel.action}
                  {external ? <ArrowUpRight className='h-4 w-4' aria-hidden='true' /> : <ArrowRight className='h-4 w-4' aria-hidden='true' />}
                </a>
              </article>
            )
          })}
        </div>
      </Container>
      <section className='border-y border-line bg-surface'>
        <Container className='py-20 lg:py-24'>
          <Section eyebrow='Direct your note' heading='What are you reaching out about?' lead='Choose a subject line. Add the useful detail in your email.' />
          <ul className='mt-10 max-w-3xl border-t border-line'>
            {INTENTS.map((intent, index) => (
              <li key={intent.label} className='border-b border-line'>
                <a href={`mailto:hello@influencees.com?subject=${intent.subject}`} className='group flex items-center justify-between gap-6 py-5 text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'>
                  <span className='flex items-center gap-4'>
                    <span className='font-mono text-xs text-ink-3'>{String(index + 1).padStart(2, '0')}</span>
                    <span className='font-medium'>{intent.label}</span>
                  </span>
                  <ArrowRight className='h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5' aria-hidden='true' />
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <Container className='py-20'>
        <div className='max-w-3xl rounded-lg border border-line bg-surface p-6 sm:p-8'>
          <p className='font-mono text-xs font-medium uppercase tracking-wider text-accent'>Building Influencees from Singapore</p>
          <p className='mt-3 text-sm leading-relaxed text-ink-2'>This is a redesign prototype. Forms and messages are illustrative.</p>
        </div>
      </Container>
    </>
  )
}
