# UNICC — Unified Competitive Programming Stats and Dashboard (v3.0)

> [!CAUTION]
> This project is built for **EXPERIMENTATION** and **EXPLORING THE IDEA**. It does **NOT** guarantee accurate metrics — figures are only as good as what each platform publishes.

One page for every rating, every solve, every contest. UNICC pulls your LeetCode, Codeforces, CodeChef and AtCoder record into a single profile you can share, and shows the trend underneath it.

---

## Version 3.0 — The Henry redesign

v3 replaces the "Cosmic Nebula" purple-glassmorphism look with **Henry**: a near-monochrome, editorial dark system — a darkroom gallery at midnight.

*   **Design tokens are real again.** v2 defined its theme in `tailwind.config.ts` using v3-era `hsl(var(--x))` syntax while importing Tailwind v4. v4 never loaded that config, so `bg-card`, `text-muted-foreground`, `bg-primary` and `border-border` generated **zero CSS** — several pages rendered unstyled. All tokens now live in `@theme` inside `app/globals.css`, and `tailwind.config.ts` is gone.
*   **Typography works.** `--font-outfit` / `--font-inter` were referenced but never defined, and `body` was pinned to `Cambria …, serif !important`. Inter (300/400/500/600) and JetBrains Mono are now loaded via `next/font` as the NB International Pro substitutes the design calls for.
*   **Restrained palette.** Obsidian → Tar → Carbon surfaces, Bone/Ash/Smoke text, hairline borders at Bone 12%. Chromatic colour is **rationed** to stat bars and data viz only.
*   **Whisper-light type.** Headlines at weight 300, tracking tightening from −0.28px at 14px to −1.92px at 96px. Nothing above 500.
*   **Pills everywhere.** Every button and interactive chip is 100px radius; cards are 10px, icons and inputs 6px.
*   **One inversion.** The white product-mockup card on the landing page is the only light surface in the system — it reads as a screenshot, not chrome.

### Analytics, finally on screen

`lib/analytics/service.ts` already computed consistency scores, contest↔practice Pearson correlation, velocity per week, plateau detection and topic strengths — behind five API routes that **nothing in the UI called**. v3 wires them up:

*   Dashboard insights panel with range (30/90/180/365d) and benchmark filters
*   Unified rating timeline across every platform on one axis
*   Real activity heatmap and 30-day practice volume, replacing the *"coming soon"* placeholder
*   Difficulty mix and synced-vs-manual source breakdown

Fabricated UI was removed along the way: the hardcoded `"12 Days"` streak, the "Pro Member" badge, the `unicc.com` copy-URL (now built from the real origin), and a contact form that silently discarded input (now composes a `mailto:`).

### Motion

| Effect | Implementation |
| --- | --- |
| GSAP mouse parallax | `components/motion/MouseParallax.tsx` — `quickTo` on the GSAP ticker, no React re-render per pointermove |
| Cursor-reactive SVG | `components/motion/CursorReactiveSVG.tsx` — pointer mapped into SVG user space; nodes lean and brighten by proximity |
| Interactive hero illustration | `components/landing/HeroIllustration.tsx` — four platform ratings resolving into one core |
| SVG parallax | `components/motion/ParallaxSVG.tsx` — layered depth on scroll + self-drawing strokes |
| Scroll Expand | `components/motion/ScrollExpand.tsx` — pinned panel scrubbing inset → full-bleed |
| Floating UI | `components/motion/Floating.tsx` — offset drift cycles |
| Framer hover physics | `components/motion/HoverPhysics.tsx` — spring-driven `Tilt` and `Magnetic` |
| Interactive feature cards | `components/landing/FeatureCards.tsx` — MagicCard spotlight + Tilt + animated per-card visuals |

All motion is gated behind `prefers-reduced-motion`, and pointer effects are skipped entirely on coarse-pointer devices.

---

## Core Features

*   **Multi-platform sync** — LeetCode, Codeforces, CodeChef and AtCoder, on a schedule or on demand
*   **Public profiles** — a shareable page at `/u/username` that stays current on its own
*   **Search anyone** — resolves handles that have never signed up by fetching them live and caching the snapshot
*   **Session logging** — manual practice entries feed velocity, consistency and the topic breakdown
*   **Deep analytics** — velocity vs. benchmark, plateau detection, practice↔contest correlation
*   **Secure auth** — Clerk, with the sign-in flow styled into the system

---

## Tech Stack

*   **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) — tokens in `@theme`, no JS config
*   **Animation:** [GSAP 3](https://gsap.com/) + [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Framer Motion](https://motion.dev/)
*   **Components:** [shadcn/ui](https://ui.shadcn.com/), [Magic UI](https://magicui.design/), [Skiper UI](https://skiper-ui.com/)
*   **Charts:** [Recharts](https://recharts.org/)
*   **Database:** [PostgreSQL (Neon)](https://neon.tech/) · **ORM:** [Prisma](https://www.prisma.io/)
*   **Auth:** [Clerk](https://clerk.com/) · **Icons:** [Lucide](https://lucide.dev/)

---

## Design system

Tokens live in one place — `app/globals.css` under `@theme`.

| Layer | Token | Value |
| --- | --- | --- |
| Canvas | `--color-obsidian` | `#000000` |
| Recess | `--color-tar` | `#0c0c0c` |
| Card | `--color-carbon` | `#141414` |
| Primary text | `--color-bone` | `#d4d0c9` |
| Secondary text | `--color-ash` | `#878581` |
| Tertiary / borders | `--color-smoke` | `#615f5c` |
| Signals (rationed) | `--color-signal-{green,blue,orange,violet}` | `#1fe274` `#00a8f0` `#ff9634` `#a76fdd` |

Helper utilities: `hairline`, `hairline-t`, `hairline-b`, `eyebrow`, `frame`.

**Don't:** use weight 600+ for headings · add drop shadows beyond the 1px lift · use signal colours outside stats and charts · introduce a fourth surface level · break the 100px pill radius.

---

## Deployment & Status

*   **Status:** Experimental prototype with real auth, database and sync foundations. Still needs production hardening.
*   **Deployment:** Configure Clerk, Postgres, Prisma migrations and a protected cron scheduler before deploying.
*   **Cron security:** `/api/cron/sync` requires `CRON_SECRET` and an `Authorization: Bearer <secret>` header.

---

## Local Development

```bash
git clone https://github.com/Level-P1/unicc-dashboard.git
npm install
npx prisma migrate deploy
npm run dev
```

Create a `.env` from `.env.example` with your Clerk and database keys first.

---

Built by **Level-P1**
