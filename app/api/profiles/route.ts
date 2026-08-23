import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) return NextResponse.json({ profiles: [] });

  const profiles = await prisma.platformProfile.findMany({
    where: { userId: user.id },
    orderBy: { platform: "asc" },
  });

  return NextResponse.json({ profiles });
}
