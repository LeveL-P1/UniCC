"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { HOVER_SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Framer Motion hover physics — springs, not transitions.
 *
 * Tilt reads the pointer's offset from the element centre and maps it onto
 * rotateX/rotateY through a spring, so the card keeps travelling after the
 * pointer stops and settles rather than snapping.
 */
export function Tilt({
  children,
  className,
  /** Max rotation in degrees at the corners. */
  max = 7,
  /** Perspective depth. Lower = more extreme. */
  perspective = 900,
  /** Nudge the card toward the viewer on hover. */
  lift = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  perspective?: number;
  lift?: number;
  style?: MotionStyle;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const sx = useSpring(px, HOVER_SPRING);
  const sy = useSpring(py, HOVER_SPRING);

  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);

  return (
    <motion.div
      ref={ref}
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        px.set((event.clientX - rect.left) / rect.width - 0.5);
        py.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      style={{
        perspective,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        ...style,
      }}
      whileHover={lift ? { z: lift } : undefined}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Magnetic: the element leans toward the pointer while it is nearby, then
 * springs home. Used on the primary CTAs.
 */
export function Magnetic({
  children,
  className,
  /** How far the element can travel from rest, in px. */
  strength = 10,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), HOVER_SPRING);
  const y = useSpring(useMotionValue(0), HOVER_SPRING);

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={cn("inline-flex", className)}
      onPointerMove={(event) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const dx = event.clientX - (rect.left + rect.width / 2);
        const dy = event.clientY - (rect.top + rect.height / 2);
        x.set((dx / (rect.width / 2)) * strength);
        y.set((dy / (rect.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
