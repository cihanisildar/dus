// This route is no longer used. Paddle payments are handled via /api/payment/webhook
// Kept as a redirect for any stale bookmarks or old integrations.
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL('/dashboard/payment', req.url))
}

export async function POST(req: NextRequest) {
  return NextResponse.redirect(new URL('/dashboard/payment', req.url))
}
