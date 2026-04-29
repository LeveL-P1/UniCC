export const runtime = 'nodejs'

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getOverviewMetrics } from '@/lib/analytics/service'
import { getOrSetCache } from '@/lib/cache/memoryCache'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({
        metrics: {
          totalSolved: 0,
          syncedSolved: 0,
          manualSolved: 0,
          activeDays: 0,
          averageProblemsPerDay: 0,
          strongestPlatform: null,
          totalSessions: 0,
          totalTimeMinutes: 0,
          byDifficulty: { easy: 0, medium: 0, hard: 0 }
        }
      })
    }

    const metrics = await getOrSetCache(`analytics:${user.id}:overview`, 60_000, () =>
      getOverviewMetrics(user.id)
    )
    return NextResponse.json({ metrics })
  } catch (error) {
    console.error('Error fetching analytics overview:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
