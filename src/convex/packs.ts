/**
 * Pricing model for CopyForge.
 *
 * Subscriptions (USD): recurring plans with monthly credits and rollover.
 * Top-up packs (one-time): credit purchases priced per market — BRL for
 * pt-BR users, USD internationally.
 *
 * Edit this file to change offers — the Plans page, the landing pricing
 * section and the PayPal checkout all read from here (v2: subscriptions).
 */

/* ------------------------------------------------------------------ */
/* Subscriptions (recurring, USD)                                      */
/* ------------------------------------------------------------------ */

export interface SubscriptionPlan {
  id: string;
  /** Credits granted every billing cycle (month). */
  credits: number;
  /** Monthly price in USD. */
  priceUSD: number;
  /** Max accumulated credits from this subscription (rollover cap). */
  rolloverCap: number;
  /** Free months granted at the start (trial). */
  trialMonths: number;
  /** Highlight the card as the best value. */
  popular?: boolean;
  /** Included team seats (agency tier). */
  seats?: number;
  /** Whether the plan includes API access. */
  api?: boolean;
  /** Welcome credits for the Free tier (not a sold plan). */
  welcomeCredits?: number;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    credits: 0,
    priceUSD: 0,
    rolloverCap: 0,
    trialMonths: 0,
    welcomeCredits: 25,
  },
  { id: "starter", credits: 100, priceUSD: 9, rolloverCap: 500, trialMonths: 1 },
  {
    id: "pro",
    credits: 300,
    priceUSD: 19,
    rolloverCap: 1500,
    trialMonths: 1,
    popular: true,
  },
  { id: "studio", credits: 900, priceUSD: 39, rolloverCap: 4500, trialMonths: 1 },
  {
    id: "agency",
    credits: 2500,
    priceUSD: 99,
    rolloverCap: 10000,
    trialMonths: 1,
    seats: 5,
    api: true,
  },
];

export function getPlan(id: string): SubscriptionPlan | null {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === id) ?? null;
}

/** Annual plans bill 10 months and deliver 12 (industry standard). */
export const ANNUAL_MONTHS_BILLED = 10;

/** Total billed for a full year (USD). */
export function annualTotal(plan: SubscriptionPlan): number {
  return Math.round(plan.priceUSD * ANNUAL_MONTHS_BILLED * 100) / 100;
}

/** Effective per-month price when billed annually (USD). */
export function annualPerMonth(plan: SubscriptionPlan): number {
  return annualTotal(plan) / 12;
}

/** "9" / "7.50" — USD without the symbol or trailing zeros. */
export function formatUSD(priceUSD: number): string {
  return priceUSD.toFixed(2).replace(/\.00$/, "");
}

/** "9,00" — BRL without the symbol. */
export function formatBRL(priceBRL: number): string {
  return priceBRL.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* ------------------------------------------------------------------ */
/* Top-up packs (one-time, per market)                                 */
/* ------------------------------------------------------------------ */

export interface CreditPack {
  id: string;
  credits: number;
  /** Price in BRL (R$). */
  priceBRL: number;
  /** Price in USD (US$). */
  priceUSD: number;
  /** Whether the card should be highlighted as the best value. */
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "starter", credits: 50, priceBRL: 19, priceUSD: 5 },
  { id: "pro", credits: 120, priceBRL: 39, priceUSD: 12, popular: true },
  { id: "studio", credits: 250, priceBRL: 69, priceUSD: 22 },
  { id: "scale", credits: 400, priceBRL: 99, priceUSD: 32 },
];

export function getPack(id: string): CreditPack | null {
  return CREDIT_PACKS.find((pack) => pack.id === id) ?? null;
}

/** Price of a pack in the given currency. */
export function packPrice(pack: CreditPack, currency: "BRL" | "USD"): number {
  return currency === "BRL" ? pack.priceBRL : pack.priceUSD;
}
