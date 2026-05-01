'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Users, ArrowRight, UserPlus } from 'lucide-react'
import { SignUpButton, SignedOut } from '@clerk/nextjs'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'

// Mock search results
const MOCK_RESULTS = [
  {
    username: 'tourist',
    displayName: 'Gennady Korotkevich',
    platforms: ['Codeforces', 'AtCoder', 'LeetCode'],
    topRating: 3979,
    totalProblems: 4536,
    isVerified: true,
  },
  {
    username: 'tourist123',
    displayName: 'Tourist Fan',
    platforms: ['LeetCode', 'Codeforces'],
    topRating: 1850,
    totalProblems: 234,
    isVerified: false,
  },
  {
    username: 'tourister',
    displayName: 'Competitive Coder',
    platforms: ['CodeChef', 'LeetCode'],
    topRating: 2100,
    totalProblems: 567,
    isVerified: false,
  },
]

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(query)
  const [results, setResults] = useState<typeof MOCK_RESULTS>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSearchQuery(query)
    
    // Simulate search
    const search = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      if (query.trim()) {
        // Filter mock results that match the query
        const filtered = MOCK_RESULTS.filter(
          r => r.username.toLowerCase().includes(query.toLowerCase()) ||
               r.displayName.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered)
      } else {
        setResults([])
      }
      setLoading(false)
    }

    search()
  }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search username or handle..."
            className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </form>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold text-foreground">
            {loading ? (
              'Searching...'
            ) : results.length > 0 ? (
              `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
            ) : query ? (
              `No results for "${query}"`
            ) : (
              'Enter a search term'
            )}
          </h1>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {results.map((result, index) => (
            <motion.div
              key={result.username}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/u/${result.username}`}>
                <div className="rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all group">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">
                        {result.displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-foreground truncate">
                          {result.displayName}
                        </h2>
                        {result.isVerified && (
                          <span className="px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">@{result.username}</p>
                    </div>

                    {/* Stats */}
                    <div className="hidden sm:flex items-center gap-6 text-sm">
                      <div className="text-right">
                        <p className="text-muted-foreground">Rating</p>
                        <p className="font-mono font-semibold text-foreground">{result.topRating}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Solved</p>
                        <p className="font-mono font-semibold text-foreground">{result.totalProblems}</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  {/* Platforms */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-2 py-1 text-xs bg-muted rounded-full text-muted-foreground"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* No Results */}
      {!loading && results.length === 0 && query && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            No profiles found
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            We couldn&apos;t find any profiles matching &quot;{query}&quot;. 
            Try a different search term or create this profile.
          </p>
          <SignedOut>
            <SignUpButton mode="modal">
              <Button className="gap-2">
                <UserPlus className="w-4 h-4" />
                Create &quot;{query}&quot; Profile
              </Button>
            </SignUpButton>
          </SignedOut>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !query && (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Search for profiles
          </h2>
          <p className="text-muted-foreground">
            Enter a username or handle to find competitive programmers
          </p>
        </div>
      )}
    </main>
  )
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader showSearch={false} />
      <Suspense fallback={
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="h-14 bg-card border border-border rounded-xl animate-pulse" />
        </div>
      }>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  )
}
