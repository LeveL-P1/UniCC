import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getExternalProfilePublicView } from "@/lib/externalProfiles/service";
import { clampRefreshMinutes, parseExternalHandle } from "@/lib/validation/externalProfiles";

type RouteContext = {
  params: Promise<{ username: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { userId } = await auth();
  const { username } = await context.params;
  const handle = parseExternalHandle(decodeURIComponent(username));

  if (!handle) {
    return NextResponse.json({ error: "Invalid profile handle" }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const refresh = searchParams.get("refresh") === "1" && Boolean(userId);
    const staleMinutes = Number(searchParams.get("staleMinutes") ?? "");

    const result = await getExternalProfilePublicView(handle, {
      refresh,
      staleMinutes: Number.isFinite(staleMinutes) ? clampRefreshMinutes(staleMinutes, 360) : undefined,
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
