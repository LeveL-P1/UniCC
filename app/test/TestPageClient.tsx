/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function TestPageClient() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const testCreateSession = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: "2025-01-02",
          platform: "LEETCODE",
          problemsSolved: 5,
          easy: 2,
          medium: 3,
          hard: 0,
          timeSpentMinutes: 90,
          topics: ["array", "two-pointers"],
          notes: "Test session",
        }),
      });
      const data = await res.json();
      setResponse({ status: res.status, data });
      if (data.id) setSessionId(data.id);
    } catch (error) {
      setResponse({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testGetSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sessions");
      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (error) {
      setResponse({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testUpdateSession = async () => {
    if (!sessionId) {
      alert("Create a session first or paste a session ID");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemsSolved: 10,
          notes: "Updated: Solved more problems!",
        }),
      });
      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (error) {
      setResponse({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const testDeleteSession = async () => {
    if (!sessionId) {
      alert("Create a session first or paste a session ID");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      setResponse({ status: res.status, data });
      setSessionId("");
    } catch (error) {
      setResponse({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Session ID (auto-filled after create):
          </label>
          <input
            type="text"
            value={sessionId}
            onChange={(event) => setSessionId(event.target.value)}
            placeholder="Paste session ID here"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={testCreateSession}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Create Session
          </button>

          <button
            onClick={testGetSessions}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Get Sessions
          </button>

          <button
            onClick={testUpdateSession}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
          >
            Update Session
          </button>

          <button
            onClick={testDeleteSession}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Delete Session
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
  );
}
