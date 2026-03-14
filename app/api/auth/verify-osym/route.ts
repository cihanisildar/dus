import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { examPeriods } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createVerification } from "@/lib/db/transactions";

// ─── Mock mode (OSYM_MOCK_ENABLED=true in .env.local only) ───────────────────
const MOCK_DATA: Record<string, {
    dusScore: number; examDate: number;
    basicSciencesCorrect: number; basicSciencesWrong: number;
    clinicalSciencesCorrect: number; clinicalSciencesWrong: number;
    ranking: number; totalCandidates: number;
}> = {
    "A1B2C3D4E5": { dusScore: 74.52, examDate: new Date("2025-03-15").getTime(), basicSciencesCorrect: 22, basicSciencesWrong: 2, clinicalSciencesCorrect: 74, clinicalSciencesWrong: 5, ranking: 234, totalCandidates: 3926 },
    "F6G7H8I9J0": { dusScore: 82.15, examDate: new Date("2025-03-15").getTime(), basicSciencesCorrect: 24, basicSciencesWrong: 0, clinicalSciencesCorrect: 78, clinicalSciencesWrong: 1, ranking: 89, totalCandidates: 3926 },
    "K1L2M3N4O5": { dusScore: 65.30, examDate: new Date("2025-03-15").getTime(), basicSciencesCorrect: 18, basicSciencesWrong: 6, clinicalSciencesCorrect: 68, clinicalSciencesWrong: 11, ranking: 1250, totalCandidates: 3926 },
};

function getMockData(belgeKodu: string) {
    if (MOCK_DATA[belgeKodu]) return MOCK_DATA[belgeKodu];
    return {
        dusScore: 65.5 + Math.random() * 30,
        examDate: new Date("2025-03-15").getTime(),
        basicSciencesCorrect: Math.floor(15 + Math.random() * 10),
        basicSciencesWrong: Math.floor(Math.random() * 9),
        clinicalSciencesCorrect: Math.floor(60 + Math.random() * 20),
        clinicalSciencesWrong: Math.floor(Math.random() * 19),
        ranking: Math.floor(1 + Math.random() * 3000),
        totalCandidates: 3926,
    };
}
// ─────────────────────────────────────────────────────────────────────────────

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
        const { belgeKodu } = body;

        if (!belgeKodu || String(belgeKodu).trim().length < 8) {
            return NextResponse.json(
                { error: "Sonuç Belgesi Kontrol Kodu en az 8 karakter olmalıdır." },
                { status: 400 }
            );
        }

        const kod = String(belgeKodu).trim().toUpperCase();

        // Get active exam period
        const activePeriod = await db.query.examPeriods.findFirst({
            where: eq(examPeriods.isActive, true),
        });

        if (!activePeriod) {
            return NextResponse.json(
                { error: "Şu anda aktif bir sınav dönemi bulunmamaktadır." },
                { status: 400 }
            );
        }

        // Get verification data
        let verificationData;

        if (process.env.OSYM_MOCK_ENABLED === 'true') {
            verificationData = getMockData(kod);
        } else {
            /**
             * ÖSYM does not provide a public API.
             * Their belgekontrol.aspx page requires a CAPTCHA.
             * Like TUSBuddy and all similar Turkish exam apps, scores are self-reported.
             *
             * Production path: after each DUS exam, import ÖSYM's published
             * min/max score tables to validate that the submitted score is
             * within the plausible range for that exam period.
             */
            return NextResponse.json(
                { error: "ÖSYM doğrulama sistemi henüz aktif değil. Lütfen daha sonra tekrar deneyin." },
                { status: 503 }
            );
        }

        const userName = user.user_metadata?.name || user.email?.split('@')[0] || undefined;

        await createVerification({
            userId: user.id,
            periodId: activePeriod.id,
            osymResultCode: kod,
            dusScore: Math.round(verificationData.dusScore * 100),
            examDate: new Date(verificationData.examDate),
            userName,
            basicSciencesCorrect: verificationData.basicSciencesCorrect,
            basicSciencesWrong: verificationData.basicSciencesWrong,
            clinicalSciencesCorrect: verificationData.clinicalSciencesCorrect,
            clinicalSciencesWrong: verificationData.clinicalSciencesWrong,
            ranking: verificationData.ranking,
            totalCandidates: verificationData.totalCandidates,
        });

        return NextResponse.json({
            success: true,
            message: "ÖSYM doğrulaması başarılı!",
            data: {
                dusScore: verificationData.dusScore,
                examDate: verificationData.examDate,
                periodName: activePeriod.displayName,
            },
        });

    } catch (error: any) {
        if (error?.cause?.code === '23505') {
            return NextResponse.json(
                { error: "Bu dönem için doğrulama zaten yapılmıştır." },
                { status: 409 }
            );
        }
        console.error("ÖSYM verification error:", error);
        return NextResponse.json(
            { error: "Doğrulama sırasında bir hata oluştu." },
            { status: 500 }
        );
    }
}
