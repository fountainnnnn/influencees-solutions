export interface BrandPlan {
  name: "Starter" | "Growth" | "BrandPro" | "Enterprise";
  monthlyPriceUSD: number | null;
  annualPriceUSD: number | null;
  priceLabel: string;
  popular: boolean;
  tagline: string;
  features: string[];
  cta: string;
}

export interface CreatorPlan {
  name: "Starter" | "CreatorPro";
  monthlyPriceUSD: number;
  annualPriceUSD: number;
  priceLabel: string;
  tagline: string;
  features: string[];
  cta: string;
}

export interface ComparisonRow {
  provider: string;
  monthlyPrice: string;
  sgFocused: boolean;
  trustCheck: boolean;
  tiktokTCM: boolean;
  campaigns: boolean;
  aiTools: boolean;
}

export interface PricingFaq {
  q: string;
  a: string;
}

export const brandPlans: BrandPlan[] = [
  {
    name: "Starter",
    monthlyPriceUSD: 49,
    annualPriceUSD: 588,
    priceLabel: "$49/mo",
    popular: false,
    tagline: "For one active Singapore creator campaign.",
    features: [
      "1 active campaign",
      "Up to 10 creators",
      "Singapore creator discovery",
      "Trust Check access",
      "Creator match scores",
      "Basic campaign reports",
    ],
    cta: "Start with Starter",
  },
  {
    name: "Growth",
    monthlyPriceUSD: 119,
    annualPriceUSD: 1428,
    priceLabel: "$119/mo",
    popular: true,
    tagline: "For teams running several campaigns at once.",
    features: [
      "5 active campaigns",
      "Unlimited creator shortlists",
      "Ai-kyo campaign assistant",
      "UTM link tracking",
      "Advanced campaign analytics",
      "Instagram and TikTok exports",
    ],
    cta: "Choose Growth",
  },
  {
    name: "BrandPro",
    monthlyPriceUSD: 249,
    annualPriceUSD: 2988,
    priceLabel: "$249/mo",
    popular: false,
    tagline: "For in-house teams with ongoing creator work.",
    features: [
      "Unlimited campaigns",
      "TikTok Creator Marketplace tools",
      "3 team seats",
      "Branded client reports",
      "Priority support with 48-hour SLA",
      "Early access to new workspace features",
    ],
    cta: "Choose BrandPro",
  },
  {
    name: "Enterprise",
    monthlyPriceUSD: null,
    annualPriceUSD: null,
    priceLabel: "Custom",
    popular: false,
    tagline: "For larger teams that need controls and service terms.",
    features: [
      "Unlimited team seats",
      "White-label reporting",
      "Dedicated account manager",
      "Custom service-level agreement",
      "Team onboarding and training",
      "Workspace configuration review",
    ],
    cta: "Contact sales",
  },
];

export const creatorPlans: CreatorPlan[] = [
  {
    name: "Starter",
    monthlyPriceUSD: 0,
    annualPriceUSD: 0,
    priceLabel: "Free forever",
    tagline: "For joining the Singapore creator community.",
    features: [
      "Rate and review creator work",
      "Community badges and XP",
      "Creator leaderboard access",
      "Early feature access",
      "Public community profile",
    ],
    cta: "Join free",
  },
  {
    name: "CreatorPro",
    monthlyPriceUSD: 16,
    annualPriceUSD: 192,
    priceLabel: "$16/mo",
    tagline: "For managing creator work from one toolkit.",
    features: [
      "Live Instagram and TikTok stats dashboard",
      "Brand contact CRM",
      "Brief Analyzer",
      "Ai-kyo pitch templates",
      "Media kit with PDF export",
      "SGD rate card and benchmarks",
      "Content calendar",
      "Engagement-rate benchmarking",
    ],
    cta: "Apply for CreatorPro",
  },
];

export const comparisonTable: ComparisonRow[] = [
  { provider: "Influencees Growth", monthlyPrice: "$119", sgFocused: true, trustCheck: true, tiktokTCM: false, campaigns: true, aiTools: true },
  { provider: "Modash", monthlyPrice: "$300", sgFocused: false, trustCheck: false, tiktokTCM: false, campaigns: true, aiTools: true },
  { provider: "Heepsy", monthlyPrice: "$200", sgFocused: false, trustCheck: false, tiktokTCM: false, campaigns: true, aiTools: false },
  { provider: "Upfluence", monthlyPrice: "$480", sgFocused: false, trustCheck: false, tiktokTCM: true, campaigns: true, aiTools: true },
  { provider: "Agency retainer", monthlyPrice: "$1.5K-7K", sgFocused: true, trustCheck: false, tiktokTCM: false, campaigns: true, aiTools: false },
];

export const pricingFaqs: PricingFaq[] = [
  {
    q: "Are prices in Singapore dollars?",
    a: "No. Subscription prices are in USD. Creator rate estimates and campaign budgets can still be shown in SGD.",
  },
  {
    q: "Is annual billing discounted?",
    a: "The listed annual totals are 12 times the monthly price: $588 for Starter, $1,428 for Growth, $2,988 for BrandPro, and $192 for CreatorPro.",
  },
  {
    q: "What counts as an active campaign?",
    a: "A campaign remains active from shortlist creation until it is archived. Archived campaigns stay available for reporting.",
  },
  {
    q: "Can I add a creator who is not listed?",
    a: "Yes. Brand workspaces can add an off-platform creator to a campaign, but discovery remains limited to Singapore-based creators.",
  },
  {
    q: "Which platforms are supported?",
    a: "Influencees supports Instagram and TikTok. Other social platforms are not included in discovery or Trust Check.",
  },
  {
    q: "Is Creator Starter time-limited?",
    a: "No. Creator Starter is free forever. CreatorPro costs $16 per month or $192 per year.",
  },
];

