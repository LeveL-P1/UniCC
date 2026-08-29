import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Our type scale uses word tokens (`text-body-sm`, `text-heading-lg`) and our
 * palette uses word tokens too (`text-bone`, `text-obsidian`). Stock
 * tailwind-merge cannot tell those apart, so it filed both under one group and
 * silently dropped the colour whenever a size followed it — which is how
 * `bg-chalk text-obsidian … text-body-sm` lost its colour and rendered Bone
 * text on a white pill. Declaring both groups explicitly keeps them separate.
 */
const FONT_SIZES = [
  "caption",
  "body-sm",
  "body",
  "subheading",
  "heading-sm",
  "heading",
  "heading-lg",
  "display",
] as const;

const COLORS = [
  "obsidian",
  "tar",
  "carbon",
  "bone",
  "ash",
  "smoke",
  "pearl",
  "graphite",
  "chalk",
  "signal-green",
  "signal-blue",
  "signal-orange",
  "signal-violet",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...FONT_SIZES] }],
      "text-color": [{ text: [...COLORS] }],
      "bg-color": [{ bg: [...COLORS] }],
      "border-color": [{ border: [...COLORS] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
