/**
 * Sellable credit packs shown on the Plans page and used by the PayPal
 * checkout. Prices in BRL. Edit this file to change offers — the Plans
 * page and the checkout read from here, so no other code needs changes.
 */
export interface CreditPack {
  id: string;
  credits: number;
  /** Price in BRL (R$). */
  priceBRL: number;
  /** Whether the card should be highlighted as the best value. */
  popular?: boolean;
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "starter", credits: 50, priceBRL: 19 },
  { id: "pro", credits: 120, priceBRL: 39, popular: true },
  { id: "studio", credits: 250, priceBRL: 69 },
  { id: "scale", credits: 400, priceBRL: 99 },
];

export function getPack(id: string): CreditPack | null {
  return CREDIT_PACKS.find((pack) => pack.id === id) ?? null;
}

/** BRL formatted without the currency symbol, e.g. "39,00". */
export function formatBRL(priceBRL: number): string {
  return priceBRL.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
