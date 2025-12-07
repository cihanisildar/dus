import { NextRequest, NextResponse } from "next/server";
import { completePayment } from "@/lib/db/transactions";
import { iyzico } from "@/lib/iyzico/config";

const verifyIyzicoCallback = async (token: string): Promise<{
    status: string;
    paymentId: string;
    paidAt: number;
}> => {
    try {
        const request = { token, locale: 'tr' };
        const result = await iyzico.checkoutForm.retrieve(request);

        if (result.status === 'success' && result.paymentStatus === 'SUCCESS') {
            return {
                status: 'success',
                paymentId: result.paymentId,
                paidAt: Date.now(),
            };
        } else {
            throw new Error(result.errorMessage || 'Payment verification failed');
        }
    } catch (error) {
        console.error('iyzico verification error:', error);
        throw error;
    }
};

export async function POST(req: NextRequest) {
    try {
        // iyzico sends callback as form data, not JSON
        const formData = await req.formData();
        const token = formData.get('token') as string;

        if (!token) {
            return NextResponse.redirect(new URL('/dashboard/payment?error=token_missing', req.url));
        }

        // Verify payment with iyzico
        let verification;
        try {
            verification = await verifyIyzicoCallback(token);
        } catch (error) {
            console.error('Payment verification failed:', error);
            return NextResponse.redirect(new URL('/dashboard/payment?error=verification_failed', req.url));
        }

        if (verification.status !== "success") {
            return NextResponse.redirect(new URL('/dashboard/payment?error=verification_failed', req.url));
        }

        // Complete payment using transaction (atomic operation)
        // This updates payment status AND user status + paid periods
        try {
            await completePayment({
                paymentToken: token,
                transactionId: verification.paymentId,
                paidAt: new Date(verification.paidAt),
            });
        } catch (error) {
            console.error("Payment completion error:", error);
            return NextResponse.redirect(new URL('/dashboard/payment?error=completion_failed', req.url));
        }

        // Redirect to dashboard with success message
        return NextResponse.redirect(new URL('/dashboard?payment=success', req.url));
    } catch (error) {
        console.error("Payment callback error:", error);
        return NextResponse.redirect(new URL('/dashboard/payment?error=unknown', req.url));
    }
}
