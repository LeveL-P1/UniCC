import type { DetailedStats } from "@/types/stats";
import { Surface } from "@/components/ui/surface";
import { Eyebrow } from "@/components/ui/section-header";
import { DifficultyMix } from "@/components/dashboard/DifficultyMix";
import { LimitedViewOverlay } from "@/components/profile/LimitedViewOverlay";
import { ActivityHeatmap } from "@/components/profile/ActivityHeatmap";

export function AnalyticsSection({
  detailedStats,
  unlocked,
}: {
  detailedStats: DetailedStats;
  unlocked: boolean;
}) {
  return (
    <section aria-labelledby="analytics-heading" className="relative">
      <div className="mb-6">
        <Eyebrow>Analytics</Eyebrow>
        <h2
          id="analytics-heading"
          className="mt-2 text-heading-sm font-light text-chalk"
        >
          The shape of the practice
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Surface>
          <Eyebrow>Activity</Eyebrow>
          <div className="mt-5">
            <ActivityHeatmap days={detailedStats.heatmap} />
          </div>
        </Surface>

        <Surface>
          <Eyebrow>Difficulty mix</Eyebrow>
          <div className="mt-5">
            <DifficultyMix distribution={detailedStats.difficultyDistribution} />
          </div>
        </Surface>
      </div>

      {!unlocked ? <LimitedViewOverlay /> : null}
    </section>
  );
}
