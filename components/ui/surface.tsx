import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * The three-layer surface stack. Nothing else exists.
 *   canvas (#000) -> recess (#0c0c0c) -> card (#141414)
 * Flat and border-driven. No hover lift, no elevation drama.
 */
type Level = "canvas" | "recess" | "card";

const levels: Record<Level, string> = {
  canvas: "bg-obsidian",
  recess: "bg-tar",
  card: "bg-carbon",
};

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: Level;
  bordered?: boolean;
  padded?: boolean;
  as?: React.ElementType;
}

export function Surface({
  level = "card",
  bordered = true,
  padded = true,
  as: Comp = "div",
  className,
  ...props
}: SurfaceProps) {
  return (
    <Comp
      className={cn(
        "rounded-card",
        levels[level],
        bordered && "hairline",
        padded && "p-6",
        className
      )}
      {...props}
    />
  );
}

/** Small square tile for platform marks and icons. 6px radius, Tar recess. */
export function IconTile({
  className,
  size = 32,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-icon bg-tar hairline",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/** 2px-radius mono tag. A print marker, not a UI badge. */
export function Tag({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-tag bg-tar px-1.5 py-0.5",
        "font-mono text-caption uppercase tracking-[0.12em] text-ash",
        className
      )}
      {...props}
    />
  );
}
