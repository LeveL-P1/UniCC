import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/SectionCard";

export function DangerZoneCard() {
  return (
    <SectionCard title="Danger Zone">
      <p className="text-sm text-muted-foreground">Deleting your account removes all connected platforms and profile data.</p>
      <Button variant="destructive" size="sm" className="mt-4">
        Delete account
      </Button>
    </SectionCard>
  );
}
