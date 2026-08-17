import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { ROLES, roleValidator, type Role } from "./schema";
import { DEFAULT_CREDITS } from "./usage";

type ActivityEvent = {
  type: "signup" | "order" | "copy";
  ts: number;
  email: string | null;
  reference: string | null;
  itemName: string | null;
  status: string | null;
  template: string | null;
  title: string | null;
};

/** Returns the signed-in user, or null when not an admin. Never throws. */
async function getAdminUser(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    return null;
  }
  const user = await ctx.db.get(userId);
  if (user === null || user.role !== ROLES.ADMIN) {
    return null;
  }
  return user;
}

/** Throws unless the caller is a signed-in user with the admin role. */
async function requireAdmin(ctx: QueryCtx) {
  const admin = await getAdminUser(ctx);
  if (admin === null) {
    throw new ConvexError("Acesso restrito a administradores.");
  }
  return admin;
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

/** Platform-wide numbers for the admin overview. Returns null for non-admins
 * (safe to subscribe from the client without crashing the page). */
export const adminStats = query({
  args: {},
  handler: async (ctx) => {
    const admin = await getAdminUser(ctx);
    if (admin === null) {
      return null;
    }
    const users = await ctx.db.query("users").collect();
    const copies = await ctx.db.query("copies").collect();

    let creditsIssued = 0;
    let creditsRemaining = 0;
    let generatedTotal = 0;
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    let newUsers7d = 0;
    for (const user of users) {
      creditsIssued += user.creditsTotal ?? DEFAULT_CREDITS;
      creditsRemaining += user.credits ?? DEFAULT_CREDITS;
      generatedTotal += user.generatedTotal ?? 0;
      if (user._creationTime >= weekAgo) {
        newUsers7d += 1;
      }
    }

    return {
      totalUsers: users.length,
      totalCopies: copies.length,
      creditsIssued,
      creditsRemaining,
      generatedTotal,
      newUsers7d,
    };
  },
});

/** Every user with their usage summary, newest first. Returns null for
 * non-admins (safe to subscribe from the client without crashing). */
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const admin = await getAdminUser(ctx);
    if (admin === null) {
      return null;
    }
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
        signupSource: user.signupSource ?? null,
        signupReferrer: user.signupReferrer ?? null,
      }))
      .sort((a, b) => b._creationTime - a._creationTime);
  },
});

/**
 * Store where the current user came from (referrer / UTM source). Called
 * once from the client after sign-in; keeps the first recorded source.
 */
export const recordSignupSource = mutation({
  args: {
    source: v.optional(v.string()),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, { source, referrer }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return { ok: false };
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
      return { ok: false };
    }
    if (!user.signupSource && source) {
      await ctx.db.patch(userId, {
        signupSource: source.slice(0, 120),
        signupReferrer: referrer ? referrer.slice(0, 500) : undefined,
      });
    }
    return { ok: true };
  },
});

/**
 * Recent platform events (signups, manual orders, saved copies) merged
 * into a single timeline, newest first. Returns null for non-admins.
 */
export const adminActivity = query({
  args: {},
  handler: async (ctx) => {
    const admin = await getAdminUser(ctx);
    if (admin === null) {
      return null;
    }
    const users = await ctx.db.query("users").collect();
    const orders = await ctx.db.query("manualOrders").collect();
    const copies = await ctx.db.query("copies").collect();

    const emailByUser = new Map(
      users.map((u) => [u._id, u.email ?? u.name ?? null]),
    );

    const events: ActivityEvent[] = [];
    for (const user of users) {
      events.push({
        type: "signup",
        ts: user._creationTime,
        email: user.email ?? user.name ?? null,
        reference: null,
        itemName: null,
        status: null,
        template: null,
        title: null,
      });
    }
    for (const order of orders) {
      events.push({
        type: "order",
        ts: order.confirmedAt ?? order.cancelledAt ?? order._creationTime,
        email: order.userEmail ?? emailByUser.get(order.userId) ?? null,
        reference: order.reference,
        itemName: order.itemName,
        status: order.status,
        template: null,
        title: null,
      });
    }
    for (const copy of copies) {
      events.push({
        type: "copy",
        ts: copy.createdAt,
        email: emailByUser.get(copy.userId) ?? null,
        reference: null,
        itemName: null,
        status: null,
        template: copy.template,
        title: copy.title,
      });
    }

    return events.sort((a, b) => b.ts - a.ts).slice(0, 20);
  },
});

/**
 * Recent saved copies across all users, with the owner's email.
 * Returns null for non-admins.
 */
export const adminCopies = query({
  args: {},
  handler: async (ctx) => {
    const admin = await getAdminUser(ctx);
    if (admin === null) {
      return null;
    }
    const copies = await ctx.db.query("copies").collect();
    const users = await ctx.db.query("users").collect();
    const emailByUser = new Map(
      users.map((u) => [u._id, u.email ?? u.name ?? null]),
    );
    return copies
      .map((copy) => ({
        _id: copy._id,
        createdAt: copy.createdAt,
        template: copy.template,
        title: copy.title,
        content: copy.content,
        email: emailByUser.get(copy.userId) ?? null,
      }))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 12);
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

/**
 * Permanently delete a user, including their saved copies, linked auth
 * accounts and active sessions. Admin only. You cannot delete yourself.
 */
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const admin = await requireAdmin(ctx);
    if (admin._id === userId) {
      throw new ConvexError("Você não pode excluir seu próprio acesso.");
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new ConvexError("Usuário não encontrado.");
    }

    // Saved copies (cascade)
    const copies = await ctx.db
      .query("copies")
      .withIndex("by_user_created", (q) => q.eq("userId", userId))
      .collect();
    for (const copy of copies) {
      await ctx.db.delete(copy._id);
    }

    // Linked auth accounts (providers) and active sessions (cascade)
    const accounts = await ctx.db
      .query("authAccounts")
      .withIndex("userIdAndProvider", (q) => q.eq("userId", userId))
      .collect();
    for (const account of accounts) {
      await ctx.db.delete(account._id);
    }
    const sessions = await ctx.db
      .query("authSessions")
      .withIndex("userId", (q) => q.eq("userId", userId))
      .collect();
    for (const session of sessions) {
      await ctx.db.delete(session._id);
    }

    await ctx.db.delete(userId);
    return { ok: true };
  },
});
