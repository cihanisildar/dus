import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { db } from '../lib/db'
import { sql } from 'drizzle-orm'
import fs from 'fs'
import path from 'path'

async function runMigration() {
  try {
    console.log('🔄 Running migration 0002...')

    const migrationSQL = fs.readFileSync(
      path.join(process.cwd(), 'lib/db/migrations/0002_hot_tony_stark.sql'),
      'utf-8'
    )

    // Split by statement-breakpoint and execute each statement
    const statements = migrationSQL
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 100) + '...')
      await db.execute(sql.raw(statement))
    }

    console.log('✅ Migration 0002 completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigration()
