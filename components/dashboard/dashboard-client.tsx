"use client";

import type { DashboardData } from "@/lib/actions/dashboard-actions";
import {
    ArrowRight,
    CheckCircle,
    CreditCard,
    ListChecks,
    BarChart3,
    TrendingUp,
    TrendingDown,
    Bell,
    Search,
    HelpCircle,
    Download,
    AlertTriangle,
    Clock,
    Target,
    Users,
    MapPin,
    Database,
    Sparkles,
    FileText,
    MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface DashboardClientProps {
    dashboardData: DashboardData;
}

export function DashboardClient({ dashboardData }: DashboardClientProps) {
    const { user, stats } = dashboardData;
    const accountStatus = user.accountStatus;
    const userName = user.name || "Kullanıcı";

    const getRiskLevelInfo = (level: string) => {
        switch (level) {
            case "balanced":
                return { color: "green", text: "İyi Dengeli", icon: CheckCircle };
            case "ambitious":
                return { color: "yellow", text: "Fazla İddialı", icon: TrendingUp };
            case "safe":
                return { color: "orange", text: "Fazla Güvenli", icon: TrendingDown };
            case "incomplete":
                return { color: "red", text: "Eksik", icon: AlertTriangle };
            default:
                return { color: "gray", text: "Bilinmiyor", icon: AlertTriangle };
        }
    };

    const riskInfo = getRiskLevelInfo(stats.riskLevel);

    // Note: Data is now fetched on the server and passed as props
    // No more client-side fetching or useEffect needed!

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 lg:p-12">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
                        <span className="text-gray-800">Hoş Geldiniz, </span>
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient bg-300% inline-block pb-1">
                            {userName}
                        </span>
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base md:text-lg flex items-center gap-2">
                        <span className="inline-block w-6 sm:w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                        DUS yerleştirme sürecinizi yönetin
                    </p>
                </div>

                {/* Status Card - Only show for non-active users */}
                {accountStatus !== "active" && (
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Hesap Durumu</h2>
                            <span
                                className={`px-3 py-1.5 rounded-md text-sm font-medium ${accountStatus === "verified"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {accountStatus === "registered" && "Kayıt Tamamlandı"}
                                {accountStatus === "verified" && "ÖSYM Doğrulandı"}
                            </span>
                        </div>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Kayıt</span>
                            </div>

                            <div className="flex-1 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 transition-all duration-500"
                                    style={{
                                        width: accountStatus === "registered" ? "0%" : "100%"
                                    }}
                                />
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${accountStatus === "verified"
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                    }`}>
                                    {accountStatus === "verified" ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        <span className="text-sm font-semibold">2</span>
                                    )}
                                </div>
                                <span className="text-sm font-medium text-gray-700">ÖSYM</span>
                            </div>

                            <div className="flex-1 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-green-500 transition-all duration-500"
                                    style={{
                                        width: "0%"
                                    }}
                                />
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-gray-300">
                                    <span className="text-sm font-semibold">3</span>
                                </div>
                                <span className="text-sm font-medium text-gray-700">Ödeme</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Next Step Cards */}
                {accountStatus === "registered" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                    Sonraki Adım: ÖSYM Doğrulama
                                </h3>
                                <p className="text-sm sm:text-base text-gray-700 mb-4">
                                    DUS sınav sonucunuzu doğrulayın ve puanınızı sisteme kaydedin.
                                    Bu adım ücretsizdir.
                                </p>
                                <Link
                                    href="/dashboard/verify"
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    ÖSYM Kodu Doğrula
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {accountStatus === "verified" && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                    Sonraki Adım: Ödeme
                                </h3>
                                <p className="text-sm sm:text-base text-gray-700 mb-4">
                                    ÖSYM doğrulamanız tamamlandı! Şimdi 2025 İlkbahar DUS dönemi için
                                    erişim satın alın (299.99 TRY).
                                </p>
                                <Link
                                    href="/dashboard/payment"
                                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                                >
                                    Ödeme Yap
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Active User Enhanced Dashboard */}
                {accountStatus === "active" && (
                    <div className="space-y-6">
                        {/* Quick Stats Overview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* DUS Score */}
                            <div className="group relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-blue-100">DUS Puanınız</span>
                                        <Target className="w-4 h-4 text-blue-200 group-hover:rotate-12 transition-transform duration-300" />
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                                        {stats.dusScore}
                                    </div>
                                    <p className="text-xs text-blue-100">Doğrulanmış puan</p>
                                </div>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                            </div>

                            {/* Preferences Count */}
                            <div className="group relative bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-green-100">Tercihler</span>
                                        <ListChecks className="w-4 h-4 text-green-200 group-hover:rotate-12 transition-transform duration-300" />
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                                        {stats.preferencesFilled}<span className="text-2xl text-green-100">/{stats.totalPreferences}</span>
                                    </div>
                                    <div className="w-full bg-green-700/30 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-white h-2 rounded-full transition-all duration-1000 ease-out shadow-lg"
                                            style={{ width: `${(stats.preferencesFilled / stats.totalPreferences) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500"></div>
                            </div>

                            {/* Expected Placement */}
                            <div className="group relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-purple-100">Beklenen Yerleşme</span>
                                        <Sparkles className="w-4 h-4 text-purple-200 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                                    </div>
                                    <div className="text-sm font-semibold text-white line-clamp-2 min-h-[2.5rem] group-hover:scale-105 transition-transform duration-300">
                                        {stats.expectedPlacement}
                                    </div>
                                    <p className="text-xs text-purple-100 mt-1">En yüksek olasılık</p>
                                </div>
                                <div className="absolute top-0 left-1/2 w-24 h-24 bg-white opacity-5 rounded-full -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                            </div>

                            {/* Deadline Countdown */}
                            <div className="group relative bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-orange-100">Son Tarih</span>
                                        <Clock className="w-4 h-4 text-orange-200 group-hover:rotate-12 transition-transform duration-300" />
                                    </div>
                                    <div className="text-4xl font-bold text-white mb-1 group-hover:scale-110 transition-transform duration-300">
                                        {stats.daysUntilDeadline}
                                    </div>
                                    <p className="text-xs text-orange-100">Gün kaldı</p>
                                </div>
                                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -mr-12 -mb-12 group-hover:scale-150 transition-transform duration-500"></div>
                            </div>
                        </div>

                        {/* Risk Assessment & Notifications */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {/* Risk Assessment Widget */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className={`w-10 h-10 rounded-lg bg-${riskInfo.color}-100 flex items-center justify-center`}>
                                        <riskInfo.icon className={`w-5 h-5 text-${riskInfo.color}-600`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Risk Değerlendirmesi</h3>
                                        <p className="text-sm text-gray-600">Tercih stratejiniz</p>
                                    </div>
                                </div>
                                <div className={`px-4 py-3 bg-${riskInfo.color}-50 border border-${riskInfo.color}-200 rounded-lg mb-4`}>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-lg font-bold text-${riskInfo.color}-700`}>{riskInfo.text}</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1">
                                        {stats.riskLevel === "balanced" && "Tercihleriniz güvenli, hedef ve iddialı seçeneklerin iyi bir karışımını içeriyor."}
                                        {stats.riskLevel === "ambitious" && "Tüm tercihleriniz düşük olasılıklı. Daha güvenli seçenekler eklemeyi düşünün."}
                                        {stats.riskLevel === "safe" && "Tercihleriniz çok güvenli. Daha iyi fırsatları kaçırıyor olabilirsiniz."}
                                        {stats.riskLevel === "incomplete" && "Daha fazla tercih eklemelisiniz. 30 tercih hakkınızı kullanın."}
                                    </p>
                                </div>
                                <Link
                                    href="/dashboard/preferences"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    Tercihlerinizi İnceleyin
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {/* Recent Activity / Notifications */}
                            <div className="bg-white border border-gray-200 rounded-xl p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Bell className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Son Değişiklikler</h3>
                                        <p className="text-sm text-gray-600">Tercihlerinizdeki güncel durumlar</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {stats.recentChanges.map((change, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${change.change === "up" ? "bg-green-100" : "bg-red-100"
                                                }`}>
                                                {change.change === "up" ? (
                                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <TrendingDown className="w-4 h-4 text-red-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                    {change.program}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    Olasılık {change.change === "up" ? "arttı" : "azaldı"}: {change.percentage}%
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href="/dashboard/notifications"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 mt-4"
                                >
                                    Tüm Bildirimleri Gör
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        {/* Main Action Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {/* Preferences */}
                            <Link
                                href="/dashboard/preferences"
                                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <ListChecks className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    Tercihlerim
                                </h3>
                                <p className="text-gray-600 mb-3 text-sm">
                                    30 adete kadar tercihinizi girin ve yerleştirme olasılıklarınızı görün
                                </p>
                                <div className="flex items-center text-blue-600 font-medium text-sm">
                                    <span>Başla</span>
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                                </div>
                            </Link>

                            {/* Analytics */}
                            <Link
                                href="/dashboard/analytics"
                                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <BarChart3 className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    Detaylı Analiz
                                </h3>
                                <p className="text-gray-600 mb-3 text-sm">
                                    Detaylı istatistikler ve yerleştirme tahminleri
                                </p>
                                <div className="flex items-center text-indigo-600 font-medium text-sm">
                                    <span>Görüntüle</span>
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                                </div>
                            </Link>

                            {/* What-If Scenarios */}
                            <Link
                                href="/dashboard/scenarios"
                                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                    Senaryo Analizi
                                </h3>
                                <p className="text-gray-600 mb-3 text-sm">
                                    Farklı tercih stratejilerini test edin ve karşılaştırın
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-purple-600 font-medium text-sm">
                                        <span>Dene</span>
                                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                                    </div>
                                    {stats.savedScenarios > 0 && (
                                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full animate-pulse">
                                            {stats.savedScenarios} kayıtlı
                                        </span>
                                    )}
                                </div>
                            </Link>

                            {/* Program Browser */}
                            <Link
                                href="/dashboard/programs"
                                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Search className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                    Program Arama
                                </h3>
                                <p className="text-gray-600 mb-3 text-sm">
                                    Tüm programları inceleyin, filtreleyin ve karşılaştırın
                                </p>
                                <div className="flex items-center text-emerald-600 font-medium text-sm">
                                    <span>Keşfet</span>
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                                </div>
                            </Link>

                            {/* Market Intelligence */}
                            <Link
                                href="/dashboard/market"
                                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-orange-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <TrendingUp className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                                    Piyasa Analizi
                                </h3>
                                <p className="text-gray-600 mb-3 text-sm">
                                    En rekabetçi programlar, şehirler ve güncel trendler
                                </p>
                                <div className="flex items-center text-orange-600 font-medium text-sm">
                                    <span>İncele</span>
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                                </div>
                            </Link>

                            {/* Export & Save */}
                            <Link
                                href="/dashboard/export"
                                className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-teal-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                    <Download className="w-6 h-6 text-white group-hover:-translate-y-1 transition-transform duration-300" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                                    Dışa Aktar
                                </h3>
                                <p className="text-gray-600 mb-3 text-sm">
                                    Tercihlerinizi ve raporlarınızı PDF olarak indirin
                                </p>
                                <div className="flex items-center text-teal-600 font-medium text-sm">
                                    <span>İndir</span>
                                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform duration-300" />
                                </div>
                            </Link>
                        </div>

                        {/* Support & Resources */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            {/* Help Center */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                                        <HelpCircle className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Yardım Merkezi</h3>
                                </div>
                                <p className="text-gray-700 mb-4 text-sm">
                                    Sık sorulan sorular, video eğitimler ve kullanım kılavuzları
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Link
                                        href="/dashboard/help/faq"
                                        className="inline-flex items-center gap-1 text-sm bg-white text-blue-700 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-50 transition-colors border border-blue-200"
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        SSS
                                    </Link>
                                    <Link
                                        href="/dashboard/help/tutorials"
                                        className="inline-flex items-center gap-1 text-sm bg-white text-blue-700 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-50 transition-colors border border-blue-200"
                                    >
                                        <Database className="w-3.5 h-3.5" />
                                        Eğitimler
                                    </Link>
                                    <Link
                                        href="/dashboard/help/contact"
                                        className="inline-flex items-center gap-1 text-sm bg-white text-blue-700 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-50 transition-colors border border-blue-200"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        İletişim
                                    </Link>
                                </div>
                            </div>

                            {/* Market Insights Summary */}
                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Bugünün Öne Çıkanları</h3>
                                </div>
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-700 flex items-center gap-1">
                                            <TrendingUp className="w-3.5 h-3.5 text-red-500" />
                                            En rekabetçi dal:
                                        </span>
                                        <span className="font-semibold text-gray-900">Ortodonti</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-700 flex items-center gap-1">
                                            <TrendingDown className="w-3.5 h-3.5 text-green-500" />
                                            En az rekabetçi dal:
                                        </span>
                                        <span className="font-semibold text-gray-900">Restoratif</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-700 flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                            En çok tercih edilen şehir:
                                        </span>
                                        <span className="font-semibold text-gray-900">İstanbul</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
