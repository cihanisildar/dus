import { CheckCircle2, ShieldCheck } from "lucide-react";

export default function DemoVerifyPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                        </div>
                        <div className="flex-1 text-left">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Hesabınız Doğrulanmış</h1>
                            <p className="text-gray-600">
                                Tebrikler! Hesabınız başarıyla doğrulanmış ve tüm özelliklere erişiminiz açılmıştır.
                            </p>
                        </div>
                        <div className="hidden md:flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-green-700 font-medium text-sm bg-green-50 px-4 py-2 rounded-lg">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>DUS Puanı Doğrulandı</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-700 font-medium text-sm bg-green-50 px-4 py-2 rounded-lg">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Kimlik Doğrulandı</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ÖSYM Result Document Mock */}
                <div className="bg-white border-2 border-blue-100 rounded-2xl shadow-xl p-6 md:p-8 mb-6 text-left">
                    <div className="text-center mb-8">
                        <h3 className="font-bold text-gray-900 text-xl md:text-2xl">2024-DUS</h3>
                        <p className="text-sm text-gray-500">Sınav Sonuç Belgesi</p>
                    </div>

                    {/* Personal Info - Grid Layout */}
                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-blue-50/30 rounded-lg p-4 border border-blue-100">
                            <p className="text-xs text-gray-500 mb-1 font-medium">T.C. Kimlik Numarası</p>
                            <p className="text-lg font-semibold text-gray-900">12*******89</p>
                        </div>
                        <div className="bg-blue-50/30 rounded-lg p-4 border border-blue-100">
                            <p className="text-xs text-gray-500 mb-1 font-medium">Adı ve Soyadı</p>
                            <p className="text-lg font-semibold text-gray-900">DEMO KULLANICI</p>
                        </div>
                        <div className="bg-blue-50/30 rounded-lg p-4 border border-blue-100">
                            <p className="text-xs text-gray-500 mb-1 font-medium">Sınav Tarihi</p>
                            <p className="text-lg font-semibold text-gray-900">15 Ekim 2024</p>
                        </div>
                    </div>

                    {/* Two Column Layout for Tables */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Test Results Table */}
                        <div>
                            <h4 className="text-center font-bold text-blue-800 mb-3 text-sm uppercase tracking-wide">Testlerdeki Doğru ve Yanlış Sayıları</h4>
                            <div className="overflow-hidden rounded-lg border border-gray-300">
                                <table className="w-full text-sm text-center">
                                    <thead className="bg-blue-50/50 text-gray-700 font-semibold">
                                        <tr>
                                            <th className="p-3 border-r border-gray-300 text-left pl-4">Dersler</th>
                                            <th className="p-3 border-r border-gray-300">Doğru</th>
                                            <th className="p-3">Yanlış</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-300">
                                        <tr>
                                            <td className="p-3 border-r border-gray-300 text-left pl-4">Temel Bilimler Testi</td>
                                            <td className="p-3 border-r border-gray-300 font-semibold">32</td>
                                            <td className="p-3 font-semibold">7</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 border-r border-gray-300 text-left pl-4">Klinik Bilimler Testi</td>
                                            <td className="p-3 border-r border-gray-300 font-semibold">74</td>
                                            <td className="p-3 font-semibold">5</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Score Table */}
                        <div>
                            <h4 className="text-center font-bold text-blue-800 mb-3 text-sm uppercase tracking-wide">Puanı ve Başarı Sırası</h4>
                            <div className="overflow-hidden rounded-lg border border-gray-300">
                                <table className="w-full text-sm text-center">
                                    <thead className="bg-blue-50/50 text-gray-700 font-semibold">
                                        <tr>
                                            <th className="p-3 border-r border-gray-300">DUS Puanı</th>
                                            <th className="p-3 border-r border-gray-300">Başarı Sırası</th>
                                            <th className="p-3">Toplam Aday</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="p-4 border-r border-gray-300 font-bold text-xl text-blue-600">68.50000</td>
                                            <td className="p-4 border-r border-gray-300 font-bold text-lg">423</td>
                                            <td className="p-4 text-gray-700">1247</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Score Highlight Card */}
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">DUS Puanı</p>
                                <p className="text-2xl md:text-3xl font-bold text-blue-600">68.50</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Başarı Sırası</p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">423</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600 mb-1 uppercase tracking-wide">Yüzdelik Dilim</p>
                                <p className="text-2xl md:text-3xl font-bold text-green-600">%34</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Verification Badges */}
                <div className="md:hidden bg-white rounded-2xl shadow-xl p-6 mb-6">
                    <div className="flex items-center gap-3 text-green-700 font-medium mb-3">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span>DUS Puanı Doğrulandı</span>
                    </div>
                    <div className="flex items-center gap-3 text-green-700 font-medium">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span>Kimlik Doğrulandı</span>
                    </div>
                </div>

                {/* Action Button */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 md:py-4 rounded-xl transition-colors text-lg">
                        Dashboard'a Dön
                    </button>
                </div>
            </div>
        </div>
    );
}
