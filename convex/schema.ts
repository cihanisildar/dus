import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        phone: v.string(),
        passwordHash: v.string(),

        // Period tracking
        currentPeriodId: v.optional(v.id("examPeriods")),
        verifiedPeriods: v.array(v.id("examPeriods")),
        paidPeriods: v.array(v.id("examPeriods")),

        // Account status
        accountStatus: v.union(
            v.literal("registered"),
            v.literal("verified"),
            v.literal("active"),
            v.literal("expired"),
            v.literal("suspended")
        ),

        // Timestamps
        createdAt: v.number(),
        updatedAt: v.number(),
        lastLoginAt: v.optional(v.number()),
    })
        .index("by_email", ["email"])
        .index("by_status", ["accountStatus"])
        .index("by_period", ["currentPeriodId"]),

    examPeriods: defineTable({
        name: v.string(), // "2025-Spring-DUS"
        displayName: v.string(), // "2025 İlkbahar DUS"
        examDate: v.number(),
        preferencesOpenDate: v.number(),
        preferencesDeadline: v.number(),
        resultsPublishDate: v.number(),
        isActive: v.boolean(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_active", ["isActive"])
        .index("by_exam_date", ["examDate"]),

    payments: defineTable({
        userId: v.id("users"),
        periodId: v.id("examPeriods"),
        amount: v.number(),
        currency: v.literal("TRY"),
        status: v.union(
            v.literal("pending"),
            v.literal("completed"),
            v.literal("failed"),
            v.literal("refunded")
        ),
        provider: v.literal("iyzico"),
        transactionId: v.string(),
        paymentToken: v.string(),
        conversationId: v.string(),
        paidAt: v.optional(v.number()),
        metadata: v.object({
            ip: v.string(),
            userAgent: v.string(),
        }),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_period", ["periodId"])
        .index("by_token", ["paymentToken"])
        .index("by_status", ["status"]),

    osymVerifications: defineTable({
        userId: v.id("users"),
        periodId: v.id("examPeriods"),
        osymResultCode: v.string(),
        dusScore: v.number(),
        examDate: v.number(),
        verifiedAt: v.number(),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_period", ["periodId"])
        .index("by_code", ["osymResultCode"]),
});
