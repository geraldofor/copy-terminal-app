import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DATE_LOCALE, LOCALES, STRINGS, type Locale, type UiStrings } from "./strings";
import { getTemplate as getTemplateFor, getTemplates } from "@/lib/copy-templates";
import type { CopyTemplate } from "@/lib/copy-templates";

const STORAGE_KEY = "copyforge.locale";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  /** Translate a UI string key, replacing `{var}` placeholders. */
  t: (key: keyof UiStrings, vars?: Record<string, string | number>) => string;
  /** BCP-47 tag for date formatting. */
  dateLocale: string;
  /** Localized template registry. */
  templates: CopyTemplate[];
  /** Localized lookup by template id. */
  getTemplate: (id: string) => CopyTemplate;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (LOCALES as string[]).includes(stored)) return stored as Locale;
  } catch {
    /* ignore storage errors */
  }
  const nav = (navigator.language || "pt").toLowerCase();
  if (nav.startsWith("pt")) return "pt";
  if (nav.startsWith("es")) return "es";
  if (nav.startsWith("en")) return "en";
  return "pt";
}

/** Countries grouped by the closest supported UI locale. */
const PT_COUNTRIES = new Set(["BR", "PT", "AO", "MZ", "CV", "GW", "ST", "TL", "MO"]);
const ES_COUNTRIES = new Set([
  "ES", "MX", "AR", "CO", "CL", "PE", "VE", "EC", "GT", "CU", "BO",
  "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "PR", "GQ",
]);
const EN_COUNTRIES = new Set([
  "US", "GB", "CA", "AU", "IE", "NZ", "ZA", "IN", "PH", "SG",
  "NG", "GH", "KE", "JM", "TT", "MY", "HK", "PK", "BD", "LK",
]);

function countryToLocale(countryCode: string | undefined | null): Locale | null {
  const code = (countryCode ?? "").toUpperCase();
  if (PT_COUNTRIES.has(code)) return "pt";
  if (ES_COUNTRIES.has(code)) return "es";
  if (EN_COUNTRIES.has(code)) return "en";
  return null;
}

function interpolate(
  template: string,
  vars?: Record<string, string | number>,
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match,
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // IP-based fallback: only when there is no stored preference AND the
  // browser language gives no hint (e.g. "fr", "de", "ja"), a free GeoIP
  // lookup maps the visitor's country to the closest supported locale.
  // Never overrides an explicit choice made while the lookup is in flight.
  useEffect(() => {
    const hasStored = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY) !== null;
      } catch {
        return true; // storage unavailable → skip geo fallback
      }
    })();
    if (hasStored) return;

    const nav = (navigator.language || "").toLowerCase();
    if (nav.startsWith("pt") || nav.startsWith("es") || nav.startsWith("en")) {
      return;
    }

    let cancelled = false;
    fetch("https://ipwho.is/")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { country_code?: string } | null) => {
        if (cancelled) return;
        try {
          if (localStorage.getItem(STORAGE_KEY) !== null) return;
        } catch {
          /* fall through */
        }
        const geo = countryToLocale(data?.country_code);
        if (geo) setLocale(geo);
      })
      .catch(() => {
        /* offline or blocked — the pt default stays */
      });
    return () => {
      cancelled = true;
    };
  }, [setLocale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key, vars) => interpolate(STRINGS[locale][key], vars),
      dateLocale: DATE_LOCALE[locale],
      templates: getTemplates(locale),
      getTemplate: (id: string) => getTemplateFor(locale, id),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// Provider file intentionally exports both the provider and its hook.
// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
