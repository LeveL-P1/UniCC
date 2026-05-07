import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionCard } from "@/components/ui/SectionCard";
import { User, Mail, Info } from "lucide-react";

export function AccountSettingsForm() {
  return (
    <SectionCard 
      title="Personal Information" 
      description="Your basic account details. Some information is managed by Clerk."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="account-email" className="text-neutral-300 flex items-center gap-2">
            <Mail size={14} className="text-indigo-400" />
            Email Address
          </Label>
          <div className="relative">
            <Input 
              id="account-email" 
              value="user@example.com" 
              readOnly 
              className="bg-white/5 border-white/10 text-neutral-400 cursor-not-allowed pr-10 rounded-xl"
            />
            <Info size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600" />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="account-username" className="text-neutral-300 flex items-center gap-2">
            <User size={14} className="text-indigo-400" />
            Username
          </Label>
          <div className="relative">
            <Input 
              id="account-username" 
              value="@username" 
              readOnly 
              className="bg-white/5 border-white/10 text-neutral-400 cursor-not-allowed pr-10 rounded-xl"
            />
            <Info size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600" />
          </div>
        </div>
      </div>
      
      <p className="mt-6 text-[10px] text-neutral-600 uppercase tracking-widest font-bold">
        To change these details, please visit your profile settings in Clerk.
      </p>
    </SectionCard>
  );
}
