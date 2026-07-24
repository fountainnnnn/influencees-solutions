/* ------------------------------------------------------------------ *
 * AmbientBackground
 *
 * One global layer that sits behind everything: a single large purplish
 * orb that wanders slowly around the middle of the viewport, plus one
 * fainter secondary blob for depth. Fixed, non-interactive, decorative.
 * Under prefers-reduced-motion the orbs are frozen (animation disabled
 * via the .influ-orb rules in index.css). Content stays fully readable.
 * ------------------------------------------------------------------ */
export default function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Primary orb: ~72vw, centred, blurred, low opacity. */}
      <div
        className="influ-orb absolute left-1/2 top-1/2 h-[72vw] w-[72vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(122,92,255,0.42) 0%, rgba(221,135,255,0.24) 45%, rgba(122,92,255,0) 72%)',
          filter: 'blur(120px)',
          opacity: 0.12,
        }}
      />
      {/* Secondary, fainter blob offset toward the upper right. */}
      <div
        className="influ-orb-2 absolute left-[68%] top-[22%] h-[46vw] w-[46vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,111,174,0.30) 0%, rgba(221,135,255,0.18) 50%, rgba(221,135,255,0) 74%)',
          filter: 'blur(130px)',
          opacity: 0.07,
        }}
      />
    </div>
  )
}
