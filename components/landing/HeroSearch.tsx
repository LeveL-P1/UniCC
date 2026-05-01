'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ArrowRight, Sparkles } from 'lucide-react'

const ROTATING_WORDS = [
  'LeetCode',
  'Codeforces',
  'CodeChef',
  'AtCoder',
  'HackerRank',
]

const EXAMPLE_HANDLES = [
  'tourist',
  'Benq',
  'jiangly',
  'ecnerwala',
  'Um_nik',
]

export function HeroSearch() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Rotate through platform names
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleExampleClick = (handle: string) => {
    router.push(`/u/${handle}`)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch}>
        <motion.div
          initial={false}
          animate={{
            scale: isFocused ? 1.02 : 1,
            boxShadow: isFocused
              ? '0 0 0 2px rgba(255, 107, 53, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              : '0 10px 40px -10px rgba(0, 0, 0, 0.3)',
          }}
          transition={{ duration: 0.2 }}
          className="relative bg-card border border-border rounded-2xl overflow-hidden"
        >
          <div className="flex items-center">
            <div className="pl-5">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search username or handle..."
              className="flex-1 px-4 py-5 bg-transparent text-foreground text-lg placeholder:text-muted-foreground focus:outline-none"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="m-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <span className="hidden sm:inline">Search</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </form>

      {/* Rotating Platform Text */}
      <div className="mt-6 flex items-center justify-center gap-2 text-muted-foreground">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm">View stats from</span>
        <div className="relative h-6 w-24 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={currentWordIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 text-sm font-semibold text-primary"
            >
              {ROTATING_WORDS[currentWordIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="text-sm">and more</span>
      </div>

      {/* Example Handles */}
      <div className="mt-8">
        <p className="text-center text-sm text-muted-foreground mb-3">
          Try these legendary coders:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {EXAMPLE_HANDLES.map((handle) => (
            <motion.button
              key={handle}
              onClick={() => handleExampleClick(handle)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-card border border-border rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              @{handle}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
