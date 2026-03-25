-- CreateIndex
CREATE INDEX "Invoice_universityId_idx" ON "public"."Invoice"("universityId");

-- CreateIndex
CREATE INDEX "Invoice_status_idx" ON "public"."Invoice"("status");

-- CreateIndex
CREATE INDEX "Invoice_issueDate_idx" ON "public"."Invoice"("issueDate");

-- CreateIndex
CREATE INDEX "ServiceActivity_date_idx" ON "public"."ServiceActivity"("date");

-- CreateIndex
CREATE INDEX "Subscription_tenantId_idx" ON "public"."Subscription"("tenantId");

-- CreateIndex
CREATE INDEX "TeachingSession_date_idx" ON "public"."TeachingSession"("date");
