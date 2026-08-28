"use client";

import { ParallaxSVG } from "@/components/motion/ParallaxSVG";
import { SectionHeader } from "@/components/ui/section-header";
import { Stat } from "@/components/ui/stat";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

/**
 * SVG parallax.
 *
 * Four vector layers drift at different rates against the scroll, so the
 * section gains depth without a single raster asset. The foreground curve
 * strokes itself in on the same scroll range.
 */
export function ProofSection() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-[112px]">
      {/* Parallax field */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <ParallaxSVG
          viewBox="0 0 1200 700"
          preserveAspectRatio="xMidYMid slice"
          travel={110}
          fade
          aria-hidden
        >
          {/* Deepest: the graticule. */}
          <g data-depth="0.65" stroke="#d4d0c9" strokeOpacity="0.05">
            {[120, 240, 360, 480, 600].map((y) => (
              <line key={y} x1="0" y1={y} x2="1200" y2={y} />
            ))}
          </g>

          {/* Mid: soft contour bands. */}
          <g data-depth="0.35" fill="none" stroke="#d4d0c9" strokeOpacity="0.08">
            <path d="M -50 520 C 180 470, 320 560, 520 500 S 880 400, 1250 452" />
            <path d="M -50 570 C 200 528, 340 610, 540 552 S 900 456, 1250 500" />
            <path d="M -50 620 C 220 586, 360 660, 560 604 S 920 512, 1250 548" />
          </g>

          {/* Near: sparse nodes leading the scroll. */}
          <g data-depth="-0.3" fill="#d4d0c9" fillOpacity="0.16">
            {[
              [140, 190],
              [420, 128],
              [700, 210],
              [980, 150],
              [1120, 250],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.5" />
            ))}
          </g>

          {/* Foreground: the trend line, drawn on scroll. */}
          <path
            data-depth="-0.12"
            data-draw
            d="M -20 430 C 200 400, 330 330, 520 344 S 830 250, 1010 196 S 1160 160, 1230 148"
            fill="none"
            stroke="#d4d0c9"
            strokeOpacity="0.3"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </ParallaxSVG>
      </div>

      <div className="frame">
        <SectionHeader
          eyebrow="Signal"
          title="Numbers that mean something"
          description="Aggregated across every connected handle, recomputed on each sync. The dashboard shows the same figures your public page does."
        />

        <RevealGroup className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <RevealItem>
            <Stat
              signal={0}
              value={4}
              label="Platforms synced automatically"
              hint="LeetCode, Codeforces, CodeChef, AtCoder"
            />
          </RevealItem>
          <RevealItem>
            <Stat
              signal={1}
              value={6}
              suffix="h"
              label="Between scheduled syncs"
              hint="Manual refresh any time"
            />
          </RevealItem>
          <RevealItem>
            <Stat
              signal={2}
              value={365}
              suffix="d"
              label="Of history retained per handle"
              hint="Ratings, solves and contests"
            />
          </RevealItem>
          <RevealItem>
            <Stat
              signal={3}
              value={0}
              label="Accounts needed to look someone up"
              hint="Public profiles resolve without sign-in"
            />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
