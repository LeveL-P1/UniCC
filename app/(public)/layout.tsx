"use client";

import type { ReactNode } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { SocialGraphBackground } from "@/components/landing/SocialGraphBackground";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background">
      <SocialGraphBackground />
      <div className="relative z-10">
        <PublicHeader />
        {children}
        <footer className="border-t border-border/70 py-8 text-center text-sm text-muted-foreground">
          Built for competitive programmers.
        </footer>
      </div>
    </div>
  );
}
