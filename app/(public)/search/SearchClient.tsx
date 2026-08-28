"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, UserSearch } from "lucide-react";

import { ProfileResultCard } from "@/components/search/ProfileResultCard";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section-header";
import { EmptyNote } from "@/components/ui/empty-note";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { useSearchProfiles } from "@/hooks/useSearchProfiles";

export function SearchClient({ query }: { query: string }) {
  const router = useRouter();
  const [input, setInput] = useState(query);
  const { results, loading, error } = useSearchProfiles(query);

  return (
    <div className="frame flex flex-col gap-10 py-14 lg:py-20">
      <header>
        <Eyebrow>Search</Eyebrow>
        <h1 className="mt-3 text-[36px] font-light leading-[1.05] tracking-[-0.8px] text-chalk md:text-[48px] md:tracking-[-1px]">
          Find a programmer
        </h1>
        <p className="mt-4 max-w-[52ch] text-body-sm text-ash">
          Search any handle — UNICC resolves profiles that have never signed up
          by fetching them live from the source platforms.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const trimmed = input.trim();
            router.push(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search");
          }}
          className="mt-8 flex w-full max-w-[30rem] items-center gap-2 rounded-pill bg-carbon py-1.5 pl-5 pr-1.5 hairline transition-colors focus-within:border-[rgba(212,208,201,0.32)]"
        >
          <Search size={15} className="shrink-0 text-smoke" aria-hidden />
          <label htmlFor="search-input" className="sr-only">
            Search handles
          </label>
          <input
            id="search-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="tourist, jiangly, Benq…"
            className="min-w-0 flex-1 bg-transparent py-2 text-body-sm text-bone outline-none placeholder:text-smoke"
          />
          <Button type="submit" size="sm" className="shrink-0">
            Search
          </Button>
        </form>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4 pb-1 hairline-b">
          <p className="font-mono text-caption uppercase tracking-[0.12em] text-smoke">
            {query ? `Results for "${query}"` : "All profiles"}
          </p>
          {!loading && !error ? (
            <span className="font-mono text-caption text-smoke tabular-nums">
              {results.length}
            </span>
          ) : null}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="h-[76px] animate-pulse rounded-card bg-carbon" />
            ))}
          </div>
        ) : error ? (
          <EmptyNote title="Search failed" body={error} />
        ) : results.length === 0 ? (
          <EmptyNote
            icon={UserSearch}
            title={query ? `Nothing found for "${query}"` : "No profiles indexed yet"}
            body="Try an exact handle from LeetCode, Codeforces, CodeChef or AtCoder."
          />
        ) : (
          <RevealGroup className="flex flex-col gap-3" stagger={0.05}>
            {results.map((profile) => (
              <RevealItem key={profile.id} y={10}>
                <ProfileResultCard profile={profile} />
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </section>
    </div>
  );
}
