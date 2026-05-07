import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/SectionCard";
import { RefreshCw, ExternalLink } from "lucide-react";
import type { PlatformStats } from "@/types/platform";
import { cn } from "@/lib/utils";

interface PlatformSyncCardProps {
  item: PlatformStats;
  syncing: boolean;
  onSync: () => void;
}

export function PlatformSyncCard({ item, syncing, onSync }: PlatformSyncCardProps) {
  return (
    <SectionCard className="group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-indigo-500/30 transition-colors">
            {/* Logic for platform icons could go here */}
            <span className="font-bold text-xs">{item.platform.substring(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <h3 className="font-bold text-white leading-none">{item.platform}</h3>
            <p className="text-xs text-neutral-500 mt-1">@{item.handle}</p>
          </div>
        </div>
        <a href="#" className="text-neutral-500 hover:text-white transition-colors">
          <ExternalLink size={16} />
        </a>
      </div>

      <div className="mt-4">
        <div className="text-2xl font-bold text-white">{item.valueLabel}</div>
        <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mt-1">Total Solved</p>
      </div>

      <Button 
        size="sm" 
        variant="ghost" 
        className={cn(
          "w-full mt-6 bg-white/5 hover:bg-indigo-600 hover:text-white border border-white/5 hover:border-indigo-500 transition-all rounded-xl gap-2",
          syncing && "opacity-50 cursor-not-allowed"
        )}
        onClick={onSync} 
        disabled={syncing}
      >
        <RefreshCw size={14} className={cn(syncing && "animate-spin")} />
        {syncing ? "Updating..." : "Sync Stats"}
      </Button>
    </SectionCard>
  );
}
