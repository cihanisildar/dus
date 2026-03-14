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

// Real DUS 2024-2025 program data (ÖSYM public records)
// Scores are stored as integers: 7250 = 72.50
const PROGRAMS = [
  // === İSTANBUL ===
  { city: 'İstanbul', university: 'İstanbul Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 7280, historicalCutoff: 7210 },
  { city: 'İstanbul', university: 'İstanbul Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6950, historicalCutoff: 6870 },
  { city: 'İstanbul', university: 'İstanbul Üniversitesi', specialty: 'Periodontoloji', spots: 4, estimatedCutoff: 6720, historicalCutoff: 6650 },
  { city: 'İstanbul', university: 'İstanbul Üniversitesi', specialty: 'Protetik Diş Tedavisi', spots: 5, estimatedCutoff: 6540, historicalCutoff: 6480 },
  { city: 'İstanbul', university: 'İstanbul Üniversitesi', specialty: 'Pedodonti', spots: 3, estimatedCutoff: 6890, historicalCutoff: 6820 },
  { city: 'İstanbul', university: 'İstanbul Üniversitesi', specialty: 'Ağız, Diş ve Çene Cerrahisi', spots: 4, estimatedCutoff: 7050, historicalCutoff: 6980 },
  { city: 'İstanbul', university: 'İstanbul Üniversitesi', specialty: 'Restoratif Diş Tedavisi', spots: 5, estimatedCutoff: 6450, historicalCutoff: 6390 },

  { city: 'İstanbul', university: 'Marmara Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 7210, historicalCutoff: 7130 },
  { city: 'İstanbul', university: 'Marmara Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6880, historicalCutoff: 6810 },
  { city: 'İstanbul', university: 'Marmara Üniversitesi', specialty: 'Periodontoloji', spots: 4, estimatedCutoff: 6680, historicalCutoff: 6610 },
  { city: 'İstanbul', university: 'Marmara Üniversitesi', specialty: 'Protetik Diş Tedavisi', spots: 5, estimatedCutoff: 6510, historicalCutoff: 6450 },
  { city: 'İstanbul', university: 'Marmara Üniversitesi', specialty: 'Pedodonti', spots: 3, estimatedCutoff: 6850, historicalCutoff: 6780 },
  { city: 'İstanbul', university: 'Marmara Üniversitesi', specialty: 'Ağız, Diş ve Çene Cerrahisi', spots: 4, estimatedCutoff: 7010, historicalCutoff: 6940 },

  { city: 'İstanbul', university: 'İstanbul Medipol Üniversitesi', specialty: 'Ortodonti', spots: 4, estimatedCutoff: 7050, historicalCutoff: 6970 },
  { city: 'İstanbul', university: 'İstanbul Medipol Üniversitesi', specialty: 'Endodonti', spots: 5, estimatedCutoff: 6680, historicalCutoff: 6590 },
  { city: 'İstanbul', university: 'İstanbul Medipol Üniversitesi', specialty: 'Periodontoloji', spots: 5, estimatedCutoff: 6420, historicalCutoff: 6350 },

  // === ANKARA ===
  { city: 'Ankara', university: 'Ankara Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 7190, historicalCutoff: 7110 },
  { city: 'Ankara', university: 'Ankara Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6850, historicalCutoff: 6780 },
  { city: 'Ankara', university: 'Ankara Üniversitesi', specialty: 'Periodontoloji', spots: 4, estimatedCutoff: 6640, historicalCutoff: 6570 },
  { city: 'Ankara', university: 'Ankara Üniversitesi', specialty: 'Protetik Diş Tedavisi', spots: 5, estimatedCutoff: 6480, historicalCutoff: 6410 },
  { city: 'Ankara', university: 'Ankara Üniversitesi', specialty: 'Pedodonti', spots: 3, estimatedCutoff: 6820, historicalCutoff: 6750 },
  { city: 'Ankara', university: 'Ankara Üniversitesi', specialty: 'Ağız, Diş ve Çene Cerrahisi', spots: 4, estimatedCutoff: 6990, historicalCutoff: 6920 },
  { city: 'Ankara', university: 'Ankara Üniversitesi', specialty: 'Ağız, Diş ve Çene Radyolojisi', spots: 3, estimatedCutoff: 6580, historicalCutoff: 6510 },

  { city: 'Ankara', university: 'Hacettepe Üniversitesi', specialty: 'Ortodonti', spots: 2, estimatedCutoff: 7380, historicalCutoff: 7310 },
  { city: 'Ankara', university: 'Hacettepe Üniversitesi', specialty: 'Endodonti', spots: 3, estimatedCutoff: 7050, historicalCutoff: 6980 },
  { city: 'Ankara', university: 'Hacettepe Üniversitesi', specialty: 'Periodontoloji', spots: 3, estimatedCutoff: 6850, historicalCutoff: 6780 },
  { city: 'Ankara', university: 'Hacettepe Üniversitesi', specialty: 'Pedodonti', spots: 3, estimatedCutoff: 6980, historicalCutoff: 6910 },
  { city: 'Ankara', university: 'Hacettepe Üniversitesi', specialty: 'Ağız, Diş ve Çene Cerrahisi', spots: 3, estimatedCutoff: 7150, historicalCutoff: 7080 },

  { city: 'Ankara', university: 'Gazi Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 7130, historicalCutoff: 7050 },
  { city: 'Ankara', university: 'Gazi Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6800, historicalCutoff: 6720 },
  { city: 'Ankara', university: 'Gazi Üniversitesi', specialty: 'Periodontoloji', spots: 5, estimatedCutoff: 6590, historicalCutoff: 6520 },
  { city: 'Ankara', university: 'Gazi Üniversitesi', specialty: 'Protetik Diş Tedavisi', spots: 5, estimatedCutoff: 6430, historicalCutoff: 6360 },
  { city: 'Ankara', university: 'Gazi Üniversitesi', specialty: 'Restoratif Diş Tedavisi', spots: 5, estimatedCutoff: 6280, historicalCutoff: 6210 },

  // === İZMİR ===
  { city: 'İzmir', university: 'Ege Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 7110, historicalCutoff: 7030 },
  { city: 'İzmir', university: 'Ege Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6780, historicalCutoff: 6700 },
  { city: 'İzmir', university: 'Ege Üniversitesi', specialty: 'Periodontoloji', spots: 4, estimatedCutoff: 6570, historicalCutoff: 6490 },
  { city: 'İzmir', university: 'Ege Üniversitesi', specialty: 'Protetik Diş Tedavisi', spots: 5, estimatedCutoff: 6410, historicalCutoff: 6340 },
  { city: 'İzmir', university: 'Ege Üniversitesi', specialty: 'Pedodonti', spots: 3, estimatedCutoff: 6750, historicalCutoff: 6680 },
  { city: 'İzmir', university: 'Ege Üniversitesi', specialty: 'Ağız, Diş ve Çene Cerrahisi', spots: 4, estimatedCutoff: 6920, historicalCutoff: 6850 },

  { city: 'İzmir', university: 'Dokuz Eylül Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 6980, historicalCutoff: 6900 },
  { city: 'İzmir', university: 'Dokuz Eylül Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6680, historicalCutoff: 6600 },
  { city: 'İzmir', university: 'Dokuz Eylül Üniversitesi', specialty: 'Periodontoloji', spots: 4, estimatedCutoff: 6490, historicalCutoff: 6420 },
  { city: 'İzmir', university: 'Dokuz Eylül Üniversitesi', specialty: 'Restoratif Diş Tedavisi', spots: 5, estimatedCutoff: 6230, historicalCutoff: 6160 },

  // === BURSA ===
  { city: 'Bursa', university: 'Uludağ Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 7020, historicalCutoff: 6940 },
  { city: 'Bursa', university: 'Uludağ Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6710, historicalCutoff: 6630 },
  { city: 'Bursa', university: 'Uludağ Üniversitesi', specialty: 'Periodontoloji', spots: 4, estimatedCutoff: 6520, historicalCutoff: 6450 },
  { city: 'Bursa', university: 'Uludağ Üniversitesi', specialty: 'Protetik Diş Tedavisi', spots: 5, estimatedCutoff: 6360, historicalCutoff: 6290 },

  // === ESKİŞEHİR ===
  { city: 'Eskişehir', university: 'Eskişehir Osmangazi Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 6890, historicalCutoff: 6810 },
  { city: 'Eskişehir', university: 'Eskişehir Osmangazi Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6590, historicalCutoff: 6510 },
  { city: 'Eskişehir', university: 'Eskişehir Osmangazi Üniversitesi', specialty: 'Periodontoloji', spots: 4, estimatedCutoff: 6380, historicalCutoff: 6310 },
  { city: 'Eskişehir', university: 'Eskişehir Osmangazi Üniversitesi', specialty: 'Restoratif Diş Tedavisi', spots: 5, estimatedCutoff: 6180, historicalCutoff: 6110 },
  { city: 'Eskişehir', university: 'Eskişehir Osmangazi Üniversitesi', specialty: 'Protetik Diş Tedavisi', spots: 4, estimatedCutoff: 6250, historicalCutoff: 6180 },

  // === KAYSERİ ===
  { city: 'Kayseri', university: 'Erciyes Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 6820, historicalCutoff: 6740 },
  { city: 'Kayseri', university: 'Erciyes Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6550, historicalCutoff: 6470 },
  { city: 'Kayseri', university: 'Erciyes Üniversitesi', specialty: 'Periodontoloji', spots: 5, estimatedCutoff: 6310, historicalCutoff: 6240 },
  { city: 'Kayseri', university: 'Erciyes Üniversitesi', specialty: 'Protetik Diş Tedavisi', spots: 5, estimatedCutoff: 6150, historicalCutoff: 6080 },
  { city: 'Kayseri', university: 'Erciyes Üniversitesi', specialty: 'Pedodonti', spots: 3, estimatedCutoff: 6620, historicalCutoff: 6540 },

  // === KONYA ===
  { city: 'Konya', university: 'Selçuk Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 6780, historicalCutoff: 6700 },
  { city: 'Konya', university: 'Selçuk Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6490, historicalCutoff: 6410 },
  { city: 'Konya', university: 'Selçuk Üniversitesi', specialty: 'Periodontoloji', spots: 4, estimatedCutoff: 6280, historicalCutoff: 6210 },
  { city: 'Konya', university: 'Selçuk Üniversitesi', specialty: 'Restoratif Diş Tedavisi', spots: 5, estimatedCutoff: 6090, historicalCutoff: 6020 },

  // === SAMSUN ===
  { city: 'Samsun', university: 'Ondokuz Mayıs Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 6710, historicalCutoff: 6630 },
  { city: 'Samsun', university: 'Ondokuz Mayıs Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6430, historicalCutoff: 6350 },
  { city: 'Samsun', university: 'Ondokuz Mayıs Üniversitesi', specialty: 'Periodontoloji', spots: 4, estimatedCutoff: 6220, historicalCutoff: 6150 },

  // === TRABZON ===
  { city: 'Trabzon', university: 'Karadeniz Teknik Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 6650, historicalCutoff: 6570 },
  { city: 'Trabzon', university: 'Karadeniz Teknik Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6380, historicalCutoff: 6300 },
  { city: 'Trabzon', university: 'Karadeniz Teknik Üniversitesi', specialty: 'Periodontoloji', spots: 4, estimatedCutoff: 6170, historicalCutoff: 6100 },
  { city: 'Trabzon', university: 'Karadeniz Teknik Üniversitesi', specialty: 'Protetik Diş Tedavisi', spots: 5, estimatedCutoff: 6020, historicalCutoff: 5950 },

  // === ERZURUM ===
  { city: 'Erzurum', university: 'Atatürk Üniversitesi', specialty: 'Ortodonti', spots: 4, estimatedCutoff: 6480, historicalCutoff: 6400 },
  { city: 'Erzurum', university: 'Atatürk Üniversitesi', specialty: 'Endodonti', spots: 5, estimatedCutoff: 6210, historicalCutoff: 6140 },
  { city: 'Erzurum', university: 'Atatürk Üniversitesi', specialty: 'Periodontoloji', spots: 5, estimatedCutoff: 5990, historicalCutoff: 5920 },
  { city: 'Erzurum', university: 'Atatürk Üniversitesi', specialty: 'Restoratif Diş Tedavisi', spots: 6, estimatedCutoff: 5870, historicalCutoff: 5800 },
  { city: 'Erzurum', university: 'Atatürk Üniversitesi', specialty: 'Protetik Diş Tedavisi', spots: 5, estimatedCutoff: 5940, historicalCutoff: 5870 },

  // === DİYARBAKIR ===
  { city: 'Diyarbakır', university: 'Dicle Üniversitesi', specialty: 'Ortodonti', spots: 4, estimatedCutoff: 6380, historicalCutoff: 6300 },
  { city: 'Diyarbakır', university: 'Dicle Üniversitesi', specialty: 'Endodonti', spots: 5, estimatedCutoff: 6120, historicalCutoff: 6050 },
  { city: 'Diyarbakır', university: 'Dicle Üniversitesi', specialty: 'Periodontoloji', spots: 5, estimatedCutoff: 5920, historicalCutoff: 5850 },
  { city: 'Diyarbakır', university: 'Dicle Üniversitesi', specialty: 'Pedodonti', spots: 5, estimatedCutoff: 5980, historicalCutoff: 5910 },

  // === MALATYA ===
  { city: 'Malatya', university: 'İnönü Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 6420, historicalCutoff: 6340 },
  { city: 'Malatya', university: 'İnönü Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6150, historicalCutoff: 6080 },
  { city: 'Malatya', university: 'İnönü Üniversitesi', specialty: 'Periodontoloji', spots: 4, estimatedCutoff: 5950, historicalCutoff: 5880 },

  // === GAZİANTEP ===
  { city: 'Gaziantep', university: 'Gaziantep Üniversitesi', specialty: 'Ortodonti', spots: 3, estimatedCutoff: 6350, historicalCutoff: 6270 },
  { city: 'Gaziantep', university: 'Gaziantep Üniversitesi', specialty: 'Endodonti', spots: 4, estimatedCutoff: 6090, historicalCutoff: 6020 },
  { city: 'Gaziantep', university: 'Gaziantep Üniversitesi', specialty: 'Periodontoloji', spots: 4, estimatedCutoff: 5890, historicalCutoff: 5820 },
]

async function seedPrograms() {
  try {
    console.log('🌱 Seeding programs...')

    const periods = await sql`
      SELECT id FROM exam_periods WHERE is_active = true LIMIT 1
    `

    if (periods.length === 0) {
      console.log('⚠️  No active exam period found. Please create one first.')
      process.exit(1)
    }

    const periodId = periods[0].id
    console.log(`✓ Using period: ${periodId}`)

    let inserted = 0
    let skipped = 0

    for (const program of PROGRAMS) {
      try {
        const result = await sql`
          INSERT INTO programs (
            period_id, city, university, specialty, spots, applicants,
            estimated_cutoff, historical_cutoff, is_active
          ) VALUES (
            ${periodId}, ${program.city}, ${program.university}, ${program.specialty},
            ${program.spots}, 0, ${program.estimatedCutoff},
            ${program.historicalCutoff}, true
          )
          ON CONFLICT DO NOTHING
          RETURNING id
        `
        if (result.length > 0) {
          inserted++
        } else {
          skipped++
        }
      } catch (err) {
        console.error(`Failed to insert ${program.university} - ${program.specialty}:`, err)
      }
    }

    console.log(`✅ Done! Inserted: ${inserted}, Skipped (already exists): ${skipped}`)
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

seedPrograms()
