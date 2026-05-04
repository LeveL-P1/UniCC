import type { ReactNode } from "react";
import { PublicHeader } from "@/components/layout/PublicHeader";
import Grainient from "@/components/Grainient";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black relative pt-24 text-white">
      {/* Cosmic Nebula Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Grainient
          color1="#2d232d"
          color2="#362965"
          color3="#a76fdd"
          timeSpeed={2.5}
          colorBalance={0}
          warpStrength={1}
          warpFrequency={4.7}
          warpSpeed={2.5}
          warpAmplitude={50}
          blendAngle={0}
          blendSoftness={0.21}
          rotationAmount={60}
          noiseScale={2}
          grainAmount={0.1}
          grainScale={1.5}
          grainAnimated={false}
          contrast={1.3}
          gamma={1}
          saturation={0.8}
          centerX={0}
          centerY={0}
          zoom={0.5}
          className="w-full h-full"
        />
      </div>
      
      <div className="relative z-10">
        <PublicHeader />
        {children}
        <footer className="border-t border-white/10 py-8 mt-12 text-center text-sm text-neutral-400">
          Built for competitive programmers.
        </footer>
      </div>
    </div>
  );
}
