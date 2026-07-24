import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import Container from '../components/Container'
import Button from '../components/Button'
import Reveal from '../motion/Reveal'

const PATHS = [
  {
    audience: 'Creator',
    title: 'Build a verified presence',
    description:
      'Bring your profile, performance, rate guidance and Brand Passport into one place, then get discovered by brands looking for Singapore creators.',
    points: ['Free to start', 'Verified IG and TikTok stats', 'SGD rate guidance'],
    action: 'Apply as a creator',
    href: 'https://www.influencees.com/signup',
    primary: true,
  },
  {
    audience: 'Brand',
    title: 'Find creators you can trust',
    description:
      'Discover, compare and manage Singapore creators with clearer evidence from the first shortlist through the final campaign report.',
    points: ['Plans from $49/month', 'Trust Check access', 'Campaign workspace'],
    action: 'Choose a brand plan',
    to: '/pricing',
    primary: false,
  },
  {
    audience: 'Community',
    title: 'Help shape the local creator landscape',
    description:
      'Discover creators, contribute useful signals and take part in a community built around better creator-brand decisions.',
    points: ['Free to join', 'Creator discovery', 'Community participation'],
    action: 'Join the community',
    href: 'https://www.influencees.com/signup',
    primary: false,
  },
] as const

export default function Join() {
  return (
    <>
      <section className="border-b border-line">
        <Container className="py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.08em] text-accent">
              Get started
            </p>
            <h1 className="font-display text-[2.75rem] font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-5xl lg:text-6xl">
              Choose the path that fits.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
              Start with one role. You can add another later. No credit card is
              required to create an account.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 lg:py-20">
        <div className="border-t border-line">
          {PATHS.map((path, index) => (
            <Reveal key={path.audience} delay={index * 80}>
              <article className="grid gap-6 border-b border-line py-9 md:grid-cols-[9rem_1fr_auto] md:items-center lg:gap-10 lg:py-11">
                <div>
                  <span className="font-mono text-xs text-ink-3">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-2 text-sm font-medium text-accent">
                    {path.audience}
                  </p>
                </div>

                <div className="max-w-2xl">
                  <h2 className="text-2xl font-medium tracking-tight text-ink">
                    {path.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-ink-2">
                    {path.description}
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                    {path.points.map((point) => (
                      <li
                        key={point}
                        className="inline-flex items-center gap-2 text-sm text-ink-2"
                      >
                        <Check
                          className="h-3.5 w-3.5 text-accent"
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:justify-self-end">
                  {'to' in path ? (
                    <Button
                      to={path.to}
                      variant={path.primary ? 'primary' : 'secondary'}
                      size="md"
                    >
                      {path.action}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  ) : (
                    <Button
                      href={path.href}
                      variant={path.primary ? 'primary' : 'secondary'}
                      size="md"
                    >
                      {path.action}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>

      <section className="bg-deep">
        <Container className="py-12 text-center lg:py-16">
          <p className="font-display text-2xl font-medium text-paper sm:text-3xl">
            Singapore-first. Instagram and TikTok. Real creator data.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-paper/65">
            Influencees is built for creators and brands who would rather make
            decisions from evidence than screenshots and vanity metrics.
          </p>
        </Container>
      </section>
    </>
  )
}
