import { cn } from "@/lib/utils";

/**
 * Wordmark. Lowercase, regular weight, tight tracking — it sits in the nav as
 * quietly as the links beside it. The dot is the only mark.
 */
export function Logo({
  className,
  showDot = true,
}: {
  className?: string;
  showDot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1 text-[15px] font-normal tracking-[-0.02em] text-chalk",
        className
      )}
    >
      unicc
      {showDot ? (
        <span
          aria-hidden
          className="mb-[3px] size-[3px] rounded-full bg-signal-green"
        />
      ) : null}
    </span>
  );
}
