import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Agentation } from "agentation";
import "./globals.css";

/**
 * Panchang — headlines and titles. Self-hosted variable woff2 (200-800), so
 * the whole weight axis costs one 37KB request. Licence: FFL, bundled
 * alongside the font in app/fonts.
 */
const panchang = localFont({
  src: [{ path: "./fonts/Panchang-Variable.woff2", weight: "200 800", style: "normal" }],
  variable: "--font-panchang",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/**
 * Plus Jakarta Sans — body and UI. Variable roman + italic (200-800).
 * Licence: OFL, bundled in app/fonts.
 */
const jakarta = localFont({
  src: [
    { path: "./fonts/PlusJakartaSans-Variable.woff2", weight: "200 800", style: "normal" },
    {
      path: "./fonts/PlusJakartaSans-VariableItalic.woff2",
      weight: "200 800",
      style: "italic",
    },
  ],
  variable: "--font-jakarta",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
});

/** Mono stays JetBrains — eyebrows, tabular figures and system labels. */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UNICC — Unified competitive programming stats",
    template: "%s — UNICC",
  },
  description:
    "One page for every rating, every solve, every contest. UNICC unifies your LeetCode, Codeforces, CodeChef and AtCoder record into a single profile you can share.",
  keywords: [
    "competitive programming",
    "leetcode tracker",
    "codeforces rating",
    "coding dashboard",
    "cp profile",
  ],
  authors: [{ name: "Level-P1" }],
  openGraph: {
    title: "UNICC — Unified competitive programming stats",
    description:
      "One page for every rating, every solve, every contest across LeetCode, Codeforces, CodeChef and AtCoder.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorBackground: "#0c0c0c",
          colorPrimary: "#d4d0c9",
          colorText: "#d4d0c9",
          colorTextSecondary: "#878581",
          colorInputBackground: "#141414",
          colorInputText: "#d4d0c9",
          colorDanger: "#e05252",
          borderRadius: "6px",
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
        },
        elements: {
          formButtonPrimary:
            "bg-bone text-obsidian rounded-pill font-medium hover:bg-chalk normal-case",
          card: "bg-transparent shadow-none",
          headerTitle: "font-light tracking-tight",
          socialButtonsBlockButton:
            "border-[rgba(212,208,201,0.16)] hover:bg-carbon",
          footerActionLink: "text-bone hover:text-chalk",
        },
      }}
    >
      {/* dark is permanent: Henry has no light mode. The class keeps
          Magic UI's dark: variants resolving. */}
      <html
        lang="en"
        className={`dark ${panchang.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}
      >
        <body className="antialiased">
          {children}
          <SpeedInsights />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#141414",
                color: "#d4d0c9",
                border: "1px solid rgba(212,208,201,0.12)",
                borderRadius: "10px",
                fontSize: "14px",
                letterSpacing: "-0.28px",
                boxShadow: "0 1px 2px 0 rgba(0,0,0,0.6)",
              },
              success: { iconTheme: { primary: "#1fe274", secondary: "#000000" } },
              error: { iconTheme: { primary: "#e05252", secondary: "#000000" } },
            }}
          />
          {/* Visual annotation overlay for AI agents. Dev-only — the whole
              subtree is dropped from production bundles by the NODE_ENV check. */}
          {process.env.NODE_ENV === "development" ? <Agentation /> : null}
        </body>
      </html>
    </ClerkProvider>
  );
}
