import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { ROLES, roleValidator, type Role } from "./schema";
import { DEFAULT_CREDITS } from "./usage";

/** Throws unless the caller is a signed-in user with the admin role. */
async function requireAdmin(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("Sessão expirada. Entre novamente.");
  }
  const user = await ctx.db.get(userId);
  if (user === null || user.role !== ROLES.ADMIN) {
    throw new ConvexError("Acesso restrito a administradores.");
  }
  return user;
}

/** True once at least one admin exists. Public (used by the claim flow). */
export const adminExists = query({
  args: {},
  handler: async (ctx) => {
    const admin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), ROLES.ADMIN))
      .first();
    return admin !== null;
  },
});

/**
 * First-admin bootstrap: lets the very first account claim the admin role.
 * Only works while no admin exists yet — after that it's a no-op.
 */
export const claimAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Sessão expirada. Entre novamente.");
    }
    const admin = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("role"), ROLES.ADMIN))
      .first();
    if (admin !== null) {
      throw new ConvexError("Já existe um administrador na plataforma.");
    }
    await ctx.db.patch(userId, { role: ROLES.ADMIN });
    return { ok: true };
  },
});

/** Platform-wide numbers for the admin overview. */
export const adminStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const users = await ctx.db.query("users").collect();
    const copies = await ctx.db.query("copies").collect();

    let creditsIssued = 0;
    let creditsRemaining = 0;
    let generatedTotal = 0;
    for (const user of users) {
      creditsIssued += user.creditsTotal ?? DEFAULT_CREDITS;
      creditsRemaining += user.credits ?? DEFAULT_CREDITS;
      generatedTotal += user.generatedTotal ?? 0;
    }

    return {
      totalUsers: users.length,
      totalCopies: copies.length,
      creditsIssued,
      creditsRemaining,
      generatedTotal,
    };
  },
});

/** Every user with their usage summary, newest first. Admin only. */
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const users = await ctx.db.query("users").collect();
    const copies = await ctx.db.query("copies").collect();

    const savedCount = new Map<string, number>();
    for (const copy of copies) {
      savedCount.set(copy.userId, (savedCount.get(copy.userId) ?? 0) + 1);
    }

    return users
      .map((user) => ({
        _id: user._id,
        _creationTime: user._creationTime,
        name: user.name ?? null,
        email: user.email ?? null,
        isAnonymous: user.isAnonymous ?? false,
        role: (user.role ?? ROLES.USER) as Role,
        blocked: user.blocked ?? false,
        credits: user.credits ?? DEFAULT_CREDITS,
        creditsTotal: user.creditsTotal ?? DEFAULT_CREDITS,
        generatedTotal: user.generatedTotal ?? 0,
        savedCount: savedCount.get(user._id) ?? 0,
      }))
      .sort((a, b) => b._creationTime - a._creationTime);
  },
});

/** Change a user's role (promote/demote). Admin only. */
export const setRole = mutation({
  args: { userId: v.id("users"), role: roleValidator },
  handler: async (ctx, { userId, role }) => {
    const admin = await requireAdmin(ctx);
    if (admin._id === userId) {
      throw new ConvexError("Você não pode alterar seu próprio cargo.");
    }
    await ctx.db.patch(userId, { role });
  },
});

/** Add or remove credits from a user's balance. Admin only. */
export const adjustCredits = mutation({
  args: { userId: v.id("users"), delta: v.number() },
  handler: async (ctx, { userId, delta }) => {
    await requireAdmin(ctx);
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new ConvexError("Usuário não encontrado.");
    }
    const current = user.credits ?? DEFAULT_CREDITS;
    const next = Math.max(0, current + delta);
    await ctx.db.patch(userId, {
      credits: next,
      creditsTotal: Math.max(user.creditsTotal ?? DEFAULT_CREDITS, next),
    });
    return { credits: next };
  },
});

/** Block or unblock a user. Admin only. */
export const setBlocked = mutation({
  args: { userId: v.id("users"), blocked: v.boolean() },
  handler: async (ctx, { userId, blocked }) => {
    const admin = await requireAdmin(ctx);
    if (admin._id === userId) {
      throw new ConvexError("Você não pode bloquear seu próprio acesso.");
    }
    await ctx.db.patch(userId, { blocked });
  },
});
