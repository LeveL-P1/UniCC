"use client";

import * as React from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";

/**
 * The one place chromatic colour is allowed at structural scale: a 3px
 * vertical bar beside a number. Four accents, cycled in order. Do not
 * reach for these anywhere else in the system.
 */
export const SIGNALS = [
  "var(--color-signal-green)",
  "var(--color-signal-blue)",
  "var(--color-signal-orange)",
  "var(--color-signal-violet)",
] as const;

export type SignalIndex = 0 | 1 | 2 | 3;

interface StatProps {
  value: number | string;
  label: string;
  /** Which accent bar. Index into SIGNALS. */
  signal?: SignalIndex;
  /** Appended to the number without a gap: "%", "h", "x". */
  suffix?: string;
  hint?: string;
  decimals?: number;
  className?: string;
  /** Count up when scrolled into view. Only meaningful for numeric values. */
  animate?: boolean;
}

export function Stat({
  value,
  label,
  signal = 0,
  suffix,
  hint,
  decimals = 0,
  className,
  animate = true,
}: StatProps) {
  const numeric = typeof value === "number";

  return (
    <div className={cn("flex gap-4", className)}>
      <span
        aria-hidden
        className="mt-1.5 w-[3px] shrink-0 rounded-full"
        style={{ background: SIGNALS[signal], height: 40 }}
      />
      <div className="min-w-0">
        <p className="flex items-baseline font-light tabular-nums text-chalk">
          <span className="text-[40px] leading-none tracking-[-0.9px] md:text-[48px] md:tracking-[-1.1px]">
            {numeric && animate ? (
              <NumberTicker
                value={value}
                decimalPlaces={decimals}
                className="text-chalk tracking-[inherit]"
              />
            ) : (
              value
            )}
          </span>
          {suffix ? (
            <span className="text-[24px] leading-none text-ash">{suffix}</span>
          ) : null}
        </p>
        <p className="mt-3 text-body-sm text-bone">{label}</p>
        {hint ? <p className="mt-1 text-[12px] text-smoke">{hint}</p> : null}
      </div>
    </div>
  );
}

/** Compact variant for dense dashboard rows — no bar, mono label above. */
export function Metric({
  value,
  label,
  suffix,
  decimals = 0,
  animate = true,
  className,
}: Omit<StatProps, "signal" | "hint">) {
  const numeric = typeof value === "number";

  return (
    <div className={cn("min-w-0", className)}>
      <p className="eyebrow truncate">{label}</p>
      <p className="mt-2 flex items-baseline font-light tabular-nums text-chalk">
        <span className="text-[28px] leading-none tracking-[-0.6px]">
          {numeric && animate ? (
            <NumberTicker
              value={value}
              decimalPlaces={decimals}
              className="text-chalk tracking-[inherit]"
            />
          ) : (
            value
          )}
        </span>
        {suffix ? (
          <span className="text-[15px] leading-none text-ash">{suffix}</span>
        ) : null}
      </p>
    </div>
  );
}
