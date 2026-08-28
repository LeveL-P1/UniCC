"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/**
 * GSAP mouse parallax.
 *
 * Wrap a scene in <MouseParallax>, then mark children with
 * data-parallax="<depth>" where depth is roughly -1..1. Positive depth moves
 * with the pointer, negative moves against it, 0 stays put. Movement is
 * driven by quickTo, so it interpolates on GSAP's ticker rather than
 * re-rendering React on every pointermove.
 */
export function MouseParallax({
  children,
  className,
  /** Maximum travel in px at depth 1. */
  strength = 24,
  /** Seconds for a layer to catch up to the pointer. */
  ease = 0.6,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  ease?: number;
}) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Pointer parallax is meaningless on touch — skip the listener entirely.
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const layers = gsap.utils.toArray<HTMLElement>("[data-parallax]", root);
      if (!layers.length) return;

      const setters = layers.map((layer) => {
        const depth = parseFloat(layer.dataset.parallax ?? "0");
        return {
          x: gsap.quickTo(layer, "x", { duration: ease, ease: "power3.out" }),
          y: gsap.quickTo(layer, "y", { duration: ease, ease: "power3.out" }),
          depth,
        };
      });

      const onMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        // -0.5..0.5 relative to the scene centre.
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;

        setters.forEach(({ x, y, depth }) => {
          x(px * strength * depth);
          y(py * strength * depth);
        });
      };

      const onLeave = () => setters.forEach(({ x, y }) => (x(0), y(0)));

      window.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerleave", onLeave);

      return () => {
        window.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope }
  );

  return (
    <div ref={scope} className={cn("relative", className)}>
      {children}
    </div>
  );
}
