"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AccountSettingsForm } from "@/components/settings/AccountSettingsForm";
import { DangerZoneCard } from "@/components/settings/DangerZoneCard";
import { NotificationSettingsForm } from "@/components/settings/NotificationSettingsForm";
import { PrivacySettingsForm } from "@/components/settings/PrivacySettingsForm";
import { Button } from "@/components/ui/button";
import { useUserSettings } from "@/hooks/useUserSettings";
import { Settings as SettingsIcon, Save, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const { settings, setSettings, saveSettings, loading, error } = useUserSettings();
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await saveSettings(settings);
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Settings Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <SettingsIcon size={14} />
            <span>Preferences</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Account <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Settings</span>
          </h1>
          <p className="mt-2 text-neutral-400 max-w-lg">
            Manage your account preferences, notifications, and privacy controls.
          </p>
        </div>
        <Button 
          onClick={onSave} 
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-6 h-auto font-bold shadow-lg shadow-indigo-500/20 transition-all gap-2"
        >
          <Save size={18} />
          {saving ? "Saving Changes..." : "Save All Changes"}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-neutral-500 py-12 justify-center">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading your preferences...</span>
        </div>
      ) : null}
      
      {error ? (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          {error}
        </div>
      ) : null}

      <div className="grid gap-8 pb-12">
        <AccountSettingsForm />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <NotificationSettingsForm settings={settings} onChange={setSettings} />
          <PrivacySettingsForm settings={settings} onChange={setSettings} />
        </div>

        <DangerZoneCard />
      </div>
    </div>
  );
}
