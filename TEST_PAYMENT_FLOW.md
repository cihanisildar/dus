# 🧪 Payment Testing - Step by Step Guide

## Quick Test Flow

### Prerequisites
Make sure you have:
- ✅ Active exam period (already done with `npm run db:seed-period`)
- ✅ Dev server running (`npm run dev`)

---

## Step-by-Step Testing

### 1️⃣ Register & Login
```
URL: http://localhost:3000/register
```
- Create a new test account
- Login with your credentials

### 2️⃣ Verify Your ÖSYM Result
```
URL: http://localhost:3000/dashboard/verify
```
- Use test code: **`20250315-12345`**
- Click "Doğrula"
- You should see your complete ÖSYM results

**What happens:**
- Your account status changes: `registered` → `verified`
- Your DUS score and exam details are saved
- You can now proceed to payment

### 3️⃣ Go to Payment Page
```
URL: http://localhost:3000/dashboard/payment
```

**What you should see:**
- Payment form with card fields
- Price: 299.99 TRY
- Features list
- "Ödeme Yap" button

**If you see "ÖSYM Doğrulaması Gerekli":**
- You skipped step 2
- Go back and verify first

### 4️⃣ Initiate Payment
- Scroll down on payment page
- Check the agreement checkbox
- Click **"Ödeme Yap (299.99 TRY)"** button

**What happens:**
- Creates pending payment in database
- Generates mock payment token
- Redirects you to test completion page

### 5️⃣ Complete Test Payment
```
URL: http://localhost:3000/dashboard/payment/test-complete
```

**You should see:**
- Warning banner (This is a TEST PAGE)
- Your pending payment listed
- Payment amount: 299.99 TRY
- Token and Conversation ID
- Green "Complete This Payment (Test)" button

**Click the green button** to complete payment

**What happens:**
- Calls `/api/payment/callback`
- Updates payment status: `pending` → `completed`
- Updates user status: `verified` → `active`
- Adds period to your `paidPeriods` array
- Redirects to payment page

### 6️⃣ See Premium Active Status
```
URL: http://localhost:3000/dashboard/payment
```

**What you should see:**
- 🎉 "Premium Aktif" banner
- Green gradient header
- Your payment details
- Payment history
- Stats showing 1 payment, 299.99 TRY spent

---

## Troubleshooting

### Problem: "ÖSYM Doğrulaması Gerekli" on payment page
**Solution:** Go to `/dashboard/verify` and verify with code `20250315-12345`

### Problem: No pending payments shown
**Solution:**
1. Go back to `/dashboard/payment`
2. Click "Ödeme Yap" button again
3. This creates a new pending payment

### Problem: Payment completion fails
**Solution:** Check browser console for errors, ensure:
- User is logged in
- Payment token exists in database
- Database connection is working

---

## Database Check

After completing payment, you can verify in database:

**Check payments table:**
```sql
SELECT * FROM payments WHERE status = 'completed';
```

**Check users table:**
```sql
SELECT account_status, paid_periods FROM users WHERE id = '[your-user-id]';
```

You should see:
- `account_status`: `"active"`
- `paid_periods`: `["{period-id}"]`

---

## Alternative: Direct Database Test

If you want to test without UI, run this script:

```typescript
// scripts/test-payment.ts
import { completePayment } from './lib/db/transactions';

// Get a pending payment token from database
const token = "mock-payment-token-123456789";

await completePayment({
    paymentToken: token,
    transactionId: "test-txn-" + Date.now(),
    paidAt: new Date(),
});

console.log("Payment completed!");
```

---

## Expected UI Changes

### Before Payment (Verified Status):
- Sidebar: Shows Verify, Payment, Profile
- Payment page: Shows payment form
- Dashboard: Limited features

### After Payment (Active Status):
- Sidebar: Shows ALL menu items (Preferences, Analytics, etc.)
- Payment page: Shows "Premium Aktif" banner
- Dashboard: All features unlocked

---

## URLs Reference

| Page | URL |
|------|-----|
| Register | `/register` |
| Login | `/login` |
| Dashboard | `/dashboard` |
| Verify | `/dashboard/verify` |
| Payment | `/dashboard/payment` |
| Test Complete | `/dashboard/payment/test-complete` |

---

## Test Codes

| Code | Score | Rank | Use Case |
|------|-------|------|----------|
| `20250315-12345` | 74.52 | 234 | High performer |
| `20250315-67890` | 82.15 | 89 | Top performer |
| `20250315-11111` | 65.30 | 1,250 | Average performer |

Happy testing! 🎉
