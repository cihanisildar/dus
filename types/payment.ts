export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Payment {
    _id: string;
    _creationTime: number;
    userId: string;
    periodId: string;
    amount: number;
    currency: "TRY";
    status: PaymentStatus;
    provider: "iyzico";
    transactionId: string; // iyzico transaction ID
    paymentToken: string; // iyzico payment token
    conversationId: string; // iyzico conversation ID
    paidAt?: number;
    metadata: {
        ip: string;
        userAgent: string;
    };
    createdAt: number;
    updatedAt: number;
}
