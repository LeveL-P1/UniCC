"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

import { Surface } from "@/components/ui/surface";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-header";

interface ProfileCardProps {
  username: string;
  fullName: string;
  bio: string;
}

export function ProfileCard({ username, fullName, bio }: ProfileCardProps) {
  const [copied, setCopied] = useState(false);

  /** Build from the real origin — never a hardcoded domain. */
  const path = `/u/${username}`;
  const displayUrl =
    typeof window === "undefined"
      ? path
      : `${window.location.host}${path}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setCopied(true);
      toast.success("Profile link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Surface className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="flex size-14 shrink-0 items-center justify-center rounded-pill bg-tar text-[16px] font-light text-bone hairline">
        {initials || "—"}
      </div>

      <div className="min-w-0 flex-1">
        <Eyebrow>Public profile</Eyebrow>
        <p className="mt-2 truncate text-subheading font-light text-chalk">
          {fullName}
        </p>
        <p className="mt-1 truncate font-mono text-[11px] tracking-[0.06em] text-smoke">
          {displayUrl}
        </p>
        {bio ? (
          <p className="mt-3 line-clamp-2 max-w-[46ch] text-[13px] text-ash">{bio}</p>
        ) : null}
      </div>

      <div className="flex shrink-0 gap-2">
        <Button variant="ghost" size="sm" onClick={copy}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy link"}
        </Button>
        <Button asChild variant="surface" size="sm">
          <a href={path} target="_blank" rel="noreferrer">
            View
            <ExternalLink size={13} />
          </a>
        </Button>
      </div>
    </Surface>
  );
}
