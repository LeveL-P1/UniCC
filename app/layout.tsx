import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

/**
 * Henry's primary face is NB International Pro — a licensed NB Studio type.
 * Inter is the specified substitute: geometric humanist, wide x-height, and it
 * holds up at the 300 weight the display scale is built on.
 */
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

/** Stands in for NB International Pro Mono — system labels, never marketing copy. */
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
          fontFamily: "var(--font-inter), system-ui, sans-serif",
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
      <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
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
        </body>
      </html>
    </ClerkProvider>
  );
}
