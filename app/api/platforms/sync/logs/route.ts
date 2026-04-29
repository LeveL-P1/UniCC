export const runtime = 'nodejs'

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ logs: [] })

    const { searchParams } = new URL(request.url)
    const limit = Number(searchParams.get('limit') ?? 50)
    const logs = await prisma.syncJobLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: Number.isFinite(limit) ? Math.min(limit, 200) : 50
    })

    return NextResponse.json({ logs })
  } catch (error) {
    console.error('Error fetching sync logs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
