import { cn } from "@/lib/utils";

interface SectionCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  description?: string;
}

export function SectionCard({ title, children, className, description }: SectionCardProps) {
  return (
    <section className={cn(
      "rounded-3xl border border-white/5 bg-white/[0.03] backdrop-blur-md p-6 shadow-2xl transition-all duration-300 hover:bg-white/[0.05] hover:border-white/10", 
      className
    )}>
      {title && (
        <div className="mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-neutral-500 mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
