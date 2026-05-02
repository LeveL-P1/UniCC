"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PLATFORM_ORDER, PLATFORMS } from "@/lib/constants";
import { Globe3D } from "@/components/ui/3d-globe";
import type { GlobeMarker } from "@/components/ui/3d-globe";

const globeMarkers: GlobeMarker[] = [
  { lat: 40.7128, lng: -74.006, src: "https://assets.aceternity.com/avatars/1.webp", label: "New York" },
  { lat: 51.5074, lng: -0.1278, src: "https://assets.aceternity.com/avatars/2.webp", label: "London" },
  { lat: 35.6762, lng: 139.6503, src: "https://assets.aceternity.com/avatars/3.webp", label: "Tokyo" },
  { lat: -33.8688, lng: 151.2093, src: "https://assets.aceternity.com/avatars/4.webp", label: "Sydney" },
  { lat: 48.8566, lng: 2.3522, src: "https://assets.aceternity.com/avatars/5.webp", label: "Paris" },
  { lat: 28.6139, lng: 77.209, src: "https://assets.aceternity.com/avatars/6.webp", label: "New Delhi" },
  { lat: 55.7558, lng: 37.6173, src: "https://assets.aceternity.com/avatars/7.webp", label: "Moscow" },
  { lat: -22.9068, lng: -43.1729, src: "https://assets.aceternity.com/avatars/8.webp", label: "Rio de Janeiro" },
  { lat: 31.2304, lng: 121.4737, src: "https://assets.aceternity.com/avatars/9.webp", label: "Shanghai" },
  { lat: 25.2048, lng: 55.2708, src: "https://assets.aceternity.com/avatars/10.webp", label: "Dubai" },
  { lat: -34.6037, lng: -58.3816, src: "https://assets.aceternity.com/avatars/11.webp", label: "Buenos Aires" },
  { lat: 1.3521, lng: 103.8198, src: "https://assets.aceternity.com/avatars/12.webp", label: "Singapore" },
  { lat: 37.5665, lng: 126.978, src: "https://assets.aceternity.com/avatars/13.webp", label: "Seoul" },
];

export function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const showcasePlatforms = useMemo(() => PLATFORM_ORDER.slice(0, 4).map((key) => PLATFORMS[key].name), []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="relative overflow-hidden rounded-xl py-16 md:py-24">
      {/* Text content – sits above the globe on mobile, side-by-side on md+ */}
      <div className="relative z-10">
        <h1 className="text-balance text-4xl font-bold md:text-6xl">All your competitive programming stats in one place</h1>
        <p className="mt-5 max-w-2xl text-muted-foreground">
          Search profiles from {showcasePlatforms.join(", ")} and more. View limited public stats instantly and unlock full
          analytics after sign-in.
        </p>
        <form onSubmit={onSubmit} className="mt-8 flex max-w-xl items-center gap-3">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search username or handle..."
            aria-label="Search username or handle"
          />
          <Button type="submit" className="gap-2">
            <Search size={16} />
            Search
          </Button>
        </form>
        <div className="mt-5">
          <Button asChild variant="ghost">
            <Link href="/sign-up">Create your profile</Link>
          </Button>
        </div>
      </div>

      {/* 3D Globe – decorative, positioned to the right on larger screens */}
      <div className="absolute -right-72 -bottom-96 z-0 size-160 md:-right-48 md:-bottom-80 md:size-180">
        <Globe3D
          className="h-full w-full"
          markers={globeMarkers}
          config={{
            atmosphereColor: "#f97316",
            atmosphereIntensity: 20,
            bumpScale: 5,
            autoRotateSpeed: 0.3,
            showAtmosphere: true,
          }}
        />
      </div>
    </section>
  );
}
