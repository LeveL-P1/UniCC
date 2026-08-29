"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TriangleAlert } from "lucide-react";

import { Surface, Tag } from "@/components/ui/surface";
import { Eyebrow } from "@/components/ui/section-header";
import { EmptyNote } from "@/components/ui/empty-note";
import { useAdvancedInsights } from "@/hooks/useAnalytics";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { AnalyticsRange, Benchmark } from "@/types/analytics";

const RANGES: AnalyticsRange[] = ["30d", "90d", "180d", "365d"];
const BENCHMARKS: Benchmark[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

/**
 * Surfaces lib/analytics/service.ts#getAdvancedInsights — consistency,
 * velocity against a chosen benchmark, the practice/contest correlation, and
 * plateau detection. All of this was already computed server-side and had
 * nowhere to land.
 */
export function InsightsPanel() {
  const [range, setRange] = useState<AnalyticsRange>("90d");
  const [benchmark, setBenchmark] = useState<Benchmark>("INTERMEDIATE");
  const { insights, loading, error } = useAdvancedInsights({
    range,
    platform: "ALL",
    benchmark,
  });

  const metrics = insights?.metrics;
  const target = insights?.benchmark.targetVelocityPerWeek ?? 0;
  const current = insights?.benchmark.currentVelocityPerWeek ?? 0;
  const progress = target > 0 ? Math.min(current / target, 1) : 0;

  return (
    <Surface className="flex flex-col gap-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Eyebrow>Insights</Eyebrow>
          <h2 className="mt-2 text-subheading font-light text-chalk">
            How the practice is going
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Segmented
            options={RANGES}
            value={range}
            onChange={(value) => setRange(value as AnalyticsRange)}
          />
        </div>
      </header>

      {error ? (
        <EmptyNote title="Insights unavailable" body={error} />
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="h-24 animate-pulse rounded-icon bg-tar" />
          ))}
        </div>
      ) : !insights ? (
        <EmptyNote
          title="Nothing to analyse yet"
          body="Log a session or sync a platform, and velocity, consistency and plateau detection start reporting here."
          action={{ label: "Log a session", href: "/sessions" }}
        />
      ) : (
        <>
          {/* Velocity against benchmark */}
          <section>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow">Velocity</p>
                <p className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-[34px] font-light leading-none text-chalk tabular-nums">
                    {current.toFixed(1)}
                  </span>
                  <span className="text-[13px] text-ash">problems / week</span>
                </p>
              </div>
              <div className="text-right">
                <p className="eyebrow">Target</p>
                <p className="mt-2 font-mono text-[13px] text-bone tabular-nums">
                  {target}/wk
                </p>
              </div>
            </div>

            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-tar">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 1, ease: EASE_OUT_EXPO }}
                className="h-full rounded-full"
                style={{
                  background: insights.benchmark.onTrack
                    ? "var(--color-signal-green)"
                    : "var(--color-signal-orange)",
                }}
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Segmented
                options={BENCHMARKS}
                value={benchmark}
                onChange={(value) => setBenchmark(value as Benchmark)}
                format={(value) => value.slice(0, 3)}
              />
              <p className="text-[12px] text-smoke">
                {insights.benchmark.onTrack
                  ? "On track for this benchmark."
                  : `${(target - current).toFixed(1)}/wk short of this benchmark.`}
              </p>
            </div>
          </section>

          {/* Derived metrics */}
          <section className="grid gap-5 border-t border-[rgba(212,208,201,0.12)] pt-8 sm:grid-cols-3">
            <Readout
              label="Consistency"
              value={`${metrics?.consistencyScore ?? 0}`}
              suffix="/100"
              hint="Falls as focus spreads across platforms"
            />
            <Readout
              label="Practice ↔ contest"
              value={formatCorrelation(metrics?.contestPracticeCorrelation)}
              hint="Pearson r, weekly volume vs contest output"
            />
            <Readout
              label="Trajectory"
              value={metrics?.plateauDetected ? "Plateau" : "Climbing"}
              icon={metrics?.plateauDetected ? TriangleAlert : TrendingUp}
              tone={metrics?.plateauDetected ? "warn" : "good"}
              hint="Based on the last three snapshots"
            />
          </section>

          {/* Topics */}
          {insights.strengths.length || insights.weaknesses.length ? (
            <section className="grid gap-6 border-t border-[rgba(212,208,201,0.12)] pt-8 sm:grid-cols-2">
              <TopicList title="Strongest topics" topics={insights.strengths} />
              <TopicList title="Least practised" topics={insights.weaknesses} />
            </section>
          ) : null}
        </>
      )}
    </Surface>
  );
}

function formatCorrelation(value?: number) {
  if (value == null || Number.isNaN(value)) return "—";
  return value.toFixed(2);
}

function Readout({
  label,
  value,
  suffix,
  hint,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  suffix?: string;
  hint?: string;
  icon?: typeof TrendingUp;
  tone?: "good" | "warn";
}) {
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-2 flex items-center gap-2">
        {Icon ? (
          <Icon
            size={15}
            className={cn(
              tone === "warn" ? "text-signal-orange" : "text-signal-green"
            )}
          />
        ) : null}
        <span className="text-[22px] font-light leading-none text-chalk tabular-nums">
          {value}
        </span>
        {suffix ? <span className="text-[13px] text-smoke">{suffix}</span> : null}
      </p>
      {hint ? <p className="mt-2 text-[11px] text-smoke">{hint}</p> : null}
    </div>
  );
}

function TopicList({ title, topics }: { title: string; topics: { topic: string; count: number }[] }) {
  return (
    <div>
      <p className="eyebrow">{title}</p>
      {topics.length ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {topics.map((item) => (
            <li key={item.topic}>
              <Tag className="normal-case">
                {item.topic}
                <span className="ml-1.5 text-smoke tabular-nums">{item.count}</span>
              </Tag>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-[12px] text-smoke">
          Tag your sessions with topics to populate this.
        </p>
      )}
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
  format,
}: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  format?: (value: string) => string;
}) {
  return (
    <div className="flex items-center gap-0.5 rounded-pill bg-tar p-0.5 hairline">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={cn(
              "relative rounded-pill px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors",
              active ? "text-obsidian" : "text-ash hover:text-bone"
            )}
          >
            {active ? (
              <motion.span
                layoutId={`segmented-${options.join("-")}`}
                className="absolute inset-0 rounded-pill bg-bone"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            ) : null}
            <span className="relative">{format ? format(option) : option}</span>
          </button>
        );
      })}
    </div>
  );
}
