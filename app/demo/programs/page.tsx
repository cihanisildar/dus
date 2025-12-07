import { Search, Filter, MapPin, Building2, GraduationCap, Users, TrendingUp } from "lucide-react";

export default function DemoProgramsPage() {
    const programs = [
        {
            id: 1,
            university: "İstanbul Üniversitesi",
            specialty: "Ortodonti",
            city: "İstanbul",
            type: "Devlet",
            quota: 3,
            lastMinScore: 71.2,
            trend: "up"
        },
        {
            id: 2,
            university: "Hacettepe Üniversitesi",
            specialty: "Ağız, Diş ve Çene Cerrahisi",
            city: "Ankara",
            type: "Devlet",
            quota: 4,
            lastMinScore: 69.8,
            trend: "stable"
        },
        {
            id: 3,
            university: "Ege Üniversitesi",
            specialty: "Periodontoloji",
            city: "İzmir",
            type: "Devlet",
            quota: 5,
            lastMinScore: 68.5,
            trend: "down"
        },
        {
            id: 4,
            university: "Marmara Üniversitesi",
            specialty: "Endodonti",
            city: "İstanbul",
            type: "Devlet",
            quota: 3,
            lastMinScore: 70.1,
            trend: "up"
        },
        {
            id: 5,
            university: "Başkent Üniversitesi",
            specialty: "Pedodonti",
            city: "Ankara",
            type: "Vakıf",
            quota: 2,
            lastMinScore: 65.4,
            trend: "stable"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                        <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                        Program Sihirbazı
                    </h1>
                    <p className="text-gray-600">
                        Tüm DUS programlarını detaylı filtrelerle inceleyin
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Üniversite, bölüm veya şehir ara..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                Şehir
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
                                <Building2 className="w-4 h-4 text-gray-500" />
                                Üniversite Türü
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap">
                                <Filter className="w-4 h-4 text-gray-500" />
                                Diğer Filtreler
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="space-y-4">
                    {programs.map((program) => (
                        <div key={program.id} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Building2 className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{program.university}</h3>
                                        <p className="text-blue-600 font-medium">{program.specialty}</p>
                                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {program.city}
                                            </span>
                                            <span>•</span>
                                            <span>{program.type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 md:border-l md:pl-6 border-gray-100">
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500 mb-1">Kontenjan</p>
                                        <div className="flex items-center justify-center gap-1 font-bold text-gray-900">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            {program.quota}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500 mb-1">Son Taban Puan</p>
                                        <div className="font-bold text-gray-900">{program.lastMinScore}</div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500 mb-1">Trend</p>
                                        <div className={`flex items-center justify-center gap-1 font-bold ${program.trend === 'up' ? 'text-green-600' :
                                                program.trend === 'down' ? 'text-red-600' :
                                                    'text-yellow-600'
                                            }`}>
                                            <TrendingUp className={`w-4 h-4 ${program.trend === 'down' ? 'rotate-180' : ''}`} />
                                            {program.trend === 'up' ? 'Yükseliş' : program.trend === 'down' ? 'Düşüş' : 'Dengeli'}
                                        </div>
                                    </div>
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-colors">
                                        İncele
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
