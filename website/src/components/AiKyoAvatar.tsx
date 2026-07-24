type AiKyoAvatarProps = {
  /** Square size in px. */
  size?: number
  className?: string
}

/**
 * The Ai-kyo mascot in a rounded container with a subtle purple ring. The PNG
 * is transparent, so it is contained (not stretched) on a faint accent wash.
 */
export default function AiKyoAvatar({ size = 28, className = '' }: AiKyoAvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/10 ring-2 ring-accent/30 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <img
        src="/brand/ai-kyo.png"
        alt=""
        loading="lazy"
        className="h-full w-full object-contain"
      />
    </span>
  )
}
