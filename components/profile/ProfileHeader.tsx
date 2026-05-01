import type { PublicProfile } from "@/types/profile";
import { SectionCard } from "@/components/ui/SectionCard";

export function ProfileHeader({ profile }: { profile: PublicProfile }) {
  return (
    <SectionCard>
      <div className="flex items-start gap-4">
        <img
          src={profile.avatarUrl ?? "https://api.dicebear.com/9.x/initials/svg?seed=user"}
          alt={profile.username}
          className="h-16 w-16 rounded-full border border-border"
        />
        <div>
          <p className="text-xl font-semibold">@{profile.username}</p>
          <p className="text-sm text-muted-foreground">{profile.fullName}</p>
          <p className="mt-2 text-sm">{profile.bio}</p>
        </div>
      </div>
    </SectionCard>
  );
}
