"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { getUserVerificationStatus, getActiveExamPeriod } from "@/lib/actions/user-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle, Info, Calendar } from "lucide-react";
import type { OsymVerification, ExamPeriod } from "@/lib/db/schema";
import { VerifySkeleton } from "@/components/skeletons/verify-skeleton";

export default function VerifyPage() {
    const router = useRouter();
    const { user, loading } = useUser();
    const [osymCode, setOsymCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [dusScore, setDusScore] = useState<number | null>(null);
    const [existingVerification, setExistingVerification] = useState<OsymVerification | null>(null);
    const [checkingVerification, setCheckingVerification] = useState(true);
    const [activePeriod, setActivePeriod] = useState<ExamPeriod | null>(null);

    useEffect(() => {
        async function checkVerification() {
            if (!user) return;

            try {
                // Fetch both verification status and active period in parallel
                const [status, period] = await Promise.all([
                    getUserVerificationStatus(),
                    getActiveExamPeriod()
                ]);

                if (status?.isVerified && status.verification) {
                    setExistingVerification(status.verification);
                }

                setActivePeriod(period);
            } catch (err) {
                console.error("Error checking verification:", err);
            } finally {
                setCheckingVerification(false);
            }
        }

        checkVerification();
    }, [user]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/verify-osym", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ osymResultCode: osymCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Doğrulama başarısız oldu");
                return;
            }

            setSuccess(true);
            setDusScore(data.data.dusScore);

            setTimeout(() => {
                router.push("/dashboard/payment");
            }, 2000);
        } catch (err) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    if (loading || checkingVerification) {
        return <VerifySkeleton />;
    }

    if (!user) {
        router.push("/login");
        return null;
    }

    // If user is already verified, show their results
    if (existingVerification) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
                            </div>
                            <div className="flex-1 text-left">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">ÖSYM Doğrulaması Tamamlandı</h1>
                                <p className="text-gray-600">
                                    {new Date(existingVerification.verifiedAt).toLocaleDateString('tr-TR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })} tarihinde doğrulandı
                                </p>
                            </div>
                            {activePeriod && (
                                <div className="hidden md:flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-blue-700 font-medium text-sm bg-blue-50 px-4 py-2 rounded-lg">
                                        <Calendar className="w-4 h-4" />
                                        <span>{activePeriod.displayName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-700 font-medium text-sm bg-green-50 px-4 py-2 rounded-lg">
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Doğrulandı</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ÖSYM Result Document */}
                    <div className="bg-white border-2 border-blue-100 rounded-2xl shadow-xl p-6 md:p-8 mb-6 text-left">
                        <div className="text-center mb-8">
                            <h3 className="font-bold text-gray-900 text-xl md:text-2xl">
                                {activePeriod?.name || '2025-DUS'}
                            </h3>
                            <p className="text-sm text-gray-500">Sınav Sonuç Belgesi</p>
                        </div>

                        {/* Personal Info - Grid Layout */}
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-blue-50/30 rounded-lg p-4 border border-blue-100">
                                <p className="text-xs text-gray-500 mb-1 font-medium">Adı ve Soyadı</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {existingVerification.userName || user?.email?.split('@')[0] || 'Kullanıcı'}
                                </p>
                            </div>
                            <div className="bg-blue-50/30 rounded-lg p-4 border border-blue-100">
                                <p className="text-xs text-gray-500 mb-1 font-medium">Sınav Tarihi</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {new Date(existingVerification.examDate).toLocaleDateString('tr-TR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div className="bg-blue-50/30 rounded-lg p-4 border border-blue-100">
                                <p className="text-xs text-gray-500 mb-1 font-medium">ÖSYM Sonuç Kodu</p>
                                <p className="text-lg font-semibold text-gray-900 font-mono">
                                    {existingVerification.osymResultCode}
                                </p>
                            </div>
                        </div>

                        {/* Two Column Layout for Tables */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Test Results Table */}
                            <div>
                                <h4 className="text-center font-bold text-blue-800 mb-3 text-sm uppercase tracking-wide">
                                    Testlerdeki Doğru ve Yanlış Sayıları
                                </h4>
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
                                                <td className="p-3 border-r border-gray-300 font-semibold text-green-600">
                                                    {existingVerification.basicSciencesCorrect || 0}
                                                </td>
                                                <td className="p-3 font-semibold text-red-600">
                                                    {existingVerification.basicSciencesWrong || 0}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="p-3 border-r border-gray-300 text-left pl-4">Klinik Bilimler Testi</td>
                                                <td className="p-3 border-r border-gray-300 font-semibold text-green-600">
                                                    {existingVerification.clinicalSciencesCorrect || 0}
                                                </td>
                                                <td className="p-3 font-semibold text-red-600">
                                                    {existingVerification.clinicalSciencesWrong || 0}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Score Table */}
                            <div>
                                <h4 className="text-center font-bold text-blue-800 mb-3 text-sm uppercase tracking-wide">
                                    Puanı ve Başarı Sırası
                                </h4>
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
                                                <td className="p-4 border-r border-gray-300 font-bold text-xl text-blue-600">
                                                    {(existingVerification.dusScore / 100).toFixed(5)}
                                                </td>
                                                <td className="p-4 border-r border-gray-300 font-bold text-lg">
                                                    {existingVerification.ranking || '-'}
                                                </td>
                                                <td className="p-4 font-bold text-lg">
                                                    {existingVerification.totalCandidates?.toLocaleString('tr-TR') || '-'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* ÖSYM Footer Note */}
                        <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                            <p className="text-xs text-gray-500">
                                Bu belge ÖSYM tarafından verilen sonuç belgesi referansıyla oluşturulmuştur.
                            </p>
                            <p className="text-xs text-gray-600 font-mono mt-1">
                                Kod: {existingVerification.osymResultCode}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            onClick={() => router.push("/dashboard/payment")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                        >
                            Ödeme Sayfasına Git →
                        </Button>
                        <Button
                            onClick={() => router.push("/dashboard")}
                            variant="outline"
                            className="w-full py-6 text-lg"
                        >
                            Ana Sayfaya Dön
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-2xl mx-auto p-6 sm:p-8 lg:p-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                        ÖSYM Doğrulaması
                    </h1>
                    <p className="text-gray-600">
                        DUS sınavı sonuç kodunuzu girerek doğrulama yapın
                    </p>
                </div>

                {success ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                Doğrulama Başarılı!
                            </h2>
                            <p className="text-gray-600 mb-1">
                                DUS Puanınız: <span className="font-semibold text-gray-900">{dusScore?.toFixed(2)}</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-4">
                                Ödeme sayfasına yönlendiriliyorsunuz...
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-6">
                        {/* Active Period Info */}
                        {activePeriod ? (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <Calendar className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold text-green-900">
                                                Aktif Sınav Dönemi
                                            </h3>
                                            <span className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                                                Aktif
                                            </span>
                                        </div>
                                        <p className="text-green-900 font-medium mb-3">
                                            {activePeriod.displayName}
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <span className="text-green-700">Sınav Tarihi:</span>
                                                <span className="ml-2 font-semibold text-green-900">
                                                    {new Date(activePeriod.examDate).toLocaleDateString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-green-700">Tercih Son Tarihi:</span>
                                                <span className="ml-2 font-semibold text-green-900">
                                                    {new Date(activePeriod.preferencesDeadline).toLocaleDateString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-amber-900 mb-2">
                                            Aktif Sınav Dönemi Bulunamadı
                                        </h3>
                                        <p className="text-sm text-amber-800">
                                            Şu anda aktif bir sınav dönemi bulunmamaktadır. ÖSYM doğrulaması yapabilmek için
                                            aktif bir sınav döneminin olması gerekmektedir. Lütfen daha sonra tekrar deneyin.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="osym-code" className="text-sm font-medium text-gray-900">
                                        ÖSYM Sonuç Kodu
                                    </Label>
                                    <Input
                                        id="osym-code"
                                        name="osym-code"
                                        type="text"
                                        required
                                        placeholder="YYYYAAGG-XXXXX (örn: 20250315-12345)"
                                        value={osymCode}
                                        onChange={(e) => setOsymCode(e.target.value)}
                                        className="mt-2"
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        ÖSYM sonuç belgenizde bulunan kodu girin
                                    </p>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex gap-3">
                                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h3 className="text-sm font-semibold text-blue-900 mb-1">
                                                ÖSYM Sonuç Kodu Nedir?
                                            </h3>
                                            <p className="text-sm text-blue-700">
                                                DUS sınavı sonucunu öğrendikten sonra ÖSYM'den aldığınız sonuç belgesinde
                                                bulunan benzersiz kodunuzdur. Bu kod ile sınav puanınız otomatik olarak
                                                alınacaktır.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-red-800">{error}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={isLoading || !osymCode || !activePeriod}
                            >
                                {isLoading ? "Doğrulanıyor..." : activePeriod ? "Doğrula" : "Aktif Dönem Yok"}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => router.push("/dashboard")}
                                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Daha sonra doğrulayacağım
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
