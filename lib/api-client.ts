import type { PublicProfile, SearchResultProfile, UserSettings } from "@/types/profile";
import type { DetailedStats, StatOverview } from "@/types/stats";
import type { PlatformStats } from "@/types/platform";

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
