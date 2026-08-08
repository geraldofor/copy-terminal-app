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
