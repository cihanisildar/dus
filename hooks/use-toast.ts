import toast from 'react-hot-toast';

export const useToast = () => {
    const success = (message: string) => {
        toast.success(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#10b981',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#10b981',
            },
        });
    };

    const error = (message: string) => {
        toast.error(message, {
            duration: 4000,
            position: 'top-right',
            style: {
                background: '#ef4444',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
            },
            iconTheme: {
                primary: '#fff',
                secondary: '#ef4444',
            },
        });
    };

    const loading = (message: string) => {
        return toast.loading(message, {
            position: 'top-right',
            style: {
                background: '#3b82f6',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
            },
        });
    };

    const promise = <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string;
            error: string;
        }
    ) => {
        return toast.promise(
            promise,
            {
                loading: messages.loading,
                success: messages.success,
                error: messages.error,
            },
            {
                position: 'top-right',
                style: {
                    padding: '16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
            }
        );
    };

    const info = (message: string) => {
        toast(message, {
            duration: 4000,
            position: 'top-right',
            icon: 'ℹ️',
            style: {
                background: '#3b82f6',
                color: '#fff',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
            },
        });
    };

    const dismiss = (toastId?: string) => {
        toast.dismiss(toastId);
    };

    return {
        success,
        error,
        loading,
        promise,
        info,
        dismiss,
    };
};
