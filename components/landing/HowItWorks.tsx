import { SectionCard } from "@/components/ui/SectionCard";

const STEPS = ["Search profile", "View limited stats", "Sign in for full analytics"];

export function HowItWorks() {
  return (
    <SectionCard title="How It Works">
      <div className="grid gap-3 md:grid-cols-3">
        {STEPS.map((step, index) => (
          <div key={step} className="rounded-xl border border-border bg-background p-4">
            <p className="text-xs text-muted-foreground">Step {index + 1}</p>
            <p className="mt-2 font-medium">{step}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
