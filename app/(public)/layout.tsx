import type { ReactNode } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicBackground } from "@/components/layout/PublicBackground";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { ScrollProgress } from "@/components/ui/scroll-progress";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-svh bg-obsidian text-bone">
      <PublicBackground />

      <div className="relative z-10 flex min-h-svh flex-col">
        <ScrollProgress className="h-px bg-bone/60" />
        <PublicHeader />
        <main className="flex-1 pt-16">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
