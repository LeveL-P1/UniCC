import { Platform } from '@prisma/client'
import { prisma as db } from '@/lib/prisma'
import { detectPlateau, pearsonCorrelation, velocityPerWeek } from '@/lib/analytics/math'

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

export interface AdvancedInsightsOptions {
  range?: '30d' | '90d' | '180d' | '365d'
  platform?: Platform | 'ALL'
  benchmark?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
}

function getRangeStart(range: AdvancedInsightsOptions['range']) {
  const days = range === '365d' ? 365 : range === '180d' ? 180 : range === '90d' ? 90 : 30
  const start = new Date()
  start.setDate(start.getDate() - days)
  start.setHours(0, 0, 0, 0)
  return start
}

export async function getAdvancedInsights(userId: string, options: AdvancedInsightsOptions = {}) {
  const rangeStart = getRangeStart(options.range)
  const benchmark = options.benchmark ?? 'INTERMEDIATE'
  const platformFilter = options.platform && options.platform !== 'ALL' ? options.platform : undefined

  const [sessions, contests, snapshots] = await Promise.all([
    db.codingSession.findMany({
      where: {
        userId,
        date: { gte: rangeStart },
        ...(platformFilter ? { platform: platformFilter } : {})
      },
      orderBy: { date: 'asc' },
      select: { date: true, problemsSolved: true, easy: true, medium: true, hard: true, topics: true }
    }),
    db.platformContestHistory.findMany({
      where: {
        userId,
        contestDate: { gte: rangeStart },
        ...(platformFilter ? { platform: platformFilter } : {})
      },
      orderBy: { contestDate: 'asc' },
      select: { contestDate: true, ratingDelta: true, problemsSolved: true, platform: true }
    }),
    db.platformSolvedSnapshot.findMany({
      where: {
        userId,
        capturedAt: { gte: rangeStart },
        ...(platformFilter ? { platform: platformFilter } : {})
      },
      orderBy: { capturedAt: 'asc' },
      select: { capturedAt: true, totalSolved: true, platform: true }
    })
  ])

  const platformSet = new Set<string>()
  ;[...sessions, ...contests, ...snapshots].forEach(item => {
    if ('platform' in item) platformSet.add(String(item.platform))
  })
  const activePlatforms = platformSet.size
  const consistencyScore = Math.max(0, Math.min(100, 100 - Math.max(0, activePlatforms - 1) * 12))

  const practiceByWeek = new Map<string, number>()
  sessions.forEach(s => {
    const weekKey = `${s.date.getUTCFullYear()}-${Math.ceil((s.date.getUTCDate() + 6 - s.date.getUTCDay()) / 7)}`
    practiceByWeek.set(weekKey, (practiceByWeek.get(weekKey) ?? 0) + s.problemsSolved)
  })
  const contestByWeek = new Map<string, number>()
  contests.forEach(c => {
    const weekKey = `${c.contestDate.getUTCFullYear()}-${Math.ceil((c.contestDate.getUTCDate() + 6 - c.contestDate.getUTCDay()) / 7)}`
    contestByWeek.set(weekKey, (contestByWeek.get(weekKey) ?? 0) + (c.problemsSolved ?? 0))
  })
  const allWeeks = [...new Set([...practiceByWeek.keys(), ...contestByWeek.keys()])]
  const practiceSeries = allWeeks.map(w => practiceByWeek.get(w) ?? 0)
  const contestSeries = allWeeks.map(w => contestByWeek.get(w) ?? 0)
  const contestPracticeCorrelation = pearsonCorrelation(practiceSeries, contestSeries)

  const snapshotGrowth = snapshots.length > 1
    ? snapshots[snapshots.length - 1].totalSolved - snapshots[0].totalSolved
    : sessions.reduce((sum, s) => sum + s.problemsSolved, 0)
  const elapsedDays = Math.ceil((new Date().getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24))
  const velocity = velocityPerWeek(snapshotGrowth, elapsedDays)
  const latestThree = snapshots.slice(-3).map(s => s.totalSolved)
  const plateauDetected = detectPlateau(latestThree)

  const topicMap = new Map<string, number>()
  sessions.forEach(s => s.topics.forEach(topic => {
    const normalized = topic.trim().toLowerCase()
    if (!normalized) return
    topicMap.set(normalized, (topicMap.get(normalized) ?? 0) + 1)
  }))
  const sortedTopics = [...topicMap.entries()].sort((a, b) => b[1] - a[1])
  const strengths = sortedTopics.slice(0, 3).map(([topic, count]) => ({ topic, count }))
  const weaknesses = sortedTopics.slice(-3).reverse().map(([topic, count]) => ({ topic, count }))

  const totalDifficulty = sessions.reduce(
    (acc, s) => {
      acc.easy += s.easy
      acc.medium += s.medium
      acc.hard += s.hard
      return acc
    },
    { easy: 0, medium: 0, hard: 0 }
  )

  const benchmarkVelocity =
    benchmark === 'ADVANCED' ? 20 : benchmark === 'BEGINNER' ? 6 : 12

  return {
    filters: {
      range: options.range ?? '30d',
      platform: options.platform ?? 'ALL',
      benchmark
    },
    metrics: {
      consistencyScore,
      contestPracticeCorrelation,
      velocityPerWeek: velocity,
      plateauDetected,
      difficultyMix: totalDifficulty
    },
    strengths,
    weaknesses,
    benchmark: {
      targetVelocityPerWeek: benchmarkVelocity,
      currentVelocityPerWeek: velocity,
      onTrack: velocity >= benchmarkVelocity
    }
  }
}
