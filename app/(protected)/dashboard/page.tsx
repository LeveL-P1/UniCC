"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Flame, Layers, Target } from "lucide-react";
import toast from "react-hot-toast";

import { Surface } from "@/components/ui/surface";
import { Metric } from "@/components/ui/stat";
import { Eyebrow } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { PlatformList } from "@/components/dashboard/PlatformList";
import { DifficultyMix } from "@/components/dashboard/DifficultyMix";
import { InsightsPanel } from "@/components/dashboard/InsightsPanel";
import { RatingTimelineChart } from "@/components/charts/RatingTimelineChart";
import { PracticeVolumeChart } from "@/components/charts/PracticeVolumeChart";
import { ActivityHeatmap } from "@/components/profile/ActivityHeatmap";
import { useAnalytics } from "@/hooks/useAnalytics";
import { usePlatformSync } from "@/hooks/usePlatformSync";
import { getMyStats } from "@/lib/api-client";
import type { HeatmapDay } from "@/types/stats";

const EMPTY_PROFILE = {
  username: "profile",
  fullName: "Your dashboard",
  bio: "Connect a platform or log a session to start building your profile.",
};

export default function DashboardPage() {
  const { metrics, comparison, timeline, loading, error, refresh } = useAnalytics();
  const { syncingPlatform, syncPlatform } = usePlatformSync();
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [heatmap, setHeatmap] = useState<HeatmapDay[]>([]);
  const [sessions, setSessions] = useState<
    { date: string; problemsSolved: number }[]
  >([]);

  useEffect(() => {
    getMyStats()
      .then((data) => {
        if (data.profile) setProfile(data.profile);
        setHeatmap(data.detailedStats?.heatmap ?? []);
      })
      .catch(() => {
        /* The dashboard still works on analytics alone. */
      });

    fetch("/api/sessions")
      .then((response) => response.json())
      .then((data) => setSessions(data.sessions ?? []))
      .catch(() => {
        /* Volume panel degrades to its empty state. */
      });
  }, []);

  const hours = useMemo(
    () => (metrics ? Math.round((metrics.totalTimeMinutes / 60) * 10) / 10 : 0),
    [metrics]
  );

  const onSync = async (platform: string) => {
    try {
      await syncPlatform(platform.toUpperCase());
      toast.success(`${platform.toLowerCase()} synced`);
      refresh();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Sync failed");
    }
  };

  const firstName = profile.fullName.split(" ")[0];

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
      {/* Header */}
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Eyebrow>
          <h1 className="mt-3 text-[24px] font-light leading-[1.15] tracking-[-0.48px] text-chalk md:text-[30px] md:tracking-[-0.6px]">
            Welcome back, {firstName}
          </h1>
          <p className="mt-3 max-w-[52ch] text-body-sm text-ash">
            Everything below is recomputed on each sync — no cached screenshots.
          </p>
        </div>

        <Button variant="ghost" size="lg" onClick={refresh} disabled={loading}>
          {loading ? "Refreshing…" : "Refresh"}
        </Button>
      </header>

      {error ? (
        <Surface className="flex items-center gap-3 border-destructive/30 py-4">
          <span className="size-1.5 shrink-0 rounded-full bg-destructive" />
          <p className="text-body-sm text-bone">{error}</p>
        </Surface>
      ) : null}

      {/* Metric row */}
      <RevealGroup className="grid gap-px overflow-hidden rounded-card bg-[rgba(212,208,201,0.12)] sm:grid-cols-2 lg:grid-cols-4">
        <RevealItem className="bg-carbon p-6">
          <MetricSlot
            icon={<Target size={14} />}
            label="Total solved"
            value={metrics?.totalSolved ?? 0}
            loading={loading}
          />
        </RevealItem>
        <RevealItem className="bg-carbon p-6">
          <MetricSlot
            icon={<Flame size={14} />}
            label="Active days"
            value={metrics?.activeDays ?? 0}
            loading={loading}
          />
        </RevealItem>
        <RevealItem className="bg-carbon p-6">
          <MetricSlot
            icon={<Layers size={14} />}
            label="Avg / active day"
            value={metrics?.averageProblemsPerDay ?? 0}
            decimals={1}
            loading={loading}
          />
        </RevealItem>
        <RevealItem className="bg-carbon p-6">
          <MetricSlot
            icon={<Clock size={14} />}
            label="Hours logged"
            value={hours}
            decimals={1}
            loading={loading}
          />
        </RevealItem>
      </RevealGroup>

      {/* Body */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ProfileCard
            username={profile.username}
            fullName={profile.fullName}
            bio={profile.bio}
          />

          <Surface>
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <div>
                <Eyebrow>Rating</Eyebrow>
                <h2 className="mt-2 text-subheading font-light text-chalk">
                  Every platform on one axis
                </h2>
              </div>
              <span className="font-mono text-caption text-smoke tabular-nums">
                {timeline.length} pts
              </span>
            </div>
            <RatingTimelineChart timeline={timeline} />
          </Surface>

          {/* Replaces the "activity heatmap coming soon" placeholder. */}
          <Surface>
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <div>
                <Eyebrow>Activity</Eyebrow>
                <h2 className="mt-2 text-subheading font-light text-chalk">
                  Daily rhythm
                </h2>
              </div>
            </div>
            <ActivityHeatmap days={heatmap} />
            <div className="mt-8 border-t border-[rgba(212,208,201,0.12)] pt-6">
              <Eyebrow>Volume — last 30 days</Eyebrow>
              <div className="mt-4">
                <PracticeVolumeChart sessions={sessions} />
              </div>
            </div>
          </Surface>

          <InsightsPanel />
        </div>

        <div className="flex flex-col gap-6">
          <PlatformList
            comparison={comparison}
            syncingPlatform={syncingPlatform}
            onSync={onSync}
          />

          <Surface>
            <Eyebrow>Difficulty mix</Eyebrow>
            <div className="mt-5">
              <DifficultyMix
                distribution={
                  metrics?.byDifficulty ?? { easy: 0, medium: 0, hard: 0 }
                }
              />
            </div>
          </Surface>

          <Surface>
            <Eyebrow>Sources</Eyebrow>
            <dl className="mt-5 flex flex-col gap-4">
              <SourceRow label="Synced from platforms" value={metrics?.syncedSolved ?? 0} />
              <SourceRow label="Logged manually" value={metrics?.manualSolved ?? 0} />
              <SourceRow label="Sessions recorded" value={metrics?.totalSessions ?? 0} />
            </dl>
          </Surface>
        </div>
      </div>
    </div>
  );
}

function MetricSlot({
  icon,
  label,
  value,
  decimals,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  decimals?: number;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="h-2.5 w-24 animate-pulse rounded-full bg-tar" />
        <div className="h-7 w-16 animate-pulse rounded-full bg-tar" />
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-3">
      <Metric value={value} label={label} decimals={decimals} />
      <span className="mt-0.5 text-smoke">{icon}</span>
    </div>
  );
}

function SourceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[13px] text-ash">{label}</dt>
      <dd className="font-mono text-[13px] text-bone tabular-nums">
        {value.toLocaleString()}
      </dd>
    </div>
  );
}
