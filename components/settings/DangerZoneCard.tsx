import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/ui/SectionCard";

/**
 * There is no account-deletion endpoint yet, so the action is disabled and
 * says so, rather than presenting a button that silently does nothing.
 */
export function DangerZoneCard() {
  return (
    <SectionCard
      title="Danger zone"
      className="border-destructive/25"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-icon bg-destructive/10 text-destructive">
            <TriangleAlert size={15} />
          </span>
          <div>
            <p className="text-body-sm text-bone">Delete account</p>
            <p className="mt-1.5 max-w-[60ch] text-[12px] text-smoke">
              Permanently removes your linked platforms, sessions, snapshots and
              public page. Not reversible — and not wired up yet. Use the account
              menu in the header to remove your Clerk identity in the meantime.
            </p>
          </div>
        </div>

        <Button variant="danger" size="lg" disabled className="shrink-0">
          Not available yet
        </Button>
      </div>
    </SectionCard>
  );
}
