# Quick Test Guide

## Setup (First Time Only)

If you get "Şu anda aktif bir sınav dönemi bulunmamaktadır" error, run:
```bash
npm run db:seed-period
```

This creates an active exam period for testing. ✅

---

## Test ÖSYM Codes (Copy & Paste)

Use these codes at `/dashboard/verify`:

### 🏆 Top Performer
```
20250315-67890
```
Score: 82.15 | Rank: 89/3,926

### ⭐ High Performer
```
20250315-12345
```
Score: 74.52 | Rank: 234/3,926

### 📊 Average Performer
```
20250315-11111
```
Score: 65.30 | Rank: 1,250/3,926

---

**Or use any code in format:** `YYYYMMDD-XXXXX` for random data

## Quick Test Flow

1. Start dev server: `npm run dev`
2. Register account at: `http://localhost:3000/register`
3. Login at: `http://localhost:3000/login`
4. Go to verify page: `http://localhost:3000/dashboard/verify`
5. Paste one of the codes above
6. Click "Doğrula" (Verify)
7. See your complete results! ✅

## What You'll See

After verification, you'll see:
- ✅ Full name and exam date
- ✅ Test results (Basic Sciences & Clinical Sciences)
- ✅ DUS Score (formatted with 4 decimals)
- ✅ National ranking
- ✅ Total candidates
- ✅ ÖSYM result code

All data is saved to your database and will persist!
