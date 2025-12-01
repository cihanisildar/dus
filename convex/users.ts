import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get user by email
export const getByEmail = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();
    },
});

// Get user by ID
export const getById = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create new user
export const create = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.string(),
        passwordHash: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existing) {
            throw new Error("User with this email already exists");
        }

        const userId = await ctx.db.insert("users", {
            ...args,
            accountStatus: "registered",
            verifiedPeriods: [],
            paidPeriods: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return userId;
    },
});

// Update user
export const update = mutation({
    args: {
        id: v.id("users"),
        accountStatus: v.optional(
            v.union(
                v.literal("registered"),
                v.literal("verified"),
                v.literal("active"),
                v.literal("expired"),
                v.literal("suspended")
            )
        ),
        currentPeriodId: v.optional(v.id("examPeriods")),
        verifiedPeriods: v.optional(v.array(v.id("examPeriods"))),
        paidPeriods: v.optional(v.array(v.id("examPeriods"))),
        lastLoginAt: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        await ctx.db.patch(id, {
            ...updates,
            updatedAt: Date.now(),
        });

        return id;
    },
});

// Update last login
export const updateLastLogin = mutation({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            lastLoginAt: Date.now(),
            updatedAt: Date.now(),
        });
    },
});
