import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/SectionCard";
import { AlertTriangle, Trash2 } from "lucide-react";

export function DangerZoneCard() {
  return (
    <SectionCard 
      title="Danger Zone" 
      className="border-red-500/20 bg-red-500/[0.02] hover:border-red-500/30"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-red-500/10 text-red-400">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-400">Delete Account</h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-xl">
              Once you delete your account, there is no going back. This will permanently remove all your 
              connected platforms, profile data, and analytics. Please be certain.
            </p>
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          className="bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition-all rounded-xl px-6 py-5 font-bold flex items-center gap-2"
        >
          <Trash2 size={16} />
          Delete Account
        </Button>
      </div>
    </SectionCard>
  );
}
