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
    console.log('🔄 Creating active exam period...\n')

    // First, deactivate any existing active periods
    await sql`
      UPDATE exam_periods
      SET is_active = false
      WHERE is_active = true
    `

    // Create a new active exam period for 2025 Spring DUS
    const [period] = await sql`
      INSERT INTO exam_periods (
        name,
        display_name,
        exam_date,
        preferences_open_date,
        preferences_deadline,
        results_publish_date,
        is_active,
        created_at,
        updated_at
      ) VALUES (
        '2025-Spring-DUS',
        '2025 İlkbahar DUS',
        '2025-03-15T10:00:00Z',
        '2025-04-01T09:00:00Z',
        '2025-04-15T23:59:59Z',
        '2025-05-01T12:00:00Z',
        true,
        NOW(),
        NOW()
      )
      ON CONFLICT (name)
      DO UPDATE SET
        is_active = true,
        updated_at = NOW()
      RETURNING *
    `

    console.log('✅ Active exam period created successfully!\n')
    console.log('📋 Period Details:')
    console.log('─'.repeat(60))
    console.log(`  ID:                    ${period.id}`)
    console.log(`  Name:                  ${period.name}`)
    console.log(`  Display Name:          ${period.display_name}`)
    console.log(`  Exam Date:             ${new Date(period.exam_date).toLocaleDateString('tr-TR')}`)
    console.log(`  Preferences Open:      ${new Date(period.preferences_open_date).toLocaleDateString('tr-TR')}`)
    console.log(`  Preferences Deadline:  ${new Date(period.preferences_deadline).toLocaleDateString('tr-TR')}`)
    console.log(`  Results Publish:       ${new Date(period.results_publish_date).toLocaleDateString('tr-TR')}`)
    console.log(`  Active:                ${period.is_active ? '✅ Yes' : '❌ No'}`)
    console.log('─'.repeat(60))
    console.log('\n✅ You can now test ÖSYM verification!\n')
    console.log('Try these test codes at /dashboard/verify:')
    console.log('  • 20250315-67890  (Top Performer)')
    console.log('  • 20250315-12345  (High Performer)')
    console.log('  • 20250315-11111  (Average Performer)')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

main()
