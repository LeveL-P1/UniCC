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
  const [insights, setInsights] = useState<AdvancedInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getAdvancedInsights({ range, platform, benchmark }, controller.signal)
      .then((response) => setInsights(response.insights))
      .catch((cause) => {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : "Could not load insights");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [range, platform, benchmark]);

  return { insights, loading, error };
}
