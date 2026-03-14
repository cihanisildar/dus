CREATE TABLE "program_cutoff_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"program_id" uuid NOT NULL,
	"year" integer NOT NULL,
	"period" varchar(10),
	"cutoff_score" integer NOT NULL,
	"spots" integer NOT NULL,
	"applicants" integer
);
--> statement-breakpoint
ALTER TABLE "osym_verifications" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "conversation_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "osym_verifications" ADD COLUMN "is_synthetic" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "program_cutoff_history" ADD CONSTRAINT "program_cutoff_history_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_history_program_year_period" ON "program_cutoff_history" USING btree ("program_id","year","period");--> statement-breakpoint
CREATE INDEX "idx_history_program" ON "program_cutoff_history" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "idx_history_year" ON "program_cutoff_history" USING btree ("year");--> statement-breakpoint
CREATE INDEX "idx_osym_verifications_synthetic" ON "osym_verifications" USING btree ("is_synthetic");--> statement-breakpoint
-- Deduplicate phone numbers: update duplicate phones with a short counter suffix (fits in varchar(20))
WITH dup AS (
  SELECT id,
         ROW_NUMBER() OVER (PARTITION BY phone ORDER BY created_at) - 1 AS rn
  FROM users
)
UPDATE users
SET phone = 'DUP-' || dup.rn::text
FROM dup
WHERE users.id = dup.id AND dup.rn > 0;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_phone_unique" UNIQUE("phone");
