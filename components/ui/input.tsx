import * as React from "react";
import { cn } from "@/lib/utils";

/** 6px radius per the input spec — inputs are the one thing that is not a pill. */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-input bg-tar px-3 py-2 text-body-sm text-bone",
        "border border-[rgba(212,208,201,0.16)] transition-colors",
        "placeholder:text-smoke",
        "focus-visible:border-bone focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "[color-scheme:dark]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
