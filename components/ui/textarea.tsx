import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-20 w-full resize-none rounded-input bg-tar px-3 py-2.5 text-body-sm text-bone",
      "border border-[rgba(212,208,201,0.16)] transition-colors",
      "placeholder:text-smoke",
      "focus-visible:border-bone focus-visible:outline-none",
      "disabled:cursor-not-allowed disabled:opacity-40",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
