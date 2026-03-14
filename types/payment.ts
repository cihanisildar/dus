export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentProvider = "paddle" | "iyzico"; // iyzico kept for legacy data only

export interface Payment {
    _id: string;
    _creationTime: number;
    userId: string;
    periodId: string;
    amount: number;
    currency: "TRY";
    status: PaymentStatus;
    provider: PaymentProvider;
    transactionId: string;
    paymentToken: string;
    conversationId?: string; // Legacy iyzico field, nullable
    paidAt?: number;
    metadata: {
        ip: string;
        userAgent: string;
    };
    createdAt: number;
    updatedAt: number;
}
