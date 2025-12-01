import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

// Mock ÖSYM verification - Replace with actual ÖSYM API integration
const verifyOSYMCode = async (resultCode: string) => {
    // TODO: Implement actual ÖSYM API integration
    // For now, mock validation:
    // Format: YYYYMMDD-XXXXX (e.g., 20250315-12345)
    const codeRegex = /^\d{8}-\d{5}$/;

    if (!codeRegex.test(resultCode)) {
        return null;
    }

    // Mock DUS score retrieval
    return {
        dusScore: 65.5 + Math.random() * 30, // Mock score 65-95
        examDate: new Date("2025-03-15").getTime(),
        isValid: true,
    };
};

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
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
        const activePeriod = await convex.query(api.periods.getActive, {});

        if (!activePeriod) {
            return NextResponse.json(
                { error: "Şu anda aktif bir sınav dönemi bulunmamaktadır" },
                { status: 400 }
            );
        }

        const userId = (session.user as { id: string }).id;

        // Save verification
        await convex.mutation(api.verifications.create, {
            userId,
            periodId: activePeriod._id,
            osymResultCode,
            dusScore: verification.dusScore,
            examDate: verification.examDate,
        });

        // Get current user to add to verified periods array
        const user = await convex.query(api.users.getById, { id: userId });

        if (!user) {
            return NextResponse.json(
                { error: "Kullanıcı bulunamadı" },
                { status: 404 }
            );
        }

        // Update user status to "verified" and add period to verified periods
        await convex.mutation(api.users.update, {
            id: userId,
            accountStatus: "verified",
            currentPeriodId: activePeriod._id,
            verifiedPeriods: [...user.verifiedPeriods, activePeriod._id],
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
