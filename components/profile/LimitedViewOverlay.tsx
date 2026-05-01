import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LimitedViewOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/70 backdrop-blur-sm">
      <div className="rounded-xl border border-border bg-card p-5 text-center">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Lock size={16} />
        </div>
        <p className="mt-3 text-lg font-semibold">Sign in to unlock full analytics</p>
        <p className="mt-1 text-sm text-muted-foreground">Heatmaps, rating timeline, and detailed insights are protected.</p>
        <div className="mt-4 flex justify-center gap-2">
          <Button asChild size="sm">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
