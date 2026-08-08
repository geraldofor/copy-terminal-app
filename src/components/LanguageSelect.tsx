import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/i18n";
import type { Locale } from "@/i18n/strings";
import { Languages } from "lucide-react";

const OPTIONS: { value: Locale; label: string; flag: string }[] = [
  { value: "pt", label: "Português", flag: "🇧🇷" },
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "es", label: "Español", flag: "🇪🇸" },
];

export function LanguageSelect({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
      <SelectTrigger
        aria-label="Language"
        className="w-auto gap-1.5 border-0 bg-transparent px-2 font-mono text-xs text-muted-foreground shadow-none hover:bg-accent hover:text-foreground focus:ring-0 [&>svg:last-child]:hidden"
      >
        <Languages className="size-3.5" />
        {!compact && <SelectValue />}
      </SelectTrigger>
      <SelectContent align="end">
        {OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value} className="font-mono text-xs">
            <span className="mr-2">{option.flag}</span>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
