import { currentUser } from '@clerk/nextjs/server'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export async function getOrCreateUser(clerkId: string) {
  const existing = await prisma.user.findUnique({
    where: { clerkId }
  })

  if (existing) return existing

  const clerkUser = await currentUser()
  if (!clerkUser) {
    throw new Error('Authenticated user missing in Clerk context')
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress || `${clerkId}@unknown.local`
  const name = clerkUser.fullName || clerkUser.firstName || null

  try {
    return await prisma.user.create({
      data: {
        clerkId,
        email,
        name
      }
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return prisma.user.findUniqueOrThrow({ where: { clerkId } })
    }
    throw error
  }
}
