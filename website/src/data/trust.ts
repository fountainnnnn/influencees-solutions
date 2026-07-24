export interface TrustSignal {
  name: string;
  status: "live" | "soon";
  description: string;
}

export interface TrustReportSignal {
  name: string;
  score0to100: number;
  finding: string;
}

export interface TrustReport {
  url: string;
  overallVerdict: string;
  riskLevel: "low" | "medium" | "high";
  signals: TrustReportSignal[];
}

export const trustSignals: TrustSignal[] = [
  {
    name: "AI thumbnail detection",
    status: "live",
    description: "Estimates whether the post thumbnail contains AI-generated or materially altered imagery.",
  },
  {
    name: "AI model detection",
    status: "live",
    description: "Identifies visual patterns associated with a likely image-generation model.",
  },
  {
    name: "Visual AI analysis",
    status: "live",
    description: "Checks frames for inconsistent text, faces, objects, lighting, and scene geometry.",
  },
  {
    name: "Caption and scam signals",
    status: "live",
    description: "Checks captions for Singapore investment-scam, phishing, impersonation, and urgency patterns.",
  },
  {
    name: "AI content indicators",
    status: "live",
    description: "Reviews hashtags and disclosure language for signs that generated content was used.",
  },
  {
    name: "Account signals",
    status: "live",
    description: "Checks usernames and profile details for bot-like naming and impersonation patterns.",
  },
  {
    name: "Engagement authenticity",
    status: "soon",
    description: "Will assess comments, likes, and view patterns for evidence of purchased engagement.",
  },
  {
    name: "Account history",
    status: "soon",
    description: "Will compare profile changes and earlier posts for abrupt shifts in identity or topic.",
  },
];

export const sampleReport: TrustReport = {
  url: "https://www.tiktok.com/@sgreturns_daily/video/0000000000000000000",
  overallVerdict: "Likely investment scam. The post impersonates a Singapore financial institution and directs viewers to an unverified messaging account.",
  riskLevel: "high",
  signals: [
    {
      name: "Caption and scam signals",
      score0to100: 97,
      finding: "The caption promises guaranteed weekly returns, sets a two-hour deadline, and requests contact through Telegram.",
    },
    {
      name: "Visual AI analysis",
      score0to100: 89,
      finding: "The presenter has inconsistent lip movement and the bank logo changes shape between adjacent frames.",
    },
    {
      name: "AI thumbnail detection",
      score0to100: 86,
      finding: "The thumbnail is likely generated or heavily altered; small text and facial details contain repeated artefacts.",
    },
    {
      name: "AI model detection",
      score0to100: 78,
      finding: "Frame texture and face synthesis patterns are consistent with a consumer video-generation model.",
    },
    {
      name: "AI content indicators",
      score0to100: 72,
      finding: "The post uses generic finance hashtags and omits any synthetic-media disclosure.",
    },
    {
      name: "Account signals",
      score0to100: 93,
      finding: "The account name imitates a local finance brand, while the profile has no matching website or verified identity.",
    },
  ],
};
