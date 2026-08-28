"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, RefreshCw } from "lucide-react";

import { PlatformMark, platformMeta } from "@/components/ui/platform-mark";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-header";
import { Surface } from "@/components/ui/surface";
import { EmptyNote } from "@/components/ui/empty-note";
import { cn } from "@/lib/utils";
import type { PlatformComparisonEntry } from "@/types/analytics";

function relativeTime(iso: string) {
  const delta = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(delta / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export function PlatformList({
  comparison,
  syncingPlatform,
  onSync,
}: {
  comparison: PlatformComparisonEntry[];
  syncingPlatform: string | null;
  onSync: (platform: string) => void;
}) {
  return (
    <Surface padded={false} className="overflow-hidden">
      <header className="flex items-center justify-between gap-4 px-6 py-5 hairline-b">
        <Eyebrow>Connected</Eyebrow>
        <span className="font-mono text-caption text-smoke tabular-nums">
          {comparison.length}
        </span>
      </header>

      {comparison.length === 0 ? (
        <div className="p-6">
          <EmptyNote
            icon={Plus}
            title="No platforms linked"
            body="Add a handle and UNICC starts pulling solves, ratings and contests on a schedule."
            action={{ label: "Link a platform", href: "/settings" }}
          />
        </div>
      ) : (
        <ul>
          {comparison.map((entry, index) => {
            const meta = platformMeta(entry.platform);
            const syncing = syncingPlatform === entry.platform;

            return (
              <motion.li
                key={entry.platform}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="flex items-center gap-3 px-6 py-4 transition-colors hairline-b last:border-b-0 hover:bg-tar"
              >
                <PlatformMark platform={entry.platform} size={30} />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] text-bone">
                    {meta?.name ?? entry.platform}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] tracking-[0.08em] text-smoke">
                    {relativeTime(entry.lastUpdatedAt)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[15px] font-light text-chalk tabular-nums">
                    {entry.rating
                      ? entry.rating.toLocaleString()
                      : entry.totalSolved.toLocaleString()}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-smoke">
                    {entry.rating ? "rating" : "solved"}
                  </p>
                </div>

                <Button
                  variant="quiet"
                  size="icon-sm"
                  aria-label={`Sync ${meta?.name ?? entry.platform}`}
                  disabled={syncing}
                  onClick={() => onSync(entry.platform)}
                >
                  <RefreshCw size={13} className={cn(syncing && "animate-spin")} />
                </Button>
              </motion.li>
            );
          })}
        </ul>
      )}

      <div className="p-3 hairline-t">
        <Button asChild variant="quiet" size="sm" className="w-full">
          <Link href="/settings">
            <Plus size={14} />
            Add platform
          </Link>
        </Button>
      </div>
    </Surface>
  );
}
