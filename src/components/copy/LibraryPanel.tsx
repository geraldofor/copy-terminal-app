import { api } from "@/convex/_generated/api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TEMPLATES } from "@/lib/copy-templates";
import type { CopyDoc } from "@/lib/types";
import { cn, copyToClipboard } from "@/lib/utils";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { ChevronDown, Copy, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface LibraryPanelProps {
  copies: CopyDoc[];
  onGoToGenerator: () => void;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function LibraryPanel({ copies, onGoToGenerator }: LibraryPanelProps) {
  const deleteCopy = useMutation(api.copies.deleteCopy);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<CopyDoc | null>(null);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return copies.filter((copy) => {
      if (filter !== "all" && copy.template !== filter) return false;
      if (!q) return true;
      return (copy.title + " " + copy.content).toLowerCase().includes(q);
    });
  }, [copies, search, filter]);

  const handleCopy = async (content: string) => {
    const ok = await copyToClipboard(content);
    if (ok) toast.success("Texto copiado para a área de transferência");
    else toast.error("Não foi possível copiar o texto.");
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteCopy({ id: toDelete._id });
      toast.success("Copy excluída");
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.message : "Não foi possível excluir.",
      );
    } finally {
      setToDelete(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="buscar por título ou conteúdo…"
            className="pl-9 font-mono text-sm"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full font-mono text-sm sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os templates</SelectItem>
            {TEMPLATES.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="font-mono text-[11px] text-muted-foreground">
        <span className="text-term-green">//</span> {visible.length} de {copies.length}{" "}
        texto(s) salvo(s)
      </p>

      {/* List */}
      {visible.length === 0 ? (
        <div className="rounded-md border border-dashed bg-card/60 px-4 py-12 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            {copies.length === 0 ? (
              <>
                <span className="text-term-dim">//</span> nenhuma copy salva ainda
              </>
            ) : (
              <>
                <span className="text-term-dim">//</span> nada encontrado com esses
                filtros
              </>
            )}
          </p>
          {copies.length === 0 && (
            <Button className="mt-4 font-mono" onClick={onGoToGenerator}>
              gerar primeira copy →
            </Button>
          )}
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((copy) => {
            const isOpen = expanded === copy._id;
            return (
              <li
                key={copy._id}
                className={cn(
                  "overflow-hidden rounded-md border bg-card transition-colors",
                  isOpen && "border-term-green/40",
                )}
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : copy._id)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left font-mono text-[13px]"
                  >
                    <span className="text-term-green">[</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {copy.template}
                    </span>
                    <span className="text-term-green">]</span>
                    <span className="min-w-0 truncate text-foreground/85">
                      {copy.title}
                    </span>
                    <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                      {formatDate(copy._creationTime)}
                    </span>
                    <ChevronDown
                      className={cn(
                        "size-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180",
                      )}
                    />
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => handleCopy(copy.content)}
                      title="Copiar texto"
                    >
                      <Copy className="size-4" />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setToDelete(copy)}
                      title="Excluir"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
                {isOpen && (
                  <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words border-t bg-muted/30 px-4 py-4 font-mono text-[12.5px] leading-6 text-foreground/90">
                    {copy.content}
                  </pre>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Delete confirmation */}
      <AlertDialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent className="font-mono">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono">Excluir copy?</AlertDialogTitle>
            <AlertDialogDescription className="font-mono">
              &quot;{toDelete?.title}&quot; será removida permanentemente do seu
              histórico. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive font-mono text-white hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
