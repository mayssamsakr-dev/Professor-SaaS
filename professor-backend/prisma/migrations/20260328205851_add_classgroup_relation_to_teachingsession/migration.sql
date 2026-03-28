/*
  Warnings:

  - Added the required column `classGroupId` to the `TeachingSession` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TeachingSession" ADD COLUMN     "classGroupId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."TeachingSession" ADD CONSTRAINT "TeachingSession_classGroupId_fkey" FOREIGN KEY ("classGroupId") REFERENCES "public"."ClassGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
