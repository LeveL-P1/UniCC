import { SectionCard } from "@/components/ui/SectionCard";
import { User, Copy, ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

interface ProfileCardProps {
  username: string;
  fullName: string;
  bio: string;
}

export function ProfileCard({ username, fullName, bio }: ProfileCardProps) {
  const publicUrl = `unicc.com/u/${username}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    toast.success("URL copied to clipboard!");
  };

  return (
    <SectionCard className="md:col-span-2 relative overflow-hidden group">
      {/* Abstract Background Decoration */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-colors" />
      
      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
            <div className="w-full h-full rounded-[22px] bg-[#0b0b12] flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1 border-4 border-[#0b0b12]">
            <ShieldCheck size={14} className="text-white" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">{fullName}</h2>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
              Pro Member
            </span>
          </div>
          <p className="text-neutral-400 font-medium">@{username}</p>
          <p className="mt-3 text-neutral-300 text-sm max-w-md line-clamp-2">
            {bio}
          </p>
        </div>

        <div className="flex flex-col gap-2 min-w-[140px]">
          <button 
            onClick={copyUrl}
            className="flex items-center justify-between px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all text-sm group/btn"
          >
            <span className="text-neutral-400 group-hover/btn:text-white transition-colors">Copy URL</span>
            <Copy size={14} className="text-neutral-500" />
          </button>
          <a 
            href={`/u/${username}`}
            target="_blank"
            className="flex items-center justify-between px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 rounded-xl border border-indigo-500/20 transition-all text-sm group/link"
          >
            <span className="text-indigo-400 font-medium">View Page</span>
            <ExternalLink size={14} className="text-indigo-400" />
          </a>
        </div>
      </div>
    </SectionCard>
  );
}
