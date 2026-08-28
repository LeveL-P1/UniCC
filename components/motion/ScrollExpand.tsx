"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Scroll Expand.
 *
 * The panel starts inset and rounded, then scrubs out to full-bleed as the
 * section is pinned. Optional `caption` copy splits away from the centre on
 * the same timeline, so the reveal reads as one gesture rather than two
 * effects that happen to overlap.
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
      const panel = scope.current?.querySelector<HTMLElement>("[data-expand-panel]");
      if (!panel) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
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
    },
    { scope }
  );

  return (
    <div ref={scope} className={cn("relative h-svh overflow-hidden", className)}>
      <div
        data-expand-panel
        className="absolute inset-0 origin-center overflow-hidden will-change-transform"
      >
        {children}
      </div>
      {caption ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          {caption}
        </div>
      ) : null}
    </div>
  );
}
