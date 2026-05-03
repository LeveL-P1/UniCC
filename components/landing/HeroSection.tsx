"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PLATFORM_ORDER, PLATFORMS } from "@/lib/constants";

export function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const showcasePlatforms = useMemo(() => PLATFORM_ORDER.slice(0, 4).map((key) => PLATFORMS[key].name), []);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="py-16 md:py-24">
      <h1 className="text-balance text-4xl font-bold md:text-6xl">All your competitive programming stats in one place</h1>
      <p className="mt-5 max-w-2xl text-muted-foreground">
        Search profiles from {showcasePlatforms.join(", ")} and more.
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
    </section>
  );
}
