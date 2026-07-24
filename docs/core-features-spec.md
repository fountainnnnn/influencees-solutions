# "Core Features" section spec (adapted from MotionSites reference — binding for Home)

A single centered section on Home replacing the current generic 3-column trust band. Three gradient cards, 20px radius, ~340px tall, flex column justify-end, overflow hidden, light base #F7F6FB, shadow `0 10px 30px -10px rgba(27,16,82,0.12)`. Card headings (h3) 1.05rem weight 600 ink, padding 24px, z-2. Grid: 3 cols, 24px gap; 2 cols <900px; 1 col <600px.

Header block above the grid, centered:
- Badge: "CORE FEATURES" 0.75rem w600 uppercase ls-1px, gradient text `linear-gradient(90deg,#7A5CFF,#DD87FF,#FF6FAE)` background-clip:text transparent fill.
- Title: "Built on trust, not vanity metrics." 2.75rem w500 ink, ls -0.02em (Sora).
- Subtitle: "Everything a brand needs to go from search to signed creator" 1.125rem ink-2, 50px bottom margin.

## Card 1 — "Ask Ai-kyo" (maps: Smart Prompt Suggestions)
- BG: `radial-gradient(circle at 50% 0%, #DD87FF 0%, #BFA8FF 30%, #F7F6FB 60%, #F7F6FB 100%)`.
- White prompt box (12px radius, 16px padding, 0.8rem ink-2, lh 1.6, soft shadow) absolute top:30px l/r:24px. Text: "Find **beauty micro-creators** in **Singapore** with **engagement above 4%** and draft a campaign brief" where bold spans use gradient text `linear-gradient(90deg,#7A5CFF,#FF6FAE)` clipped, w600.
- Pill button "✦ Ask Ai-kyo" absolute ~top:180px left:40px: white bg, 1px solid #0D0C0A border, 5px 14px padding, 20px radius, 0.75rem w600 ink; ✦ colored #7A5CFF 1rem, 6px gap.
- Cursor SVG arrow absolute top:205px left:110px, 24x24 fill #0D0C0A white stroke, drop-shadow, path `M4 2L20 11L11 13L9 22L4 2Z`.
- h3: "Ask Ai-kyo anything"

## Card 2 — "Trust Check" (maps: API Access)
- BG: `radial-gradient(circle at 50% 0%, #FF6FAE 0%, #F8ACA0 30%, #F7F6FB 60%, #F7F6FB 100%)`.
- Visual area (absolute inset 0, bottom:70px, flex centered, 24px pad): a compact white trust-report card (real-feeling: mono URL line, 3 signal rows with tiny bars, "High risk" chip in warn) OR a cropped real screenshot of the live /check page from /shots/check.png inside a subtle rounded frame. Prefer the real screenshot crop.
- h3: "Trust Check every post" + BETA chip inline.

## Card 3 — "The Creator Index" (maps: Project Library)
- BG: `radial-gradient(circle at 50% 0%, #BFA8FF 0%, #DD87FF 30%, #F7F6FB 60%, #F7F6FB 100%)`.
- Mesh overlay: absolute inset 0, two linear-gradients `rgba(255,255,255,0.8) 1px, transparent 1px` horizontal + 90deg, background-size 16px 16px, masked `radial-gradient(circle at center top, black 0%, transparent 80%)` (+ -webkit-mask-image).
- Center visual absolute top:~44px centered: overlapping cluster of 3-4 REAL creator avatars (from /avatars/*.jpg, 56-64px circles, white 3px rings, slight rotations) instead of a folder icon, with a small 🇸🇬-style "SG" chip.
- Search pill absolute top:220px centered: white bg, 1px solid #0D0C0A, 6px 18px padding, 20px radius, 0.75rem w500 ink, nowrap, 8px gap, lucide-style search SVG 14x14 stroke ink-3 + "Search 1,200+ SG creators".
- h3: "The Creator Index"

Notes: static styling is fine (subtle Reveal on scroll allowed); Inter already loaded; no em dashes; keep copy ours (dry, specific). This section REPLACES the old icon-card trust band on Home.
