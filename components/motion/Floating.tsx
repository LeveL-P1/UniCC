"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Floating UI animation. A slow, offset drift that makes stacked product
 * mockups feel suspended rather than pasted down. Each instance gets its own
 * phase via `delay` so a group never moves in lockstep.
 */
export function Floating({
  children,
  className,
  /** Vertical travel in px. Keep small — this should read as breathing. */
  amplitude = 10,
  /** Seconds for one full cycle. */
  duration = 6,
  delay = 0,
  /** Degrees of sway. 0 for panels that must stay level. */
  rotate = 0,
}: {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
  rotate?: number;
}) {
  return (
    <motion.div
      className={cn("will-change-transform", className)}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
        rotate: rotate ? [-rotate, rotate, -rotate] : undefined,
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.5, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
