import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// UPDATE - Edit existing session
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if session exists and belongs to user
    const existingSession = await prisma.codingSession.findUnique({
      where: { id: params.id }
    })

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (existingSession.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - Not your session' },
        { status: 403 }
      )
    }

    // Get update data
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

    // Update session
    const updatedSession = await prisma.codingSession.update({
      where: { id: params.id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(platform && { platform }),
        ...(problemsSolved !== undefined && { problemsSolved }),
        ...(easy !== undefined && { easy }),
        ...(medium !== undefined && { medium }),
        ...(hard !== undefined && { hard }),
        ...(timeSpentMinutes !== undefined && { timeSpentMinutes }),
        ...(topics && { topics }),
        ...(notes !== undefined && { notes }),
      }
    })

    return NextResponse.json(updatedSession)

  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove session
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if session exists and belongs to user
    const existingSession = await prisma.codingSession.findUnique({
      where: { id: params.id }
    })

    if (!existingSession) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (existingSession.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden - Not your session' },
        { status: 403 }
      )
    }

    // Delete session
    await prisma.codingSession.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Session deleted successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}