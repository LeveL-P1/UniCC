import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { mockProfiles } from "@/lib/mock-data";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ profiles: mockProfiles.slice(0, 2) });
  return NextResponse.json({ profiles: mockProfiles });
}
