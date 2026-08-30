"use client";

import { CursorReactiveSVG } from "@/components/motion/CursorReactiveSVG";
import { cn } from "@/lib/utils";

/**
 * The hero's single illustration: four platform ratings resolving into one.
 * Nodes lean toward the pointer and the unified curve sits underneath as the
 * thing the whole product argues for.
 *
 * Two compositions, switched with CSS rather than a media-query hook so there
 * is no hydration flash. The wide one shrunk to a 375px viewport rendered its
 * labels at 4.8px — illegible — so the compact one re-lays the same four nodes
 * into a 2x2 grid in a squarer viewBox with proportionally larger type.
 */

interface NodeSpec {
  id: string;
  label: string;
  value: string;
  x: number;
  y: number;
  signal: string;
}

const SIGNALS = {
  LC: "var(--color-signal-orange)",
  CF: "var(--color-signal-blue)",
  CC: "var(--color-signal-violet)",
  AC: "var(--color-signal-green)",
} as const;

const WIDE = {
  viewBox: "0 0 900 560",
  center: { x: 450, y: 288 },
  coreR: 52,
  card: { w: 156, h: 52, rx: 10 },
  type: { label: 12, value: 10, core: 15, coreSub: 10 },
  curve:
    "M 96 470 C 176 452, 214 486, 286 444 S 396 388, 452 402 S 560 350, 622 316 S 742 268, 812 232",
  nodes: [
    { id: "LC", label: "LeetCode", value: "2,041", x: 178, y: 132, signal: SIGNALS.LC },
    { id: "CF", label: "Codeforces", value: "1,874", x: 722, y: 108, signal: SIGNALS.CF },
    { id: "CC", label: "CodeChef", value: "1,932", x: 754, y: 404, signal: SIGNALS.CC },
    { id: "AC", label: "AtCoder", value: "1,588", x: 152, y: 418, signal: SIGNALS.AC },
  ] as NodeSpec[],
};

const COMPACT = {
  viewBox: "0 0 400 470",
  center: { x: 200, y: 235 },
  coreR: 46,
  card: { w: 172, h: 56, rx: 10 },
  type: { label: 15, value: 12, core: 16, coreSub: 11 },
  curve: "M 40 400 C 96 384, 132 344, 188 350 S 280 296, 360 250",
  nodes: [
    { id: "LC", label: "LeetCode", value: "2,041", x: 104, y: 66, signal: SIGNALS.LC },
    { id: "CF", label: "Codeforces", value: "1,874", x: 296, y: 66, signal: SIGNALS.CF },
    { id: "AC", label: "AtCoder", value: "1,588", x: 104, y: 404, signal: SIGNALS.AC },
    { id: "CC", label: "CodeChef", value: "1,932", x: 296, y: 404, signal: SIGNALS.CC },
  ] as NodeSpec[],
};

type Layout = typeof WIDE;

export function HeroIllustration({ className }: { className?: string }) {
  return (
    <>
      <Composition
        layout={COMPACT}
        className={cn("lg:hidden", className)}
        radius={220}
        pull={12}
      />
      <Composition
        layout={WIDE}
        className={cn("hidden lg:block", className)}
        radius={300}
        pull={16}
      />
    </>
  );
}

function Composition({
  layout,
  className,
  radius,
  pull,
}: {
  layout: Layout;
  className?: string;
  radius: number;
  pull: number;
}) {
  const { viewBox, center, coreR, card, type, curve, nodes } = layout;

  return (
    <CursorReactiveSVG
      viewBox={viewBox}
      className={cn("h-full w-full", className)}
      radius={radius}
      pull={pull}
      halo={false}
      aria-hidden
      role="presentation"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`curve-${viewBox.replace(/\s/g, "")}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#615f5c" />
          <stop offset="60%" stopColor="#d4d0c9" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <radialGradient id={`core-${viewBox.replace(/\s/g, "")}`}>
          <stop offset="0%" stopColor="#d4d0c9" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#d4d0c9" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Spokes: every platform resolving into the single core. */}
      <g stroke="#d4d0c9" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="3 5">
        {nodes.map((node) => (
          <line key={node.id} x1={node.x} y1={node.y} x2={center.x} y2={center.y} />
        ))}
      </g>

      {/* The unified curve. */}
      <path
        d={curve}
        fill="none"
        stroke={`url(#curve-${viewBox.replace(/\s/g, "")})`}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Core */}
      <g>
        <circle
          cx={center.x}
          cy={center.y}
          r={coreR * 1.85}
          fill={`url(#core-${viewBox.replace(/\s/g, "")})`}
        />
        <circle
          cx={center.x}
          cy={center.y}
          r={coreR}
          fill="#0c0c0c"
          stroke="#d4d0c9"
          strokeOpacity="0.22"
        />
        <text
          x={center.x}
          y={center.y - 4}
          textAnchor="middle"
          fill="#ffffff"
          fontSize={type.core}
          fontWeight="400"
          letterSpacing="0.16em"
          fontFamily="var(--font-inter), sans-serif"
        >
          UNICC
        </text>
        <text
          x={center.x}
          y={center.y + 17}
          textAnchor="middle"
          fill="#878581"
          fontSize={type.coreSub}
          letterSpacing="0.12em"
          fontFamily="var(--font-jetbrains), monospace"
        >
          1,859 AVG
        </text>
      </g>

      {/* Platform nodes — the only chromatic marks in the scene. */}
      {nodes.map((node) => (
        <g
          key={node.id}
          data-cursor-node
          data-cx={node.x}
          data-cy={node.y}
          data-strength="1"
          opacity="0.45"
        >
          <rect
            x={node.x - card.w / 2}
            y={node.y - card.h / 2}
            width={card.w}
            height={card.h}
            rx={card.rx}
            fill="#141414"
            stroke="#d4d0c9"
            strokeOpacity="0.12"
          />
          <circle cx={node.x - card.w / 2 + 20} cy={node.y} r="4" fill={node.signal} />
          <text
            x={node.x - card.w / 2 + 34}
            y={node.y - 3}
            fill="#d4d0c9"
            fontSize={type.label}
            fontFamily="var(--font-inter), sans-serif"
          >
            {node.label}
          </text>
          <text
            x={node.x - card.w / 2 + 34}
            y={node.y + 15}
            fill="#878581"
            fontSize={type.value}
            letterSpacing="0.08em"
            fontFamily="var(--font-jetbrains), monospace"
          >
            {node.value}
          </text>
        </g>
      ))}
    </CursorReactiveSVG>
  );
}
