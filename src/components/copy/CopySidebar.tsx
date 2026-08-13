import { Button } from "@/components/ui/button";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { Bookmark, CreditCard, LogOut, Shield, TerminalSquare } from "lucide-react";

export type AppView = "gerador" | "biblioteca";

interface CopySidebarProps {
  view: AppView;
  selectedId: string;
  onSelectTemplate: (id: string) => void;
  onNavigate: (view: AppView) => void;
  savedCount: number;
  credits: number | null;
  creditsTotal: number | null;
  userEmail?: string;
  /** Number of pending manual payments (null for non-admins). */
  pendingOrdersCount?: number | null;
  onSignOut: () => void;
  onRecharge: () => void;
  onOpenAdmin: () => void;
  className?: string;
}

export function CopySidebar({
  view,
  selectedId,
  onSelectTemplate,
  onNavigate,
  savedCount,
  credits,
  creditsTotal,
  userEmail,
  pendingOrdersCount,
  onSignOut,
  onRecharge,
  onOpenAdmin,
  className,
}: CopySidebarProps) {
  const { t, templates } = useI18n();
  const pct =
    credits !== null && creditsTotal
      ? Math.min(100, Math.round((credits / creditsTotal) * 100))
      : 0;

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      {/* Brand */}
      <button
        type="button"
        onClick={() => onNavigate("gerador")}
        className="flex items-center gap-2.5 border-b px-4 py-4 text-left"
      >
        <span className="flex size-8 items-center justify-center rounded-md bg-term-green text-white">
          <TerminalSquare className="size-4" />
        </span>
        <span className="font-mono text-sm font-bold">
          <span className="text-term-green">~/</span>copyforge
          <span className="ml-1 text-[10px] font-normal text-muted-foreground">v1.0</span>
        </span>
      </button>

      {/* Templates */}
      <div className="px-3 pt-5">
        <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="text-term-green">//</span> {t("side.templates")} · [{templates.length}]
        </p>
        <nav className="space-y-1">
          {templates.map((template) => {
            const active = view === "gerador" && selectedId === template.id;
            const Icon = template.icon;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onSelectTemplate(template.id)}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-left transition-colors",
                  active
                    ? "border-term-green bg-accent text-accent-foreground"
                    : "border-transparent hover:bg-accent/60",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    active ? "text-term-green-deep" : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-medium leading-tight">
                    {template.name}
                  </span>
                  <span className="block truncate font-mono text-[10px] text-muted-foreground">
                    {template.path}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Library */}
      <div className="px-3 pt-6">
        <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="text-term-green">//</span> {t("side.library")}
        </p>
        <button
          type="button"
          onClick={() => onNavigate("biblioteca")}
          className={cn(
            "flex w-full items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-left transition-colors",
            view === "biblioteca"
              ? "border-term-green bg-accent text-accent-foreground"
              : "border-transparent hover:bg-accent/60",
          )}
        >
          <Bookmark
            className={cn(
              "size-4 shrink-0",
              view === "biblioteca" ? "text-term-green-deep" : "text-muted-foreground",
            )}
          />
          <span className="flex-1 text-[13px] font-medium">{t("side.saved")}</span>
          <span className="rounded-full bg-term-soft px-2 py-0.5 font-mono text-[10px] font-semibold text-term-green-deep">
            {savedCount}
          </span>
        </button>
      </div>

      {/* Admin */}
      <div className="px-3 pt-6">
        <p className="mb-2 px-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="text-term-green">//</span> {t("side.admin")}
        </p>
        <button
          type="button"
          onClick={onOpenAdmin}
          className="flex w-full items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2.5 text-left transition-colors hover:bg-accent/60"
        >
          <Shield className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
          <span className="flex-1 text-[13px] font-medium">{t("admin.open")}</span>
          {pendingOrdersCount !== null && pendingOrdersCount !== undefined && pendingOrdersCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-term-amber font-mono text-[10px] font-bold text-white">
              {pendingOrdersCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1" />

      {/* Plan */}
      <div className="px-4 pb-4">
        <div className="rounded-md border bg-card p-3">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-muted-foreground">{t("side.plan")}</span>
            <span className={cn(credits !== null && credits <= 5 ? "text-term-amber" : "text-term-green")}>
              {t("side.credits", { credits: credits ?? "…", total: creditsTotal ?? "…" })}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-term-green transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-[10px] text-muted-foreground">
            {credits !== null && credits <= 5
              ? t("side.creditsLow")
              : t("side.creditsInfo")}
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-2.5 w-full font-mono text-[11px]"
            onClick={onRecharge}
          >
            <CreditCard className="size-3.5" />
            {t("side.recharge")}
          </Button>
        </div>
      </div>

      {/* User */}
      <div className="flex items-center gap-2 border-t px-3 py-3">
        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-term-soft font-mono text-[11px] font-bold text-term-green-deep">
          {(userEmail ?? "?")[0].toUpperCase()}
        </div>
        <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-muted-foreground">
          {userEmail}
        </span>
        <LanguageSelect compact />
        <Button size="icon-sm" variant="ghost" onClick={onSignOut} title={t("common.signout")}>
          <LogOut className="size-4" />
        </Button>
      </div>
    </aside>
  );
}
