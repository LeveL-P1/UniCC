import { Platform } from '@prisma/client'
import { AdapterError, fetchWithTimeout, PlatformAdapter, safeJson, withRetry } from '@/lib/integrations/base'
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
        fetchWithTimeout(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`),
        fetchWithTimeout(`https://codeforces.com/api/user.rating?handle=${encodeURIComponent(handle)}`),
        fetchWithTimeout(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=1000`)
      ])

      // Codeforces answers an unknown handle with HTTP 400 and a FAILED body,
      // not 404, so safeJson would file a missing user under TEMP_FAILURE and
      // the lookup would retry forever. Any of the three can carry the verdict.
      await assertNotMissing(infoRes, ratingRes, statusRes)

      const infoJson = await safeJson<CodeforcesUserInfo>(infoRes)
      const ratingJson = await safeJson<CodeforcesRatingResponse>(ratingRes)
      const statusJson = await safeJson<CodeforcesStatusResponse>(statusRes)

      const user = infoJson.result?.[0]
      if (!user) throw new AdapterError('NOT_FOUND', 'Codeforces user not found')

      // user.info takes a plural `handles=` list and will happily answer with
      // somebody else — querying "gennady.korotkevich" returns the account
      // "GemeneN". Without this guard a stranger's rating gets stored under
      // the handle that was searched for.
      if (user.handle?.toLowerCase() !== handle.toLowerCase()) {
        throw new AdapterError(
          'NOT_FOUND',
          `Codeforces resolved "${handle}" to a different account ("${user.handle}")`
        )
      }

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

/**
 * Codeforces reports a missing handle as HTTP 400 with a FAILED body rather
 * than 404. Any of the three endpoints may be the one that says so, so all of
 * them are inspected before the responses are parsed.
 */
async function assertNotMissing(...responses: Response[]): Promise<void> {
  for (const res of responses) {
    if (res.status !== 400) continue
    const body = (await res.clone().json().catch(() => null)) as
      | { status?: string; comment?: string }
      | null
    if (body?.comment && /not found/i.test(body.comment)) {
      throw new AdapterError('NOT_FOUND', 'Codeforces user not found')
    }
    throw new AdapterError('TEMP_FAILURE', body?.comment ?? 'Codeforces rejected the request')
  }
}
