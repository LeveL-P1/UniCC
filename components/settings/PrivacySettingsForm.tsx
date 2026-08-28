"use client";

import { Globe, Lock, Search } from "lucide-react";
import type { UserSettings } from "@/types/profile";
import { SectionCard } from "@/components/ui/SectionCard";
import { ChoiceRow, ToggleRow } from "@/components/ui/toggle-row";
import { Eyebrow } from "@/components/ui/section-header";

export function PrivacySettingsForm({
  settings,
  onChange,
}: {
  settings: UserSettings;
  onChange: (next: UserSettings) => void;
}) {
  const visibility = settings.privacy.profileVisibility;

  return (
    <SectionCard
      title="Privacy"
      description="Who can see your record, and where it appears."
    >
      <div className="flex flex-col gap-7">
        <div>
          <Eyebrow>Profile visibility</Eyebrow>
          <div className="mt-3">
            <ChoiceRow
              value={visibility}
              onChange={(value) =>
                onChange({
                  ...settings,
                  privacy: { ...settings.privacy, profileVisibility: value },
                })
              }
              options={[
                { value: "public", label: "Public", icon: Globe },
                { value: "private", label: "Private", icon: Lock },
              ]}
            />
          </div>
          <p className="mt-3 text-[12px] text-smoke">
            {visibility === "public"
              ? "Anyone with the link can view your unified stats."
              : "Only you can view your profile page."}
          </p>
        </div>

        <div className="hairline-t pt-1">
          <ToggleRow
            label="Appear in search"
            description="Let other people find your profile from the UNICC search page."
            icon={Search}
            checked={settings.privacy.showInSearch}
            onChange={(value) =>
              onChange({
                ...settings,
                privacy: { ...settings.privacy, showInSearch: value },
              })
            }
          />
        </div>
      </div>
    </SectionCard>
  );
}
