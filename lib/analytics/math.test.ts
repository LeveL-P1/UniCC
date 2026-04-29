import { describe, expect, it } from 'vitest'
import { detectPlateau, pearsonCorrelation, velocityPerWeek } from './math'

describe('analytics math helpers', () => {
  it('returns strong positive correlation for similar series', () => {
    const correlation = pearsonCorrelation([2, 4, 6, 8], [1, 2, 3, 4])
    expect(correlation).toBeGreaterThan(0.9)
  })

  it('returns 0 when series are invalid', () => {
    expect(pearsonCorrelation([1], [1])).toBe(0)
    expect(pearsonCorrelation([1, 2], [1])).toBe(0)
  })

  it('detects plateau when growth is flat', () => {
    expect(detectPlateau([100, 101, 102])).toBe(true)
    expect(detectPlateau([100, 106, 115])).toBe(false)
  })

  it('calculates weekly velocity safely', () => {
    expect(velocityPerWeek(14, 14)).toBe(7)
    expect(velocityPerWeek(3, 0)).toBe(3)
  })
})
