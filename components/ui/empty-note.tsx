import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * The system's one empty state. Dashed hairline, centred, no illustration —
 * an empty panel should read as "nothing here yet", not as a feature.
 */
export function EmptyNote({
  title,
  body,
  icon: Icon,
  height,
  action,
  className,
}: {
  title: string;
  body?: string;
  icon?: LucideIcon;
  height?: number;
  action?: { label: string; onClick?: () => void; href?: string };
  className?: string;
}) {
  return (
    <div
      style={height ? { minHeight: height } : undefined}
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-card px-6 py-10 text-center",
        "border border-dashed border-[rgba(212,208,201,0.14)]",
        className
      )}
    >
      {Icon ? (
        <span className="flex size-9 items-center justify-center rounded-icon bg-tar text-smoke">
          <Icon size={16} />
        </span>
      ) : null}
      <p className="text-body-sm text-bone">{title}</p>
      {body ? <p className="max-w-[42ch] text-[13px] text-smoke">{body}</p> : null}
      {action ? (
        <Button
          size="sm"
          variant="ghost"
          className="mt-2"
          onClick={action.onClick}
          asChild={Boolean(action.href)}
        >
          {action.href ? <a href={action.href}>{action.label}</a> : action.label}
        </Button>
      ) : null}
    </div>
  );
}
