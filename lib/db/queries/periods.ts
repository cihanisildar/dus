import { db } from '../index'
import { examPeriods, type ExamPeriod, type NewExamPeriod } from '../schema'
import { eq, desc } from 'drizzle-orm'

export const periodQueries = {
  // Get active period
  async getActive(): Promise<ExamPeriod | undefined> {
    return await db.query.examPeriods.findFirst({
      where: eq(examPeriods.isActive, true),
    })
  },

  // Get period by ID
  async getById(id: string): Promise<ExamPeriod | undefined> {
    return await db.query.examPeriods.findFirst({
      where: eq(examPeriods.id, id),
    })
  },

  // Get all periods
  async getAll(): Promise<ExamPeriod[]> {
    return await db.query.examPeriods.findMany({
      orderBy: [desc(examPeriods.examDate)],
    })
  },

  // Create period
  async create(data: Omit<NewExamPeriod, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExamPeriod> {
    return await db.transaction(async (tx) => {
      // Deactivate all other periods atomically before creating the new active one
      if (data.isActive) {
        await tx.update(examPeriods)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(examPeriods.isActive, true))
      }

      const [period] = await tx.insert(examPeriods).values(data).returning()
      return period
    })
  },
}
