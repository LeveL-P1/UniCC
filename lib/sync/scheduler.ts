import { Platform, SyncSource } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { syncPlatformProfile } from '@/lib/sync/service'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export interface SchedulerOptions {
  staleMinutes?: number
  jitterMs?: number
}

export async function runScheduledSync(options: SchedulerOptions = {}) {
  const staleMinutes = options.staleMinutes ?? 180
  const jitterMs = options.jitterMs ?? 500
  const staleBefore = new Date(Date.now() - staleMinutes * 60 * 1000)

  const profiles = await prisma.platformProfile.findMany({
    where: {
      OR: [{ lastSuccessAt: null }, { lastSuccessAt: { lt: staleBefore } }]
    },
    orderBy: [{ updatedAt: 'asc' }]
  })

  const results: Array<{ userId: string; platform: Platform; success: boolean; error?: string }> = []
  for (const profile of profiles) {
    if (jitterMs > 0) {
      const jitter = Math.floor(Math.random() * jitterMs)
      await sleep(jitter)
    }
    const result = await syncPlatformProfile(profile.userId, profile.platform, { source: SyncSource.SCHEDULED })
    results.push({
      userId: profile.userId,
      platform: profile.platform,
      success: result.success,
      error: result.success ? undefined : result.error.message
    })
  }

  return {
    staleBefore: staleBefore.toISOString(),
    total: results.length,
    successCount: results.filter(r => r.success).length,
    failureCount: results.filter(r => !r.success).length,
    results
  }
}
