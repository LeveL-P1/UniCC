"use client";

import { useEffect, useState } from "react";
import type { SearchResultProfile } from "@/types/profile";
import { searchProfiles } from "@/lib/api-client";

export function useSearchProfiles(query: string) {
  const [results, setResults] = useState<SearchResultProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    searchProfiles(query)
      .then((data) => {
        if (active) setResults(data.results);
      })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load search results");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

  return { results, loading, error };
}
