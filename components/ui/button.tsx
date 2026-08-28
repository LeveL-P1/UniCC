import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Henry buttons are pills. 100px radius is not a suggestion — every
 * interactive chip in the system shares it.
 *
 *   solid  — the only fully opaque light element on dark. Use once per view.
 *   ghost  — 1px Smoke border, Bone text. Whispers next to solid.
 *   quiet  — no chrome until hover. For dense/table rows.
 *   chalk  — reserved: the hero CTA and nothing else.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
    "focus-visible:outline-1 focus-visible:outline-bone focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
  ],
  {
    variants: {
      variant: {
        solid: "bg-bone text-obsidian hover:bg-chalk active:bg-pearl",
        chalk: "bg-chalk text-obsidian hover:bg-bone active:bg-pearl",
        ghost:
          "border border-smoke bg-transparent text-bone hover:border-bone hover:text-chalk",
        quiet:
          "bg-transparent text-ash hover:bg-carbon hover:text-bone border border-transparent",
        surface:
          "bg-carbon text-bone hairline hover:bg-tar hover:border-[rgba(212,208,201,0.24)]",
        danger:
          "border border-destructive/40 bg-transparent text-destructive hover:bg-destructive/10 hover:border-destructive",
        link: "bg-transparent text-bone underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        xs: "h-7 px-3 text-caption rounded-pill",
        sm: "h-8 px-3.5 text-[12px] rounded-pill",
        default: "h-9 px-4 text-[13px] rounded-pill",
        lg: "h-11 px-6 text-body-sm rounded-pill",
        icon: "size-9 rounded-pill",
        "icon-sm": "size-7 rounded-pill",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
