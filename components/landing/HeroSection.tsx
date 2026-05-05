"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { CyberButton } from "@/components/ui/cyber-button";
import { Input } from "@/components/ui/input";
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
    <div className="w-full relative flex items-center justify-center pt-8 pb-32">
      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center">
        <h1 className="mt-8 mb-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight md:text-7xl max-w-4xl">
          All your competitive programming stats — unified
        </h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center text-xl text-neutral-400 mb-10 max-w-2xl"
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
          <div className="relative flex items-center justify-center gap-[5px] p-[10px_15px] rounded-[22px] max-w-[400px] w-full bg-white/10 backdrop-blur-md transition-transform duration-400 perspective-[500px]">
            {/* Shadow Input */}
            <div 
              className="absolute w-full h-full left-0 bottom-0 -z-10 blur-[30px] rounded-[20px] bg-[#8185e4]"
              style={{
                backgroundImage: `
                  radial-gradient(at 85% 51%, hsla(60,60%,30%,1) 0px, transparent 50%),
                  radial-gradient(at 74% 68%, hsla(235,69%,307%,1) 0px, transparent 50%),
                  radial-gradient(at 64% 79%, hsla(284,72%,303%,1) 0px, transparent 50%),
                  radial-gradient(at 75% 16%, hsla(283,60%,30%,1) 0px, transparent 50%),
                  radial-gradient(at 90% 65%, hsla(153,70%,30%,1) 0px, transparent 50%),
                  radial-gradient(at 91% 83%, hsla(283,74%,30%,1) 0px, transparent 50%),
                  radial-gradient(at 72% 91%, hsla(213,75%,30%,1) 0px, transparent 50%)
                `
              }}
            />
            
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search username or handle..." 
              className="w-full rounded-[20px] outline-none border-none p-[8px] relative bg-transparent text-white placeholder:text-white/100 "
            />
            <button type="submit" className="cursor-pointer border-none bg-transparent flex justify-center items-center rounded-[12px] p-[5px] transition-all duration-400 hover:bg-white/40 text-white ">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </motion.form>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex justify-center relative z-20"
        >
          <CyberButton onClick={() => router.push('/sign-up')} />
        </motion.div>
      </div>
    </div>
  );
}
