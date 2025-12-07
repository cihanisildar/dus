"use server";

// User authentication actions
// These are called from client-side hooks (useUser)
// So they need "use server" at the file level

import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import { userQueries } from "@/lib/db/queries/users";
import { verificationQueries } from "@/lib/db/queries/verifications";
import { periodQueries } from "@/lib/db/queries/periods";
import type { OsymVerification } from "@/lib/db/schema";

export async function getCurrentUser(): Promise<User | null> {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error("Error fetching user:", error);
            return null;
        }

        return user;
    } catch (error) {
        console.error("Unexpected error in getCurrentUser:", error);
        return null;
    }
}

export async function getUserSession() {
    try {
        const supabase = await createClient();
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error("Error fetching session:", error);
            return null;
        }

        return session;
    } catch (error) {
        console.error("Unexpected error in getUserSession:", error);
        return null;
    }
}

export async function getUserVerificationStatus(): Promise<{
    isVerified: boolean;
    verification?: OsymVerification;
} | null> {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return null;
        }

        // Get user's database record to find their current period
        const dbUser = await userQueries.getById(user.id);
        if (!dbUser) {
            return null;
        }

        // Get the current period if not set on user
        const periodId = dbUser.currentPeriodId || (await periodQueries.getActive())?.id;
        if (!periodId) {
            return { isVerified: false };
        }

        // Check if user has verification for this period
        const verification = await verificationQueries.getByUserAndPeriod(user.id, periodId);

        return {
            isVerified: !!verification,
            verification: verification || undefined,
        };
    } catch (error) {
        console.error("Error fetching user verification status:", error);
        return null;
    }
}

export async function getActiveExamPeriod() {
    try {
        const activePeriod = await periodQueries.getActive();
        return activePeriod || null;
    } catch (error) {
        console.error("Error fetching active exam period:", error);
        return null;
    }
}
