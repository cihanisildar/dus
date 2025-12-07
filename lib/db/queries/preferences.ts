import { db } from '../index'
import { userPreferences, programs, type UserPreference, type NewUserPreference, type Program } from '../schema'
import { eq, and, desc, asc, sql } from 'drizzle-orm'

export type UserPreferenceWithProgram = UserPreference & {
  program: Program
}

export const preferenceQueries = {
  // Get all preferences for a user in a period (with program details)
  async getByUserAndPeriod(userId: string, periodId: string): Promise<UserPreferenceWithProgram[]> {
    const preferences = await db
      .select()
      .from(userPreferences)
      .leftJoin(programs, eq(userPreferences.programId, programs.id))
      .where(and(
        eq(userPreferences.userId, userId),
        eq(userPreferences.periodId, periodId)
      ))
      .orderBy(asc(userPreferences.rank))

    return preferences.map(p => ({
      ...p.user_preferences,
      program: p.programs!,
    }))
  },

  // Get single preference
  async getById(id: string): Promise<UserPreferenceWithProgram | undefined> {
    const result = await db
      .select()
      .from(userPreferences)
      .leftJoin(programs, eq(userPreferences.programId, programs.id))
      .where(eq(userPreferences.id, id))
      .limit(1)

    if (result.length === 0) return undefined

    return {
      ...result[0].user_preferences,
      program: result[0].programs!,
    }
  },

  // Get preference count for user in period
  async getCount(userId: string, periodId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(userPreferences)
      .where(and(
        eq(userPreferences.userId, userId),
        eq(userPreferences.periodId, periodId)
      ))

    return result[0]?.count || 0
  },

  // Create preference
  async create(data: Omit<NewUserPreference, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserPreference> {
    const [preference] = await db.insert(userPreferences).values(data).returning()
    return preference
  },

  // Update preference
  async update(id: string, data: Partial<Omit<UserPreference, 'id' | 'createdAt'>>): Promise<UserPreference> {
    const [preference] = await db
      .update(userPreferences)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userPreferences.id, id))
      .returning()
    return preference
  },

  // Delete preference
  async delete(id: string): Promise<void> {
    await db.delete(userPreferences).where(eq(userPreferences.id, id))
  },

  // Reorder preferences (update all ranks at once)
  async reorder(userId: string, periodId: string, preferenceIds: string[]): Promise<void> {
    // Use transaction to update all ranks atomically
    await db.transaction(async (tx) => {
      for (let i = 0; i < preferenceIds.length; i++) {
        await tx
          .update(userPreferences)
          .set({ rank: i + 1, updatedAt: new Date() })
          .where(and(
            eq(userPreferences.id, preferenceIds[i]),
            eq(userPreferences.userId, userId),
            eq(userPreferences.periodId, periodId)
          ))
      }
    })
  },

  // Delete all preferences for user in period
  async deleteAllByUserAndPeriod(userId: string, periodId: string): Promise<void> {
    await db.delete(userPreferences).where(and(
      eq(userPreferences.userId, userId),
      eq(userPreferences.periodId, periodId)
    ))
  },

  // Calculate risk distribution for user's preferences
  async getRiskDistribution(userId: string, periodId: string): Promise<{
    safe: number
    high: number
    medium: number
    low: number
  }> {
    const result = await db
      .select({
        riskLevel: userPreferences.riskLevel,
        count: sql<number>`count(*)::int`,
      })
      .from(userPreferences)
      .where(and(
        eq(userPreferences.userId, userId),
        eq(userPreferences.periodId, periodId)
      ))
      .groupBy(userPreferences.riskLevel)

    const distribution = { safe: 0, high: 0, medium: 0, low: 0 }
    result.forEach(r => {
      if (r.riskLevel === 'safe') distribution.safe = r.count
      else if (r.riskLevel === 'high') distribution.high = r.count
      else if (r.riskLevel === 'medium') distribution.medium = r.count
      else if (r.riskLevel === 'low') distribution.low = r.count
    })

    return distribution
  },
}
