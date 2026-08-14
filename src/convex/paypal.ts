import { query } from "./_generated/server";

/**
 * Public PayPal Client ID for the JS SDK. The client id is public by design
 * (it ships in the browser bundle anyway); the secret never leaves the
 * server. The Plans page prefers the build-time value
 * (import.meta.env.VITE_PAYPAL_CLIENT_ID) and falls back to this query so
 * checkout works with just the project keys — no extra VITE_ var required.
 * Both variables are read from the project's Keys / API keys UI.
 *
 * Note: this file deliberately has NO "use node" directive — Convex only
 * allows actions in Node.js files, so the query lives here instead.
 */
export const getPaypalClientId = query({
  handler: (): string | null => {
    return (
      process.env.VITE_PAYPAL_CLIENT_ID ??
      process.env.PAYPAL_CLIENT_ID ??
      null
    );
  },
});

/**
 * Whether PayPal is enabled for real customers. PayPal is only shown on the
 * plans page when it is configured in LIVE mode — otherwise the buttons would
 * send customers to the PayPal sandbox, where they cannot actually pay.
 * Flip PAYPAL_ENV to "live" (with live keys) and the buttons reappear
 * automatically, with no code changes.
 */
export const getPaymentMethods = query({
  handler: (): { paypalLive: boolean } => {
    return { paypalLive: process.env.PAYPAL_ENV === "live" };
  },
});
