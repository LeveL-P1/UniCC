import type { StatOverview } from "@/types/stats";
import { SectionCard } from "@/components/ui/SectionCard";

export function StatsOverview({ overview }: { overview: StatOverview }) {
  const items = [
    { label: "Total Solved", value: overview.totalSolved },
    { label: "Best Rating", value: overview.bestRating },
    { label: "Contests", value: overview.contestsAttended },
  ];

  return (
    <SectionCard title="Stats Overview">
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
