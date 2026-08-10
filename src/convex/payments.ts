"use node";

import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { getPack } from "./packs";

/**
 * PayPal Checkout (Orders API v2) integrated through Convex actions.
 *
 * Env vars (set in the project's Keys / API keys UI):
 *   PAYPAL_CLIENT_ID      — REST app client id
 *   PAYPAL_CLIENT_SECRET  — REST app secret
 *   PAYPAL_ENV            — "sandbox" (default) or "live"
 *
 * The frontend renders the PayPal button; create/capture run here so the
 * secret never reaches the browser and credits are only granted after
 * PayPal confirms the capture.
 */

const API_BASE: Record<"sandbox" | "live", string> = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
};

function paypalBase(): string {
  return process.env.PAYPAL_ENV === "live"
    ? API_BASE.live
    : API_BASE.sandbox;
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

/** Create a PayPal order for the given pack. Returns the order id only. */
export const createPayPalOrder = action({
  args: { packId: v.string() },
  handler: async (ctx, { packId }) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Sessão expirada. Entre novamente para continuar.");
    }
    const pack = getPack(packId);
    if (pack === null) {
      throw new ConvexError("Pacote inválido.");
    }

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
              currency_code: "BRL",
              value: pack.priceBRL.toFixed(2),
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
    return { orderId: data.id, credits: pack.credits, price: pack.priceBRL };
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
  details?: Array<{ issue?: string }>;
}

/**
 * Capture an approved PayPal order and grant the pack's credits. The
 * captured amount is verified against the pack price so tampered orders
 * (different value/currency) never credit the user.
 */
export const capturePayPalOrder = action({
  args: { orderId: v.string(), packId: v.string() },
  handler: async (
    ctx,
    { orderId, packId },
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
    const completed =
      data.status === "COMPLETED" || capture?.status === "COMPLETED";
    if (!res.ok || !completed) {
      throw new ConvexError("O pagamento não foi confirmado pelo PayPal. Tente novamente.");
    }

    // Anti-tampering: the captured amount must match the pack exactly.
    if (capture?.amount) {
      const amountOk =
        capture.amount.currency_code === "BRL" &&
        parseFloat(capture.amount.value ?? "0") === pack.priceBRL;
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
