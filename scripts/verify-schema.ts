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

const sql = postgres(connectionString)

async function main() {
  try {
    console.log('🔍 Checking osym_verifications table schema...\n')

    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'osym_verifications'
      ORDER BY ordinal_position
    `

    console.log('📋 Table columns:')
    console.log('─'.repeat(60))
    columns.forEach(col => {
      const nullable = col.is_nullable === 'YES' ? '(nullable)' : '(required)'
      console.log(`  ${col.column_name.padEnd(30)} ${col.data_type.padEnd(15)} ${nullable}`)
    })
    console.log('─'.repeat(60))
    console.log(`\n✅ Total columns: ${columns.length}`)

    // Check if new columns exist
    const newColumns = ['user_name', 'basic_sciences_correct', 'basic_sciences_wrong',
                       'clinical_sciences_correct', 'clinical_sciences_wrong', 'ranking', 'total_candidates']

    console.log('\n🔍 Checking new columns:')
    newColumns.forEach(colName => {
      const exists = columns.find(c => c.column_name === colName)
      const status = exists ? '✅' : '❌'
      console.log(`  ${status} ${colName}`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

main()
