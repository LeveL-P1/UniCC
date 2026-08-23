export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { runScheduledSync } from '@/lib/sync/scheduler'

export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization')
  const expected = process.env.CRON_SECRET
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const staleMinutes = Number(searchParams.get('staleMinutes') ?? 180)
    const jitterMs = Number(searchParams.get('jitterMs') ?? 500)
    const safeStaleMinutes = Number.isFinite(staleMinutes)
      ? Math.min(Math.max(Math.floor(staleMinutes), 60), 7 * 24 * 60)
      : 180
    const safeJitterMs = Number.isFinite(jitterMs)
      ? Math.min(Math.max(Math.floor(jitterMs), 0), 30_000)
      : 500
    const result = await runScheduledSync({
      staleMinutes: safeStaleMinutes,
      jitterMs: safeJitterMs
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error('Scheduled sync failed:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
