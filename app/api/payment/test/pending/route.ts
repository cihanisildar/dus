import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Oturum bulunamadı. Lütfen giriş yapın." },
                { status: 401 }
            );
        }

        // Get user's pending payments
        const pendingPayments = await db.query.payments.findMany({
            where: and(
                eq(payments.userId, user.id),
                eq(payments.status, 'pending')
            ),
        });

        return NextResponse.json({
            success: true,
            payments: pendingPayments,
        });
    } catch (error) {
        console.error("Error fetching pending payments:", error);
        return NextResponse.json(
            { error: "Ödemeler yüklenirken bir hata oluştu" },
            { status: 500 }
        );
    }
}
