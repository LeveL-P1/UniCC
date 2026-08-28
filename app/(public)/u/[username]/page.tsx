"use client";

import { use } from "react";
import Link from "next/link";

import { AnalyticsSection } from "@/components/profile/AnalyticsSection";
import { PlatformCardsGrid } from "@/components/profile/PlatformCardsGrid";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsOverview } from "@/components/profile/StatsOverview";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-header";
import { Reveal } from "@/components/motion/Reveal";
import { usePublicProfile } from "@/hooks/usePublicProfile";

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const { profile, isAuthenticated, loading, error, refreshing } =
    usePublicProfile(username);

  if (loading) {
    return (
      <div className="frame flex flex-col gap-10 py-16">
        <div className="flex items-center gap-5">
          <div className="size-20 animate-pulse rounded-pill bg-carbon" />
          <div className="flex flex-col gap-3">
            <div className="h-3 w-16 animate-pulse rounded-full bg-carbon" />
            <div className="h-9 w-56 animate-pulse rounded-full bg-carbon" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-24 animate-pulse rounded-card bg-carbon" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="frame flex min-h-[60svh] flex-col items-center justify-center py-20 text-center">
        <Eyebrow>Not found</Eyebrow>
        <h1 className="mt-4 text-heading font-light text-chalk">
          No profile for @{username}
        </h1>
        <p className="mt-4 max-w-[44ch] text-body-sm text-ash">
          {error ?? "That handle has not been indexed yet."}
        </p>
        <div className="mt-8 flex gap-2">
          <Button asChild>
            <Link href="/search">Search profiles</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">Back home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="frame flex flex-col gap-14 py-14 lg:py-20">
      {refreshing ? (
        <p className="font-mono text-caption uppercase tracking-[0.12em] text-smoke">
          Refreshing latest stats…
        </p>
      ) : null}

      <ProfileHeader profile={profile} />

      <Reveal>
        <StatsOverview overview={profile.overview} />
      </Reveal>

      <Reveal>
        <PlatformCardsGrid platforms={profile.platformStats} />
      </Reveal>

      <Reveal>
        <AnalyticsSection
          detailedStats={profile.detailedStats}
          unlocked={isAuthenticated}
        />
      </Reveal>
    </div>
  );
}
