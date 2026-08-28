"use client";

import { useRef, type ReactNode, type SVGProps } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/**
 * Cursor-reactive SVG.
 *
 * Converts the pointer into the SVG's own user-space coordinates, then lets
 * every element tagged `data-cursor-node` respond to how close the pointer
 * is. Nodes lean toward the cursor and brighten with proximity; everything
 * springs home when the pointer leaves.
 *
 * Each node declares its own centre so we never have to measure a nested,
 * transformed bounding box mid-pointermove:
 *
 *   <g data-cursor-node data-cx={220} data-cy={160} data-strength={1.2} />
 *
 * A halo tracks the pointer with lag, giving the scene a light source.
 */
export function CursorReactiveSVG({
  children,
  className,
  /** Radius (user units) inside which nodes react at all. */
  radius = 260,
  /** Max px a node travels toward the pointer at strength 1. */
  pull = 14,
  halo = true,
  haloRadius = 130,
  ...svgProps
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
  pull?: number;
  halo?: boolean;
  haloRadius?: number;
} & SVGProps<SVGSVGElement>) {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const svg = svgRef.current;
      if (!svg) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

      const nodes = gsap.utils.toArray<SVGGraphicsElement>(
        "[data-cursor-node]",
        svg
      );

      const controls = nodes.map((node) => ({
        node,
        cx: parseFloat(node.dataset.cx ?? "0"),
        cy: parseFloat(node.dataset.cy ?? "0"),
        strength: parseFloat(node.dataset.strength ?? "1"),
        x: gsap.quickTo(node, "x", { duration: 0.5, ease: "power3.out" }),
        y: gsap.quickTo(node, "y", { duration: 0.5, ease: "power3.out" }),
        opacity: gsap.quickTo(node, "opacity", {
          duration: 0.4,
          ease: "power2.out",
        }),
        scale: gsap.quickTo(node, "scale", {
          duration: 0.5,
          ease: "power3.out",
        }),
      }));

      controls.forEach(({ node }) => {
        gsap.set(node, { transformOrigin: "center center" });
      });

      const haloEl = svg.querySelector<SVGElement>("[data-cursor-halo]");
      const haloX = haloEl
        ? gsap.quickTo(haloEl, "x", { duration: 0.9, ease: "power3.out" })
        : null;
      const haloY = haloEl
        ? gsap.quickTo(haloEl, "y", { duration: 0.9, ease: "power3.out" })
        : null;
      const haloOpacity = haloEl
        ? gsap.quickTo(haloEl, "opacity", { duration: 0.5, ease: "power2.out" })
        : null;

      // Screen px -> SVG user units, so `radius` and `pull` stay meaningful
      // regardless of how the SVG is scaled by its container.
      const point = svg.createSVGPoint();
      const toUserSpace = (clientX: number, clientY: number) => {
        const ctm = svg.getScreenCTM();
        if (!ctm) return null;
        point.x = clientX;
        point.y = clientY;
        return point.matrixTransform(ctm.inverse());
      };

      const onMove = (event: PointerEvent) => {
        const p = toUserSpace(event.clientX, event.clientY);
        if (!p) return;

        haloX?.(p.x);
        haloY?.(p.y);
        haloOpacity?.(1);

        controls.forEach(({ cx, cy, strength, x, y, opacity, scale }) => {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const distance = Math.hypot(dx, dy);
          // 1 at the pointer, 0 at the edge of the radius.
          const proximity = Math.max(0, 1 - distance / radius);
          const eased = proximity * proximity;

          x((dx / (distance || 1)) * pull * eased * strength);
          y((dy / (distance || 1)) * pull * eased * strength);
          opacity(0.45 + 0.55 * eased);
          scale(1 + 0.09 * eased * strength);
        });
      };

      const onLeave = () => {
        haloOpacity?.(0);
        controls.forEach(({ x, y, opacity, scale }) => {
          x(0);
          y(0);
          opacity(0.45);
          scale(1);
        });
      };

      // Listen on the window so the scene keeps responding as the pointer
      // approaches from outside the SVG's own box.
      window.addEventListener("pointermove", onMove, { passive: true });
      svg.addEventListener("pointerleave", onLeave);

      return () => {
        window.removeEventListener("pointermove", onMove);
        svg.removeEventListener("pointerleave", onLeave);
      };
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
      {halo ? (
        <g data-cursor-halo opacity={0} style={{ pointerEvents: "none" }}>
          <circle r={haloRadius} fill="url(#cursor-halo-gradient)" />
        </g>
      ) : null}
      {children}
    </svg>
  );
}
