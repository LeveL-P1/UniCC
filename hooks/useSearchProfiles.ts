"use client";

import { useEffect, useMemo, useState } from "react";
import type { SearchResultProfile } from "@/types/profile";
import { searchProfiles } from "@/lib/api-client";

export function useSearchProfiles(query: string) {
  const normalizedQuery = useMemo(() => query.trim(), [query]);
  const [state, setState] = useState<{
    query: string;
    results: SearchResultProfile[];
    error: string | null;
  }>({ query: "__init__", results: [], error: null });

  const loading = state.query !== normalizedQuery;
  const results = state.query === normalizedQuery ? state.results : [];
  const error = state.query === normalizedQuery ? state.error : null;

  useEffect(() => {
    let active = true;
    searchProfiles(normalizedQuery)
      .then((data) => {
        if (!active) return;
        setState({ query: normalizedQuery, results: data.results, error: null });
      })
      .catch((err: unknown) => {
        if (!active) return;
        setState({
          query: normalizedQuery,
          results: [],
          error: err instanceof Error ? err.message : "Failed to load search results",
        });
      });

    return () => {
      active = false;
    };
  }, [normalizedQuery]);

  return { results, loading, error };
}
