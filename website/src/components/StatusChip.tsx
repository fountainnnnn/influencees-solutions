type StatusVariant = 'LIVE' | 'BETA' | 'SOON'

type StatusChipProps = {
  status: StatusVariant
  className?: string
}

const styles: Record<StatusVariant, string> = {
  LIVE: 'text-ok border-ok/30 bg-ok/8',
  BETA: 'text-warn border-warn/30 bg-warn/8',
  SOON: 'text-info border-info/30 bg-info/8',
}

/** Tiny uppercase mono feature-status chip: LIVE / BETA / SOON. */
export default function StatusChip({ status, className = '' }: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase leading-none tracking-wider ${styles[status]} ${className}`}
    >
      <span
        aria-hidden="true"
        className="inline-block h-1 w-1 rounded-full bg-current"
      />
      {status}
    </span>
  )
}
