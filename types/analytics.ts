/**
 * Response shapes for /api/analytics/*. These mirror lib/analytics/service.ts —
 * keep them in step when the service changes.
 */

export type PlatformName =
  | "LEETCODE"
  | "CODEFORCES"
  | "CODECHEF"
  | "GEEKSFORGEEKS"
  | "HACKERRANK"
  | "ATCODER"
  | "OTHER";

export type AnalyticsRange = "30d" | "90d" | "180d" | "365d";
export type Benchmark = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface OverviewMetrics {
  totalSolved: number;
  syncedSolved: number;
  manualSolved: number;
  activeDays: number;
  averageProblemsPerDay: number;
  strongestPlatform: PlatformName | null;
  totalSessions: number;
  totalTimeMinutes: number;
  byDifficulty: { easy: number; medium: number; hard: number };
}

export interface TrendBucket {
  problemsSolved: number;
  timeSpentMinutes: number;
  sessions: number;
}

export interface PerformanceTrends {
  weekly: TrendBucket;
  monthly: TrendBucket;
}

export interface PlatformComparisonEntry {
  platform: PlatformName;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  rating: number | null;
  lastUpdatedAt: string;
}

export interface RatingTimelinePoint {
  platform: PlatformName;
  date: string;
  rating: number | null;
  contestName: string | null;
}

export interface TopicCount {
  topic: string;
  count: number;
}

export interface AdvancedInsights {
  filters: {
    range: AnalyticsRange;
    platform: PlatformName | "ALL";
    benchmark: Benchmark;
  };
  metrics: {
    /** 0-100. Falls as focus spreads across more platforms. */
    consistencyScore: number;
    /** Pearson r between weekly practice volume and weekly contest output. */
    contestPracticeCorrelation: number;
    velocityPerWeek: number;
    plateauDetected: boolean;
    difficultyMix: { easy: number; medium: number; hard: number };
  };
  strengths: TopicCount[];
  weaknesses: TopicCount[];
  benchmark: {
    targetVelocityPerWeek: number;
    currentVelocityPerWeek: number;
    onTrack: boolean;
  };
}
