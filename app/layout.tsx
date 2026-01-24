import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UNICC - Developer Productivity Dashboard",
  description: "Track your coding practice across platforms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
        >
          {children}
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