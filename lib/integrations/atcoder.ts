import { Platform } from '@prisma/client'
import { AdapterError, PlatformAdapter, safeJson, withRetry } from '@/lib/integrations/base'
import { NormalizedPlatformStats } from '@/lib/sync/types'

interface AtCoderHistoryItem {
  IsRated: boolean
  Place: number
  NewRating: number
  OldRating: number
  EndTime: string
  ContestName: string
}

export class AtCoderAdapter implements PlatformAdapter {
  platform = Platform.ATCODER

  async fetchStats(handle: string): Promise<NormalizedPlatformStats> {
    return withRetry(async () => {
      const historyRes = await fetch(`https://atcoder.jp/users/${encodeURIComponent(handle)}/history/json`)
      if (historyRes.status === 404) {
        throw new AdapterError('NOT_FOUND', 'AtCoder user not found')
      }

      const history = await safeJson<AtCoderHistoryItem[]>(historyRes)
      const rated = history.filter(item => item.IsRated)
      const last = rated[rated.length - 1]

      return {
        platform: this.platform,
        handle,
        profileUrl: `https://atcoder.jp/users/${handle}`,
        capturedAt: new Date(),
        totalSolved: 0,
        rating: last?.NewRating,
        rank: undefined,
        ratings: rated.map(item => ({
          eventAt: new Date(item.EndTime),
          rating: item.NewRating,
          contestName: item.ContestName,
          delta: item.NewRating - item.OldRating,
          rank: String(item.Place)
        })),
        contests: rated.map(item => ({
          contestName: item.ContestName,
          contestDate: new Date(item.EndTime),
          rank: item.Place,
          ratingBefore: item.OldRating,
          ratingAfter: item.NewRating,
          ratingDelta: item.NewRating - item.OldRating
        })),
        raw: history
      }
    })
  }
}
