import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionCard } from "@/components/ui/SectionCard";

export function AccountSettingsForm() {
  return (
    <SectionCard title="Account">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="account-email">Email</Label>
          <Input id="account-email" value="user@example.com" readOnly />
        </div>
        <div className="space-y-2">
          <Label htmlFor="account-username">Username</Label>
          <Input id="account-username" value="@username" readOnly />
        </div>
      </div>
    </SectionCard>
  );
}
