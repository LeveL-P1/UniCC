"use client";

import { useUser } from "@clerk/nextjs";
import { Info } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionCard } from "@/components/ui/SectionCard";

/**
 * Reads the signed-in Clerk user rather than the placeholder strings this
 * form used to display. Identity is owned by Clerk, so every field is
 * read-only here and edited in the account menu.
 */
export function AccountSettingsForm() {
  const { user, isLoaded } = useUser();

  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const username = user?.username ?? user?.id?.slice(-10) ?? "";
  const fullName = user?.fullName ?? "";

  return (
    <SectionCard
      title="Account"
      description="Managed by Clerk. Change these from the account menu in the header."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <ReadOnlyField
          id="account-name"
          label="Name"
          value={fullName}
          loading={!isLoaded}
        />
        <ReadOnlyField
          id="account-email"
          label="Email"
          value={email}
          loading={!isLoaded}
        />
        <ReadOnlyField
          id="account-username"
          label="Username"
          value={username ? `@${username}` : ""}
          loading={!isLoaded}
        />
      </div>

      <p className="mt-6 flex items-center gap-2 text-[12px] text-smoke">
        <Info size={13} className="shrink-0" />
        Your public page lives at{" "}
        <span className="font-mono text-ash">/u/{username || "…"}</span>
      </p>
    </SectionCard>
  );
}

function ReadOnlyField({
  id,
  label,
  value,
  loading,
}: {
  id: string;
  label: string;
  value: string;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor={id}>{label}</Label>
      {loading ? (
        <div className="h-10 animate-pulse rounded-input bg-tar" />
      ) : (
        <Input
          id={id}
          readOnly
          value={value || "—"}
          className="cursor-not-allowed text-ash"
        />
      )}
    </div>
  );
}
