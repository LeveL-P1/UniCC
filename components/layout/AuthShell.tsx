import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/section-header";
import { PlatformChip } from "@/components/ui/platform-mark";
import { PLATFORM_ORDER } from "@/lib/constants";

/**
 * Split auth layout: the argument on the left, Clerk's form on the right in a
 * Carbon panel. Keeps the sign-in page inside the system instead of dropping
 * Clerk's default card onto a bare page.
 */
export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="frame grid min-h-[calc(100svh-16rem)] items-center gap-14 py-16 lg:grid-cols-2 lg:gap-20">
      <div className="hidden lg:block">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-[12ch] text-[48px] font-light leading-[1.02] tracking-[-1px] text-chalk">
          {title}
        </h1>
        <p className="mt-6 max-w-[40ch] text-body text-ash">{description}</p>

        <div className="mt-12">
          <Eyebrow>Supported</Eyebrow>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
            {PLATFORM_ORDER.slice(0, 4).map((key) => (
              <li key={key}>
                <PlatformChip platform={key} className="opacity-70" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[26rem] rounded-card bg-carbon p-6 hairline sm:p-8">
        <div className="lg:hidden">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mb-8 mt-3 text-heading font-light text-chalk">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
