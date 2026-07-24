import { Link } from 'react-router-dom'
import Container from './Container'

type FooterLink = { label: string; to: string; external?: boolean }
type FooterColumn = { title: string; links: FooterLink[] }

const COLUMNS: FooterColumn[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Directory', to: '/directory' },
      { label: 'Trust Check', to: '/trust-check' },
      { label: 'Pricing', to: '/pricing' },
    ],
  },
  {
    title: 'For creators',
    links: [
      { label: 'Overview', to: '/creators' },
      { label: 'Get listed', to: '/contact' },
      { label: 'Creator Pro', to: '/pricing' },
    ],
  },
  {
    title: 'For brands',
    links: [
      { label: 'Overview', to: '/brands' },
      { label: 'Find creators', to: '/directory' },
      { label: 'Brand plans', to: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      {
        label: 'Careers',
        to: 'https://www.influencees.com/careers',
        external: true,
      },
      {
        label: 'Privacy',
        to: 'https://www.influencees.com/privacy',
        external: true,
      },
      {
        label: 'Terms',
        to: 'https://www.influencees.com/terms',
        external: true,
      },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to="/" className="inline-flex items-center" aria-label="Influencees home">
              <img
                src="/brand/logo-horizontal-color.svg"
                alt="Influencees"
                className="h-6 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-2">
              Where Singapore's creators get found, by brands that actually do
              their homework.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="font-mono text-xs font-medium uppercase tracking-wider text-ink-3">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}`}>
                    {link.external ? (
                      <a
                        href={link.to}
                        className="text-sm text-ink-2 transition-colors hover:text-ink"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-sm text-ink-2 transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-sm text-ink-2 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <a
              href="mailto:hello@influencees.com"
              className="transition-colors hover:text-ink"
            >
              hello@influencees.com
            </a>
            <a
              href="https://t.me/influenceesHQ"
              className="transition-colors hover:text-ink"
            >
              Telegram @influenceesHQ
            </a>
          </div>
          <p className="text-ink-3">© 2026 Influencees Pte. Ltd. · Singapore</p>
        </div>

        <p className="mt-6 font-mono text-xs text-ink-3">
          Metrics are estimates for demonstration
        </p>
      </Container>
    </footer>
  )
}
