import { Github, Globe, Twitter } from "lucide-react";
import type { PublicProfile } from "@/types/profile";
import { Eyebrow } from "@/components/ui/section-header";
import { Tag } from "@/components/ui/surface";

const SOCIALS = [
  { key: "github", icon: Github, label: "GitHub" },
  { key: "twitter", icon: Twitter, label: "Twitter" },
  { key: "website", icon: Globe, label: "Website" },
] as const;

export function ProfileHeader({ profile }: { profile: PublicProfile }) {
  const initials = (profile.fullName || profile.username)
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex flex-col gap-8 pb-10 hairline-b md:flex-row md:items-end">
      <div className="flex items-center gap-5">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt=""
            className="size-20 shrink-0 rounded-pill object-cover hairline"
          />
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-pill bg-carbon text-subheading font-light text-bone hairline">
            {initials || "—"}
          </div>
        )}

        <div className="min-w-0">
          <Eyebrow>Profile</Eyebrow>
          <h1 className="mt-2 truncate text-[26px] font-light leading-[1.1] tracking-[-0.52px] text-chalk md:text-[34px] md:tracking-[-0.7px]">
            {profile.fullName || profile.username}
          </h1>
          <p className="mt-1.5 font-mono text-[12px] tracking-[0.06em] text-ash">
            @{profile.username}
          </p>
        </div>
      </div>

      <div className="md:ml-auto md:max-w-[36ch] md:text-right">
        {profile.bio ? (
          <p className="text-body-sm text-ash">{profile.bio}</p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2 md:justify-end">
          {profile.isOwner ? <Tag>Your profile</Tag> : null}
          {SOCIALS.map(({ key, icon: Icon, label }) => {
            const href = profile.socials?.[key];
            if (!href) return null;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex size-8 items-center justify-center rounded-pill text-ash transition-colors hover:bg-carbon hover:text-chalk"
              >
                <Icon size={15} />
              </a>
            );
          })}
        </div>
      </div>
    </header>
  );
}
