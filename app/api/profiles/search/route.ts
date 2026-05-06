import { NextRequest, NextResponse } from "next/server";
import { searchExternalProfiles } from "@/lib/externalProfiles/service";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q") ?? "";
    const results = await searchExternalProfiles(query, 20);
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Profile search failed:", error);
    return NextResponse.json({ results: [], error: "Search failed" }, { status: 500 });
  }
}
