"use client";

import { CursorReactiveSVG } from "@/components/motion/CursorReactiveSVG";
import { cn } from "@/lib/utils";

const CENTER = { x: 450, y: 288 };

/**
 * The hero's single illustration: four platform ratings resolving into one.
 * Nodes lean toward the pointer, a halo lights the field behind them, and the
 * unified curve sits underneath as the thing the whole product argues for.
 */
const NODES = [
  { id: "LC", label: "LeetCode", value: "2,041", x: 178, y: 132, signal: "var(--color-signal-orange)" },
  { id: "CF", label: "Codeforces", value: "1,874", x: 722, y: 108, signal: "var(--color-signal-blue)" },
  { id: "CC", label: "CodeChef", value: "1,932", x: 754, y: 404, signal: "var(--color-signal-violet)" },
  { id: "AC", label: "AtCoder", value: "1,588", x: 152, y: 418, signal: "var(--color-signal-green)" },
] as const;

/** A plausible unified-rating curve. Decorative, not data. */
const CURVE =
  "M 96 470 C 176 452, 214 486, 286 444 S 396 388, 452 402 S 560 350, 622 316 S 742 268, 812 232";

export function HeroIllustration({ className }: { className?: string }) {
  return (
    <CursorReactiveSVG
      viewBox="0 0 900 560"
      className={cn("h-full w-full", className)}
      radius={300}
      pull={16}
      haloRadius={150}
      aria-hidden
      role="presentation"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <radialGradient id="cursor-halo-gradient">
          <stop offset="0%" stopColor="#d4d0c9" stopOpacity="0.14" />
          <stop offset="55%" stopColor="#d4d0c9" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#d4d0c9" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="curve-stroke" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#615f5c" />
          <stop offset="60%" stopColor="#d4d0c9" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>

        <radialGradient id="core-glow">
          <stop offset="0%" stopColor="#d4d0c9" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#d4d0c9" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Graticule — the faintest possible chart floor. */}
      <g stroke="#d4d0c9" strokeOpacity="0.05" strokeWidth="1">
        {[104, 196, 288, 380, 472].map((y) => (
          <line key={y} x1="60" y1={y} x2="840" y2={y} />
        ))}
        {[60, 216, 372, 528, 684, 840].map((x) => (
          <line key={x} x1={x} y1="80" x2={x} y2="496" />
        ))}
      </g>

      {/* Spokes: every platform resolving into the single core. */}
      <g stroke="#d4d0c9" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="3 5">
        {NODES.map((node) => (
          <line key={node.id} x1={node.x} y1={node.y} x2={CENTER.x} y2={CENTER.y} />
        ))}
      </g>

      {/* The unified curve. */}
      <path
        d={CURVE}
        fill="none"
        stroke="url(#curve-stroke)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Core */}
      <g>
        <circle cx={CENTER.x} cy={CENTER.y} r="96" fill="url(#core-glow)" />
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r="52"
          fill="#0c0c0c"
          stroke="#d4d0c9"
          strokeOpacity="0.22"
        />
        <circle
          cx={CENTER.x}
          cy={CENTER.y}
          r="52"
          fill="none"
          stroke="#d4d0c9"
          strokeOpacity="0.3"
          className="origin-center animate-pulse-ring"
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
        <text
          x={CENTER.x}
          y={CENTER.y - 4}
          textAnchor="middle"
          fill="#ffffff"
          fontSize="15"
          fontWeight="400"
          letterSpacing="0.16em"
          fontFamily="var(--font-inter), sans-serif"
        >
          UNICC
        </text>
        <text
          x={CENTER.x}
          y={CENTER.y + 18}
          textAnchor="middle"
          fill="#878581"
          fontSize="10"
          letterSpacing="0.14em"
          fontFamily="var(--font-jetbrains), monospace"
        >
          1,859 AVG
        </text>
      </g>

      {/* Platform nodes — the only chromatic marks in the scene. */}
      {NODES.map((node) => (
        <g
          key={node.id}
          data-cursor-node
          data-cx={node.x}
          data-cy={node.y}
          data-strength="1"
          opacity="0.45"
        >
          <rect
            x={node.x - 78}
            y={node.y - 26}
            width="156"
            height="52"
            rx="10"
            fill="#141414"
            stroke="#d4d0c9"
            strokeOpacity="0.12"
          />
          <circle cx={node.x - 58} cy={node.y} r="4" fill={node.signal} />
          <text
            x={node.x - 44}
            y={node.y - 3}
            fill="#d4d0c9"
            fontSize="12"
            fontFamily="var(--font-inter), sans-serif"
          >
            {node.label}
          </text>
          <text
            x={node.x - 44}
            y={node.y + 14}
            fill="#878581"
            fontSize="10"
            letterSpacing="0.1em"
            fontFamily="var(--font-jetbrains), monospace"
          >
            {node.value}
          </text>
        </g>
      ))}
    </CursorReactiveSVG>
  );
}
