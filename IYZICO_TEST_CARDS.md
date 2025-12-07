# 💳 iyzico Test Cards - Payment Testing Guide

## 🔧 Setup Instructions

### 1. Get iyzico Sandbox Credentials

1. Go to: **https://sandbox-merchant.iyzipay.com/**
2. Register for a free sandbox account
3. After login, go to **Settings → API Keys**
4. Copy your **API Key** and **Secret Key**

### 2. Update Environment Variables

Edit `.env.local` file:

```bash
# iyzico Sandbox Credentials
IYZICO_API_KEY="your-sandbox-api-key-here"
IYZICO_SECRET_KEY="your-sandbox-secret-key-here"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"

# App URL (for payment callbacks)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Restart Dev Server

```bash
npm run dev
```

---

## 🧪 iyzico Test Cards

### ✅ Successful Payment Cards

Use these cards to test **successful payments**:

#### Mastercard (Success)
```
Card Number:    5528 7900 0000 0003
Expiry Date:    12/30 (any future date)
CVV:            123 (any 3 digits)
Cardholder:     Your Name
```

#### Visa (Success)
```
Card Number:    4603 4504 5000 0005
Expiry Date:    12/30 (any future date)
CVV:            123 (any 3 digits)
Cardholder:     Your Name
```

#### Troy (Success - Turkish Card)
```
Card Number:    9792 0304 7187 5001
Expiry Date:    12/30 (any future date)
CVV:            123 (any 3 digits)
Cardholder:     Your Name
```

---

### ❌ Failed Payment Cards

Use these to test **payment failures**:

#### Insufficient Funds
```
Card Number:    5406 6700 0000 0009
Expiry Date:    12/30
CVV:            123
Result:         "Yetersiz bakiye" (Insufficient funds)
```

#### Invalid Card
```
Card Number:    4111 1111 1111 1111
Expiry Date:    12/30
CVV:            123
Result:         "Geçersiz kart" (Invalid card)
```

#### Do Not Honor
```
Card Number:    5528 7900 0000 0001
Expiry Date:    12/30
CVV:            123
Result:         "Kart geçersiz" (Do not honor)
```

---

## 3D Secure Test

iyzico sandbox **automatically handles 3D Secure**. When you use test cards:

1. Payment form loads
2. 3D Secure screen appears automatically
3. Click **"Confirm"** button
4. Payment completes

**No need to enter SMS codes or passwords** in sandbox mode.

---

## 📋 Complete Test Flow

### Step 1: Verify Your Account
```
URL: http://localhost:3000/dashboard/verify
Test Code: 20250315-12345
```

### Step 2: Go to Payment
```
URL: http://localhost:3000/dashboard/payment
```

### Step 3: Initiate Payment
- Check agreement checkbox
- Click "Ödeme Yap (299.99 TRY)"

### Step 4: iyzico Payment Page
You'll be redirected to iyzico's payment form:

**Fill in the form:**
- Card Number: `5528 7900 0000 0003` (Mastercard success)
- Expiry: `12/30`
- CVV: `123`
- Cardholder Name: Your name

**Click "Ödeme Yap" (Pay)**

### Step 5: 3D Secure Confirmation
- Automatic 3D Secure screen appears
- Click **"Onayla"** (Confirm) button

### Step 6: Callback & Completion
- Redirected back to your app
- Payment verified with iyzico
- User status updated: `verified` → `active`
- See "Premium Aktif" banner! 🎉

---

## 🔍 Testing Different Scenarios

### Test Success Flow
1. Use Mastercard: `5528 7900 0000 0003`
2. Complete payment
3. Should see "Premium Aktif"

### Test Failure Flow
1. Use Insufficient Funds card: `5406 6700 0000 0009`
2. Try to pay
3. Should see error message
4. Stay on payment page

### Test Multiple Payments
1. Complete first payment successfully
2. Go to payment page again
3. Try another payment
4. Both should appear in payment history

---

## 💡 Important Notes

### Sandbox vs Production

| Environment | URL | Purpose |
|------------|-----|---------|
| **Sandbox** | `https://sandbox-api.iyzipay.com` | Testing (use test cards) |
| **Production** | `https://api.iyzipay.com` | Real payments (real cards) |

### Current Setup
- ✅ Using **Sandbox** environment
- ✅ Only test cards work
- ✅ No real money involved
- ✅ Free to test unlimited times

### Switching to Production
When ready for real payments:

1. Register at: **https://merchant.iyzipay.com/**
2. Complete merchant verification
3. Get production API keys
4. Update `.env.local`:
   ```bash
   IYZICO_API_KEY="production-api-key"
   IYZICO_SECRET_KEY="production-secret-key"
   IYZICO_BASE_URL="https://api.iyzipay.com"
   ```

---

## 🐛 Troubleshooting

### Error: "API key not found"
- Check `.env.local` has correct iyzico credentials
- Restart dev server after changing env vars

### Error: "Invalid credentials"
- Verify API key and secret key are correct
- Make sure you're using **sandbox** credentials with sandbox URL

### Payment stuck on loading
- Check browser console for errors
- Verify callback URL is correct: `http://localhost:3000/api/payment/callback`
- Check network tab for API responses

### 3D Secure not appearing
- This is normal in some cases
- Some test cards skip 3D Secure
- Click "Pay" button on iyzico form

---

## 📊 Database Check

After successful payment:

**Check payments table:**
```sql
SELECT
    id,
    amount,
    status,
    transaction_id,
    paid_at
FROM payments
WHERE status = 'completed'
ORDER BY created_at DESC;
```

**Check users table:**
```sql
SELECT
    id,
    name,
    account_status,
    paid_periods
FROM users
WHERE account_status = 'active';
```

---

## 🎯 Quick Reference

**Most Used Success Card:**
```
5528 7900 0000 0003 | 12/30 | 123
```

**Quick Failure Test:**
```
5406 6700 0000 0009 | 12/30 | 123
```

**iyzico Sandbox Dashboard:**
```
https://sandbox-merchant.iyzipay.com/
```

---

## 🔗 Official Resources

- **iyzico Sandbox**: https://sandbox-merchant.iyzipay.com/
- **iyzico Documentation**: https://dev.iyzipay.com/
- **Test Cards**: https://dev.iyzipay.com/tr/test-kartlari
- **API Reference**: https://dev.iyzipay.com/tr/api

---

Happy Testing! 🚀


✅ Recommended Test Cards (2025)

  Option 1 - Akbank Mastercard (Credit):
  Card Number:  5526080000000006
  Expiry Date:  12/30 (any future date)
  CVV:          123 (any 3 digits)
  Cardholder:   Your Name

  Option 2 - Halkbank Mastercard (Credit):
  Card Number:  5528790000000008
  Expiry Date:  12/30
  CVV:          123
  Cardholder:   Your Name

  Option 3 - Denizbank Visa (Credit):
  Card Number:  4603450000000000
  Expiry Date:  12/30
  CVV:          123
  Cardholder:   Your Name