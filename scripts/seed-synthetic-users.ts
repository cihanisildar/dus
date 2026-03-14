import postgres from 'postgres'
import * as dotenv from 'dotenv'
import * as path from 'path'
import { randomUUID } from 'crypto'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env.local')
  process.exit(1)
}

const sql = postgres(connectionString, { max: 1 })

// DUS 2025 approximate score distribution (based on ÖSYM aggregate statistics)
// Total ~4000 candidates; we seed 500 synthetic records
const SCORE_DISTRIBUTION = [
  { range: '75+',   minScore: 7500, maxScore: 8500, percentage: 0.10 }, // 10%
  { range: '70-74', minScore: 7000, maxScore: 7499, percentage: 0.20 }, // 20%
  { range: '65-69', minScore: 6500, maxScore: 6999, percentage: 0.30 }, // 30%
  { range: '60-64', minScore: 6000, maxScore: 6499, percentage: 0.25 }, // 25%
  { range: '55-59', minScore: 5500, maxScore: 5999, percentage: 0.15 }, // 15%
]

const TOTAL_SYNTHETIC = 500

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function seedSyntheticUsers() {
  try {
    console.log('🌱 Seeding synthetic verification records for analytics cold start...')

    const periods = await sql`
      SELECT id FROM exam_periods WHERE is_active = true LIMIT 1
    `

    if (periods.length === 0) {
      console.log('⚠️  No active exam period found. Please create one first.')
      process.exit(1)
    }

    const periodId = periods[0].id
    console.log(`✓ Using period: ${periodId}`)

    // Check if synthetic records already exist
    const existing = await sql`
      SELECT COUNT(*)::int as count FROM osym_verifications
      WHERE period_id = ${periodId} AND is_synthetic = true
    `
    if (existing[0].count > 0) {
      console.log(`⚠️  ${existing[0].count} synthetic records already exist. Skipping.`)
      process.exit(0)
    }

    const examDate = new Date('2025-03-09T09:00:00Z')
    let inserted = 0

    for (const band of SCORE_DISTRIBUTION) {
      const count = Math.round(TOTAL_SYNTHETIC * band.percentage)

      for (let i = 0; i < count; i++) {
        const dusScore = randomInt(band.minScore, band.maxScore)
        // Generate a unique result code for each synthetic record
        const osymResultCode = `SYN-${randomUUID().replace(/-/g, '').substring(0, 12).toUpperCase()}`

        await sql`
          INSERT INTO osym_verifications (
            period_id, osym_result_code, dus_score, exam_date,
            user_name, is_synthetic
          ) VALUES (
            ${periodId}, ${osymResultCode}, ${dusScore}, ${examDate},
            ${'Sentetik Aday'}, true
          )
        `
        inserted++
      }
    }

    console.log(`✅ Seeded ${inserted} synthetic verification records!`)
    console.log('   Analytics will now show realistic score distributions.')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

seedSyntheticUsers()
