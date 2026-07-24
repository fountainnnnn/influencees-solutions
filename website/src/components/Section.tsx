import type { ReactNode } from 'react'

type SectionProps = {
  /** Small uppercase mono label above the heading. */
  eyebrow?: string
  heading?: ReactNode
  /** Optional lead paragraph below the heading. */
  lead?: ReactNode
  children?: ReactNode
  className?: string
  headingClassName?: string
  /** Renders heading as this level for correct document outline. */
  as?: 'h2' | 'h3'
  id?: string
}

/** Left-aligned section header block (eyebrow + heading + lead) with body. */
export default function Section({
  eyebrow,
  heading,
  lead,
  children,
  className = '',
  headingClassName = '',
  as: Heading = 'h2',
  id,
}: SectionProps) {
  return (
    <div className={className} id={id}>
      {(eyebrow || heading || lead) && (
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-wider text-accent">
              {eyebrow}
            </p>
          )}
          {heading && (
            <Heading
              className={`text-balance text-3xl font-semibold tracking-tight text-ink sm:text-4xl ${headingClassName}`}
            >
              {heading}
            </Heading>
          )}
          {lead && (
            <p className="mt-4 text-lg leading-relaxed text-ink-2">{lead}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
