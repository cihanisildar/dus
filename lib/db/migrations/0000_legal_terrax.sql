CREATE TYPE "public"."account_status" AS ENUM('registered', 'verified', 'active', 'expired', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."currency" AS ENUM('TRY');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('iyzico');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TABLE "exam_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"display_name" varchar(200) NOT NULL,
	"exam_date" timestamp NOT NULL,
	"preferences_open_date" timestamp NOT NULL,
	"preferences_deadline" timestamp NOT NULL,
	"results_publish_date" timestamp NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "exam_periods_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "osym_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"period_id" uuid NOT NULL,
	"osym_result_code" varchar(50) NOT NULL,
	"dus_score" integer NOT NULL,
	"exam_date" timestamp NOT NULL,
	"verified_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"period_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"currency" "currency" DEFAULT 'TRY' NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"provider" "payment_provider" DEFAULT 'iyzico' NOT NULL,
	"transaction_id" varchar(255) NOT NULL,
	"payment_token" varchar(255) NOT NULL,
	"conversation_id" varchar(255) NOT NULL,
	"paid_at" timestamp,
	"metadata" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payments_payment_token_unique" UNIQUE("payment_token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" varchar(20) NOT NULL,
	"password_hash" text NOT NULL,
	"current_period_id" uuid,
	"verified_periods" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"paid_periods" uuid[] DEFAULT '{}'::uuid[] NOT NULL,
	"account_status" "account_status" DEFAULT 'registered' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "osym_verifications" ADD CONSTRAINT "osym_verifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "osym_verifications" ADD CONSTRAINT "osym_verifications_period_id_exam_periods_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."exam_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_period_id_exam_periods_id_fk" FOREIGN KEY ("period_id") REFERENCES "public"."exam_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_current_period_id_exam_periods_id_fk" FOREIGN KEY ("current_period_id") REFERENCES "public"."exam_periods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_exam_periods_active" ON "exam_periods" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_exam_periods_exam_date" ON "exam_periods" USING btree ("exam_date");--> statement-breakpoint
CREATE INDEX "idx_osym_verifications_user" ON "osym_verifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_osym_verifications_period" ON "osym_verifications" USING btree ("period_id");--> statement-breakpoint
CREATE INDEX "idx_osym_verifications_code" ON "osym_verifications" USING btree ("osym_result_code");--> statement-breakpoint
CREATE INDEX "idx_osym_user_period_unique" ON "osym_verifications" USING btree ("user_id","period_id");--> statement-breakpoint
CREATE INDEX "idx_payments_user" ON "payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_payments_period" ON "payments" USING btree ("period_id");--> statement-breakpoint
CREATE INDEX "idx_payments_token" ON "payments" USING btree ("payment_token");--> statement-breakpoint
CREATE INDEX "idx_payments_status" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_status" ON "users" USING btree ("account_status");--> statement-breakpoint
CREATE INDEX "idx_users_current_period" ON "users" USING btree ("current_period_id");--> statement-breakpoint
CREATE INDEX "idx_users_verified_periods" ON "users" USING gin ("verified_periods");--> statement-breakpoint
CREATE INDEX "idx_users_paid_periods" ON "users" USING gin ("paid_periods");