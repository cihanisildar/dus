DROP INDEX "idx_osym_user_period_unique";--> statement-breakpoint
DROP INDEX "idx_user_period_rank_unique";--> statement-breakpoint
DROP INDEX "idx_user_period_program_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_osym_user_period_unique" ON "osym_verifications" USING btree ("user_id","period_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_user_period_rank_unique" ON "user_preferences" USING btree ("user_id","period_id","rank");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_user_period_program_unique" ON "user_preferences" USING btree ("user_id","period_id","program_id");