"use client";

import { useState } from "react";
import toast from "react-hot-toast";

import { AccountSettingsForm } from "@/components/settings/AccountSettingsForm";
import { DangerZoneCard } from "@/components/settings/DangerZoneCard";
import { NotificationSettingsForm } from "@/components/settings/NotificationSettingsForm";
import { PrivacySettingsForm } from "@/components/settings/PrivacySettingsForm";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-header";
import { Surface } from "@/components/ui/surface";
import { useUserSettings } from "@/hooks/useUserSettings";

export default function SettingsPage() {
  const { settings, setSettings, saveSettings, loading, error } = useUserSettings();
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await saveSettings(settings);
      toast.success("Settings saved");
    } catch {
      toast.error("Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-8">
      <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Preferences</Eyebrow>
          <h1 className="mt-3 text-[32px] font-light leading-[1.1] tracking-[-0.64px] text-chalk md:text-[40px] md:tracking-[-0.8px]">
            Settings
          </h1>
          <p className="mt-3 max-w-[52ch] text-body-sm text-ash">
            Notification preferences and who can see your unified record.
          </p>
        </div>

        <Button size="lg" onClick={onSave} disabled={saving || loading}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </header>

      {error ? (
        <Surface className="flex items-center gap-3 border-destructive/30 py-4">
          <span className="size-1.5 shrink-0 rounded-full bg-destructive" />
          <p className="text-body-sm text-bone">{error}</p>
        </Surface>
      ) : null}

      {loading ? (
        <div className="flex flex-col gap-6">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-44 animate-pulse rounded-card bg-carbon" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6 pb-6">
          <AccountSettingsForm />

          <div className="grid gap-6 lg:grid-cols-2">
            <NotificationSettingsForm settings={settings} onChange={setSettings} />
            <PrivacySettingsForm settings={settings} onChange={setSettings} />
          </div>

          <DangerZoneCard />
        </div>
      )}
    </div>
  );
}
