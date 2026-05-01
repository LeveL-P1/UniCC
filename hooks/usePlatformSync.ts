"use client";

import { useState } from "react";

export function usePlatformSync() {
  const [syncingPlatform, setSyncingPlatform] = useState<string | null>(null);

  const syncPlatform = async (platform?: string) => {
    setSyncingPlatform(platform ?? "all");
    try {
      const response = await fetch("/api/platforms/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(platform ? { platform } : {}),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Sync failed");
      }
    } finally {
      setSyncingPlatform(null);
    }
  };

  return { syncingPlatform, syncPlatform };
}
