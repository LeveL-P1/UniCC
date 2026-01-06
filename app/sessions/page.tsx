'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Drawer } from '@/components/ui/Drawer'
import { SessionForm, SessionFormData } from '@/components/sessions/SessionsForm'
import { Plus, Edit2, Trash2, Filter } from 'lucide-react'

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
  notes: string | null
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<Session | null>(null)
  const [filterPlatform, setFilterPlatform] = useState<string>('ALL')

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions')
      const data = await res.json()
      setSessions(data.sessions || [])
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

  const handleEditSession = async (formData: SessionFormData) => {
    if (!editingSession) return

    try {
      const res = await fetch(`/api/sessions/${editingSession.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          problemsSolved: formData.easy + formData.medium + formData.hard
        })
      })

      if (res.ok) {
        setIsDrawerOpen(false)
        setEditingSession(null)
        fetchSessions()
      }
    } catch (error) {
      console.error('Error updating session:', error)
    }
  }

  const handleDeleteSession = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return

    try {
      const res = await fetch(`/api/sessions/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchSessions()
      }
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  const openEditDrawer = (session: Session) => {
    setEditingSession(session)
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
    setEditingSession(null)
  }

  const filteredSessions = filterPlatform === 'ALL' 
    ? sessions 
    : sessions.filter(s => s.platform === filterPlatform)

  const platforms = ['ALL', ...Array.from(new Set(sessions.map(s => s.platform)))]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-outfit font-bold text-white">All Sessions</h1>
            <p className="text-sm text-[#a0a0a0] mt-1">Manage your coding practice sessions</p>
          </div>
          <button
            onClick={() => {
              setEditingSession(null)
              setIsDrawerOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#ff6b35] hover:bg-[#e55a28] text-white font-medium rounded-lg transition-colors"
          >
            <Plus size={18} />
            Add Session
          </button>
        </div>

        {/* Filter Bar */}
        <Card>
          <div className="flex items-center gap-4">
            <Filter size={18} className="text-[#a0a0a0]" />
            <div className="flex gap-2 flex-wrap">
              {platforms.map(platform => (
                <button
                  key={platform}
                  onClick={() => setFilterPlatform(platform)}
                  className={`
                    px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                    ${filterPlatform === platform
                      ? 'bg-[#ff6b35] text-white'
                      : 'bg-[#242424] text-[#a0a0a0] hover:bg-[#2a2a2a]'
                    }
                  `}
                >
                  {platform}
                </button>
              ))}
            </div>
            <span className="ml-auto text-sm text-[#a0a0a0]">
              {filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}
            </span>
          </div>
        </Card>

        {/* Sessions Table */}
        <Card>
          {loading ? (
            <p className="text-center text-[#a0a0a0] py-12">Loading sessions...</p>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#a0a0a0] mb-4">No sessions found</p>
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="text-[#ff6b35] hover:text-[#e55a28] font-medium"
              >
                Add your first session
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#2a2a2a]">
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#a0a0a0] uppercase tracking-wider">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-[#a0a0a0] uppercase tracking-wider">Platform</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-[#a0a0a0] uppercase tracking-wider">Problems</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-[#a0a0a0] uppercase tracking-wider">Easy</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-[#a0a0a0] uppercase tracking-wider">Medium</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-[#a0a0a0] uppercase tracking-wider">Hard</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-[#a0a0a0] uppercase tracking-wider">Time</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-[#a0a0a0] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session, index) => (
                    <tr 
                      key={session.id}
                      className={`border-b border-[#2a2a2a] hover:bg-[#242424] transition-colors ${
                        index === filteredSessions.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="py-4 px-4 text-white">
                        {new Date(session.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#242424] text-xs font-medium text-white">
                          {session.platform}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-[#ff6b35] font-bold">{session.problemsSolved}</span>
                      </td>
                      <td className="py-4 px-4 text-center text-green-500 font-medium">{session.easy}</td>
                      <td className="py-4 px-4 text-center text-yellow-500 font-medium">{session.medium}</td>
                      <td className="py-4 px-4 text-center text-red-500 font-medium">{session.hard}</td>
                      <td className="py-4 px-4 text-center text-[#a0a0a0]">{session.timeSpentMinutes}m</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditDrawer(session)}
                            className="p-2 rounded-lg hover:bg-[#2a2a2a] text-[#a0a0a0] hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-[#a0a0a0] hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </div>

      {/* Add/Edit Session Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={editingSession ? 'Edit Session' : 'Add Coding Session'}
      >
        <SessionForm
          onSubmit={editingSession ? handleEditSession : handleAddSession}
          onCancel={closeDrawer}
          initialData={editingSession ? {
            date: editingSession.date.split('T')[0],
            platform: editingSession.platform,
            problemsSolved: editingSession.problemsSolved,
            easy: editingSession.easy,
            medium: editingSession.medium,
            hard: editingSession.hard,
            timeSpentMinutes: editingSession.timeSpentMinutes,
            topics: editingSession.topics,
            notes: editingSession.notes || ''
          } : undefined}
          isEdit={!!editingSession}
        />
      </Drawer>
    </DashboardLayout>
  )
}