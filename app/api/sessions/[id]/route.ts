/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'


// UPDATE - Edit existing session


// UPDATE - Edit existing session
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 🔑 IMPORTANT: unwrap params (Next.js App Router requirement)
    const { id } = await context.params

    // Auth check
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find user in DB
    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify session exists & ownership
    const existingSession = await prisma.codingSession.findUnique({
      where: { id }
    })

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (existingSession.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()

    // Build update payload safely (partial updates allowed)
    const updateData: any = {}

    if (body.date !== undefined) updateData.date = new Date(body.date)
    if (body.platform !== undefined) updateData.platform = body.platform
    if (body.problemsSolved !== undefined) updateData.problemsSolved = body.problemsSolved
    if (body.easy !== undefined) updateData.easy = body.easy
    if (body.medium !== undefined) updateData.medium = body.medium
    if (body.hard !== undefined) updateData.hard = body.hard
    if (body.timeSpentMinutes !== undefined) updateData.timeSpentMinutes = body.timeSpentMinutes
    if (body.topics !== undefined) updateData.topics = body.topics
    if (body.notes !== undefined) updateData.notes = body.notes

    // Update session
    const updatedSession = await prisma.codingSession.update({
      where: { id },
      data: updateData
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

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingSession = await prisma.codingSession.findUnique({
      where: { id }
    })

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (existingSession.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await prisma.codingSession.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
