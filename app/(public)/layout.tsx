import type { ReactNode } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicBackground } from "@/components/layout/PublicBackground";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black relative pt-24 text-white">
      {/* Cosmic Nebula Background */}
      <PublicBackground />
      
      <div className="relative z-10">
        <PublicHeader />
        {children}
        <footer className="border-t border-white/30 py-4 mt-3 text-center text-sm text-neutral-400">
          Built for competitive programmers.
          <span className="font-medium text-white underline px-2">Built by <a href="https://github.com/LeveL-P1">P1</a>.  </span>  
        </footer>
      </div>
    </div>
  );
}
