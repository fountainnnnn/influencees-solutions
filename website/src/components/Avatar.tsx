import { useState } from 'react'

type AvatarProps = {
  src: string
  name: string
  /** Square size in px. */
  size?: number
  className?: string
}

function initials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/** Deterministic muted tint from a name hash, used for the initials fallback. */
function tint(name: string): { backgroundColor: string; color: string } {
  let h = 0
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 360
  }
  return {
    backgroundColor: `hsl(${h} 32% 90%)`,
    color: `hsl(${h} 38% 32%)`,
  }
}

/**
 * Round creator avatar: real image with a white ring, lazy-loaded. Falls back
 * to tinted initials if the image is missing or fails to load.
 */
export default function Avatar({ src, name, size = 44, className = '' }: AvatarProps) {
  const [errored, setErrored] = useState(false)
  const dimension = { width: size, height: size }

  if (errored) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-full font-mono font-medium ring-2 ring-white ${className}`}
        style={{ ...dimension, ...tint(name) }}
        aria-hidden="true"
      >
        {initials(name)}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`shrink-0 rounded-full object-cover ring-2 ring-white ${className}`}
      style={dimension}
      aria-hidden="true"
    />
  )
}
