import type { PlatformStats } from "@/types/platform";
import type { DetailedStats, StatOverview } from "@/types/stats";

export interface UserSettings {
  notifications: {
    weeklySummary: boolean;
    profileViews: boolean;
    ratingAlerts: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private";
    showInSearch: boolean;
  };
}

export interface PublicProfile {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  avatarUrl?: string;
  socials: {
    github?: string;
    twitter?: string;
    website?: string;
  };
  overview: StatOverview;
  platformStats: PlatformStats[];
  detailedStats: DetailedStats;
  isOwner: boolean;
}

export interface SearchResultProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  shortBio?: string;
  totalSolved: number;
  topPlatform: string;
}
