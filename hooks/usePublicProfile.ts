"use client";

import { useEffect, useMemo, useState } from "react";
import type { PublicProfile } from "@/types/profile";
import { getPublicProfile } from "@/lib/api-client";

export function usePublicProfile(username: string) {
  const identifier = useMemo(() => username.trim(), [username]);
  const [state, setState] = useState<{
    identifier: string;
    profile: PublicProfile | null;
    isAuthenticated: boolean;
    error: string | null;
    refreshing: boolean;
  }>({ identifier: "__init__", profile: null, isAuthenticated: false, error: null, refreshing: false });

  const loading = state.identifier !== identifier;
  const profile = state.identifier === identifier ? state.profile : null;
  const isAuthenticated = state.identifier === identifier ? state.isAuthenticated : false;
  const error = state.identifier === identifier ? state.error : null;
  const refreshing = state.identifier === identifier ? state.refreshing : false;

  useEffect(() => {
    const ctrl = new AbortController();
    const refreshKey = `profile-refreshed:${identifier.toLowerCase()}`;
    const didRefresh = typeof window !== "undefined" && sessionStorage.getItem(refreshKey) === "1";

    // Fast path: load cached snapshot (no refresh) for quick UI.
    getPublicProfile(identifier, { signal: ctrl.signal })
      .then((data) => {
        setState({
          identifier,
          profile: data.profile,
          isAuthenticated: data.isAuthenticated,
          error: null,
          refreshing: !didRefresh,
        });

        // Background refresh: fetch across platforms without blocking render.
        if (didRefresh) return null;
        return getPublicProfile(identifier, { refresh: true, signal: ctrl.signal });
      })
      .then((data) => {
        if (!data) {
          setState((prev) => (prev.identifier === identifier ? { ...prev, refreshing: false } : prev));
          return;
        }
        try {
          sessionStorage.setItem(refreshKey, "1");
        } catch {
          // ignore
        }
        setState({
          identifier,
          profile: data.profile,
          isAuthenticated: data.isAuthenticated,
          error: null,
          refreshing: false,
        });
      })
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return;
        setState({
          identifier,
          profile: null,
          isAuthenticated: false,
          error: err instanceof Error ? err.message : "Failed to load profile",
          refreshing: false,
        });
      });

    return () => {
      ctrl.abort();
    };
  }, [identifier]);

  return { profile, isAuthenticated, loading, error, refreshing };
}
