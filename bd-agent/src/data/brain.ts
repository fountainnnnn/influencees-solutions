// Business Brain, the knowledge the agent reasons from. All facts sourced from
// docs/site-audit.md and docs/design-brief.md canonical decisions.

export interface PricingTier {
  name: string
  price: string
  note: string
}

export interface ExampleMessage {
  label: string
  good: boolean
  text: string
  why: string
}

export const brain = {
  positioning: {
    oneLiner:
      'The trust layer for the Singapore creator economy: brands find SG creators and verify them with data, not vibes.',
    tagline:
      "Where Singapore's creators get found, by brands that actually do their homework.",
    pillars: [
      'Ai-kyo campaign assistant: find, compare, brief, UTM and pipeline from one chat.',
      'Data tracked straight from the source (IG + TikTok public profiles), refreshed regularly, no third-party aggregators.',
      'End-to-end campaign workspace: shortlist, budgets, side-by-side compare, brief to client-ready report.',
      'Trust Check (BETA): scam signals, AI-content flags and account signals for any post.',
    ],
    footprint: 'Singapore-first. Platforms: Instagram + TikTok only. Every creator is SG-based.',
  },

  brandPricing: [
    { name: 'Brand Starter', price: '$49/mo', note: '1 campaign, 10 creators, discovery + Trust Check, match score, basic reports' },
    { name: 'Growth', price: '$119/mo', note: 'Ai-kyo, 5 campaigns, unlimited creators, UTM + advanced analytics, IG/TikTok exports' },
    { name: 'Brand Pro', price: '$249/mo', note: 'Unlimited campaigns, TikTok Creator Marketplace, 3 seats, branded reports, 48hr SLA' },
    { name: 'Enterprise', price: 'custom', note: 'Unlimited seats, white-label, dedicated AM, SLA, training' },
  ] as PricingTier[],

  creatorPricing: [
    { name: 'Creator Starter', price: 'Free', note: 'Community, rate/review, badges & XP, leaderboard, early access' },
    { name: 'Creator Pro', price: '$16/mo', note: 'Live stats, Brand CRM, Brief Analyzer, AI pitch templates, media kit, SGD rate card' },
  ] as PricingTier[],

  products: {
    aikyo: 'Ai-kyo: the AI campaign assistant (brand side) and content co-pilot (creator side).',
    trustCheck:
      'Trust Check (BETA): paste a TikTok/IG link for a trust report. LIVE signals: AI thumbnail/model detection, caption & scam signals, account/bot signals. SOON: engagement authenticity, account history.',
    briefBuilder: 'Brand Brief Builder (BETA): generate a professional creator brief in seconds.',
  },

  icp: {
    summary:
      'Singapore consumer brands, 10 to 200 staff, already spending on (or actively planning) influencer marketing.',
    niches: ['F&B', 'Beauty', 'Fitness', 'Fintech', 'Retail', 'Travel'] as const,
    positiveSignals: [
      'Recent product launch, pop-up, or seasonal campaign (CNY, National Day, year-end)',
      'Hiring marketing / social / growth roles',
      'Already posting UGC or working with creators ad-hoc via DMs',
      'Consumer-facing brand with an SG audience on IG or TikTok',
    ],
    negativeSignals: [
      'B2B-only or enterprise software with no consumer audience',
      'Pure agency / reseller (would compete, not buy)',
      'No Singapore presence',
      'Under 10 staff with no visible marketing budget',
    ],
    idealContacts: ['Founder', 'Head of Marketing', 'Brand / Social Lead', 'Growth Marketer'],
  },

  allowedClaims: [
    'Discovery + Trust Check across SG creators on IG and TikTok.',
    'Stats tracked from the source and refreshed regularly.',
    'Match score and side-by-side comparison of up to 4 creators.',
    'Ai-kyo drafts briefs and builds campaign pipelines.',
    'Brand plans from $49/mo; Growth adds Ai-kyo at $119/mo.',
  ],

  forbiddenClaims: [
    'No guaranteed ROI or guaranteed reach / follower numbers.',
    'No fake familiarity ("I loved your recent post!", "big fan of your brand").',
    'No inventing prior contact or relationships that did not happen.',
    'No naming other clients / brands as customers without evidence.',
    'No "real-time" or "live" data claims, say "refreshed regularly".',
  ],

  tone: {
    rules: [
      'Short. 3 to 5 sentences max for a first touch.',
      'Lead with one concrete, sourced observation about their business.',
      'One specific offer tied to that observation. One clear ask.',
      'Dry and specific. No hype words: supercharge, unleash, revolutionize, seamless, empower.',
      'No emoji. No exclamation-mark enthusiasm. Numbers in figures.',
    ],
  },

  examples: [
    {
      label: 'First touch: matcha launch',
      good: true,
      text:
        'Hi Wei Ling, saw Kōri just put the Uji matcha line on the TikTok menu drop. If you are lining up creators for it, Influencees can shortlist SG F&B micro-creators by real engagement (tracked from IG/TikTok, not follower count) and run a match score against the launch. Worth a 15-min look this week?',
      why: 'One sourced observation, one specific offer, one ask. No hype, no fake praise.',
    },
    {
      label: 'First touch: cringe version',
      good: false,
      text:
        'Hi! I ABSOLUTELY LOVED your recent post, it was amazing! ✨ We can supercharge your brand with our revolutionary AI platform and guarantee you 10x ROI and viral reach. Let us empower your seamless growth journey!',
      why: 'Fake familiarity, emoji, hype words, and a guaranteed-ROI claim. All forbidden.',
    },
  ] as ExampleMessage[],
}

export type Brain = typeof brain
