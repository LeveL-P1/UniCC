"use client";

import { useEffect, useState } from "react";
import { ActivityOverviewCard } from "@/components/dashboard/ActivityOverviewCard";
import { LinkPlatformCard } from "@/components/dashboard/LinkPlatformCard";
import { PlatformSyncCard } from "@/components/dashboard/PlatformSyncCard";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { usePlatformSync } from "@/hooks/usePlatformSync";
import { getMyStats } from "@/lib/api-client";
import { mockProfiles } from "@/lib/mock-data";
import { SectionCard } from "@/components/ui/SectionCard";
import { Sparkles, Calendar } from "lucide-react";
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <Sparkles size={14} />
            <span>Developer Overview</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{owner.fullName.split(' ')[0]}!</span>
          </h1>
          <p className="mt-2 text-neutral-400 max-w-lg">
            Track your coding progress across multiple platforms and showcase your achievements in one place.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-sm text-neutral-400">
          <Calendar size={16} />
          <span>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Main Stats Row */}
      <ActivityOverviewCard overview={overview} />

      {/* Secondary Row: Profile & Platforms */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile & Preview */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileCard username={owner.username} fullName={owner.fullName} bio={owner.bio} />
          
          <SectionCard 
            title="Activity Insights" 
            description="Recent performance metrics from your connected platforms."
          >
            <div className="h-[200px] flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
              <p className="text-neutral-500 text-sm">Activity heatmap visualization coming soon...</p>
            </div>
          </SectionCard>
        </div>

        {/* Right Column: Platform Syncing */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-500">Connected Profiles</h2>
            <span className="text-[10px] font-bold text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full uppercase">
              {platformStats.length} Platforms
            </span>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {platformStats.slice(0, 2).map((item) => (
              <PlatformSyncCard
                key={item.platform}
                item={item}
                syncing={syncingPlatform === item.platform}
                onSync={() => syncPlatform(item.platform.toUpperCase())}
              />
            ))}
            <LinkPlatformCard />
          </div>
        </div>
      </div>
    </div>
  );
}
