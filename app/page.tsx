'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, KPICard } from '@/components/ui/Card'
import { Drawer } from '@/components/ui/Drawer'
import { SessionForm, SessionFormData } from '@/components/sessions/SessionsForm'
import { Button } from '@/components/ui/button'
import { Code2, Target, Flame, Clock, Plus } from 'lucide-react'
import { ProblemsPerDayChart } from '@/components/charts/ProblemsPerDayChart'
import { TopicsChart } from '@/components/charts/TopicsCharts'
import { StreakCalendar } from '@/components/charts/StreakCalender'
import { WeeklyInsights } from '@/components/charts/WeeklyInsights'

interface Session {
  id: string
  date: string
  platform: string
  problemsSolved: number
  easy: number
  medium: number
  hard: number
  timeSpentMinutes: number
  topics: string[]
  notes: string
}

interface Stats {
  totalSessions: number
  totalProblems: number
  totalTime: number
  byDifficulty: {
    easy: number
    medium: number
    hard: number
  }
}

export default function DashboardPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions')
      const data = await res.json()
      setSessions(data.sessions || [])
      setStats(data.stats || null)
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSession = async (formData: SessionFormData) => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          problemsSolved: formData.easy + formData.medium + formData.hard
        })
      })

      if (res.ok) {
        setIsDrawerOpen(false)
        fetchSessions()
      }
    } catch (error) {
      console.error('Error adding session:', error)
    }
  }

  const calculateStreak = () => {
    if (sessions.length === 0) return 0

    const sortedDates = sessions
      .map(s => new Date(s.date).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

    const uniqueDates = [...new Set(sortedDates)]
    let streak = 0
    const today = new Date()

    for (let i = 0; i < uniqueDates.length; i++) {
      const sessionDate = new Date(uniqueDates[i])
      const daysDiff = Math.floor(
        (today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysDiff === i) streak++
      else break
    }

    return streak
  }

  const streak = calculateStreak()

  return (
    <DashboardLayout>
      <div className="p-6 space-y-10">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-outfit font-bold tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Your coding practice at a glance
            </p>
          </div>

          <Button
            onClick={() => setIsDrawerOpen(true)}
            size="lg"
            className="gap-2 shadow-lg shadow-primary/20"
          >
            <Plus size={18} />
            Add Session
          </Button>
        </motion.div>

        {/* KPI Section */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-[#a0a0a0] uppercase">
            Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Problems"
              value={loading ? '...' : stats?.totalProblems || 0}
              subtitle="All time"
              icon={<Code2 size={24} />}
            />
            <KPICard
              title="Total Sessions"
              value={loading ? '...' : stats?.totalSessions || 0}
              subtitle="Practice sessions"
              icon={<Target size={24} />}
            />
            <KPICard
              title="Current Streak"
              value={loading ? '...' : streak}
              subtitle="days"
              icon={<Flame size={24} />}
            />
            <KPICard
              title="Total Time"
              value={loading ? '...' : `${Math.floor((stats?.totalTime || 0) / 60)}h`}
              subtitle="Practice time"
              icon={<Clock size={24} />}
            />
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-[#a0a0a0] uppercase">
            Insights
          </h2>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="PROBLEMS PER DAY" collapsible>
              <ProblemsPerDayChart sessions={sessions} />
            </Card>

            <Card title="DIFFICULTY DISTRIBUTION" collapsible>
              <div className="h-64 flex flex-col justify-center gap-4">
                {loading ? (
                  <p className="text-[#a0a0a0] text-center">Loading...</p>
                ) : stats ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-500 text-sm font-medium">Easy</span>
                      <span className="text-white font-bold">{stats.byDifficulty.easy}</span>
                    </div>
                    <div className="w-full bg-[#242424] rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(stats.byDifficulty.easy / stats.totalProblems) * 100 || 0}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-yellow-500 text-sm font-medium">Medium</span>
                      <span className="text-white font-bold">{stats.byDifficulty.medium}</span>
                    </div>
                    <div className="w-full bg-[#242424] rounded-full h-3">
                      <div
                        className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(stats.byDifficulty.medium / stats.totalProblems) * 100 || 0}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-red-500 text-sm font-medium">Hard</span>
                      <span className="text-white font-bold">{stats.byDifficulty.hard}</span>
                    </div>
                    <div className="w-full bg-[#242424] rounded-full h-3">
                      <div
                        className="bg-red-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(stats.byDifficulty.hard / stats.totalProblems) * 100 || 0}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-[#a0a0a0] text-center">No data yet</p>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Activity */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold tracking-wide text-[#a0a0a0] uppercase">
            Activity
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card title="Recent Sessions" className="lg:col-span-2" collapsible>
              <div className="space-y-3">
                {loading ? (
                  <p className="text-center py-10 text-[#a0a0a0]">Loading sessions...</p>
                ) : sessions.length === 0 ? (
                  <p className="text-center py-10 text-[#a0a0a0]">
                    No sessions yet. Start by adding one.
                  </p>
                ) : (
                  sessions.slice(0, 5).map(session => (
                    <div
                      key={session.id}
                      className="
                        p-4 rounded-xl
                        bg-[#1f1f1f]
                        border border-white/5
                        hover:border-white/10
                        transition
                      "
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">{session.platform}</p>
                          <p className="text-xs text-[#a0a0a0]">
                            {new Date(session.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#ff6b35] font-bold">
                            {session.problemsSolved}
                          </p>
                          <p className="text-xs text-[#a0a0a0]">problems</p>
                        </div>
                      </div>

                      <div className="flex gap-3 text-xs mt-3">
                        <span className="text-green-500">E {session.easy}</span>
                        <span className="text-yellow-500">M {session.medium}</span>
                        <span className="text-red-500">H {session.hard}</span>
                        <span className="ml-auto text-[#a0a0a0]">
                          {session.timeSpentMinutes}m
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card title="TOP TOPICS">
              <TopicsChart sessions={sessions} />
            </Card>
          </div>
        </div>
        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="ACTIVITY CALENDAR" collapsible>
            <StreakCalendar sessions={sessions} />
          </Card>

          <Card title="WEEKLY INSIGHTS" collapsible>
            <WeeklyInsights sessions={sessions} />
          </Card>
        </div>

      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Add Coding Session"
      >
        <SessionForm
          onSubmit={handleAddSession}
          onCancel={() => setIsDrawerOpen(false)}
        />
      </Drawer>
    </DashboardLayout>
  )
}
