"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { MagicCard } from "@/components/ui/magic-card";
import { Tilt } from "@/components/motion/HoverPhysics";
import { SectionHeader } from "@/components/ui/section-header";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { PlatformMark } from "@/components/ui/platform-mark";
import { EASE_OUT_EXPO } from "@/lib/motion";

/**
 * Interactive feature cards.
 *
 * Three layers of response, deliberately stacked:
 *   1. MagicCard traces a monochrome spotlight along the border under the cursor.
 *   2. Tilt gives the whole card spring-driven 3D lean.
 *   3. Each card's illustration animates on group-hover.
 */
export function FeatureCards() {
  return (
    <section className="frame py-20 lg:py-[112px]">
      <SectionHeader
        eyebrow="Capability"
        title="Built for people who track everything"
        description="Four platforms, one record. UNICC keeps the numbers current and shows you the shape they make over time."
      />

      <RevealGroup className="mt-16 grid gap-6 md:grid-cols-3">
        <RevealItem>
          <FeatureCard
            title="Every platform, one record"
            body="Link a handle once. Solves, ratings and contest history sync on a schedule and roll up into a single unified figure."
            visual={<StackVisual />}
          />
        </RevealItem>
        <RevealItem>
          <FeatureCard
            title="Look up anyone, instantly"
            body="Search a handle that has never signed up. UNICC fetches it live, caches the snapshot, and renders the same profile."
            visual={<SearchVisual />}
          />
        </RevealItem>
        <RevealItem>
          <FeatureCard
            title="The trend underneath"
            body="Velocity per week, plateau detection, and the correlation between how much you practise and how contests actually go."
            visual={<TrendVisual />}
          />
        </RevealItem>
      </RevealGroup>
    </section>
  );
}

function FeatureCard({
  title,
  body,
  visual,
}: {
  title: string;
  body: string;
  visual: React.ReactNode;
}) {
  return (
    <Tilt max={5} className="h-full">
      <MagicCard
        className="h-full rounded-card"
        gradientSize={260}
        gradientColor="rgba(212,208,201,0.05)"
        gradientOpacity={1}
        gradientFrom="rgba(212,208,201,0.55)"
        gradientTo="rgba(97,95,92,0.25)"
      >
        {/* Carbon surface over MagicCard's obsidian padding-box. */}
        <div className="group flex h-full flex-col rounded-card bg-carbon p-5">
          <div className="relative h-[168px] overflow-hidden rounded-icon bg-tar hairline">
            {visual}
          </div>

          <div className="mt-6 flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-body font-normal text-bone">{title}</h3>
              <ArrowUpRight
                size={15}
                className="mt-0.5 shrink-0 text-smoke transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
              />
            </div>
            <p className="mt-3 text-body-sm text-ash">{body}</p>
          </div>
        </div>
      </MagicCard>
    </Tilt>
  );
}

/* ---------------------------------------------------------------- visuals */

/** Platform rows fan apart and settle on hover. */
function StackVisual() {
  const rows = [
    { key: "leetcode", value: "2,041" },
    { key: "codeforces", value: "1,874" },
    { key: "codechef", value: "1,932" },
  ];

  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 px-5">
      {rows.map((row, index) => (
        <motion.div
          key={row.key}
          initial={{ x: 0 }}
          className="flex items-center gap-3 rounded-icon bg-carbon px-3 py-2 hairline transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            transitionDelay: `${index * 60}ms`,
          }}
        >
          <PlatformMark platform={row.key} size={22} />
          <span className="flex-1 truncate text-[12px] text-bone">
            {row.key}
          </span>
          <span className="font-mono text-[10px] tracking-[0.08em] text-ash tabular-nums">
            {row.value}
          </span>
        </motion.div>
      ))}
      <div className="mt-1 flex items-center justify-between border-t border-[rgba(212,208,201,0.12)] px-3 pt-2.5">
        <span className="eyebrow">Unified</span>
        <span className="font-mono text-[11px] text-chalk tabular-nums">5,847</span>
      </div>
    </div>
  );
}

/** A caret blinks in a search field; results slide up behind it. */
function SearchVisual() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2.5 px-5">
      <div className="flex items-center gap-2 rounded-pill bg-carbon px-3.5 py-2 hairline">
        <span className="text-[12px] text-bone">tourist</span>
        <motion.span
          className="h-3 w-px bg-bone"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        />
      </div>
      {[0, 1].map((index) => (
        <motion.div
          key={index}
          className="flex items-center gap-2.5 rounded-icon bg-carbon px-3 py-2 hairline"
          initial={{ opacity: 0.35, y: 6 }}
          animate={{ opacity: [0.35, 0.85, 0.35], y: [6, 0, 6] }}
          transition={{
            duration: 3.4,
            repeat: Infinity,
            delay: index * 0.4,
            ease: "easeInOut",
          }}
        >
          <span className="size-5 rounded-pill bg-tar hairline" />
          <span className="h-1.5 flex-1 rounded-full bg-[rgba(212,208,201,0.12)]" />
          <span className="font-mono text-[10px] text-smoke tabular-nums">
            {index === 0 ? "3,979" : "2,145"}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/** A sparkline that redraws itself on a loop. */
function TrendVisual() {
  const path =
    "M 8 96 C 40 92, 56 74, 84 78 S 132 46, 158 52 S 204 24, 240 16";

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 248 112" className="h-full w-full px-5" aria-hidden>
        <g stroke="#d4d0c9" strokeOpacity="0.07">
          {[24, 52, 80].map((y) => (
            <line key={y} x1="8" y1={y} x2="240" y2={y} />
          ))}
        </g>
        <motion.path
          d={path}
          fill="none"
          stroke="#d4d0c9"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.2 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: EASE_OUT_EXPO }}
        />
        <motion.circle
          r="3"
          fill="var(--color-signal-green)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.6, duration: 0.4 }}
          cx="240"
          cy="16"
        />
      </svg>
    </div>
  );
}
