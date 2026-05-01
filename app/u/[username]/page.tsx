'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { Footer } from '@/components/layout/Footer'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { PlatformCard } from '@/components/profile/PlatformCard'
import { StatsOverview } from '@/components/profile/StatsOverview'
import { ActivityHeatmap } from '@/components/profile/ActivityHeatmap'
import { RatingChart } from '@/components/profile/RatingChart'
import { LockOverlay } from '@/components/profile/LockOverlay'
import { ProfileNotFound } from '@/components/profile/ProfileNotFound'
import { ProfileSkeleton } from '@/components/profile/ProfileSkeleton'

// Mock data for demonstration - in production this would come from API
const MOCK_PROFILE = {
  username: 'tourist',
  displayName: 'Gennady Korotkevich',
  bio: 'Competitive programmer from Belarus. 8x World Champion.',
  avatarUrl: null,
  isVerified: true,
  socialLinks: {
    twitter: 'tourist',
    github: 'tourist',
  },
  platforms: [
    {
      platform: 'Codeforces',
      handle: 'tourist',
      rating: 3979,
      maxRating: 3979,
      rank: 'Legendary Grandmaster',
      problemsSolved: 1847,
      contests: 156,
      lastUpdated: '2024-01-15',
    },
    {
      platform: 'LeetCode',
      handle: 'tourist',
      rating: 3200,
      problemsSolved: 892,
      easy: 120,
      medium: 450,
      hard: 322,
      contests: 45,
      lastUpdated: '2024-01-14',
    },
    {
      platform: 'AtCoder',
      handle: 'tourist',
      rating: 4229,
      maxRating: 4229,
      rank: 'Red',
      problemsSolved: 1230,
      contests: 89,
      lastUpdated: '2024-01-13',
    },
    {
      platform: 'CodeChef',
      handle: 'tourist',
      rating: 3500,
      rank: '7 Star',
      problemsSolved: 567,
      contests: 34,
      lastUpdated: '2024-01-10',
    },
  ],
  stats: {
    totalProblems: 4536,
    totalContests: 324,
    highestRating: 4229,
    activeDays: 2847,
  },
  activityData: generateMockActivityData(),
  ratingHistory: generateMockRatingHistory(),
}

function generateMockActivityData() {
  const data = []
  const today = new Date()
  for (let i = 365; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      count: Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 1 : 0,
    })
  }
  return data
}

function generateMockRatingHistory() {
  const data = []
  const platforms = ['Codeforces', 'LeetCode', 'AtCoder']
  const today = new Date()
  
  platforms.forEach(platform => {
    let rating = 1500 + Math.random() * 500
    for (let i = 24; i >= 0; i--) {
      const date = new Date(today)
      date.setMonth(date.getMonth() - i)
      rating += (Math.random() - 0.3) * 100
      rating = Math.max(800, Math.min(4000, rating))
      data.push({
        platform,
        date: date.toISOString().split('T')[0],
        rating: Math.round(rating),
      })
    }
  })
  return data
}

export default function PublicProfilePage() {
  const params = useParams()
  const username = params.username as string
  const { isSignedIn, isLoaded } = useUser()
  
  const [profile, setProfile] = useState<typeof MOCK_PROFILE | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    // Simulate API call
    const fetchProfile = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo, show profile for any username
      if (username) {
        setProfile({
          ...MOCK_PROFILE,
          username,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
        })
        setNotFound(false)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [username])

  const canViewFullStats = isSignedIn

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader showSearch={false} />
        <ProfileSkeleton />
        <Footer />
      </div>
    )
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader showSearch={false} />
        <ProfileNotFound username={username} />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader showSearch={false} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProfileHeader profile={profile} />
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Stats Overview - Large Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2 lg:col-span-1 lg:row-span-2"
          >
            <StatsOverview stats={profile.stats} isLocked={!canViewFullStats} />
          </motion.div>

          {/* Platform Cards */}
          {profile.platforms.map((platform, index) => (
            <motion.div
              key={platform.platform}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + (index + 1) * 0.05 }}
            >
              <PlatformCard 
                platform={platform} 
                isLocked={!canViewFullStats && index >= 2} 
              />
            </motion.div>
          ))}

          {/* Activity Heatmap - Wide Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 lg:col-span-2 relative"
          >
            <ActivityHeatmap data={profile.activityData} />
            {!canViewFullStats && <LockOverlay message="Sign in to view activity" />}
          </motion.div>

          {/* Rating Chart - Wide Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="md:col-span-2 lg:col-span-3 relative"
          >
            <RatingChart data={profile.ratingHistory} />
            {!canViewFullStats && <LockOverlay message="Sign in to view rating history" />}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
