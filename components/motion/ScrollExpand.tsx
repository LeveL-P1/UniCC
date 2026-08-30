"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Below this width the effect is skipped entirely — see note in useGSAP. */
const DESKTOP = "(min-width: 1024px)";

/**
 * Scroll Expand.
 *
 * The panel starts inset and rounded, then scrubs out to full-bleed as the
 * section is pinned. Optional `caption` copy splits away from the centre on
 * the same timeline, so the reveal reads as one gesture rather than two
 * effects that happen to overlap.
 *
 * Desktop only. On a phone the pin costs ~1.5 screens of scroll and shrinks
 * the panel to 60% of an already narrow viewport, which made the product
 * mockup inside it unreadable. gsap.matchMedia() scopes the whole timeline to
 * >=1024px and reverts it cleanly below that, where the panel simply renders
 * in normal flow at full size.
 */
export function ScrollExpand({
  children,
  className,
  /** Scale the panel starts at, relative to its final size. */
  from = 0.62,
  /** Corner radius at rest, straightened to 0 as it expands. */
  fromRadius = 10,
  /** Pin distance. Larger = slower, more deliberate expansion. */
  distance = "+=90%",
  caption,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  fromRadius?: number;
  distance?: string;
  caption?: ReactNode;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add(DESKTOP, () => {
        const panel = scope.current?.querySelector<HTMLElement>(
          "[data-expand-panel]"
        );
        if (!panel) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          gsap.set(panel, { scale: 1, borderRadius: 0 });
          return;
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scope.current,
            start: "top top",
            end: distance,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        timeline.fromTo(
          panel,
          { scale: from, borderRadius: fromRadius },
          { scale: 1, borderRadius: 0, ease: "none" },
          0
        );

        const left = scope.current?.querySelector<HTMLElement>("[data-expand-left]");
        const right = scope.current?.querySelector<HTMLElement>("[data-expand-right]");

        if (left) timeline.to(left, { xPercent: -40, opacity: 0, ease: "none" }, 0);
        if (right) timeline.to(right, { xPercent: 40, opacity: 0, ease: "none" }, 0);
      });

      return () => media.revert();
    },
    { scope }
  );

  return (
    <div
      ref={scope}
      className={cn("relative overflow-hidden lg:h-svh", className)}
    >
      {/* Mobile: normal flow, full size. Desktop: absolutely filled so the
          pinned scale animation has a fixed box to work against. */}
      <div
        data-expand-panel
        className="relative origin-center overflow-hidden lg:absolute lg:inset-0 lg:will-change-transform"
      >
        {children}
      </div>

      {caption ? (
        <div className="pointer-events-none relative z-10 px-0 pb-14 pt-10 lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center lg:p-0">
          {caption}
        </div>
      ) : null}
    </div>
  );
}
