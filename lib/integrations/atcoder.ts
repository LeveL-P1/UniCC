import { Platform } from '@prisma/client'
import { AdapterError, fetchWithTimeout, PlatformAdapter, safeJson, withRetry } from '@/lib/integrations/base'
import { NormalizedPlatformStats } from '@/lib/sync/types'

/**
 * AtCoder exposes rated contest history as JSON, but nothing about solved
 * problems — which is why this adapter used to report totalSolved: 0 for
 * everyone, including people with a thousand accepted problems.
 *
 * Solve counts come from AtCoder Problems (kenkoooo), the long-standing
 * community index. It is a second network call, so it is allowed to fail
 * independently: a missing solve count degrades the profile, it does not
 * invalidate the rating history we already have.
 */

const HISTORY = (handle: string) =>
  `https://atcoder.jp/users/${encodeURIComponent(handle)}/history/json`

const AC_RANK = (handle: string) =>
  `https://kenkoooo.com/atcoder/atcoder-api/v3/user/ac_rank?user=${encodeURIComponent(handle)}`

interface AtCoderHistoryItem {
  IsRated: boolean
  Place: number
  NewRating: number
  OldRating: number
  EndTime: string
  ContestName: string
}

interface AcRankResponse {
  count?: number
  rank?: number
}

export class AtCoderAdapter implements PlatformAdapter {
  platform = Platform.ATCODER

  async fetchStats(handle: string): Promise<NormalizedPlatformStats> {
    return withRetry(async () => {
      const historyRes = await fetchWithTimeout(HISTORY(handle))
      if (historyRes.status === 404) {
        throw new AdapterError('NOT_FOUND', 'AtCoder user not found')
      }

      const history = await safeJson<AtCoderHistoryItem[]>(historyRes)
      const rated = history.filter((item) => item.IsRated)
      const last = rated[rated.length - 1]

      const solved = await this.fetchSolvedCount(handle)

      // history/json returns 200 [] both for people who never entered a rated
      // contest and for handles that do not exist, so neither signal alone is
      // conclusive. Only when the solve index has never heard of them either
      // is it safe to call it a missing user.
      if (rated.length === 0 && solved === null) {
        throw new AdapterError('NOT_FOUND', 'AtCoder user not found')
      }

      return {
        platform: this.platform,
        handle,
        profileUrl: `https://atcoder.jp/users/${handle}`,
        capturedAt: new Date(),
        totalSolved: solved?.count ?? 0,
        rating: last?.NewRating,
        rank: solved?.rank != null ? `#${solved.rank.toLocaleString('en-US')}` : undefined,
        ratings: rated.map((item) => ({
          eventAt: new Date(item.EndTime),
          rating: item.NewRating,
          contestName: item.ContestName,
          delta: item.NewRating - item.OldRating,
          rank: String(item.Place),
        })),
        contests: rated.map((item) => ({
          contestName: item.ContestName,
          contestDate: new Date(item.EndTime),
          rank: item.Place,
          ratingBefore: item.OldRating,
          ratingAfter: item.NewRating,
          ratingDelta: item.NewRating - item.OldRating,
        })),
        raw: { history, solved },
      }
    })
  }

  /** Best-effort. Returns null rather than failing the whole lookup. */
  private async fetchSolvedCount(handle: string): Promise<AcRankResponse | null> {
    try {
      const res = await fetchWithTimeout(AC_RANK(handle), {}, 5000)
      if (!res.ok) return null
      const data = (await res.json()) as AcRankResponse
      return typeof data.count === 'number' ? data : null
    } catch {
      return null
    }
  }
}
