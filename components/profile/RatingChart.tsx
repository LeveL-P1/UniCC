'use client'

import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface RatingData {
  platform: string
  date: string
  rating: number
}

interface RatingChartProps {
  data: RatingData[]
}

const PLATFORM_COLORS: Record<string, string> = {
  Codeforces: '#1890FF',
  LeetCode: '#FFA116',
  AtCoder: '#10B981',
  CodeChef: '#8B5CF6',
  HackerRank: '#2EC866',
}

export function RatingChart({ data }: RatingChartProps) {
  const { chartData, platforms } = useMemo(() => {
    // Group data by date and pivot platforms into columns
    const dateMap = new Map<string, Record<string, number>>()
    const platformSet = new Set<string>()

    data.forEach((item) => {
      platformSet.add(item.platform)
      const existing = dateMap.get(item.date) || {}
      existing[item.platform] = item.rating
      dateMap.set(item.date, existing)
    })

    // Sort by date and create chart data
    const sortedDates = Array.from(dateMap.keys()).sort()
    const chartData = sortedDates.map((date) => ({
      date,
      displayDate: new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        year: '2-digit',
      }),
      ...dateMap.get(date),
    }))

    return {
      chartData,
      platforms: Array.from(platformSet),
    }
  }, [data])

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Rating History</h2>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No rating data available
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">Rating History</h2>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="displayDate"
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#f4f4f5' }}
              itemStyle={{ color: '#a1a1aa' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span style={{ color: '#a1a1aa', fontSize: '12px' }}>{value}</span>
              )}
            />
            {platforms.map((platform) => (
              <Line
                key={platform}
                type="monotone"
                dataKey={platform}
                stroke={PLATFORM_COLORS[platform] || '#ff6b35'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
