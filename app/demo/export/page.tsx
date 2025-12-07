import { FileText, Download, FileSpreadsheet, Share2 } from "lucide-react";

export default function DemoExportPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
                        <Download className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                        Raporlar ve Dışa Aktar
                    </h1>
                    <p className="text-gray-600">
                        Tercih listenizi ve analiz raporlarınızı farklı formatlarda indirin
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* PDF Report */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                            <FileText className="w-7 h-7 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Detaylı Analiz Raporu (PDF)</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Tüm tercihlerinizin detaylı analizi, risk değerlendirmesi ve strateji önerilerini içeren kapsamlı rapor.
                        </p>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            PDF İndir
                        </button>
                    </div>

                    {/* Excel List */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                            <FileSpreadsheet className="w-7 h-7 text-green-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Tercih Listesi (Excel)</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            ÖSYM formatına uygun, düzenlenebilir Excel formatında tercih listeniz.
                        </p>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Excel İndir
                        </button>
                    </div>

                    {/* Official Format */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                            <FileText className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">ÖSYM Taslak Çıktısı</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Resmi başvuru öncesi kontrol amaçlı kullanabileceğiniz taslak çıktı.
                        </p>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Taslak İndir
                        </button>
                    </div>

                    {/* Share */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                            <Share2 className="w-7 h-7 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Listeyi Paylaş</h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Tercih listenizi danışmanınız veya arkadaşlarınızla güvenli bir bağlantı üzerinden paylaşın.
                        </p>
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                            <Share2 className="w-4 h-4" />
                            Bağlantı Oluştur
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
