"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Settings, 
  User, 
  BarChart2, 
  Search, 
  Globe,
  PlusCircle,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "My Profile", icon: User, href: "/dashboard/profile" },
  { name: "Search", icon: Search, href: "/search" },
  { name: "Public Page", icon: Globe, href: "/u/p1" }, // Example path
  { name: "Analytics", icon: BarChart2, href: "/dashboard/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white/5 border border-white/10 rounded-lg backdrop-blur-md"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform bg-[#0b0b12]/80 backdrop-blur-xl border-r border-white/5 transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                U
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
                UniCC
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-white/10 text-white border border-white/10 shadow-lg shadow-indigo-500/10" 
                      : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
                  )}
                >
                  <item.icon size={20} className={cn(
                    "transition-colors",
                    isActive ? "text-indigo-400" : "text-neutral-500 group-hover:text-neutral-300"
                  )} />
                  <span className="font-medium text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Profile Quick Link / Actions */}
          <div className="p-4 border-t border-white/5">
            <button className="flex items-center gap-3 w-full px-4 py-3 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/20 transition-all">
              <PlusCircle size={20} />
              <span className="font-medium text-sm">Add Platform</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
