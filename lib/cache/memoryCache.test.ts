import { describe, expect, it } from 'vitest'
import { getOrSetCache, invalidateCache } from './memoryCache'

describe('memory cache', () => {
  it('returns cached value before ttl expires', async () => {
    let count = 0
    const key = 'analytics:test:key'
    const first = await getOrSetCache(key, 1000, async () => {
      count += 1
      return { value: count }
    })
    const second = await getOrSetCache(key, 1000, async () => {
      count += 1
      return { value: count }
    })
    expect(first.value).toBe(1)
    expect(second.value).toBe(1)
  })

  it('invalidates by prefix', async () => {
    const key = 'analytics:test:invalidate'
    await getOrSetCache(key, 1000, async () => ({ value: 1 }))
    invalidateCache('analytics:test:')
    const refreshed = await getOrSetCache(key, 1000, async () => ({ value: 2 }))
    expect(refreshed.value).toBe(2)
  })
})
