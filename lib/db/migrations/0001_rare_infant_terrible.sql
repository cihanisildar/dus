-- Add new columns to osym_verifications table for detailed exam results
ALTER TABLE "osym_verifications" ADD COLUMN IF NOT EXISTS "user_name" text;--> statement-breakpoint
ALTER TABLE "osym_verifications" ADD COLUMN IF NOT EXISTS "basic_sciences_correct" integer;--> statement-breakpoint
ALTER TABLE "osym_verifications" ADD COLUMN IF NOT EXISTS "basic_sciences_wrong" integer;--> statement-breakpoint
ALTER TABLE "osym_verifications" ADD COLUMN IF NOT EXISTS "clinical_sciences_correct" integer;--> statement-breakpoint
ALTER TABLE "osym_verifications" ADD COLUMN IF NOT EXISTS "clinical_sciences_wrong" integer;--> statement-breakpoint
ALTER TABLE "osym_verifications" ADD COLUMN IF NOT EXISTS "ranking" integer;--> statement-breakpoint
ALTER TABLE "osym_verifications" ADD COLUMN IF NOT EXISTS "total_candidates" integer;