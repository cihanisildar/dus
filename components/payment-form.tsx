"use client";

import { useState } from "react";
import { ArrowRight, Lock, Shield } from "lucide-react";

interface PaymentFormProps {
    price: number;
    currency: string;
}

export function PaymentForm({ price, currency }: PaymentFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!agreedToTerms) {
            setError("Lütfen kullanım koşullarını kabul edin");
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
                setIsLoading(false);
                return;
            }

            // Redirect to iyzico payment page
            if (data.paymentUrl) {
                window.location.href = data.paymentUrl;
            } else {
                setError("Ödeme URL'si alınamadı");
                setIsLoading(false);
            }
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
                        <p className="text-sm text-blue-800 mb-3">
                            Ödeme yap butonuna tıkladığınızda, güvenli iyzico ödeme sayfasına yönlendirileceksiniz.
                            Kart bilgilerinizi orada güvenle girebilirsiniz.
                        </p>
                        <div className="bg-white rounded-lg p-3 border border-blue-200">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Test Kartı (Sandbox):</p>
                            <div className="space-y-1 text-xs text-gray-600">
                                <p><span className="font-medium">Kart:</span> 5528 7900 0000 0003</p>
                                <p><span className="font-medium">Son Kullanma:</span> 12/30</p>
                                <p><span className="font-medium">CVV:</span> 123</p>
                                <p><span className="font-medium">İsim:</span> Test User</p>
                            </div>
                        </div>
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
                    <span className="underline cursor-pointer hover:text-blue-600">Gizlilik Politikası</span>'nı
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
                disabled={!agreedToTerms || isLoading}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Yönlendiriliyorsunuz...
                    </>
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
                    <span>iyzico ile güvence altında</span>
                </div>
            </div>
        </form>
    );
}
