import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: "E-posta ve şifre gereklidir" },
                { status: 400 }
            );
        }

        // Sign in with Supabase Auth
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Login error:", error);
            return NextResponse.json(
                { error: "Geçersiz e-posta veya şifre" },
                { status: 401 }
            );
        }

        if (!data.user) {
            return NextResponse.json(
                { error: "Giriş başarısız" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Giriş başarılı",
                user: {
                    id: data.user.id,
                    email: data.user.email,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Sunucu hatası" },
            { status: 500 }
        );
    }
}
