// Global ambient layer (v2): one large, slowly wandering purplish orb behind
// all pages. Deliberately faint in the dashboard so dense tables stay readable.
// Fixed, -z, aria-hidden, pointer-events-none. Freezes under prefers-reduced-motion.
export default function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* primary wandering orb */}
      <div
        className="bd-wander absolute left-1/2 top-1/2 h-[72vw] w-[72vw]"
        style={{
          background:
            'radial-gradient(closest-side, color-mix(in srgb, var(--color-accent) 60%, var(--color-lavender)) , transparent 70%)',
          opacity: 0.09,
          filter: 'blur(120px)',
        }}
      />
      {/* fainter offset secondary blob for depth */}
      <div
        className="bd-wander absolute left-[38%] top-[62%] h-[46vw] w-[46vw]"
        style={{
          background:
            'radial-gradient(closest-side, var(--color-lavender), transparent 70%)',
          opacity: 0.05,
          filter: 'blur(130px)',
          animationDuration: '38s',
          animationDirection: 'reverse',
        }}
      />
    </div>
  )
}
