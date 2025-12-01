export type AccountStatus =
  | "registered"        // Just signed up, no verification
  | "verified"          // ÖSYM verified, not paid
  | "active"            // Paid and has access
  | "expired"           // Period ended
  | "suspended";        // Admin suspended

export interface User {
  _id: string;
  _creationTime: number;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;

  // Period tracking
  currentPeriodId?: string; // Reference to active ExamPeriod
  verifiedPeriods: string[]; // All period IDs verified for
  paidPeriods: string[]; // All period IDs paid for

  // Account status
  accountStatus: AccountStatus;

  // Timestamps
  createdAt: number;
  updatedAt: number;
  lastLoginAt?: number;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  accountStatus: AccountStatus;
  currentPeriodId?: string;
  dusScore?: number; // From current period's verification
}

