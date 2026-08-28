"use client";

import { motion } from "framer-motion";
import { EASE_OUT_EXPO } from "@/lib/motion";

const BANDS = [
  { key: "easy", label: "Easy", signal: "var(--color-signal-green)" },
  { key: "medium", label: "Medium", signal: "var(--color-signal-orange)" },
  { key: "hard", label: "Hard", signal: "var(--color-signal-violet)" },
] as const;

/**
 * A single stacked rule rather than a donut. Reads instantly, costs one line
 * of vertical space, and keeps colour confined to 6px of height.
 */
export function DifficultyMix({
  distribution,
}: {
  distribution: { easy: number; medium: number; hard: number };
}) {
  const total =
    distribution.easy + distribution.medium + distribution.hard || 0;

  return (
    <div>
      <div className="flex h-1.5 w-full gap-0.5 overflow-hidden rounded-full bg-tar">
        {total === 0 ? (
          <div className="h-full w-full bg-[rgba(212,208,201,0.08)]" />
        ) : (
          BANDS.map((band, index) => {
            const value = distribution[band.key];
            const pct = (value / total) * 100;
            if (pct === 0) return null;

            return (
              <motion.div
                key={band.key}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{
                  duration: 0.9,
                  delay: 0.1 + index * 0.08,
                  ease: EASE_OUT_EXPO,
                }}
                style={{ background: band.signal }}
                className="h-full first:rounded-l-full last:rounded-r-full"
              />
            );
          })
        )}
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-4">
        {BANDS.map((band) => (
          <div key={band.key}>
            <dt className="flex items-center gap-2">
              <span
                className="size-1.5 shrink-0 rounded-full"
                style={{ background: band.signal }}
              />
              <span className="font-mono text-caption uppercase tracking-[0.1em] text-ash">
                {band.label}
              </span>
            </dt>
            <dd className="mt-2 text-[22px] font-light leading-none text-chalk tabular-nums">
              {distribution[band.key].toLocaleString()}
            </dd>
            <dd className="mt-1.5 text-[11px] text-smoke tabular-nums">
              {total ? `${Math.round((distribution[band.key] / total) * 100)}%` : "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
