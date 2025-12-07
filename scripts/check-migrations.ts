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

async function checkMigrations() {
  try {
    console.log('🔍 Checking applied migrations...')

    const migrations = await sql`
      SELECT * FROM drizzle.__drizzle_migrations
      ORDER BY created_at
    `

    console.log('\n📋 Applied migrations:')
    migrations.forEach((m, i) => {
      console.log(`${i + 1}. ${m.hash} - ${m.created_at}`)
    })

    console.log('\n✅ Check complete!')
  } catch (error) {
    console.error('❌ Check failed:', error)
  } finally {
    await sql.end()
  }
}

checkMigrations()
