"use client";

import { useRouter } from "next/navigation";
import { SectionCard } from "@/components/ui/SectionCard";

export function LandingCTA() {
  const router = useRouter();

  return (
    <SectionCard className="my-12 text-center py-16 bg-black/20 backdrop-blur-sm border border-white/5 shadow-2xl">
      <h2 className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
        Ready to share your CP journey?
      </h2>
      <p className="mt-2 text-lg text-neutral-400 mb-10 max-w-xl mx-auto">
        Connect your profiles and generate a single public page.
      </p>
      <div className="flex justify-center">
        <button 
          onClick={() => router.push('/sign-up')}
          className="px-10 py-4 bg-white/5 backdrop-blur-sm border-b-2 border-white/20 text-white rounded-xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 uppercase tracking-[0.15em] text-sm font-bold shadow-lg"
        >
          Create Your Profile
        </button>
      </div>
    </SectionCard>
  );
}
