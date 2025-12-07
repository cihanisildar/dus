CREATE TABLE "programs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"period_id" uuid NOT NULL,
	"city" varchar(100) NOT NULL,
	"university" varchar(200) NOT NULL,
	"specialty" varchar(100) NOT NULL,
	"spots" integer NOT NULL,
	"applicants" integer DEFAULT 0 NOT NULL,
	"estimated_cutoff" integer NOT NULL,
	"historical_cutoff" integer,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"period_id" uuid NOT NULL,
	"program_id" uuid NOT NULL,
	"rank" integer NOT NULL,
	"placement_probability" integer,
	"risk_level" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "programs" ADD CONSTRAINT "programs_period_id_exam_periods_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."exam_periods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_period_id_exam_periods_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."exam_periods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_program_id_programs_id_fk" FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_programs_period" ON "programs" USING btree ("period_id");--> statement-breakpoint
CREATE INDEX "idx_programs_city" ON "programs" USING btree ("city");--> statement-breakpoint
CREATE INDEX "idx_programs_specialty" ON "programs" USING btree ("specialty");--> statement-breakpoint
CREATE INDEX "idx_programs_active" ON "programs" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_user_preferences_user" ON "user_preferences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_preferences_period" ON "user_preferences" USING btree ("period_id");--> statement-breakpoint
CREATE INDEX "idx_user_preferences_program" ON "user_preferences" USING btree ("program_id");--> statement-breakpoint
CREATE INDEX "idx_user_period_rank_unique" ON "user_preferences" USING btree ("user_id","period_id","rank");--> statement-breakpoint
CREATE INDEX "idx_user_period_program_unique" ON "user_preferences" USING btree ("user_id","period_id","program_id");