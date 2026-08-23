import { Platform, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getAdapter } from "@/lib/integrations";
import type { PublicProfile, SearchResultProfile } from "@/types/profile";
import type { PlatformKey, PlatformStats } from "@/types/platform";
import type { HeatmapDay } from "@/types/stats";
import { AdapterError } from "@/lib/integrations/base";
import type { NormalizedPlatformStats } from "@/lib/sync/types";
import { clampRefreshMinutes, normalizeExternalHandle, parseExternalHandle } from "@/lib/validation/externalProfiles";

const DEFAULT_REFRESH_MINUTES = 6 * 60; // 6 hours

function normalizeHandle(input: string): string {
  return normalizeExternalHandle(input);
}

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
    default:
      return null;
  }
}

function buildHeatmap(days = 28): HeatmapDay[] {
  const out: HeatmapDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000).toISOString();
    out.push({ date, count: 0 });
  }
  return out;
}

function snapshotToPlatformStats(s: {
  platform: Platform;
  handle: string;
  rating: number | null;
  rank: string | null;
}): PlatformStats | null {
  const key = platformToKey(s.platform);
  if (!key) return null;
  const valueLabel =
    typeof s.rating === "number"
      ? `${s.rating} rating`
      : s.rank
        ? `${s.rank}`
        : "Synced";

  return {
    platform: key,
    handle: s.handle,
    valueLabel,
    secondaryLabel: s.rank ?? undefined,
  };
}

function toSearchResultProfile(profile: {
  id: string;
  primaryHandle: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  totalSolved: number;
  topPlatform: PlatformKey | null;
}): SearchResultProfile {
  return {
    id: profile.id,
    username: profile.primaryHandle,
    fullName: profile.displayName ?? profile.primaryHandle,
    avatarUrl: profile.avatarUrl ?? undefined,
    shortBio: profile.bio ?? undefined,
    totalSolved: profile.totalSolved,
    topPlatform: profile.topPlatform ?? "codeforces",
  };
}

export async function resolveExternalProfile(primaryHandle: string) {
  const handle = parseExternalHandle(primaryHandle);
  if (!handle) throw new Error("Invalid handle");

  return prisma.externalProfile.upsert({
    where: { primaryHandle: handle },
    update: {},
    create: {
      primaryHandle: handle,
      displayName: handle,
      bio: "Aggregated competitive programming stats across platforms.",
      avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(handle)}`,
    },
  });
}

export async function refreshExternalProfileSnapshots(
  externalProfileId: string,
  handle: string,
  options: { platforms?: Platform[] } = {}
) {
  const platforms =
    options.platforms ?? [Platform.CODEFORCES, Platform.LEETCODE, Platform.CODECHEF, Platform.ATCODER];

  const results = await Promise.all(
    platforms.map(async (platform) => {
      const adapter = getAdapter(platform);
      try {
        const normalized = await adapter.fetchStats(handle);
        await upsertSnapshot(externalProfileId, normalized);
        return { platform, success: true as const };
      } catch (err: unknown) {
        const parsed = parseAdapterError(err);
        await upsertSnapshotError(externalProfileId, platform, handle, parsed);
        return { platform, success: false as const, error: parsed };
      }
    })
  );

  await prisma.externalProfile.update({
    where: { id: externalProfileId },
    data: { lastRefreshedAt: new Date() },
  });

  return results;
}

function parseAdapterError(error: unknown): { code: string; message: string } {
  if (error instanceof AdapterError) return { code: error.code, message: error.message };
  if (error instanceof Error) return { code: "TEMP_FAILURE", message: error.message };
  return { code: "TEMP_FAILURE", message: "Unknown platform failure" };
}

async function upsertSnapshot(externalProfileId: string, normalized: NormalizedPlatformStats) {
  await prisma.externalPlatformSnapshot.upsert({
    where: {
      externalProfileId_platform: { externalProfileId, platform: normalized.platform },
    },
    update: {
      handle: normalized.handle,
      profileUrl: normalized.profileUrl,
      capturedAt: normalized.capturedAt,
      totalSolved: normalized.totalSolved,
      easySolved: normalized.difficulty?.easy,
      mediumSolved: normalized.difficulty?.medium,
      hardSolved: normalized.difficulty?.hard,
      rating: normalized.rating ?? null,
      rank: normalized.rank ?? null,
      ratings: normalized.ratings as unknown as Prisma.InputJsonValue,
      contests: normalized.contests as unknown as Prisma.InputJsonValue,
      rawSnapshot: normalized.raw as Prisma.InputJsonValue,
      lastError: null,
      lastErrorCode: null,
    },
    create: {
      externalProfileId,
      platform: normalized.platform,
      handle: normalized.handle,
      profileUrl: normalized.profileUrl,
      capturedAt: normalized.capturedAt,
      totalSolved: normalized.totalSolved,
      easySolved: normalized.difficulty?.easy,
      mediumSolved: normalized.difficulty?.medium,
      hardSolved: normalized.difficulty?.hard,
      rating: normalized.rating ?? null,
      rank: normalized.rank ?? null,
      ratings: normalized.ratings as unknown as Prisma.InputJsonValue,
      contests: normalized.contests as unknown as Prisma.InputJsonValue,
      rawSnapshot: normalized.raw as Prisma.InputJsonValue,
    },
  });
}

async function upsertSnapshotError(
  externalProfileId: string,
  platform: Platform,
  handle: string,
  err: { code: string; message: string }
) {
  await prisma.externalPlatformSnapshot.upsert({
    where: { externalProfileId_platform: { externalProfileId, platform } },
    update: {
      handle,
      capturedAt: new Date(),
      lastError: err.message,
      lastErrorCode: err.code,
    },
    create: {
      externalProfileId,
      platform,
      handle,
      capturedAt: new Date(),
      totalSolved: 0,
      lastError: err.message,
      lastErrorCode: err.code,
    },
  });
}

export async function getExternalProfilePublicView(
  identifier: string,
  options: { refresh?: boolean; staleMinutes?: number } = {}
): Promise<{ profile: PublicProfile; isAuthenticated: boolean }> {
  const handle = parseExternalHandle(identifier);
  if (!handle) throw new Error("Invalid handle");
  const external = await resolveExternalProfile(handle);

  const staleMinutes = clampRefreshMinutes(options.staleMinutes, DEFAULT_REFRESH_MINUTES);
  const staleBefore = new Date(Date.now() - staleMinutes * 60 * 1000);

  const latest = await prisma.externalPlatformSnapshot.findMany({
    where: { externalProfileId: external.id },
    orderBy: { capturedAt: "desc" },
  });

  const needsRefresh =
    options.refresh ||
    !external.lastRefreshedAt ||
    external.lastRefreshedAt < staleBefore ||
    latest.length === 0;

  if (needsRefresh) {
    await refreshExternalProfileSnapshots(external.id, external.primaryHandle);
  }

  const snapshots = await prisma.externalPlatformSnapshot.findMany({
    where: { externalProfileId: external.id },
    orderBy: { platform: "asc" },
  });

  return {
    profile: snapshotsToPublicProfile(external, snapshots),
    isAuthenticated: false,
  };
}

function snapshotsToPublicProfile(
  external: { id: string; primaryHandle: string; displayName: string | null; bio: string | null; avatarUrl: string | null },
  snapshots: Array<{
    platform: Platform;
    handle: string;
    totalSolved: number;
    rating: number | null;
    rank: string | null;
    easySolved: number | null;
    mediumSolved: number | null;
    hardSolved: number | null;
    contests: Prisma.JsonValue | null;
  }>
): PublicProfile {
  const platformStats: PlatformStats[] = snapshots
    .map((s) =>
      snapshotToPlatformStats({
        platform: s.platform,
        handle: s.handle,
        rating: s.rating,
        rank: s.rank,
      })
    )
    .filter((x): x is PlatformStats => Boolean(x));

  const totalSolved = snapshots.reduce((sum, s) => sum + (s.totalSolved ?? 0), 0);
  const bestRating = Math.max(0, ...snapshots.map((s) => s.rating ?? 0));
  const contestsAttended = snapshots.reduce((sum, s) => {
    const contests = Array.isArray(s.contests) ? s.contests : [];
    return sum + contests.length;
  }, 0);

  const easy = snapshots.reduce((sum, s) => sum + (s.easySolved ?? 0), 0);
  const medium = snapshots.reduce((sum, s) => sum + (s.mediumSolved ?? 0), 0);
  const hard = snapshots.reduce((sum, s) => sum + (s.hardSolved ?? 0), 0);

  return {
    id: external.id,
    username: external.primaryHandle,
    fullName: external.displayName ?? external.primaryHandle,
    bio: external.bio ?? "",
    avatarUrl: external.avatarUrl ?? undefined,
    socials: {
      website: undefined,
      github: undefined,
      twitter: undefined,
    },
    overview: {
      totalSolved,
      bestRating,
      contestsAttended,
    },
    platformStats,
    detailedStats: {
      heatmap: buildHeatmap(28),
      ratingTimeline: [],
      difficultyDistribution: { easy, medium, hard },
    },
    isOwner: false,
  };
}

export async function searchExternalProfiles(query: string, limit = 20): Promise<SearchResultProfile[]> {
  const q = normalizeHandle(query).toLowerCase();
  const take = Math.min(Math.max(limit, 1), 50);

  if (!q) {
    const profiles = await prisma.externalProfile.findMany({
      orderBy: { updatedAt: "desc" },
      take,
    });
    const withSolved = await Promise.all(
      profiles.map(async (p) => {
        const snapshots = await prisma.externalPlatformSnapshot.findMany({
          where: { externalProfileId: p.id },
          orderBy: { capturedAt: "desc" },
          distinct: ["platform"],
        });
        const totalSolved = snapshots.reduce((sum, s) => sum + s.totalSolved, 0);
        const top = snapshots.sort((a, b) => b.totalSolved - a.totalSolved)[0];
        return toSearchResultProfile({
          id: p.id,
          primaryHandle: p.primaryHandle,
          displayName: p.displayName,
          bio: p.bio,
          avatarUrl: p.avatarUrl,
          totalSolved,
          topPlatform: top ? platformToKey(top.platform) : null,
        });
      })
    );
    return withSolved;
  }

  // If we already have it cached, return it quickly; otherwise return empty
  // and let the UI navigate to /u/:handle which can refresh on demand.
  const profiles = await prisma.externalProfile.findMany({
    where: {
      OR: [
        { primaryHandle: { contains: q, mode: "insensitive" } },
        { displayName: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take,
  });

  const results = await Promise.all(
    profiles.map(async (p) => {
      const snapshots = await prisma.externalPlatformSnapshot.findMany({
        where: { externalProfileId: p.id },
        orderBy: { capturedAt: "desc" },
        distinct: ["platform"],
      });
      const totalSolved = snapshots.reduce((sum, s) => sum + s.totalSolved, 0);
      const top = snapshots.sort((a, b) => b.totalSolved - a.totalSolved)[0];
      return toSearchResultProfile({
        id: p.id,
        primaryHandle: p.primaryHandle,
        displayName: p.displayName,
        bio: p.bio,
        avatarUrl: p.avatarUrl,
        totalSolved,
        topPlatform: top ? platformToKey(top.platform) : null,
      });
    })
  );

  return results;
}
