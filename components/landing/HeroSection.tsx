"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-header";
import { HeroIllustration } from "@/components/landing/HeroIllustration";
import { MouseParallax } from "@/components/motion/MouseParallax";
import { Magnetic } from "@/components/motion/HoverPhysics";
import { EASE_OUT_EXPO } from "@/lib/motion";

/** Each line lifts in on its own beat rather than the block arriving at once. */
const line = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.06 * i, ease: EASE_OUT_EXPO },
  }),
};

export function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
  };

  return (
    <section className="relative isolate overflow-hidden">
      <div className="frame grid items-center gap-16 pb-20 pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:pb-32 lg:pt-24">
        {/* Copy */}
        <div className="max-w-[34rem]">
          <motion.div initial="hidden" animate="visible" custom={0} variants={line}>
            <Eyebrow>Unified</Eyebrow>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            custom={1}
            variants={line}
            className="mt-6 text-[46px] font-light leading-[1.02] tracking-[-1.1px] text-chalk sm:text-[58px] sm:tracking-[-1.4px] lg:text-[64px] lg:tracking-[-1.28px]"
          >
            Every rating.
            <br />
            <span className="text-bone">One page.</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            custom={2}
            variants={line}
            className="mt-7 max-w-[30rem] text-body text-ash"
          >
            UNICC pulls your LeetCode, Codeforces, CodeChef and AtCoder record
            into a single profile — solves, ratings, contests and the trend
            underneath them.
          </motion.p>

          {/* Search: the fastest path in for someone who has not signed up. */}
          <motion.form
            initial="hidden"
            animate="visible"
            custom={3}
            variants={line}
            onSubmit={onSubmit}
            className="group mt-9 flex w-full max-w-[26rem] items-center gap-2 rounded-pill bg-carbon py-1.5 pl-5 pr-1.5 hairline transition-colors focus-within:border-[rgba(212,208,201,0.32)]"
          >
            <Search size={15} className="shrink-0 text-smoke" aria-hidden />
            <label htmlFor="hero-search" className="sr-only">
              Search a handle
            </label>
            <input
              id="hero-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search any handle"
              className="min-w-0 flex-1 bg-transparent py-2 text-body-sm text-bone outline-none placeholder:text-smoke"
            />
            <Button type="submit" size="sm" variant="solid" className="shrink-0">
              Search
            </Button>
          </motion.form>

          <motion.div
            initial="hidden"
            animate="visible"
            custom={4}
            variants={line}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <SignedOut>
              <Magnetic>
                <Button asChild size="lg" variant="chalk">
                  <Link href="/sign-up">
                    Create your profile
                    <ArrowRight size={15} />
                  </Link>
                </Button>
              </Magnetic>
              <Button asChild size="lg" variant="ghost">
                <Link href="/sign-in">Sign in</Link>
              </Button>
            </SignedOut>
            <SignedIn>
              <Magnetic>
                <Button asChild size="lg" variant="chalk">
                  <Link href="/dashboard">
                    Open dashboard
                    <ArrowRight size={15} />
                  </Link>
                </Button>
              </Magnetic>
            </SignedIn>
          </motion.div>
        </div>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.15, ease: EASE_OUT_EXPO }}
          className="relative -mx-6 lg:mx-0"
        >
          <MouseParallax strength={26} className="aspect-[9/6] w-full">
            <div data-parallax="0.35" className="absolute inset-0">
              <HeroIllustration />
            </div>
          </MouseParallax>
        </motion.div>
      </div>
    </section>
  );
}
