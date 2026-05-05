"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { PLATFORM_ORDER, PLATFORMS } from "@/lib/constants";

const BentoCard = ({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-transparent border border-white/50 p-8  transition-all hover:bg-[#492986] min-h-[400px] ${className}`}
    >
      <div className="flex-1 relative w-full h-full">{children}</div>
      <div className="mt-8 flex items-center justify-between border-t border-white/50 pt-6">
        <h3 className="text-xl font-medium text-white max-w-[80%] leading-tight">{title}</h3>
        <Plus className="h-6 w-6 text-neutral-400 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
};

export function BentoFeatures() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white max-w-2xl leading-tight tracking-tight">
          Built for Fast Moving Programmers That Need Stats.
        </h2>
        <p className="text-white/80 max-w-md text-base md:text-lg">
          UniCC works across your existing platforms, providing a unified dashboard, deep performance analytics, and full tracking. Every solved problem is recorded, every metric visualised.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Supported Platforms */}
        <BentoCard title="All Major Platforms Supported">
          <div className="absolute inset-0 flex flex-col items-center justify-center ">
            <div className="flex flex-wrap justify-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 duration-500">
              {PLATFORM_ORDER.map((key) => (
                <span
                  key={key}
                  className="rounded-full bg-white/15 border border-white/60 px-4 py-2 text-sm text-neutral-50 backdrop-blur-sm"
                >
                  {PLATFORMS[key].name}
                </span>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* Card 2: Instant Search */}
        <BentoCard title="Instant Profile Search">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[85%] rounded-2xl border border-white/50 bg-black/60 p-5 shadow-2xl backdrop-blur-md transform -rotate-12 group-hover:-rotate-6 transition-transform duration-500">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mt-5 flex flex-col gap-4">
                <div className="h-4 w-3/4 rounded-md bg-white/10" />
                <div className="h-4 w-1/2 rounded-md bg-white/10" />
                <div className="flex items-center gap-3 mt-2">
                  <div className="h-8 w-8 rounded-full bg-purple-500/50" />
                  <div className="h-4 w-full rounded-md bg-white/5" />
                </div>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Card 3: Deep Analytics */}
        <BentoCard title="Deep Performance Analytics">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
              <div className="relative flex h-36 w-36 items-center justify-center rounded-[2rem] border border-green-500/50 bg-green-500/10 shadow-[0_0_40px_rgba(34,197,94,0.1)] group-hover:scale-110 transition-transform duration-500">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-16 h-16 text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
            </div>
          </div>
        </BentoCard>
      </div>
    </section>
  );
}
