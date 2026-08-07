import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { parseCopyText } from "@/lib/copy-format";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  Loader2,
  Pencil,
  RefreshCw,
  Save,
  X,
} from "lucide-react";
import { BlinkCursor, TerminalWindow } from "./Terminal";

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
  onRewrite: () => void;
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
  editing,
  editText,
  setEditText,
  onApplyEdit,
  onCancelEdit,
  saved,
  busy,
}: CopyOutputProps) {
  const lines = parseCopyText(typed);
  const hasContent = text.trim().length > 0;

  return (
    <TerminalWindow
      title="copyforge — output"
      bodyClassName="p-0"
    >
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
              Aplicar alterações
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancelEdit} disabled={busy}>
              <X className="size-4" />
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="max-h-[440px] min-h-[200px] overflow-auto p-4 font-mono text-[13px] leading-6">
            {lines.length === 0 && !isTyping ? (
              <p className="text-muted-foreground">
                <span className="text-term-dim">//</span> aguardando saída…
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
              Copiar texto
            </Button>
            <Button
              size="sm"
              variant={saved ? "secondary" : "default"}
              onClick={onSave}
              disabled={!hasContent || busy}
              className={saved ? "text-term-green" : ""}
            >
              {saved ? <Check className="size-4" /> : <Save className="size-4" />}
              {saved ? "Salvo no histórico" : "Salvar no histórico"}
            </Button>
            <Button size="sm" variant="outline" onClick={onEdit} disabled={!hasContent || busy}>
              <Pencil className="size-4" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onRewrite}
              disabled={busy}
              className="ml-auto"
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Reescrever
            </Button>
          </div>
        </>
      )}
    </TerminalWindow>
  );
}
