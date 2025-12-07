import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, payments as paymentsTable } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import {
    CreditCard,
    CheckCircle2,
    Shield,
    Lock,
    Sparkles,
    ArrowRight,
    Calendar,
    Receipt,
    Download
} from "lucide-react";
import { PaymentForm } from "@/components/payment-form";

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

export const dynamic = 'force-dynamic';

async function Payment() {
    const supabase = await createClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
        redirect("/login");
    }

    // Fetch user data from custom users table
    const user = await db.query.users.findFirst({
        where: eq(users.id, authUser.id)
    });

    if (!user) {
        redirect("/login");
    }

    const accountStatus = user.accountStatus;
    const currentPeriodId = user.currentPeriodId;

    // If already active, show payment details
    if (accountStatus === "active") {
        // Fetch user's payments
        const payments = await db.query.payments.findMany({
            where: eq(paymentsTable.userId, user.id),
            orderBy: [desc(paymentsTable.createdAt)]
        });
        const completedPayments = payments.filter(p => p.status === "completed");
        const latestPayment = completedPayments[0];

        // Calculate total spent (amounts are stored as cents)
        const totalSpent = completedPayments.reduce((sum, p) => sum + p.amount, 0) / 100;

        // Fetch current period details
        let periodDetails = null;
        if (currentPeriodId) {
            periodDetails = await db.query.examPeriods.findFirst({
                where: eq(users.id, currentPeriodId)
            });
        }

        // Calculate days until exam
        const daysUntilExam = periodDetails && periodDetails.examDate
            ? Math.ceil((new Date(periodDetails.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            : null;

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-green-50/30 p-4 md:p-8">
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
                                <button className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors">
                                    Destek Talebi Oluştur
                                </button>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-3">
                                <a
                                    href="/dashboard"
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

    // If not verified, show info message
    if (accountStatus === "registered") {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-10 h-10 text-amber-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">ÖSYM Doğrulaması Gerekli</h1>
                        <p className="text-gray-600 mb-8 text-lg">
                            Ödeme yapabilmek için öncelikle ÖSYM sonucunuzu doğrulamanız gerekmektedir.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
                            <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                Doğrulama Adımları
                            </h3>
                            <ol className="text-sm text-blue-800 space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">1</span>
                                    <span>ÖSYM sonuç kodunuzu hazırlayın</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">2</span>
                                    <span>Doğrulama sayfasında kodu girin</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">3</span>
                                    <span>Onaylandıktan sonra ödeme yapın</span>
                                </li>
                            </ol>
                        </div>
                        <a
                            href="/dashboard/verify"
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg shadow-lg shadow-blue-600/20"
                        >
                            ÖSYM Doğrulamasına Git
                            <ArrowRight className="w-6 h-6" />
                        </a>
                        <p className="text-sm text-gray-500 mt-6">
                            Doğrulama işlemi birkaç dakika sürmektedir
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const features = [
        "30 tercih hakkı ve sınırsız düzenleme",
        "Gerçek zamanlı yerleştirme olasılık hesaplama",
        "Detaylı analiz ve piyasa trendleri",
        "Ne-olursa senaryo analizi",
        "Kişiselleştirilmiş öneriler",
        "PDF ve Excel raporları",
        "7/24 destek hizmeti",
        "2025 İlkbahar DUS dönemi için geçerli"
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Ödeme
                    </h1>
                    <p className="text-base text-gray-600">
                        DUS yerleştirme sistemine tam erişim için ödemenizi tamamlayın
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                                Ödeme Bilgileri
                            </h2>

                            <PaymentForm price={299.99} currency="TRY" />

                        </div>

                        {/* Accepted Cards */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Kabul Edilen Kartlar</h3>
                            <div className="flex items-center gap-3">
                                <div className="px-3 py-2 bg-gray-100 rounded text-xs font-semibold text-gray-700">VISA</div>
                                <div className="px-3 py-2 bg-gray-100 rounded text-xs font-semibold text-gray-700">MASTERCARD</div>
                                <div className="px-3 py-2 bg-gray-100 rounded text-xs font-semibold text-gray-700">TROY</div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700">DUS360 Premium Erişim</span>
                                    <span className="font-semibold text-gray-900">299.99 TRY</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-700">KDV (%20)</span>
                                    <span className="font-semibold text-gray-900">60.00 TRY</span>
                                </div>
                                <div className="pt-3 border-t border-blue-200 flex items-center justify-between">
                                    <span className="font-semibold text-gray-900">Toplam</span>
                                    <span className="text-2xl font-bold text-blue-600">359.99 TRY</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg p-4 mb-4">
                                <p className="text-xs text-gray-600 mb-2">Tek seferlik ödeme</p>
                                <p className="text-sm text-gray-900 font-medium">2025 İlkbahar DUS dönemi için geçerli</p>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-blue-600" />
                                Dahil Olan Özellikler
                            </h3>
                            <ul className="space-y-2.5">
                                {features.map((feature: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Security Badge */}
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-green-900">Güvenli Ödeme</span>
                            </div>
                            <p className="text-xs text-green-800">
                                Ödemeniz iyzico altyapısı ile güvence altındadır. Kart bilgileriniz saklanmaz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
