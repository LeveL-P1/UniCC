/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'

export default function TestPage() {
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testCreateSession = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: '2025-01-02',
          platform: 'LEETCODE',
          problemsSolved: 5,
          easy: 2,
          medium: 3,
          hard: 0,
          timeSpentMinutes: 90,
          topics: ['array', 'two-pointers', 'hash-table'],
          notes: 'Practiced array problems, feeling good!',
        }),
      })

      const data = await res.json()
      setResponse({ status: res.status, data })
    } catch (error) {
      setResponse({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  const testGetSessions = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/sessions')
      const data = await res.json()
      setResponse({ status: res.status, data })
    } catch (error) {
      setResponse({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
        
        <div className="space-x-4">
          <button
            onClick={testCreateSession}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Create Session'}
          </button>

          <button
            onClick={testGetSessions}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Get Sessions'}
          </button>
        </div>

        {response && (
          <div className="mt-6">
            <h2 className="font-semibold mb-2">Response:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}