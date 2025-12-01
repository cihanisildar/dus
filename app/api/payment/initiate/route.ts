import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

// Mock iyzico integration - Replace with actual iyzico SDK
const initializeIyzicoPayment = async (paymentData: {
    amount: number;
    userId: string;
    periodId: string;
    userEmail: string;
    userName: string;
    userPhone: string;
}) => {
    // TODO: Implement with actual iyzico SDK
    // For now, return mock data
    return {
        status: "success",
        paymentPageUrl: "/payment/checkout", // Mock checkout page
        token: "mock-payment-token-" + Date.now(),
        conversationId: "conv-" + Date.now(),
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

        const userId = (session.user as { id: string }).id;
        const user = await convex.query(api.users.getById, { id: userId });

        if (!user) {
            return NextResponse.json(
                { error: "Kullanıcı bulunamadı" },
                { status: 404 }
            );
        }

        // Check if user is verified
        if (user.accountStatus !== "verified") {
            return NextResponse.json(
                { error: "Önce ÖSYM doğrulaması yapmalısınız" },
                { status: 400 }
            );
        }

        // Get active period
        const activePeriod = await convex.query(api.periods.getActive, {});

        if (!activePeriod) {
            return NextResponse.json(
                { error: "Aktif sınav dönemi bulunamadı" },
                { status: 400 }
            );
        }

        // Get request headers for metadata
        const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
        const userAgent = req.headers.get("user-agent") || "unknown";

        // Initialize payment with iyzico
        const iyzicoResponse = await initializeIyzicoPayment({
            amount: 299.99, // Price in TRY
            userId: user._id,
            periodId: activePeriod._id,
            userEmail: user.email,
            userName: user.name,
            userPhone: user.phone,
        });

        if (iyzicoResponse.status !== "success") {
            return NextResponse.json(
                { error: "Ödeme başlatma işlemi başarısız oldu" },
                { status: 500 }
            );
        }

        // Create payment record
        await convex.mutation(api.payments.create, {
            userId: user._id,
            periodId: activePeriod._id,
            amount: 299.99,
            currency: "TRY",
            status: "pending",
            provider: "iyzico",
            transactionId: "",
            paymentToken: iyzicoResponse.token,
            conversationId: iyzicoResponse.conversationId,
            metadata: { ip, userAgent },
        });

        return NextResponse.json({
            success: true,
            paymentUrl: iyzicoResponse.paymentPageUrl,
            token: iyzicoResponse.token,
        });
    } catch (error) {
        console.error("Payment initiation error:", error);
        return NextResponse.json(
            { error: "Ödeme başlatma sırasında bir hata oluştu" },
            { status: 500 }
        );
    }
}
