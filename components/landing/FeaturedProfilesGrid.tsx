import Link from "next/link";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { mockSearchResults } from "@/lib/mock-data";

export function FeaturedProfilesGrid() {
  return (
    <section className="py-8">
      <h2 className="mb-4 text-2xl font-semibold">Featured Profiles</h2>
      <BentoGrid>
        {mockSearchResults.slice(0, 3).map((profile, index) => (
          <BentoGridItem key={profile.username} className={index === 0 ? "md:col-span-2" : ""}>
            <p className="text-lg font-semibold">@{profile.username}</p>
            <p className="mt-1 text-sm text-muted-foreground">{profile.shortBio}</p>
            <p className="mt-4 text-sm">{profile.totalSolved} solved</p>
            <Link href={`/u/${profile.username}`} className="mt-4 inline-block text-sm text-primary">
              View profile {"->"}
            </Link>
          </BentoGridItem>
        ))}
      </BentoGrid>
    </section>
  );
}
