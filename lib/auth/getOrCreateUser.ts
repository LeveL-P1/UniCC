import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function getOrCreateUser(clerkId: string) {
  let user = await prisma.user.findUnique({
    where: { clerkId }
  })

  if (user) return user

  const clerkUser = await currentUser()
  if (!clerkUser) {
    throw new Error('Authenticated user missing in Clerk context')
  }

  user = await prisma.user.create({
    data: {
      clerkId,
      email: clerkUser.emailAddresses[0]?.emailAddress || `${clerkId}@unknown.local`,
      name: clerkUser.firstName || null
    }
  })

  return user
}
