"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function PaymentPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [agreedToPolicy, setAgreedToPolicy] = useState(false);

    const price = 299.99;
    const currency = "TRY";

    const handlePayment = async () => {
        if (!agreedToPolicy) {
            setError("Lütfen iade politikasını kabul edin");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/payment/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Ödeme başlatılamadı");
                return;
            }

            // Redirect to iyzico payment page
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            }
        } catch (err) {
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return <div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>;
    }

    if (!session) {
        router.push("/login");
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="max-w-2xl w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Ödeme</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        2025 İlkbahar DUS Dönemi Erişimi
                    </p>
                </div>

                <div className="bg-card border rounded-lg p-6 space-y-6">
                    {/* Pricing Details */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Paket Detayları</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tek Dönem Erişimi</span>
                                <span className="font-medium">{price} {currency}</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                                <span>Toplam</span>
                                <span>{price} {currency}</span>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="font-medium mb-3">Neler Dahil?</h3>
                        <ul className="space-y-2">
                            {[
                                "30 adete kadar tercih seçimi",
                                "Canlı yerleştirme olasılığı hesaplaması",
                                "Detaylı analiz ve istatistikler",
                                "Puan ve tercih sırası karşılaştırmaları",
                                "Tercih önerileri",
                                "Yerleştirme sonuçlarına kadar erişim",
                            ].map((feature, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <svg
                                        className="w-5 h-5 text-green-500 mt-0.5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                    <span className="text-sm">{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Warning */}
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                        <div className="flex gap-3">
                            <svg
                                className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                            <div className="flex-1">
                                <h4 className="text-sm font-medium text-amber-900">ÖNEMLİ: İade Politikası</h4>
                                <p className="mt-1 text-xs text-amber-700">
                                    ÖSYM doğrulamanız tamamlandıktan ve ödeme işleminiz gerçekleştikten sonra
                                    hizmete erişim sağlanacaktır. <strong>Hizmete erişim sağlandıktan sonra
                                        iade yapılamamaktadır.</strong> Türk hukuku uyarınca dijital içerik teslimi
                                    başladıktan sonra cayma hakkı kullanılamaz.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Agreement */}
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="policy"
                            checked={agreedToPolicy}
                            onCheckedChange={(checked) => setAgreedToPolicy(checked as boolean)}
                        />
                        <label
                            htmlFor="policy"
                            className="text-sm text-muted-foreground cursor-pointer"
                        >
                            İade politikasını okudum ve anladım. Ödeme yaptıktan ve hizmete erişim
                            sağladıktan sonra iade yapılamayacağını kabul ediyorum.
                        </label>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Payment Button */}
                    <Button
                        onClick={handlePayment}
                        className="w-full"
                        size="lg"
                        disabled={!agreedToPolicy || isLoading}
                    >
                        {isLoading ? "Yönlendiriliyorsunuz..." : `Ödeme Yap (${price} ${currency})`}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        Güvenli ödeme için iyzico altyapısı kullanılmaktadır
                    </p>
                </div>
            </div>
        </div>
    );
}
