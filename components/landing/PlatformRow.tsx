import { Marquee } from "@/components/ui/marquee";
import { PlatformChip } from "@/components/ui/platform-mark";
import { PLATFORM_ORDER } from "@/lib/constants";

/**
 * Integration row. Full width, no cards, no borders — logos on canvas,
 * communicating breadth without adding visual noise. It drifts slowly so the
 * band reads as alive rather than as a static list.
 */
export function PlatformRow() {
  return (
    <section className="relative py-14 hairline-t hairline-b">
      <Marquee pauseOnHover className="[--duration:42s] [--gap:3.5rem]">
        {PLATFORM_ORDER.map((key) => (
          <PlatformChip key={key} platform={key} className="opacity-70" />
        ))}
      </Marquee>

      {/* Fade the band into the canvas at both edges. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-obsidian to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-obsidian to-transparent" />
    </section>
  );
}
