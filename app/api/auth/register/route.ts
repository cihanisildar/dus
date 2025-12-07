import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, password } = body;

        // Validation
        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                { error: "Tüm alanlar doldurulmalıdır" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Geçerli bir e-posta adresi girin" },
                { status: 400 }
            );
        }

        // Phone validation (Turkish format)
        const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
        if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
            return NextResponse.json(
                { error: "Geçerli bir telefon numarası girin" },
                { status: 400 }
            );
        }

        // Password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Şifre en az 8 karakter olmalıdır" },
                { status: 400 }
            );
        }

        // Check if user already exists in our custom users table
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Bu e-posta adresi zaten kullanılıyor" },
                { status: 409 }
            );
        }

        // Create user in Supabase Auth
        const supabase = await createClient();
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    phone,
                },
            },
        });

        if (authError) {
            console.error("Supabase Auth error:", authError);
            return NextResponse.json(
                { error: authError.message || "Kayıt başarısız" },
                { status: 400 }
            );
        }

        if (!authData.user) {
            return NextResponse.json(
                { error: "Kullanıcı oluşturulamadı" },
                { status: 500 }
            );
        }

        // Create user in our custom users table
        // Note: passwordHash is empty because Supabase Auth handles authentication
        const [newUser] = await db.insert(users).values({
            id: authData.user.id, // Use Supabase Auth user ID
            name,
            email,
            phone,
            passwordHash: "", // Supabase Auth handles password
            accountStatus: "registered",
            verifiedPeriods: [],
            paidPeriods: [],
        }).returning();

        const userId = newUser.id;

        return NextResponse.json(
            {
                success: true,
                message: "Kayıt başarılı! Şimdi giriş yapabilirsiniz.",
                userId,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Kayıt sırasında bir hata oluştu" },
            { status: 500 }
        );
    }
}
