import type { UserSettings } from "@/types/profile";
import { SectionCard } from "@/components/ui/SectionCard";

interface PrivacySettingsFormProps {
  settings: UserSettings;
  onChange: (next: UserSettings) => void;
}

export function PrivacySettingsForm({ settings, onChange }: PrivacySettingsFormProps) {
  return (
    <SectionCard title="Privacy">
      <div className="space-y-4 text-sm">
        <div>
          <p className="mb-2 text-muted-foreground">Profile visibility</p>
          <div className="flex gap-2">
            <button
              className="rounded-lg border border-border px-3 py-2"
              onClick={() =>
                onChange({
                  ...settings,
                  privacy: { ...settings.privacy, profileVisibility: "public" },
                })
              }
            >
              Public
            </button>
            <button
              className="rounded-lg border border-border px-3 py-2"
              onClick={() =>
                onChange({
                  ...settings,
                  privacy: { ...settings.privacy, profileVisibility: "private" },
                })
              }
            >
              Private
            </button>
          </div>
        </div>
        <button
          onClick={() =>
            onChange({
              ...settings,
              privacy: { ...settings.privacy, showInSearch: !settings.privacy.showInSearch },
            })
          }
          className="flex w-full justify-between rounded-lg border border-border p-3"
        >
          <span>Show profile in search</span>
          <span>{settings.privacy.showInSearch ? "ON" : "OFF"}</span>
        </button>
      </div>
    </SectionCard>
  );
}
