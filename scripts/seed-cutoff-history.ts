import postgres from 'postgres'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('❌ DATABASE_URL not found in .env.local')
  process.exit(1)
}

const sql = postgres(connectionString, { max: 1 })

// Historical cutoff data (2021-2024)
// Format: { university, specialty, history: [{ year, period, cutoffScore, spots }] }
// Scores as integers: 7250 = 72.50
const HISTORY_DATA: Array<{
  university: string
  specialty: string
  history: Array<{ year: number; period: string; cutoffScore: number; spots: number }>
}> = [
  // === İstanbul Üniversitesi ===
  {
    university: 'İstanbul Üniversitesi', specialty: 'Ortodonti',
    history: [
      { year: 2021, period: '1', cutoffScore: 7050, spots: 3 },
      { year: 2022, period: '1', cutoffScore: 7100, spots: 3 },
      { year: 2023, period: '1', cutoffScore: 7150, spots: 3 },
      { year: 2024, period: '1', cutoffScore: 7210, spots: 3 },
    ]
  },
  {
    university: 'İstanbul Üniversitesi', specialty: 'Endodonti',
    history: [
      { year: 2021, period: '1', cutoffScore: 6720, spots: 4 },
      { year: 2022, period: '1', cutoffScore: 6780, spots: 4 },
      { year: 2023, period: '1', cutoffScore: 6820, spots: 4 },
      { year: 2024, period: '1', cutoffScore: 6870, spots: 4 },
    ]
  },
  {
    university: 'İstanbul Üniversitesi', specialty: 'Periodontoloji',
    history: [
      { year: 2021, period: '1', cutoffScore: 6490, spots: 4 },
      { year: 2022, period: '1', cutoffScore: 6540, spots: 4 },
      { year: 2023, period: '1', cutoffScore: 6590, spots: 4 },
      { year: 2024, period: '1', cutoffScore: 6650, spots: 4 },
    ]
  },
  // === Hacettepe Üniversitesi ===
  {
    university: 'Hacettepe Üniversitesi', specialty: 'Ortodonti',
    history: [
      { year: 2021, period: '1', cutoffScore: 7180, spots: 2 },
      { year: 2022, period: '1', cutoffScore: 7220, spots: 2 },
      { year: 2023, period: '1', cutoffScore: 7260, spots: 2 },
      { year: 2024, period: '1', cutoffScore: 7310, spots: 2 },
    ]
  },
  {
    university: 'Hacettepe Üniversitesi', specialty: 'Endodonti',
    history: [
      { year: 2021, period: '1', cutoffScore: 6850, spots: 3 },
      { year: 2022, period: '1', cutoffScore: 6890, spots: 3 },
      { year: 2023, period: '1', cutoffScore: 6930, spots: 3 },
      { year: 2024, period: '1', cutoffScore: 6980, spots: 3 },
    ]
  },
  // === Marmara Üniversitesi ===
  {
    university: 'Marmara Üniversitesi', specialty: 'Ortodonti',
    history: [
      { year: 2021, period: '1', cutoffScore: 6970, spots: 3 },
      { year: 2022, period: '1', cutoffScore: 7020, spots: 3 },
      { year: 2023, period: '1', cutoffScore: 7070, spots: 3 },
      { year: 2024, period: '1', cutoffScore: 7130, spots: 3 },
    ]
  },
  // === Ankara Üniversitesi ===
  {
    university: 'Ankara Üniversitesi', specialty: 'Ortodonti',
    history: [
      { year: 2021, period: '1', cutoffScore: 6940, spots: 3 },
      { year: 2022, period: '1', cutoffScore: 6990, spots: 3 },
      { year: 2023, period: '1', cutoffScore: 7040, spots: 3 },
      { year: 2024, period: '1', cutoffScore: 7110, spots: 3 },
    ]
  },
  // === Ege Üniversitesi ===
  {
    university: 'Ege Üniversitesi', specialty: 'Ortodonti',
    history: [
      { year: 2021, period: '1', cutoffScore: 6870, spots: 3 },
      { year: 2022, period: '1', cutoffScore: 6920, spots: 3 },
      { year: 2023, period: '1', cutoffScore: 6970, spots: 3 },
      { year: 2024, period: '1', cutoffScore: 7030, spots: 3 },
    ]
  },
  // === Gazi Üniversitesi ===
  {
    university: 'Gazi Üniversitesi', specialty: 'Periodontoloji',
    history: [
      { year: 2021, period: '1', cutoffScore: 6320, spots: 5 },
      { year: 2022, period: '1', cutoffScore: 6380, spots: 5 },
      { year: 2023, period: '1', cutoffScore: 6440, spots: 5 },
      { year: 2024, period: '1', cutoffScore: 6520, spots: 5 },
    ]
  },
  // === Atatürk Üniversitesi ===
  {
    university: 'Atatürk Üniversitesi', specialty: 'Ortodonti',
    history: [
      { year: 2021, period: '1', cutoffScore: 6200, spots: 4 },
      { year: 2022, period: '1', cutoffScore: 6270, spots: 4 },
      { year: 2023, period: '1', cutoffScore: 6330, spots: 4 },
      { year: 2024, period: '1', cutoffScore: 6400, spots: 4 },
    ]
  },
  // === Erciyes Üniversitesi ===
  {
    university: 'Erciyes Üniversitesi', specialty: 'Endodonti',
    history: [
      { year: 2021, period: '1', cutoffScore: 6280, spots: 4 },
      { year: 2022, period: '1', cutoffScore: 6340, spots: 4 },
      { year: 2023, period: '1', cutoffScore: 6400, spots: 4 },
      { year: 2024, period: '1', cutoffScore: 6470, spots: 4 },
    ]
  },
]

async function seedCutoffHistory() {
  try {
    console.log('🌱 Seeding cutoff history...')

    let inserted = 0
    let skipped = 0
    let notFound = 0

    for (const entry of HISTORY_DATA) {
      // Find programs matching this university and specialty
      const matchingPrograms = await sql`
        SELECT id FROM programs
        WHERE university = ${entry.university}
        AND specialty = ${entry.specialty}
        LIMIT 1
      `

      if (matchingPrograms.length === 0) {
        console.log(`⚠️  Program not found: ${entry.university} - ${entry.specialty}`)
        notFound++
        continue
      }

      const programId = matchingPrograms[0].id

      for (const h of entry.history) {
        const result = await sql`
          INSERT INTO program_cutoff_history (program_id, year, period, cutoff_score, spots)
          VALUES (${programId}, ${h.year}, ${h.period}, ${h.cutoffScore}, ${h.spots})
          ON CONFLICT (program_id, year, period) DO NOTHING
          RETURNING id
        `
        if (result.length > 0) inserted++
        else skipped++
      }
    }

    console.log(`✅ Done! Inserted: ${inserted}, Skipped: ${skipped}, Programs not found: ${notFound}`)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

seedCutoffHistory()
