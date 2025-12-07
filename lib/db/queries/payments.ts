import { db } from '../index'
import { payments, type Payment, type NewPayment } from '../schema'
import { eq, desc } from 'drizzle-orm'

export const paymentQueries = {
  // Get payment by token
  async getByToken(token: string): Promise<Payment | undefined> {
    return await db.query.payments.findFirst({
      where: eq(payments.paymentToken, token),
    })
  },

  // Get all payments by user
  async getByUser(userId: string): Promise<Payment[]> {
    return await db.query.payments.findMany({
      where: eq(payments.userId, userId),
      orderBy: [desc(payments.createdAt)],
    })
  },

  // Create payment
  async create(data: Omit<NewPayment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Payment> {
    const [payment] = await db.insert(payments).values(data).returning()
    return payment
  },

  // Update payment status
  async updateStatus(
    token: string,
    status: 'pending' | 'completed' | 'failed' | 'refunded',
    transactionId?: string,
    paidAt?: Date
  ): Promise<Payment> {
    const [updated] = await db.update(payments)
      .set({
        status,
        transactionId: transactionId || undefined,
        paidAt: paidAt || undefined,
        updatedAt: new Date(),
      })
      .where(eq(payments.paymentToken, token))
      .returning()

    return updated
  },
}
