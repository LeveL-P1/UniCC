import { cn } from "@/lib/utils";
import type { PlatformKey } from "@/types/platform";

/**
 * We do not ship third-party brand logos, so each platform gets a monogram
 * tile instead: Tar recess, 6px radius, one chromatic dot as identity. Reads
 * as a system label rather than a marketing badge.
 */
const MARKS: Record<
  PlatformKey,
  { short: string; name: string; signal: string; href: string }
> = {
  leetcode: {
    short: "LC",
    name: "LeetCode",
    signal: "var(--color-signal-orange)",
    href: "https://leetcode.com",
  },
  codeforces: {
    short: "CF",
    name: "Codeforces",
    signal: "var(--color-signal-blue)",
    href: "https://codeforces.com",
  },
  codechef: {
    short: "CC",
    name: "CodeChef",
    signal: "var(--color-signal-violet)",
    href: "https://codechef.com",
  },
  atcoder: {
    short: "AC",
    name: "AtCoder",
    signal: "var(--color-signal-green)",
    href: "https://atcoder.jp",
  },
  hackerrank: {
    short: "HR",
    name: "HackerRank",
    signal: "var(--color-signal-green)",
    href: "https://hackerrank.com",
  },
  hackerearth: {
    short: "HE",
    name: "HackerEarth",
    signal: "var(--color-signal-blue)",
    href: "https://hackerearth.com",
  },
};

export function platformMeta(key: string) {
  return MARKS[key.toLowerCase() as PlatformKey] ?? null;
}

export function PlatformMark({
  platform,
  size = 32,
  className,
}: {
  platform: string;
  size?: number;
  className?: string;
}) {
  const meta = platformMeta(platform);

  return (
    <span
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-icon bg-tar hairline",
        "font-mono text-[10px] tracking-[0.08em] text-bone",
        className
      )}
      aria-hidden
    >
      {meta?.short ?? platform.slice(0, 2).toUpperCase()}
      {meta ? (
        <span
          className="absolute right-1 top-1 size-1 rounded-full"
          style={{ background: meta.signal }}
        />
      ) : null}
    </span>
  );
}

/** Logo + name on the canvas. No container, no border — just a chip of text. */
export function PlatformChip({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const meta = platformMeta(platform);

  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <PlatformMark platform={platform} size={28} />
      <span className="text-[13px] text-bone">{meta?.name ?? platform}</span>
    </span>
  );
}
