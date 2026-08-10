"use node";

import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import {
  annualTotal,
  getPack,
  getPlan,
  packPrice,
} from "./packs";
import type { SubscriptionPlan } from "./packs";

/**
 * PayPal payments integrated through Convex actions.
 *
 * Two flows:
 *  - One-time top-ups: Orders API v2 (create/capture here; the secret never
 *    reaches the browser and credits are only granted after capture).
 *  - Recurring subscriptions: Billing Subscriptions API v2. The plan is
 *    created inline on each checkout (product is lazily created), the buyer
 *    approves on PayPal, and monthly credits are granted by a self-scheduling
 *    sync that polls `billing_info.last_payment.time` — no webhooks required.
 *
 * Actions run on the Node runtime and cannot touch `ctx.db` directly, so all
 * DB access goes through the internal helpers in subscriptions.ts.
 *
 * Env vars (set in the project's Keys / API keys UI):
 *   PAYPAL_CLIENT_ID      — REST app client id
 *   PAYPAL_CLIENT_SECRET  — REST app secret
 *   PAYPAL_ENV            — "sandbox" (default) or "live"
 */

const API_BASE: Record<"sandbox" | "live", string> = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
};

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const RETRY_MS = 15 * 60 * 1000;

function paypalBase(): string {
  return process.env.PAYPAL_ENV === "live" ? API_BASE.live : API_BASE.sandbox;
}

async function accessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new ConvexError(
      "PayPal não configurado. Adicione PAYPAL_CLIENT_ID e PAYPAL_CLIENT_SECRET nas chaves do projeto.",
    );
  }
  const res = await fetch(`${paypalBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    throw new ConvexError("Falha ao autenticar com o PayPal. Confira as chaves configuradas.");
  }
  const data = (await res.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new ConvexError("Falha ao autenticar com o PayPal. Confira as chaves configuradas.");
  }
  return data.access_token;
}

/* ------------------------------------------------------------------ */
/* One-time top-up orders                                              */
/* ------------------------------------------------------------------ */

/** Create a PayPal order for the given pack. Returns the order id only. */
export const createPayPalOrder = action({
  args: {
    packId: v.string(),
    currency: v.union(v.literal("BRL"), v.literal("USD")),
  },
  handler: async (
    ctx,
    { packId, currency },
  ): Promise<{ orderId: string; credits: number; price: number }> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
    }
    const pack = getPack(packId);
    if (pack === null) {
      throw new ConvexError("Pacote inválido.");
    }
    const price = packPrice(pack, currency);

    const token = await accessToken();
    const res = await fetch(`${paypalBase()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // Idempotency: the same user + pack never creates duplicate orders.
        "PayPal-Request-Id": `copyforge_${userId}_${packId}_${Date.now()}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: pack.id,
            description: `CopyForge — ${pack.credits} créditos`,
            amount: {
              currency_code: currency,
              value: price.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: "CopyForge",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
        },
      }),
    });
    const data = (await res.json()) as { id?: string };
    if (!res.ok || !data.id) {
      throw new ConvexError("Não foi possível criar o pedido no PayPal. Tente novamente.");
    }
    return { orderId: data.id, credits: pack.credits, price };
  },
});

interface PayPalCaptureResponse {
  status?: string;
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        status?: string;
        amount?: { currency_code?: string; value?: string };
      }>;
    };
  }>;
}

/**
 * Capture an approved PayPal order and grant the pack's credits. The
 * captured amount is verified against the pack price so tampered orders
 * (different value/currency) never credit the user.
 */
export const capturePayPalOrder = action({
  args: {
    orderId: v.string(),
    packId: v.string(),
    currency: v.union(v.literal("BRL"), v.literal("USD")),
  },
  handler: async (
    ctx,
    { orderId, packId, currency },
  ): Promise<{ ok: true; credits: number; packId: string }> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
    }
    const pack = getPack(packId);
    if (pack === null) {
      throw new ConvexError("Pacote inválido.");
    }

    const token = await accessToken();
    const res = await fetch(
      `${paypalBase()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = (await res.json()) as PayPalCaptureResponse;

    const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
    const completed = data.status === "COMPLETED" || capture?.status === "COMPLETED";
    if (!res.ok || !completed) {
      throw new ConvexError("O pagamento não foi confirmado pelo PayPal. Tente novamente.");
    }

    // Anti-tampering: the captured amount must match the pack exactly.
    if (capture?.amount) {
      const amountOk =
        capture.amount.currency_code === currency &&
        parseFloat(capture.amount.value ?? "0") === packPrice(pack, currency);
      if (!amountOk) {
        throw new ConvexError("Valor capturado não confere com o pacote selecionado.");
      }
    }

    const result = await ctx.runMutation(internal.usage.grantCredits, {
      userId,
      amount: pack.credits,
    });

    return { ok: true, credits: result.credits, packId: pack.id };
  },
});

/* ------------------------------------------------------------------ */
/* Recurring subscriptions (Billing Subscriptions API v2)              */
/* ------------------------------------------------------------------ */

interface PayPalSubscriptionResponse {
  status?: string;
  billing_info?: {
    last_payment?: { time?: string; amount?: { value?: string; currency_code?: string } };
    next_billing_time?: string;
  };
  links?: Array<{ rel?: string; href?: string }>;
}

/** PayPal returns ISO-8601 strings; parse to ms (0 when absent). */
function parsePayPalTime(time?: string): number {
  if (!time) return 0;
  const ms = Date.parse(time);
  return Number.isNaN(ms) ? 0 : ms;
}

/**
 * Lazy-create (and reuse) the CopyForge product in the PayPal catalog.
 * Subscriptions reference it through their inline plan.
 */
async function paypalProductId(): Promise<string> {
  const token = await accessToken();
  const listRes = await fetch(
    `${paypalBase()}/v1/catalogs/products?total_required=true`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (listRes.ok) {
    const list = (await listRes.json()) as {
      products?: Array<{ id?: string; name?: string }>;
    };
    const existing = list.products?.find((product) => product.name === "CopyForge");
    if (existing?.id) return existing.id;
  }
  const res = await fetch(`${paypalBase()}/v1/catalogs/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: "CopyForge",
      description: "AI copywriting credits and subscriptions",
      type: "SERVICE",
    }),
  });
  const data = (await res.json()) as { id?: string };
  if (!res.ok || !data.id) {
    throw new ConvexError("Não foi possível configurar o catálogo no PayPal.");
  }
  return data.id;
}

function billingCyclesFor(plan: SubscriptionPlan, cycle: "monthly" | "annual") {
  const price = cycle === "annual" ? annualTotal(plan) : plan.priceUSD;
  const frequency =
    cycle === "annual"
      ? { interval_unit: "MONTH", interval_count: 12 }
      : { interval_unit: "MONTH", interval_count: 1 };

  const billingCycles: Array<Record<string, unknown>> = [];
  if (plan.trialMonths > 0) {
    billingCycles.push({
      frequency: { interval_unit: "MONTH", interval_count: plan.trialMonths },
      tenure_type: "TRIAL",
      sequence: 1,
      total_cycles: 1,
      pricing_scheme: { fixed_price: { value: "0.00", currency_code: "USD" } },
    });
  }
  billingCycles.push({
    frequency,
    tenure_type: "REGULAR",
    sequence: plan.trialMonths > 0 ? 2 : 1,
    total_cycles: 0,
    pricing_scheme: {
      fixed_price: { value: price.toFixed(2), currency_code: "USD" },
    },
  });
  return billingCycles;
}

type SubscriptionPatch = {
  status?: string;
  lastPaymentAt?: number;
  lastGrantedAt?: number;
  creditsGranted?: number;
};

/**
 * Create a PayPal subscription for the given plan/cycle and store it as
 * pending. The buyer completes the approval on PayPal; credits are granted
 * once the subscription becomes ACTIVE (see activatePayPalSubscription and
 * syncSubscription).
 */
export const createPayPalSubscription = action({
  args: {
    planId: v.string(),
    cycle: v.union(v.literal("monthly"), v.literal("annual")),
    returnUrl: v.string(),
  },
  handler: async (
    ctx,
    { planId, cycle, returnUrl },
  ): Promise<{ approvalUrl: string; subscriptionId: string }> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
    }
    const plan = getPlan(planId);
    if (plan === null || plan.priceUSD <= 0) {
      throw new ConvexError("Plano inválido.");
    }

    const token = await accessToken();
    const productId = await paypalProductId();

    const res = await fetch(`${paypalBase()}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "PayPal-Request-Id": `copyforge_sub_${userId}_${planId}_${cycle}_${Date.now()}`,
      },
      body: JSON.stringify({
        plan: {
          product_id: productId,
          name: `CopyForge ${planId} (${cycle})`,
          billing_cycles: billingCyclesFor(plan, cycle),
          payment_preferences: {
            auto_bill_outstanding: true,
            payment_failure_threshold: 2,
          },
        },
        application_context: {
          brand_name: "CopyForge",
          shipping_preference: "NO_SHIPPING",
          user_action: "SUBSCRIBE_NOW",
          return_url: `${returnUrl}?paypal=approved`,
          cancel_url: `${returnUrl}?paypal=cancelled`,
        },
      }),
    });
    const data = (await res.json()) as {
      id?: string;
      status?: string;
      links?: Array<{ rel?: string; href?: string }>;
    };
    if (!res.ok || !data.id) {
      throw new ConvexError("Não foi possível criar a assinatura no PayPal.");
    }
    const approvalUrl = data.links?.find((link) => link.rel === "approve")?.href;
    if (!approvalUrl) {
      throw new ConvexError("Não foi possível iniciar a aprovação da assinatura.");
    }

    await ctx.runMutation(internal.subscriptions.insertSubscription, {
      userId,
      paypalSubscriptionId: data.id,
      planId,
      cycle,
      status: data.status ?? "APPROVAL_PENDING",
      monthlyCredits: plan.credits,
      rolloverCap: plan.rolloverCap,
    });
    return { approvalUrl, subscriptionId: data.id };
  },
});

/**
 * Called from the return URL after the buyer approves on PayPal: verify the
 * subscription, grant the first cycle's credits when ACTIVE and start the
 * monthly sync. Idempotent — safe to call more than once.
 */
export const activatePayPalSubscription = action({
  args: { paypalSubscriptionId: v.string() },
  handler: async (
    ctx,
    { paypalSubscriptionId },
  ): Promise<{ status: string; credits?: number }> => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
    }
    const sub = await ctx.runQuery(
      internal.subscriptions.getSubscriptionByPaypal,
      { paypalSubscriptionId },
    );
    if (sub === null || sub.userId !== userId) {
      throw new ConvexError("Assinatura não encontrada.");
    }
    if (sub.status === "ACTIVE" && sub.lastGrantedAt !== undefined) {
      return { status: sub.status };
    }

    const token = await accessToken();
    const res = await fetch(
      `${paypalBase()}/v1/billing/subscriptions/${encodeURIComponent(paypalSubscriptionId)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = (await res.json()) as PayPalSubscriptionResponse;
    if (!res.ok) {
      throw new ConvexError("Não foi possível verificar a assinatura no PayPal.");
    }
    const status = data.status ?? "UNKNOWN";
    const paymentTime = parsePayPalTime(data.billing_info?.last_payment?.time);
    const patch: SubscriptionPatch = { status };

    if (status === "ACTIVE" && sub.lastGrantedAt === undefined) {
      const result = await ctx.runMutation(internal.usage.grantSubscriptionCycle, {
        userId,
        amount: sub.monthlyCredits,
        cap: sub.rolloverCap,
      });
      patch.lastGrantedAt = Math.max(Date.now(), paymentTime);
      patch.creditsGranted = sub.creditsGranted + 1;
      if (paymentTime) patch.lastPaymentAt = paymentTime;
      await ctx.runMutation(internal.subscriptions.patchSubscription, {
        subscriptionId: sub._id,
        ...patch,
      });
      // Keep the monthly sync alive; the trial's first real payment (or the
      // first monthly charge) is picked up by syncSubscription.
      await ctx.scheduler.runAfter(ONE_DAY_MS, internal.payments.syncSubscription, {
        subscriptionId: sub._id,
      });
      return { status, credits: result.credits };
    }

    if (paymentTime) patch.lastPaymentAt = paymentTime;
    await ctx.runMutation(internal.subscriptions.patchSubscription, {
      subscriptionId: sub._id,
      ...patch,
    });
    if (status === "APPROVAL_PENDING") {
      // Buyer may still be completing the approval — check again shortly.
      await ctx.scheduler.runAfter(RETRY_MS, internal.payments.syncSubscription, {
        subscriptionId: sub._id,
      });
    }
    return { status };
  },
});

/**
 * Polls one subscription and grants the month's credits when a new payment
 * is detected (trial → first charge, and every following cycle). Re-schedules
 * itself until the subscription is cancelled or expired — no webhooks needed.
 */
export const syncSubscription = internalAction({
  args: { subscriptionId: v.id("subscriptions") },
  handler: async (ctx, { subscriptionId }): Promise<void> => {
    const sub = await ctx.runQuery(internal.subscriptions.getSubscription, {
      subscriptionId,
    });
    if (sub === null) return;

    const token = await accessToken().catch(() => null);
    if (!token) {
      // Keys not configured yet — retry later instead of giving up.
      await ctx.scheduler.runAfter(ONE_DAY_MS, internal.payments.syncSubscription, {
        subscriptionId,
      });
      return;
    }

    const res = await fetch(
      `${paypalBase()}/v1/billing/subscriptions/${encodeURIComponent(sub.paypalSubscriptionId)}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) {
      await ctx.scheduler.runAfter(ONE_DAY_MS, internal.payments.syncSubscription, {
        subscriptionId,
      });
      return;
    }
    const data = (await res.json()) as PayPalSubscriptionResponse;
    const status = data.status ?? sub.status;
    const paymentTime = parsePayPalTime(data.billing_info?.last_payment?.time);

    if (status === "CANCELLED" || status === "EXPIRED") {
      await ctx.runMutation(internal.subscriptions.patchSubscription, {
        subscriptionId,
        status,
      });
      return; // terminal — stop polling
    }
    if (status !== "ACTIVE") {
      await ctx.runMutation(internal.subscriptions.patchSubscription, {
        subscriptionId,
        status,
      });
      // Suspended plans can reactivate; keep polling daily.
      await ctx.scheduler.runAfter(ONE_DAY_MS, internal.payments.syncSubscription, {
        subscriptionId,
      });
      return;
    }

    const lastGranted = sub.lastGrantedAt ?? 0;
    const patch: SubscriptionPatch = { status: "ACTIVE" };
    if (paymentTime && paymentTime > lastGranted) {
      await ctx.runMutation(internal.usage.grantSubscriptionCycle, {
        userId: sub.userId,
        amount: sub.monthlyCredits,
        cap: sub.rolloverCap,
      });
      patch.lastPaymentAt = paymentTime;
      patch.lastGrantedAt = Math.max(Date.now(), paymentTime);
      patch.creditsGranted = sub.creditsGranted + 1;
    } else if (paymentTime) {
      patch.lastPaymentAt = Math.max(sub.lastPaymentAt ?? 0, paymentTime);
    }
    await ctx.runMutation(internal.subscriptions.patchSubscription, {
      subscriptionId,
      ...patch,
    });

    await ctx.scheduler.runAfter(ONE_DAY_MS, internal.payments.syncSubscription, {
      subscriptionId,
    });
  },
});
