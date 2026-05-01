'use client'

import { motion } from 'framer-motion'
import { BadgeCheck, Twitter, Github, ExternalLink, Share2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

interface ProfileHeaderProps {
  profile: {
    username: string
    displayName: string
    bio?: string
    avatarUrl?: string | null
    isVerified?: boolean
    socialLinks?: {
      twitter?: string
      github?: string
      website?: string
    }
  }
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const handleShare = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName} - UniCC Profile`,
          url,
        })
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Profile link copied!')
    }
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      
      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl md:text-5xl font-bold text-primary">
                {profile.displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {profile.isVerified && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <BadgeCheck className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </motion.div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {profile.displayName}
            </h1>
            {profile.isVerified && (
              <BadgeCheck className="w-6 h-6 text-primary" />
            )}
          </div>
          <p className="text-muted-foreground mb-3">@{profile.username}</p>
          
          {profile.bio && (
            <p className="text-foreground/80 mb-4 max-w-2xl">
              {profile.bio}
            </p>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {profile.socialLinks?.twitter && (
              <a
                href={`https://twitter.com/${profile.socialLinks.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <Twitter className="w-4 h-4 text-muted-foreground" />
              </a>
            )}
            {profile.socialLinks?.github && (
              <a
                href={`https://github.com/${profile.socialLinks.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <Github className="w-4 h-4 text-muted-foreground" />
              </a>
            )}
            {profile.socialLinks?.website && (
              <a
                href={profile.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            <span className="hidden sm:inline">Copy Link</span>
          </Button>
          <Button
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
