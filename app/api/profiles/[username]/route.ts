import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { mockProfiles } from "@/lib/mock-data";

type RouteContext = {
  params: Promise<{ username: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { userId } = await auth();
  const { username } = await context.params;
  const profile = mockProfiles.find((item) => item.username.toLowerCase() === username.toLowerCase());

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  return NextResponse.json({
    profile,
    isAuthenticated: Boolean(userId),
  });
}
