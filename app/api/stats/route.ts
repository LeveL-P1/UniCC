import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Platform } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getOverviewMetrics, getPlatformComparison, getRatingTimeline } from "@/lib/analytics/service";
import type { PlatformKey, PlatformStats } from "@/types/platform";

function platformToKey(platform: Platform): PlatformKey | null {
  switch (platform) {
    case Platform.CODEFORCES:
      return "codeforces";
    case Platform.LEETCODE:
      return "leetcode";
    case Platform.CODECHEF:
      return "codechef";
    case Platform.ATCODER:
      return "atcoder";
    case Platform.HACKERRANK:
      return "hackerrank";
    default:
      return null;
  }
}

function buildEmptyHeatmap(days = 28) {
  return Array.from({ length: days }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - index - 1));
    date.setHours(0, 0, 0, 0);
    return { date: date.toISOString(), count: 0 };
  });
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    return NextResponse.json({
      profile: {
        username: "profile",
        fullName: "Your Dashboard",
        bio: "Connect platforms or add sessions to start building your profile.",
      },
      overview: { totalSolved: 0, bestRating: 0, contestsAttended: 0 },
      platformStats: [],
      detailedStats: {
        heatmap: buildEmptyHeatmap(),
        ratingTimeline: [],
        difficultyDistribution: { easy: 0, medium: 0, hard: 0 },
      },
    });
  }

  const [metrics, comparison, ratingTimeline, sessionDays, contestCount] = await Promise.all([
    getOverviewMetrics(user.id),
    getPlatformComparison(user.id),
    getRatingTimeline(user.id),
    prisma.codingSession.groupBy({
      by: ["date"],
      where: {
        userId: user.id,
        date: { gte: new Date(Date.now() - 27 * 86400000) },
      },
      _sum: { problemsSolved: true },
    }),
    prisma.platformContestHistory.count({ where: { userId: user.id } }),
  ]);

  const bestRating = Math.max(0, ...ratingTimeline.map((point) => point.rating ?? 0));
  const platformStats: PlatformStats[] = comparison
    .map((item) => {
      const key = platformToKey(item.platform);
      if (!key) return null;
      return {
        platform: key,
        handle: item.platform.toLowerCase(),
        valueLabel: item.rating ? `${item.rating} rating` : `${item.totalSolved} solved`,
        secondaryLabel: `${item.totalSolved} solved`,
        syncedAt: item.lastUpdatedAt,
        syncStatus: "SUCCESS" as const,
      };
    })
    .filter((item): item is PlatformStats => Boolean(item));

  const dailyCounts = new Map(
    sessionDays.map((day) => [day.date.toISOString().split("T")[0], day._sum.problemsSolved ?? 0])
  );
  const heatmap = buildEmptyHeatmap().map((day) => ({
    ...day,
    count: dailyCounts.get(day.date.split("T")[0]) ?? 0,
  }));

  return NextResponse.json({
    profile: {
      username: user.name?.toLowerCase().replace(/[^a-z0-9_.-]/g, "") || user.clerkId,
      fullName: user.name ?? "Your Dashboard",
      bio: "Your unified competitive programming profile.",
    },
    overview: {
      totalSolved: metrics.totalSolved,
      bestRating,
      contestsAttended: contestCount,
    },
    platformStats,
    detailedStats: {
      heatmap,
      ratingTimeline: ratingTimeline
        .filter((point) => typeof point.rating === "number")
        .map((point) => ({
          date: point.date,
          label: point.contestName ?? point.platform,
          rating: point.rating ?? 0,
        })),
      difficultyDistribution: metrics.byDifficulty,
    },
  });
}
