import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { defaultUserSettings } from "@/lib/mock-data";
import type { UserSettings } from "@/types/profile";

let settingsStore: UserSettings = defaultUserSettings;

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ settings: settingsStore });
}

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as UserSettings;
  settingsStore = body;
  return NextResponse.json({ settings: settingsStore });
}
