import { Save, Play, Trash2, Clock, ArrowRight } from "lucide-react";

export default function DemoScenariosPage() {
    const scenarios = [
        {
            id: 1,
            name: "İstanbul Odaklı",
            description: "Sadece İstanbul'daki üniversiteler ve yüksek puanlı bölümler",
            date: "2 gün önce",
            programCount: 12,
            riskLevel: "Yüksek"
        },
        {
            id: 2,
            name: "Garanti Tercihler",
            description: "Puanımın yettiği ve güvenli aralıktaki tüm bölümler",
            date: "5 gün önce",
            programCount: 25,
            riskLevel: "Düşük"
        },
        {
            id: 3,
            name: "Ege Bölgesi",
            description: "İzmir, Aydın ve Manisa üniversiteleri",
            date: "1 hafta önce",
            programCount: 8,
            riskLevel: "Orta"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                            <Save className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                            Kayıtlı Senaryolarım
                        </h1>
                        <p className="text-gray-600">
                            Farklı tercih stratejilerinizi kaydedin ve karşılaştırın
                        </p>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Yeni Senaryo Kaydet
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {scenarios.map((scenario) => (
                        <div key={scenario.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Save className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${scenario.riskLevel === 'Yüksek' ? 'bg-red-50 text-red-700' :
                                        scenario.riskLevel === 'Düşük' ? 'bg-green-50 text-green-700' :
                                            'bg-yellow-50 text-yellow-700'
                                    }`}>
                                    {scenario.riskLevel} Risk
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">{scenario.name}</h3>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {scenario.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {scenario.date}
                                </div>
                                <div>•</div>
                                <div>{scenario.programCount} Program</div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                                    <Play className="w-4 h-4" />
                                    Yükle
                                </button>
                                <button className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Create New Placeholder */}
                    <button className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-all group flex flex-col items-center justify-center text-center h-full min-h-[240px]">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                            <Save className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Yeni Senaryo</h3>
                        <p className="text-sm text-gray-500">
                            Mevcut tercih listenizi yeni bir senaryo olarak kaydedin
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
}
