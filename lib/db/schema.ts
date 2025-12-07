import {
  pgTable, uuid, text, varchar, timestamp, integer,
  boolean, pgEnum, jsonb, index
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// Enums
export const accountStatusEnum = pgEnum('account_status', [
  'registered', 'verified', 'active', 'expired', 'suspended'
])

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending', 'completed', 'failed', 'refunded'
])

export const currencyEnum = pgEnum('currency', ['TRY'])
export const paymentProviderEnum = pgEnum('payment_provider', ['iyzico'])

// Exam Periods Table
export const examPeriods = pgTable('exam_periods', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull().unique(), // "2025-Spring-DUS"
  displayName: varchar('display_name', { length: 200 }).notNull(), // "2025 İlkbahar DUS"
  examDate: timestamp('exam_date').notNull(),
  preferencesOpenDate: timestamp('preferences_open_date').notNull(),
  preferencesDeadline: timestamp('preferences_deadline').notNull(),
  resultsPublishDate: timestamp('results_publish_date').notNull(),
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  activeIdx: index('idx_exam_periods_active').on(table.isActive),
  examDateIdx: index('idx_exam_periods_exam_date').on(table.examDate),
}))

// Users Table
export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // No default - will be set from Supabase Auth
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  passwordHash: text('password_hash').notNull(), // Empty for Supabase Auth users

  // Period tracking - Using PostgreSQL array columns
  currentPeriodId: uuid('current_period_id').references(() => examPeriods.id),
  verifiedPeriods: uuid('verified_periods').array().notNull().default(sql`'{}'::uuid[]`),
  paidPeriods: uuid('paid_periods').array().notNull().default(sql`'{}'::uuid[]`),

  // Account status
  accountStatus: accountStatusEnum('account_status').notNull().default('registered'),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  lastLoginAt: timestamp('last_login_at'),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
  statusIdx: index('idx_users_status').on(table.accountStatus),
  periodIdx: index('idx_users_current_period').on(table.currentPeriodId),
  // GIN indexes for array searches
  verifiedPeriodsIdx: index('idx_users_verified_periods').using('gin', table.verifiedPeriods),
  paidPeriodsIdx: index('idx_users_paid_periods').using('gin', table.paidPeriods),
}))

// Payments Table
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  periodId: uuid('period_id').notNull().references(() => examPeriods.id),
  amount: integer('amount').notNull(), // Store as cents (29999 = 299.99 TRY)
  currency: currencyEnum('currency').notNull().default('TRY'),
  status: paymentStatusEnum('status').notNull().default('pending'),
  provider: paymentProviderEnum('provider').notNull().default('iyzico'),
  transactionId: varchar('transaction_id', { length: 255 }).notNull(),
  paymentToken: varchar('payment_token', { length: 255 }).notNull().unique(),
  conversationId: varchar('conversation_id', { length: 255 }).notNull(),
  paidAt: timestamp('paid_at'),
  metadata: jsonb('metadata').$type<{ ip: string; userAgent: string }>().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_payments_user').on(table.userId),
  periodIdx: index('idx_payments_period').on(table.periodId),
  tokenIdx: index('idx_payments_token').on(table.paymentToken),
  statusIdx: index('idx_payments_status').on(table.status),
}))

// OSYM Verifications Table
export const osymVerifications = pgTable('osym_verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  periodId: uuid('period_id').notNull().references(() => examPeriods.id),
  osymResultCode: varchar('osym_result_code', { length: 50 }).notNull(),
  dusScore: integer('dus_score').notNull(), // Store as integer (6550 = 65.50)
  examDate: timestamp('exam_date').notNull(),

  // Detailed exam results
  userName: text('user_name'),
  basicSciencesCorrect: integer('basic_sciences_correct'),
  basicSciencesWrong: integer('basic_sciences_wrong'),
  clinicalSciencesCorrect: integer('clinical_sciences_correct'),
  clinicalSciencesWrong: integer('clinical_sciences_wrong'),
  ranking: integer('ranking'),
  totalCandidates: integer('total_candidates'),

  verifiedAt: timestamp('verified_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_osym_verifications_user').on(table.userId),
  periodIdx: index('idx_osym_verifications_period').on(table.periodId),
  codeIdx: index('idx_osym_verifications_code').on(table.osymResultCode),
  // Unique constraint: one verification per user per period
  userPeriodUnique: index('idx_osym_user_period_unique').on(table.userId, table.periodId),
}))

// Programs Table - Available specialties and programs
export const programs = pgTable('programs', {
  id: uuid('id').primaryKey().defaultRandom(),
  periodId: uuid('period_id').notNull().references(() => examPeriods.id, { onDelete: 'cascade' }),

  // Program details
  city: varchar('city', { length: 100 }).notNull(),
  university: varchar('university', { length: 200 }).notNull(),
  specialty: varchar('specialty', { length: 100 }).notNull(),

  // Quota and competition
  spots: integer('spots').notNull(), // Number of available positions
  applicants: integer('applicants').notNull().default(0), // Current applicant count

  // Score information
  estimatedCutoff: integer('estimated_cutoff').notNull(), // Store as integer (7250 = 72.50)
  historicalCutoff: integer('historical_cutoff'), // Previous year cutoff (nullable)

  // Metadata
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  periodIdx: index('idx_programs_period').on(table.periodId),
  cityIdx: index('idx_programs_city').on(table.city),
  specialtyIdx: index('idx_programs_specialty').on(table.specialty),
  activeIdx: index('idx_programs_active').on(table.isActive),
}))

// User Preferences Table
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  periodId: uuid('period_id').notNull().references(() => examPeriods.id, { onDelete: 'cascade' }),
  programId: uuid('program_id').notNull().references(() => programs.id, { onDelete: 'cascade' }),

  // Preference order (1-30)
  rank: integer('rank').notNull(),

  // Calculated probabilities and risk
  placementProbability: integer('placement_probability'), // Store as percentage (85 = 85%)
  riskLevel: varchar('risk_level', { length: 20 }), // 'safe', 'high', 'medium', 'low'

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_user_preferences_user').on(table.userId),
  periodIdx: index('idx_user_preferences_period').on(table.periodId),
  programIdx: index('idx_user_preferences_program').on(table.programId),
  // Unique constraint: one rank per user per period, one program per user per period
  userPeriodRankUnique: index('idx_user_period_rank_unique').on(table.userId, table.periodId, table.rank),
  userPeriodProgramUnique: index('idx_user_period_program_unique').on(table.userId, table.periodId, table.programId),
}))

// Scenarios Table - What-if scenario analysis
export const scenarios = pgTable('scenarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  periodId: uuid('period_id').notNull().references(() => examPeriods.id, { onDelete: 'cascade' }),

  // Scenario details
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description'),

  // Snapshot of preferences for this scenario (JSON array of program IDs in order)
  preferenceSnapshot: jsonb('preference_snapshot').$type<string[]>().notNull(),

  // Calculated results
  expectedPlacement: text('expected_placement'),
  expectedProbability: integer('expected_probability'), // Percentage
  preferenceCount: integer('preference_count').notNull(),

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_scenarios_user').on(table.userId),
  periodIdx: index('idx_scenarios_period').on(table.periodId),
}))

// Type exports for use in application
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type ExamPeriod = typeof examPeriods.$inferSelect
export type NewExamPeriod = typeof examPeriods.$inferInsert
export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
export type OsymVerification = typeof osymVerifications.$inferSelect
export type NewOsymVerification = typeof osymVerifications.$inferInsert
export type Program = typeof programs.$inferSelect
export type NewProgram = typeof programs.$inferInsert
export type UserPreference = typeof userPreferences.$inferSelect
export type NewUserPreference = typeof userPreferences.$inferInsert
export type Scenario = typeof scenarios.$inferSelect
export type NewScenario = typeof scenarios.$inferInsert
