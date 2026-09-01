import { Platform } from '@prisma/client'
import { AdapterError, fetchWithTimeout, PlatformAdapter, withRetry } from '@/lib/integrations/base'
import { NormalizedPlatformStats } from '@/lib/sync/types'

/**
 * LeetCode has no public REST API. The official GraphQL endpoint is the only
 * durable source, so we call it directly.
 *
 * This adapter used to hit leetcode-stats-api.herokuapp.com first and fall
 * back to GraphQL. That host has returned 503 since Heroku retired free dynos
 * in 2022, and because withRetry wraps the whole attempt, every lookup burned
 * three timeouts against a dead machine before doing the thing that worked.
 *
 * `submitStatsGlobal` (not `submitStats`) is the lifetime accepted count.
 * `userContestRanking` is null for users who have never entered a rated
 * contest, which is normal and must not be treated as an error.
 */

const ENDPOINT = 'https://leetcode.com/graphql'

const QUERY = `
  query unicc($username: String!) {
    matchedUser(username: $username) {
      username
      profile {
        ranking
        realName
      }
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
    userContestRanking(username: $username) {
      rating
      attendedContestsCount
      globalRanking
    }
  }
`

interface LeetCodeResponse {
  data?: {
    matchedUser?: {
      username?: string
      profile?: { ranking?: number; realName?: string }
      submitStatsGlobal?: {
        acSubmissionNum?: Array<{ difficulty: string; count: number }>
      }
    } | null
    userContestRanking?: {
      rating?: number
      attendedContestsCount?: number
      globalRanking?: number
    } | null
  }
  errors?: Array<{ message: string }>
}

export class LeetCodeAdapter implements PlatformAdapter {
  platform = Platform.LEETCODE

  async fetchStats(handle: string): Promise<NormalizedPlatformStats> {
    return withRetry(async () => {
      const res = await fetchWithTimeout(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // LeetCode rejects requests without a plausible origin.
          Referer: 'https://leetcode.com',
        },
        body: JSON.stringify({ query: QUERY, variables: { username: handle } }),
      })

      if (res.status === 429) {
        throw new AdapterError('RATE_LIMIT', 'Rate limited by LeetCode')
      }
      if (!res.ok) {
        throw new AdapterError('TEMP_FAILURE', `LeetCode GraphQL failed (${res.status})`)
      }

      const body = (await res.json()) as LeetCodeResponse
      const user = body.data?.matchedUser
      if (!user) {
        throw new AdapterError('NOT_FOUND', 'LeetCode user not found')
      }

      const counts = new Map(
        (user.submitStatsGlobal?.acSubmissionNum ?? []).map((row) => [row.difficulty, row.count])
      )
      const easy = counts.get('Easy') ?? 0
      const medium = counts.get('Medium') ?? 0
      const hard = counts.get('Hard') ?? 0
      // "All" is authoritative when present; the parts can lag behind it.
      const totalSolved = counts.get('All') ?? easy + medium + hard

      const contest = body.data?.userContestRanking ?? null

      return {
        platform: this.platform,
        handle: user.username ?? handle,
        profileUrl: `https://leetcode.com/u/${handle}/`,
        capturedAt: new Date(),
        totalSolved,
        difficulty: { easy, medium, hard },
        // Contest rating is a rating. Global problem ranking is NOT — putting
        // ranking here is what made profiles show "5000001" as a headline stat.
        rating: contest?.rating != null ? Math.round(contest.rating) : undefined,
        rank: user.profile?.ranking != null ? `#${user.profile.ranking.toLocaleString('en-US')}` : undefined,
        ratings: [],
        contests: [],
        raw: body.data,
      }
    })
  }
}
