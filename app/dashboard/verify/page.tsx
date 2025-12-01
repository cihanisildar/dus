"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export default function VerifyPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [osymCode, setOsymCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [dusScore, setDusScore] = useState<number | null>(null);

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

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-600">Yükleniyor...</div>
            </div>
        );
    }

    if (!session) {
        router.push("/login");
        return null;
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
                                disabled={isLoading || !osymCode}
                            >
                                {isLoading ? "Doğrulanıyor..." : "Doğrula"}
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
