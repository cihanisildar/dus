# Test Data for ÖSYM Verification

This document contains test ÖSYM result codes you can use to verify the system is working correctly.

## How to Use

1. Go to `/dashboard/verify`
2. Enter one of the test codes below
3. Click "Doğrula" (Verify)
4. The system will save the verification data to the database
5. You'll see your results displayed with all the details

## Test ÖSYM Result Codes

### Code 1: High Performer
```
20250315-12345
```
**Details:**
- DUS Score: 74.52
- Exam Date: March 15, 2025
- Basic Sciences: 22 correct, 2 wrong
- Clinical Sciences: 74 correct, 5 wrong
- Ranking: 234 out of 3,926
- Total Candidates: 3,926

---

### Code 2: Top Performer
```
20250315-67890
```
**Details:**
- DUS Score: 82.15
- Exam Date: March 15, 2025
- Basic Sciences: 24 correct, 0 wrong
- Clinical Sciences: 78 correct, 1 wrong
- Ranking: 89 out of 3,926
- Total Candidates: 3,926

---

### Code 3: Average Performer
```
20250315-11111
```
**Details:**
- DUS Score: 65.30
- Exam Date: March 15, 2025
- Basic Sciences: 18 correct, 6 wrong
- Clinical Sciences: 68 correct, 11 wrong
- Ranking: 1,250 out of 3,926
- Total Candidates: 3,926

---

## Random Data Generator

Any ÖSYM code in the format `YYYYMMDD-XXXXX` will work and generate realistic random data:
- Format: 8 digits (date), dash, 5 digits (code)
- Example: `20250315-99999`

The system will generate:
- Random DUS score between 65.5 and 95.5
- Random test results
- Random ranking between 1 and 3,000

## Database Setup

### Step 1: Add Columns (Already Done ✅)

The database columns have already been added!

The following columns were added to the `osym_verifications` table:
- `user_name`
- `basic_sciences_correct`
- `basic_sciences_wrong`
- `clinical_sciences_correct`
- `clinical_sciences_wrong`
- `ranking`
- `total_candidates`

If you need to add them again (e.g., on a different environment), run:
```bash
npm run db:add-columns
```

### Step 2: Create Active Exam Period (Required for Testing!)

Before you can test verification, you need an active exam period:

```bash
npm run db:seed-period
```

This creates a "2025 İlkbahar DUS" exam period and marks it as active. Without this, you'll get the error: "Şu anda aktif bir sınav dönemi bulunmamaktadır"

## Testing the Complete Flow

1. **Register** a new account at `/register`
2. **Login** at `/login`
3. **Go to Dashboard** - You'll see you need to verify
4. **Click "Verify ÖSYM"** or go to `/dashboard/verify`
5. **Enter test code** (e.g., `20250315-12345`)
6. **View Results** - All details should display
7. **Check Database** - Verification record should be saved with all fields

## What Gets Saved

The following fields are saved to the `osym_verifications` table:
- `id` - UUID
- `userId` - User UUID (from Supabase Auth)
- `periodId` - Active exam period UUID
- `osymResultCode` - The code you entered
- `dusScore` - Stored as integer (7452 = 74.52)
- `examDate` - Date of exam
- `userName` - User's name from Supabase metadata or email
- `basicSciencesCorrect` - Number of correct answers
- `basicSciencesWrong` - Number of wrong answers
- `clinicalSciencesCorrect` - Number of correct answers
- `clinicalSciencesWrong` - Number of wrong answers
- `ranking` - Candidate ranking
- `totalCandidates` - Total number of candidates
- `verifiedAt` - Timestamp of verification
- `createdAt` - Record creation timestamp

## Notes

- Each user can only verify once per exam period
- The user's account status changes from 'registered' to 'verified'
- After verification, you'll be redirected to the payment page
- All test codes use the same exam date: March 15, 2025
