import { NextRequest, NextResponse } from "next/server";
import { mockSearchResults } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.toLowerCase().trim() ?? "";
  const results = !query
    ? mockSearchResults
    : mockSearchResults.filter(
        (item) => item.username.toLowerCase().includes(query) || item.fullName.toLowerCase().includes(query)
      );

  return NextResponse.json({ results });
}
