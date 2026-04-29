export const runtime = 'nodejs'

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPlatformComparison } from '@/lib/analytics/service'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ comparison: [] })

    const comparison = await getPlatformComparison(user.id)
    return NextResponse.json({ comparison })
  } catch (error) {
    console.error('Error fetching platform comparison:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
