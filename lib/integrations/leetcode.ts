import { Platform } from '@prisma/client'
import { AdapterError, PlatformAdapter, withRetry } from '@/lib/integrations/base'
import { NormalizedPlatformStats } from '@/lib/sync/types'

interface LeetCodeApiResponse {
  status: string
  totalSolved?: number
  easySolved?: number
  mediumSolved?: number
  hardSolved?: number
  ranking?: number
}

export class LeetCodeAdapter implements PlatformAdapter {
  platform = Platform.LEETCODE

  async fetchStats(handle: string): Promise<NormalizedPlatformStats> {
    return withRetry(async () => {
      const publicApi = await fetch(`https://leetcode-stats-api.herokuapp.com/${encodeURIComponent(handle)}`)
      if (publicApi.ok) {
        const data = (await publicApi.json()) as LeetCodeApiResponse
        if (data.status === 'error') {
          throw new AdapterError('NOT_FOUND', 'LeetCode user not found')
        }
        return {
          platform: this.platform,
          handle,
          profileUrl: `https://leetcode.com/${handle}/`,
          capturedAt: new Date(),
          totalSolved: data.totalSolved ?? 0,
          difficulty: {
            easy: data.easySolved ?? 0,
            medium: data.mediumSolved ?? 0,
            hard: data.hardSolved ?? 0
          },
          rank: data.ranking ? String(data.ranking) : undefined,
          ratings: [],
          contests: [],
          raw: data
        }
      }

      const graphQlRes = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query userPublicProfile($username: String!) {
              matchedUser(username: $username) {
                profile {
                  ranking
                }
                submitStats {
                  acSubmissionNum {
                    difficulty
                    count
                  }
                }
              }
            }
          `,
          variables: { username: handle }
        })
      })

      if (!graphQlRes.ok) {
        throw new AdapterError('TEMP_FAILURE', `LeetCode GraphQL failed (${graphQlRes.status})`)
      }

      const body = (await graphQlRes.json()) as {
        data?: {
          matchedUser?: {
            profile?: { ranking?: number }
            submitStats?: { acSubmissionNum?: Array<{ difficulty: string; count: number }> }
          } | null
        }
      }

      const matchedUser = body.data?.matchedUser
      if (!matchedUser) {
        throw new AdapterError('NOT_FOUND', 'LeetCode user not found')
      }

      const statMap = new Map(
        (matchedUser.submitStats?.acSubmissionNum ?? []).map(item => [item.difficulty, item.count])
      )
      const easy = statMap.get('Easy') ?? 0
      const medium = statMap.get('Medium') ?? 0
      const hard = statMap.get('Hard') ?? 0

      return {
        platform: this.platform,
        handle,
        profileUrl: `https://leetcode.com/${handle}/`,
        capturedAt: new Date(),
        totalSolved: easy + medium + hard,
        difficulty: { easy, medium, hard },
        rank: matchedUser.profile?.ranking ? String(matchedUser.profile.ranking) : undefined,
        ratings: [],
        contests: [],
        raw: body
      }
    })
  }
}
