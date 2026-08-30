import { Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The system's one inversion: a white surface inside an all-dark world. It
 * signals "this is a screenshot of the product", not more page chrome. Colours
 * here are local to the artifact and deliberately do not use the dark tokens.
 */
const ROWS = [
  { short: "LC", name: "LeetCode", handle: "@lee", value: "2,041", state: "synced" },
  { short: "CF", name: "Codeforces", handle: "@lee_cf", value: "1,874", state: "synced" },
  { short: "CC", name: "CodeChef", handle: "@lee_cc", value: "1,932", state: "syncing" },
] as const;

export function ProductMockup({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "w-full max-w-[420px] rounded-[10px] bg-white p-4 shadow-[0_1px_2px_0_rgba(20,21,26,0.05)] sm:p-5",
        "ring-1 ring-[rgba(212,208,201,0.5)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-full bg-[#f1efec] text-[13px] font-medium text-[#141414]">
          LE
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium leading-tight text-[#000000]">
            Lee Everett
          </p>
          <p className="text-[12px] leading-tight text-[#615f5c]">unicc.dev/u/lee</p>
        </div>
        <span className="rounded-[100px] bg-[#000000] px-3 py-1.5 text-[11px] font-medium text-white">
          Share
        </span>
      </div>

      {/* Unified figure */}
      <div className="mt-5 flex items-end gap-4 border-t border-[#eceae6] pt-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#878581]">
            Unified solved
          </p>
          <p className="mt-1.5 text-[28px] font-light leading-none tracking-[-0.6px] text-[#000000] tabular-nums">
            5,847
          </p>
        </div>
        <div className="ml-auto text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#878581]">
            Best rating
          </p>
          <p className="mt-1.5 text-[28px] font-light leading-none tracking-[-0.6px] text-[#000000] tabular-nums">
            2,041
          </p>
        </div>
      </div>

      {/* Platform rows */}
      <div className="mt-4 flex flex-col gap-1.5">
        {ROWS.map((row) => (
          <div
            key={row.name}
            className="flex items-center gap-3 rounded-[6px] border border-[#eceae6] px-3 py-2.5"
          >
            <span className="flex size-6 items-center justify-center rounded-[6px] bg-[#f6f5f3] font-mono text-[9px] text-[#615f5c]">
              {row.short}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] leading-tight text-[#141414]">
                {row.name}
              </p>
              <p className="truncate text-[11px] leading-tight text-[#878581]">
                {row.handle}
              </p>
            </div>
            <span className="font-mono text-[11px] text-[#141414] tabular-nums">
              {row.value}
            </span>
            {row.state === "synced" ? (
              <span className="flex items-center gap-1 rounded-[100px] bg-[#eefaf2] px-2 py-0.5 text-[10px] font-medium text-[#0f8f4a]">
                <Check size={9} strokeWidth={3} />
                Synced
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-[100px] bg-[#f6f5f3] px-2 py-0.5 text-[10px] font-medium text-[#615f5c]">
                <RefreshCw size={9} className="animate-spin [animation-duration:2.4s]" />
                Syncing
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
