"use client";

import { BarChart3, Mail, Zap } from "lucide-react";
import type { UserSettings } from "@/types/profile";
import { SectionCard } from "@/components/ui/SectionCard";
import { ToggleRow } from "@/components/ui/toggle-row";

const OPTIONS = [
  {
    id: "weeklySummary",
    label: "Weekly summary",
    description: "A digest of the week's solves, ratings and streak every Monday.",
    icon: Mail,
  },
  {
    id: "profileViews",
    label: "Profile views",
    description: "Told when your public page picks up meaningful traffic.",
    icon: BarChart3,
  },
  {
    id: "ratingAlerts",
    label: "Rating changes",
    description: "Notified whenever a connected platform reports a new rating.",
    icon: Zap,
  },
] as const;

export function NotificationSettingsForm({
  settings,
  onChange,
}: {
  settings: UserSettings;
  onChange: (next: UserSettings) => void;
}) {
  return (
    <SectionCard
      title="Notifications"
      description="How and when UNICC reaches out."
    >
      <div className="flex flex-col">
        {OPTIONS.map((option) => (
          <ToggleRow
            key={option.id}
            label={option.label}
            description={option.description}
            icon={option.icon}
            checked={settings.notifications[option.id]}
            onChange={(value) =>
              onChange({
                ...settings,
                notifications: { ...settings.notifications, [option.id]: value },
              })
            }
          />
        ))}
      </div>
    </SectionCard>
  );
}
