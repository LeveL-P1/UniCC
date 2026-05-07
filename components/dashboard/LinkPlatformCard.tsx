import { Plus, ArrowRight } from "lucide-react";
import { SectionCard } from "@/components/ui/SectionCard";
import Link from "next/link";

export function LinkPlatformCard() {
  return (
    <Link href="/settings" className="block h-full group">
      <SectionCard className="h-full flex flex-col items-center justify-center text-center border-dashed border-white/10 hover:border-indigo-500/50 bg-white/[0.02] hover:bg-indigo-600/[0.03]">
        <div className="w-12 h-12 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
          <Plus size={24} />
        </div>
        <h3 className="mt-4 font-bold text-white group-hover:text-indigo-400 transition-colors">Link Platform</h3>
        <p className="mt-2 text-sm text-neutral-500 max-w-[150px] mx-auto">
          Add more coding profiles to your dashboard
        </p>
        <div className="mt-4 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-600 group-hover:text-indigo-400 transition-colors">
          Go to settings <ArrowRight size={12} />
        </div>
      </SectionCard>
    </Link>
  );
}
