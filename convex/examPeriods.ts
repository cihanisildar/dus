import { v } from "convex/values";
import { query } from "./_generated/server";

// Get exam period by ID
export const getById = query({
    args: { id: v.id("examPeriods") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

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

// Get all exam periods
export const getAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("examPeriods")
            .order("desc")
            .collect();
    },
});
