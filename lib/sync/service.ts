import { Platform, Prisma, SyncSource, SyncStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { getAdapter } from '@/lib/integrations'
import { AdapterError } from '@/lib/integrations/base'
import { invalidateCache } from '@/lib/cache/memoryCache'

function parseError(error: unknown): { code: string; message: string } {
  if (error instanceof AdapterError) {
    return { code: error.code, message: error.message }
  }
  if (error instanceof Error) {
    return { code: 'TEMP_FAILURE', message: error.message }
  }
  return { code: 'TEMP_FAILURE', message: 'Unknown sync failure' }
}

interface SyncOptions {
  source?: SyncSource
}

export async function syncPlatformProfile(userId: string, platform: Platform, options: SyncOptions = {}) {
  const profile = await prisma.platformProfile.findUnique({
    where: {
      userId_platform: { userId, platform }
    }
  })

  if (!profile) {
    throw new Error(`No platform profile connected for ${platform}`)
  }

  const startedAt = new Date()
  const source = options.source ?? SyncSource.MANUAL
  const log = await prisma.syncJobLog.create({
    data: {
      userId,
      platformProfileId: profile.id,
      platform,
      source,
      status: SyncStatus.SYNCING,
      startedAt
    }
  })

  await prisma.platformProfile.update({
    where: { id: profile.id },
    data: {
      syncStatus: SyncStatus.SYNCING,
      lastSyncStartedAt: new Date(),
      lastError: null,
      lastErrorCode: null
    }
  })

  try {
    const adapter = getAdapter(platform)
    const normalized = await adapter.fetchStats(profile.handle)

    const capturedAt = normalized.capturedAt

    await prisma.$transaction(async tx => {
      await tx.platformProfile.update({
        where: { id: profile.id },
        data: {
          profileUrl: normalized.profileUrl,
          syncStatus: SyncStatus.SUCCESS,
          lastSyncedAt: capturedAt,
          lastSuccessAt: capturedAt,
          rawSnapshot: normalized.raw as Prisma.InputJsonValue
        }
      })

      await tx.platformSolvedSnapshot.upsert({
        where: {
          platformProfileId_capturedAt: {
            platformProfileId: profile.id,
            capturedAt
          }
        },
        update: {
          totalSolved: normalized.totalSolved,
          easySolved: normalized.difficulty?.easy,
          mediumSolved: normalized.difficulty?.medium,
          hardSolved: normalized.difficulty?.hard
        },
        create: {
          userId,
          platformProfileId: profile.id,
          platform,
          capturedAt,
          totalSolved: normalized.totalSolved,
          easySolved: normalized.difficulty?.easy,
          mediumSolved: normalized.difficulty?.medium,
          hardSolved: normalized.difficulty?.hard
        }
      })

      for (const rating of normalized.ratings) {
        await tx.platformRatingHistory.upsert({
          where: {
            platformProfileId_eventAt_contestName: {
              platformProfileId: profile.id,
              eventAt: rating.eventAt,
              contestName: rating.contestName ?? ''
            }
          },
          update: {
            rating: rating.rating,
            rank: rating.rank,
            delta: rating.delta
          },
          create: {
            userId,
            platformProfileId: profile.id,
            platform,
            eventAt: rating.eventAt,
            rating: rating.rating,
            rank: rating.rank,
            contestName: rating.contestName ?? '',
            delta: rating.delta
          }
        })
      }

      for (const contest of normalized.contests) {
        await tx.platformContestHistory.upsert({
          where: {
            platformProfileId_contestDate_contestName: {
              platformProfileId: profile.id,
              contestDate: contest.contestDate,
              contestName: contest.contestName
            }
          },
          update: {
            rank: contest.rank,
            ratingBefore: contest.ratingBefore,
            ratingAfter: contest.ratingAfter,
            ratingDelta: contest.ratingDelta,
            problemsSolved: contest.problemsSolved,
            score: contest.score
          },
          create: {
            userId,
            platformProfileId: profile.id,
            platform,
            contestId: contest.contestId,
            contestName: contest.contestName,
            contestDate: contest.contestDate,
            rank: contest.rank,
            ratingBefore: contest.ratingBefore,
            ratingAfter: contest.ratingAfter,
            ratingDelta: contest.ratingDelta,
            problemsSolved: contest.problemsSolved,
            score: contest.score
          }
        })
      }
    })

    await refreshUnifiedSnapshot(userId, capturedAt)
    invalidateCache(`analytics:${userId}:`)
    await prisma.syncJobLog.update({
      where: { id: log.id },
      data: {
        status: SyncStatus.SUCCESS,
        finishedAt: new Date(),
        durationMs: new Date().getTime() - startedAt.getTime(),
        message: `Sync successful for ${platform}`
      }
    })
    return { platform, success: true as const }
  } catch (error) {
    const parsed = parseError(error)
    await prisma.platformProfile.update({
      where: { id: profile.id },
      data: {
        syncStatus: SyncStatus.ERROR,
        lastError: parsed.message,
        lastErrorCode: parsed.code,
        lastSyncedAt: new Date()
      }
    })
    await prisma.syncJobLog.update({
      where: { id: log.id },
      data: {
        status: SyncStatus.ERROR,
        errorCode: parsed.code,
        message: parsed.message,
        finishedAt: new Date(),
        durationMs: new Date().getTime() - startedAt.getTime()
      }
    })
    return { platform, success: false as const, error: parsed }
  }
}

export async function refreshUnifiedSnapshot(userId: string, capturedAt = new Date()) {
  const latestSnapshots = await prisma.platformSolvedSnapshot.findMany({
    where: { userId },
    orderBy: { capturedAt: 'desc' },
    distinct: ['platform']
  })
  const latestRatings = await prisma.platformRatingHistory.findMany({
    where: { userId },
    orderBy: { eventAt: 'desc' },
    distinct: ['platform']
  })

  const totalSolved = latestSnapshots.reduce((sum, s) => sum + s.totalSolved, 0)
  const easySolved = latestSnapshots.reduce((sum, s) => sum + (s.easySolved ?? 0), 0)
  const mediumSolved = latestSnapshots.reduce((sum, s) => sum + (s.mediumSolved ?? 0), 0)
  const hardSolved = latestSnapshots.reduce((sum, s) => sum + (s.hardSolved ?? 0), 0)

  const ratings = latestRatings.map(r => r.rating).filter((r): r is number => typeof r === 'number')
  const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : null

  const strongest = [...latestSnapshots].sort((a, b) => b.totalSolved - a.totalSolved)[0]
  const platformBreakdown = Object.fromEntries(
    latestSnapshots.map(item => [
      item.platform,
      {
        totalSolved: item.totalSolved,
        easySolved: item.easySolved,
        mediumSolved: item.mediumSolved,
        hardSolved: item.hardSolved
      }
    ])
  )

  await prisma.unifiedMetricSnapshot.upsert({
    where: {
      userId_capturedAt: { userId, capturedAt }
    },
    update: {
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      strongestPlatform: strongest?.platform,
      averageRating: averageRating ?? undefined,
      platformBreakdown: platformBreakdown as Prisma.InputJsonValue
    },
    create: {
      userId,
      capturedAt,
      totalSolved,
      easySolved,
      mediumSolved,
      hardSolved,
      strongestPlatform: strongest?.platform,
      averageRating: averageRating ?? undefined,
      platformBreakdown: platformBreakdown as Prisma.InputJsonValue
    }
  })
}
