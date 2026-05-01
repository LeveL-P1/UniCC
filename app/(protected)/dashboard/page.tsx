"use client";

import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ActivityOverviewCard } from "@/components/dashboard/ActivityOverviewCard";
import { LinkPlatformCard } from "@/components/dashboard/LinkPlatformCard";
import { PlatformSyncCard } from "@/components/dashboard/PlatformSyncCard";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { usePlatformSync } from "@/hooks/usePlatformSync";
import { getMyStats } from "@/lib/api-client";
import { mockProfiles } from "@/lib/mock-data";
import type { DetailedStats, StatOverview } from "@/types/stats";
import type { PlatformStats } from "@/types/platform";

export default function DashboardPage() {
  const owner = mockProfiles.find((profile) => profile.isOwner) ?? mockProfiles[0];
  const { syncingPlatform, syncPlatform } = usePlatformSync();
  const [overview, setOverview] = useState<StatOverview>(owner.overview);
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>(owner.platformStats);
  const [detailed, setDetailed] = useState<DetailedStats>(owner.detailedStats);

  useEffect(() => {
    getMyStats()
      .then((data) => {
        setOverview(data.overview);
        setPlatformStats(data.platformStats);
        setDetailed(data.detailedStats);
      })
      .catch(() => {});
  }, []);

  return (
    <PageContainer className="py-8">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Create and manage your custom competitive programming profile.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <ProfileCard username={owner.username} fullName={owner.fullName} bio={owner.bio} />
        {platformStats.slice(0, 3).map((item) => (
          <PlatformSyncCard
            key={item.platform}
            item={item}
            syncing={syncingPlatform === item.platform}
            onSync={() => syncPlatform(item.platform.toUpperCase())}
          />
        ))}
        <LinkPlatformCard />
        <ActivityOverviewCard overview={overview} />
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">Activity Preview</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Last 7 days active count: {detailed.heatmap.slice(-7).reduce((acc, day) => acc + day.count, 0)}
        </p>
      </div>
    </PageContainer>
  );
}
