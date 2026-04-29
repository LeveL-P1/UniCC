import { Platform } from '@prisma/client'
import { AdapterError, PlatformAdapter, withRetry } from '@/lib/integrations/base'
import { NormalizedPlatformStats } from '@/lib/sync/types'

interface CodeChefApiResponse {
  success?: boolean
  rating?: number
  stars?: string
  highest_rating?: number
  // API differs across providers
}

export class CodeChefAdapter implements PlatformAdapter {
  platform = Platform.CODECHEF

  async fetchStats(handle: string): Promise<NormalizedPlatformStats> {
    return withRetry(async () => {
      const apiRes = await fetch(`https://competitive-coding-api.herokuapp.com/api/codechef/${encodeURIComponent(handle)}`)

      if (apiRes.ok) {
        const data = (await apiRes.json()) as CodeChefApiResponse
        if (data.success === false) {
          throw new AdapterError('NOT_FOUND', 'CodeChef user not found')
        }
        return {
          platform: this.platform,
          handle,
          profileUrl: `https://www.codechef.com/users/${handle}`,
          capturedAt: new Date(),
          totalSolved: 0,
          rating: data.rating,
          rank: data.stars,
          ratings: [],
          contests: [],
          raw: data
        }
      }

      // Fallback parser from public profile page if API is down.
      const page = await fetch(`https://www.codechef.com/users/${encodeURIComponent(handle)}`)
      if (!page.ok) {
        if (page.status === 404) throw new AdapterError('NOT_FOUND', 'CodeChef user not found')
        throw new AdapterError('TEMP_FAILURE', `CodeChef profile fetch failed (${page.status})`)
      }
      const html = await page.text()

      const ratingMatch = html.match(/"rating"\s*:\s*"?(\\d+)"?/i) ?? html.match(/rating-number[^>]*>(\\d+)</i)
      const starsMatch = html.match(/"stars"\s*:\s*"([^"]+)"/i)
      const rating = ratingMatch?.[1] ? Number(ratingMatch[1]) : undefined

      return {
        platform: this.platform,
        handle,
        profileUrl: `https://www.codechef.com/users/${handle}`,
        capturedAt: new Date(),
        totalSolved: 0,
        rating,
        rank: starsMatch?.[1],
        ratings: [],
        contests: [],
        raw: { htmlLength: html.length }
      }
    })
  }
}
