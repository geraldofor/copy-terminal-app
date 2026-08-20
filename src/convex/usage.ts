import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

/** Free credits granted to every new account. */
export const DEFAULT_CREDITS = 25;

/**
 * Current plan summary for the signed-in user:
 * remaining credits, plan total, generations run and saved copy count.
 */
export const getUsage = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (user === null) {
      return null;
    }
    const copies = await ctx.db
      .query("copies")
      .withIndex("by_user_created", (q) => q.eq("userId", user._id))
      .collect();
    return {
      credits: user.credits ?? DEFAULT_CREDITS,
      creditsTotal: user.creditsTotal ?? DEFAULT_CREDITS,
      generatedTotal: user.generatedTotal ?? 0,
      savedCount: copies.length,
    };
  },
});

/**
 * Debit exactly 1 generation credit.
 *
 * SECURITY: The `amount` parameter is accepted for backward compatibility
 * but is IGNORED — the mutation always deducts exactly 1 credit. This
 * prevents client-side abuse where a malicious caller could pass negative
 * values or zero to skip payment.
 */
export const consumeCredits = mutation({
  args: { amount: v.optional(v.number()) },
  handler: async (ctx, { amount: _amount }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new ConvexError("Usuário não encontrado.");
    }
    if (user.blocked) {
      throw new ConvexError("Conta bloqueada. Entre em contato com o suporte.");
    }
    const current = user.credits ?? DEFAULT_CREDITS;
    if (current <= 0) {
      throw new ConvexError(
        "Créditos esgotados. Recarregue seu plano para continuar gerando.",
      );
    }
    // Always consume exactly 1 — ignore any client-supplied amount
    const next = Math.max(0, current - 1);
    await ctx.db.patch(userId, {
      credits: next,
      creditsTotal: user.creditsTotal ?? DEFAULT_CREDITS,
      generatedTotal: (user.generatedTotal ?? 0) + 1,
    });
    return { credits: next };
  },
});

/**
 * Grant credits to a specific user. Internal only — called by the PayPal
 * capture action after the payment is confirmed. Adds to the balance and
 * to the lifetime total of the current plan.
 */
export const grantCredits = internalMutation({
  args: { userId: v.id("users"), amount: v.number() },
  handler: async (ctx, { userId, amount }) => {
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new ConvexError("Usuário não encontrado.");
    }
    const current = user.credits ?? DEFAULT_CREDITS;
    const next = current + amount;
    await ctx.db.patch(userId, {
      credits: next,
      creditsTotal: Math.max(user.creditsTotal ?? DEFAULT_CREDITS, next),
    });
    return { credits: next };
  },
});

/**
 * Grant one subscription billing cycle's credits, capped by the plan's
 * rollover limit. The cap never reduces a balance that is already above
 * it (e.g. from paid top-ups); it only bounds what a subscription can
 * accumulate. Internal only — called by the PayPal subscription flow.
 */
export const grantSubscriptionCycle = internalMutation({
  args: {
    userId: v.id("users"),
    amount: v.number(),
    cap: v.number(),
  },
  handler: async (ctx, { userId, amount, cap }): Promise<{ credits: number }> => {
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new ConvexError("Usuário não encontrado.");
    }
    const current = user.credits ?? DEFAULT_CREDITS;
    const next = Math.min(current + amount, Math.max(cap, current));
    await ctx.db.patch(userId, {
      credits: next,
      creditsTotal: Math.max(user.creditsTotal ?? DEFAULT_CREDITS, next),
    });
    return { credits: next };
  },
});

/**
 * Grant credits — admin only. Previously this was a public mutation that
 * allowed any logged-in user to add free credits to themselves. Now only
 * admins can use it. Amount is clamped (1–500, integer).
 */
export const addCredits = mutation({
  args: { amount: v.optional(v.number()) },
  handler: async (ctx, { amount = 10 }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
    }
    const caller = await ctx.db.get(userId);
    if (caller === null || caller.role !== "admin") {
      throw new ConvexError("Acesso restrito a administradores.");
    }
    // Clamp amount to prevent abuse
    const safe = Math.max(1, Math.min(500, Math.floor(amount)));
    const current = caller.credits ?? DEFAULT_CREDITS;
    const total = Math.max(caller.creditsTotal ?? DEFAULT_CREDITS, current + safe);
    await ctx.db.patch(userId, {
      credits: current + safe,
      creditsTotal: total,
    });
    return { credits: current + safe };
  },
});
