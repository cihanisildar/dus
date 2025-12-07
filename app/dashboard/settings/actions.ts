"use server";

import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface UpdateProfileData {
    name: string;
    phone: string;
}

export interface ActionResponse {
    success: boolean;
    message: string;
}

export async function updateProfile(data: UpdateProfileData): Promise<ActionResponse> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return {
                success: false,
                message: "Oturum bulunamadı. Lütfen tekrar giriş yapın.",
            };
        }

        // Validate input
        if (!data.name || data.name.trim().length === 0) {
            return {
                success: false,
                message: "İsim alanı boş bırakılamaz.",
            };
        }

        if (!data.phone || data.phone.trim().length === 0) {
            return {
                success: false,
                message: "Telefon alanı boş bırakılamaz.",
            };
        }

        // Basic phone validation (Turkish format)
        const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
        if (!phoneRegex.test(data.phone.replace(/\s/g, ""))) {
            return {
                success: false,
                message: "Geçerli bir telefon numarası giriniz.",
            };
        }

        // Update user in database
        await db
            .update(users)
            .set({
                name: data.name.trim(),
                phone: data.phone.trim(),
                updatedAt: new Date(),
            })
            .where(eq(users.id, user.id));

        // Revalidate the settings page
        revalidatePath("/dashboard/settings");

        return {
            success: true,
            message: "Profil bilgileriniz başarıyla güncellendi.",
        };
    } catch (error) {
        console.error("Error updating profile:", error);
        return {
            success: false,
            message: "Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.",
        };
    }
}
