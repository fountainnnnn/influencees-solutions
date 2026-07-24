import type { ReactNode } from 'react'
import { Plus } from 'lucide-react'

type FAQItemProps = {
  question: string
  children: ReactNode
  /** Open by default. */
  defaultOpen?: boolean
}

/**
 * Accessible accordion item built on native <details>/<summary>.
 * Keyboard-operable and works without JS.
 */
export default function FAQItem({
  question,
  children,
  defaultOpen = false,
}: FAQItemProps) {
  return (
    <details
      open={defaultOpen}
      className="group border-b border-line py-1 [&_svg]:open:rotate-45"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium text-ink marker:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        <span>{question}</span>
        <Plus
          className="h-4 w-4 shrink-0 text-ink-3 transition-transform duration-200"
          aria-hidden="true"
        />
      </summary>
      <div className="max-w-2xl pb-4 text-ink-2 leading-relaxed">
        {children}
      </div>
    </details>
  )
}
