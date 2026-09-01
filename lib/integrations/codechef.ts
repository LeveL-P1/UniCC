import { Platform } from '@prisma/client'
import { AdapterError, fetchWithTimeout, PlatformAdapter, withRetry } from '@/lib/integrations/base'
import { ContestPoint, NormalizedPlatformStats, RatingPoint } from '@/lib/sync/types'

/**
 * CodeChef publishes no API. The previous adapter called
 * competitive-coding-api.herokuapp.com (404 since Heroku retired free dynos)
 * and fell back to a scraper whose pattern was /(\\d+)/ — inside a regex
 * literal that matches a backslash followed by "d", never a digit. So rating
 * was always undefined and totalSolved was hardcoded 0, while the adapter
 * still reported success. A row of zeroes that claims to have worked is worse
 * than a failure, because nothing downstream knows to distrust it.
 *
 * The profile page embeds the full rated history as a JS array
 * (`all_rating = [...]`), which gives current rating, peak, ranks, contest
 * names and dates in one parse. Solve count comes from the
 * "Total Problems Solved: N" heading.
 *
 * Scraping is inherently brittle. When the markers are absent we raise
 * VALIDATION rather than returning empty data, so the failure is visible.
 */

const PROFILE = (handle: string) =>
  `https://www.codechef.com/users/${encodeURIComponent(handle)}`

// CodeChef serves a trimmed page to unrecognised agents.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

interface CodeChefRatingRow {
  code?: string
  name?: string
  rating?: string
  rank?: string
  end_date?: string
  getyear?: string
}

export class CodeChefAdapter implements PlatformAdapter {
  platform = Platform.CODECHEF

  async fetchStats(handle: string): Promise<NormalizedPlatformStats> {
    return withRetry(async () => {
      // Full HTML page, so a slightly longer ceiling than the JSON endpoints.
      const res = await fetchWithTimeout(PROFILE(handle), { headers: { 'User-Agent': UA } }, 12000)

      if (res.status === 404) {
        throw new AdapterError('NOT_FOUND', 'CodeChef user not found')
      }
      if (res.status === 429) {
        throw new AdapterError('RATE_LIMIT', 'Rate limited by CodeChef')
      }
      if (!res.ok) {
        throw new AdapterError('TEMP_FAILURE', `CodeChef profile fetch failed (${res.status})`)
      }

      // Unknown handles are 302'd to the CodeChef homepage, which still
      // returns 200 and carries no "not found" text — so the redirect target
      // is the signal. Check the destination rather than the mere fact of a
      // redirect: under throttling CodeChef also redirects, and treating that
      // as a missing user writes a confident wrong answer for a real person.
      if (res.redirected) {
        const landedOnHome = new URL(res.url).pathname.replace(/\/$/, '') === ''
        throw landedOnHome
          ? new AdapterError('NOT_FOUND', 'CodeChef user not found')
          : new AdapterError('TEMP_FAILURE', `CodeChef redirected to ${res.url}`)
      }

      const html = await res.text()
      const history = parseRatingHistory(html)
      const totalSolved = parseSolved(html)

      // Served directly but no markers => CodeChef changed its markup, which
      // is a different problem from a missing user and must not be silently
      // recorded as a profile with zero activity.
      if (history.length === 0 && totalSolved === null) {
        throw new AdapterError(
          'VALIDATION',
          'CodeChef page structure not recognised — the scraper needs updating'
        )
      }

      const latest = history[history.length - 1]
      const peak = history.reduce((max, row) => Math.max(max, row.rating ?? 0), 0)

      const ratings: RatingPoint[] = history.map((row) => ({
        eventAt: row.date,
        rating: row.rating,
        rank: row.rank != null ? String(row.rank) : undefined,
        contestName: row.name,
      }))

      const contests: ContestPoint[] = history.map((row) => ({
        contestName: row.name ?? 'CodeChef contest',
        contestDate: row.date,
        rank: row.rank,
        ratingAfter: row.rating,
      }))

      return {
        platform: this.platform,
        handle,
        profileUrl: PROFILE(handle),
        capturedAt: new Date(),
        totalSolved: totalSolved ?? 0,
        rating: latest?.rating,
        rank: peak > 0 ? `peak ${peak}` : undefined,
        ratings,
        contests,
        raw: { contests: history.length, totalSolved, peak },
      }
    })
  }
}

interface ParsedRow {
  date: Date
  rating?: number
  rank?: number
  name?: string
}

/** Pulls the embedded `all_rating = [...]` array off the profile page. */
function parseRatingHistory(html: string): ParsedRow[] {
  const match = html.match(/all_rating\s*=\s*(\[[\s\S]*?\]);/)
  if (!match) return []

  let rows: CodeChefRatingRow[]
  try {
    rows = JSON.parse(match[1]) as CodeChefRatingRow[]
  } catch {
    return []
  }

  return rows
    .map((row): ParsedRow | null => {
      const rating = row.rating != null ? Number(row.rating) : undefined
      const rank = row.rank != null ? Number(row.rank) : undefined
      // end_date is "YYYY-MM-DD HH:mm:ss"; make it ISO-parseable.
      const date = row.end_date ? new Date(row.end_date.replace(' ', 'T') + 'Z') : null
      if (!date || Number.isNaN(date.getTime())) return null
      return {
        date,
        rating: Number.isFinite(rating) ? rating : undefined,
        rank: Number.isFinite(rank) ? rank : undefined,
        name: row.name,
      }
    })
    .filter((row): row is ParsedRow => row !== null)
}

function parseSolved(html: string): number | null {
  const match = html.match(/Total Problems Solved:\s*(\d+)/i)
  if (!match) return null
  const value = Number(match[1])
  return Number.isFinite(value) ? value : null
}
