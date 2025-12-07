import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { scenarioQueries } from "@/lib/db/queries/scenarios";
import { periodQueries } from "@/lib/db/queries/periods";
import { preferenceQueries } from "@/lib/db/queries/preferences";
import { ScenariosClient } from "@/components/scenarios/scenarios-client";

export default async function ScenariosPage() {
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

    // Get active period
    const activePeriod = await periodQueries.getActive();
    if (!activePeriod) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-900 text-lg font-semibold mb-2">Aktif dönem bulunamadı</p>
                    <p className="text-gray-600">Lütfen daha sonra tekrar deneyin.</p>
                </div>
            </div>
        );
    }

    // Fetch user's scenarios
    const savedScenarios = await scenarioQueries.getByUserAndPeriod(authUser.id, activePeriod.id);

    // Check if user has preferences
    const userPreferences = await preferenceQueries.getByUserAndPeriod(authUser.id, activePeriod.id);
    const hasPreferences = userPreferences.length > 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                        <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                        Senaryo Analizi
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Farklı tercih stratejilerini test edin ve karşılaştırın
                    </p>
                </div>

                {/* Info Banner */}
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                    <div className="flex gap-3">
                        <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-purple-900 mb-1">Ne-Olursa Senaryoları</h3>
                            <p className="text-sm text-purple-800">
                                Farklı tercih listesi stratejileri oluşturun, test edin ve sonuçları karşılaştırın.
                                Bu özellik tercih sıralamanızı optimize etmenize yardımcı olur.
                            </p>
                        </div>
                    </div>
                </div>

                <ScenariosClient scenarios={savedScenarios} hasPreferences={hasPreferences} />
            </div>
        </div>
    );
}
