import type { StatOverview } from "@/types/stats";
import { Stat } from "@/components/ui/stat";

export function StatsOverview({ overview }: { overview: StatOverview }) {
  return (
    <section aria-label="Overview" className="grid gap-10 sm:grid-cols-3">
      <Stat signal={0} value={overview.totalSolved} label="Problems solved" />
      <Stat signal={1} value={overview.bestRating} label="Best rating" />
      <Stat signal={2} value={overview.contestsAttended} label="Contests attended" />
    </section>
  );
}
