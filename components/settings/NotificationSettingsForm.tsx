import type { UserSettings } from "@/types/profile";
import { SectionCard } from "@/components/ui/SectionCard";

interface NotificationSettingsFormProps {
  settings: UserSettings;
  onChange: (next: UserSettings) => void;
}

export function NotificationSettingsForm({ settings, onChange }: NotificationSettingsFormProps) {
  const toggle = (field: keyof UserSettings["notifications"]) => {
    onChange({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: !settings.notifications[field],
      },
    });
  };

  return (
    <SectionCard title="Notifications">
      <div className="space-y-3 text-sm">
        <button onClick={() => toggle("weeklySummary")} className="flex w-full justify-between rounded-lg border border-border p-3">
          <span>Weekly stats summary</span>
          <span>{settings.notifications.weeklySummary ? "ON" : "OFF"}</span>
        </button>
        <button onClick={() => toggle("profileViews")} className="flex w-full justify-between rounded-lg border border-border p-3">
          <span>Profile view alerts</span>
          <span>{settings.notifications.profileViews ? "ON" : "OFF"}</span>
        </button>
        <button onClick={() => toggle("ratingAlerts")} className="flex w-full justify-between rounded-lg border border-border p-3">
          <span>Rating change alerts</span>
          <span>{settings.notifications.ratingAlerts ? "ON" : "OFF"}</span>
        </button>
      </div>
    </SectionCard>
  );
}
