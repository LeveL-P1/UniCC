"use client";

import { useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RatingTimelinePoint } from "@/types/analytics";
import { EmptyNote } from "@/components/ui/empty-note";

/** One signal colour per platform. This is data viz, so colour is earned. */
const SIGNALS: Record<string, string> = {
  LEETCODE: "var(--color-signal-orange)",
  CODEFORCES: "var(--color-signal-blue)",
  CODECHEF: "var(--color-signal-violet)",
  ATCODER: "var(--color-signal-green)",
  HACKERRANK: "var(--color-graphite)",
  OTHER: "var(--color-smoke)",
};

const AXIS = {
  stroke: "transparent",
  tick: {
    fill: "#615f5c",
    fontSize: 10,
    fontFamily: "var(--font-jetbrains), monospace",
    letterSpacing: "0.06em",
  },
} as const;

export function RatingTimelineChart({
  timeline,
  height = 260,
}: {
  timeline: RatingTimelinePoint[];
  height?: number;
}) {
  const { rows, platforms } = useMemo(() => {
    const byDate = new Map<string, Record<string, string | number | null>>();
    const seen = new Set<string>();

    timeline.forEach((point) => {
      if (point.rating == null) return;
      const key = point.date.slice(0, 10);
      seen.add(point.platform);

      const row = byDate.get(key) ?? {
        key,
        label: new Date(point.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      };
      row[point.platform] = point.rating;
      byDate.set(key, row);
    });

    return {
      rows: [...byDate.values()].sort((a, b) =>
        String(a.key).localeCompare(String(b.key))
      ),
      platforms: [...seen],
    };
  }, [timeline]);

  if (!rows.length) {
    return (
      <EmptyNote
        title="No contest history yet"
        body="Rating points appear here once a connected platform reports a rated contest."
        height={height}
      />
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <CartesianGrid
            stroke="rgba(212,208,201,0.08)"
            strokeDasharray="0"
            vertical={false}
          />
          <XAxis dataKey="label" {...AXIS} tickLine={false} axisLine={false} minTickGap={28} />
          <YAxis
            {...AXIS}
            tickLine={false}
            axisLine={false}
            width={52}
            domain={["dataMin - 80", "dataMax + 80"]}
          />
          <Tooltip
            cursor={{ stroke: "rgba(212,208,201,0.2)" }}
            contentStyle={{
              background: "#141414",
              border: "1px solid rgba(212,208,201,0.12)",
              borderRadius: 10,
              fontSize: 12,
              color: "#d4d0c9",
              boxShadow: "0 1px 2px 0 rgba(0,0,0,0.6)",
            }}
            labelStyle={{
              color: "#878581",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          />
          {platforms.map((platform) => (
            <Line
              key={platform}
              type="monotone"
              dataKey={platform}
              stroke={SIGNALS[platform] ?? SIGNALS.OTHER}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        {platforms.map((platform) => (
          <li key={platform} className="flex items-center gap-2">
            <span
              className="size-1.5 rounded-full"
              style={{ background: SIGNALS[platform] ?? SIGNALS.OTHER }}
            />
            <span className="font-mono text-caption uppercase tracking-[0.1em] text-ash">
              {platform}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
