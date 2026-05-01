'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Lock } from 'lucide-react'

const PLATFORM_CONFIG: Record<string, { color: string; bgColor: string; icon: string }> = {
  LeetCode: { color: '#FFA116', bgColor: 'rgba(255, 161, 22, 0.1)', icon: 'LC' },
  Codeforces: { color: '#1890FF', bgColor: 'rgba(24, 144, 255, 0.1)', icon: 'CF' },
  CodeChef: { color: '#5B4638', bgColor: 'rgba(91, 70, 56, 0.1)', icon: 'CC' },
  AtCoder: { color: '#222222', bgColor: 'rgba(255, 255, 255, 0.1)', icon: 'AC' },
  HackerRank: { color: '#2EC866', bgColor: 'rgba(46, 200, 102, 0.1)', icon: 'HR' },
  SPOJ: { color: '#3366CC', bgColor: 'rgba(51, 102, 204, 0.1)', icon: 'SP' },
}

interface PlatformCardProps {
  platform: {
    platform: string
    handle: string
    rating?: number
    maxRating?: number
    rank?: string
    problemsSolved?: number
    easy?: number
    medium?: number
    hard?: number
    contests?: number
    lastUpdated?: string
  }
  isLocked?: boolean
}

export function PlatformCard({ platform, isLocked = false }: PlatformCardProps) {
  const config = PLATFORM_CONFIG[platform.platform] || {
    color: '#ff6b35',
    bgColor: 'rgba(255, 107, 53, 0.1)',
    icon: platform.platform.substring(0, 2).toUpperCase(),
  }

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02, y: -4 } : undefined}
      className={`relative overflow-hidden rounded-2xl border border-border bg-card p-5 h-full ${
        isLocked ? 'opacity-80' : ''
      }`}
    >
      {/* Background Glow */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: config.color }}
      />

      {isLocked && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Sign in to view</p>
          </div>
        </div>
      )}

      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: config.bgColor, color: config.color }}
            >
              {config.icon}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{platform.platform}</h3>
              <p className="text-sm text-muted-foreground">@{platform.handle}</p>
            </div>
          </div>
          <a
            href={getPlatformUrl(platform.platform, platform.handle)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          {/* Rating */}
          {platform.rating && (
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Rating</span>
              <div className="text-right">
                <span
                  className="text-2xl font-bold font-mono"
                  style={{ color: config.color }}
                >
                  {platform.rating}
                </span>
                {platform.maxRating && platform.maxRating !== platform.rating && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (max {platform.maxRating})
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Rank */}
          {platform.rank && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Rank</span>
              <span
                className="text-sm font-medium px-2 py-0.5 rounded-full"
                style={{ backgroundColor: config.bgColor, color: config.color }}
              >
                {platform.rank}
              </span>
            </div>
          )}

          {/* Problems Solved */}
          {platform.problemsSolved !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Solved</span>
              <span className="text-lg font-bold text-foreground font-mono">
                {platform.problemsSolved}
              </span>
            </div>
          )}

          {/* Difficulty breakdown for LeetCode */}
          {platform.easy !== undefined && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-green-500">E:{platform.easy}</span>
              <span className="text-yellow-500">M:{platform.medium}</span>
              <span className="text-red-500">H:{platform.hard}</span>
            </div>
          )}

          {/* Contests */}
          {platform.contests !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Contests</span>
              <span className="text-foreground font-mono">{platform.contests}</span>
            </div>
          )}
        </div>

        {/* Last Updated */}
        {platform.lastUpdated && (
          <p className="mt-4 text-xs text-muted-foreground">
            Updated {formatDate(platform.lastUpdated)}
          </p>
        )}
      </div>
    </motion.div>
  )
}

function getPlatformUrl(platform: string, handle: string): string {
  const urls: Record<string, string> = {
    LeetCode: `https://leetcode.com/${handle}`,
    Codeforces: `https://codeforces.com/profile/${handle}`,
    CodeChef: `https://www.codechef.com/users/${handle}`,
    AtCoder: `https://atcoder.jp/users/${handle}`,
    HackerRank: `https://www.hackerrank.com/${handle}`,
    SPOJ: `https://www.spoj.com/users/${handle}`,
  }
  return urls[platform] || '#'
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
