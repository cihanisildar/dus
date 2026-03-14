import { Search } from "lucide-react";
import { requireActiveUser } from "@/lib/actions/auth";
import { programQueries } from "@/lib/db/queries/programs";
import { periodQueries } from "@/lib/db/queries/periods";
import { verificationQueries } from "@/lib/db/queries/verifications";
import { preferenceQueries } from "@/lib/db/queries/preferences";
import { ProgramsClient } from "@/components/programs/programs-client";

export default async function ProgramsPage() {
    const user = await requireActiveUser();

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

    // Fetch all programs for active period
    const programs = await programQueries.getByPeriod(activePeriod.id);

    // Get unique cities and specialties
    const cities = await programQueries.getCities(activePeriod.id);
    const specialties = await programQueries.getSpecialties(activePeriod.id);

    // Get user's current preferences to exclude them
    const userPreferences = await preferenceQueries.getByUserAndPeriod(user.id, activePeriod.id);
    const userPreferenceIds = userPreferences.map(p => p.programId);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                        <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        Program Arama
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Tüm programları keşfedin, filtreleyin ve karşılaştırın
                    </p>
                </div>

                <ProgramsClient
                    programs={programs}
                    userScore={userScore}
                    cities={cities}
                    specialties={specialties}
                    userPreferenceIds={userPreferenceIds}
                />
            </div>
        </div>
    );
}
