'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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

    // Validation
    const totalProblems = formData.easy + formData.medium + formData.hard

    if (totalProblems === 0) {
      alert('Please add at least one problem (easy, medium, or hard)')
      return
    }

    if (formData.timeSpentMinutes === 0) {
      alert('Please enter time spent (must be greater than 0)')
      return
    }

    if (formData.topics.length === 0) {
      alert('Please select at least one topic')
      return
    }

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
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="platform">Platform</Label>
          <select
            id="platform"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            required
            className="flex h-10 w-full rounded-lg border border-input bg-orange-600 px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all md:text-sm"
          >
            {PLATFORMS.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Difficulty Distribution */}
      <div className="space-y-3">
        <Label>Problems by Difficulty</Label>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="easy" className="text-green-500">Easy</Label>
            <Input
              id="easy"
              type="number"
              min="0"
              value={formData.easy}
              onChange={(e) => setFormData({ ...formData, easy: parseInt(e.target.value) || 0 })}
              className="focus-visible:ring-green-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="medium" className="text-yellow-500">Medium</Label>
            <Input
              id="medium"
              type="number"
              min="0"
              value={formData.medium}
              onChange={(e) => setFormData({ ...formData, medium: parseInt(e.target.value) || 0 })}
              className="focus-visible:ring-yellow-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hard" className="text-red-500">Hard</Label>
            <Input
              id="hard"
              type="number"
              min="0"
              value={formData.hard}
              onChange={(e) => setFormData({ ...formData, hard: parseInt(e.target.value) || 0 })}
              className="focus-visible:ring-red-500"
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Total: {formData.easy + formData.medium + formData.hard} problems
        </p>
      </div>

      {/* Time Spent */}
      <div className="space-y-2">
        <Label htmlFor="time">Time Spent (minutes)</Label>
        <Input
          id="time"
          type="number"
          min="0"
          value={formData.timeSpentMinutes}
          onChange={(e) => setFormData({ ...formData, timeSpentMinutes: parseInt(e.target.value) || 0 })}
        />
      </div>

      {/* Topics */}
      <div className="space-y-3">
        <Label>Topics Practiced</Label>
        <div className="flex flex-wrap gap-3">
          {COMMON_TOPICS.map(topic => (
            <motion.button
              key={topic}
              type="button"
              onClick={() => handleTopicToggle(topic)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                formData.topics.includes(topic)
                  ? "bg-orange-600 text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {topic}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={4}
          placeholder="Any thoughts, learnings, or observations..."
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-6">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Session' : 'Add Session'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}