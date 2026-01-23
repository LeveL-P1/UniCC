'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Session {
  date: string
  problemsSolved: number
  timeSpentMinutes: number
}

interface WeeklyInsightsProps {
  sessions: Session[]
}

export function WeeklyInsights({ sessions }: WeeklyInsightsProps) {
  const getWeekdayData = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const dayData = Array(7).fill(0).map((_, i) => ({
      day: dayNames[i],
      problems: 0,
      count: 0
    }))

    sessions.forEach(session => {
      const dayIndex = new Date(session.date).getDay()
      dayData[dayIndex].problems += session.problemsSolved
      dayData[dayIndex].count += 1
    })

    return dayData
  }

  const weekdayData = getWeekdayData()
  const totalProblems = sessions.reduce((sum, s) => sum + s.problemsSolved, 0)
  const avgPerSession = sessions.length > 0 ? (totalProblems / sessions.length).toFixed(1) : 0

  // Find most productive day
  const mostProductiveDay = weekdayData.reduce((max, day) => 
    day.problems > max.problems ? day : max
  , weekdayData[0])

  if (sessions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[#a0a0a0]">
        <p>No data available yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#242424] rounded-lg p-3">
          <p className="text-xs text-[#a0a0a0] mb-1">Avg per Session</p>
          <p className="text-2xl font-bold text-white">{avgPerSession}</p>
          <p className="text-xs text-[#a0a0a0]">problems</p>
        </div>
        <div className="bg-[#242424] rounded-lg p-3">
          <p className="text-xs text-[#a0a0a0] mb-1">Best Day</p>
          <p className="text-2xl font-bold text-[#ff6b35]">{mostProductiveDay.day}</p>
          <p className="text-xs text-[#a0a0a0]">{mostProductiveDay.problems} problems</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weekdayData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis 
              dataKey="day" 
              stroke="#a0a0a0"
              tick={{ fill: '#a0a0a0', fontSize: 12 }}
            />
            <YAxis 
              stroke="#a0a0a0"
              tick={{ fill: '#a0a0a0', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                color: '#fff'
              }}
              labelStyle={{ color: '#a0a0a0' }}
            />
            <Bar 
              dataKey="problems" 
              fill="#ff6b35"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}