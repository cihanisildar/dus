import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Logout error:", error);
            return NextResponse.json(
                { error: "Çıkış yapılamadı" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Çıkış başarılı",
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Sunucu hatası" },
            { status: 500 }
        );
    }
}
