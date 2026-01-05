'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, KPICard } from '@/components/ui/Card'
import { Drawer } from '@/components/ui/Drawer'
import { SessionForm, SessionFormData } from '@/components/sessions/SessionsForm'
import { Code2, Target, Flame, Clock, Plus } from 'lucide-react'

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-outfit font-bold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-sm text-[#a0a0a0] mt-1">
              Your coding practice at a glance
            </p>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="
              flex items-center gap-2
              px-5 py-3
              bg-[#ff6b35]
              hover:bg-[#e55a28]
              text-white font-medium
              rounded-xl
              shadow-lg shadow-[#ff6b35]/20
              transition-all
            "
          >
            <Plus size={18} />
            Add Session
          </button>
        </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Problems per Day" collapsible>
              <div className="h-64 flex items-center justify-center text-[#a0a0a0]">
                Line Chart – Phase 1D
              </div>
            </Card>

            <Card title="Difficulty Distribution" collapsible>
              <div className="h-64 flex flex-col justify-center gap-5">
                {loading ? (
                  <p className="text-[#a0a0a0] text-center">Loading...</p>
                ) : stats ? (
                  ['easy', 'medium', 'hard'].map(level => {
                    const value = stats.byDifficulty[level as keyof typeof stats.byDifficulty]
                    const color =
                      level === 'easy'
                        ? 'bg-green-500'
                        : level === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'

                    return (
                      <div key={level} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize text-white/80">{level}</span>
                          <span className="font-semibold text-white">{value}</span>
                        </div>
                        <div className="w-full bg-[#242424] rounded-full h-2">
                          <div
                            className={`${color} h-2 rounded-full transition-all`}
                            style={{
                              width: `${(value / stats.totalProblems) * 100 || 0}%`
                            }}
                          />
                        </div>
                      </div>
                    )
                  })
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

            <Card title="Top Topics">
              <div className="h-64 flex items-center justify-center text-[#a0a0a0]">
                Topics Analysis – Phase 1D
              </div>
            </Card>
          </div>
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
