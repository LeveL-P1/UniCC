export function pearsonCorrelation(xs: number[], ys: number[]) {
  if (xs.length !== ys.length || xs.length < 2) return 0
  const n = xs.length
  const sumX = xs.reduce((a, b) => a + b, 0)
  const sumY = ys.reduce((a, b) => a + b, 0)
  const sumXY = xs.reduce((sum, x, i) => sum + x * ys[i], 0)
  const sumX2 = xs.reduce((sum, x) => sum + x * x, 0)
  const sumY2 = ys.reduce((sum, y) => sum + y * y, 0)
  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))
  return denominator === 0 ? 0 : Number((numerator / denominator).toFixed(3))
}

export function detectPlateau(values: number[]) {
  const latestThree = values.slice(-3)
  if (latestThree.length < 3) return false
  return latestThree[2] - latestThree[0] <= 2
}

export function velocityPerWeek(growth: number, days: number) {
  const weeks = Math.max(1, Math.ceil(days / 7))
  return Number((growth / weeks).toFixed(2))
}
