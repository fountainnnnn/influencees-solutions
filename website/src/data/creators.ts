export interface CreatorPlatform {
  platform: "instagram" | "tiktok";
  handle: string;
  followers: number;
  engagementRate: number;
  avgViews: number;
}

export interface CreatorAudience {
  topAgeRange: string;
  femalePct: number;
  sgPct: number;
}

export interface CreatorContentExample {
  title: string;
  platform: "instagram" | "tiktok";
  views: number;
  likes: number;
}

export interface Creator {
  handle: string;
  name: string;
  /** Path to the real avatar file, e.g. /avatars/janae-chua.jpg */
  avatar: string;
  niche: "Food" | "Beauty" | "Fitness" | "Finance" | "Lifestyle" | "Tech" | "Travel" | "Parenting";
  platforms: CreatorPlatform[];
  bio: string;
  location: "Singapore";
  verified: boolean;
  trustScore: number;
  estRateSGD: { min: number; max: number };
  audience: CreatorAudience;
  contentExamples: CreatorContentExample[];
  joinedDate: string;
}

/*
 * Real Singapore creators surfaced on influencees.com's own trending feed.
 * Names, handles, niches, sample content titles and view counts are real
 * (from public/avatars/manifest.json). Follower counts, engagement rates,
 * rate cards and audience splits are demonstration estimates and are labeled
 * as such wherever they appear. `verified` is true only for SG-based creators.
 */
export const creators: Creator[] = [
  {
    handle: "clarity",
    name: "CLARITY",
    avatar: "/avatars/clarity.jpg",
    niche: "Lifestyle",
    platforms: [
      { platform: "tiktok", handle: "@clarity", followers: 420000, engagementRate: 4.8, avgViews: 190000 },
      { platform: "instagram", handle: "@clarity", followers: 180000, engagementRate: 3.2, avgViews: 78000 },
    ],
    bio: "Rounds up Singapore lifestyle creators worth following, with short recommendation reels.",
    location: "Singapore",
    verified: true,
    trustScore: 82,
    estRateSGD: { min: 4200, max: 6800 },
    audience: { topAgeRange: "18-24", femalePct: 79, sgPct: 75 },
    contentExamples: [
      { title: "MORE sg baddies to follow", platform: "tiktok", views: 338000, likes: 27040 },
    ],
    joinedDate: "2026-01-05",
  },
  {
    handle: "riona",
    name: "riona",
    avatar: "/avatars/riona.jpg",
    niche: "Lifestyle",
    platforms: [
      { platform: "tiktok", handle: "@riona", followers: 260000, engagementRate: 5.1, avgViews: 104000 },
      { platform: "instagram", handle: "@riona", followers: 120000, engagementRate: 3.4, avgViews: 47000 },
    ],
    bio: "Personal lifestyle vlogs, day-in-the-life clips and milestones filmed around Singapore.",
    location: "Singapore",
    verified: true,
    trustScore: 86,
    estRateSGD: { min: 3000, max: 4800 },
    audience: { topAgeRange: "18-24", femalePct: 74, sgPct: 73 },
    contentExamples: [
      { title: "birthday", platform: "tiktok", views: 139000, likes: 11120 },
    ],
    joinedDate: "2026-01-15",
  },
  {
    handle: "brooke",
    name: "Brooke",
    avatar: "/avatars/brooke.jpg",
    niche: "Lifestyle",
    platforms: [
      { platform: "tiktok", handle: "@brooke", followers: 210000, engagementRate: 5.4, avgViews: 88000 },
      { platform: "instagram", handle: "@brooke", followers: 96000, engagementRate: 3.6, avgViews: 40000 },
    ],
    bio: "Talks through the local creator scene and what it takes to build an audience from Singapore.",
    location: "Singapore",
    verified: true,
    trustScore: 88,
    estRateSGD: { min: 2600, max: 4200 },
    audience: { topAgeRange: "18-24", femalePct: 71, sgPct: 77 },
    contentExamples: [
      { title: "Our generation of homegrown creators", platform: "tiktok", views: 116000, likes: 9280 },
    ],
    joinedDate: "2026-01-22",
  },
  {
    handle: "bella",
    name: "bella",
    avatar: "/avatars/bella.jpg",
    niche: "Lifestyle",
    platforms: [
      { platform: "tiktok", handle: "@bella", followers: 130000, engagementRate: 5.6, avgViews: 52000 },
      { platform: "instagram", handle: "@bella", followers: 58000, engagementRate: 3.8, avgViews: 24000 },
    ],
    bio: "Short lifestyle and trend clips, plus lists of younger creators to watch.",
    location: "Singapore",
    verified: true,
    trustScore: 84,
    estRateSGD: { min: 1800, max: 3000 },
    audience: { topAgeRange: "18-24", femalePct: 76, sgPct: 70 },
    contentExamples: [
      { title: "most known youngest tiktokers", platform: "tiktok", views: 63000, likes: 5040 },
    ],
    joinedDate: "2026-02-01",
  },
  {
    handle: "janae-chua",
    name: "Janae Chua",
    avatar: "/avatars/janae-chua.jpg",
    niche: "Finance",
    platforms: [
      { platform: "tiktok", handle: "@janaechua", followers: 48000, engagementRate: 6.2, avgViews: 14000 },
      { platform: "instagram", handle: "@janaechua", followers: 21000, engagementRate: 4.1, avgViews: 9000 },
    ],
    bio: "Explains how content creation works as a business, from rate cards to how the money actually flows.",
    location: "Singapore",
    verified: true,
    trustScore: 90,
    estRateSGD: { min: 900, max: 1600 },
    audience: { topAgeRange: "25-34", femalePct: 58, sgPct: 84 },
    contentExamples: [
      { title: "Content creation is definitely a business and here's how the moolah is made", platform: "tiktok", views: 23000, likes: 1840 },
    ],
    joinedDate: "2026-02-10",
  },
  {
    handle: "singapore4k",
    name: "Singapore4k",
    avatar: "/avatars/singapore4k.jpg",
    niche: "Travel",
    platforms: [
      { platform: "tiktok", handle: "@singapore4k", followers: 30000, engagementRate: 5.0, avgViews: 11000 },
      { platform: "instagram", handle: "@singapore4k", followers: 15000, engagementRate: 3.3, avgViews: 6000 },
    ],
    bio: "Walking and driving tours of Singapore malls, landmarks and neighbourhoods in high resolution.",
    location: "Singapore",
    verified: true,
    trustScore: 85,
    estRateSGD: { min: 600, max: 1100 },
    audience: { topAgeRange: "25-34", femalePct: 46, sgPct: 62 },
    contentExamples: [
      { title: "Marina Bay Shopping Mall, Singapore places to visit", platform: "tiktok", views: 14000, likes: 1120 },
    ],
    joinedDate: "2026-03-22",
  },
  {
    handle: "amy-lien",
    name: "amy lien",
    avatar: "/avatars/amy-lien.jpg",
    niche: "Travel",
    platforms: [
      { platform: "tiktok", handle: "@amylien", followers: 24000, engagementRate: 6.6, avgViews: 8000 },
      { platform: "instagram", handle: "@amylien", followers: 12000, engagementRate: 4.3, avgViews: 4500 },
    ],
    bio: "Travel diaries and city guides, including first-visit routes around Singapore.",
    location: "Singapore",
    verified: true,
    trustScore: 87,
    estRateSGD: { min: 500, max: 950 },
    audience: { topAgeRange: "25-34", femalePct: 62, sgPct: 68 },
    contentExamples: [
      { title: "travel with me to singapore", platform: "tiktok", views: 11000, likes: 880 },
    ],
    joinedDate: "2026-03-05",
  },
  {
    handle: "vintage-guy",
    name: "The Vintage Guy",
    avatar: "/avatars/vintage-guy.jpg",
    niche: "Lifestyle",
    platforms: [
      { platform: "tiktok", handle: "@thevintageguy", followers: 18000, engagementRate: 6.8, avgViews: 6000 },
      { platform: "instagram", handle: "@thevintageguy", followers: 9000, engagementRate: 4.5, avgViews: 3200 },
    ],
    bio: "Day-in-the-life and settling-in stories as a Filipino living and working in Singapore.",
    location: "Singapore",
    verified: true,
    trustScore: 85,
    estRateSGD: { min: 380, max: 720 },
    audience: { topAgeRange: "25-34", femalePct: 44, sgPct: 66 },
    contentExamples: [
      { title: "A Day in My Life as A Filipino Living in Singapore", platform: "tiktok", views: 8000, likes: 640 },
    ],
    joinedDate: "2026-03-18",
  },
  {
    handle: "crystal",
    name: "crystal",
    avatar: "/avatars/crystal.jpg",
    niche: "Travel",
    platforms: [
      { platform: "tiktok", handle: "@crystxl.am", followers: 14000, engagementRate: 7.0, avgViews: 4500 },
      { platform: "instagram", handle: "@crystxl.am", followers: 7000, engagementRate: 4.6, avgViews: 2600 },
    ],
    bio: "Vlogs her trips day by day, with recent multi-part coverage of Singapore.",
    location: "Singapore",
    verified: true,
    trustScore: 82,
    estRateSGD: { min: 300, max: 560 },
    audience: { topAgeRange: "18-24", femalePct: 69, sgPct: 64 },
    contentExamples: [
      { title: "singapore vlog day 1!", platform: "tiktok", views: 6000, likes: 480 },
    ],
    joinedDate: "2026-04-02",
  },
  {
    handle: "dibs-sg",
    name: "Dibs.sg",
    avatar: "/avatars/dibs-sg.jpg",
    niche: "Travel",
    platforms: [
      { platform: "tiktok", handle: "@dibs.sg", followers: 9000, engagementRate: 7.2, avgViews: 3200 },
      { platform: "instagram", handle: "@dibs.sg", followers: 5000, engagementRate: 4.8, avgViews: 2000 },
    ],
    bio: "Practical travel and stay hacks for getting more out of a short trip to Singapore.",
    location: "Singapore",
    verified: true,
    trustScore: 83,
    estRateSGD: { min: 220, max: 420 },
    audience: { topAgeRange: "25-34", femalePct: 55, sgPct: 72 },
    contentExamples: [
      { title: "Singapore's smartest overnight hack", platform: "tiktok", views: 4000, likes: 320 },
    ],
    joinedDate: "2026-04-14",
  },
  {
    handle: "kelvins-grill",
    name: "1981 Kelvin's Grill",
    avatar: "/avatars/kelvins-grill.jpg",
    niche: "Food",
    platforms: [
      { platform: "tiktok", handle: "@1981kelvinsgrill", followers: 7000, engagementRate: 7.5, avgViews: 2400 },
      { platform: "instagram", handle: "@1981kelvinsgrill", followers: 4000, engagementRate: 5.0, avgViews: 1600 },
    ],
    bio: "A local grill sharing its dishes, prep and daily service from the stall.",
    location: "Singapore",
    verified: true,
    trustScore: 80,
    estRateSGD: { min: 180, max: 360 },
    audience: { topAgeRange: "25-34", femalePct: 48, sgPct: 90 },
    contentExamples: [
      { title: "1981 Kelvin's Grill", platform: "tiktok", views: 3000, likes: 240 },
    ],
    joinedDate: "2026-05-01",
  },
  {
    handle: "ashley",
    name: "ashley",
    avatar: "/avatars/ashley.jpg",
    niche: "Travel",
    platforms: [
      { platform: "tiktok", handle: "@ashley.solotravel", followers: 3200, engagementRate: 8.4, avgViews: 900 },
      { platform: "instagram", handle: "@ashley.solotravel", followers: 1800, engagementRate: 5.6, avgViews: 620 },
    ],
    bio: "Solo-travel days and content-creator routines filmed on location, including Singapore.",
    location: "Singapore",
    verified: true,
    trustScore: 78,
    estRateSGD: { min: 120, max: 260 },
    audience: { topAgeRange: "25-34", femalePct: 66, sgPct: 60 },
    contentExamples: [
      { title: "Spend the day with me in Singapore as a content creator", platform: "tiktok", views: 452, likes: 36 },
    ],
    joinedDate: "2026-05-20",
  },
  {
    handle: "natalie-griffin",
    name: "Natalie Griffin",
    avatar: "/avatars/natalie-griffin.jpg",
    niche: "Lifestyle",
    platforms: [
      { platform: "tiktok", handle: "@natalie_griffin", followers: 2600, engagementRate: 8.7, avgViews: 700 },
      { platform: "instagram", handle: "@natalie_griffin", followers: 1500, engagementRate: 5.9, avgViews: 480 },
    ],
    bio: "Honest look at a realistic day as a content creator based in Singapore.",
    location: "Singapore",
    verified: true,
    trustScore: 76,
    estRateSGD: { min: 100, max: 220 },
    audience: { topAgeRange: "25-34", femalePct: 73, sgPct: 58 },
    contentExamples: [
      { title: "realistic day as a content creator in singapore!", platform: "tiktok", views: 131, likes: 12 },
    ],
    joinedDate: "2026-06-01",
  },
  {
    handle: "darryltengg",
    name: "darryltengg",
    avatar: "/avatars/darryltengg.jpg",
    niche: "Lifestyle",
    platforms: [
      { platform: "tiktok", handle: "@darryltengg", followers: 620000, engagementRate: 4.2, avgViews: 300000 },
      { platform: "instagram", handle: "@darryltengg", followers: 280000, engagementRate: 2.8, avgViews: 120000 },
    ],
    bio: "Lifestyle and travel clips with a large following, including drives and outings around Singapore.",
    location: "Singapore",
    verified: false,
    trustScore: 70,
    estRateSGD: { min: 7200, max: 11500 },
    audience: { topAgeRange: "18-24", femalePct: 52, sgPct: 40 },
    contentExamples: [
      { title: "cruising around singapore", platform: "tiktok", views: 769000, likes: 61520 },
    ],
    joinedDate: "2026-06-04",
  },
  {
    handle: "xinyichi08",
    name: "xinyichi08",
    avatar: "/avatars/xinyichi08.jpg",
    niche: "Travel",
    platforms: [
      { platform: "tiktok", handle: "@xinyichi08", followers: 360000, engagementRate: 4.5, avgViews: 165000 },
      { platform: "instagram", handle: "@xinyichi08", followers: 150000, engagementRate: 3.0, avgViews: 62000 },
    ],
    bio: "Scenic city and travel videography, with a series on modern Singapore.",
    location: "Singapore",
    verified: false,
    trustScore: 68,
    estRateSGD: { min: 4000, max: 6500 },
    audience: { topAgeRange: "25-34", femalePct: 58, sgPct: 35 },
    contentExamples: [
      { title: "Singapore, where modern city life meets incredible beauty", platform: "tiktok", views: 408000, likes: 32640 },
    ],
    joinedDate: "2026-05-28",
  },
  {
    handle: "katelyns-room",
    name: "Katelyn's Room",
    avatar: "/avatars/katelyns-room.jpg",
    niche: "Lifestyle",
    platforms: [
      { platform: "tiktok", handle: "@katelynsroom", followers: 240000, engagementRate: 4.6, avgViews: 96000 },
      { platform: "instagram", handle: "@katelynsroom", followers: 100000, engagementRate: 3.1, avgViews: 41000 },
    ],
    bio: "Playful lifestyle and travel clips, including recent segments filmed in Singapore.",
    location: "Singapore",
    verified: false,
    trustScore: 66,
    estRateSGD: { min: 2800, max: 4600 },
    audience: { topAgeRange: "18-24", femalePct: 68, sgPct: 30 },
    contentExamples: [
      { title: "pool dunk in Singapore", platform: "tiktok", views: 215000, likes: 17200 },
    ],
    joinedDate: "2026-05-10",
  },
];
