// User database queries
// Called from Server Components only - NO "use server" needed
// This avoids the server action proxy overhead

import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

/**
 * Get user's account status from database
 * Cached for performance within the same request
 */
export const getUserAccountStatus = cache(async (userId: string): Promise<"registered" | "verified" | "active" | null> => {
    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: {
                accountStatus: true,
            },
        });

        if (!user) {
            return null;
        }

        return user.accountStatus as "registered" | "verified" | "active";
    } catch (error) {
        console.error("Error fetching user account status:", error);
        return null;
    }
});
