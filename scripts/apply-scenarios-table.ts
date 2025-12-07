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

async function applyScenarios() {
  try {
    console.log('🔄 Creating scenarios table...')

    // Create scenarios table
    await sql`
      CREATE TABLE IF NOT EXISTS "scenarios" (
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
    `
    console.log('✅ Scenarios table created')

    // Add foreign keys
    await sql`
      ALTER TABLE "scenarios"
      DROP CONSTRAINT IF EXISTS "scenarios_user_id_users_id_fk";
    `
    await sql`
      ALTER TABLE "scenarios"
      ADD CONSTRAINT "scenarios_user_id_users_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "public"."users"("id")
      ON DELETE cascade ON UPDATE no action;
    `

    await sql`
      ALTER TABLE "scenarios"
      DROP CONSTRAINT IF EXISTS "scenarios_period_id_exam_periods_id_fk";
    `
    await sql`
      ALTER TABLE "scenarios"
      ADD CONSTRAINT "scenarios_period_id_exam_periods_id_fk"
      FOREIGN KEY ("period_id") REFERENCES "public"."exam_periods"("id")
      ON DELETE cascade ON UPDATE no action;
    `
    console.log('✅ Scenarios foreign keys added')

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS "idx_scenarios_user" ON "scenarios" USING btree ("user_id");`
    await sql`CREATE INDEX IF NOT EXISTS "idx_scenarios_period" ON "scenarios" USING btree ("period_id");`
    console.log('✅ Scenarios indexes created')

    console.log('\n✅ Scenarios table created successfully!')
  } catch (error) {
    console.error('❌ Failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

applyScenarios()
