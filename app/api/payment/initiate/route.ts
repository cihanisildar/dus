import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { users, examPeriods, payments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

    if (authError || !authUser) {
      return NextResponse.json({ error: 'Oturum bulunamadı. Lütfen giriş yapın.' }, { status: 401 })
    }

    const user = await db.query.users.findFirst({ where: eq(users.id, authUser.id) })
    if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 })

    if (user.accountStatus !== 'verified') {
      return NextResponse.json({ error: 'Önce ÖSYM doğrulaması yapmalısınız' }, { status: 400 })
    }

    const activePeriod = await db.query.examPeriods.findFirst({ where: eq(examPeriods.isActive, true) })
    if (!activePeriod) {
      return NextResponse.json({ error: 'Aktif sınav dönemi bulunamadı' }, { status: 400 })
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Generate a unique payment token that will be passed as Paddle custom_data
    const paymentToken = randomUUID()

    await db.insert(payments).values({
      userId: user.id,
      periodId: activePeriod.id,
      amount: 29999, // 299.99 TRY as cents
      currency: 'TRY',
      status: 'pending',
      provider: 'paddle',
      transactionId: '',
      paymentToken,
      metadata: { ip, userAgent },
    })

    // Return paymentToken and Paddle config for client-side checkout
    return NextResponse.json({
      success: true,
      paymentToken,
      priceId: process.env.PADDLE_PRICE_ID,
    })
  } catch (error) {
    console.error('Payment initiation error:', error)
    return NextResponse.json({ error: 'Ödeme başlatma sırasında bir hata oluştu' }, { status: 500 })
  }
}
