import Link from "next/link";
import type { SearchResultProfile } from "@/types/profile";
import { SectionCard } from "@/components/ui/SectionCard";

export function ProfileResultCard({ profile }: { profile: SearchResultProfile }) {
  return (
    <SectionCard className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold">@{profile.username}</p>
          <p className="text-sm text-muted-foreground">{profile.fullName}</p>
          <p className="mt-2 text-sm text-muted-foreground">{profile.shortBio}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">{profile.totalSolved}</p>
          <p className="text-xs text-muted-foreground">solved</p>
        </div>
      </div>
      <Link href={`/u/${profile.username}`} className="mt-4 inline-block text-sm text-primary">
        View stats {"->"}
      </Link>
    </SectionCard>
  );
}
