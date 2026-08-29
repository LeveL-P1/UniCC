"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { Magnetic } from "@/components/motion/HoverPhysics";
import { Reveal } from "@/components/motion/Reveal";

export function LandingCTA() {
  return (
    <section className="frame py-20 lg:py-[112px]">
      <Reveal>
        <div className="relative overflow-hidden rounded-card bg-carbon px-6 py-16 text-center hairline sm:px-12 lg:py-20">
          <h2 className="mx-auto max-w-[16ch] text-[34px] font-light leading-[1.08] tracking-[-0.8px] text-chalk text-balance md:text-[48px] md:tracking-[-1px]">
            Put your whole record on one page.
          </h2>

          <p className="mx-auto mt-6 max-w-[48ch] text-body text-ash">
            Link your handles, let the sync run, and share a single URL that
            stays current on its own.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
                <Link href="/search">Browse profiles</Link>
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
              <Button asChild size="lg" variant="ghost">
                <Link href="/settings">Link a platform</Link>
              </Button>
            </SignedIn>
          </div>

          <BorderBeam
            size={220}
            duration={14}
            colorFrom="rgba(212,208,201,0)"
            colorTo="rgba(212,208,201,0.7)"
          />
        </div>
      </Reveal>
    </section>
  );
}
