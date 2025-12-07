import {
    CheckCircle2,
    Receipt,
    Calendar,
    CreditCard,
    Shield,
    ArrowRight,
    Download,
    Sparkles
} from "lucide-react";

function PremiumFeaturesCard() {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6" />
                <h3 className="font-bold text-lg">Premium Özellikler</h3>
            </div>
            <ul className="space-y-3">
                {[
                    { icon: "🎯", text: "30 tercih hakkı ve sınırsız düzenleme" },
                    { icon: "📊", text: "Gerçek zamanlı yerleştirme analizi" },
                    { icon: "🔮", text: "AI destekli tahmin sistemi" },
                    { icon: "📈", text: "Detaylı istatistikler ve grafikler" },
                    { icon: "💡", text: "Kişiselleştirilmiş öneriler" },
                    { icon: "📄", text: "PDF ve Excel raporları" },
                    { icon: "🎓", text: "Öncelikli destek" },
                    { icon: "⚡", text: "Tüm güncellemelere erken erişim" }
                ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                        <span className="text-lg flex-shrink-0">{feature.icon}</span>
                        <span className="text-sm text-blue-50">{feature.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function DemoPaymentPage() {
    // Mock Data
    const completedPayments = [
        {
            id: "payment-1",
            amount: 299.99,
            currency: "TRY",
            paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
            transactionId: "tr_123456789",
            conversationId: "conv_987654321",
            status: "completed"
        }
    ];
    const latestPayment = completedPayments[0];
    const totalSpent = 299.99;
    const daysUntilExam = 45;

    const periodDetails = {
        displayName: "2025 İlkbahar DUS",
        examDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45).toISOString(),
        preferencesOpenDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        preferencesDeadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString()
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Premium Header with Pattern Background */}
                <div className="relative bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 md:p-10 mb-8 overflow-hidden shadow-xl">
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                            backgroundSize: '32px 32px'
                        }}></div>
                    </div>

                    <div className="relative">
                        <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                                    <CheckCircle2 className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-3xl md:text-4xl font-bold text-white">Premium Aktif</h1>
                                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white border border-white/30">
                                            PRO
                                        </span>
                                    </div>
                                    <p className="text-green-50 text-lg">Tüm premium özelliklerin kilidini açtınız! 🎉</p>
                                </div>
                            </div>

                            {latestPayment?.paidAt && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                                    <p className="text-xs text-green-100 mb-1">Üye olma tarihi</p>
                                    <p className="text-white font-semibold">
                                        {new Date(latestPayment.paidAt).toLocaleDateString('tr-TR', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <p className="text-xs text-green-100 mb-1">Toplam Ödeme</p>
                                <p className="text-2xl font-bold text-white">{completedPayments.length}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <p className="text-xs text-green-100 mb-1">Toplam Harcama</p>
                                <p className="text-2xl font-bold text-white">{totalSpent.toFixed(0)} ₺</p>
                            </div>
                            {daysUntilExam && daysUntilExam > 0 && (
                                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                    <p className="text-xs text-green-100 mb-1">Sınava Kalan</p>
                                    <p className="text-2xl font-bold text-white">{daysUntilExam} gün</p>
                                </div>
                            )}
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <p className="text-xs text-green-100 mb-1">Hesap Durumu</p>
                                <p className="text-2xl font-bold text-white">✓ Aktif</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`grid grid-cols-1 ${completedPayments.length > 0 ? 'lg:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                    {/* Main Content */}
                    <div className={`${completedPayments.length > 0 ? 'lg:col-span-2' : ''} space-y-6`}>
                        {completedPayments.length > 0 ? (
                            <>
                                {/* Latest Payment Detailed Card */}
                                {latestPayment && (
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                        {/* Card Header */}
                                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                                        <Receipt className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-lg font-semibold text-white">Son Ödeme Faturası</h2>
                                                        <p className="text-xs text-blue-100">İşlem detayları</p>
                                                    </div>
                                                </div>
                                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                                                    #{latestPayment.conversationId.slice(-8)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-6">
                                            {/* Amount Display */}
                                            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6 mb-6 border border-gray-100">
                                                <p className="text-sm text-gray-600 mb-2">Ödenen Tutar</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-4xl font-bold text-gray-900">
                                                        {latestPayment.amount.toFixed(2)}
                                                    </span>
                                                    <span className="text-2xl font-semibold text-gray-600">
                                                        {latestPayment.currency}
                                                    </span>
                                                </div>
                                                <div className="mt-3 flex items-center gap-2">
                                                    <div className="h-2 flex-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                                                    <span className="text-xs font-semibold text-green-600">ÖDEME ALINDI</span>
                                                </div>
                                            </div>

                                            {/* Payment Details Grid */}
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Calendar className="w-4 h-4 text-gray-500" />
                                                        <p className="text-xs font-medium text-gray-500">Ödeme Tarihi</p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {latestPayment.paidAt
                                                            ? new Date(latestPayment.paidAt).toLocaleDateString('tr-TR', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })
                                                            : 'N/A'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {latestPayment.paidAt
                                                            ? new Date(latestPayment.paidAt).toLocaleTimeString('tr-TR', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })
                                                            : ''}
                                                    </p>
                                                </div>

                                                <div className="bg-gray-50 rounded-lg p-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <CreditCard className="w-4 h-4 text-gray-500" />
                                                        <p className="text-xs font-medium text-gray-500">Ödeme Yöntemi</p>
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-900">iyzico</p>
                                                    <p className="text-xs text-gray-500 mt-1">Güvenli Ödeme</p>
                                                </div>
                                            </div>

                                            {/* Transaction Info */}
                                            <div className="space-y-3 pt-4 border-t border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">İşlem Numarası</span>
                                                    <span className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded">
                                                        {latestPayment.transactionId}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Konuşma ID</span>
                                                    <span className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded">
                                                        {latestPayment.conversationId}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-600">Durum</span>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Başarıyla Tamamlandı
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Payment History */}
                                {completedPayments.length > 0 && (
                                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900">Ödeme Geçmişi</h2>
                                                <p className="text-sm text-gray-500 mt-1">Tüm ödeme işlemleriniz</p>
                                            </div>
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                {completedPayments.length} ödeme
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {completedPayments.map((payment, index: number) => (
                                                <div
                                                    key={payment.id}
                                                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                                                >
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <Receipt className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-semibold text-gray-900">
                                                                {payment.amount.toFixed(2)} {payment.currency}
                                                            </p>
                                                            {index === 0 && (
                                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                                                    En Son
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500">
                                                            {payment.paidAt
                                                                ? new Date(payment.paidAt).toLocaleDateString('tr-TR', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })
                                                                : 'N/A'}
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Tamamlandı
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <PremiumFeaturesCard />
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Current Period */}
                        {periodDetails && (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-4">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-white" />
                                        <h3 className="font-semibold text-white">Aktif Dönem</h3>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="mb-4">
                                        <p className="text-lg font-bold text-gray-900">{periodDetails.displayName}</p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            📅 Sınav: {new Date(periodDetails.examDate).toLocaleDateString('tr-TR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    {daysUntilExam && daysUntilExam > 0 && (
                                        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-4">
                                            <p className="text-xs font-semibold text-orange-700 mb-1">SINAVА KALAN SÜRE</p>
                                            <p className="text-3xl font-bold text-orange-600">{daysUntilExam}</p>
                                            <p className="text-sm text-orange-700">Gün</p>
                                        </div>
                                    )}

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-xs font-semibold text-gray-500 mb-2">TERCİH SÜRESİ</p>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">Başlar:</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {new Date(periodDetails.preferencesOpenDate).toLocaleDateString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'short'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">Biter:</span>
                                                <span className="text-sm font-medium text-gray-900">
                                                    {new Date(periodDetails.preferencesDeadline).toLocaleDateString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'short'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Premium Features - Show here only if we have payments */}
                        {completedPayments.length > 0 && <PremiumFeaturesCard />}

                        {/* Support Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Premium Destek</h3>
                                    <p className="text-xs text-gray-500">Size yardımcı olmak için buradayız</p>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Herhangi bir sorunuz veya yardıma ihtiyacınız varsa, destek ekibimize ulaşabilirsiniz.
                            </p>
                            <button className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-semibold text-sm transition-colors">
                                Destek Talebi Oluştur
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-3">
                            <a
                                href="/demo"
                                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                            >
                                Dashboard'a Dön
                                <ArrowRight className="w-5 h-5" />
                            </a>
                            <button className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                                <Download className="w-5 h-5" />
                                Tüm Faturaları İndir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
