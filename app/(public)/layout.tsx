import type { ReactNode } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      {children}
      <footer className="border-t border-border/70 py-8 text-center text-sm text-muted-foreground">
        Built for competitive programmers.
      </footer>
    </div>
  );
}
