import type { StatOverview } from "@/types/stats";
import { SectionCard } from "@/components/ui/SectionCard";

export function ActivityOverviewCard({ overview }: { overview: StatOverview }) {
  return (
    <SectionCard title="Activity Overview" className="md:col-span-3">
      <p className="text-sm text-muted-foreground">
        Total solved: <span className="text-foreground">{overview.totalSolved}</span> | Best rating:{" "}
        <span className="text-foreground">{overview.bestRating}</span> | Contests:{" "}
        <span className="text-foreground">{overview.contestsAttended}</span>
      </p>
    </SectionCard>
  );
}
