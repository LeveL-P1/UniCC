import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { SearchResultProfile } from "@/types/profile";
import { PlatformMark } from "@/components/ui/platform-mark";

export function ProfileResultCard({ profile }: { profile: SearchResultProfile }) {
  const initials = (profile.fullName || profile.username)
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/u/${profile.username}`}
      className="group flex items-center gap-4 rounded-card bg-carbon p-4 transition-colors hairline hover:border-[rgba(212,208,201,0.28)] hover:bg-tar"
    >
      {profile.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.avatarUrl}
          alt=""
          className="size-11 shrink-0 rounded-pill object-cover hairline"
        />
      ) : (
        <span className="flex size-11 shrink-0 items-center justify-center rounded-pill bg-tar text-[13px] font-light text-bone hairline">
          {initials || "—"}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm text-bone">
          {profile.fullName || profile.username}
        </p>
        <p className="truncate font-mono text-[10px] tracking-[0.06em] text-smoke">
          @{profile.username}
        </p>
        {profile.shortBio ? (
          <p className="mt-1.5 line-clamp-1 text-[12px] text-ash">
            {profile.shortBio}
          </p>
        ) : null}
      </div>

      {profile.topPlatform ? (
        <PlatformMark platform={profile.topPlatform} size={26} />
      ) : null}

      <div className="shrink-0 text-right">
        <p className="text-[18px] font-light leading-none text-chalk tabular-nums">
          {profile.totalSolved.toLocaleString()}
        </p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-smoke">
          solved
        </p>
      </div>

      <ArrowUpRight
        size={15}
        className="shrink-0 text-smoke transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-bone"
      />
    </Link>
  );
}
