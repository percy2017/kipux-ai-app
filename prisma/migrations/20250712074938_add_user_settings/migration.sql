-- AlterTable
ALTER TABLE "User" ADD COLUMN     "apiKey" TEXT,
ADD COLUMN     "defaultModel" TEXT DEFAULT 'gpt-4o-mini',
ADD COLUMN     "liteLLMUrl" TEXT,
ADD COLUMN     "theme" TEXT DEFAULT 'system';
