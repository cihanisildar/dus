# Payment Testing Guide

## Current Status

The payment system uses **mock iyzico integration** for testing. Here's how to test the complete payment flow:

## Prerequisites

1. **User must be verified** - Account status must be "verified" (not just "registered")
2. **Active exam period** - Already created with `npm run db:seed-period`
3. **Logged in user** - Must be authenticated

## Test Flow

### Step 1: Verify Your Account
```bash
# Go to http://localhost:3000/dashboard/verify
# Use test code: 20250315-12345
# This changes your status from "registered" to "verified"
```

### Step 2: Access Payment Page
```bash
# Go to http://localhost:3000/dashboard/payment
# You should see the payment form (not the "verify first" message)
```

### Step 3: Current Payment Flow (Mock)

When you click "Ödeme Yap" button:

1. **Payment Initiation** (`/api/payment/initiate`)
   - Creates payment record in database
   - Status: "pending"
   - Generates mock payment token
   - Returns mock payment URL

2. **Mock iyzico Response**:
   ```json
   {
     "paymentPageUrl": "/payment/checkout",
     "token": "mock-payment-token-[timestamp]",
     "conversationId": "conv-[timestamp]"
   }
   ```

3. **Currently**: Redirects to `/payment/checkout` (which doesn't exist yet)

## What Needs to Happen

To complete a test payment, you need to:

1. Complete the payment (call `/api/payment/callback`)
2. This will:
   - Update payment status to "completed"
   - Update user status to "active"
   - Add period to user's paidPeriods array

## Quick Test Script

I'll create a simple test payment completion endpoint for you to test with.

## Expected Database Changes

After successful payment:
- **payments table**: status changes "pending" → "completed"
- **users table**:
  - accountStatus changes "verified" → "active"
  - paidPeriods array includes current period
  - updatedAt timestamp updates

## Viewing Results

After payment completes:
1. **Payment page** shows "Premium Aktif" banner
2. **Dashboard** unlocks all features
3. **Sidebar** shows all menu items (Preferences, Analytics, etc.)

---

## Files Involved

- `app/api/payment/initiate/route.ts` - Start payment
- `app/api/payment/callback/route.ts` - Complete payment
- `lib/db/transactions.ts` - `completePayment()` function
- `app/dashboard/payment/page.tsx` - Payment UI
- `app/dashboard/payment/callback/page.tsx` - Callback handler
