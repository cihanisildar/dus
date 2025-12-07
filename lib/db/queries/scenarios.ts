import { db } from '../index'
import { scenarios, type Scenario, type NewScenario } from '../schema'
import { eq, and, desc } from 'drizzle-orm'

export const scenarioQueries = {
  // Get all scenarios for a user in a period
  async getByUserAndPeriod(userId: string, periodId: string): Promise<Scenario[]> {
    return await db.query.scenarios.findMany({
      where: and(
        eq(scenarios.userId, userId),
        eq(scenarios.periodId, periodId)
      ),
      orderBy: [desc(scenarios.updatedAt)],
    })
  },

  // Get scenario by ID
  async getById(id: string): Promise<Scenario | undefined> {
    return await db.query.scenarios.findFirst({
      where: eq(scenarios.id, id),
    })
  },

  // Create scenario
  async create(data: Omit<NewScenario, 'id' | 'createdAt' | 'updatedAt'>): Promise<Scenario> {
    const [scenario] = await db.insert(scenarios).values(data).returning()
    return scenario
  },

  // Update scenario
  async update(id: string, data: Partial<Omit<Scenario, 'id' | 'createdAt'>>): Promise<Scenario> {
    const [scenario] = await db
      .update(scenarios)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(scenarios.id, id))
      .returning()
    return scenario
  },

  // Delete scenario
  async delete(id: string): Promise<void> {
    await db.delete(scenarios).where(eq(scenarios.id, id))
  },

  // Get count for user in period
  async getCount(userId: string, periodId: string): Promise<number> {
    const result = await db.query.scenarios.findMany({
      where: and(
        eq(scenarios.userId, userId),
        eq(scenarios.periodId, periodId)
      ),
    })
    return result.length
  },
}
