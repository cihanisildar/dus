// Dashboard data fetching actions
// Called from Server Components only - no "use server" needed
// Middleware handles all auth/redirects

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { verificationQueries } from "@/lib/db/queries/verifications";
import { periodQueries } from "@/lib/db/queries/periods";

// Types
export type DashboardData = {
    user: {
        id: string;
        name: string | null;
        email: string;
        accountStatus: "registered" | "verified" | "active";
    };
    stats: {
        dusScore: number;
        preferencesFilled: number;
        totalPreferences: number;
        expectedPlacement: string;
        daysUntilDeadline: number;
        riskLevel: "balanced" | "ambitious" | "safe" | "incomplete";
        recentChanges: Array<{
            program: string;
            change: "up" | "down";
            percentage: number;
        }>;
        savedScenarios: number;
    };
};

/**
 * Ensure user exists in database (auto-provision if needed)
 * This handles cases where user exists in Supabase Auth but not in our DB
 */
async function ensureUserExists(authUser: SupabaseUser) {
    const existingUser = await db.query.users.findFirst({
        where: eq(users.id, authUser.id),
    });

    if (existingUser) {
        return existingUser;
    }

    // User doesn't exist - auto-provision them
    const [newUser] = await db.insert(users).values({
        id: authUser.id,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
        email: authUser.email!,
        phone: authUser.user_metadata?.phone || '',
        passwordHash: '', // Supabase handles auth
        accountStatus: 'registered',
        verifiedPeriods: [],
        paidPeriods: [],
    }).returning();

    console.log('[Dashboard] Auto-provisioned user in database:', authUser.email);
    return newUser;
}

/**
 * Calculate days until deadline
 */
function calculateDaysUntilDeadline(deadline: Date): number {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
}

/**
 * Fetch all dashboard data for a user
 * Single optimized query - no auth checks (middleware handles that)
 */
export const getDashboardData = cache(async (authUser: SupabaseUser): Promise<DashboardData | null> => {
    try {
        // Ensure user exists in database (auto-provision if needed)
        const user = await ensureUserExists(authUser);

        if (!user) {
            console.error('[getDashboardData] Failed to get/create user for userId:', authUser.id);
            return null;
        }

        // Get active exam period
        const activePeriod = await periodQueries.getActive();

        // Get user's verification for current period (if exists)
        let dusScore = 0;
        let verifiedPeriodId: string | null = null;

        if (activePeriod) {
            const verification = await verificationQueries.getByUserAndPeriod(user.id, activePeriod.id);
            if (verification) {
                dusScore = verification.dusScore / 100; // Convert from integer (6550) to decimal (65.50)
                verifiedPeriodId = activePeriod.id;
            }
        }

        // Calculate deadline countdown
        const daysUntilDeadline = activePeriod
            ? calculateDaysUntilDeadline(activePeriod.preferencesDeadline)
            : 0;

        // Get user's preferences count
        const { preferenceQueries } = await import("@/lib/db/queries/preferences");
        const preferencesFilled = activePeriod
            ? await preferenceQueries.getCount(user.id, activePeriod.id)
            : 0;
        const totalPreferences = 30;

        // TODO: Replace with real expected placement calculation
        const expectedPlacement = preferencesFilled > 0
            ? "Hesaplanıyor..."
            : "Henüz tercih girilmedi";

        // Calculate risk level based on preferences
        let riskLevel: "balanced" | "ambitious" | "safe" | "incomplete" = "incomplete";
        if (preferencesFilled >= 20) {
            riskLevel = "balanced"; // Will be calculated based on actual preferences later
        } else if (preferencesFilled >= 10) {
            riskLevel = "safe";
        }

        // TODO: Replace with real recent changes when preferences tracking is ready
        const recentChanges: Array<{ program: string; change: "up" | "down"; percentage: number }> = [];

        // TODO: Replace with real saved scenarios count
        const savedScenarios = 0;

        const stats = {
            dusScore,
            preferencesFilled,
            totalPreferences,
            expectedPlacement,
            daysUntilDeadline,
            riskLevel,
            recentChanges,
            savedScenarios,
        };

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                accountStatus: user.accountStatus as "registered" | "verified" | "active",
            },
            stats,
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return null;
    }
});
