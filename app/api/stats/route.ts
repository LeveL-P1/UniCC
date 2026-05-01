import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { mockProfiles } from "@/lib/mock-data";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profile = mockProfiles.find((item) => item.isOwner) ?? mockProfiles[0];
  return NextResponse.json({
    overview: profile.overview,
    platformStats: profile.platformStats,
    detailedStats: profile.detailedStats,
  });
}
