import { GridPattern } from "@/components/ui/grid-pattern";

/**
 * The canvas. Henry is flat over near-black — no nebula, no gradient mesh.
 * All this contributes is a graticule that fades out before it competes with
 * anything, plus one soft pool of light behind the hero.
 */
export function PublicBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div className="absolute inset-0 bg-obsidian" />

      <GridPattern
        width={72}
        height={72}
        className="[mask-image:radial-gradient(720px_circle_at_50%_18%,#000,transparent)] fill-transparent stroke-bone/[0.06]"
      />

      {/* One light source, top-centre. The room has a window. */}
      <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(1100px_420px_at_50%_-8%,rgba(212,208,201,0.07),transparent_70%)]" />
    </div>
  );
}
