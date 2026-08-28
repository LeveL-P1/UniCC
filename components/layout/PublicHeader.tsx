"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Link001 } from "@/components/ui/skiper-ui/skiper40";
import { Logo } from "@/components/layout/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { name: "Search", href: "/search", external: false },
  { name: "GitHub", href: "https://github.com/LeveL-P1/UniCC", external: true },
  { name: "Contact", href: "#contact", external: false },
];

/**
 * Transparent and flush to the page edges — no contained bar. It only grows a
 * hairline and a blur once you have scrolled past the hero.
 */
export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-[rgba(212,208,201,0.12)] bg-obsidian/80 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <div className="frame flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="UNICC home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] text-bone md:flex">
          {NAV.map((item) =>
            item.external ? (
              <Link001 key={item.name} href={item.href} className="text-bone hover:text-chalk">
                {item.name}
              </Link001>
            ) : (
              <Link
                key={item.name}
                href={item.href}
                className="text-ash transition-colors hover:text-chalk"
              >
                {item.name}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2">
          <SignedOut>
            <Button asChild variant="quiet" size="sm" className="hidden sm:inline-flex">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild variant="chalk" size="sm" className="hidden sm:inline-flex">
              <Link href="/sign-up">Create profile</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <UserButton
              afterSignOutUrl="/"
              appearance={{ elements: { avatarBox: "size-8 rounded-pill" } }}
            />
          </SignedIn>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex size-9 items-center justify-center rounded-pill text-bone transition-colors hover:bg-carbon md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="border-t border-[rgba(212,208,201,0.12)] bg-obsidian/95 backdrop-blur-xl md:hidden"
        >
          <div className="frame flex flex-col gap-1 py-4">
            {NAV.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-icon px-2 py-2.5 text-body-sm text-ash transition-colors hover:bg-carbon hover:text-chalk"
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <SignedOut>
                <Button asChild variant="chalk" size="lg">
                  <Link href="/sign-up" onClick={() => setOpen(false)}>
                    Create profile
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link href="/sign-in" onClick={() => setOpen(false)}>
                    Sign in
                  </Link>
                </Button>
              </SignedOut>
              <SignedIn>
                <Button asChild variant="ghost" size="lg">
                  <Link href="/dashboard" onClick={() => setOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
              </SignedIn>
            </div>
          </div>
        </motion.div>
      ) : null}
    </header>
  );
}
