import type { PublicProfile, SearchResultProfile, UserSettings } from "@/types/profile";
import type { DetailedStats, StatOverview } from "@/types/stats";
import type { PlatformStats } from "@/types/platform";
import type {
  AdvancedInsights,
  AnalyticsRange,
  Benchmark,
  OverviewMetrics,
  PerformanceTrends,
  PlatformComparisonEntry,
  RatingTimelinePoint,
} from "@/types/analytics";

async function unwrap<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function searchProfiles(query: string) {
  return unwrap<{ results: SearchResultProfile[] }>(await fetch(`/api/profiles/search?q=${encodeURIComponent(query)}`));
}

export async function getPublicProfile(
  username: string,
  options: { refresh?: boolean; staleMinutes?: number; signal?: AbortSignal } = {}
) {
  const search = new URLSearchParams();
  if (options.refresh) search.set("refresh", "1");
  if (typeof options.staleMinutes === "number") search.set("staleMinutes", String(options.staleMinutes));
  const qs = search.toString();

  return unwrap<{ profile: PublicProfile; isAuthenticated: boolean }>(
    await fetch(`/api/profiles/${encodeURIComponent(username)}${qs ? `?${qs}` : ""}`, { signal: options.signal })
  );
}

export async function getMyStats() {
  return unwrap<{
    profile?: { username: string; fullName: string; bio: string };
    overview: StatOverview;
    platformStats: PlatformStats[];
    detailedStats: DetailedStats;
  }>(
    await fetch("/api/stats")
  );
}

export async function getSettings() {
  return unwrap<{ settings: UserSettings }>(await fetch("/api/settings"));
}

export async function updateSettings(settings: UserSettings) {
  return unwrap<{ settings: UserSettings }>(
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    })
  );
}

/* --------------------------------------------------------------- analytics */

export async function getAnalyticsOverview(signal?: AbortSignal) {
  return unwrap<{ metrics: OverviewMetrics }>(
    await fetch("/api/analytics/overview", { signal })
  );
}

export async function getPerformanceTrends(signal?: AbortSignal) {
  return unwrap<{ trends: PerformanceTrends }>(
    await fetch("/api/analytics/trends", { signal })
  );
}

export async function getPlatformComparison(signal?: AbortSignal) {
  return unwrap<{ comparison: PlatformComparisonEntry[] }>(
    await fetch("/api/analytics/comparison", { signal })
  );
}

export async function getRatingTimeline(signal?: AbortSignal) {
  return unwrap<{ timeline: RatingTimelinePoint[] }>(
    await fetch("/api/analytics/rating-timeline", { signal })
  );
}

export async function getAdvancedInsights(
  options: {
    range?: AnalyticsRange;
    platform?: string;
    benchmark?: Benchmark;
  } = {},
  signal?: AbortSignal
) {
  const search = new URLSearchParams();
  if (options.range) search.set("range", options.range);
  if (options.platform) search.set("platform", options.platform);
  if (options.benchmark) search.set("benchmark", options.benchmark);
  const qs = search.toString();

  return unwrap<{ insights: AdvancedInsights | null }>(
    await fetch(`/api/analytics/advanced${qs ? `?${qs}` : ""}`, { signal })
  );
}
