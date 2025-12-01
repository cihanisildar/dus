import { NextRequest, NextResponse } from "next/server";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

// Mock iyzico callback verification
const verifyIyzicoCallback = async (token: string) => {
    // TODO: Implement with actual iyzico SDK
    // Verify the payment with iyzico
    return {
        status: "success",
        paymentId: "iyz-" + Date.now(),
        paidAt: Date.now(),
    };
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json(
                { error: "Payment token gereklidir" },
                { status: 400 }
            );
        }

        // Get payment record
        const payment = await convex.query(api.payments.getByToken, { token });

        if (!payment) {
            return NextResponse.json(
                { error: "Ödeme kaydı bulunamadı" },
                { status: 404 }
            );
        }

        // Verify payment with iyzico
        const verification = await verifyIyzicoCallback(token);

        if (verification.status !== "success") {
            // Update payment status to failed
            await convex.mutation(api.payments.updateStatus, {
                token,
                status: "failed",
            });

            return NextResponse.json(
                { error: "Ödeme doğrulanamadı" },
                { status: 400 }
            );
        }

        // Update payment status to completed
        await convex.mutation(api.payments.updateStatus, {
            token,
            status: "completed",
            transactionId: verification.paymentId,
            paidAt: verification.paidAt,
        });

        // Get user to update paid periods
        const user = await convex.query(api.users.getById, { id: payment.userId });

        if (!user) {
            return NextResponse.json(
                { error: "Kullanıcı bulunamadı" },
                { status: 404 }
            );
        }

        // Update user status to "active" and add to paid periods
        await convex.mutation(api.users.update, {
            id: payment.userId,
            accountStatus: "active",
            paidPeriods: [...user.paidPeriods, payment.periodId],
        });

        return NextResponse.json({
            success: true,
            message: "Ödeme başarıyla tamamlandı!",
            redirectUrl: "/dashboard",
        });
    } catch (error) {
        console.error("Payment callback error:", error);
        return NextResponse.json(
            { error: "Ödeme doğrulama sırasında bir hata oluştu" },
            { status: 500 }
        );
    }
}
