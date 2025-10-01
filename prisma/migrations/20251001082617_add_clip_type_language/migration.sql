-- CreateEnum
CREATE TYPE "ClipType" AS ENUM ('TEXT', 'CODE');

-- AlterTable
ALTER TABLE "Clip" ADD COLUMN     "language" TEXT,
ADD COLUMN     "type" "ClipType" NOT NULL DEFAULT 'TEXT';
