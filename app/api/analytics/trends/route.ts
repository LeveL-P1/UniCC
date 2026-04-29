export const runtime = 'nodejs'

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPerformanceTrends } from '@/lib/analytics/service'
import { getOrSetCache } from '@/lib/cache/memoryCache'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({
        trends: {
          weekly: { problemsSolved: 0, timeSpentMinutes: 0, sessions: 0 },
          monthly: { problemsSolved: 0, timeSpentMinutes: 0, sessions: 0 }
        }
      })
    }

    const trends = await getOrSetCache(`analytics:${user.id}:trends`, 45_000, () =>
      getPerformanceTrends(user.id)
    )
    return NextResponse.json({ trends })
  } catch (error) {
    console.error('Error fetching trends:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
