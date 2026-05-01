"use client";

import { use } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { AnalyticsSection } from "@/components/profile/AnalyticsSection";
import { PlatformCardsGrid } from "@/components/profile/PlatformCardsGrid";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { StatsOverview } from "@/components/profile/StatsOverview";
import { usePublicProfile } from "@/hooks/usePublicProfile";

export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { profile, isAuthenticated, loading, error } = usePublicProfile(username);

  if (loading) {
    return <PageContainer className="py-10 text-sm text-muted-foreground">Loading profile...</PageContainer>;
  }

  if (error || !profile) {
    return <PageContainer className="py-10 text-sm text-destructive">{error ?? "Profile not found"}</PageContainer>;
  }

  return (
    <PageContainer className="space-y-6 py-8">
      <ProfileHeader profile={profile} />
      <StatsOverview overview={profile.overview} />
      <PlatformCardsGrid platforms={profile.platformStats} />
      <AnalyticsSection detailedStats={profile.detailedStats} unlocked={isAuthenticated} />
    </PageContainer>
  );
}
