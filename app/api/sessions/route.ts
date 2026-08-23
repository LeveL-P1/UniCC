export const runtime = 'nodejs'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getOrCreateUser } from '@/lib/auth/getOrCreateUser'
import { parseCreateSessionBody, parseSessionQuery } from '@/lib/validation/sessions'


export async function POST(request: Request) {
  try {
    // Check if user is authenticated
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized - No userId found' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => null)
    const parsed = parseCreateSessionBody(body)
    if (!parsed.data) return NextResponse.json({ error: parsed.error }, { status: 400 })

    const user = await getOrCreateUser(userId)

    // Create coding session
    const session = await prisma.codingSession.create({
      data: {
        userId: user.id,
        ...parsed.data,
      }
    })

    return NextResponse.json(session, { status: 201 })

  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    // Check if user is authenticated
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(request.url)
    const parsedQuery = parseSessionQuery(searchParams)
    if ('error' in parsedQuery) return NextResponse.json({ error: parsedQuery.error }, { status: 400 })

    const where = {
      ...parsedQuery.where,
      userId: user.id
    }

    // Fetch sessions with filters
    const sessions = await prisma.codingSession.findMany({
      where,
      orderBy: {
        date: 'desc'
      },
      take: parsedQuery.take
    })

    // Calculate summary stats
    const stats = {
      totalSessions: sessions.length,
      totalProblems: sessions.reduce((sum, s) => sum + s.problemsSolved, 0),
      totalTime: sessions.reduce((sum, s) => sum + s.timeSpentMinutes, 0),
      byDifficulty: {
        easy: sessions.reduce((sum, s) => sum + s.easy, 0),
        medium: sessions.reduce((sum, s) => sum + s.medium, 0),
        hard: sessions.reduce((sum, s) => sum + s.hard, 0),
      }
    }

    return NextResponse.json({
      sessions,
      stats
    })

  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
