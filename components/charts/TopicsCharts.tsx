'use client'

interface Session {
    topics: string[]
}

interface TopicsChartProps {
    sessions: Session[]
}

export function TopicsChart({ sessions }: TopicsChartProps) {
    // Count topic frequency
    const getTopTopics = () => {
        const topicCount: Record<string, number> = {}

        sessions.forEach(session => {
            session.topics.forEach(topic => {
                topicCount[topic] = (topicCount[topic] || 0) + 1
            })
        })

        // Sort and get top 10
        return Object.entries(topicCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([topic, count]) => ({ topic, count }))
    }

    const topTopics = getTopTopics()

    if (topTopics.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-[#a0a0a0]">
                <p>No topics data yet</p>
            </div>
        )
    }

    const maxCount = Math.max(...topTopics.map(t => t.count))

    return (
        <div className="space-y-3">
            {topTopics.map(({ topic, count }) => (
                <div key={topic}>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white font-medium capitalize">
                            {topic.replace(/-/g, ' ')}
                        </span>
                        <span className="text-sm text-[#ff6b35] font-bold">{count}</span>
                    </div>
                    <div className="w-full bg-[#242424] rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-[#ff6b35] to-[#e55a28] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(count / maxCount) * 100}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}