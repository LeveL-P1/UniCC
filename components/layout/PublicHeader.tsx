"use client";

import Link from "next/link";
import { useScrollHeader } from "@/hooks/useScrollHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PublicHeader() {
  const isScrolled = useScrollHeader();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur",
        isScrolled ? "py-2" : "py-4"
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 md:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          UniCC
        </Link>
        <div className="hidden flex-1 sm:block">
          <Input aria-label="Search profiles" placeholder="Search username or handle..." className="h-9" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/sign-up">Create Profile</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
