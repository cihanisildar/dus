import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { convex } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

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

        // Check if user already exists
        const existingUser = await convex.query(api.users.getByEmail, { email });
        if (existingUser) {
            return NextResponse.json(
                { error: "Bu e-posta adresi zaten kullanılıyor" },
                { status: 409 }
            );
        }

        // Hash password
        const passwordHash = await hash(password, 12);

        // Create user
        const userId = await convex.mutation(api.users.create, {
            name,
            email,
            phone,
            passwordHash,
        });

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
