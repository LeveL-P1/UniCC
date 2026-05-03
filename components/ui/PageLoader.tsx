"use client";

import React from "react";
import Loader from "./Loader";

export function PageLoader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Loader />
    </div>
  );
}
