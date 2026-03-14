# 🚀 Quick Start: Test Payment with iyzico

## ⚡ 3-Minute Setup

### 1. Get iyzico Sandbox Account (2 minutes)

1. Go to: **https://sandbox-merchant.iyzipay.com/**
2. Click **"Kayıt Ol"** (Register)
3. Fill in the form (use any test data)
4. Verify your email
5. Login to sandbox dashboard

### 2. Get API Keys (1 minute)

1. In sandbox dashboard, click **"Ayarlar"** (Settings) → **"API Anahtarları"** (API Keys)
2. You'll see:
   - **API Anahtarı** (API Key): `sandbox-xxxxx`
   - **Gizli Anahtar** (Secret Key): `sandbox-yyyyy`
3. Copy both values

### 3. Update .env.local

Replace the placeholder values in `.env.local`:

```bash
IYZICO_API_KEY="your-api-key-from-step-2"
IYZICO_SECRET_KEY="your-secret-key-from-step-2"
IYZICO_BASE_URL="https://sandbox-api.iyzipay.com"
```

### 4. Restart Server

```bash
# Stop dev server (Ctrl+C)
npm run dev
```

---

## ✅ Test Payment (2 minutes)

### Quick Test Flow:

1. **Verify ÖSYM**
   ```
   http://localhost:3000/dashboard/verify
   Code: 20250315-12345
   ```

2. **Go to Payment**
   ```
   http://localhost:3000/dashboard/payment
   Click "Ödeme Yap"
   ```

3. **iyzico Payment Form Opens**
   Use this test card:
   ```
   Card:     5528 7900 0000 0003
   Expiry:   12/30
   CVV:      123
   Name:     Your Name
   ```

4. **Click "Ödeme Yap"** on iyzico form

5. **3D Secure Screen** (auto-appears)
   - Click **"Onayla"** (Confirm)

6. **Done!** ✅
   - Redirected to dashboard
   - See "Premium Aktif" banner

---

## 🎯 Test Cards Quick Reference

**Success (Use This):**
```
5528 7900 0000 0003 | 12/30 | 123
```

**Failure (For Testing Errors):**
```
5406 6700 0000 0009 | 12/30 | 123
```

---

## 🐛 Quick Troubleshooting

**"API key not found" error?**
- Restart dev server after updating `.env.local`

**Payment not working?**
1. Check `.env.local` has your real API keys (not placeholder)
2. Make sure you're using **sandbox** keys (start with "sandbox-")
3. Check browser console for errors

**Still stuck?**
- Check `IYZICO_TEST_CARDS.md` for detailed guide
- Verify your sandbox account is active
- Make sure callback URL is correct

---

That's it! You're ready to test payments with real iyzico integration! 🎉
