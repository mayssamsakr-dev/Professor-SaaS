-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."ServiceActivity" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."TeachingSession" ADD COLUMN     "deletedAt" TIMESTAMP(3);
