'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function PaymentCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const toast = useToast();

    useEffect(() => {
        const status = searchParams.get('status');
        const message = searchParams.get('message');

        if (status === 'success') {
            toast.success(message || 'Ödeme başarıyla tamamlandı! DUS360 Premium\'a hoş geldiniz!');

            // Redirect to dashboard after showing toast
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } else if (status === 'failure') {
            toast.error(message || 'Ödeme başarısız oldu. Lütfen tekrar deneyin.');

            // Redirect back to payment page
            setTimeout(() => {
                router.push('/dashboard/payment');
            }, 2000);
        } else if (status === 'cancelled') {
            toast.info('Ödeme işlemi iptal edildi.');

            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        }
    }, [searchParams, router, toast]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">İşleminiz kontrol ediliyor...</p>
            </div>
        </div>
    );
}
