import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-svh bg-obsidian text-bone">
      <DashboardSidebar />

      <div className="flex min-h-svh flex-col md:pl-64">
        <DashboardHeader />

        <main className="flex-1 px-6 py-8 lg:px-10 lg:py-10">{children}</main>

        <footer className="px-6 py-5 hairline-t lg:px-10">
          <p className="text-[12px] text-smoke">
            &copy; {new Date().getFullYear()} UNICC — experimental. Figures
            reflect what each platform publishes.
          </p>
        </footer>
      </div>
    </div>
  );
}
