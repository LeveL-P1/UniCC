"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";

const TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/sessions": "Sessions",
  "/settings": "Settings",
  "/search": "Search",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const title = TITLES[pathname] ?? "Overview";

  return (
    <header className="sticky top-0 z-30 h-16 shrink-0 border-b border-[rgba(212,208,201,0.12)] bg-obsidian/80 backdrop-blur-xl">
      <div className="flex h-full items-center gap-4 px-6 pl-16 md:pl-6">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="eyebrow hidden sm:inline">UNICC</span>
          <span className="hidden text-smoke sm:inline">/</span>
          <h1 className="truncate text-[15px] font-normal text-chalk">{title}</h1>
        </div>

        {/* Real search — routes to /search rather than filtering nothing. */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const trimmed = query.trim();
            if (trimmed) router.push(`/search?q=${encodeURIComponent(trimmed)}`);
          }}
          className="ml-auto hidden max-w-xs flex-1 items-center gap-2 rounded-pill bg-carbon px-3.5 py-1.5 hairline transition-colors focus-within:border-[rgba(212,208,201,0.32)] lg:flex"
        >
          <Search size={14} className="shrink-0 text-smoke" aria-hidden />
          <label htmlFor="dash-search" className="sr-only">
            Search profiles
          </label>
          <input
            id="dash-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search profiles"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-bone outline-none placeholder:text-smoke"
          />
        </form>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "size-8 rounded-pill" } }}
          />
        </div>
      </div>
    </header>
  );
}
