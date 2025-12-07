import { db } from '../index'
import { osymVerifications, type OsymVerification, type NewOsymVerification } from '../schema'
import { eq, and } from 'drizzle-orm'

export const verificationQueries = {
  // Get verification by user and period
  async getByUserAndPeriod(userId: string, periodId: string): Promise<OsymVerification | undefined> {
    return await db.query.osymVerifications.findFirst({
      where: and(
        eq(osymVerifications.userId, userId),
        eq(osymVerifications.periodId, periodId)
      ),
    })
  },

  // Get all verifications by user
  async getByUser(userId: string): Promise<OsymVerification[]> {
    return await db.query.osymVerifications.findMany({
      where: eq(osymVerifications.userId, userId),
    })
  },

  // Create verification
  async create(data: Omit<NewOsymVerification, 'id' | 'verifiedAt' | 'createdAt'>): Promise<OsymVerification> {
    const [verification] = await db.insert(osymVerifications).values(data).returning()
    return verification
  },
}
