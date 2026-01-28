export const runtime = 'nodejs'
import { auth, currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'


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

    // Get the current user from Clerk
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return NextResponse.json(
        { error: 'Unauthorized - No user found' },
        { status: 401 }
      )
    }

    // Get request body
    const body = await request.json()
    const {
      date,
      platform,
      problemsSolved,
      easy,
      medium,
      hard,
      timeSpentMinutes,
      topics,
      notes
    } = body

    // Validate required fields
    if (!date || !platform) {
      return NextResponse.json(
        { error: 'Date and platform are required' },
        { status: 400 }
      )
    }

    // Find or create user in our database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.firstName || null,
        }
      })
    }

    // Create coding session
    const session = await prisma.codingSession.create({
      data: {
        userId: user.id,
        date: new Date(date),
        platform,
        problemsSolved: problemsSolved || 0,
        easy: easy || 0,
        medium: medium || 0,
        hard: hard || 0,
        timeSpentMinutes: timeSpentMinutes || 0,
        topics: topics || [],
        notes: notes || null,
      }
    })

    return NextResponse.json(session, { status: 201 })

  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = searchParams.get('limit')

    // Build filter conditions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      userId: user.id
    }

    if (platform) {
      where.platform = platform
    }

    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        where.date.gte = new Date(startDate)
      }
      if (endDate) {
        where.date.lte = new Date(endDate)
      }
    }

    // Fetch sessions with filters
    const sessions = await prisma.codingSession.findMany({
      where,
      orderBy: {
        date: 'desc'
      },
      take: limit ? parseInt(limit) : undefined
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