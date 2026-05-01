import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

interface BentoGridItemProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>{children}</div>;
}

export function BentoGridItem({ children, className }: BentoGridItemProps) {
  return <article className={cn("rounded-2xl border border-border bg-card p-4", className)}>{children}</article>;
}
