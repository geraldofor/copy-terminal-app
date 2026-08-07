import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  makeCopyTitle,
  TONE_LABELS,
  toneOf,
  type CopyTemplate,
} from "@/lib/copy-templates";
import type { CopyDoc, Usage } from "@/lib/types";
import { copyToClipboard } from "@/lib/utils";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Zap } from "lucide-react";
import { CopyOutput } from "./CopyOutput";
import { BlinkCursor, TerminalWindow } from "./Terminal";

type Phase = "idle" | "processing" | "typing" | "done";

function defaultsFor(template: CopyTemplate): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of template.fields) {
    values[field.key] = field.defaultValue ?? "";
  }
  return values;
}

interface GeneratorPanelProps {
  template: CopyTemplate;
  usage: Usage | null | undefined;
  onOpenLibrary: () => void;
  recentCopies: CopyDoc[];
}

export function GeneratorPanel({
  template,
  usage,
  onOpenLibrary,
  recentCopies,
}: GeneratorPanelProps) {
  const consumeCredits = useMutation(api.usage.consumeCredits);
  const saveCopy = useMutation(api.copies.saveCopy);

  const [values, setValues] = useState<Record<string, string>>(() =>
    defaultsFor(template),
  );
  const [phase, setPhase] = useState<Phase>("idle");
  const [logLines, setLogLines] = useState<string[]>([]);
  const [result, setResult] = useState("");
  const [typed, setTyped] = useState("");
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");
  const [busy, setBusy] = useState(false);
  const [lastValues, setLastValues] = useState<Record<string, string>>({});
  const timeouts = useRef<number[]>([]);

  const credits = usage?.credits ?? 0;
  const outOfCredits = usage !== undefined && usage !== null && usage.credits <= 0;

  /* Reset the workspace whenever the template changes (and clean up timers). */
  /* Clear pending generation timers when the panel unmounts. The panel is
     remounted per template via `key` in the parent, which also resets state. */
  useEffect(() => {
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  /* Typewriter: reveal the generated text character by character. */
  useEffect(() => {
    if (phase !== "typing") return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 4 + Math.floor(Math.random() * 7);
      if (i >= result.length) {
        window.clearInterval(id);
        setTyped(result);
        setPhase("done");
      } else {
        setTyped(result.slice(0, i));
      }
    }, 16);
    return () => window.clearInterval(id);
  }, [phase, result]);

  const setValue = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const generate = async (vals: Record<string, string>) => {
    if (phase === "processing" || phase === "typing") return;

    for (const field of template.fields) {
      if (field.required && !vals[field.key]?.trim()) {
        toast.error(`Preencha o campo "${field.label}".`);
        return;
      }
    }
    if (outOfCredits) {
      toast.error("Créditos esgotados — recarregue para continuar gerando.");
      return;
    }

    timeouts.current.forEach((id) => window.clearTimeout(id));
    timeouts.current = [];

    setPhase("processing");
    setLogLines([]);
    setResult("");
    setTyped("");
    setSaved(false);
    setEditing(false);
    setLastValues(vals);

    try {
      await consumeCredits({ amount: 1 });
    } catch (error) {
      setPhase("idle");
      toast.error(
        error instanceof ConvexError
          ? error.message
          : "Não foi possível iniciar a geração.",
      );
      return;
    }

    const steps = [
      "modelo de linguagem … ok",
      `briefing: ${template.name} … ok`,
      `público-alvo: ${vals.audience || vals.topic || "—"} … ok`,
      `tom de voz: ${TONE_LABELS[toneOf(vals)]} … ok`,
      "estruturando saída …",
    ];
    steps.forEach((step, index) => {
      timeouts.current.push(
        window.setTimeout(
          () => setLogLines((prev) => [...prev, step]),
          420 * (index + 1),
        ),
      );
    });
    timeouts.current.push(
      window.setTimeout(() => {
        setResult(template.generate(vals));
        setPhase("typing");
      }, 420 * (steps.length + 1) + 150),
    );
  };

  const handleCopy = async () => {
    const content = (editing ? editText : result).trim();
    if (!content) return;
    const ok = await copyToClipboard(content);
    if (ok) toast.success("Texto copiado para a área de transferência");
    else toast.error("Não foi possível copiar o texto.");
  };

  const handleSave = async () => {
    const content = (editing ? editText : result).trim();
    if (!content) return;
    setBusy(true);
    try {
      await saveCopy({
        template: template.id,
        title: makeCopyTitle(template, lastValues),
        content,
        input: lastValues,
      });
      setSaved(true);
      toast.success("Copy salva no histórico");
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.message : "Não foi possível salvar.",
      );
    } finally {
      setBusy(false);
    }
  };

  const openEdit = () => {
    setEditText(result);
    setEditing(true);
  };

  const applyEdit = () => {
    const next = editText.trim();
    if (!next) {
      toast.error("A copy não pode ficar vazia.");
      return;
    }
    setResult(next);
    setTyped(next);
    setEditing(false);
    setSaved(false);
    toast.success("Alterações aplicadas");
  };

  const processing = phase === "processing" || phase === "typing";
  const generateLabel =
    processing ? "Processando…" : phase === "done" ? "Gerar outra copy" : "Gerar copy";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Brief form */}
      <TerminalWindow
        title={`copyforge — brief · ${template.path}`}
        bodyClassName="p-4 sm:p-5"
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold tracking-tight">{template.name}</h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            {template.description}
          </p>
        </div>

        <div className="grid gap-4">
          {template.fields.map((field) => (
            <label key={field.key} className="block">
              <span className="mb-1.5 flex items-baseline gap-1.5 font-mono text-[11px] text-muted-foreground">
                <span className="text-term-green">$</span>
                <span className="text-term-dim">{field.key}</span>
                <span className="text-term-green">=</span>
                {field.required && (
                  <span className="text-term-amber" title="obrigatório">*</span>
                )}
              </span>
              {field.type === "textarea" ? (
                <Textarea
                  value={values[field.key]}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={field.key === "audience" ? 3 : 2}
                  className="font-mono text-sm"
                />
              ) : field.type === "select" ? (
                <Select
                  value={values[field.key]}
                  onValueChange={(value) => setValue(field.key, value)}
                >
                  <SelectTrigger className="w-full font-mono text-sm">
                    <SelectValue placeholder="Selecione…" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={values[field.key]}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="font-mono text-sm"
                />
              )}
            </label>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <Button
            size="lg"
            className="w-full font-mono"
            onClick={() => generate(values)}
            disabled={processing || outOfCredits}
          >
            {processing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Zap className="size-4" />
            )}
            {generateLabel}
          </Button>
          {outOfCredits && (
            <p className="flex items-center gap-2 rounded-md border border-term-amber/40 bg-term-amber/10 px-3 py-2 font-mono text-xs text-term-amber">
              <AlertTriangle className="size-4 shrink-0" />
              créditos esgotados — recarregue no menu lateral para continuar.
            </p>
          )}
          <p className="text-center font-mono text-[11px] text-muted-foreground">
            <span className="text-term-green">//</span> 1 crédito por geração ·{" "}
            {usage ? `${credits} disponíveis` : "calculando…"}
          </p>
        </div>
      </TerminalWindow>

      {/* Output */}
      {phase === "idle" && (
        <TerminalWindow
          title="copyforge — output"
          bodyClassName="flex min-h-[280px] flex-col justify-center p-6 font-mono text-[13px] leading-6"
        >
          <p className="text-muted-foreground">
            <span className="text-term-dim">//</span> sua copy aparecerá aqui
          </p>
          <p className="mt-2 text-muted-foreground">
            preencha o briefing e rode{" "}
            <span className="rounded bg-term-soft px-1.5 py-0.5 text-term-green-deep">
              gerar copy
            </span>{" "}
            para começar.
          </p>
          <div className="mt-6">
            <BlinkCursor />
          </div>
        </TerminalWindow>
      )}

      {phase === "processing" && (
        <TerminalWindow
          title={`copyforge — run ${template.id}`}
          bodyClassName="min-h-[280px] p-4 font-mono text-[13px] leading-6"
        >
          <p className="text-term-green">
            $ copyforge run {template.id}{" "}
            {lastValues.tone ? `--tone ${TONE_LABELS[toneOf(lastValues)]}` : ""}
          </p>
          {logLines.map((line, index) => (
            <p key={index} className="text-muted-foreground">
              <span className="mr-1.5 text-term-dim">›</span>
              {line}
            </p>
          ))}
          <BlinkCursor className="mt-1" />
        </TerminalWindow>
      )}

      {(phase === "typing" || phase === "done") && (
        <CopyOutput
          text={result}
          typed={typed}
          isTyping={phase === "typing"}
          onCopy={handleCopy}
          onSave={handleSave}
          onEdit={openEdit}
          onRewrite={() => generate(lastValues)}
          editing={editing}
          editText={editText}
          setEditText={setEditText}
          onApplyEdit={applyEdit}
          onCancelEdit={() => setEditing(false)}
          saved={saved}
          busy={busy}
        />
      )}

      {/* Recent history */}
      <div className="lg:col-span-2">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <span className="text-term-green">//</span> histórico recente
          </h3>
          <Button variant="ghost" size="sm" className="font-mono text-xs" onClick={onOpenLibrary}>
            ver todos →
          </Button>
        </div>
        {recentCopies.length === 0 ? (
          <p className="rounded-md border border-dashed bg-card/60 px-4 py-5 font-mono text-xs text-muted-foreground">
            nenhuma copy salva ainda — gere um texto e clique em{" "}
            <span className="text-term-green">salvar no histórico</span>.
          </p>
        ) : (
          <ul className="divide-y rounded-md border bg-card">
            {recentCopies.slice(0, 4).map((copy) => (
              <li
                key={copy._id}
                className="flex items-center justify-between gap-3 px-4 py-2.5 font-mono text-[13px]"
              >
                <span className="min-w-0 truncate">
                  <span className="text-term-green">[</span>
                  {copy.template}
                  <span className="text-term-green">]</span>{" "}
                  <span className="text-foreground/80">{copy.title}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(copy._creationTime).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
