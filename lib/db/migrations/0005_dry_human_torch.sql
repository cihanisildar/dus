ALTER TABLE "osym_verifications" ALTER COLUMN "osym_result_code" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "osym_verifications" ADD COLUMN "tc_kimlik_no" varchar(11);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_osym_tc_period_unique" ON "osym_verifications" USING btree ("tc_kimlik_no","period_id");