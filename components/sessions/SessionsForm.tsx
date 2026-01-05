'use client'

import { useState } from 'react'

interface SessionFormProps {
  onSubmit: (data: SessionFormData) => Promise<void>
  onCancel: () => void
  initialData?: SessionFormData
  isEdit?: boolean
}

export interface SessionFormData {
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

const PLATFORMS = [
  'LEETCODE',
  'CODEFORCES',
  'CODECHEF',
  'GEEKSFORGEEKS',
  'HACKERRANK',
  'ATCODER',
  'OTHER'
]

const COMMON_TOPICS = [
  'array', 'string', 'hash-table', 'dynamic-programming',
  'math', 'sorting', 'greedy', 'depth-first-search',
  'binary-search', 'breadth-first-search', 'tree', 'matrix',
  'two-pointers', 'binary-tree', 'heap', 'stack',
  'graph', 'sliding-window', 'backtracking', 'linked-list'
]

export function SessionForm({ onSubmit, onCancel, initialData, isEdit = false }: SessionFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<SessionFormData>(
    initialData || {
      date: new Date().toISOString().split('T')[0],
      platform: 'LEETCODE',
      problemsSolved: 0,
      easy: 0,
      medium: 0,
      hard: 0,
      timeSpentMinutes: 0,
      topics: [],
      notes: ''
    }
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleTopicToggle = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Date & Platform */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            className="w-full px-4 py-2.5 bg-[#242424] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
            Platform
          </label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            required
            className="w-full px-4 py-2.5 bg-[#242424] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition-colors"
          >
            {PLATFORMS.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Difficulty Distribution */}
      <div>
        <label className="block text-sm font-medium text-[#a0a0a0] mb-3">
          Problems by Difficulty
        </label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-green-500 mb-1">Easy</label>
            <input
              type="number"
              min="0"
              value={formData.easy}
              onChange={(e) => setFormData({ ...formData, easy: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-[#242424] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-yellow-500 mb-1">Medium</label>
            <input
              type="number"
              min="0"
              value={formData.medium}
              onChange={(e) => setFormData({ ...formData, medium: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-[#242424] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-red-500 mb-1">Hard</label>
            <input
              type="number"
              min="0"
              value={formData.hard}
              onChange={(e) => setFormData({ ...formData, hard: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-[#242424] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>
        </div>
        <p className="text-xs text-[#a0a0a0] mt-2">
          Total: {formData.easy + formData.medium + formData.hard} problems
        </p>
      </div>

      {/* Time Spent */}
      <div>
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
          Time Spent (minutes)
        </label>
        <input
          type="number"
          min="0"
          value={formData.timeSpentMinutes}
          onChange={(e) => setFormData({ ...formData, timeSpentMinutes: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2.5 bg-[#242424] border border-[#2a2a2a] rounded-lg text-white focus:outline-none focus:border-[#ff6b35] transition-colors"
        />
      </div>

      {/* Topics */}
      <div>
        <label className="block text-sm font-medium text-[#a0a0a0] mb-3">
          Topics Practiced
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_TOPICS.map(topic => (
            <button
              key={topic}
              type="button"
              onClick={() => handleTopicToggle(topic)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${formData.topics.includes(topic)
                  ? 'bg-[#ff6b35] text-white'
                  : 'bg-[#242424] text-[#a0a0a0] hover:bg-[#2a2a2a]'
                }
              `}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-[#a0a0a0] mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          placeholder="Any thoughts, learnings, or observations..."
          className="w-full px-4 py-2.5 bg-[#242424] border border-[#2a2a2a] rounded-lg text-white placeholder-[#5a5a5a] focus:outline-none focus:border-[#ff6b35] transition-colors resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-[#ff6b35] hover:bg-[#e55a28] text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Session' : 'Add Session'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 bg-[#242424] hover:bg-[#2a2a2a] text-white font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}