import postgres from 'postgres'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env.local')
  process.exit(1)
}

const sql = postgres(connectionString, { max: 1 })

async function applyNewTables() {
  try {
    console.log('🔄 Creating programs and user_preferences tables...')

    // Create programs table
    await sql`
      CREATE TABLE IF NOT EXISTS "programs" (
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
    `
    console.log('✅ Programs table created')

    // Create user_preferences table
    await sql`
      CREATE TABLE IF NOT EXISTS "user_preferences" (
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
    `
    console.log('✅ User preferences table created')

    // Add foreign keys
    await sql`
      ALTER TABLE "programs"
      DROP CONSTRAINT IF EXISTS "programs_period_id_exam_periods_id_fk";
    `
    await sql`
      ALTER TABLE "programs"
      ADD CONSTRAINT "programs_period_id_exam_periods_id_fk"
      FOREIGN KEY ("period_id") REFERENCES "public"."exam_periods"("id")
      ON DELETE cascade ON UPDATE no action;
    `
    console.log('✅ Programs foreign keys added')

    await sql`
      ALTER TABLE "user_preferences"
      DROP CONSTRAINT IF EXISTS "user_preferences_user_id_users_id_fk";
    `
    await sql`
      ALTER TABLE "user_preferences"
      ADD CONSTRAINT "user_preferences_user_id_users_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
      ON DELETE cascade ON UPDATE no action;
    `

    await sql`
      ALTER TABLE "user_preferences"
      DROP CONSTRAINT IF EXISTS "user_preferences_period_id_exam_periods_id_fk";
    `
    await sql`
      ALTER TABLE "user_preferences"
      ADD CONSTRAINT "user_preferences_period_id_exam_periods_id_fk"
      FOREIGN KEY ("period_id") REFERENCES "public"."exam_periods"("id")
      ON DELETE cascade ON UPDATE no action;
    `

    await sql`
      ALTER TABLE "user_preferences"
      DROP CONSTRAINT IF EXISTS "user_preferences_program_id_programs_id_fk";
    `
    await sql`
      ALTER TABLE "user_preferences"
      ADD CONSTRAINT "user_preferences_program_id_programs_id_fk"
      FOREIGN KEY ("program_id") REFERENCES "public"."programs"("id")
      ON DELETE cascade ON UPDATE no action;
    `
    console.log('✅ User preferences foreign keys added')

    // Create indexes for programs
    await sql`CREATE INDEX IF NOT EXISTS "idx_programs_period" ON "programs" USING btree ("period_id");`
    await sql`CREATE INDEX IF NOT EXISTS "idx_programs_city" ON "programs" USING btree ("city");`
    await sql`CREATE INDEX IF NOT EXISTS "idx_programs_specialty" ON "programs" USING btree ("specialty");`
    await sql`CREATE INDEX IF NOT EXISTS "idx_programs_active" ON "programs" USING btree ("is_active");`
    console.log('✅ Programs indexes created')

    // Create indexes for user_preferences
    await sql`CREATE INDEX IF NOT EXISTS "idx_user_preferences_user" ON "user_preferences" USING btree ("user_id");`
    await sql`CREATE INDEX IF NOT EXISTS "idx_user_preferences_period" ON "user_preferences" USING btree ("period_id");`
    await sql`CREATE INDEX IF NOT EXISTS "idx_user_preferences_program" ON "user_preferences" USING btree ("program_id");`
    await sql`CREATE INDEX IF NOT EXISTS "idx_user_period_rank_unique" ON "user_preferences" USING btree ("user_id","period_id","rank");`
    await sql`CREATE INDEX IF NOT EXISTS "idx_user_period_program_unique" ON "user_preferences" USING btree ("user_id","period_id","program_id");`
    console.log('✅ User preferences indexes created')

    console.log('\n✅ All tables created successfully!')
  } catch (error) {
    console.error('❌ Failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

applyNewTables()
