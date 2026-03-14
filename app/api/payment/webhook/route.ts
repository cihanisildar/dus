import { NextRequest, NextResponse } from 'next/server'
import { verifyPaddleWebhook } from '@/lib/paddle/client'
import { completePayment } from '@/lib/db/transactions'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signatureHeader = req.headers.get('Paddle-Signature') || ''

    if (!verifyPaddleWebhook(rawBody, signatureHeader)) {
      console.error('Invalid Paddle webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(rawBody)

    // Only process completed transactions
    if (event.event_type !== 'transaction.completed') {
      return NextResponse.json({ received: true })
    }

    const { id: transactionId, custom_data } = event.data

    if (!custom_data?.paymentToken) {
      console.error('Paddle webhook missing paymentToken in custom_data')
      return NextResponse.json({ error: 'Missing paymentToken' }, { status: 400 })
    }

    await completePayment({
      paymentToken: custom_data.paymentToken,
      transactionId,
      paidAt: new Date(event.occurred_at || Date.now()),
    })

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Paddle webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
