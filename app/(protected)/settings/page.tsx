"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { PageContainer } from "@/components/layout/PageContainer";
import { AccountSettingsForm } from "@/components/settings/AccountSettingsForm";
import { DangerZoneCard } from "@/components/settings/DangerZoneCard";
import { NotificationSettingsForm } from "@/components/settings/NotificationSettingsForm";
import { PrivacySettingsForm } from "@/components/settings/PrivacySettingsForm";
import { Button } from "@/components/ui/button";
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
    <PageContainer className="py-8">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">Account preferences, notifications, and privacy controls.</p>

      {loading ? <p className="mt-4 text-sm text-muted-foreground">Loading settings...</p> : null}
      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      <div className="mt-6 grid gap-4">
        <AccountSettingsForm />
        <NotificationSettingsForm settings={settings} onChange={setSettings} />
        <PrivacySettingsForm settings={settings} onChange={setSettings} />
        <DangerZoneCard />
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </PageContainer>
  );
}
