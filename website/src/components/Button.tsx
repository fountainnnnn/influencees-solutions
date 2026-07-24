import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

type BaseProps = {
  variant?: Variant
  size?: Size
  children: ReactNode
  className?: string
}

const base =
  'btn focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

const variants: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
}

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-[52px] px-7 text-base',
}

function classes(variant: Variant, size: Size, className: string) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`
}

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: undefined
    href?: undefined
  }

type ButtonAsLink = BaseProps & {
  /** Internal route — renders a react-router Link. */
  to: string
  href?: undefined
}

type ButtonAsAnchor = BaseProps & {
  /** External URL — renders a plain anchor. */
  href: string
  to?: undefined
}

type ButtonProps = ButtonAsButton | ButtonAsLink | ButtonAsAnchor

/** Polymorphic button: renders <button>, react-router <Link>, or <a>. */
export default function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    children,
    className = '',
  } = props

  if ('to' in props && props.to !== undefined) {
    const { to } = props
    return (
      <Link to={to} className={classes(variant, size, className)}>
        {children}
      </Link>
    )
  }

  if ('href' in props && props.href !== undefined) {
    const { href } = props
    return (
      <a href={href} className={classes(variant, size, className)}>
        {children}
      </a>
    )
  }

  const {
    variant: _v,
    size: _s,
    children: _c,
    className: _cn,
    to: _to,
    href: _href,
    ...rest
  } = props as ButtonAsButton
  return (
    <button className={classes(variant, size, className)} {...rest}>
      {children}
    </button>
  )
}
