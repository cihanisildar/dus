import { LineChart, TrendingUp, Users, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function DemoMarketPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                        <LineChart className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                        Piyasa Analizi
                    </h1>
                    <p className="text-gray-600">
                        Genel eğilimler ve branş bazlı analizler
                    </p>
                </div>

                {/* Market Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">
                                <ArrowUpRight className="w-4 h-4 mr-1" />
                                +12%
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Toplam Başvuru</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">4,250</p>
                        <p className="text-xs text-gray-400 mt-2">Geçen yıla göre artış</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                <Activity className="w-6 h-6 text-purple-600" />
                            </div>
                            <span className="flex items-center text-red-600 text-sm font-medium bg-red-50 px-2 py-1 rounded-lg">
                                <ArrowDownRight className="w-4 h-4 mr-1" />
                                -2.5%
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Ortalama Puan</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">58.4</p>
                        <p className="text-xs text-gray-400 mt-2">Geçen yıla göre değişim</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                            <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-1 rounded-lg">
                                <ArrowUpRight className="w-4 h-4 mr-1" />
                                +5%
                            </span>
                        </div>
                        <h3 className="text-gray-500 text-sm font-medium">Kontenjan Doluluğu</h3>
                        <p className="text-2xl font-bold text-gray-900 mt-1">98.2%</p>
                        <p className="text-xs text-gray-400 mt-2">Beklenen doluluk oranı</p>
                    </div>
                </div>

                {/* Popular Specialties */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">En Çok Tercih Edilen Branşlar</h2>
                    <div className="space-y-6">
                        {[
                            { name: "Ortodonti", score: 95, color: "bg-blue-500" },
                            { name: "Ağız, Diş ve Çene Cerrahisi", score: 88, color: "bg-indigo-500" },
                            { name: "Endodonti", score: 82, color: "bg-purple-500" },
                            { name: "Pedodonti", score: 75, color: "bg-pink-500" },
                            { name: "Periodontoloji", score: 68, color: "bg-rose-500" }
                        ].map((item, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                                    <span>{item.name}</span>
                                    <span>{item.score}% Talep</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full ${item.color}`}
                                        style={{ width: `${item.score}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
