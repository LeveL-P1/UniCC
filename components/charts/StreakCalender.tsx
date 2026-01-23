'use client'

interface Session {
  date: string
  problemsSolved: number
}

interface StreakCalendarProps {
  sessions: Session[]
}

export function StreakCalendar({ sessions }: StreakCalendarProps) {
  // Get last 90 days
  const getLast90DaysData = () => {
    const days = []
    const today = new Date()
    
    for (let i = 89; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      days.push(date.toISOString().split('T')[0])
    }
    
    return days
  }

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = new Date(session.date).toISOString().split('T')[0]
    acc[date] = (acc[date] || 0) + session.problemsSolved
    return acc
  }, {} as Record<string, number>)

  const last90Days = getLast90DaysData()
  
  // Calculate max problems for color intensity
  const maxProblems = Math.max(...Object.values(sessionsByDate), 1)

  // Get color based on problem count
  const getColor = (count: number) => {
    if (count === 0) return '#242424'
    const intensity = Math.min(count / maxProblems, 1)
    if (intensity < 0.25) return '#ff6b3540'
    if (intensity < 0.5) return '#ff6b3570'
    if (intensity < 0.75) return '#ff6b35a0'
    return '#ff6b35'
  }

  // Calculate current streak
  const calculateStreak = () => {
    const sortedDates = Object.keys(sessionsByDate)
      .map(d => new Date(d))
      .sort((a, b) => b.getTime() - a.getTime())
    
    if (sortedDates.length === 0) return 0
    
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < sortedDates.length; i++) {
      const sessionDate = new Date(sortedDates[i])
      sessionDate.setHours(0, 0, 0, 0)
      
      const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === i) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const currentStreak = calculateStreak()
  const totalDaysActive = Object.keys(sessionsByDate).length

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#242424] rounded-lg p-3">
          <p className="text-xs text-[#a0a0a0] mb-1">Current Streak</p>
          <p className="text-2xl font-bold text-[#ff6b35]">{currentStreak}</p>
          <p className="text-xs text-[#a0a0a0]">days</p>
        </div>
        <div className="bg-[#242424] rounded-lg p-3">
          <p className="text-xs text-[#a0a0a0] mb-1">Days Active</p>
          <p className="text-2xl font-bold text-white">{totalDaysActive}</p>
          <p className="text-xs text-[#a0a0a0]">last 90 days</p>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div>
        <p className="text-xs text-[#a0a0a0] mb-3">Activity in last 90 days</p>
        <div className="grid grid-cols-13 gap-1">
          {last90Days.map(date => {
            const count = sessionsByDate[date] || 0
            const dateObj = new Date(date)
            
            return (
              <div
                key={date}
                className="aspect-square rounded-sm transition-all hover:ring-2 hover:ring-[#ff6b35] cursor-pointer"
                style={{ backgroundColor: getColor(count) }}
                title={`${dateObj.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}: ${count} problems`}
              />
            )
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-3">
          <span className="text-xs text-[#a0a0a0]">Less</span>
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#242424' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ff6b3540' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ff6b3570' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ff6b35a0' }} />
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ff6b35' }} />
          <span className="text-xs text-[#a0a0a0]">More</span>
        </div>
      </div>
    </div>
  )
}