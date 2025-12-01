import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get active exam period
export const getActive = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("examPeriods")
            .withIndex("by_active", (q) => q.eq("isActive", true))
            .first();
    },
});

// Get period by ID
export const getById = query({
    args: { id: v.id("examPeriods") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Create new exam period
export const create = mutation({
    args: {
        name: v.string(),
        displayName: v.string(),
        examDate: v.number(),
        preferencesOpenDate: v.number(),
        preferencesDeadline: v.number(),
        resultsPublishDate: v.number(),
        isActive: v.boolean(),
    },
    handler: async (ctx, args) => {
        // If setting as active, deactivate all others
        if (args.isActive) {
            const activePeriods = await ctx.db
                .query("examPeriods")
                .withIndex("by_active", (q) => q.eq("isActive", true))
                .collect();

            for (const period of activePeriods) {
                await ctx.db.patch(period._id, {
                    isActive: false,
                    updatedAt: Date.now(),
                });
            }
        }

        const periodId = await ctx.db.insert("examPeriods", {
            ...args,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return periodId;
    },
});

// List all exam periods
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("examPeriods")
            .order("desc")
            .collect();
    },
});
