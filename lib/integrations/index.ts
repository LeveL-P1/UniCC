import { Platform } from '@prisma/client'
import { PlatformAdapter } from '@/lib/integrations/base'
import { AtCoderAdapter } from '@/lib/integrations/atcoder'
import { CodeChefAdapter } from '@/lib/integrations/codechef'
import { CodeforcesAdapter } from '@/lib/integrations/codeforces'
import { LeetCodeAdapter } from '@/lib/integrations/leetcode'

const adapters: Record<Platform, PlatformAdapter | undefined> = {
  LEETCODE: new LeetCodeAdapter(),
  CODEFORCES: new CodeforcesAdapter(),
  CODECHEF: new CodeChefAdapter(),
  ATCODER: new AtCoderAdapter(),
  GEEKSFORGEEKS: undefined,
  HACKERRANK: undefined,
  OTHER: undefined
}

export function getAdapter(platform: Platform): PlatformAdapter {
  const adapter = adapters[platform]
  if (!adapter) {
    throw new Error(`No adapter configured for platform ${platform}`)
  }
  return adapter
}
