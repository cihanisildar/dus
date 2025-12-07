import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ListChecks, Info } from "lucide-react";
import { preferenceQueries } from "@/lib/db/queries/preferences";
import { programQueries } from "@/lib/db/queries/programs";
import { periodQueries } from "@/lib/db/queries/periods";
import { verificationQueries } from "@/lib/db/queries/verifications";
import { PreferencesClient } from "@/components/preferences/preferences-client";

export default async function PreferencesPage() {
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

    // Get user's DUS score
    const verification = await verificationQueries.getByUserAndPeriod(user.id, activePeriod.id);
    const userScore = verification ? verification.dusScore / 100 : 0;

    // Fetch user's current preferences
    const userPreferences = await preferenceQueries.getByUserAndPeriod(user.id, activePeriod.id);

    // Fetch available programs
    const availablePrograms = await programQueries.getByPeriod(activePeriod.id);

    // Get risk distribution
    const riskDistribution = await preferenceQueries.getRiskDistribution(user.id, activePeriod.id);

    const maxPreferences = 30;
    const currentPreferenceCount = userPreferences.length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Add padding-top on mobile for menu button */}
            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="mb-4">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                            <ListChecks className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                            Tercih Listem
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            En fazla {maxPreferences} tercih yapabilirsiniz. Sıralamanız önemlidir.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <span className="text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200">
                            DUS Puanınız: <span className="text-blue-600 font-bold">{userScore.toFixed(1)}</span>
                        </span>
                        <span className="text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200">
                            Tercih: <span className="text-blue-600 font-bold">{currentPreferenceCount}/{maxPreferences}</span>
                        </span>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 mb-6">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">ÖSYM Yerleştirme Sistemi Kuralı:</p>
                        <p>
                            Yerleştirmede en önemli faktör DUS puanınızdır. Daha yüksek puana sahip adaylar,
                            tercih sıralamasından bağımsız olarak önceliklidir. Tercih sıralaması sadece
                            eşit puanda devreye girer.
                        </p>
                    </div>
                </div>

                <PreferencesClient
                    initialPreferences={userPreferences}
                    availablePrograms={availablePrograms}
                    userScore={userScore}
                    maxPreferences={maxPreferences}
                    riskDistribution={riskDistribution}
                />
            </div>
        </div>
    );
}
