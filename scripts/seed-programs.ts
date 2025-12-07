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

async function seedPrograms() {
  try {
    console.log('🌱 Seeding programs...')

    // Get active period
    const periods = await sql`
      SELECT id FROM exam_periods WHERE is_active = true LIMIT 1
    `

    if (periods.length === 0) {
      console.log('⚠️  No active exam period found. Please create one first.')
      process.exit(1)
    }

    const periodId = periods[0].id
    console.log(`✓ Using period: ${periodId}`)

    // Check if programs already exist
    const existing = await sql`
      SELECT COUNT(*)::int as count FROM programs WHERE period_id = ${periodId}
    `

    if (existing[0].count > 0) {
      console.log(`⚠️  ${existing[0].count} programs already exist for this period. Skipping seed.`)
      process.exit(0)
    }

    // Sample programs data
    const programs = [
      // İstanbul
      { city: 'İstanbul', university: 'İstanbul Üniversitesi', specialty: 'Ortodonti', spots: 3, applicants: 45, estimatedCutoff: 7250, historicalCutoff: 7120 },
      { city: 'İstanbul', university: 'İstanbul Üniversitesi', specialty: 'Endodonti', spots: 4, applicants: 38, estimatedCutoff: 6980, historicalCutoff: 6890 },
      { city: 'İstanbul', university: 'İstanbul Üniversitesi', specialty: 'Restoratif Diş Tedavisi', spots: 5, applicants: 28, estimatedCutoff: 6450, historicalCutoff: 6380 },
      { city: 'İstanbul', university: 'Marmara Üniversitesi', specialty: 'Ortodonti', spots: 3, applicants: 42, estimatedCutoff: 7180, historicalCutoff: 7050 },
      { city: 'İstanbul', university: 'Marmara Üniversitesi', specialty: 'Periodontoloji', spots: 4, applicants: 35, estimatedCutoff: 6720, historicalCutoff: 6650 },

      // Ankara
      { city: 'Ankara', university: 'Ankara Üniversitesi', specialty: 'Ortodonti', spots: 3, applicants: 40, estimatedCutoff: 7150, historicalCutoff: 7020 },
      { city: 'Ankara', university: 'Ankara Üniversitesi', specialty: 'Endodonti', spots: 4, applicants: 36, estimatedCutoff: 6830, historicalCutoff: 6780 },
      { city: 'Ankara', university: 'Hacettepe Üniversitesi', specialty: 'Ortodonti', spots: 2, applicants: 48, estimatedCutoff: 7350, historicalCutoff: 7280 },
      { city: 'Ankara', university: 'Hacettepe Üniversitesi', specialty: 'Çocuk Diş Hekimliği', spots: 3, applicants: 32, estimatedCutoff: 6920, historicalCutoff: 6850 },
      { city: 'Ankara', university: 'Gazi Üniversitesi', specialty: 'Periodontoloji', spots: 5, applicants: 30, estimatedCutoff: 6580, historicalCutoff: 6520 },

      // İzmir
      { city: 'İzmir', university: 'Ege Üniversitesi', specialty: 'Ortodonti', spots: 3, applicants: 38, estimatedCutoff: 7080, historicalCutoff: 6980 },
      { city: 'İzmir', university: 'Ege Üniversitesi', specialty: 'Endodonti', spots: 4, applicants: 34, estimatedCutoff: 6750, historicalCutoff: 6680 },
      { city: 'İzmir', university: 'Ege Üniversitesi', specialty: 'Protetik Diş Tedavisi', spots: 5, applicants: 29, estimatedCutoff: 6480, historicalCutoff: 6420 },
      { city: 'İzmir', university: 'Dokuz Eylül Üniversitesi', specialty: 'Periodontoloji', spots: 4, applicants: 31, estimatedCutoff: 6620, historicalCutoff: 6560 },

      // Eskişehir
      { city: 'Eskişehir', university: 'Eskişehir Osmangazi Üniversitesi', specialty: 'Periodontoloji', spots: 4, applicants: 26, estimatedCutoff: 6380, historicalCutoff: 6320 },
      { city: 'Eskişehir', university: 'Eskişehir Osmangazi Üniversitesi', specialty: 'Restoratif Diş Tedavisi', spots: 5, applicants: 24, estimatedCutoff: 6180, historicalCutoff: 6120 },

      // Kayseri
      { city: 'Kayseri', university: 'Erciyes Üniversitesi', specialty: 'Endodonti', spots: 4, applicants: 28, estimatedCutoff: 6550, historicalCutoff: 6480 },
      { city: 'Kayseri', university: 'Erciyes Üniversitesi', specialty: 'Periodontoloji', spots: 5, applicants: 25, estimatedCutoff: 6320, historicalCutoff: 6280 },

      // Erzurum
      { city: 'Erzurum', university: 'Atatürk Üniversitesi', specialty: 'Restoratif Diş Tedavisi', spots: 6, applicants: 22, estimatedCutoff: 6080, historicalCutoff: 6020 },
      { city: 'Erzurum', university: 'Atatürk Üniversitesi', specialty: 'Protetik Diş Tedavisi', spots: 5, applicants: 20, estimatedCutoff: 5950, historicalCutoff: 5890 },

      // Diyarbakır
      { city: 'Diyarbakır', university: 'Dicle Üniversitesi', specialty: 'Periodontoloji', spots: 5, applicants: 21, estimatedCutoff: 6120, historicalCutoff: 6060 },
      { city: 'Diyarbakır', university: 'Dicle Üniversitesi', specialty: 'Çocuk Diş Hekimliği', spots: 6, applicants: 19, estimatedCutoff: 5980, historicalCutoff: 5920 },
    ]

    // Insert programs
    for (const program of programs) {
      await sql`
        INSERT INTO programs (
          period_id, city, university, specialty, spots, applicants,
          estimated_cutoff, historical_cutoff, is_active
        ) VALUES (
          ${periodId}, ${program.city}, ${program.university}, ${program.specialty},
          ${program.spots}, ${program.applicants}, ${program.estimatedCutoff},
          ${program.historicalCutoff}, true
        )
      `
    }

    console.log(`✅ Seeded ${programs.length} programs successfully!`)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

seedPrograms()
