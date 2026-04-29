export const runtime = 'nodejs'

import { Platform } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdvancedInsights } from '@/lib/analytics/service'
import { getOrSetCache } from '@/lib/cache/memoryCache'

function parsePlatform(value: string | null): Platform | 'ALL' {
  if (!value || value === 'ALL') return 'ALL'
  return Object.values(Platform).includes(value as Platform) ? (value as Platform) : 'ALL'
}

function parseRange(value: string | null): '30d' | '90d' | '180d' | '365d' {
  return value === '90d' || value === '180d' || value === '365d' ? value : '30d'
}

function parseBenchmark(value: string | null): 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' {
  return value === 'BEGINNER' || value === 'ADVANCED' ? value : 'INTERMEDIATE'
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ insights: null })

    const { searchParams } = new URL(request.url)
    const range = parseRange(searchParams.get('range'))
    const platform = parsePlatform(searchParams.get('platform'))
    const benchmark = parseBenchmark(searchParams.get('benchmark'))
    const cacheKey = `analytics:${user.id}:advanced:${range}:${platform}:${benchmark}`
    const insights = await getOrSetCache(cacheKey, 45_000, () =>
      getAdvancedInsights(user.id, { range, platform, benchmark })
    )

    return NextResponse.json({ insights })
  } catch (error) {
    console.error('Error fetching advanced insights:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
