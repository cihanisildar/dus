import { db } from '../index'
import { programs, type Program, type NewProgram } from '../schema'
import { eq, and, desc, sql } from 'drizzle-orm'

export const programQueries = {
  // Get all programs for a period
  async getByPeriod(periodId: string): Promise<Program[]> {
    return await db.query.programs.findMany({
      where: and(
        eq(programs.periodId, periodId),
        eq(programs.isActive, true)
      ),
      orderBy: [programs.city, programs.university, programs.specialty],
    })
  },

  // Get program by ID
  async getById(id: string): Promise<Program | undefined> {
    return await db.query.programs.findFirst({
      where: eq(programs.id, id),
    })
  },

  // Search programs by filters
  async search(filters: {
    periodId: string
    city?: string
    specialty?: string
    university?: string
  }): Promise<Program[]> {
    const conditions = [
      eq(programs.periodId, filters.periodId),
      eq(programs.isActive, true),
    ]

    if (filters.city) {
      conditions.push(eq(programs.city, filters.city))
    }
    if (filters.specialty) {
      conditions.push(eq(programs.specialty, filters.specialty))
    }
    if (filters.university) {
      conditions.push(sql`${programs.university} ILIKE ${`%${filters.university}%`}`)
    }

    return await db.query.programs.findMany({
      where: and(...conditions),
      orderBy: [programs.city, programs.university],
    })
  },

  // Get unique cities for a period
  async getCities(periodId: string): Promise<string[]> {
    const result = await db
      .selectDistinct({ city: programs.city })
      .from(programs)
      .where(and(
        eq(programs.periodId, periodId),
        eq(programs.isActive, true)
      ))
      .orderBy(programs.city)

    return result.map(r => r.city)
  },

  // Get unique specialties for a period
  async getSpecialties(periodId: string): Promise<string[]> {
    const result = await db
      .selectDistinct({ specialty: programs.specialty })
      .from(programs)
      .where(and(
        eq(programs.periodId, periodId),
        eq(programs.isActive, true)
      ))
      .orderBy(programs.specialty)

    return result.map(r => r.specialty)
  },

  // Create program
  async create(data: Omit<NewProgram, 'id' | 'createdAt' | 'updatedAt'>): Promise<Program> {
    const [program] = await db.insert(programs).values(data).returning()
    return program
  },

  // Update program
  async update(id: string, data: Partial<Omit<Program, 'id' | 'createdAt'>>): Promise<Program> {
    const [program] = await db
      .update(programs)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(programs.id, id))
      .returning()
    return program
  },

  // Bulk create programs
  async bulkCreate(data: Array<Omit<NewProgram, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Program[]> {
    return await db.insert(programs).values(data).returning()
  },
}
