"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAdvancedInsights,
  getAnalyticsOverview,
  getPerformanceTrends,
  getPlatformComparison,
  getRatingTimeline,
} from "@/lib/api-client";
import type {
  AdvancedInsights,
  AnalyticsRange,
  Benchmark,
  OverviewMetrics,
  PerformanceTrends,
  PlatformComparisonEntry,
  RatingTimelinePoint,
} from "@/types/analytics";

interface AnalyticsBundle {
  metrics: OverviewMetrics | null;
  trends: PerformanceTrends | null;
  comparison: PlatformComparisonEntry[];
  timeline: RatingTimelinePoint[];
}

/**
 * Pulls the four always-on analytics endpoints in parallel. They are
 * independently cached server-side, so one slow platform never blocks the rest
 * of the dashboard from painting.
 */
export function useAnalytics() {
  const [data, setData] = useState<AnalyticsBundle>({
    metrics: null,
    trends: null,
    comparison: [],
    timeline: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setError(null);
    try {
      const [overview, trends, comparison, timeline] = await Promise.all([
        getAnalyticsOverview(signal),
        getPerformanceTrends(signal),
        getPlatformComparison(signal),
        getRatingTimeline(signal),
      ]);

      setData({
        metrics: overview.metrics,
        trends: trends.trends,
        comparison: comparison.comparison ?? [],
        timeline: timeline.timeline ?? [],
      });
    } catch (cause) {
      if (signal?.aborted) return;
      setError(cause instanceof Error ? cause.message : "Could not load analytics");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { ...data, loading, error, refresh: () => load() };
}

/**
 * Advanced insights are filterable, so they refetch on their own rather than
 * riding along with the bundle above.
 */
export function useAdvancedInsights(options: {
  range: AnalyticsRange;
  platform: string;
  benchmark: Benchmark;
}) {
  const { range, platform, benchmark } = options;
  const key = `${range}|${platform}|${benchmark}`;

  /**
   * Results are stamped with the filter key they belong to, so `loading` is
   * derived rather than set synchronously inside the effect (which would
   * trigger a cascading render).
   */
  const [state, setState] = useState<{
    key: string;
    insights: AdvancedInsights | null;
    error: string | null;
  }>({ key: "", insights: null, error: null });

  useEffect(() => {
    const controller = new AbortController();

    getAdvancedInsights({ range, platform, benchmark }, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;
        setState({ key, insights: response.insights, error: null });
      })
      .catch((cause) => {
        if (controller.signal.aborted) return;
        setState({
          key,
          insights: null,
          error: cause instanceof Error ? cause.message : "Could not load insights",
        });
      });

    return () => controller.abort();
  }, [key, range, platform, benchmark]);

  return {
    insights: state.key === key ? state.insights : null,
    loading: state.key !== key,
    error: state.key === key ? state.error : null,
  };
}
