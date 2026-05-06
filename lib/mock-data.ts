import type { PublicProfile, SearchResultProfile, UserSettings } from "@/types/profile";

const baseProfile: PublicProfile = {
  id: "usr_tourist",
  username: "tourist",
  fullName: "Gennady Korotkevich",
  bio: "Competitive programmer focused on contests and algorithms.",
  avatarUrl: "https://api.dicebear.com/9.x/initials/svg?seed=tourist",
  socials: {
    github: "https://github.com/tourist",
    website: "https://codeforces.com/profile/tourist",
  },
  overview: {
    totalSolved: 1247,
    bestRating: 3897,
    contestsAttended: 127,
  },
  platformStats: [
    { platform: "codeforces", handle: "tourist", valueLabel: "3897 rating", secondaryLabel: "Legendary Grandmaster" },
    { platform: "leetcode", handle: "tourist", valueLabel: "532 solved", secondaryLabel: "Top 0.5%" },
    { platform: "codechef", handle: "tourist", valueLabel: "2100 rating", secondaryLabel: "7 stars" },
    { platform: "atcoder", handle: "tourist", valueLabel: "3200 rating", secondaryLabel: "Grandmaster" },
  ],
  detailedStats: {
    heatmap: Array.from({ length: 28 }).map((_, i) => ({
      date: new Date(Date.now() - (27 - i) * 86400000).toISOString(),
      count: Math.floor(Math.random() * 5),
    })),
    ratingTimeline: Array.from({ length: 12 }).map((_, i) => ({
      date: new Date(Date.now() - (11 - i) * 7 * 86400000).toISOString(),
      label: `Week ${i + 1}`,
      rating: 3450 + i * 30,
    })),
    difficultyDistribution: {
      easy: 320,
      medium: 620,
      hard: 307,
    },
  },
  isOwner: false,
};

export const mockProfiles: PublicProfile[] = [
  baseProfile,
  {
    ...baseProfile,
    id: "usr_pawan",
    username: "pawan",
    fullName: "Pawan",
    bio: "Building consistent CP habits across platforms.",
    isOwner: true,
  },
  {
    ...baseProfile,
    id: "usr_errichto",
    username: "errichto",
    fullName: "Tomasz",
    bio: "Contest problem solving and educational content.",
    isOwner: false,
  },
];

export const mockSearchResults: SearchResultProfile[] = mockProfiles.map((p) => ({
  id: p.id,
  username: p.username,
  fullName: p.fullName,
  avatarUrl: p.avatarUrl,
  shortBio: p.bio,
  totalSolved: p.overview.totalSolved,
  topPlatform: p.platformStats[0]?.platform ?? "codeforces",
}));

export const defaultUserSettings: UserSettings = {
  notifications: {
    weeklySummary: true,
    profileViews: false,
    ratingAlerts: true,
  },
  privacy: {
    profileVisibility: "public",
    showInSearch: true,
  },
};
