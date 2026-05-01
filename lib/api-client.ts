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

export async function getPublicProfile(username: string) {
  return unwrap<{ profile: PublicProfile; isAuthenticated: boolean }>(await fetch(`/api/profiles/${username}`));
}

export async function getMyStats() {
  return unwrap<{ overview: StatOverview; platformStats: PlatformStats[]; detailedStats: DetailedStats }>(
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
