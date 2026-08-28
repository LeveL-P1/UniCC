import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion vocabulary. Henry's register is restrained: things ease in
 * from nearby, they never bounce in from off-screen.
 */

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

/** Spring used for every cursor-following / hover-physics interaction. */
export const HOVER_SPRING: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.6,
};

/** Softer spring for large elements (cards, panels). */
export const PANEL_SPRING: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 24,
  mass: 0.9,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_OUT_QUART } },
};

export const stagger = (staggerChildren = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Respect the OS setting everywhere motion is authored by hand. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
