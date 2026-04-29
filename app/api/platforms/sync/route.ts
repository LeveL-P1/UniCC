export const runtime = 'nodejs'

import { Platform } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { syncPlatformProfile } from '@/lib/sync/service'

function parsePlatform(value: unknown): Platform | null {
  if (typeof value !== 'string') return null
  return Object.values(Platform).includes(value as Platform) ? (value as Platform) : null
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const body = await request.json().catch(() => ({}))
    const targetPlatform = parsePlatform(body.platform)

    const profiles = await prisma.platformProfile.findMany({
      where: {
        userId: user.id,
        ...(targetPlatform ? { platform: targetPlatform } : {})
      }
    })

    if (profiles.length === 0) {
      return NextResponse.json({ error: 'No connected platform profiles found' }, { status: 400 })
    }

    const results = await Promise.all(
      profiles.map(profile => syncPlatformProfile(user.id, profile.platform))
    )

    const successCount = results.filter(r => r.success).length
    return NextResponse.json({
      successCount,
      total: results.length,
      results
    })
  } catch (error) {
    console.error('Error syncing platform profiles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) return NextResponse.json({ statuses: [] })

    const statuses = await prisma.platformProfile.findMany({
      where: { userId: user.id },
      select: {
        platform: true,
        handle: true,
        syncStatus: true,
        lastSyncStartedAt: true,
        lastSyncedAt: true,
        lastSuccessAt: true,
        lastError: true,
        lastErrorCode: true
      },
      orderBy: { platform: 'asc' }
    })

    return NextResponse.json({ statuses })
  } catch (error) {
    console.error('Error fetching sync statuses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
