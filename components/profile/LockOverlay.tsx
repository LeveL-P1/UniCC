'use client'

import { Lock } from 'lucide-react'
import { SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

interface LockOverlayProps {
  message?: string
}

export function LockOverlay({ message = 'Sign in to view' }: LockOverlayProps) {
  return (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-10 rounded-2xl flex items-center justify-center">
      <div className="text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-4">{message}</p>
        <SignInButton mode="modal">
          <Button size="sm" className="rounded-full">
            Sign in to unlock
          </Button>
        </SignInButton>
      </div>
    </div>
  )
}
