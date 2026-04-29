import { Platform } from '@prisma/client'
import { AdapterError, PlatformAdapter, safeJson, withRetry } from '@/lib/integrations/base'
import { NormalizedPlatformStats } from '@/lib/sync/types'

interface CodeforcesUserInfo {
  status: string
  result: Array<{
    handle: string
    rank?: string
    rating?: number
  }>
}

interface CodeforcesRatingResponse {
  status: string
  result: Array<{
    contestName: string
    ratingUpdateTimeSeconds: number
    oldRating: number
    newRating: number
    rank: number
  }>
}

interface CodeforcesStatusResponse {
  status: string
  result: Array<{
    verdict?: string
    problem?: { contestId?: number; index?: string }
  }>
}

export class CodeforcesAdapter implements PlatformAdapter {
  platform = Platform.CODEFORCES

  async fetchStats(handle: string): Promise<NormalizedPlatformStats> {
    return withRetry(async () => {
      const [infoRes, ratingRes, statusRes] = await Promise.all([
        fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`),
        fetch(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`),
        fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=1000`)
      ])

      const infoJson = await safeJson<CodeforcesUserInfo>(infoRes)
      const ratingJson = await safeJson<CodeforcesRatingResponse>(ratingRes)
      const statusJson = await safeJson<CodeforcesStatusResponse>(statusRes)

      const user = infoJson.result?.[0]
      if (!user) throw new AdapterError('NOT_FOUND', 'Codeforces user not found')

      const solvedSet = new Set(
        statusJson.result
          .filter(s => s.verdict === 'OK')
          .map(s => `${s.problem?.contestId}-${s.problem?.index}`)
      )

      return {
        platform: this.platform,
        handle,
        profileUrl: `https://codeforces.com/profile/${handle}`,
        capturedAt: new Date(),
        totalSolved: solvedSet.size,
        rating: user.rating,
        rank: user.rank,
        ratings: ratingJson.result.map(point => ({
          eventAt: new Date(point.ratingUpdateTimeSeconds * 1000),
          rating: point.newRating,
          rank: String(point.rank),
          contestName: point.contestName,
          delta: point.newRating - point.oldRating
        })),
        contests: ratingJson.result.map(item => ({
          contestName: item.contestName,
          contestDate: new Date(item.ratingUpdateTimeSeconds * 1000),
          rank: item.rank,
          ratingBefore: item.oldRating,
          ratingAfter: item.newRating,
          ratingDelta: item.newRating - item.oldRating
        })),
        raw: { infoJson, ratingJson }
      }
    })
  }
}
