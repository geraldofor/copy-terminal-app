import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation, query, MutationCtx, QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { getPack, getPlan, packPrice } from "./packs";
import { ROLES } from "./schema";

/**
 * Manual payment flow (bridge while automated gateways are being approved).
 *
 * Flow: the customer picks a pack/subscription → a pending order is created
 * with a human reference code → the admin sees it in the admin panel (with a
 * sidebar badge) → after checking the payment, the admin confirms in one
 * click → credits are granted automatically and the customer's UI updates
 * in real time (Convex reactivity).
 *
 * The payment instructions shown to the customer are editable by the admin
 * (stored in the `settings` table under `manualPaymentInstructions`) and
 * fall back to the MANUAL_PAYMENT_INSTRUCTIONS env var when not configured.
 */

const SETTINGS_KEY = "manualPaymentInstructions";

type SerializedOrder = {
  _id: string;
  createdAt: number;
  itemType: "pack" | "subscription";
  itemId: string;
  itemName: string;
  credits: number;
  amount: number;
  currency: string;
  reference: string;
  status: "pending" | "confirmed" | "cancelled";
};

function serialize(order: Doc<"manualOrders">): SerializedOrder {
  return {
    _id: order._id,
    createdAt: order._creationTime,
    itemType: order.itemType,
    itemId: order.itemId,
    itemName: order.itemName,
    credits: order.credits,
    amount: order.amount,
    currency: order.currency,
    reference: order.reference,
    status: order.status,
  };
}

/** Human reference code, e.g. CF-AB12CD. Not security-critical. */
function makeReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `CF-${code}`;
}

/** Throws unless the caller is a signed-in user with the admin role. */
async function requireAdmin(ctx: MutationCtx | QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
  }
  const user = await ctx.db.get(userId);
  if (user === null || user.role !== ROLES.ADMIN) {
    throw new ConvexError("Acesso restrito a administradores.");
  }
  return user;
}

/* ------------------------------------------------------------------ */
/* Payment instructions (admin-editable, shown on the order screen)    */
/* ------------------------------------------------------------------ */

/** Current payment info (settings doc wins, env var as fallback). */
export const getManualPaymentInfo = query({
  args: {},
  handler: async (ctx) => {
    const doc = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", SETTINGS_KEY))
      .first();
    const value = doc?.value as
      | { instructions?: string; paymentUrl?: string }
      | undefined;
    return {
      instructions:
        value?.instructions ??
        process.env.MANUAL_PAYMENT_INSTRUCTIONS ??
        "",
      paymentUrl:
        value?.paymentUrl ?? process.env.MANUAL_PAYMENT_URL ?? "",
    };
  },
});

/** Save the payment instructions + payment link shown to customers. Admin only. */
export const saveManualPaymentInfo = mutation({
  args: {
    instructions: v.string(),
    paymentUrl: v.optional(v.string()),
  },
  handler: async (ctx, { instructions, paymentUrl }) => {
    await requireAdmin(ctx);
    const doc = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", SETTINGS_KEY))
      .first();
    const value = { instructions, paymentUrl: paymentUrl ?? "" };
    if (doc) {
      await ctx.db.patch(doc._id, { value });
    } else {
      await ctx.db.insert("settings", { key: SETTINGS_KEY, value });
    }
    return { ok: true };
  },
});

/* ------------------------------------------------------------------ */
/* Customer side                                                       */
/* ------------------------------------------------------------------ */

/** Create a pending manual order for a pack or a subscription month. */
export const createManualOrder = mutation({
  args: {
    itemType: v.union(v.literal("pack"), v.literal("subscription")),
    itemId: v.string(),
    currency: v.optional(v.union(v.literal("BRL"), v.literal("USD"))),
  },
  handler: async (ctx, { itemType, itemId, currency }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
      throw new ConvexError("Usuário não encontrado.");
    }

    let credits: number;
    let amount: number;
    let currencyCode: "BRL" | "USD" = currency ?? "USD";
    let itemName: string;

    if (itemType === "pack") {
      const pack = getPack(itemId);
      if (pack === null) {
        throw new ConvexError("Pacote inválido.");
      }
      credits = pack.credits;
      amount = packPrice(pack, currencyCode);
      itemName = `pack:${pack.id}`;
    } else {
      const plan = getPlan(itemId);
      if (plan === null || plan.priceUSD <= 0) {
        throw new ConvexError("Plano inválido.");
      }
      credits = plan.credits;
      currencyCode = "USD";
      amount = plan.priceUSD;
      itemName = `plan:${plan.id}`;
    }

    // Avoid duplicate pending orders for the same item (idempotent).
    const existing = await ctx.db
      .query("manualOrders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("status"), "pending"),
          q.eq(q.field("itemType"), itemType),
          q.eq(q.field("itemId"), itemId),
        ),
      )
      .first();
    if (existing) {
      return { order: serialize(existing) };
    }

    const orderId = await ctx.db.insert("manualOrders", {
      userId,
      userEmail: user.email,
      itemType,
      itemId,
      itemName,
      credits,
      amount,
      currency: currencyCode,
      reference: makeReference(),
      status: "pending",
    });
    const order = await ctx.db.get(orderId);
    if (order === null) {
      throw new ConvexError("Não foi possível criar o pedido.");
    }
    return { order: serialize(order) };
  },
});

/** The signed-in user's manual orders, newest first. */
export const getMyOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return [];
    const orders = await ctx.db
      .query("manualOrders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return orders.map(serialize).sort((a, b) => b.createdAt - a.createdAt);
  },
});

/** Cancel one of your own pending orders. */
export const cancelMyOrder = mutation({
  args: { orderId: v.id("manualOrders") },
  handler: async (ctx, { orderId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
    }
    const order = await ctx.db.get(orderId);
    if (order === null || order.userId !== userId) {
      throw new ConvexError("Pedido não encontrado.");
    }
    if (order.status !== "pending") {
      throw new ConvexError("Este pedido não pode mais ser cancelado.");
    }
    await ctx.db.patch(orderId, { status: "cancelled", cancelledAt: Date.now() });
    return { ok: true };
  },
});

/* ------------------------------------------------------------------ */
/* Admin side                                                          */
/* ------------------------------------------------------------------ */

/** Number of pending manual orders. Null for non-admins (safe to subscribe). */
export const listPendingOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (user === null || user.role !== ROLES.ADMIN) return null;
    const orders = await ctx.db
      .query("manualOrders")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return orders.length;
  },
});

/** Every manual order with the customer's email. Null for non-admins. */
export const listOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    const user = await ctx.db.get(userId);
    if (user === null || user.role !== ROLES.ADMIN) return null;
    const orders = await ctx.db.query("manualOrders").collect();
    return orders
      .map((order) => ({
        ...serialize(order),
        userEmail: order.userEmail ?? null,
      }))
      .sort((a, b) => b.createdAt - a.createdAt);
  },
});

/** Confirm a pending payment and grant the credits. Admin only. */
export const confirmOrder = mutation({
  args: { orderId: v.id("manualOrders") },
  handler: async (ctx, { orderId }) => {
    const admin = await requireAdmin(ctx);
    const order = await ctx.db.get(orderId);
    if (order === null) {
      throw new ConvexError("Pedido não encontrado.");
    }
    if (order.status !== "pending") {
      throw new ConvexError("Este pedido não está mais pendente.");
    }
    await ctx.runMutation(internal.usage.grantCredits, {
      userId: order.userId,
      amount: order.credits,
    });
    await ctx.db.patch(orderId, {
      status: "confirmed",
      confirmedAt: Date.now(),
      confirmedBy: admin._id,
    });
    return { ok: true, credits: order.credits };
  },
});

/** Mark a pending order as cancelled without granting credits. Admin only. */
export const cancelOrder = mutation({
  args: { orderId: v.id("manualOrders") },
  handler: async (ctx, { orderId }) => {
    await requireAdmin(ctx);
    const order = await ctx.db.get(orderId);
    if (order === null) {
      throw new ConvexError("Pedido não encontrado.");
    }
    if (order.status !== "pending") {
      throw new ConvexError("Este pedido não está mais pendente.");
    }
    await ctx.db.patch(orderId, { status: "cancelled", cancelledAt: Date.now() });
    return { ok: true };
  },
});
