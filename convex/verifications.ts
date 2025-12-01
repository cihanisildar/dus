import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get verification by user and period
export const getByUserAndPeriod = query({
    args: {
        userId: v.id("users"),
        periodId: v.id("examPeriods"),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("osymVerifications")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("periodId"), args.periodId))
            .first();
    },
});

// Get all verifications by user
export const getByUser = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("osymVerifications")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

// Create verification record
export const create = mutation({
    args: {
        userId: v.id("users"),
        periodId: v.id("examPeriods"),
        osymResultCode: v.string(),
        dusScore: v.number(),
        examDate: v.number(),
    },
    handler: async (ctx, args) => {
        // Check if already verified for this period
        const existing = await ctx.db
            .query("osymVerifications")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("periodId"), args.periodId))
            .first();

        if (existing) {
            throw new Error("Already verified for this period");
        }

        const verificationId = await ctx.db.insert("osymVerifications", {
            ...args,
            verifiedAt: Date.now(),
            createdAt: Date.now(),
        });

        return verificationId;
    },
});
