"use client";

import { ScrollExpand } from "@/components/motion/ScrollExpand";
import { Floating } from "@/components/motion/Floating";
import { ProductMockup } from "@/components/landing/ProductMockup";
import { GridPattern } from "@/components/ui/grid-pattern";
import { Eyebrow } from "@/components/ui/section-header";

/**
 * Scroll Expand + Floating UI.
 *
 * The panel is pinned and scrubs from inset to full-bleed as you scroll; the
 * caption splits left/right on the same timeline. Inside, the product
 * artifacts drift on offset cycles so the scene keeps breathing once the
 * expansion finishes.
 */
export function ShowcaseSection() {
  return (
    <ScrollExpand
      from={0.6}
      fromRadius={10}
      distance="+=95%"
      caption={
        <div className="frame flex w-full items-center justify-between">
          <div data-expand-left className="max-w-[16rem]">
            <Eyebrow>Proof</Eyebrow>
            <p className="mt-3 text-[24px] font-light leading-[1.2] tracking-[-0.48px] text-chalk">
              One page you can send to anyone.
            </p>
          </div>
          <div data-expand-right className="hidden max-w-[16rem] text-right md:block">
            <Eyebrow>Always current</Eyebrow>
            <p className="mt-3 text-body-sm text-ash">
              Syncs on a schedule. Never a stale screenshot pasted into a résumé.
            </p>
          </div>
        </div>
      }
    >
      <div className="relative flex h-full w-full items-center justify-center bg-tar">
        <GridPattern
          width={64}
          height={64}
          className="[mask-image:radial-gradient(680px_circle_at_50%_50%,#000,transparent)] fill-transparent stroke-bone/[0.07]"
        />

        <div className="relative flex items-center justify-center gap-6 px-6">
          {/* Flanking artifacts sit behind, scaled down and dimmed. */}
          <Floating
            amplitude={12}
            duration={7.5}
            rotate={0.8}
            className="hidden lg:block"
          >
            <ProductMockup className="w-[300px] scale-90 opacity-40" />
          </Floating>

          <Floating amplitude={9} duration={6} delay={0.6}>
            <ProductMockup className="w-[380px] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.9)]" />
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
