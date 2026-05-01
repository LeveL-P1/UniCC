import type { DetailedStats } from "@/types/stats";
import { SectionCard } from "@/components/ui/SectionCard";
import { LimitedViewOverlay } from "@/components/profile/LimitedViewOverlay";

export function AnalyticsSection({ detailedStats, unlocked }: { detailedStats: DetailedStats; unlocked: boolean }) {
  return (
    <div className="relative">
      <SectionCard title="Detailed Analytics">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm font-medium">Activity Heatmap</p>
            <div className="mt-3 grid grid-cols-7 gap-1">
              {detailedStats.heatmap.slice(0, 28).map((day) => (
                <div
                  key={day.date}
                  className="h-4 w-4 rounded-sm"
                  style={{ backgroundColor: `rgba(255,107,53,${0.15 + day.count * 0.2})` }}
                />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm font-medium">Difficulty Mix</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Easy: {detailedStats.difficultyDistribution.easy}</li>
              <li>Medium: {detailedStats.difficultyDistribution.medium}</li>
              <li>Hard: {detailedStats.difficultyDistribution.hard}</li>
            </ul>
          </div>
        </div>
      </SectionCard>
      {!unlocked ? <LimitedViewOverlay /> : null}
    </div>
  );
}
