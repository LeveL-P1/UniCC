-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('IDLE', 'SYNCING', 'SUCCESS', 'ERROR');

-- CreateEnum
CREATE TYPE "SyncSource" AS ENUM ('MANUAL', 'SCHEDULED');

-- AlterTable
ALTER TABLE "PlatformProfile" ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "lastErrorCode" TEXT,
ADD COLUMN     "lastSuccessAt" TIMESTAMP(3),
ADD COLUMN     "lastSyncStartedAt" TIMESTAMP(3),
ADD COLUMN     "profileUrl" TEXT,
ADD COLUMN     "rawSnapshot" JSONB,
ADD COLUMN     "syncStatus" "SyncStatus" NOT NULL DEFAULT 'IDLE';

-- CreateTable
CREATE TABLE "SyncJobLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platformProfileId" TEXT,
    "platform" "Platform",
    "source" "SyncSource" NOT NULL DEFAULT 'MANUAL',
    "status" "SyncStatus" NOT NULL,
    "message" TEXT,
    "errorCode" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "durationMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncJobLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformRatingHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platformProfileId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "eventAt" TIMESTAMP(3) NOT NULL,
    "rating" INTEGER,
    "rank" TEXT,
    "contestName" TEXT,
    "delta" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformRatingHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformSolvedSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platformProfileId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL,
    "totalSolved" INTEGER NOT NULL DEFAULT 0,
    "easySolved" INTEGER,
    "mediumSolved" INTEGER,
    "hardSolved" INTEGER,
    "byTag" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformSolvedSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformContestHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platformProfileId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "contestId" TEXT,
    "contestName" TEXT NOT NULL,
    "contestDate" TIMESTAMP(3) NOT NULL,
    "rank" INTEGER,
    "ratingBefore" INTEGER,
    "ratingAfter" INTEGER,
    "ratingDelta" INTEGER,
    "problemsSolved" INTEGER,
    "score" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlatformContestHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnifiedMetricSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL,
    "totalSolved" INTEGER NOT NULL DEFAULT 0,
    "easySolved" INTEGER NOT NULL DEFAULT 0,
    "mediumSolved" INTEGER NOT NULL DEFAULT 0,
    "hardSolved" INTEGER NOT NULL DEFAULT 0,
    "strongestPlatform" "Platform",
    "averageRating" DOUBLE PRECISION,
    "platformBreakdown" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UnifiedMetricSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalProfile" (
    "id" TEXT NOT NULL,
    "primaryHandle" TEXT NOT NULL,
    "displayName" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "lastRefreshedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalPlatformSnapshot" (
    "id" TEXT NOT NULL,
    "externalProfileId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "handle" TEXT NOT NULL,
    "profileUrl" TEXT,
    "capturedAt" TIMESTAMP(3) NOT NULL,
    "totalSolved" INTEGER NOT NULL DEFAULT 0,
    "easySolved" INTEGER,
    "mediumSolved" INTEGER,
    "hardSolved" INTEGER,
    "rating" INTEGER,
    "rank" TEXT,
    "ratings" JSONB,
    "contests" JSONB,
    "rawSnapshot" JSONB,
    "lastError" TEXT,
    "lastErrorCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExternalPlatformSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SyncJobLog_userId_createdAt_idx" ON "SyncJobLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "SyncJobLog_status_createdAt_idx" ON "SyncJobLog"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PlatformRatingHistory_userId_platform_eventAt_idx" ON "PlatformRatingHistory"("userId", "platform", "eventAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformRatingHistory_platformProfileId_eventAt_contestName_key" ON "PlatformRatingHistory"("platformProfileId", "eventAt", "contestName");

-- CreateIndex
CREATE INDEX "PlatformSolvedSnapshot_userId_platform_capturedAt_idx" ON "PlatformSolvedSnapshot"("userId", "platform", "capturedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformSolvedSnapshot_platformProfileId_capturedAt_key" ON "PlatformSolvedSnapshot"("platformProfileId", "capturedAt");

-- CreateIndex
CREATE INDEX "PlatformContestHistory_userId_platform_contestDate_idx" ON "PlatformContestHistory"("userId", "platform", "contestDate");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformContestHistory_platformProfileId_contestDate_contes_key" ON "PlatformContestHistory"("platformProfileId", "contestDate", "contestName");

-- CreateIndex
CREATE INDEX "UnifiedMetricSnapshot_userId_capturedAt_idx" ON "UnifiedMetricSnapshot"("userId", "capturedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UnifiedMetricSnapshot_userId_capturedAt_key" ON "UnifiedMetricSnapshot"("userId", "capturedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalProfile_primaryHandle_key" ON "ExternalProfile"("primaryHandle");

-- CreateIndex
CREATE INDEX "ExternalPlatformSnapshot_platform_handle_idx" ON "ExternalPlatformSnapshot"("platform", "handle");

-- CreateIndex
CREATE INDEX "ExternalPlatformSnapshot_externalProfileId_idx" ON "ExternalPlatformSnapshot"("externalProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalPlatformSnapshot_externalProfileId_platform_key" ON "ExternalPlatformSnapshot"("externalProfileId", "platform");

-- AddForeignKey
ALTER TABLE "SyncJobLog" ADD CONSTRAINT "SyncJobLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SyncJobLog" ADD CONSTRAINT "SyncJobLog_platformProfileId_fkey" FOREIGN KEY ("platformProfileId") REFERENCES "PlatformProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformRatingHistory" ADD CONSTRAINT "PlatformRatingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformRatingHistory" ADD CONSTRAINT "PlatformRatingHistory_platformProfileId_fkey" FOREIGN KEY ("platformProfileId") REFERENCES "PlatformProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformSolvedSnapshot" ADD CONSTRAINT "PlatformSolvedSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformSolvedSnapshot" ADD CONSTRAINT "PlatformSolvedSnapshot_platformProfileId_fkey" FOREIGN KEY ("platformProfileId") REFERENCES "PlatformProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformContestHistory" ADD CONSTRAINT "PlatformContestHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlatformContestHistory" ADD CONSTRAINT "PlatformContestHistory_platformProfileId_fkey" FOREIGN KEY ("platformProfileId") REFERENCES "PlatformProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnifiedMetricSnapshot" ADD CONSTRAINT "UnifiedMetricSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalPlatformSnapshot" ADD CONSTRAINT "ExternalPlatformSnapshot_externalProfileId_fkey" FOREIGN KEY ("externalProfileId") REFERENCES "ExternalProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
