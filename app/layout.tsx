import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "UNICC Dashboard - Track Your Coding Practice",
  description: "A modern developer productivity dashboard to track coding practice across platforms like LeetCode, Codeforces, and more. Visualize your progress, maintain streaks, and analyze your performance.",
  keywords: ["coding practice", "leetcode tracker", "developer productivity", "coding dashboard"],
  authors: [{ name: "Level-P1" }],
  openGraph: {
    title: "UNICC - Developer Productivity Dashboard",
    description: "Track your coding practice and visualize your progress",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased">
          {children}
          <SpeedInsights />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #2a2a2a',
              },
              success: {
                iconTheme: {
                  primary: '#ff6b35',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}