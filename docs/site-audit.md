# Influencees.com — Site Audit (scraped 2026-07-24)

Source of truth for the redesign's content. All copy below is from the live site.

## Brand facts
- **Influencees Pte. Ltd.**, Singapore. Founder: Davidson Chua. hello@influencees.com. Telegram @influenceesHQ.
- Tagline (footer): "Where Singapore's creators get found — by brands that actually do their homework."
- Positioning: "the trust layer for the creator economy." Singapore-first; every creator is SG-based. IG + TikTok only.
- AI assistant: **Ai-kyo** (brand-side campaign assistant + creator-side content co-pilot).
- Live promo: "Creator Creates Series 2026 (CCS2026) is LIVE — leaderboard & vote" (route /ccs2026 renders empty = broken/JS-only).

## Current nav
For Creators · For Brands · Trust Check (BETA) · Sign in · Get started
Footer: What is Influencees? / Trust Check / Creator Profiles / For Creators / For Brands / About / Contact / Join / Privacy / Terms

## Routes found
`/` `/check` `/creators` `/brands` `/pricing` `/what-is-influencees` `/join` `/about` `/contact` `/careers` `/ccs2026` `/founding` `/signin` `/signup` `/privacy` `/terms`

## Homepage (/)
Dominated by a giant **trending feed** (TikTok top-33 + YouTube top-100 watched in SG, "updated daily", 🇸🇬 marks confirmed SG creators; FEED/LIST toggle, "AI Digest"). Ai-kyo prompt box ("Ask anything about Singapore creators, trends, and campaigns" + suggestion chips). Marketing story is buried; the trending list repeats 3× in the DOM.

## For Brands (/brands)
- H1: "Find the right Singapore creators. Trust the data."
- "Plans from **$59/mo** · Founding members get 3 months free."  ⚠️ conflicts with /pricing
- FAQ: "Brand plans start at **$59/mo (Starter), $149/mo (Growth) and $299/mo (Brand Pro)**" ⚠️
- Pillars: Ai-kyo campaign assistant (find/compare/brief/UTM/pipeline from one chat); "Data tracked straight from the source" (no third-party aggregators, "pulled directly and manually"); end-to-end campaign workspace (shortlist, budgets, compare, brief→client-ready report, UTM, exports); SG-focused any niche; can add off-platform creators.
- How it works: Discover (filter + Trust Check) → Build campaign (budget, compare, Ai-kyo brief) → Track & report.
- "Brand Brief Builder BETA — generate a professional creator brief in seconds."

## For Creators (/creators)
- H1: "Know your worth. Land better deals."
- "Free Starter plan · Founding members get 3 months of Pro free."
- Pillars: verified stats synced from IG/TikTok public profiles (not self-reported); **SGD rate card** from real data + market benchmarks; Brief Analyzer (red flags, low-ball offers, usage-rights traps); Brand CRM; pitch templates; **Brand Passport** (one shareable link, private until shared); content calendar; Ai-kyo content co-pilot.
- How it works: Build profile (~3 min) → Get equipped → Get discovered, land deals.
- FAQ: "Starter free forever … **Creator Pro ($16/mo)**".

## Pricing (/pricing) — USD, Stripe, monthly/annual (save up to 20%)
**Brand plans:** Starter **$49/mo** ($588/yr) — 1 campaign, 10 creators, discovery+Trust Check, match score, basic reports · Growth **$119/mo** ($1428/yr) — Ai-kyo, 5 campaigns, unlimited creators, UTM + advanced analytics, IG/TikTok exports · Brand Pro **$249/mo** ($2988/yr) — unlimited campaigns, TikTok Creator Marketplace (TCM), 3 seats, branded reports, priority support 48hr SLA, early access · Enterprise — custom (unlimited seats, white-label, dedicated AM, SLA, training).
**Comparison table:** "Influencees Growth **$149**" ⚠️ third conflicting number. vs Modash $300, Heepsy $200, Upfluence $480, Agency retainer $1.5–7K.
**⚠️ PRICING CONFLICTS: brands page says 59/149/299; pricing page says 49/119/249; comparison table says Growth=$149. Redesign must pick ONE canonical set → use /pricing page values (49/119/249) + Creator Starter Free / Pro $16.**

## Creator pricing (/join)
Starter **Free forever** (community: rate/review creators, badges & XP, leaderboard, early access) · **Creator Pro $16/mo** ($192/yr) — live stats dashboard, Brand CRM, Brief Analyzer, AI pitch templates, media kit + PDF export, SGD rate card + benchmarks, content calendar, ER benchmarking. Invite-only ("Apply with invite code"). Early Access tier: 3–12 months free with code.

## Trust Check (/check) — BETA
"Is this post real?" Paste TikTok/IG link → instant trust report: scam signals, AI content flags, suspicious patterns.
Signals **LIVE**: AI thumbnail detection (confidence score), AI model detection (which generator), visual AI analysis, caption & scam signals (SG investment scams/phishing), AI content indicators (hashtags), account signals (bot username patterns).
Signals **SOON**: engagement authenticity (purchased engagement), account history.
"Built for Singapore's online trust landscape."

## About (/about)
Story: SG creator scene thriving but infrastructure broken — brands can't evaluate at scale, creators pitch "screenshot by screenshot, DM by DM". Stats band: 🇸🇬 Singapore-first / 2 platforms (IG+TikTok, "pulled live from the source") / both sides served. Creator toolkit: Media Kit, Rate Card, Creator Profile, Creator Index ("ranked by real engagement, not just follower count"). Brand toolkit: Creator Discovery, Side-by-Side Compare (up to 4), Campaign Workspace, AI Content Insights. Founder's note from **Davidson Chua** (quote about seeing the problem from both sides).

## Careers (/careers)
"Founding Internship Programme 2026". 5 pillars/roles: Community Lead, Growth & Distribution, Brand Partnerships, Product & AI, Founder Associate. Singapore · Hybrid · 3–6 months · full-time conversion. "Leadership track, not coffee runs." "We read every application personally."

## Contact (/contact)
Email hello@ / Telegram @influenceesHQ / LinkedIn. Intent picker: brand workspace enquiry, creator listing request, partnership/press, report an issue. "Small team, reply within 1–2 business days."

## Founding (/founding)
Two-door page: I'm a Creator / I'm a Brand → 3 months free top tier.

## Key redesign problems (evidence-based)
1. **Three conflicting brand price sets** across /brands, /pricing, and the comparison table.
2. Homepage buries the value prop under a trending feed; content triplicated in DOM.
3. /ccs2026 renders empty without JS (broken content).
4. "Data pulled live/directly" vs "pulled directly **and manually**" — refresh claims inconsistent; redesign should say "tracked from the source, refreshed regularly".
5. Beta/live/soon labels exist only on Trust Check; needed platform-wide.
6. No creator directory/profile pages in main nav despite "Creator Index" being a headline feature.
7. Invite-only vs "Get started in minutes" tension — clarify funnel.
