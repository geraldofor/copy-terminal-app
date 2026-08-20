import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseCopyText } from "@/lib/copy-format";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  Flame,
  Loader2,
  Pencil,
  RefreshCw,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import { BlinkCursor, TerminalWindow } from "./Terminal";

export const REWRITE_MODES = [
  { value: "", label: "regenerate", icon: RefreshCw },
  { value: "persuasive", label: "persuasive", icon: Flame },
  { value: "emotional", label: "emotional", icon: Sparkles },
  { value: "direct", label: "direct", icon: null },
  { value: "premium", label: "premium", icon: null },
  { value: "urgent", label: "urgent", icon: null },
  { value: "shorter", label: "shorter", icon: null },
  { value: "conversational", label: "conversational", icon: null },
  { value: "aggressive", label: "aggressive", icon: null },
  { value: "instagram", label: "for Instagram", icon: null },
  { value: "meta-ads", label: "for Meta Ads", icon: null },
  { value: "google-ads", label: "for Google Ads", icon: null },
  { value: "3-variations", label: "3 variations", icon: null },
] as const;

export type RewriteMode = (typeof REWRITE_MODES)[number]["value"];

export interface CopyOutputProps {
  /** Full generated text. */
  text: string;
  /** Currently typed prefix of `text` (typewriter animation). */
  typed: string;
  isTyping: boolean;
  /** Copy to clipboard. */
  onCopy: () => void;
  /** Persist to history. */
  onSave: () => void;
  /** Toggle edit mode. */
  onEdit: () => void;
  /** Regenerate with the same briefing. */
  onRewrite: (mode?: string) => void;
  /** AI model that generated the text (undefined when local fallback). */
  engine?: string;
  /** Whether the local fallback engine was used instead of Gemini. */
  isFallback?: boolean;
  /** Error reason when Gemini failed (e.g. 'no-key', 'unauthenticated', 'api-error'). */
  engineError?: string;
  editing: boolean;
  editText: string;
  setEditText: (value: string) => void;
  onApplyEdit: () => void;
  onCancelEdit: () => void;
  saved: boolean;
  busy: boolean;
}

export function CopyOutput({
  text,
  typed,
  isTyping,
  onCopy,
  onSave,
  onEdit,
  onRewrite,
  engine,
  isFallback,
  engineError,
  editing,
  editText,
  setEditText,
  onApplyEdit,
  onCancelEdit,
  saved,
  busy,
}: CopyOutputProps) {
  const { t } = useI18n();
  const lines = parseCopyText(typed);
  const hasContent = text.trim().length > 0;

  return (
    <TerminalWindow title={t("gen.termOutput")} bodyClassName="p-0">
      {editing ? (
        <div className="p-4">
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[300px] font-mono text-sm leading-6"
            autoFocus
          />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button size="sm" onClick={onApplyEdit} disabled={busy || !editText.trim()}>
              <Check className="size-4" />
              {t("out.apply")}
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancelEdit} disabled={busy}>
              <X className="size-4" />
              {t("common.cancel")}
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="max-h-[440px] min-h-[200px] overflow-auto p-4 font-mono text-[13px] leading-6">
            {lines.length === 0 && !isTyping ? (
              <p className="text-muted-foreground">
                <span className="text-term-dim">//</span> {t("out.waiting")}
              </p>
            ) : (
              lines.map((line, i) => (
                <p
                  key={i}
                  className={cn(
                    "whitespace-pre-wrap break-words",
                    line.kind === "heading" &&
                      "mt-3 mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-term-green first:mt-0",
                    line.kind === "sub" && "mt-2 font-bold",
                    line.kind === "bullet" && "text-foreground/90",
                    line.kind === "text" && "text-foreground/90",
                  )}
                >
                  {line.kind === "heading" && <span className="mr-1.5 text-term-dim">##</span>}
                  {line.kind === "bullet" && (
                    <span className="mr-1.5 select-none text-term-dim">-</span>
                  )}
                  {line.kind === "text" && <span className="mr-1.5 text-term-dim">›</span>}
                  {line.text}
                </p>
              ))
            )}
            {isTyping && <BlinkCursor />}
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t bg-muted/30 px-4 py-3">
            <Button
              size="sm"
              variant="outline"
              onClick={onCopy}
              disabled={!hasContent || busy}
            >
              <Copy className="size-4" />
              {t("common.copy")}
            </Button>
            <Button
              size="sm"
              variant={saved ? "secondary" : "default"}
              onClick={onSave}
              disabled={!hasContent || busy}
              className={saved ? "text-term-green" : ""}
            >
              {saved ? <Check className="size-4" /> : <Save className="size-4" />}
              {saved ? t("out.saved") : t("out.save")}
            </Button>
            <Button size="sm" variant="outline" onClick={onEdit} disabled={!hasContent || busy}>
              <Pencil className="size-4" />
              {t("out.edit")}
            </Button>

            {/* Rewrite mode selector */}
            <div className="ml-auto flex items-center gap-2">
              {/* Engine diagnostics: shows Gemini model, local fallback, or error */}
              <span
                className={`flex min-w-0 items-center gap-1.5 font-mono text-[10px] ${
                  engine && !isFallback
                    ? "text-term-green"
                    : isFallback && engineError
                      ? "text-red-400"
                      : "text-term-amber"
                }`}
                title={
                  engine && !isFallback
                    ? `${engine} • KB active`
                    : engineError
                      ? `Gemini: ${engineError} • using local fallback`
                      : "Local fallback engine"
                }
              >
                <span
                  className={`size-1.5 shrink-0 rounded-full ${
                    engine && !isFallback
                      ? "animate-pulse bg-term-green"
                      : isFallback && engineError
                        ? "bg-red-400"
                        : "bg-term-amber"
                  }`}
                />
                <span className="truncate">
                  {engine && !isFallback
                    ? engine
                    : engineError
                      ? `local · ${engineError}`
                      : "local"}
                </span>
              </span>
              <Select
                onValueChange={(mode) => onRewrite(mode)}
                disabled={busy || isTyping}
              >
                <SelectTrigger className="h-8 w-auto min-w-[100px] border-dashed font-mono text-[11px]">
                  <RefreshCw className="size-3" />
                  <SelectValue placeholder={t("out.rewrite")} />
                </SelectTrigger>
                <SelectContent>
                  {REWRITE_MODES.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value} className="font-mono text-[11px]">
                      <span className="flex items-center gap-1.5">
                        {mode.icon && <mode.icon className="size-3" />}
                        {t(`out.rewrite.${mode.label || "regenerate"}` as any) || mode.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </>
      )}
    </TerminalWindow>
  );
}
