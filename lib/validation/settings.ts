import { Prisma } from "@prisma/client";
import { defaultUserSettings } from "@/lib/mock-data";
import type { UserSettings } from "@/types/profile";
import { isRecord } from "@/lib/validation/common";

function parseBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

export function normalizeUserSettings(input: unknown, fallback: UserSettings = defaultUserSettings): UserSettings {
  const root = isRecord(input) ? input : {};
  const notifications = isRecord(root.notifications) ? root.notifications : {};
  const privacy = isRecord(root.privacy) ? root.privacy : {};
  const visibility = privacy.profileVisibility === "private" ? "private" : fallback.privacy.profileVisibility;

  return {
    notifications: {
      weeklySummary: parseBoolean(notifications.weeklySummary, fallback.notifications.weeklySummary),
      profileViews: parseBoolean(notifications.profileViews, fallback.notifications.profileViews),
      ratingAlerts: parseBoolean(notifications.ratingAlerts, fallback.notifications.ratingAlerts),
    },
    privacy: {
      profileVisibility: visibility,
      showInSearch: parseBoolean(privacy.showInSearch, fallback.privacy.showInSearch),
    },
  };
}

export function settingsToPrisma(settings: UserSettings) {
  return {
    notifications: settings.notifications as unknown as Prisma.InputJsonValue,
    privacy: settings.privacy as unknown as Prisma.InputJsonValue,
  };
}

export function settingsFromPrisma(value: { notifications: Prisma.JsonValue; privacy: Prisma.JsonValue } | null) {
  if (!value) return defaultUserSettings;
  return normalizeUserSettings({
    notifications: value.notifications,
    privacy: value.privacy,
  });
}
