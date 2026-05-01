"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/lib/api-client";
import type { UserSettings } from "@/types/profile";
import { defaultUserSettings } from "@/lib/mock-data";

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultUserSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getSettings()
      .then((data) => {
        if (active) setSettings(data.settings);
      })
      .catch(() => {
        if (active) setError("Could not load settings");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const saveSettings = async (nextSettings: UserSettings) => {
    const previous = settings;
    setSettings(nextSettings);
    try {
      await updateSettings(nextSettings);
      setError(null);
    } catch {
      setSettings(previous);
      setError("Saving settings failed");
      throw new Error("save_failed");
    }
  };

  return { settings, setSettings, saveSettings, loading, error };
}
