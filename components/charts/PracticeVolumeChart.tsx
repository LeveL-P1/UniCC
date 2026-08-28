"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyNote } from "@/components/ui/empty-note";

interface SessionPoint {
  date: string;
  problemsSolved: number;
}

const AXIS = {
  stroke: "transparent",
  tick: {
    fill: "#615f5c",
    fontSize: 10,
    fontFamily: "var(--font-jetbrains), monospace",
    letterSpacing: "0.06em",
  },
} as const;

/**
 * Daily practice volume over the trailing window. Bars are Bone, not
 * chromatic — this is a single series, so hue would carry no information.
 */
export function PracticeVolumeChart({
  sessions,
  days = 30,
  height = 200,
}: {
  sessions: SessionPoint[];
  days?: number;
  height?: number;
}) {
  const rows = useMemo(() => {
    const byDate = new Map<string, number>();
    sessions.forEach((session) => {
      const key = new Date(session.date).toISOString().split("T")[0];
      byDate.set(key, (byDate.get(key) ?? 0) + session.problemsSolved);
    });

    return Array.from({ length: days }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - index));
      const key = date.toISOString().split("T")[0];
      return {
        key,
        label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        problems: byDate.get(key) ?? 0,
      };
    });
  }, [sessions, days]);

  const total = rows.reduce((sum, row) => sum + row.problems, 0);

  if (total === 0) {
    return (
      <EmptyNote
        title="No sessions in this window"
        body="Log what you solve and the daily rhythm shows up here."
        height={height}
        action={{ label: "Log a session", href: "/sessions" }}
      />
    );
  }

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} margin={{ top: 8, right: 4, bottom: 0, left: -22 }}>
          <CartesianGrid
            stroke="rgba(212,208,201,0.08)"
            strokeDasharray="0"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            {...AXIS}
            tickLine={false}
            axisLine={false}
            minTickGap={40}
          />
          <YAxis {...AXIS} tickLine={false} axisLine={false} width={44} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: "rgba(212,208,201,0.05)" }}
            contentStyle={{
              background: "#141414",
              border: "1px solid rgba(212,208,201,0.12)",
              borderRadius: 10,
              fontSize: 12,
              color: "#d4d0c9",
            }}
            labelStyle={{
              color: "#878581",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          />
          <Bar
            dataKey="problems"
            fill="rgba(212,208,201,0.55)"
            radius={[2, 2, 0, 0]}
            maxBarSize={14}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
