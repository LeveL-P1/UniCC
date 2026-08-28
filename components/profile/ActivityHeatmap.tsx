"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { HeatmapDay } from "@/types/stats";

/**
 * Activity heatmap. Monochrome by design — intensity is carried by Bone
 * opacity, not hue, so it stays inside the palette. Replaces the
 * "coming soon" placeholder the dashboard used to ship.
 */
const STEPS = [
  "rgba(212,208,201,0.06)",
  "rgba(212,208,201,0.18)",
  "rgba(212,208,201,0.34)",
  "rgba(212,208,201,0.56)",
  "rgba(212,208,201,0.85)",
];

const WEEKDAYS = ["M", "", "W", "", "F", "", ""];

export function ActivityHeatmap({ days }: { days: HeatmapDay[] }) {
  const { weeks, max, total } = useMemo(() => {
    const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
    const peak = sorted.reduce((acc, day) => Math.max(acc, day.count), 0);
    const sum = sorted.reduce((acc, day) => acc + day.count, 0);

    // Pad the leading partial week so columns line up with weekdays.
    const first = sorted[0] ? new Date(sorted[0].date) : new Date();
    const offset = (first.getDay() + 6) % 7; // Monday-first

    const cells: (HeatmapDay | null)[] = [
      ...Array.from({ length: offset }, () => null),
      ...sorted,
    ];

    const grouped: (HeatmapDay | null)[][] = [];
    for (let index = 0; index < cells.length; index += 7) {
      grouped.push(cells.slice(index, index + 7));
    }

    return { weeks: grouped, max: peak, total: sum };
  }, [days]);

  const level = (count: number) => {
    if (!count) return 0;
    if (max <= 1) return 4;
    return Math.min(4, Math.ceil((count / max) * 4));
  };

  if (!days.length) {
    return (
      <p className="text-[13px] text-smoke">
        No activity recorded in this window yet.
      </p>
    );
  }

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <div className="flex shrink-0 flex-col gap-1 pt-0.5">
          {WEEKDAYS.map((day, index) => (
            <span
              key={index}
              className="flex h-3 items-center font-mono text-[9px] leading-none text-smoke"
            >
              {day}
            </span>
          ))}
        </div>

        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) =>
                day ? (
                  <motion.span
                    key={day.date}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(weekIndex * 0.012, 0.4),
                    }}
                    title={`${new Date(day.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })} — ${day.count} solved`}
                    className="size-3 rounded-[2px]"
                    style={{ background: STEPS[level(day.count)] }}
                  />
                ) : (
                  <span key={`pad-${weekIndex}-${dayIndex}`} className="size-3" />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-smoke">
          {total} solved across {days.length} days
        </p>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[9px] text-smoke">Less</span>
          {STEPS.map((step) => (
            <span
              key={step}
              className="size-2.5 rounded-[2px]"
              style={{ background: step }}
            />
          ))}
          <span className="font-mono text-[9px] text-smoke">More</span>
        </div>
      </div>
    </div>
  );
}
