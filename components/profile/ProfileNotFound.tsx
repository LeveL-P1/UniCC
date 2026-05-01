'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserX, Search, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProfileNotFoundProps {
  username: string
}

export function ProfileNotFound({ username }: ProfileNotFoundProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-24 h-24 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
          <UserX className="w-12 h-12 text-muted-foreground" />
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Profile not found
        </h1>
        <p className="text-muted-foreground mb-8">
          We couldn&apos;t find a profile with the username <span className="font-mono text-foreground">@{username}</span>.
          It may not exist yet or the username might be incorrect.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link href={`/search?q=${username}`}>
            <Button className="gap-2">
              <Search className="w-4 h-4" />
              Search for &quot;{username}&quot;
            </Button>
          </Link>
        </div>

        <p className="mt-12 text-sm text-muted-foreground">
          Want to claim this username?{' '}
          <Link href="/sign-up" className="text-primary hover:underline">
            Create your profile
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
