import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users, examPeriods, payments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { iyzico, LOCALE, CURRENCY } from "@/lib/iyzico/config";

const initializeIyzicoPayment = async (paymentData: {
    amount: number;
    userId: string;
    periodId: string;
    userEmail: string;
    userName: string;
    userPhone: string;
}) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const conversationId = `dus360-${paymentData.userId}-${Date.now()}`;

    const request = {
        locale: LOCALE,
        conversationId,
        price: paymentData.amount.toFixed(2),
        paidPrice: paymentData.amount.toFixed(2),
        currency: CURRENCY,
        basketId: `basket-${Date.now()}`,
        paymentGroup: 'PRODUCT',
        callbackUrl: `${appUrl}/api/payment/callback`,
        enabledInstallments: [1], // Only single payment
        buyer: {
            id: paymentData.userId,
            name: paymentData.userName.split(' ')[0] || 'Ad',
            surname: paymentData.userName.split(' ').slice(1).join(' ') || 'Soyad',
            gsmNumber: paymentData.userPhone,
            email: paymentData.userEmail,
            identityNumber: '11111111111', // For testing - in production, collect from user
            registrationAddress: 'Adres bilgisi', // For testing
            ip: '85.34.78.112', // For testing - in production, get real IP
            city: 'Istanbul',
            country: 'Turkey',
            zipCode: '34000',
        },
        shippingAddress: {
            contactName: paymentData.userName,
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Adres bilgisi',
            zipCode: '34000',
        },
        billingAddress: {
            contactName: paymentData.userName,
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Adres bilgisi',
            zipCode: '34000',
        },
        basketItems: [
            {
                id: 'dus360-premium',
                name: 'DUS360 Premium Erişim',
                category1: 'Eğitim',
                category2: 'DUS Yerleştirme',
                itemType: 'VIRTUAL',
                price: paymentData.amount.toFixed(2),
            },
        ],
    };

    try {
        const result = await iyzico.checkoutFormInitialize.create(request);

        if (result.status === 'success') {
            return {
                status: 'success',
                paymentPageUrl: result.paymentPageUrl,
                token: result.token,
                conversationId: result.conversationId,
            };
        } else {
            throw new Error(result.errorMessage || 'Payment initialization failed');
        }
    } catch (error) {
        console.error('iyzico error:', error);
        throw error;
    }
};

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !authUser) {
            return NextResponse.json(
                { error: "Oturum bulunamadı. Lütfen giriş yapın." },
                { status: 401 }
            );
        }

        const userId = authUser.id;
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

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
        const activePeriod = await db.query.examPeriods.findFirst({
            where: eq(examPeriods.isActive, true),
        });

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
            userId: user.id,
            periodId: activePeriod.id,
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

        // Create payment record (amount stored as cents)
        await db.insert(payments).values({
            userId: user.id,
            periodId: activePeriod.id,
            amount: 29999, // 299.99 TRY as cents
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
