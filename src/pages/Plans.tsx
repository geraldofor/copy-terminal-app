import { api } from "@/convex/_generated/api";
import { CREDIT_PACKS, formatBRL } from "@/convex/packs";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAction, useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ArrowLeft, Loader2, Plus, ShieldCheck, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

/** Client ID for the PayPal JS SDK (public — safe to ship). */
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID as
  | string
  | undefined;

export default function Plans() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const usage = useQuery(api.usage.getUsage);
  const createPayPalOrder = useAction(api.payments.createPayPalOrder);
  const capturePayPalOrder = useAction(api.payments.capturePayPalOrder);
  const addCredits = useMutation(api.usage.addCredits);

  const [busy, setBusy] = useState<string | null>(null);

  const credits = usage?.credits ?? null;

  const handleApprove = async (packId: string, orderId: string) => {
    setBusy(packId);
    try {
      await capturePayPalOrder({ orderId, packId });
      const pack = CREDIT_PACKS.find((p) => p.id === packId);
      toast.success(t("plan.ok", { credits: pack?.credits ?? "" }));
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.message : t("plan.errCapture"),
      );
    } finally {
      setBusy(null);
    }
  };

  const handleDemo = async () => {
    try {
      await addCredits({ amount: 10 });
      toast.success(t("dash.rechargeOk"));
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.message : t("dash.rechargeErr"),
      );
    }
  };

  const packsSection = (
    <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CREDIT_PACKS.map((pack) => (
        <div
          key={pack.id}
          className={cn(
            "relative flex flex-col rounded-md border bg-card p-5",
            pack.popular
              ? "border-term-green/50 shadow-[0_0_0_1px_rgba(46,125,50,0.25)]"
              : "",
          )}
        >
          {pack.popular && (
            <span className="absolute -top-2.5 left-4 rounded-full border border-term-green/40 bg-term-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-term-green-deep">
              {t("plan.popular")}
            </span>
          )}
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="text-term-green">$</span> pack:
            <span className="text-foreground"> {pack.id}</span>
          </p>
          <p className="mt-3 font-mono text-4xl font-bold tracking-tight">
            {pack.credits}
          </p>
          <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
            {t("plan.creditNote")}
          </p>

          <div className="mt-4 border-t border-dashed pt-4">
            <p className="font-mono text-2xl font-bold text-term-green-deep">
              R$ {formatBRL(pack.priceBRL)}
            </p>
            <p className="mt-1 font-mono text-[11px] text-muted-foreground">
              {t("plan.perCopy", {
                unit: formatBRL(pack.priceBRL / pack.credits),
              })}
            </p>
          </div>

          <div className="mt-5 flex-1">
            {busy === pack.id ? (
              <div className="flex h-10 items-center justify-center gap-2 rounded-md border font-mono text-xs text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                {t("plan.buying")}
              </div>
            ) : !PAYPAL_CLIENT_ID ? (
              <p className="rounded-md border border-term-amber/40 bg-term-amber/10 px-3 py-2 font-mono text-[11px] leading-4 text-term-amber">
                {t("plan.errEnv")}
              </p>
            ) : (
              <PayPalButtons
                style={{ layout: "horizontal", color: "gold", shape: "rect", label: "paypal", tagline: false }}
                disabled={busy !== null}
                forceReRender={[pack.id]}
                createOrder={() =>
                  createPayPalOrder({ packId: pack.id }).then((order) => order.orderId)
                }
                onApprove={(data) => handleApprove(pack.id, data.orderID)}
                onError={() => {
                  setBusy(null);
                  toast.error(t("plan.errCreate"));
                }}
              />
            )}
          </div>
        </div>
      ))}
    </section>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-mono text-xl font-bold tracking-tight">
              <span className="text-term-green">$</span> copyforge{" "}
              <span className="text-term-dim">plans</span>
            </h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {t("plan.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-term-green/30 bg-term-soft px-2.5 py-1 font-mono text-[11px] text-term-green-deep">
              <span className="size-1.5 rounded-full bg-current" />
              {t("plan.current", { n: credits ?? "…" })}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="size-3.5" />
              {t("plan.back")}
            </Button>
          </div>
        </header>

        {/* Not-configured warning */}
        {!PAYPAL_CLIENT_ID && (
          <div className="mt-8 rounded-md border border-term-amber/40 bg-term-amber/10 p-4">
            <p className="flex items-center gap-2 font-mono text-sm font-semibold text-term-amber">
              <Zap className="size-4" />
              {t("plan.notConfiguredTitle")}
            </p>
            <p className="mt-1 font-mono text-xs leading-5 text-muted-foreground">
              {t("plan.notConfiguredDesc")}
            </p>
          </div>
        )}

        {/* Packs (PayPal SDK loads only when configured) */}
        {PAYPAL_CLIENT_ID ? (
          <PayPalScriptProvider
            options={{
              clientId: PAYPAL_CLIENT_ID,
              currency: "BRL",
              intent: "capture",
              components: "buttons",
            }}
          >
            {packsSection}
          </PayPalScriptProvider>
        ) : (
          packsSection
        )}

        {/* Footnotes */}
        <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-md border bg-card p-4 sm:flex-row sm:items-center">
          <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <ShieldCheck className="size-4 shrink-0 text-term-green" />
            {t("plan.secure")}
          </p>
          <div className="flex items-center gap-3">
            <p className="font-mono text-[11px] text-muted-foreground">
              {t("plan.demoHint")}
            </p>
            <Button size="sm" variant="outline" className="font-mono text-[11px]" onClick={handleDemo}>
              <Plus className="size-3.5" />
              {t("plan.demo")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
