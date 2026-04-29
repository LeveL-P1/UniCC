'use client'

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface RatingPoint {
  platform: string
  date: string
  rating: number | null
  contestName?: string | null
}

interface Props {
  timeline: RatingPoint[]
}

const platformColors: Record<string, string> = {
  CODEFORCES: '#3b82f6',
  LEETCODE: '#f59e0b',
  ATCODER: '#14b8a6',
  CODECHEF: '#a855f7'
}

export function UnifiedRatingTimelineChart({ timeline }: Props) {
  if (timeline.length === 0) {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">No rating history synced yet</div>
  }

  const grouped = timeline.reduce<Record<string, Record<string, number | string | null>>>((acc, row) => {
    const key = new Date(row.date).toISOString().split('T')[0]
    if (!acc[key]) {
      acc[key] = {
        date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    }
    acc[key][row.platform] = row.rating
    return acc
  }, {})

  const chartData = Object.entries(grouped).map(([key, val]) => ({ key, ...val })).sort((a, b) =>
    String(a.key).localeCompare(String(b.key))
  )
  const platforms = [...new Set(timeline.map(item => item.platform))]

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="date" stroke="#a0a0a0" tick={{ fill: '#a0a0a0', fontSize: 12 }} />
          <YAxis stroke="#a0a0a0" tick={{ fill: '#a0a0a0', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend />
          {platforms.map(platform => (
            <Line
              key={platform}
              type="monotone"
              dataKey={platform}
              stroke={platformColors[platform] || '#ff6b35'}
              strokeWidth={2}
              dot={false}
              connectNulls
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
