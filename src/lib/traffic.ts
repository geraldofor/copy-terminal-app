/**
 * Lightweight traffic attribution.
 *
 * Captures the visitor's origin (document.referrer + UTM params) once per
 * session and stores it in sessionStorage, so it survives the redirect from
 * the landing page through /auth into the dashboard. The dashboard then
 * reports it to the backend (admin.recordSignupSource) which keeps the first
 * recorded source per account.
 */

const KEY = "cf_traffic_source";

export type TrafficSource = {
  source: string | null; // utm_source or referrer host, e.g. "google", "instagram.com"
  referrer: string | null; // full referrer URL when available
};

function readParams(): TrafficSource {
  try {
    const params = new URLSearchParams(window.location.search);
    const utm =
      params.get("utm_source") ??
      params.get("utm_medium") ??
      params.get("utm_campaign");
    const referrer = document.referrer || null;
    if (utm) {
      return { source: utm, referrer };
    }
    if (referrer) {
      try {
        const host = new URL(referrer).hostname.replace(/^www\./, "");
        return { source: host || null, referrer };
      } catch {
        return { source: referrer, referrer };
      }
    }
    return { source: "direct", referrer: null };
  } catch {
    return { source: "direct", referrer: null };
  }
}

/** Capture the origin once per session. Safe to call on every page mount. */
export function captureTrafficSource(): TrafficSource {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      return JSON.parse(raw) as TrafficSource;
    }
  } catch {
    // ignore corrupted storage
  }
  const value = readParams();
  try {
    sessionStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    // storage unavailable — return the value anyway
  }
  return value;
}

/** Read the captured source without re-reading the URL. */
export function getTrafficSource(): TrafficSource {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) {
      return JSON.parse(raw) as TrafficSource;
    }
  } catch {
    // fall through
  }
  return { source: null, referrer: null };
}
