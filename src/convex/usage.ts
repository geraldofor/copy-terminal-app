import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
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
 * Debit generation credits. New accounts implicitly start with DEFAULT_CREDITS.
 * Throws when the balance is already at zero.
 */
export const consumeCredits = mutation({
  args: { amount: v.optional(v.number()) },
  handler: async (ctx, { amount = 1 }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new ConvexError("Usuário não encontrado.");
    }
    const current = user.credits ?? DEFAULT_CREDITS;
    if (current <= 0) {
      throw new ConvexError(
        "Créditos esgotados. Recarregue seu plano para continuar gerando.",
      );
    }
    const next = Math.max(0, current - amount);
    await ctx.db.patch(userId, {
      credits: next,
      creditsTotal: user.creditsTotal ?? DEFAULT_CREDITS,
      generatedTotal: (user.generatedTotal ?? 0) + amount,
    });
    return { credits: next };
  },
});

/**
 * Demo helper: top up credits so the product can be explored freely.
 */
export const addCredits = mutation({
  args: { amount: v.optional(v.number()) },
  handler: async (ctx, { amount = 10 }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new ConvexError("Usuário não encontrado.");
    }
    const current = user.credits ?? DEFAULT_CREDITS;
    const total = Math.max(user.creditsTotal ?? DEFAULT_CREDITS, current + amount);
    await ctx.db.patch(userId, {
      credits: current + amount,
      creditsTotal: total,
    });
    return { credits: current + amount };
  },
});
