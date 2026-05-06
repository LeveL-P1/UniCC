import { SearchClient } from "@/app/(public)/search/SearchClient";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const raw = sp.q;
  const query = Array.isArray(raw) ? raw[0] ?? "" : raw ?? "";

  return <SearchClient query={query} />;
}
