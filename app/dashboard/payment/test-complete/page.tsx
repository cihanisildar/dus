'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function TestPaymentCompletePage() {
    const router = useRouter();
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState<string | null>(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchPendingPayments();
    }, []);

    const fetchPendingPayments = async () => {
        try {
            const response = await fetch('/api/payment/test/pending');
            const data = await response.json();

            if (response.ok) {
                setPayments(data.payments || []);
            } else {
                setError(data.error || 'Failed to fetch payments');
            }
        } catch (err) {
            setError('Error fetching payments');
        } finally {
            setLoading(false);
        }
    };

    const completePayment = async (token: string) => {
        setCompleting(token);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/payment/callback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Payment completed successfully! ✅');
                // Remove from list
                setPayments(payments.filter(p => p.paymentToken !== token));

                setTimeout(() => {
                    router.push('/dashboard/payment');
                }, 2000);
            } else {
                setError(data.error || 'Payment completion failed');
            }
        } catch (err) {
            setError('Error completing payment');
        } finally {
            setCompleting(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading pending payments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-amber-100 border-2 border-amber-400 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
                        <div>
                            <h1 className="text-xl font-bold text-amber-900 mb-2">
                                🧪 Test Payment Completion
                            </h1>
                            <p className="text-sm text-amber-800">
                                This is a <strong>TEST PAGE</strong> for completing mock payments.
                                In production, this would be handled by iyzico callback.
                            </p>
                        </div>
                    </div>
                </div>

                {success && (
                    <div className="bg-green-100 border border-green-400 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-700" />
                            <p className="text-green-800 font-medium">{success}</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-700" />
                            <p className="text-red-800 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Pending Payments
                    </h2>

                    {payments.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-4">No pending payments found</p>
                            <p className="text-sm text-gray-400">
                                Go to payment page and click "Ödeme Yap" to create a test payment
                            </p>
                            <Button
                                onClick={() => router.push('/dashboard/payment')}
                                className="mt-6"
                            >
                                Go to Payment Page
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {payments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="font-semibold text-gray-900 text-lg">
                                                {(payment.amount / 100).toFixed(2)} {payment.currency}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Created: {new Date(payment.createdAt).toLocaleString('tr-TR')}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
                                            {payment.status}
                                        </span>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Token:</span>
                                            <span className="font-mono text-gray-900">{payment.paymentToken}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Conversation ID:</span>
                                            <span className="font-mono text-gray-900">{payment.conversationId}</span>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => completePayment(payment.paymentToken)}
                                        disabled={completing === payment.paymentToken}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                        {completing === payment.paymentToken ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Completing Payment...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                                Complete This Payment (Test)
                                            </>
                                        )}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 text-center">
                    <Button
                        onClick={() => router.push('/dashboard')}
                        variant="outline"
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
}
