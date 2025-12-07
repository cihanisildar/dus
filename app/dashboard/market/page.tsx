import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
    TrendingUp,
    TrendingDown,
    MapPin,
    BarChart3
} from "lucide-react";
import { marketQueries } from "@/lib/db/queries/market";
import { periodQueries } from "@/lib/db/queries/periods";

export default async function MarketPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get active period
    const activePeriod = await periodQueries.getActive();

    if (!activePeriod) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                            Piyasa Analizi
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            Trendler, rekabet oranları ve piyasa içgörüleri
                        </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <p className="text-yellow-800">Aktif bir sınav dönemi bulunamadı.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Fetch market analytics
    const [mostCompetitiveSpecialties, leastCompetitiveSpecialties, mostCompetitiveCities] = await Promise.all([
        marketQueries.getMostCompetitiveSpecialties(activePeriod.id),
        marketQueries.getLeastCompetitiveSpecialties(activePeriod.id),
        marketQueries.getMostCompetitiveCities(activePeriod.id),
    ]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 pt-16 md:pt-8">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                        <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        Piyasa Analizi
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        Trendler, rekabet oranları ve piyasa içgörüleri
                    </p>
                </div>

                {mostCompetitiveSpecialties.length === 0 && leastCompetitiveSpecialties.length === 0 && mostCompetitiveCities.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                        <p className="text-blue-800">Henüz piyasa verisi bulunmamaktadır.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Most Competitive Specialties */}
                        {mostCompetitiveSpecialties.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-red-600" />
                                    En Rekabetçi Dallar
                                </h2>
                                <div className="space-y-4">
                                    {mostCompetitiveSpecialties.map((specialty, idx) => (
                                        <div key={idx} className="p-4 bg-red-50 rounded-lg border border-red-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium text-gray-900">{specialty.name}</h3>
                                                <div className={`flex items-center gap-1 text-sm ${specialty.trend === "up" ? "text-red-600" : "text-green-600"}`}>
                                                    {specialty.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                    <span className="font-medium">{specialty.change > 0 ? "+" : ""}{specialty.change}%</span>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-red-600">{specialty.ratio}x</div>
                                            <p className="text-sm text-gray-600 mt-1">Başvuru/Kontenjan oranı</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Least Competitive Specialties */}
                        {leastCompetitiveSpecialties.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <TrendingDown className="w-5 h-5 text-green-600" />
                                    En Az Rekabetçi Dallar
                                </h2>
                                <div className="space-y-4">
                                    {leastCompetitiveSpecialties.map((specialty, idx) => (
                                        <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-medium text-gray-900">{specialty.name}</h3>
                                                <div className={`flex items-center gap-1 text-sm ${specialty.trend === "up" ? "text-red-600" : "text-green-600"}`}>
                                                    {specialty.trend === "up" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                    <span className="font-medium">{specialty.change > 0 ? "+" : ""}{specialty.change}%</span>
                                                </div>
                                            </div>
                                            <div className="text-2xl font-bold text-green-600">{specialty.ratio}x</div>
                                            <p className="text-sm text-gray-600 mt-1">Başvuru/Kontenjan oranı</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Most Competitive Cities */}
                        {mostCompetitiveCities.length > 0 && (
                            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    En Rekabetçi Şehirler
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {mostCompetitiveCities.map((city, idx) => (
                                        <div key={idx} className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{city.name}</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Program Sayısı</span>
                                                    <span className="font-semibold text-gray-900">{city.programs}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Ort. Rekabet</span>
                                                    <span className="font-semibold text-blue-600">{city.avgRatio}x</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600">Toplam Başvuru</span>
                                                    <span className="font-semibold text-gray-900">{city.applicants}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
