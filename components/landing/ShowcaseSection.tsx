"use client";

import { ScrollExpand } from "@/components/motion/ScrollExpand";
import { Floating } from "@/components/motion/Floating";
import { ProductMockup } from "@/components/landing/ProductMockup";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Eyebrow } from "@/components/ui/section-header";

/**
 * Scroll Expand + Floating UI.
 *
 * On desktop the panel is pinned and scrubs from inset to full-bleed while the
 * caption splits left/right on the same timeline. On mobile the pin is off
 * (see ScrollExpand), so this renders as a normal stacked section: caption
 * below, single artifact at readable width.
 */
export function ShowcaseSection() {
  return (
    <ScrollExpand
      from={0.6}
      fromRadius={10}
      distance="+=95%"
      caption={
        <div className="frame flex w-full flex-col gap-6 sm:flex-row sm:items-start sm:justify-between lg:items-center">
          <div data-expand-left className="max-w-[22ch] lg:max-w-[16rem]">
            <Eyebrow>Proof</Eyebrow>
            <p className="mt-3 text-[20px] font-light leading-[1.2] tracking-[-0.4px] text-chalk sm:text-[24px] sm:tracking-[-0.48px]">
              One page you can send to anyone.
            </p>
          </div>
          <div
            data-expand-right
            className="max-w-[34ch] sm:max-w-[16rem] sm:text-right"
          >
            <Eyebrow>Always current</Eyebrow>
            <p className="mt-3 text-body-sm text-ash">
              Syncs on a schedule. Never a stale screenshot pasted into a résumé.
            </p>
          </div>
        </div>
      }
    >
      <div className="relative flex w-full items-center justify-center bg-tar px-5 py-16 sm:px-8 lg:h-full lg:px-6 lg:py-0">
        <GridPattern
          width={64}
          height={64}
          className="[mask-image:radial-gradient(680px_circle_at_50%_50%,#000,transparent)] fill-transparent stroke-bone/[0.07]"
        />

        <div className="relative flex w-full items-center justify-center gap-6">
          {/* Flanking artifacts sit behind, scaled down and dimmed. */}
          <Floating
            amplitude={12}
            duration={7.5}
            rotate={0.8}
            className="hidden lg:block"
          >
            <ProductMockup className="w-[300px] scale-90 opacity-40" />
          </Floating>

          <Floating amplitude={9} duration={6} delay={0.6} className="w-full max-w-[380px]">
            <ProductMockup className="shadow-[0_24px_80px_-24px_rgba(0,0,0,0.9)]" />
          </Floating>

          <Floating
            amplitude={12}
            duration={8}
            delay={1.2}
            rotate={-0.8}
            className="hidden lg:block"
          >
            <ProductMockup className="w-[300px] scale-90 opacity-40" />
          </Floating>
        </div>

        {/* Vignette so the artifacts sit in the room rather than on top of it. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_40%,rgba(0,0,0,0.75)_100%)]" />
      </div>
    </ScrollExpand>
  );
}
