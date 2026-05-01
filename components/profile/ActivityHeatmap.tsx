'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface ActivityData {
  date: string
  count: number
}

interface ActivityHeatmapProps {
  data: ActivityData[]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getColor(count: number): string {
  if (count === 0) return 'bg-muted'
  if (count <= 2) return 'bg-primary/30'
  if (count <= 4) return 'bg-primary/50'
  if (count <= 6) return 'bg-primary/70'
  return 'bg-primary'
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const { weeks, monthLabels, totalActivity, currentStreak, longestStreak } = useMemo(() => {
    const dataMap = new Map(data.map(d => [d.date, d.count]))
    const weeks: { date: string; count: number }[][] = []
    const monthLabels: { month: string; weekIndex: number }[] = []
    
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(startDate.getDate() - 364)
    
    // Adjust to start on Sunday
    const dayOfWeek = startDate.getDay()
    startDate.setDate(startDate.getDate() - dayOfWeek)
    
    let currentWeek: { date: string; count: number }[] = []
    let lastMonth = -1
    let totalActivity = 0
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    
    const currentDate = new Date(startDate)
    
    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const count = dataMap.get(dateStr) || 0
      totalActivity += count
      
      // Track streaks
      if (count > 0) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 0
      }
      
      currentWeek.push({ date: dateStr, count })
      
      // Track month labels
      const month = currentDate.getMonth()
      if (month !== lastMonth) {
        monthLabels.push({
          month: MONTHS[month],
          weekIndex: weeks.length,
        })
        lastMonth = month
      }
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
      
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek)
    }
    
    // Calculate current streak from today backwards
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].count > 0) {
        currentStreak++
      } else {
        break
      }
    }
    
    return { weeks, monthLabels, totalActivity, currentStreak, longestStreak }
  }, [data])

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Activity</h2>
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Total: </span>
            <span className="font-mono font-semibold text-foreground">{totalActivity}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Streak: </span>
            <span className="font-mono font-semibold text-primary">{currentStreak} days</span>
          </div>
        </div>
      </div>

      {/* Month Labels */}
      <div className="flex mb-2 ml-8">
        {monthLabels.map((label, i) => (
          <div
            key={`${label.month}-${i}`}
            className="text-xs text-muted-foreground"
            style={{
              marginLeft: i === 0 ? 0 : `${(label.weekIndex - (monthLabels[i - 1]?.weekIndex || 0)) * 14 - 20}px`,
            }}
          >
            {label.month}
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="flex">
        {/* Day Labels */}
        <div className="flex flex-col gap-[3px] mr-2 text-xs text-muted-foreground">
          {DAYS.map((day, i) => (
            <div
              key={day}
              className="h-[11px] flex items-center"
              style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px] overflow-x-auto">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: (weekIndex * 7 + dayIndex) * 0.001,
                  }}
                  className={`w-[11px] h-[11px] rounded-sm ${getColor(day.count)} cursor-pointer hover:ring-1 hover:ring-foreground/30 transition-all`}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 2, 4, 6, 8].map((level) => (
            <div
              key={level}
              className={`w-[11px] h-[11px] rounded-sm ${getColor(level)}`}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  )
}
