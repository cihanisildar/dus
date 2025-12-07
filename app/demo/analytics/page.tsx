import {
    BarChart3,
    TrendingUp,
    Target,
    Users,
    Award,
    Activity,
    Percent
} from "lucide-react";

export default function DemoAnalyticsPage() {
    // Mock analytics data
    const userScore = 67.5;
    const totalCandidates = 1247;
    const userRank = 423;
    const percentile = ((totalCandidates - userRank) / totalCandidates * 100).toFixed(1);

    const preferenceAnalytics = [
        {
            rank: 1,
            program: "İstanbul Ü. - Ortodonti",
            city: "İstanbul",
            probability: 85,
            yourScore: 67.5,
            estimatedCutoff: 65.2,
            scoreGap: 2.3,
            competitorCount: 42,
            spotsAvailable: 3,
            higherScoredApplicants: 28
        },
        {
            rank: 2,
            program: "Ankara Ü. - Endodonti",
            city: "Ankara",
            probability: 92,
            yourScore: 67.5,
            estimatedCutoff: 62.8,
            scoreGap: 4.7,
            competitorCount: 35,
            spotsAvailable: 4,
            higherScoredApplicants: 18
        }
    ];

    const scoreDistribution = [
        { range: "75+", count: 142, percentage: 11.4 },
        { range: "70-74", count: 289, percentage: 23.2 },
        { range: "65-69", count: 398, percentage: 31.9 },
        { range: "60-64", count: 276, percentage: 22.1 },
        { range: "55-59", count: 142, percentage: 11.4 }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                        <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                        Detaylı Analiz
                    </h1>
                    <p className="text-gray-600">
                        Tercihleriniz ve yerleştirme olasılıklarınız hakkında detaylı istatistikler
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-100">DUS Puanınız</span>
                            <Target className="w-4 h-4 text-blue-200" />
                        </div>
                        <div className="text-3xl font-bold">{userScore}</div>
                        <p className="text-xs text-blue-100 mt-1">Doğrulanmış</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-100">Sıralamanız</span>
                            <Award className="w-4 h-4 text-green-200" />
                        </div>
                        <div className="text-3xl font-bold">{userRank}</div>
                        <p className="text-xs text-green-100 mt-1">/ {totalCandidates} aday</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-purple-100">Yüzdelik Diliminiz</span>
                            <Percent className="w-4 h-4 text-purple-200" />
                        </div>
                        <div className="text-3xl font-bold">{percentile}%</div>
                        <p className="text-xs text-purple-100 mt-1">Üst dilim</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-orange-100">Toplam Aday</span>
                            <Users className="w-4 h-4 text-orange-200" />
                        </div>
                        <div className="text-3xl font-bold">{totalCandidates}</div>
                        <p className="text-xs text-orange-100 mt-1">Aktif kullanıcı</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column - Preference Analysis */}
                    <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                        {/* Detailed Preference Analysis */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="p-4 sm:p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Tercih Bazlı Analiz
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Her tercihiniz için detaylı yerleştirme analizi
                                </p>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {preferenceAnalytics.map((pref) => (
                                    <div key={pref.rank} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 font-bold flex items-center justify-center flex-shrink-0">
                                                    {pref.rank}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{pref.program}</h3>
                                                    <p className="text-sm text-gray-600">{pref.city}</p>
                                                </div>
                                            </div>
                                            <div className={`text-2xl font-bold ${pref.probability >= 90 ? "text-green-600" : pref.probability >= 70 ? "text-blue-600" : "text-yellow-600"}`}>
                                                {pref.probability}%
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-600 mb-1">Puanınız</p>
                                                <p className="text-lg font-bold text-gray-900">{pref.yourScore}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-600 mb-1">Taban Puan</p>
                                                <p className="text-lg font-bold text-gray-900">{pref.estimatedCutoff}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-600 mb-1">Puan Farkı</p>
                                                <p className="text-lg font-bold text-green-600">+{pref.scoreGap}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <p className="text-xs text-gray-600 mb-1">Kontenjan</p>
                                                <p className="text-lg font-bold text-gray-900">{pref.spotsAvailable}</p>
                                            </div>
                                        </div>

                                        {/* Competition Analysis */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <div className="flex items-start gap-2">
                                                <Activity className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                                <div className="text-sm">
                                                    <p className="text-blue-900 font-medium mb-1">Rekabet Analizi</p>
                                                    <p className="text-blue-800">
                                                        <span className="font-semibold">{pref.higherScoredApplicants}</span> aday
                                                        daha yüksek puana sahip. Toplam <span className="font-semibold">{pref.competitorCount}</span> başvuru
                                                        var ve <span className="font-semibold">{pref.spotsAvailable}</span> kontenjan mevcut.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Score Distribution */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Puan Dağılımı
                            </h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Tüm adayların puan dağılımı ve sizin konumunuz
                            </p>

                            <div className="space-y-3">
                                {scoreDistribution.map((dist, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="font-medium text-gray-700">{dist.range}</span>
                                            <span className="text-gray-600">
                                                {dist.count} aday ({dist.percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`h-3 rounded-full ${dist.range === "65-69" ? "bg-blue-600" : "bg-gray-300"}`}
                                                style={{ width: `${dist.percentage * 3}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
                                <Target className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                <p className="text-sm text-blue-900">
                                    Siz <span className="font-semibold">65-69</span> puan aralığındasınız
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Insights */}
                    <div className="space-y-4 sm:space-y-6">
                        {/* Expected Placement */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Award className="w-5 h-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">Beklenen Yerleşme</h3>
                            </div>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                                Ankara Ü. - Endodonti
                            </p>
                            <p className="text-xs text-gray-600 mb-3">2. Tercih - 92% olasılık</p>
                            <div className="flex items-center gap-1 text-green-600">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-medium">Çok yüksek olasılık</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
