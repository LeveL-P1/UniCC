'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Session {
    date: string
    problemsSolved: number
}

interface ProblemsPerDayChartProps {
    sessions: Session[]
}

export function ProblemsPerDayChart({ sessions }: ProblemsPerDayChartProps) {
    // Process data for last 30 days
    const getLast30DaysData = () => {
        const last30Days = Array.from({ length: 30 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (29 - i))
            return date.toISOString().split('T')[0]
        })

        // Group sessions by date and sum problems
        const problemsByDate = sessions.reduce((acc, session) => {
            const sessionDate = new Date(session.date).toISOString().split('T')[0]
            acc[sessionDate] = (acc[sessionDate] || 0) + session.problemsSolved
            return acc
        }, {} as Record<string, number>)

        // Create chart data
        return last30Days.map(date => ({
            date,
            problems: problemsByDate[date] || 0,
            displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }))
    }

    const chartData = getLast30DaysData()

    if (sessions.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-[#a0a0a0]">
                <p>No data available. Start adding sessions!</p>
            </div>
        )
    }

    return (
        <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis
                        dataKey="displayDate"
                        stroke="#a0a0a0"
                        tick={{ fill: '#a0a0a0', fontSize: 12 }}
                        interval="preserveStartEnd"
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
                    <Line
                        type="monotone"
                        dataKey="problems"
                        stroke="#ff6b35"
                        strokeWidth={2}
                        dot={{ fill: '#ff6b35', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}