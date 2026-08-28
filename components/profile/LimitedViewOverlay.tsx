import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-header";

export function LimitedViewOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-card bg-obsidian/70 backdrop-blur-sm">
      <div className="mx-6 max-w-sm rounded-card bg-carbon p-8 text-center hairline">
        <span className="mx-auto flex size-9 items-center justify-center rounded-pill bg-tar text-bone">
          <Lock size={15} />
        </span>
        <Eyebrow className="mt-5">Locked</Eyebrow>
        <p className="mt-3 text-subheading font-light text-chalk">
          Sign in to see the full analytics
        </p>
        <p className="mt-3 text-body-sm text-ash">
          Heatmaps, rating history and topic breakdowns are available to signed-in
          users.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button asChild size="sm">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link href="/sign-up">Create profile</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
