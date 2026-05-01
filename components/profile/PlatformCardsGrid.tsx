import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import type { PlatformStats } from "@/types/platform";

export function PlatformCardsGrid({ platforms }: { platforms: PlatformStats[] }) {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Platforms</h2>
      <BentoGrid>
        {platforms.map((platform) => (
          <BentoGridItem key={`${platform.platform}-${platform.handle}`}>
            <p className="text-sm uppercase text-muted-foreground">{platform.platform}</p>
            <p className="mt-1 text-lg font-semibold">{platform.valueLabel}</p>
            <p className="text-sm text-muted-foreground">@{platform.handle}</p>
            {platform.secondaryLabel ? <p className="mt-2 text-sm">{platform.secondaryLabel}</p> : null}
          </BentoGridItem>
        ))}
      </BentoGrid>
    </section>
  );
}
