"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/layout/PageContainer";
import { ProfileResultCard } from "@/components/search/ProfileResultCard";
import { useSearchProfiles } from "@/hooks/useSearchProfiles";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = useMemo(() => searchParams.get("q") ?? "", [searchParams]);
  const { results, loading, error } = useSearchProfiles(query);

  return (
    <PageContainer className="py-10">
      <h1 className="text-3xl font-semibold">Search Profiles</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Query: <span className="text-foreground">{query || "(all)"}</span>
      </p>

      {loading ? <p className="mt-8 text-sm text-muted-foreground">Loading...</p> : null}
      {error ? <p className="mt-8 text-sm text-destructive">{error}</p> : null}
      {!loading && !error && results.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">No profiles found for this query.</p>
      ) : null}

      <div className="mt-6 grid gap-4">
        {results.map((profile) => (
          <ProfileResultCard key={profile.username} profile={profile} />
        ))}
      </div>
    </PageContainer>
  );
}
