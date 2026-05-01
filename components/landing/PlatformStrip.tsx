import { PLATFORM_ORDER, PLATFORMS } from "@/lib/constants";

export function PlatformStrip() {
  return (
    <section className="py-6">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Supported Platforms</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PLATFORM_ORDER.map((key) => (
            <span key={key} className="rounded-full border border-border px-3 py-1 text-sm">
              {PLATFORMS[key].name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
