import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BarChart3 } from "lucide-react";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAnalyticsData } from "@/lib/actions/analytics-actions";
import { AnalyticsClient } from "@/components/analytics/analytics-client";

export default async function AnalyticsPage() {
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
        redirect("/login");
    }

    // Fetch user data from custom users table
    const user = await db.query.users.findFirst({
        where: eq(users.id, authUser.id)
    });

    if (!user) {
        redirect("/login");
    }

    const accountStatus = user.accountStatus;

    // Only active users can access this page
    if (accountStatus !== "active") {
        redirect("/dashboard");
    }

    // Fetch analytics data
    const analyticsResult = await getAnalyticsData();

    if (!analyticsResult.success) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-900 text-lg font-semibold mb-2">Bir hata oluştu</p>
                    <p className="text-gray-600">{analyticsResult.error}</p>
                </div>
            </div>
        );
    }

    const analyticsData = analyticsResult.data;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                        <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        Detaylı Analiz
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Tercihleriniz ve yerleştirme olasılıklarınız hakkında detaylı istatistikler
                    </p>
                </div>

                <AnalyticsClient analyticsData={analyticsData} />
            </div>
        </div>
    );
}
