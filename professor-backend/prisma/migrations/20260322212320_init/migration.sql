/*
  Warnings:

  - You are about to drop the column `currency` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `maxInvoices` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `maxUniversities` on the `Plan` table. All the data in the column will be lost.
  - You are about to drop the column `baseCurrency` on the `Tenant` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `University` table. All the data in the column will be lost.
  - Added the required column `currencyId` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currencyId` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `baseCurrencyId` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultCurrencyId` to the `University` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currencyId` to the `UniversitySubject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Invoice" DROP COLUMN "currency",
ADD COLUMN     "currencyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Plan" DROP COLUMN "currency",
DROP COLUMN "maxInvoices",
DROP COLUMN "maxUniversities",
ADD COLUMN     "currencyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Tenant" DROP COLUMN "baseCurrency",
ADD COLUMN     "baseCurrencyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."University" DROP COLUMN "currency",
ADD COLUMN     "defaultCurrencyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."UniversitySubject" ADD COLUMN     "currencyId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Currency" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Currency_code_key" ON "public"."Currency"("code");

-- AddForeignKey
ALTER TABLE "public"."Tenant" ADD CONSTRAINT "Tenant_baseCurrencyId_fkey" FOREIGN KEY ("baseCurrencyId") REFERENCES "public"."Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."University" ADD CONSTRAINT "University_defaultCurrencyId_fkey" FOREIGN KEY ("defaultCurrencyId") REFERENCES "public"."Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UniversitySubject" ADD CONSTRAINT "UniversitySubject_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "public"."Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Invoice" ADD CONSTRAINT "Invoice_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "public"."Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Plan" ADD CONSTRAINT "Plan_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "public"."Currency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
