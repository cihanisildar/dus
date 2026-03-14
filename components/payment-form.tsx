"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Lock, Shield } from "lucide-react";

interface PaymentFormProps {
    price: number;
    currency: string;
}

declare global {
    interface Window {
        Paddle?: {
            Environment: { set: (env: string) => void };
            Initialize: (config: { token: string; eventCallback?: (event: unknown) => void }) => void;
            Checkout: {
                open: (params: {
                    items: Array<{ priceId: string; quantity: number }>;
                    customData?: Record<string, string>;
                    successUrl?: string;
                }) => void;
            };
        };
    }
}

export function PaymentForm({ price, currency }: PaymentFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [paddleReady, setPaddleReady] = useState(false);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
        script.async = true;
        script.onload = () => {
            if (window.Paddle) {
                const isSandbox = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN?.startsWith("test_");
                if (isSandbox) {
                    window.Paddle.Environment.set("sandbox");
                }
                window.Paddle.Initialize({
                    token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "",
                });
                setPaddleReady(true);
            }
        };
        document.head.appendChild(script);
        return () => {
            document.head.removeChild(script);
        };
    }, []);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreedToTerms) {
            setError("Lütfen kullanım koşullarını kabul edin");
            return;
        }

        if (!paddleReady || !window.Paddle) {
            setError("Ödeme sistemi yükleniyor, lütfen bekleyin");
            return;
        }

        setError("");
        setIsLoading(true);

        try {
            // Create pending payment record and get paymentToken
            const response = await fetch("/api/payment/initiate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Ödeme başlatılamadı");
                setIsLoading(false);
                return;
            }

            const appUrl = window.location.origin;

            // Open Paddle overlay
            window.Paddle.Checkout.open({
                items: [{ priceId: data.priceId, quantity: 1 }],
                customData: { paymentToken: data.paymentToken },
                successUrl: `${appUrl}/dashboard?payment=success`,
            });

            setIsLoading(false);
        } catch (err) {
            console.error("Payment error:", err);
            setError("Bir hata oluştu. Lütfen tekrar deneyin.");
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handlePayment} className="space-y-6">
            {/* Payment Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-blue-900 mb-2">Güvenli Ödeme</h3>
                        <p className="text-sm text-blue-800">
                            Ödeme yap butonuna tıkladığınızda, güvenli Paddle ödeme penceresi açılacaktır.
                            Kart bilgilerinizi orada güvenle girebilirsiniz.
                        </p>
                    </div>
                </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
                <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                    <span className="underline cursor-pointer hover:text-blue-600">Kullanım Koşulları</span> ve{" "}
                    <span className="underline cursor-pointer hover:text-blue-600">Gizlilik Politikası</span>&apos;nı
                    okudum ve kabul ediyorum
                </label>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={!agreedToTerms || isLoading || !paddleReady}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Yükleniyor...
                    </>
                ) : !paddleReady ? (
                    <>Ödeme sistemi hazırlanıyor...</>
                ) : (
                    <>
                        {price.toFixed(2)} {currency} Ödeme Yap
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-1">
                    <Lock className="w-4 h-4" />
                    <span>SSL Güvenli</span>
                </div>
                <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>Paddle ile güvence altında</span>
                </div>
            </div>
        </form>
    );
}
