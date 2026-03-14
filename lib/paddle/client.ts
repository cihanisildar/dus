import crypto from 'crypto'

export const paddleConfig = {
  apiKey: process.env.PADDLE_API_KEY || '',
  webhookSecret: process.env.PADDLE_WEBHOOK_SECRET || '',
  priceId: process.env.PADDLE_PRICE_ID || '',
  clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || '',
}

/**
 * Verify Paddle webhook signature.
 * Paddle sends: Paddle-Signature: ts=<timestamp>;h1=<hmac>
 * HMAC is computed over: ts + ":" + rawBody
 */
export function verifyPaddleWebhook(rawBody: string, signatureHeader: string): boolean {
  if (!paddleConfig.webhookSecret) {
    console.error('PADDLE_WEBHOOK_SECRET not set')
    return false
  }

  // Parse the Paddle-Signature header
  const parts = Object.fromEntries(
    signatureHeader.split(';').map(part => {
      const [key, value] = part.split('=')
      return [key, value]
    })
  )

  const ts = parts['ts']
  const h1 = parts['h1']

  if (!ts || !h1) return false

  const signedPayload = `${ts}:${rawBody}`
  const expected = crypto
    .createHmac('sha256', paddleConfig.webhookSecret)
    .update(signedPayload)
    .digest('hex')

  return crypto.timingSafeEqual(Buffer.from(h1), Buffer.from(expected))
}
