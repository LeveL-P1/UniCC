export const runtime = 'nodejs'

import { Platform, SyncStatus } from '@prisma/client'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth/getOrCreateUser'

function parsePlatform(value: unknown): Platform | null {
  if (typeof value !== 'string') return null
  return Object.values(Platform).includes(value as Platform) ? (value as Platform) : null
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { clerkId: userId } })
    if (!user) {
      return NextResponse.json({ profiles: [] })
    }

    const profiles = await prisma.platformProfile.findMany({
      where: { userId: user.id },
      orderBy: { platform: 'asc' }
    })

    return NextResponse.json({ profiles })
  } catch (error) {
    console.error('Error fetching platform profiles:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const platform = parsePlatform(body.platform)
    const handle = typeof body.handle === 'string' ? body.handle.trim() : ''
    const profileUrl = typeof body.profileUrl === 'string' ? body.profileUrl.trim() : undefined

    if (!platform || !handle) {
      return NextResponse.json(
        { error: 'platform and handle are required' },
        { status: 400 }
      )
    }

    const user = await getOrCreateUser(userId)
    const profile = await prisma.platformProfile.upsert({
      where: { userId_platform: { userId: user.id, platform } },
      update: {
        handle,
        profileUrl,
        syncStatus: SyncStatus.IDLE,
        lastError: null,
        lastErrorCode: null
      },
      create: {
        userId: user.id,
        platform,
        handle,
        profileUrl,
        syncStatus: SyncStatus.IDLE
      }
    })

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error connecting platform profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
