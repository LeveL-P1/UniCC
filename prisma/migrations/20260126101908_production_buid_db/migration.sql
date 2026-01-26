-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('LEETCODE', 'CODEFORCES', 'CODECHEF', 'GEEKSFORGEEKS', 'HACKERRANK', 'ATCODER', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodingSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "platform" "Platform" NOT NULL,
    "problemsSolved" INTEGER NOT NULL DEFAULT 0,
    "easy" INTEGER NOT NULL DEFAULT 0,
    "medium" INTEGER NOT NULL DEFAULT 0,
    "hard" INTEGER NOT NULL DEFAULT 0,
    "timeSpentMinutes" INTEGER NOT NULL DEFAULT 0,
    "topics" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "handle" TEXT NOT NULL,
    "lastSyncedAt" TIMESTAMP(3),
    "rawStatsJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CodingSession_userId_idx" ON "CodingSession"("userId");

-- CreateIndex
CREATE INDEX "CodingSession_date_idx" ON "CodingSession"("date");

-- CreateIndex
CREATE INDEX "PlatformProfile_userId_idx" ON "PlatformProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformProfile_userId_platform_key" ON "PlatformProfile"("userId", "platform");

-- AddForeignKey
ALTER TABLE "CodingSession" ADD CONSTRAINT "CodingSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformProfile" ADD CONSTRAINT "PlatformProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
