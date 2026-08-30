import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Eyebrow: 10px mono, uppercase, Ash. Renders as plain text — no chip, no
 * border, no background. It reads as a print section marker.
 */
export function Eyebrow({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("eyebrow", className)} {...props} />;
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  action?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  action,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex gap-6",
        centered
          ? "flex-col items-center text-center"
          : "flex-col md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className={cn("flex flex-col gap-4", centered && "items-center")}>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        <h2
          className={cn(
            "text-[24px] font-light leading-[1.18] tracking-[-0.48px] text-chalk",
            "md:text-[32px] md:tracking-[-0.64px]",
            centered && "max-w-[18ch] text-balance"
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "text-body text-ash",
              centered ? "max-w-[56ch]" : "max-w-[48ch]"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
