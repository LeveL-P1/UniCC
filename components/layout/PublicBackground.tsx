"use client";

import dynamic from "next/dynamic";

const Grainient = dynamic(() => import("@/components/Grainient"), { ssr: false });

export function PublicBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0b12] via-[#140b2d] to-black" />
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
  );
}

