import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getExternalProfilePublicView } from "@/lib/externalProfiles/service";

type RouteContext = {
  params: Promise<{ username: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { userId } = await auth();
  const { username } = await context.params;

  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get("refresh") === "1";
    const staleMinutes = Number(searchParams.get("staleMinutes") ?? "");

    const result = await getExternalProfilePublicView(decodeURIComponent(username), {
      refresh,
      staleMinutes: Number.isFinite(staleMinutes) ? staleMinutes : undefined,
    });

    return NextResponse.json({
      profile: result.profile,
      isAuthenticated: Boolean(userId),
    });
  } catch (error) {
    console.error("Public profile fetch failed:", error);
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }
}
