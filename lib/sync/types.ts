import { Platform } from '@prisma/client'

export type SyncErrorCode =
  | 'AUTH'
  | 'RATE_LIMIT'
  | 'NOT_FOUND'
  | 'TEMP_FAILURE'
  | 'VALIDATION'

export interface DifficultyBreakdown {
  easy?: number
  medium?: number
  hard?: number
}

export interface RatingPoint {
  eventAt: Date
  rating?: number
  rank?: string
  contestName?: string
  delta?: number
}

export interface ContestPoint {
  contestId?: string
  contestName: string
  contestDate: Date
  rank?: number
  ratingBefore?: number
  ratingAfter?: number
  ratingDelta?: number
  problemsSolved?: number
  score?: number
}

export interface NormalizedPlatformStats {
  platform: Platform
  handle: string
  profileUrl?: string
  capturedAt: Date
  totalSolved: number
  difficulty?: DifficultyBreakdown
  rating?: number
  rank?: string
  ratings: RatingPoint[]
  contests: ContestPoint[]
  raw: unknown
}
