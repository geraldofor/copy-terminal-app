import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

/**
 * DB access for PayPal subscriptions. Actions run in the Node runtime and
 * cannot touch `ctx.db` directly, so the payment flow routes every read and
 * write through these internal queries/mutations.
 */

export const insertSubscription = internalMutation({
  args: {
    userId: v.id("users"),
    paypalSubscriptionId: v.string(),
    planId: v.string(),
    cycle: v.union(v.literal("monthly"), v.literal("annual")),
    status: v.string(),
    monthlyCredits: v.number(),
    rolloverCap: v.number(),
  },
  handler: async (ctx, args) => {
    const subscriptionId = await ctx.db.insert("subscriptions", {
      ...args,
      currency: "USD",
      creditsGranted: 0,
      createdAt: Date.now(),
    });
    return { subscriptionId };
  },
});

export const getSubscriptionByPaypal = internalQuery({
  args: { paypalSubscriptionId: v.string() },
  handler: async (ctx, { paypalSubscriptionId }) => {
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_paypal", (q) =>
        q.eq("paypalSubscriptionId", paypalSubscriptionId),
      )
      .first();
  },
});

export const getSubscription = internalQuery({
  args: { subscriptionId: v.id("subscriptions") },
  handler: async (ctx, { subscriptionId }) => {
    return await ctx.db.get(subscriptionId);
  },
});

export const patchSubscription = internalMutation({
  args: {
    subscriptionId: v.id("subscriptions"),
    status: v.optional(v.string()),
    lastPaymentAt: v.optional(v.number()),
    lastGrantedAt: v.optional(v.number()),
    creditsGranted: v.optional(v.number()),
  },
  handler: async (ctx, { subscriptionId, ...patch }) => {
    await ctx.db.patch(subscriptionId, patch);
  },
});
