import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get payment by token
export const getByToken = query({
    args: { token: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("payments")
            .withIndex("by_token", (q) => q.eq("paymentToken", args.token))
            .first();
    },
});

// Get payments by user
export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("payments")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

// Create payment record
export const create = mutation({
    args: {
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
        metadata: v.object({
            ip: v.string(),
            userAgent: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        const paymentId = await ctx.db.insert("payments", {
            ...args,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return paymentId;
    },
});

// Update payment status
export const updateStatus = mutation({
    args: {
        token: v.string(),
        status: v.union(
            v.literal("pending"),
            v.literal("completed"),
            v.literal("failed"),
            v.literal("refunded")
        ),
        transactionId: v.optional(v.string()),
        paidAt: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const payment = await ctx.db
            .query("payments")
            .withIndex("by_token", (q) => q.eq("paymentToken", args.token))
            .first();

        if (!payment) {
            throw new Error("Payment not found");
        }

        await ctx.db.patch(payment._id, {
            status: args.status,
            ...(args.transactionId && { transactionId: args.transactionId }),
            ...(args.paidAt && { paidAt: args.paidAt }),
            updatedAt: Date.now(),
        });

        return payment._id;
    },
});
