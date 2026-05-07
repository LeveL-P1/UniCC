"use client";

import { UserButton } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 w-full bg-[#0b0b12]/40 backdrop-blur-md border-b border-white/5">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Breadcrumbs or Search */}
        <div className="hidden md:flex items-center gap-2 text-sm text-neutral-400">
          <span>Pages</span>
          <span className="text-neutral-600">/</span>
          <span className="text-white font-medium">Dashboard</span>
        </div>

        {/* Search Bar Placeholder for Mobile / Desktop */}
        <div className="flex-1 max-w-md mx-6 hidden lg:block">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search features..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-neutral-400 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#0b0b12]" />
          </button>
          
          <div className="h-6 w-[1px] bg-white/10 mx-2 hidden sm:block" />
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-300 hidden sm:block">My Account</span>
            <UserButton afterSignOutUrl="/" appearance={{
              elements: {
                avatarBox: "w-9 h-9 rounded-xl border border-white/10"
              }
            }} />
          </div>
        </div>
      </div>
    </header>
  );
}
