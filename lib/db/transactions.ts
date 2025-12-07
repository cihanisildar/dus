import { db } from './index'
import { users, osymVerifications, payments, type OsymVerification, type Payment } from './schema'
import { eq } from 'drizzle-orm'
import { sql } from 'drizzle-orm'

/**
 * OSYM Verification Transaction
 * Creates verification record and updates user status atomically
 */
export async function createVerification(data: {
  userId: string
  periodId: string
  osymResultCode: string
  dusScore: number
  examDate: Date
  userName?: string
  basicSciencesCorrect?: number
  basicSciencesWrong?: number
  clinicalSciencesCorrect?: number
  clinicalSciencesWrong?: number
  ranking?: number
  totalCandidates?: number
}): Promise<OsymVerification> {
  return await db.transaction(async (tx) => {
    // 1. Create verification record
    const [verification] = await tx.insert(osymVerifications).values({
      userId: data.userId,
      periodId: data.periodId,
      osymResultCode: data.osymResultCode,
      dusScore: data.dusScore,
      examDate: data.examDate,
      userName: data.userName,
      basicSciencesCorrect: data.basicSciencesCorrect,
      basicSciencesWrong: data.basicSciencesWrong,
      clinicalSciencesCorrect: data.clinicalSciencesCorrect,
      clinicalSciencesWrong: data.clinicalSciencesWrong,
      ranking: data.ranking,
      totalCandidates: data.totalCandidates,
    }).returning()

    // 2. Get user's current verified periods
    const user = await tx.query.users.findFirst({
      where: eq(users.id, data.userId),
    })

    if (!user) {
      throw new Error('User not found')
    }

    // 3. Update user status and add to verified periods (if not already there)
    const verifiedPeriods = user.verifiedPeriods.includes(data.periodId)
      ? user.verifiedPeriods
      : [...user.verifiedPeriods, data.periodId]

    await tx.update(users)
      .set({
        accountStatus: 'verified',
        currentPeriodId: data.periodId,
        verifiedPeriods,
        updatedAt: new Date(),
      })
      .where(eq(users.id, data.userId))

    return verification
  })
}

/**
 * Payment Completion Transaction
 * Updates payment status and user status atomically
 */
export async function completePayment(data: {
  paymentToken: string
  transactionId: string
  paidAt: Date
}): Promise<Payment> {
  return await db.transaction(async (tx) => {
    // 1. Get payment
    const payment = await tx.query.payments.findFirst({
      where: eq(payments.paymentToken, data.paymentToken),
    })

    if (!payment) {
      throw new Error('Payment not found')
    }

    // 2. Update payment status
    const [updatedPayment] = await tx.update(payments)
      .set({
        status: 'completed',
        transactionId: data.transactionId,
        paidAt: data.paidAt,
        updatedAt: new Date(),
      })
      .where(eq(payments.paymentToken, data.paymentToken))
      .returning()

    // 3. Get user
    const user = await tx.query.users.findFirst({
      where: eq(users.id, payment.userId),
    })

    if (!user) {
      throw new Error('User not found')
    }

    // 4. Update user status and add to paid periods (if not already there)
    const paidPeriods = user.paidPeriods.includes(payment.periodId)
      ? user.paidPeriods
      : [...user.paidPeriods, payment.periodId]

    await tx.update(users)
      .set({
        accountStatus: 'active',
        paidPeriods,
        updatedAt: new Date(),
      })
      .where(eq(users.id, payment.userId))

    return updatedPayment
  })
}
