import { CopySidebar, type AppView } from "@/components/copy/CopySidebar";
import { GeneratorPanel } from "@/components/copy/GeneratorPanel";
import { LibraryPanel } from "@/components/copy/LibraryPanel";
import { LanguageSelect } from "@/components/LanguageSelect";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n";
import { useMutation, useQuery } from "convex/react";
import { LogOut, Shield, TerminalSquare } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { getTrafficSource } from "@/lib/traffic";

function StatCard({
  label,
  value,
  hint,
  bar,
}: {
  label: string;
  value: string | number;
  hint: string;
  bar?: number;
}) {
  return (
    <div className="rounded-md border bg-card p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <span className="text-term-green">//</span> {label}
      </p>
      <p className="mt-2 font-mono text-2xl font-bold tracking-tight">{value}</p>
      <p className="mt-1 font-mono text-[11px] text-muted-foreground">{hint}</p>
      {bar !== undefined && (
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-term-green transition-all"
            style={{ width: `${Math.min(100, bar)}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t, templates, getTemplate } = useI18n();
  const recordSignupSource = useMutation(api.admin.recordSignupSource);
  const reportedSource = useRef(false);

  const usage = useQuery(api.usage.getUsage);
  const copies = useQuery(api.copies.listCopies) ?? [];
  const pendingOrders = useQuery(api.manualPayments.listPendingOrders);

  const [view, setView] = useState<AppView>("gerador");
  const [selectedId, setSelectedId] = useState(templates[0].id);
  const template = getTemplate(selectedId);

  // Report the visitor's origin to the admin panel once per session.
  useEffect(() => {
    if (reportedSource.current || !user) return;
    reportedSource.current = true;
    const traffic = getTrafficSource();
    if (traffic.source) {
      recordSignupSource({
        source: traffic.source,
        referrer: traffic.referrer ?? undefined,
      });
    }
  }, [user, recordSignupSource]);

  const credits = usage?.credits ?? null;
  const creditsTotal = usage?.creditsTotal ?? null;
  const pct =
    credits !== null && creditsTotal ? Math.round((credits / creditsTotal) * 100) : 0;

  const handleRecharge = () => navigate("/plans");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSelectTemplate = (id: string) => {
    setSelectedId(id);
    setView("gerador");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-[1440px]">
        <CopySidebar
          className="sticky top-0 hidden h-screen w-72 shrink-0 lg:flex"
          view={view}
          selectedId={selectedId}
          onSelectTemplate={handleSelectTemplate}
          onNavigate={setView}
          savedCount={usage?.savedCount ?? copies.length}
          credits={credits}
          creditsTotal={creditsTotal}
          userEmail={user?.email}
          pendingOrdersCount={pendingOrders}
          onSignOut={handleSignOut}
          onRecharge={handleRecharge}
          onOpenAdmin={() => navigate("/admin")}
        />

        <main className="min-w-0 flex-1">
          {/* Top status bar */}
          <header className="sticky top-0 z-10 border-b bg-background/85 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-8">
              <div className="flex min-w-0 items-center gap-2.5">
                <button
                  type="button"
                  className="flex size-8 shrink-0 items-center justify-center rounded-md bg-term-green text-white lg:hidden"
                  onClick={() => setView("gerador")}
                >
                  <TerminalSquare className="size-4" />
                </button>
                <p className="truncate font-mono text-xs text-muted-foreground">
                  <span className="text-term-green">~/copyforge</span>
                  <span className="text-term-dim">/</span>
                  {view === "gerador" ? (
                    <>
                      <span className="text-term-dim">{t("dash.gen")}/</span>
                      <span className="text-foreground">{template.id}</span>
                    </>
                  ) : (
                    <span className="text-foreground">{t("dash.lib")}</span>
                  )}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={cn(
                    "hidden items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] sm:flex",
                    credits !== null && credits <= 5
                      ? "border-term-amber/40 bg-term-amber/10 text-term-amber"
                      : "border-term-green/30 bg-term-soft text-term-green-deep",
                  )}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {t("dash.credits", { n: credits ?? "…" })}
                </span>
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="relative flex size-8 items-center justify-center rounded-md border border-term-green/40 bg-term-soft text-term-green-deep transition-colors hover:bg-term-green hover:text-white"
                  title={t("admin.open")}
                >
                  <Shield className="size-4" />
                  {pendingOrders != null && pendingOrders > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-term-amber font-mono text-[9px] font-bold text-white">
                      {pendingOrders}
                    </span>
                  )}
                </button>
                <LanguageSelect compact />
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex size-8 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
                  title={t("common.signout")}
                >
                  <LogOut className="size-4" />
                </button>
              </div>
            </div>

            {/* Mobile template chips */}
            <div className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl.id)}
                  className={cn(
                    "shrink-0 rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
                    view === "gerador" && selectedId === tpl.id
                      ? "border-term-green/40 bg-term-soft text-term-green-deep"
                      : "text-muted-foreground",
                  )}
                >
                  {tpl.id}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setView("biblioteca")}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1 font-mono text-[11px] transition-colors",
                  view === "biblioteca"
                    ? "border-term-green/40 bg-term-soft text-term-green-deep"
                    : "text-muted-foreground",
                )}
              >
                {t("dash.lib")}
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
            {view === "gerador" ? (
              <div className="space-y-8">
                {/* Plan summary */}
                <section>
                  <h1 className="font-mono text-xl font-bold tracking-tight">
                    {t("dash.title")}
                  </h1>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {t("dash.subtitle")}
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <StatCard
                      label={t("dash.statCredits")}
                      value={`${credits ?? "…"}/${creditsTotal ?? "…"}`}
                      hint={t("dash.statCreditsHint", { pct })}
                      bar={pct}
                    />
                    <StatCard
                      label={t("dash.statSaved")}
                      value={usage?.savedCount ?? copies.length}
                      hint={t("dash.statSavedHint")}
                    />
                    <StatCard
                      label={t("dash.statGenerated")}
                      value={usage?.generatedTotal ?? 0}
                      hint={t("dash.statGeneratedHint")}
                    />
                  </div>
                </section>

                <GeneratorPanel
                  key={template.id}
                  template={template}
                  usage={usage}
                  onOpenLibrary={() => setView("biblioteca")}
                  recentCopies={copies}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h1 className="font-mono text-xl font-bold tracking-tight">
                    {t("dash.libTitle")}
                  </h1>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {t("dash.libSubtitle")}
                  </p>
                </div>
                <LibraryPanel
                  copies={copies}
                  onGoToGenerator={() => setView("gerador")}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
