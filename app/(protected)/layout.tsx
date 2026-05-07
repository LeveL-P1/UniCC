import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PublicBackground } from "@/components/layout/PublicBackground";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="relative min-h-screen bg-[#0b0b12] text-white overflow-x-hidden">
      {/* Background Effect */}
      <PublicBackground />
      
      {/* Sidebar - Traditional 2-part layout */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="md:ml-64 flex flex-col min-h-screen relative z-10">
        <DashboardHeader />
        
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
        
        <footer className="px-6 py-4 border-t border-white/5 text-center md:text-left">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} UniCC Dashboard. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
