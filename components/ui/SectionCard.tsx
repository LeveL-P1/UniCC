import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/ui/section-header";

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
  action?: React.ReactNode;
}

/** Carbon panel with a mono eyebrow header. The workhorse app surface. */
export function SectionCard({
  title,
  children,
  className,
  description,
  action,
}: SectionCardProps) {
  return (
    <section className={cn("rounded-card bg-carbon p-6 hairline", className)}>
      {title ? (
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <Eyebrow>{title}</Eyebrow>
            {description ? (
              <p className="mt-2 max-w-[54ch] text-[13px] text-ash">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
