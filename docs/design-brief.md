# Influencees — Shared Design Brief (binding for all agents)

Both apps (website/, bd-agent/) follow this. Clean, minimal, anti-AI-slop, editorial-technical. Think Linear/Stripe-docs restraint with a Singapore accent — NOT a generic SaaS template.

## Anti-slop rules (hard)
- NO purple/violet gradients, NO glassmorphism, NO neon glows, NO emoji-as-design, NO "✨ AI magic" copy, NO rounded-3xl blob shapes, NO stock 3D illustrations, NO fake logo walls of Fortune-500 brands.
- No centered-everything: use asymmetric editorial layouts, strong left-aligned type.
- Copy is specific and evidence-flavored ("Synced from IG on 12 Jul", "$16/mo") — never vague hype ("supercharge", "unleash", "revolutionize", "seamless", "empower").
- Real-feeling sample data, internally consistent (same numbers everywhere). Mark samples "Sample data" where honesty requires.
- Max ONE accent color used sparingly. Restraint = credibility.
- Feature-status chips everywhere features appear: LIVE / BETA / SOON.
- NO EM DASHES anywhere in user-facing copy (no "—" or "–"). Rewrite with commas, periods, colons, or parentheses.
- Text must never feel cluttered: one idea per block, clear section boundaries, generous spacing between sections, short labels over long sentences in UI.

## Tokens (Tailwind v4 — ALREADY DEFINED in each app's src/index.css; use these class names)
Brand palette extracted from the live influencees.com (their original theme — binding):
- `ink` #0D0C0A text · `ink-2` secondary · `ink-3` captions · `paper` #FBFAFF white-purplish page bg · `surface` white cards · `line` purple-tinted hairline borders
- `accent` #7A5CFF brand purple (CTAs, active) · `accent-ink` hover · `deep` #2A1056 deep purple (dark bands) · `lavender` #DD87FF · `pink` #FF6FAE (both sparing highlights)
- `ok` #059669 · `warn` #C2410C · `info` #2563EB · `instagram` #E1306C · `tiktok` #FE2C55
- Fonts: `font-sans` Inter · `font-display` Sora (h1-h4 auto-apply on website) · `font-mono` IBM Plex Mono for numbers/evidence/timestamps.
Dark bands use `deep` (not pure black). Purple is THE accent; lavender/pink only as small touches (chips, marks, illustration strokes).

## Visual direction v2 (2026-07-24, supersedes earlier no-glass/no-gradient rules)
- Base: white-purplish `paper` #FBFAFF. Behind everything sits ONE global AmbientBackground layer: a single LARGE purplish orb (radial gradient, accent/lavender mixed, ~60-80vw diameter, blur 100-140px, 8-14% peak opacity) positioned around the middle of the viewport, slowly WANDERING (organic keyframe path: translate + slight scale, 25-40s loop, ease-in-out). Optionally one much fainter secondary blob offset for depth. Very light; content perfectly readable; aria-hidden, pointer-events-none, fixed, -z.
- Glassmorphism IS now used, Apple-style: overlay panels, chips and floating cards may be bg-white/60-80 + backdrop-blur. Body cards stay solid white when dense text sits on them. Never stack glass on glass.
- NAV BEHAVIOR (binding): at scrollY≈0 the navbar is transparent and sits inline as part of the hero section (no bg, no border, full width). Once the user scrolls past a threshold (~24-64px), it transitions (fade + slight translateY, 200-300ms) into a detached floating glass bar: fixed, bg-white/70 + backdrop-blur-xl, hairline border, rounded (either full-width with bottom hairline, or the floating pill/island style inset from edges). Scrolling back to top reverses it. Use a scroll listener/IntersectionObserver; no layout jump (reserve height).
- Buttons at Apple/Google grade: primary = accent bg, white text, rounded-xl, shadow layering (0 1px 2px rgba(27,16,82,.18) + 0 8px 24px rgba(122,92,255,.28)), hover lifts 1px + deepens, active presses back, 150ms ease; secondary = white/70 glass with hairline; ghost = tint on hover. Consistent heights (36/44/52), font-medium, focus-visible ring accent.
- Layout craft: 8pt spacing discipline, optical alignment, consistent card padding, radius scale 10/14/20, hairline dividers instead of heavy borders. Detail > decoration.
- Hype-free copy and no em dashes still apply. AI-slop bans still apply EXCEPT glass + ambient gradient which are now sanctioned as above.

## SITE-WIDE FORMAT (founder-approved benchmark: the Home "Core Features" section)
The Core Features section (docs/core-features-spec.md) is THE governing format for the whole website. Every major section on every page follows its grammar:
1. Section header block, centered: gradient-text uppercase eyebrow (90deg #7A5CFF→#DD87FF→#FF6FAE), big Sora title (w500, -0.02em, ends with a period), one-line ink-2 subtitle.
2. Content lives in soft radial-glow cards: rounded-[20px], light base #F7F6FB, `radial-gradient(circle at 50% 0%, <brandHue1> 0%, <brandHue2> 30%, #F7F6FB 60%)` top glow, shadow `0 10px 30px -10px rgba(27,16,82,0.12)`, h3 label bottom-left w600. Rotate glow hues between lavender/#BFA8FF/pink/peach so adjacent cards differ.
3. Inside cards: REAL props only: real screenshots (/shots), real avatars (/avatars), white mini-panels with gradient-highlighted key phrases, black-outline pill buttons (optionally with the cursor-arrow SVG prop), mesh-grid overlays. Never bare lucide icons in boxes.
4. Between card sections, breathing room on the white-purplish paper with the ambient orb showing through.
This replaces older left-aligned Section patterns as pages are reworked; numbered 01-04 feature rows should be converted into glow-card grids in this format.
- Radii: rounded-md (6px) max for controls, rounded-lg (8px) for cards. Nothing pill-shaped except tiny status chips.
- Borders: 1px solid line color; shadows nearly none (shadow-sm max).
- Spacing: generous; sections py-20/24 on marketing, dense-but-breathing on dashboard.
- Type scale: marketing H1 text-5xl/6xl tracking-tight font-semibold; dashboard is 13–14px base, mono for metrics.
- Load Inter + IBM Plex Mono via @fontsource npm packages if trivial, else system stack is fine.

## Voice
Confident, dry, specific. Singapore-first. "Brands that do their homework." Short sentences. Numbers in mono.

## Canonical content decisions (from docs/site-audit.md)
- ONE price set: Brand Starter $49 / Growth $119 / Brand Pro $249 / Enterprise custom. Creator: Starter Free / Creator Pro $16/mo. USD.
- Ai-kyo is the AI assistant name (brand + creator sides).
- Trust Check is BETA; its sub-signals carry LIVE/SOON chips.
- Every creator is SG-based; platforms = Instagram + TikTok only.
- Footer tagline: "Where Singapore's creators get found — by brands that actually do their homework."
