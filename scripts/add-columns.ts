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

console.log('🔄 Adding new columns to osym_verifications table...')

const sql = postgres(connectionString)

async function main() {
  try {
    // Add columns one by one with IF NOT EXISTS to avoid errors
    await sql`ALTER TABLE osym_verifications ADD COLUMN IF NOT EXISTS user_name text`
    console.log('✅ Added user_name column')

    await sql`ALTER TABLE osym_verifications ADD COLUMN IF NOT EXISTS basic_sciences_correct integer`
    console.log('✅ Added basic_sciences_correct column')

    await sql`ALTER TABLE osym_verifications ADD COLUMN IF NOT EXISTS basic_sciences_wrong integer`
    console.log('✅ Added basic_sciences_wrong column')

    await sql`ALTER TABLE osym_verifications ADD COLUMN IF NOT EXISTS clinical_sciences_correct integer`
    console.log('✅ Added clinical_sciences_correct column')

    await sql`ALTER TABLE osym_verifications ADD COLUMN IF NOT EXISTS clinical_sciences_wrong integer`
    console.log('✅ Added clinical_sciences_wrong column')

    await sql`ALTER TABLE osym_verifications ADD COLUMN IF NOT EXISTS ranking integer`
    console.log('✅ Added ranking column')

    await sql`ALTER TABLE osym_verifications ADD COLUMN IF NOT EXISTS total_candidates integer`
    console.log('✅ Added total_candidates column')

    console.log('\n✅ All columns added successfully!')
  } catch (error) {
    console.error('❌ Error adding columns:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

main()
