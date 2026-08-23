import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth/getOrCreateUser";
import { normalizeUserSettings, settingsFromPrisma, settingsToPrisma } from "@/lib/validation/settings";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ settings: settingsFromPrisma(null) });

  const persisted = await prisma.userSettings.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ settings: settingsFromPrisma(persisted) });
}

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const settings = normalizeUserSettings(body);
  const user = await getOrCreateUser(userId);

  const persisted = await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: settingsToPrisma(settings),
    create: {
      userId: user.id,
      ...settingsToPrisma(settings),
    },
  });

  return NextResponse.json({ settings: settingsFromPrisma(persisted) });
}
