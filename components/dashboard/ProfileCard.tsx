import { SectionCard } from "@/components/ui/SectionCard";

interface ProfileCardProps {
  username: string;
  fullName: string;
  bio: string;
}

export function ProfileCard({ username, fullName, bio }: ProfileCardProps) {
  return (
    <SectionCard title="Your Profile" className="md:col-span-2">
      <p className="text-lg font-semibold">@{username}</p>
      <p className="text-sm text-muted-foreground">{fullName}</p>
      <p className="mt-3 text-sm">{bio}</p>
      <p className="mt-4 text-sm text-muted-foreground">Public URL: /u/{username}</p>
    </SectionCard>
  );
}
