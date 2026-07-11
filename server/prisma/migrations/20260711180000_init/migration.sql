-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE');
CREATE TYPE "MoneyType" AS ENUM ('INCOME', 'EXPENSE');
CREATE TYPE "PlannedStatus" AS ENUM ('PLANNED', 'PAID', 'SKIPPED');
CREATE TYPE "PlannedStage" AS ENUM ('REQUIRED', 'RESERVE', 'FLEXIBLE');
CREATE TYPE "AccountType" AS ENUM ('CASH', 'CARD', 'SAVINGS', 'DEBT');
CREATE TYPE "CategoryKind" AS ENUM ('INCOME', 'EXPENSE', 'TASK');
CREATE TYPE "DocumentStatus" AS ENUM ('MISSING', 'PREPARING', 'READY', 'EXPIRED');
CREATE TYPE "DocumentCategory" AS ENUM ('TRAVEL', 'STUDY', 'HOUSING', 'HEALTH', 'FINANCE');

CREATE TABLE "User" (
  "id" TEXT NOT NULL, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL, "name" TEXT NOT NULL,
  "destination" TEXT NOT NULL DEFAULT 'Chengdu, China', "program" TEXT NOT NULL DEFAULT '', "startDate" TIMESTAMP(3),
  "currencyRate" DECIMAL(10,4) NOT NULL DEFAULT 11.20, "themeName" TEXT NOT NULL DEFAULT 'dark',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Session" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "refreshTokenHash" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Account" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "title" TEXT NOT NULL, "type" "AccountType" NOT NULL, "currency" TEXT NOT NULL,
  "balance" DECIMAL(14,2) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Category" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "title" TEXT NOT NULL, "kind" "CategoryKind" NOT NULL, "color" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Task" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "title" TEXT NOT NULL, "due" TIMESTAMP(3), "time" TEXT, "tag" TEXT NOT NULL,
  "description" TEXT, "priority" TEXT, "status" "TaskStatus" NOT NULL DEFAULT 'TODO',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Transaction" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "title" TEXT NOT NULL, "amount" DECIMAL(14,2) NOT NULL,
  "type" "MoneyType" NOT NULL, "category" TEXT NOT NULL, "date" TIMESTAMP(3) NOT NULL, "accountId" TEXT, "note" TEXT,
  "plannedItemId" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "PlannedItem" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "title" TEXT NOT NULL, "type" "MoneyType" NOT NULL,
  "amountMin" DECIMAL(14,2) NOT NULL, "amountMax" DECIMAL(14,2) NOT NULL, "due" TIMESTAMP(3) NOT NULL, "category" TEXT NOT NULL,
  "stage" "PlannedStage" NOT NULL, "status" "PlannedStatus" NOT NULL DEFAULT 'PLANNED', "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PlannedItem_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AiThread" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "title" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "AiThread_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AiMessage" (
  "id" TEXT NOT NULL, "threadId" TEXT NOT NULL, "role" TEXT NOT NULL, "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "PersonalDocument" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "title" TEXT NOT NULL, "category" "DocumentCategory" NOT NULL,
  "status" "DocumentStatus" NOT NULL DEFAULT 'PREPARING', "expiresAt" TIMESTAMP(3), "contact" TEXT, "location" TEXT, "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PersonalDocument_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ChineseProgress" (
  "id" TEXT NOT NULL, "userId" TEXT NOT NULL, "completed" TEXT[] DEFAULT ARRAY[]::TEXT[], "saved" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "mastered" TEXT[] DEFAULT ARRAY[]::TEXT[], "reviewed" INTEGER NOT NULL DEFAULT 0, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ChineseProgress_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Session_refreshTokenHash_key" ON "Session"("refreshTokenHash");
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Account_userId_idx" ON "Account"("userId");
CREATE UNIQUE INDEX "Category_userId_title_kind_key" ON "Category"("userId", "title", "kind");
CREATE INDEX "Task_userId_status_idx" ON "Task"("userId", "status");
CREATE INDEX "Task_userId_due_idx" ON "Task"("userId", "due");
CREATE INDEX "Transaction_userId_date_idx" ON "Transaction"("userId", "date");
CREATE INDEX "PlannedItem_userId_due_idx" ON "PlannedItem"("userId", "due");
CREATE INDEX "AiThread_userId_updatedAt_idx" ON "AiThread"("userId", "updatedAt");
CREATE INDEX "AiMessage_threadId_createdAt_idx" ON "AiMessage"("threadId", "createdAt");
CREATE INDEX "PersonalDocument_userId_status_idx" ON "PersonalDocument"("userId", "status");
CREATE INDEX "PersonalDocument_userId_expiresAt_idx" ON "PersonalDocument"("userId", "expiresAt");
CREATE UNIQUE INDEX "ChineseProgress_userId_key" ON "ChineseProgress"("userId");

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PlannedItem" ADD CONSTRAINT "PlannedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiThread" ADD CONSTRAINT "AiThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "AiThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PersonalDocument" ADD CONSTRAINT "PersonalDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ChineseProgress" ADD CONSTRAINT "ChineseProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
