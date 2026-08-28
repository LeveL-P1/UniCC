"use client";

import { useRef, type ReactNode, type SVGProps } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * SVG parallax on scroll.
 *
 * Layers inside the SVG declare their depth and drift at different rates as
 * the section passes through the viewport, so a flat vector scene gains
 * apparent depth. Positive depth trails the scroll (reads as distant),
 * negative leads it (reads as near).
 *
 *   <g data-depth="0.4">…</g>
 *
 * Optional `data-draw` on a <path> strokes the path in as it scrolls,
 * using dash-offset rather than a plugin.
 */
export function ParallaxSVG({
  children,
  className,
  /** Travel in px at depth 1 across the full scroll range. */
  travel = 90,
  /** Also fade distant layers slightly as they drift. */
  fade = false,
  ...svgProps
}: {
  children: ReactNode;
  className?: string;
  travel?: number;
  fade?: boolean;
} & SVGProps<SVGSVGElement>) {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = svgRef.current;
      if (!svg) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const layers = gsap.utils.toArray<SVGGraphicsElement>("[data-depth]", svg);

      layers.forEach((layer) => {
        const depth = parseFloat(layer.dataset.depth ?? "0");
        gsap.fromTo(
          layer,
          { y: -travel * depth },
          {
            y: travel * depth,
            opacity: fade && depth > 0 ? 0.55 : undefined,
            ease: "none",
            scrollTrigger: {
              trigger: svg,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });

      // Self-drawing strokes, scrubbed to the same scroll range.
      const drawn = gsap.utils.toArray<SVGPathElement>("[data-draw]", svg);
      drawn.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: svg,
            start: "top 85%",
            end: "center 45%",
            scrub: 1,
          },
        });
      });
    },
    { scope: svgRef }
  );

  return (
    <svg
      ref={svgRef}
      className={cn("h-full w-full", className)}
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      {children}
    </svg>
  );
}
