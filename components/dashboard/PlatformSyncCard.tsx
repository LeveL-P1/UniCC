import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/SectionCard";
import type { PlatformStats } from "@/types/platform";

interface PlatformSyncCardProps {
  item: PlatformStats;
  syncing: boolean;
  onSync: () => void;
}

export function PlatformSyncCard({ item, syncing, onSync }: PlatformSyncCardProps) {
  return (
    <SectionCard title={item.platform}>
      <p className="text-lg font-semibold">{item.valueLabel}</p>
      <p className="text-sm text-muted-foreground">@{item.handle}</p>
      <Button size="sm" variant="outline" className="mt-4" onClick={onSync} disabled={syncing}>
        {syncing ? "Syncing..." : "Sync now"}
      </Button>
    </SectionCard>
  );
}
