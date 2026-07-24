import type { ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
  className?: string
  as?: 'div' | 'section' | 'header' | 'footer' | 'nav' | 'main'
}

/** Centered max-w-6xl wrapper with consistent horizontal padding. */
export default function Container({
  children,
  className = '',
  as: Tag = 'div',
}: ContainerProps) {
  return (
    <Tag className={`mx-auto w-full max-w-6xl px-6 ${className}`}>
      {children}
    </Tag>
  )
}
