import { ExternalLink } from "lucide-react";
import type { PlatformStats } from "@/types/platform";
import { Surface } from "@/components/ui/surface";
import { PlatformMark, platformMeta } from "@/components/ui/platform-mark";
import { Eyebrow } from "@/components/ui/section-header";
import { EmptyNote } from "@/components/ui/empty-note";

export function PlatformCardsGrid({ platforms }: { platforms: PlatformStats[] }) {
  return (
    <section aria-labelledby="platforms-heading">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <Eyebrow>Platforms</Eyebrow>
          <h2
            id="platforms-heading"
            className="mt-2 text-heading-sm font-light text-chalk"
          >
            Where the numbers come from
          </h2>
        </div>
        <span className="font-mono text-caption text-smoke tabular-nums">
          {platforms.length}
        </span>
      </div>

      {platforms.length === 0 ? (
        <EmptyNote
          title="No platforms linked"
          body="This profile has not connected any competitive programming handles yet."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => {
            const meta = platformMeta(platform.platform);

            return (
              <Surface
                key={`${platform.platform}-${platform.handle}`}
                className="group flex flex-col gap-5 p-5 transition-colors hover:border-[rgba(212,208,201,0.24)]"
              >
                <div className="flex items-start gap-3">
                  <PlatformMark platform={platform.platform} size={28} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm text-bone">
                      {meta?.name ?? platform.platform}
                    </p>
                    <p className="truncate font-mono text-[10px] tracking-[0.06em] text-smoke">
                      @{platform.handle}
                    </p>
                  </div>
                  {meta ? (
                    <a
                      href={`${meta.href}/`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${meta.name}`}
                      className="text-smoke opacity-0 transition-opacity hover:text-bone focus-visible:opacity-100 group-hover:opacity-100"
                    >
                      <ExternalLink size={13} />
                    </a>
                  ) : null}
                </div>

                <div>
                  <p className="text-[26px] font-light leading-none text-chalk tabular-nums">
                    {platform.valueLabel}
                  </p>
                  {platform.secondaryLabel ? (
                    <p className="mt-2 text-[12px] text-ash">
                      {platform.secondaryLabel}
                    </p>
                  ) : null}
                </div>
              </Surface>
            );
          })}
        </div>
      )}
    </section>
  );
}
