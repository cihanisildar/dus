import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { examPeriods } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createVerification } from "@/lib/db/transactions";

// Mock ÖSYM verification - Replace with actual ÖSYM API integration
const verifyOSYMCode = async (resultCode: string) => {
    // TODO: Implement actual ÖSYM API integration
    // For now, mock validation:
    // Format: YYYYMMDD-XXXXX (e.g., 20250315-12345)
    const codeRegex = /^\d{8}-\d{5}$/;

    if (!codeRegex.test(resultCode)) {
        return null;
    }

    // Test codes with realistic data
    const testData: Record<string, any> = {
        "20250315-12345": {
            dusScore: 74.52,
            examDate: new Date("2025-03-15").getTime(),
            basicSciencesCorrect: 22,
            basicSciencesWrong: 2,
            clinicalSciencesCorrect: 74,
            clinicalSciencesWrong: 5,
            ranking: 234,
            totalCandidates: 3926,
            isValid: true,
        },
        "20250315-67890": {
            dusScore: 82.15,
            examDate: new Date("2025-03-15").getTime(),
            basicSciencesCorrect: 24,
            basicSciencesWrong: 0,
            clinicalSciencesCorrect: 78,
            clinicalSciencesWrong: 1,
            ranking: 89,
            totalCandidates: 3926,
            isValid: true,
        },
        "20250315-11111": {
            dusScore: 65.30,
            examDate: new Date("2025-03-15").getTime(),
            basicSciencesCorrect: 18,
            basicSciencesWrong: 6,
            clinicalSciencesCorrect: 68,
            clinicalSciencesWrong: 11,
            ranking: 1250,
            totalCandidates: 3926,
            isValid: true,
        },
    };

    // Return test data if code matches, otherwise generate random data
    if (testData[resultCode]) {
        return testData[resultCode];
    }

    // For any other valid format code, generate realistic random data
    return {
        dusScore: 65.5 + Math.random() * 30, // Mock score 65-95
        examDate: new Date("2025-03-15").getTime(),
        basicSciencesCorrect: Math.floor(15 + Math.random() * 10), // 15-24
        basicSciencesWrong: Math.floor(Math.random() * 9), // 0-8
        clinicalSciencesCorrect: Math.floor(60 + Math.random() * 20), // 60-79
        clinicalSciencesWrong: Math.floor(Math.random() * 19), // 0-18
        ranking: Math.floor(1 + Math.random() * 3000), // 1-3000
        totalCandidates: 3926,
        isValid: true,
    };
};

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Oturum bulunamadı. Lütfen giriş yapın." },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { osymResultCode } = body;

        if (!osymResultCode) {
            return NextResponse.json(
                { error: "ÖSYM sonuç kodu gereklidir" },
                { status: 400 }
            );
        }

        // Verify ÖSYM code and get score
        const verification = await verifyOSYMCode(osymResultCode);

        if (!verification || !verification.isValid) {
            return NextResponse.json(
                { error: "Geçersiz ÖSYM sonuç kodu. Lütfen kontrol edip tekrar deneyin." },
                { status: 400 }
            );
        }

        // Get active exam period
        const activePeriod = await db.query.examPeriods.findFirst({
            where: eq(examPeriods.isActive, true),
        });

        if (!activePeriod) {
            return NextResponse.json(
                { error: "Şu anda aktif bir sınav dönemi bulunmamaktadır" },
                { status: 400 }
            );
        }

        const userId = user.id;

        // Get user name from Supabase metadata
        const userName = user.user_metadata?.name || user.email?.split('@')[0] || undefined;

        // Create verification using transaction (atomic operation)
        // This creates verification record AND updates user status
        await createVerification({
            userId,
            periodId: activePeriod.id,
            osymResultCode,
            dusScore: Math.round(verification.dusScore * 100), // Store as integer (6550 = 65.50)
            examDate: new Date(verification.examDate),
            userName,
            basicSciencesCorrect: verification.basicSciencesCorrect,
            basicSciencesWrong: verification.basicSciencesWrong,
            clinicalSciencesCorrect: verification.clinicalSciencesCorrect,
            clinicalSciencesWrong: verification.clinicalSciencesWrong,
            ranking: verification.ranking,
            totalCandidates: verification.totalCandidates,
        });

        return NextResponse.json({
            success: true,
            message: "ÖSYM doğrulaması başarılı!",
            data: {
                dusScore: verification.dusScore,
                examDate: verification.examDate,
                periodName: activePeriod.displayName,
            },
        });
    } catch (error) {
        console.error("ÖSYM verification error:", error);
        return NextResponse.json(
            { error: "Doğrulama sırasında bir hata oluştu" },
            { status: 500 }
        );
    }
}
