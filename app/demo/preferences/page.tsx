import {
    ListChecks,
    GripVertical,
    Plus,
    Trash2,
    AlertCircle,
    CheckCircle2,
    Target,
    Info
} from "lucide-react";

// Mock data for programs
const mockPrograms = [
    {
        id: "1",
        city: "İstanbul",
        university: "İstanbul Üniversitesi",
        specialty: "Ortodonti",
        spots: 3,
        applicants: 45,
        competitionRatio: 15,
        estimatedCutoff: 72.5,
        historicalCutoff: 71.2
    },
    {
        id: "2",
        city: "Ankara",
        university: "Ankara Üniversitesi",
        specialty: "Endodonti",
        spots: 4,
        applicants: 38,
        competitionRatio: 9.5,
        estimatedCutoff: 68.3,
        historicalCutoff: 67.8
    }
];

// Mock user preferences
const mockUserPreferences = [
    {
        rank: 1,
        programId: "1",
        program: mockPrograms[0],
        probability: 85,
        riskLevel: "high"
    },
    {
        rank: 2,
        programId: "2",
        program: mockPrograms[1],
        probability: 92,
        riskLevel: "safe"
    }
];

export default function DemoPreferencesPage() {
    const userScore = 67.5;
    const maxPreferences = 30;
    const currentPreferenceCount = mockUserPreferences.length;

    const getRiskColor = (level: string) => {
        switch (level) {
            case "safe": return "text-green-600 bg-green-50";
            case "high": return "text-blue-600 bg-blue-50";
            case "medium": return "text-yellow-600 bg-yellow-50";
            case "low": return "text-orange-600 bg-orange-50";
            default: return "text-gray-600 bg-gray-50";
        }
    };

    const getProbabilityColor = (probability: number) => {
        if (probability >= 90) return "text-green-600";
        if (probability >= 70) return "text-blue-600";
        if (probability >= 40) return "text-yellow-600";
        return "text-red-600";
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 md:p-8">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <div className="mb-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                            <ListChecks className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                            Tercih Listem
                        </h1>
                        <p className="text-gray-600">
                            En fazla {maxPreferences} tercih yapabilirsiniz. Sıralamanız önemlidir.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <span className="text-sm font-medium text-gray-700 bg-white px-4 py-2 rounded-lg border border-gray-200">
                            DUS Puanınız: <span className="text-blue-600 font-bold">{userScore}</span>
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

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                    {/* Main Preferences List */}
                    <div className="xl:col-span-2 space-y-4">
                        {/* Current Preferences */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <div className="p-4 sm:p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Tercihlerim ({currentPreferenceCount}/{maxPreferences})
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    Sürükle-bırak ile sıralama yapabilirsiniz
                                </p>
                            </div>

                            {mockUserPreferences.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 mb-4">
                                        Henüz tercih eklemediniz
                                    </p>
                                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                        İlk Tercihinizi Ekleyin
                                    </button>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {mockUserPreferences.map((pref) => (
                                        <div
                                            key={pref.rank}
                                            className="p-3 sm:p-4 hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <div className="flex gap-3 flex-1 min-w-0">
                                                    {/* Drag Handle */}
                                                    <div className="flex items-center">
                                                        <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                                                    </div>

                                                    {/* Rank */}
                                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600 font-bold flex-shrink-0">
                                                        {pref.rank}
                                                    </div>

                                                    {/* Program Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                                            {pref.program.university}
                                                        </h3>
                                                        <p className="text-xs sm:text-sm text-gray-600">
                                                            {pref.program.specialty} - {pref.program.city}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs">
                                                            <span className="text-gray-600">
                                                                Kontenjan: <span className="font-medium">{pref.program.spots}</span>
                                                            </span>
                                                            <span className="text-gray-600">
                                                                Başvuru: <span className="font-medium">{pref.program.applicants}</span>
                                                            </span>
                                                            <span className="text-gray-600">
                                                                Taban: <span className="font-medium">{pref.program.estimatedCutoff}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Probability & Actions */}
                                                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2 mt-2 sm:mt-0">
                                                    <div className="text-left sm:text-right">
                                                        <div className={`text-xl sm:text-2xl font-bold ${getProbabilityColor(pref.probability)}`}>
                                                            {pref.probability}%
                                                        </div>
                                                        <div className={`text-xs font-medium px-2 py-1 rounded ${getRiskColor(pref.riskLevel)} inline-block mt-1`}>
                                                            {pref.riskLevel === "safe" && "Güvenli"}
                                                            {pref.riskLevel === "high" && "Yüksek"}
                                                            {pref.riskLevel === "medium" && "Orta"}
                                                            {pref.riskLevel === "low" && "Düşük"}
                                                        </div>
                                                    </div>
                                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors sm:opacity-0 sm:group-hover:opacity-100">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Add New Preference */}
                        {currentPreferenceCount < maxPreferences && (
                            <button className="w-full bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors text-gray-600 hover:text-blue-600 font-medium flex items-center justify-center gap-2">
                                <Plus className="w-5 h-5" />
                                Yeni Tercih Ekle
                            </button>
                        )}
                    </div>

                    {/* Sidebar - Strategy Analysis */}
                    <div className="space-y-4">
                        {/* Risk Assessment */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-blue-600" />
                                Strateji Analizi
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Güvenli Tercihler</span>
                                        <span className="text-sm font-bold text-green-600">1</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "50%" }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Yüksek İhtimal</span>
                                        <span className="text-sm font-bold text-blue-600">1</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "50%" }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Orta İhtimal</span>
                                        <span className="text-sm font-bold text-yellow-600">0</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Düşük İhtimal</span>
                                        <span className="text-sm font-bold text-red-600">0</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div className="bg-red-500 h-2 rounded-full" style={{ width: "0%" }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-900 font-medium">
                                    ✓ Stratejiniz dengeli görünüyor
                                </p>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Öneriler
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex gap-2">
                                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-700">
                                        Daha fazla güvenli seçenek ekleyerek riskinizi azaltabilirsiniz
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-700">
                                        30 tercih hakkınızın tamamını kullanmanız önerilir
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors">
                            Tercihleri Kaydet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
