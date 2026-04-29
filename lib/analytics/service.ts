import { Platform } from '@prisma/client'
import { prisma as db } from '@/lib/prisma'

export interface OverviewMetrics {
  totalSolved: number
  syncedSolved: number
  manualSolved: number
  activeDays: number
  averageProblemsPerDay: number
  strongestPlatform: Platform | null
  totalSessions: number
  totalTimeMinutes: number
  byDifficulty: {
    easy: number
    medium: number
    hard: number
  }
}

function startOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function startOfMonth(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function getOverviewMetrics(userId: string): Promise<OverviewMetrics> {
  const [latestUnified, sessions] = await Promise.all([
    db.unifiedMetricSnapshot.findFirst({
      where: { userId },
      orderBy: { capturedAt: 'desc' }
    }),
    db.codingSession.findMany({
      where: { userId },
      select: {
        problemsSolved: true,
        timeSpentMinutes: true,
        date: true,
        easy: true,
        medium: true,
        hard: true
      }
    })
  ])

  const manualSolved = sessions.reduce((sum, s) => sum + s.problemsSolved, 0)
  const syncedSolved = latestUnified?.totalSolved ?? 0
  const totalSolved = manualSolved + syncedSolved
  const uniqueDays = new Set(sessions.map(s => s.date.toISOString().split('T')[0]))

  const easyManual = sessions.reduce((sum, s) => sum + s.easy, 0)
  const mediumManual = sessions.reduce((sum, s) => sum + s.medium, 0)
  const hardManual = sessions.reduce((sum, s) => sum + s.hard, 0)

  const daysDenominator = Math.max(uniqueDays.size, 1)
  return {
    totalSolved,
    syncedSolved,
    manualSolved,
    activeDays: uniqueDays.size,
    averageProblemsPerDay: Number((totalSolved / daysDenominator).toFixed(2)),
    strongestPlatform: latestUnified?.strongestPlatform ?? null,
    totalSessions: sessions.length,
    totalTimeMinutes: sessions.reduce((sum, s) => sum + s.timeSpentMinutes, 0),
    byDifficulty: {
      easy: easyManual + (latestUnified?.easySolved ?? 0),
      medium: mediumManual + (latestUnified?.mediumSolved ?? 0),
      hard: hardManual + (latestUnified?.hardSolved ?? 0)
    }
  }
}

export async function getRatingTimeline(userId: string) {
  const history = await db.platformRatingHistory.findMany({
    where: { userId },
    select: {
      platform: true,
      eventAt: true,
      rating: true,
      contestName: true
    },
    orderBy: { eventAt: 'asc' }
  })

  return history.map(item => ({
    platform: item.platform,
    date: item.eventAt.toISOString(),
    rating: item.rating,
    contestName: item.contestName
  }))
}

export async function getPerformanceTrends(userId: string) {
  const weekStart = startOfWeek()
  const monthStart = startOfMonth()

  const [weeklySessions, monthlySessions] = await Promise.all([
    db.codingSession.findMany({
      where: { userId, date: { gte: weekStart } },
      select: { problemsSolved: true, timeSpentMinutes: true }
    }),
    db.codingSession.findMany({
      where: { userId, date: { gte: monthStart } },
      select: { problemsSolved: true, timeSpentMinutes: true }
    })
  ])

  return {
    weekly: {
      problemsSolved: weeklySessions.reduce((sum, s) => sum + s.problemsSolved, 0),
      timeSpentMinutes: weeklySessions.reduce((sum, s) => sum + s.timeSpentMinutes, 0),
      sessions: weeklySessions.length
    },
    monthly: {
      problemsSolved: monthlySessions.reduce((sum, s) => sum + s.problemsSolved, 0),
      timeSpentMinutes: monthlySessions.reduce((sum, s) => sum + s.timeSpentMinutes, 0),
      sessions: monthlySessions.length
    }
  }
}

export async function getPlatformComparison(userId: string) {
  const [latestSnapshots, latestRatings] = await Promise.all([
    db.platformSolvedSnapshot.findMany({
      where: { userId },
      orderBy: { capturedAt: 'desc' },
      distinct: ['platform']
    }),
    db.platformRatingHistory.findMany({
      where: { userId },
      orderBy: { eventAt: 'desc' },
      distinct: ['platform']
    })
  ])

  const ratingMap = new Map(latestRatings.map(r => [r.platform, r.rating]))

  return latestSnapshots.map(snapshot => ({
    platform: snapshot.platform,
    totalSolved: snapshot.totalSolved,
    easySolved: snapshot.easySolved ?? 0,
    mediumSolved: snapshot.mediumSolved ?? 0,
    hardSolved: snapshot.hardSolved ?? 0,
    rating: ratingMap.get(snapshot.platform) ?? null,
    lastUpdatedAt: snapshot.capturedAt.toISOString()
  }))
}
