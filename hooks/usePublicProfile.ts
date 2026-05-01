"use client";

import { useEffect, useState } from "react";
import type { PublicProfile } from "@/types/profile";
import { getPublicProfile } from "@/lib/api-client";

export function usePublicProfile(username: string) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getPublicProfile(username)
      .then((data) => {
        if (!active) return;
        setProfile(data.profile);
        setIsAuthenticated(data.isAuthenticated);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Failed to load profile");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [username]);

  return { profile, isAuthenticated, loading, error };
}
