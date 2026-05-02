"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export function SocialGraphBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: false,
      fpsLimit: 60,
      interactivity: {
        events: {
          onHover: { enable: true, mode: "grab" },
        },
        modes: {
          grab: { distance: 160, links: { opacity: 0.4 } },
        },
      },
      particles: {
        color: { value: "#58a6ff" },
        links: {
          color: "#58a6ff",
          distance: 150,
          enable: true,
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: "none" as const,
          outModes: { default: "bounce" as const },
        },
        number: {
          value: 90,
          density: { enable: true },
        },
        opacity: { value: 0.45 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      },
    }),
    []
  );

  if (!init) return null;

  return (
    <div
      className="pointer-events-auto"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
      }}
    >
      <Particles
        id="tsparticles-social-graph"
        options={options}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
