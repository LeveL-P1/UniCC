export const runtime = 'nodejs'

import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getRatingTimeline } from '@/lib/analytics/service'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ timeline: [] })

    const timeline = await getRatingTimeline(user.id)
    return NextResponse.json({ timeline })
  } catch (error) {
    console.error('Error fetching rating timeline:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
