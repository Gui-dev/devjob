/*
  Warnings:

  - Added the required column `level` to the `jobs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobLevel" AS ENUM ('JUNIOR', 'PLENO', 'SENIOR');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "level" "JobLevel" NOT NULL;
