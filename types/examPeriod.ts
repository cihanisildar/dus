export type AccountStatus =
    | "registered"        // Just signed up, no verification
    | "verified"          // ÖSYM verified, not paid
    | "active"            // Paid and has access
    | "expired"           // Period ended
    | "suspended";        // Admin suspended

export interface ExamPeriod {
    _id: string;
    _creationTime: number;
    name: string; // "2025-Spring-DUS"
    displayName: string; // "2025 İlkbahar DUS"
    examDate: number; // timestamp
    preferencesOpenDate: number;
    preferencesDeadline: number;
    resultsPublishDate: number;
    isActive: boolean; // Only one active period at a time
    createdAt: number;
    updatedAt: number;
}
