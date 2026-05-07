import type { StatOverview } from "@/types/stats";
import { SectionCard } from "@/components/ui/SectionCard";
import { Trophy, Target, Zap, Award } from "lucide-react";

export function ActivityOverviewCard({ overview }: { overview: StatOverview }) {
  const stats = [
    { label: "Total Solved", value: overview.totalSolved, icon: Target, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Best Rating", value: overview.bestRating, icon: Trophy, color: "text-amber-400", bg: "bg-amber-400/10" },
    { label: "Contests", value: overview.contestsAttended, icon: Award, color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { label: "Current Streak", value: "12 Days", icon: Zap, color: "text-orange-400", bg: "bg-orange-400/10" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat) => (
        <SectionCard key={stat.label} className="p-4 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
            <stat.icon size={22} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">{stat.label}</p>
            <p className="text-xl font-bold text-white mt-0.5">{stat.value}</p>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
