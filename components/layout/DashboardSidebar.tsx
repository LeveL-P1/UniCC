"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ListChecks,
  Search,
  Settings,
  Plus,
  Menu,
  X,
} from "lucide-react";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Sessions", icon: ListChecks, href: "/sessions" },
  { name: "Search", icon: Search, href: "/search" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        className="fixed left-4 top-3.5 z-50 flex size-9 items-center justify-center rounded-pill bg-carbon text-bone hairline backdrop-blur-xl md:hidden"
      >
        <Menu size={17} />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 bg-obsidian/80 backdrop-blur-sm md:hidden"
          />
        ) : null}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-tar transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "border-r border-[rgba(212,208,201,0.12)]",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6 hairline-b">
          <Link href="/" aria-label="UNICC home">
            <Logo />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="flex size-8 items-center justify-center rounded-pill text-ash hover:text-chalk md:hidden"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <p className="eyebrow px-3 pb-3">Workspace</p>
          <ul className="flex flex-col gap-0.5">
            {NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-icon px-3 py-2.5 text-[13px] transition-colors",
                      active
                        ? "bg-carbon text-chalk"
                        : "text-ash hover:bg-carbon/60 hover:text-bone"
                    )}
                  >
                    {/* Active marker: a Bone rule, not a colour wash. */}
                    {active ? (
                      <motion.span
                        layoutId="sidebar-active"
                        className="absolute inset-y-1.5 left-0 w-[2px] rounded-full bg-bone"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    ) : null}
                    <item.icon
                      size={16}
                      className={cn(
                        "shrink-0 transition-colors",
                        active ? "text-bone" : "text-smoke group-hover:text-ash"
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 p-3 hairline-t">
          <Button asChild variant="surface" size="lg" className="w-full justify-start">
            <Link href="/settings" onClick={() => setOpen(false)}>
              <Plus size={15} />
              Link a platform
            </Link>
          </Button>
        </div>
      </aside>
    </>
  );
}
