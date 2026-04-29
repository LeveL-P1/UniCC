'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card, KPICard } from '@/components/ui/Card'
import { Drawer } from '@/components/ui/Drawer'
import { SessionForm, SessionFormData } from '@/components/sessions/SessionsForm'
import { Button } from '@/components/ui/button'
import { Code2, Target, Flame, Clock, Plus, FileText, Trophy, BarChart3 } from 'lucide-react'
import { ProblemsPerDayChart } from '@/components/charts/ProblemsPerDayChart'
import { TopicsChart } from '@/components/charts/TopicsCharts'
import { StreakCalendar } from '@/components/charts/StreakCalender'
import { WeeklyInsights } from '@/components/charts/WeeklyInsights'
import toast from 'react-hot-toast'
import { KPICardSkeleton } from '@/components/ui/Skeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { SystemStatusWidget, MiniGoalWidget, QuickTipWidget } from '@/components/dashboard/MicroWidgets'
import { UnifiedRatingTimelineChart } from '@/components/charts/UnifiedRatingTimelineChart'

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

interface OverviewMetrics {
  totalSolved: number
  syncedSolved: number
  manualSolved: number
  activeDays: number
  averageProblemsPerDay: number
  strongestPlatform: string | null
  totalSessions: number
  totalTimeMinutes: number
  byDifficulty: {
    easy: number
    medium: number
    hard: number
  }
}

interface RatingPoint {
  platform: string
  date: string
  rating: number | null
  contestName?: string | null
}

interface PlatformComparison {
  platform: string
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  rating: number | null
  lastUpdatedAt: string
}

interface PerformanceTrends {
  weekly: { problemsSolved: number; timeSpentMinutes: number; sessions: number }
  monthly: { problemsSolved: number; timeSpentMinutes: number; sessions: number }
}

export default function DashboardPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [overview, setOverview] = useState<OverviewMetrics | null>(null)
  const [ratingTimeline, setRatingTimeline] = useState<RatingPoint[]>([])
  const [platformComparison, setPlatformComparison] = useState<PlatformComparison[]>([])
  const [trends, setTrends] = useState<PerformanceTrends | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const [sessionsRes, overviewRes, timelineRes, comparisonRes, trendsRes] = await Promise.all([
        fetch('/api/sessions'),
        fetch('/api/analytics/overview'),
        fetch('/api/analytics/rating-timeline'),
        fetch('/api/analytics/comparison'),
        fetch('/api/analytics/trends')
      ])

      const sessionsData = await sessionsRes.json()
      const overviewData = await overviewRes.json()
      const timelineData = await timelineRes.json()
      const comparisonData = await comparisonRes.json()
      const trendsData = await trendsRes.json()

      setSessions(sessionsData.sessions || [])
      setStats(sessionsData.stats || null)
      setOverview(overviewData.metrics || null)
      setRatingTimeline(timelineData.timeline || [])
      setPlatformComparison(comparisonData.comparison || [])
      setTrends(trendsData.trends || null)
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
        toast.success('Session added successfully! 🎉')
        setIsDrawerOpen(false)
        fetchSessions()
      } else {
        toast.error('Failed to add session. Please try again.')
      }
    } catch (error) {
      console.error('Error adding session:', error)
      toast.error('Something went wrong. Please try again.')
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
          className="flex flex-col xl:flex-row xl:items-end justify-between gap-6"
        >
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-outfit font-bold tracking-tight text-foreground">
                DASHBOARD
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-mono uppercase tracking-widest">
                {/* System Overview & Analytics */}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <SystemStatusWidget />
              <QuickTipWidget />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MiniGoalWidget current={overview?.totalSolved || stats?.totalProblems || 0} target={100} />
            <Button
              onClick={() => setIsDrawerOpen(true)}
              size="lg"
              className="gap-2 shadow-lg shadow-primary/10 rounded-xl"
            >
              <Plus size={18} />
              Add Session
            </Button>
          </div>
        </motion.div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              <KPICardSkeleton />
              <KPICardSkeleton />
              <KPICardSkeleton />
              <KPICardSkeleton />
            </>
          ) : (
            <>
              <KPICard
                title="Total Problems"
                value={overview?.totalSolved || stats?.totalProblems || 0}
                subtitle={`Synced ${overview?.syncedSolved || 0} + Manual ${overview?.manualSolved || 0}`}
                icon={<Code2 size={24} />}
              />
              <KPICard
                title="Total Sessions"
                value={overview?.totalSessions || stats?.totalSessions || 0}
                subtitle="Practice sessions"
                icon={<Target size={24} />}
              />
              <KPICard
                title="Current Streak"
                value={streak}
                subtitle="days"
                icon={<Flame size={24} />}
              />
              <KPICard
                title="Total Time"
                value={`${Math.floor((overview?.totalTimeMinutes || stats?.totalTime || 0) / 60)}h`}
                subtitle="Practice time"
                icon={<Clock size={24} />}
              />
            </>
          )}
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
                ) : (overview || stats) ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-green-500 text-sm font-medium">Easy</span>
                      <span className="text-white font-bold">{overview?.byDifficulty.easy || stats?.byDifficulty.easy || 0}</span>
                    </div>
                    <div className="w-full bg-[#242424] rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(((overview?.byDifficulty.easy || stats?.byDifficulty.easy || 0) / (overview?.totalSolved || stats?.totalProblems || 1)) * 100) || 0}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-yellow-500 text-sm font-medium">Medium</span>
                      <span className="text-white font-bold">{overview?.byDifficulty.medium || stats?.byDifficulty.medium || 0}</span>
                    </div>
                    <div className="w-full bg-[#242424] rounded-full h-3">
                      <div
                        className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(((overview?.byDifficulty.medium || stats?.byDifficulty.medium || 0) / (overview?.totalSolved || stats?.totalProblems || 1)) * 100) || 0}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-red-500 text-sm font-medium">Hard</span>
                      <span className="text-white font-bold">{overview?.byDifficulty.hard || stats?.byDifficulty.hard || 0}</span>
                    </div>
                    <div className="w-full bg-[#242424] rounded-full h-3">
                      <div
                        className="bg-red-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${(((overview?.byDifficulty.hard || stats?.byDifficulty.hard || 0) / (overview?.totalSolved || stats?.totalProblems || 1)) * 100) || 0}%` }}
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
            <Card title="RECENT SESSIONS" className="lg:col-span-2" collapsible>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-[#242424] rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : sessions.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No sessions yet"
                  description="Start tracking your coding practice by adding your first session"
                  action={{
                    label: 'Add Session',
                    onClick: () => setIsDrawerOpen(true)
                  }}
                />
              ) : (
                <div className="space-y-3">
                  {sessions.slice(0, 5).map(session => (
                    <div
                      key={session.id}
                      className="p-4 bg-[#242424] rounded-lg border border-[#2a2a2a] hover:border-[#3a3a3a] transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-white font-medium">{session.platform}</h4>
                          <p className="text-sm text-muted-foreground font-mono">
                            {new Date(session.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary font-bold font-mono">{session.problemsSolved}</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider">problems</p>
                        </div>
                      </div>
                      <div className="flex gap-3 text-xs font-mono">
                        <span className="text-green-500">E: {session.easy}</span>
                        <span className="text-yellow-500">M: {session.medium}</span>
                        <span className="text-red-500">H: {session.hard}</span>
                        <span className="text-muted-foreground ml-auto">{session.timeSpentMinutes}m</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card title="TOP TOPICS">
              <TopicsChart sessions={sessions} />
            </Card>
          </div>
        </div>



        {/* Unified Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="RATING TIMELINE" collapsible>
            <UnifiedRatingTimelineChart timeline={ratingTimeline} />
          </Card>
          <Card title="PLATFORM COMPARISON" collapsible>
            {platformComparison.length === 0 ? (
              <p className="text-muted-foreground text-sm">No platform snapshots yet. Connect profiles and run sync.</p>
            ) : (
              <div className="space-y-3">
                {platformComparison.map(item => (
                  <div key={item.platform} className="border border-border rounded-lg p-3 bg-accent/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy size={14} className="text-primary" />
                        <p className="font-mono text-xs tracking-wider">{item.platform}</p>
                      </div>
                      <p className="text-sm font-semibold">{item.totalSolved} solved</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>E:{item.easySolved} M:{item.mediumSolved} H:{item.hardSolved}</span>
                      <span>Rating: {item.rating ?? '-'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="ACTIVITY CALENDAR" collapsible>
            <StreakCalendar sessions={sessions} />
          </Card>

          <Card title="WEEKLY INSIGHTS" collapsible headerAction={<BarChart3 size={14} className="text-muted-foreground" />}>
            {trends ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Weekly Solved</span>
                  <span className="font-semibold">{trends.weekly.problemsSolved}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Weekly Sessions</span>
                  <span className="font-semibold">{trends.weekly.sessions}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Monthly Solved</span>
                  <span className="font-semibold">{trends.monthly.problemsSolved}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Strongest Platform</span>
                  <span className="font-semibold">{overview?.strongestPlatform || 'N/A'}</span>
                </div>
              </div>
            ) : (
              <WeeklyInsights sessions={sessions} />
            )}
          </Card>
        </div>

      </div >

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
    </DashboardLayout >
  )
}
