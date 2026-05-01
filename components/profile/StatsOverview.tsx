'use client'

import { motion } from 'framer-motion'
import { Code2, Trophy, Zap, Calendar, Lock } from 'lucide-react'

interface StatsOverviewProps {
  stats: {
    totalProblems: number
    totalContests: number
    highestRating: number
    activeDays: number
  }
  isLocked?: boolean
}

const STAT_ITEMS = [
  {
    key: 'totalProblems',
    label: 'Total Problems',
    icon: Code2,
    color: '#ff6b35',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'totalContests',
    label: 'Contests',
    icon: Trophy,
    color: '#1890FF',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'highestRating',
    label: 'Highest Rating',
    icon: Zap,
    color: '#10B981',
    format: (v: number) => v.toLocaleString(),
  },
  {
    key: 'activeDays',
    label: 'Active Days',
    icon: Calendar,
    color: '#8B5CF6',
    format: (v: number) => v.toLocaleString(),
  },
]

export function StatsOverview({ stats, isLocked = false }: StatsOverviewProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 h-full">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

      {isLocked && (
        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Sign in for full stats</p>
          </div>
        </div>
      )}

      <div className="relative">
        <h2 className="text-lg font-semibold text-foreground mb-6">Stats Overview</h2>

        <div className="space-y-6">
          {STAT_ITEMS.map((item, index) => {
            const Icon = item.icon
            const value = stats[item.key as keyof typeof stats]

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: item.color }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-2xl font-bold text-foreground font-mono">
                    {isLocked ? '---' : item.format(value)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Decorative elements */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Aggregated from all linked platforms
          </p>
        </div>
      </div>
    </div>
  )
}
