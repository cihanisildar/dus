CREATE TABLE "scenarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"period_id" uuid NOT NULL,
	"name" varchar(200) NOT NULL,
	"description" text,
	"preference_snapshot" jsonb NOT NULL,
	"expected_placement" text,
	"expected_probability" integer,
	"preference_count" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_period_id_exam_periods_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."exam_periods"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_scenarios_user" ON "scenarios" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_scenarios_period" ON "scenarios" USING btree ("period_id");