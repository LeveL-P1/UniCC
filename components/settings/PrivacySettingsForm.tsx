import type { UserSettings } from "@/types/profile";
import { SectionCard } from "@/components/ui/SectionCard";
import { Eye, EyeOff, Search, Globe, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrivacySettingsFormProps {
  settings: UserSettings;
  onChange: (next: UserSettings) => void;
}

export function PrivacySettingsForm({ settings, onChange }: PrivacySettingsFormProps) {
  const isPublic = settings.privacy.profileVisibility === "public";

  return (
    <SectionCard title="Privacy" description="Control who can see your data and where you appear.">
      <div className="space-y-6">
        {/* Profile Visibility Toggle */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Profile Visibility</p>
          <div className="flex gap-3">
            <button
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-200",
                isPublic 
                  ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400" 
                  : "bg-white/[0.02] border-white/5 text-neutral-500 hover:bg-white/[0.05]"
              )}
              onClick={() => onChange({ ...settings, privacy: { ...settings.privacy, profileVisibility: "public" } })}
            >
              <Globe size={16} />
              <span className="font-bold text-sm">Public</span>
            </button>
            <button
              className={cn(
                "flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-200",
                !isPublic 
                  ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400" 
                  : "bg-white/[0.02] border-white/5 text-neutral-500 hover:bg-white/[0.05]"
              )}
              onClick={() => onChange({ ...settings, privacy: { ...settings.privacy, profileVisibility: "private" } })}
            >
              <Lock size={16} />
              <span className="font-bold text-sm">Private</span>
            </button>
          </div>
        </div>

        {/* Search Toggle */}
        <button
          onClick={() => onChange({ ...settings, privacy: { ...settings.privacy, showInSearch: !settings.privacy.showInSearch } })}
          className={cn(
            "flex w-full items-center gap-4 text-left p-4 rounded-2xl border transition-all duration-200 group",
            settings.privacy.showInSearch 
              ? "bg-indigo-600/5 border-indigo-500/20 text-white" 
              : "bg-white/[0.02] border-white/5 text-neutral-400 hover:bg-white/[0.05]"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            settings.privacy.showInSearch ? "bg-indigo-600/20 text-indigo-400" : "bg-white/5 text-neutral-500 group-hover:text-neutral-400"
          )}>
            <Search size={18} />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Discoverable in Search</p>
            <p className="text-xs text-neutral-500 mt-0.5">Let others find your profile using the search feature.</p>
          </div>
          <div className={cn(
            "w-10 h-5 rounded-full relative transition-colors duration-200",
            settings.privacy.showInSearch ? "bg-indigo-500" : "bg-neutral-800"
          )}>
            <div className={cn(
              "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200",
              settings.privacy.showInSearch ? "left-6" : "left-1"
            )} />
          </div>
        </button>
      </div>
    </SectionCard>
  );
}
