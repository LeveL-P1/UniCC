import type { ReactNode } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black relative pt-24 text-white">
      {/* Cosmic Nebula Background */}
      <div
        className="fixed inset-0 z-0 opacity-50"
        style={{
          background: `
            radial-gradient(ellipse 110% 70% at 25% 80%, rgba(147, 51, 234, 0.12), transparent 55%),
            radial-gradient(ellipse 130% 60% at 75% 15%, rgba(59, 130, 246, 0.10), transparent 65%),
            radial-gradient(ellipse 80% 90% at 20% 30%, rgba(236, 72, 153, 0.14), transparent 50%),
            radial-gradient(ellipse 100% 40% at 60% 70%, rgba(16, 185, 129, 0.08), transparent 45%),
            #000000
          `,
        }}
      />
      {/* Grain effect */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("https://framerusercontent.com/images/rR6HYXBrMmX4cTwEXZGUQAP5I.svg")' }}
      />
      
      <div className="relative z-10">
        <PublicHeader />
        {children}
        <footer className="border-t border-white/10 py-8 mt-12 text-center text-sm text-neutral-400">
          Built for competitive programmers.
        </footer>
      </div>
    </div>
  );
}
