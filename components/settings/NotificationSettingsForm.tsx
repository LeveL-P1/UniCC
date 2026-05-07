import type { UserSettings } from "@/types/profile";
import { SectionCard } from "@/components/ui/SectionCard";
import { Bell, Mail, BarChart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const options = [
    { id: "weeklySummary", label: "Weekly Stats Summary", desc: "Receive a summary of your coding progress every Monday.", icon: Mail },
    { id: "profileViews", label: "Profile View Alerts", desc: "Get notified when your public profile gets significant traffic.", icon: BarChart },
    { id: "ratingAlerts", label: "Rating Change Alerts", desc: "Instant notification when your platform ratings change.", icon: Zap },
  ] as const;

  return (
    <SectionCard title="Notifications" description="Manage how and when you receive updates.">
      <div className="space-y-4">
        {options.map((opt) => {
          const isActive = settings.notifications[opt.id];
          return (
            <button 
              key={opt.id}
              onClick={() => toggle(opt.id)} 
              className={cn(
                "flex w-full items-center gap-4 text-left p-4 rounded-2xl border transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-600/5 border-indigo-500/20 text-white" 
                  : "bg-white/[0.02] border-white/5 text-neutral-400 hover:bg-white/[0.05]"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                isActive ? "bg-indigo-600/20 text-indigo-400" : "bg-white/5 text-neutral-500 group-hover:text-neutral-400"
              )}>
                <opt.icon size={18} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm">{opt.label}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{opt.desc}</p>
              </div>
              <div className={cn(
                "w-10 h-5 rounded-full relative transition-colors duration-200",
                isActive ? "bg-indigo-500" : "bg-neutral-800"
              )}>
                <div className={cn(
                  "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200",
                  isActive ? "left-6" : "left-1"
                )} />
              </div>
            </button>
          );
        })}
      </div>
    </SectionCard>
  );
}
