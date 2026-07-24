import type {
  Lead,
  Conversation,
  Message,
  Approval,
  AgentEvent,
} from '../types'

// ---------------------------------------------------------------------------
// 9 fictional-but-realistic Singapore companies at different pipeline stages.
// Conversations exist for l1 to l4 (full threads) and l5 (a pending outreach draft).
// All URLs are fictional linkedin.com/company/... style paths.
// "Today" in this demo is 2026-07-24 (Fri).
// ---------------------------------------------------------------------------

export const seedLeads: Lead[] = [
  {
    id: 'l1',
    company: 'Kōri Matcha Bar',
    niche: 'F&B',
    staff: 45,
    location: 'Bugis + 6 outlets, Singapore',
    profile:
      'Fast-growing matcha & soft-serve chain, 7 SG outlets. Youth-skewed IG/TikTok audience. Just launched a Uji matcha line with a limited menu drop.',
    contact: {
      name: 'Wei Ling Tan',
      role: 'Head of Marketing',
      linkedin: 'linkedin.com/in/weiling-tan-kori',
    },
    fitScore: 88,
    fitBreakdown: { icpMatch: 92, spendSignal: 84, timing: 95, reachability: 80 },
    fitExplanation:
      'Textbook ICP: SG consumer F&B, ~45 staff, youth audience already native to TikTok. A live product launch is the strongest timing signal we score on, and they run creator UGC ad-hoc today, a workflow Ai-kyo directly replaces.',
    confidence: 0.9,
    partnershipAngle:
      'Shortlist SG F&B micro-creators for the Uji matcha drop, ranked by real engagement (not follower count), with a match score against the launch brief.',
    risks: [
      'Marketing may already have an agency on retainer for the launch.',
      'Fast-moving F&B calendar, window closes when the drop sells through.',
    ],
    evidence: [
      {
        id: 'e-l1-1',
        claim: 'Actively launching a new Uji matcha product line right now.',
        sourceUrl: 'linkedin.com/company/kori-matcha-bar/posts/uji-drop',
        sourceType: 'LinkedIn post',
        retrievedAt: '2026-07-21',
        excerpt:
          '"Our Uji matcha line lands this Friday across all outlets. Menu drop goes live on TikTok at 12pm."',
        confidence: 0.94,
      },
      {
        id: 'e-l1-2',
        claim: 'Runs creator collaborations ad-hoc via DMs today.',
        sourceUrl: 'linkedin.com/company/kori-matcha-bar/posts/ugc-thanks',
        sourceType: 'LinkedIn post',
        retrievedAt: '2026-07-19',
        excerpt:
          '"Thank you to the 20+ creators who came down for the tasting, DM us for the next round."',
        confidence: 0.86,
      },
      {
        id: 'e-l1-3',
        claim: 'Hiring a social/content role, budget for marketing is expanding.',
        sourceUrl: 'linkedin.com/company/kori-matcha-bar/jobs/social-exec',
        sourceType: 'Job posting',
        retrievedAt: '2026-07-17',
        excerpt: '"Now hiring: Social Content Executive (IG + TikTok), Singapore."',
        confidence: 0.8,
      },
    ],
    stage: 'replied',
    qualifyReason: 'Live launch + existing creator workflow + hiring social. Top-tier fit.',
    conversationId: 'c1',
    discoveredAt: '2026-07-14',
  },
  {
    id: 'l2',
    company: 'Terra Active',
    niche: 'Fitness',
    staff: 60,
    location: 'Somerset, Singapore',
    profile:
      'Sustainable activewear label. Recycled-fabric lines, studio partnerships. Opening a Somerset pop-up and pushing an omni-channel autumn campaign.',
    contact: {
      name: 'Priya Nair',
      role: 'Brand Lead',
      linkedin: 'linkedin.com/in/priya-nair-terra',
    },
    fitScore: 84,
    fitBreakdown: { icpMatch: 88, spendSignal: 82, timing: 90, reachability: 76 },
    fitExplanation:
      'Consumer fitness brand mid-campaign with a physical retail moment (Somerset pop-up), high-intent timing. Sustainability angle attracts a values-driven SG creator segment we can filter for.',
    confidence: 0.85,
    partnershipAngle:
      'Match values-aligned SG fitness & lifestyle creators to the Somerset pop-up launch week, with side-by-side compare on engagement and audience overlap.',
    risks: [
      'Price-sensitive, asked about plan costs on first reply.',
      'May want off-platform (studio) creators outside IG/TikTok scope.',
    ],
    evidence: [
      {
        id: 'e-l2-1',
        claim: 'Opening a Somerset pop-up store for an autumn campaign.',
        sourceUrl: 'linkedin.com/company/terra-active/posts/somerset-popup',
        sourceType: 'LinkedIn post',
        retrievedAt: '2026-07-11',
        excerpt:
          '"Our first pop-up opens at Somerset next month. Autumn drop, recycled-first, and a few surprises."',
        confidence: 0.9,
      },
      {
        id: 'e-l2-2',
        claim: 'Runs paid creator campaigns, has an influencer budget line.',
        sourceUrl: 'linkedin.com/company/terra-active/posts/creator-recap',
        sourceType: 'LinkedIn post',
        retrievedAt: '2026-07-09',
        excerpt:
          '"Recap: our spring creator campaign drove 3 weeks of studio sign-ups. Doing it bigger for autumn."',
        confidence: 0.83,
      },
    ],
    stage: 'negotiating',
    qualifyReason: 'Physical retail moment + proven creator budget. Pricing is the open question.',
    conversationId: 'c2',
    discoveredAt: '2026-07-11',
  },
  {
    id: 'l3',
    company: 'Cadence Invest',
    niche: 'Fintech',
    staff: 80,
    location: 'CBD, Singapore',
    profile:
      'Consumer robo-advisor app. MAS-licensed. Runs seasonal acquisition pushes; currently planning a Chinese New Year money-habits campaign.',
    contact: {
      name: 'Marcus Lim',
      role: 'Growth Marketing Manager',
      linkedin: 'linkedin.com/in/marcus-lim-cadence',
    },
    fitScore: 79,
    fitBreakdown: { icpMatch: 80, spendSignal: 85, timing: 78, reachability: 74 },
    fitExplanation:
      'Consumer fintech with clear paid-acquisition muscle and a named upcoming campaign (CNY). Slightly lower ICP score because finance content needs careful creator vetting, a strength for our Trust Check angle.',
    confidence: 0.78,
    partnershipAngle:
      'Vet and shortlist SG finance/lifestyle creators for the CNY money-habits campaign, using Trust Check to screen for scam-adjacent accounts before outreach.',
    risks: [
      'Regulated space, creator claims need compliance review.',
      'Longer buying cycle than F&B; approvals go through a bigger team.',
    ],
    evidence: [
      {
        id: 'e-l3-1',
        claim: 'Planning a Chinese New Year acquisition campaign.',
        sourceUrl: 'linkedin.com/company/cadence-invest/posts/cny-brief',
        sourceType: 'LinkedIn post',
        retrievedAt: '2026-07-16',
        excerpt:
          '"Kicking off planning for our CNY money-habits campaign. If you make finance content in SG, we want to talk."',
        confidence: 0.88,
      },
      {
        id: 'e-l3-2',
        claim: 'Hiring across growth and performance marketing.',
        sourceUrl: 'linkedin.com/company/cadence-invest/jobs/perf-marketer',
        sourceType: 'Job posting',
        retrievedAt: '2026-07-15',
        excerpt: '"Two open roles: Performance Marketer and Lifecycle Marketer, Singapore."',
        confidence: 0.79,
      },
    ],
    stage: 'contacted',
    qualifyReason: 'Named campaign + acquisition budget. Compliance adds friction but Trust Check fits.',
    conversationId: 'c3',
    discoveredAt: '2026-07-17',
  },
  {
    id: 'l4',
    company: 'Marina Crest Hotels',
    niche: 'Travel',
    staff: 200,
    location: 'Marina Bay, Singapore',
    profile:
      'Boutique hotel group, 3 SG properties. Pushing a staycation + rooftop-dining story to the local market. Active on IG with a lifestyle/travel audience.',
    contact: {
      name: 'Serene Koh',
      role: 'Director of Marketing',
      linkedin: 'linkedin.com/in/serene-koh-marinacrest',
    },
    fitScore: 82,
    fitBreakdown: { icpMatch: 84, spendSignal: 88, timing: 72, reachability: 84 },
    fitExplanation:
      'Established consumer travel brand with real budget and a local staycation angle that maps perfectly to SG lifestyle creators. Timing scores lower (no hard launch date) but intent is high, already in a booked meeting.',
    confidence: 0.83,
    partnershipAngle:
      'Build a staycation creator programme: shortlist SG travel/food creators for rooftop-dining content, with a client-ready brief and UTM tracking per creator.',
    risks: [
      'Large org, procurement and multiple stakeholders.',
      'May expect white-label reporting (Brand Pro / Enterprise tier).',
    ],
    evidence: [
      {
        id: 'e-l4-1',
        claim: 'Promoting a staycation + rooftop-dining campaign to locals.',
        sourceUrl: 'linkedin.com/company/marina-crest-hotels/posts/staycation',
        sourceType: 'LinkedIn post',
        retrievedAt: '2026-07-08',
        excerpt:
          '"Singaporeans, the rooftop is yours this season. Staycation packages with dining credit, live now."',
        confidence: 0.85,
      },
      {
        id: 'e-l4-2',
        claim: 'Has worked with travel creators before.',
        sourceUrl: 'linkedin.com/company/marina-crest-hotels/posts/creator-stay',
        sourceType: 'Instagram',
        retrievedAt: '2026-07-07',
        excerpt: '"Loved having @sgwanderlust stay with us, swipe for the rooftop reel."',
        confidence: 0.81,
      },
    ],
    stage: 'meeting',
    qualifyReason: 'Budget + repeat creator activity + local angle. Meeting booked.',
    conversationId: 'c4',
    discoveredAt: '2026-07-07',
  },
  {
    id: 'l5',
    company: 'Lumière Skin',
    niche: 'Beauty',
    staff: 25,
    location: 'Tai Seng, Singapore',
    profile:
      'DTC skincare brand, SG-formulated. Sells via own site + Shopee. Building a barrier-repair serum launch and leaning into founder-led content.',
    contact: {
      name: 'Rachel Ong',
      role: 'Founder',
      linkedin: 'linkedin.com/in/rachel-ong-lumiere',
    },
    fitScore: 86,
    fitBreakdown: { icpMatch: 90, spendSignal: 80, timing: 88, reachability: 86 },
    fitExplanation:
      'DTC beauty is prime ICP: creator-led acquisition is the default channel. Founder is reachable and already posts, and a serum launch gives a concrete campaign to build around.',
    confidence: 0.87,
    partnershipAngle:
      'Shortlist SG skincare & beauty micro-creators for the barrier-repair serum launch, screened with Trust Check for authentic engagement before gifting.',
    risks: [
      'Small team, founder wears every hat, may be slow to respond.',
      'Crowded beauty niche; creator rates run high.',
    ],
    evidence: [
      {
        id: 'e-l5-1',
        claim: 'Preparing a barrier-repair serum launch.',
        sourceUrl: 'linkedin.com/company/lumiere-skin/posts/serum-teaser',
        sourceType: 'LinkedIn post',
        retrievedAt: '2026-07-20',
        excerpt:
          '"18 months of formulation. Our barrier-repair serum is almost here. Creator gifting list opens soon."',
        confidence: 0.89,
      },
      {
        id: 'e-l5-2',
        claim: 'Founder-led, creator-native go-to-market.',
        sourceUrl: 'linkedin.com/in/rachel-ong-lumiere/recent-activity',
        sourceType: 'LinkedIn post',
        retrievedAt: '2026-07-18',
        excerpt: '"Every bottle we ship, a creator tried first. That is the whole model."',
        confidence: 0.82,
      },
    ],
    stage: 'queued',
    qualifyReason: 'DTC beauty + imminent launch + reachable founder. Draft is in the approval queue.',
    conversationId: 'c5',
    discoveredAt: '2026-07-20',
  },
  {
    id: 'l6',
    company: 'Fiordilatte Gelato',
    niche: 'F&B',
    staff: 18,
    location: 'Tiong Bahru, Singapore',
    profile:
      'Artisan gelato brand, 2 outlets. Seasonal flavours, strong walk-in following. Testing a durian-season limited flavour with local buzz.',
    contact: {
      name: 'Daniela Rossi',
      role: 'Co-founder',
      linkedin: 'linkedin.com/in/daniela-rossi-fiordilatte',
    },
    fitScore: 74,
    fitBreakdown: { icpMatch: 82, spendSignal: 62, timing: 84, reachability: 70 },
    fitExplanation:
      'Great niche and timing (seasonal flavour drop) but spend signal is soft, small team, mostly organic reach today. A good fit for the Starter plan and a low-lift first campaign.',
    confidence: 0.72,
    partnershipAngle:
      'Pair the durian-season flavour with a handful of SG food creators for tasting content; keep it lean on the Starter plan.',
    risks: [
      'Limited budget, likely Starter tier only.',
      'Relies on organic word-of-mouth; may not see the need yet.',
    ],
    evidence: [
      {
        id: 'e-l6-1',
        claim: 'Launching a seasonal durian flavour with local anticipation.',
        sourceUrl: 'linkedin.com/company/fiordilatte-gelato/posts/durian-season',
        sourceType: 'Instagram',
        retrievedAt: '2026-07-19',
        excerpt: '"Durian season gelato returns next week. You already know the queue."',
        confidence: 0.8,
      },
    ],
    stage: 'scored',
    qualifyReason: 'Right niche and timing; small budget puts it on the Starter path.',
    discoveredAt: '2026-07-19',
  },
  {
    id: 'l7',
    company: 'Hive Collective',
    niche: 'Retail',
    staff: 120,
    location: 'CBD + Paya Lebar, Singapore',
    profile:
      'Coworking chain, 4 SG locations. Community-led brand, hosts events. Marketing skews B2B (memberships) with some consumer lifestyle content.',
    contact: {
      name: 'Josh Tan',
      role: 'Community & Marketing Lead',
      linkedin: 'linkedin.com/in/josh-tan-hive',
    },
    fitScore: 61,
    fitBreakdown: { icpMatch: 58, spendSignal: 64, timing: 55, reachability: 68 },
    fitExplanation:
      'Borderline ICP: consumer-adjacent but membership sales are B2B, which dilutes creator fit. No live campaign signal. Worth nurturing, not prioritising.',
    confidence: 0.64,
    partnershipAngle:
      'If they run a members-lifestyle push, local lifestyle creators could showcase the spaces, but no active trigger yet.',
    risks: [
      'B2B membership motion, not a consumer campaign.',
      'No launch or seasonal signal detected.',
    ],
    evidence: [
      {
        id: 'e-l7-1',
        claim: 'Community events, but marketing is membership-led (B2B).',
        sourceUrl: 'linkedin.com/company/hive-collective/posts/community',
        sourceType: 'Company page',
        retrievedAt: '2026-07-13',
        excerpt: '"New members get their first month of the hot-desk plan free. Book a tour."',
        confidence: 0.7,
      },
    ],
    stage: 'scored',
    qualifyReason: 'Nurture, do not prioritise, no active consumer campaign.',
    discoveredAt: '2026-07-13',
  },
  {
    id: 'l8',
    company: 'Tiffin Room Group',
    niche: 'F&B',
    staff: 90,
    location: '5 concepts across Singapore',
    profile:
      'Modern-hawker restaurant group, 5 concepts. Reopening a flagship with a refreshed menu. Consistent IG presence, food-media friendly.',
    contact: {
      name: 'Aisyah Rahman',
      role: 'Marketing Manager',
      linkedin: 'linkedin.com/in/aisyah-rahman-tiffin',
    },
    fitScore: 77,
    fitBreakdown: { icpMatch: 85, spendSignal: 70, timing: 80, reachability: 74 },
    fitExplanation:
      'Multi-concept F&B group with a flagship reopening, solid timing and reach. Spend signal is moderate; they do food-media invites but less paid creator work so far.',
    confidence: 0.75,
    partnershipAngle:
      'Creator programme for the flagship reopening: shortlist SG food creators, match to each concept, and brief a first-week content push.',
    risks: [
      'Leans on earned food-media coverage; may undervalue paid creators.',
      'Multiple concepts complicate a single brief.',
    ],
    evidence: [
      {
        id: 'e-l8-1',
        claim: 'Reopening a flagship with a refreshed menu.',
        sourceUrl: 'linkedin.com/company/tiffin-room-group/posts/flagship-reopen',
        sourceType: 'LinkedIn post',
        retrievedAt: '2026-07-16',
        excerpt: '"Our flagship reopens in three weeks. New menu, same soul. Save the date."',
        confidence: 0.84,
      },
    ],
    stage: 'queued',
    qualifyReason: 'Flagship reopening is a clean trigger; queued for outreach.',
    discoveredAt: '2026-07-16',
  },
  {
    id: 'l9',
    company: 'Pawgen',
    niche: 'Retail',
    staff: 12,
    location: 'Joo Chiat, Singapore',
    profile:
      'Mobile pet-grooming startup. App-booked home visits. Early-stage, mostly founder-run marketing, growing via referrals.',
    contact: {
      name: 'Nabil Hassan',
      role: 'Founder',
      linkedin: 'linkedin.com/in/nabil-hassan-pawgen',
    },
    fitScore: 58,
    fitBreakdown: { icpMatch: 60, spendSignal: 40, timing: 62, reachability: 70 },
    fitExplanation:
      'Consumer brand and reachable founder, but under the ICP spend threshold: 12 staff, referral-led growth, no visible creator budget. Revisit after a funding or launch signal.',
    confidence: 0.66,
    partnershipAngle:
      'Pet creators are a strong SG niche, but there is no budget signal yet, revisit if they raise or launch a campaign.',
    risks: [
      'Below ICP staff/spend threshold.',
      'Referral-led; no evidence of paid marketing.',
    ],
    evidence: [
      {
        id: 'e-l9-1',
        claim: 'Early-stage, referral-led growth with no paid-marketing signal.',
        sourceUrl: 'linkedin.com/company/pawgen/posts/referral',
        sourceType: 'Company page',
        retrievedAt: '2026-07-12',
        excerpt: '"Refer a friend, both of you get a free nail trim. Word of mouth is our whole plan."',
        confidence: 0.72,
      },
    ],
    stage: 'rejected',
    rejectReason: 'Under ICP spend threshold, 12 staff, referral-led, no creator budget. Revisit on a funding/launch signal.',
    discoveredAt: '2026-07-12',
  },
]

export const seedConversations: Conversation[] = [
  {
    id: 'c1',
    leadId: 'l1',
    stage: 'replied',
    modeOverride: 'inherit',
    owner: 'agent',
    summary:
      'Reached out on the Uji matcha launch. Wei Ling (Head of Marketing) replied warm, wants to see how the shortlist and match score work, asked for examples this week.',
    nextFollowUp: undefined,
    unread: true,
    activity: [
      { id: 'a-c1-1', ts: '2026-07-15T09:12:00+08:00', text: 'Outreach auto-sent after policy check (Autonomous).' },
      { id: 'a-c1-2', ts: '2026-07-16T14:03:00+08:00', text: 'Incoming reply classified: Interested (0.90).' },
      { id: 'a-c1-3', ts: '2026-07-16T14:03:30+08:00', text: 'Thread summary regenerated.' },
    ],
  },
  {
    id: 'c2',
    leadId: 'l2',
    stage: 'negotiating',
    modeOverride: 'inherit',
    owner: 'agent',
    summary:
      'Priya (Brand Lead) is interested for the Somerset pop-up but asked directly about plan pricing. Pricing questions are escalated, a drafted reply is waiting in Approvals for human review.',
    nextFollowUp: undefined,
    unread: true,
    activity: [
      { id: 'a-c2-1', ts: '2026-07-12T10:30:00+08:00', text: 'Outreach auto-sent after policy check (Autonomous).' },
      { id: 'a-c2-2', ts: '2026-07-13T11:48:00+08:00', text: 'Incoming reply classified: Pricing question (0.88).' },
      { id: 'a-c2-3', ts: '2026-07-13T11:48:20+08:00', text: 'Escalated to Approvals: Pricing negotiation → human review.' },
    ],
  },
  {
    id: 'c3',
    leadId: 'l3',
    stage: 'contacted',
    modeOverride: 'inherit',
    owner: 'agent',
    summary:
      'Opened with the CNY money-habits campaign and the Trust Check angle for vetting finance creators. No reply yet. Follow-up scheduled.',
    nextFollowUp: 'Tue 10:00',
    unread: false,
    activity: [
      { id: 'a-c3-1', ts: '2026-07-18T09:05:00+08:00', text: 'Outreach auto-sent after policy check (Autonomous).' },
      { id: 'a-c3-2', ts: '2026-07-18T09:05:10+08:00', text: 'Follow-up scheduled for Tue 10:00 (cadence: 3 business days).' },
    ],
  },
  {
    id: 'c4',
    leadId: 'l4',
    stage: 'meeting',
    modeOverride: 'inherit',
    owner: 'human',
    summary:
      'You took over after Serene (Director of Marketing) replied. A 30-min intro call is booked for Thu to scope a staycation creator programme. Agent sends are paused while you own the thread.',
    nextFollowUp: undefined,
    unread: false,
    activity: [
      { id: 'a-c4-1', ts: '2026-07-10T15:20:00+08:00', text: 'Outreach auto-sent after policy check (Autonomous).' },
      { id: 'a-c4-2', ts: '2026-07-11T09:40:00+08:00', text: 'Incoming reply classified: Interested (0.86).' },
      { id: 'a-c4-3', ts: '2026-07-11T10:02:00+08:00', text: 'Owner → You (takeover). Scheduled follow-ups cancelled.' },
      { id: 'a-c4-4', ts: '2026-07-11T10:15:00+08:00', text: 'You sent a message. Meeting booked for Thu.' },
    ],
  },
  {
    id: 'c5',
    leadId: 'l5',
    stage: 'queued',
    modeOverride: 'inherit',
    owner: 'agent',
    summary:
      'Outreach drafted for the barrier-repair serum launch. Global mode is Human approval, so the draft is waiting in Approvals, nothing has been sent.',
    nextFollowUp: undefined,
    unread: false,
    activity: [
      { id: 'a-c5-1', ts: '2026-07-21T16:40:00+08:00', text: 'Draft generated: selected angle, checked 2 evidence items.' },
      { id: 'a-c5-2', ts: '2026-07-21T16:40:30+08:00', text: 'Routed to Approvals (Human approval mode): Initial outreach.' },
    ],
  },
]

export const seedMessages: Message[] = [
  // ---- c1 Kōri Matcha (replied, positive) ----
  {
    id: 'm-c1-1',
    conversationId: 'c1',
    author: 'agent',
    text:
      'Hi Wei Ling, saw Kōri just put the Uji matcha line on the TikTok menu drop. If you are lining up creators for it, Influencees can shortlist SG F&B micro-creators by real engagement (tracked from IG/TikTok, not follower count) and run a match score against the launch. Worth a 15-min look this week?',
    ts: '2026-07-15T09:12:00+08:00',
    status: 'delivered',
  },
  {
    id: 'm-c1-2',
    conversationId: 'c1',
    author: 'contact',
    text:
      'Hi, good timing, we are pulling a creator list together for the drop right now and it is mostly manual DMs. How does the match score work, and can you show a couple of examples for F&B? This week works.',
    ts: '2026-07-16T14:03:00+08:00',
    status: 'delivered',
    intent: 'Interested',
    confidence: 0.9,
  },

  // ---- c2 Terra Active (pricing escalation) ----
  {
    id: 'm-c2-1',
    conversationId: 'c2',
    author: 'agent',
    text:
      'Hi Priya, saw Terra Active is opening the Somerset pop-up for the autumn drop. For launch week we can match values-aligned SG fitness and lifestyle creators and compare them side by side on real engagement and audience overlap. Would a short intro this week be useful?',
    ts: '2026-07-12T10:30:00+08:00',
    status: 'delivered',
  },
  {
    id: 'm-c2-2',
    conversationId: 'c2',
    author: 'contact',
    text:
      'This is relevant, the pop-up is our big autumn moment. Before we book time: what do your plans cost, and is there a tier that fits a single campaign push rather than an ongoing subscription? Budgets are tight this quarter.',
    ts: '2026-07-13T11:48:00+08:00',
    status: 'delivered',
    intent: 'Pricing question',
    confidence: 0.88,
  },

  // ---- c3 Cadence Invest (contacted, follow-up scheduled) ----
  {
    id: 'm-c3-1',
    conversationId: 'c3',
    author: 'agent',
    text:
      'Hi Marcus, saw Cadence is planning the CNY money-habits campaign. For regulated finance content, we can shortlist SG creators and screen them with Trust Check first (scam-adjacent and bot signals) before you brief anyone. Happy to send a sample shortlist, worth a look?',
    ts: '2026-07-18T09:05:00+08:00',
    status: 'delivered',
  },

  // ---- c4 Marina Crest (human-owned, meeting) ----
  {
    id: 'm-c4-1',
    conversationId: 'c4',
    author: 'agent',
    text:
      'Hi Serene, the Marina Crest rooftop staycation push is a natural fit for SG travel and food creators. We can build a shortlist matched to the local-staycation angle with a client-ready brief and per-creator UTM tracking. Would an intro call be useful?',
    ts: '2026-07-10T15:20:00+08:00',
    status: 'delivered',
  },
  {
    id: 'm-c4-2',
    conversationId: 'c4',
    author: 'contact',
    text:
      'Yes, we are actively looking for help here. Reporting matters to us; we need something we can hand to ownership. Can we set up a call?',
    ts: '2026-07-11T09:40:00+08:00',
    status: 'delivered',
    intent: 'Interested',
    confidence: 0.86,
  },
  {
    id: 'm-c4-3',
    conversationId: 'c4',
    author: 'human',
    text:
      'Absolutely, Serene. Branded, client-ready reporting is standard on our side. Does Thu 3pm work for a 30-min scope call? I will send a calendar hold.',
    ts: '2026-07-11T10:15:00+08:00',
    status: 'sent',
  },

  // ---- c5 Lumière (pending outreach draft, not sent) ----
  {
    id: 'm-c5-1',
    conversationId: 'c5',
    author: 'agent',
    text:
      'Hi Rachel, saw the barrier-repair serum is close and that Lumière ships creator-first. For the gifting round we can shortlist SG skincare micro-creators and screen them with Trust Check for authentic engagement before you send product. Would a sample shortlist be helpful?',
    ts: '2026-07-21T16:40:00+08:00',
    status: 'draft',
  },
]

export const seedApprovals: Approval[] = [
  {
    id: 'ap-c2',
    conversationId: 'c2',
    leadId: 'l2',
    draftText:
      'Hi Priya, totally fair to check on cost first. Plans start at Brand Starter ($49/mo) for a single campaign with discovery, Trust Check and a match score; Growth ($119/mo) adds Ai-kyo, UTM and advanced analytics if you want the full workflow. For a one-off pop-up push, Starter covers it, happy to walk through what fits your autumn budget on a quick call.',
    reasonKind: 'escalation',
    reason: 'Pricing negotiation → human review',
    citesEvidenceIds: ['e-l2-1'],
    createdAt: '2026-07-13T11:48:20+08:00',
    status: 'pending',
  },
  {
    id: 'ap-c5',
    conversationId: 'c5',
    leadId: 'l5',
    draftText:
      'Hi Rachel, saw the barrier-repair serum is close and that Lumière ships creator-first. For the gifting round we can shortlist SG skincare micro-creators and screen them with Trust Check for authentic engagement before you send product. Would a sample shortlist be helpful?',
    reasonKind: 'outreach',
    reason: 'Initial outreach',
    citesEvidenceIds: ['e-l5-1', 'e-l5-2'],
    createdAt: '2026-07-21T16:40:30+08:00',
    status: 'pending',
  },
]

export const seedAgentEvents: AgentEvent[] = [
  { id: 'ev-1', ts: '2026-07-07T11:00:00+08:00', type: 'discovery', text: 'Discovered Marina Crest Hotels (Travel), fit 82.', leadId: 'l4' },
  { id: 'ev-2', ts: '2026-07-10T15:20:00+08:00', type: 'send', text: 'Auto-sent outreach to Marina Crest Hotels after policy check.', leadId: 'l4' },
  { id: 'ev-3', ts: '2026-07-11T10:02:00+08:00', type: 'mode', text: 'Owner of Marina Crest thread → You (takeover). Follow-ups cancelled.', leadId: 'l4' },
  { id: 'ev-4', ts: '2026-07-12T10:30:00+08:00', type: 'send', text: 'Auto-sent outreach to Terra Active after policy check.', leadId: 'l2' },
  { id: 'ev-5', ts: '2026-07-13T11:48:20+08:00', type: 'approval', text: 'Terra Active reply escalated to Approvals: Pricing negotiation → human review.', leadId: 'l2' },
  { id: 'ev-6', ts: '2026-07-15T09:12:00+08:00', type: 'send', text: 'Auto-sent outreach to Kōri Matcha Bar after policy check.', leadId: 'l1' },
  { id: 'ev-7', ts: '2026-07-16T14:03:00+08:00', type: 'reply', text: 'Kōri Matcha Bar replied, classified Interested (0.90).', leadId: 'l1' },
  { id: 'ev-8', ts: '2026-07-18T09:05:00+08:00', type: 'send', text: 'Auto-sent outreach to Cadence Invest; follow-up scheduled Tue 10:00.', leadId: 'l3' },
  { id: 'ev-9', ts: '2026-07-21T16:40:30+08:00', type: 'draft', text: 'Drafted outreach to Lumière Skin → routed to Approvals (Human approval mode).', leadId: 'l5' },
]
