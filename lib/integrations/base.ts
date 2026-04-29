import { Platform } from '@prisma/client'
import { NormalizedPlatformStats, SyncErrorCode } from '@/lib/sync/types'

export class AdapterError extends Error {
  code: SyncErrorCode

  constructor(code: SyncErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

export interface PlatformAdapter {
  platform: Platform
  fetchStats(handle: string): Promise<NormalizedPlatformStats>
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 2,
  delayMs = 350
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt < retries) {
        await sleep(delayMs * (attempt + 1))
      }
    }
  }
  throw lastError
}

export async function safeJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    if (res.status === 404) {
      throw new AdapterError('NOT_FOUND', 'Handle not found')
    }
    if (res.status === 429) {
      throw new AdapterError('RATE_LIMIT', 'Rate limited by platform API')
    }
    throw new AdapterError('TEMP_FAILURE', `HTTP ${res.status}`)
  }
  return (await res.json()) as T
}
