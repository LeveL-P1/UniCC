"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { GooeyInput } from "@/components/ui/gooey-input";
import { PLATFORM_ORDER, PLATFORMS } from "@/lib/constants";

export function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const showcasePlatforms = useMemo(() => PLATFORM_ORDER.slice(0, 4).map((key) => PLATFORMS[key].name), []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="w-full relative flex items-center justify-center pt-8 pb-16">
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center">
        <LampContainer className="min-h-min mb-8">
          <h1 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl max-w-4xl">
            All your competitive programming stats in one place
          </h1>
        </LampContainer>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-lg text-neutral-400 mb-10 max-w-2xl"
        >
          Search profiles from {showcasePlatforms.join(", ")} and more.
        </motion.p>
        
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          onSubmit={onSubmit} 
          className="w-full flex justify-center mb-12 relative z-20"
        >
          <GooeyInput 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search username or handle..." 
            className="w-full max-w-md mx-auto"
          />
        </motion.form>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex justify-center relative z-20"
        >
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-6 py-2"
            onClick={() => router.push('/sign-up')}
          >
            <span>Create your profile</span>
          </HoverBorderGradient>
        </motion.div>
      </div>
    </div>
  );
}
