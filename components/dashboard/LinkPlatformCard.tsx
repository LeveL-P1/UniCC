import { Plus } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";

export function LinkPlatformCard() {
  return (
    <SectionCard>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/15 p-2 text-primary">
          <Plus size={16} />
        </div>
        <div>
          <p className="font-semibold">Link New Platform</p>
          <p className="text-sm text-muted-foreground">Connect more profiles from settings.</p>
        </div>
      </div>
    </SectionCard>
  );
}
