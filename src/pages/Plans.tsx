import { api } from "@/convex/_generated/api";
import {
  CREDIT_PACKS,
  SUBSCRIPTION_PLANS,
  annualPerMonth,
  formatBRL,
  formatUSD,
  packPrice,
  type SubscriptionPlan,
} from "@/convex/packs";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAction, useMutation, useQueries, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Plus,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

/** Client ID for the PayPal JS SDK (public — safe to ship). Comes from
 *  VITE_PAYPAL_CLIENT_ID at build time — set it in the project's Keys / API
 *  keys UI and in your host's build env (e.g. Netlify environment vars). */
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID as
  | string
  | undefined;

type BillingCycle = "monthly" | "annual";

export default function Plans() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const usage = useQuery(api.usage.getUsage);

  // PayPal client id: prefer the build-time var; otherwise read the same
  // value from the backend env (project keys). useQueries never throws, so
  // a backend without this function simply degrades to the amber warning
  // instead of crashing the page.
  const clientIdResults = useQueries({
    paypalClientId: { query: api.paypal.getPaypalClientId, args: {} },
  });
  const paypalClientId =
    PAYPAL_CLIENT_ID ??
    (clientIdResults.paypalClientId.status === "success"
      ? clientIdResults.paypalClientId.data
      : undefined) ??
    undefined;
  const createPayPalOrder = useAction(api.payments.createPayPalOrder);
  const capturePayPalOrder = useAction(api.payments.capturePayPalOrder);
  const createPayPalSubscription = useAction(api.payments.createPayPalSubscription);
  const activatePayPalSubscription = useAction(api.payments.activatePayPalSubscription);
  const addCredits = useMutation(api.usage.addCredits);

  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [busyTopUp, setBusyTopUp] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const credits = usage?.credits ?? null;
  // pt-BR users see BRL top-ups; international visitors pay in USD.
  const currency: "BRL" | "USD" = locale === "pt" ? "BRL" : "USD";
  const priceSymbol = currency === "BRL" ? "R$" : "US$";
  const formatPrice = (value: number) =>
    currency === "BRL" ? formatBRL(value) : formatUSD(value);

  /* Auto-activate a subscription when PayPal redirects back here. */
  useEffect(() => {
    const subscriptionId = searchParams.get("subscription_id");
    const paypalState = searchParams.get("paypal");
    if (paypalState === "cancelled") {
      setSearchParams({}, { replace: true });
      return;
    }
    if (subscriptionId) {
      setSearchParams({}, { replace: true });
      activatePayPalSubscription({ paypalSubscriptionId: subscriptionId })
        .then((result) => {
          if (result.credits !== undefined) {
            toast.success(t("plan.approved", { credits: result.credits }));
          }
        })
        .catch((error) => {
          toast.error(
            error instanceof ConvexError
              ? error.message
              : t("plan.errSubscription"),
          );
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApproveTopUp = async (packId: string, orderId: string) => {
    setBusyTopUp(packId);
    try {
      await capturePayPalOrder({ orderId, packId, currency });
      const pack = CREDIT_PACKS.find((p) => p.id === packId);
      toast.success(t("plan.ok", { credits: pack?.credits ?? "" }));
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.message : t("plan.errCapture"),
      );
    } finally {
      setBusyTopUp(null);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    // Open the popup synchronously so the browser doesn't block it.
    const win = window.open("about:blank", "_blank", "noopener,noreferrer");
    setSubscribing(plan.id);
    try {
      const { approvalUrl } = await createPayPalSubscription({
        planId: plan.id,
        cycle: billing,
        returnUrl: `${window.location.origin}/plans`,
      });
      if (win) win.location.href = approvalUrl;
      else location.assign(approvalUrl);
      toast.info(t("plan.awaitingApproval"));
    } catch (error) {
      win?.close();
      toast.error(
        error instanceof ConvexError ? error.message : t("plan.errSubscription"),
      );
    } finally {
      setSubscribing(null);
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

  const planFeatures = (plan: SubscriptionPlan) => {
    const features: string[] = [];
    if (plan.id === "free") {
      features.push(t("plan.featureFree"));
    } else {
      features.push(t("plan.featureCredits", { n: plan.credits }));
      features.push(t("plan.featureRollover", { n: plan.rolloverCap }));
      features.push(t("plan.featureFree"));
    }
    if (plan.seats) features.push(t("plan.featureSeats", { n: plan.seats }));
    if (plan.api) features.push(t("plan.featureApi"));
    return features;
  };

  const subscriptionsSection = (
    <>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <span className="text-term-green">//</span> {t("plan.sectionSubs")}
          </p>
          <p className="mt-1 font-mono text-[11px] leading-4 text-muted-foreground">
            {t("plan.sectionSubsDesc")}
          </p>
        </div>
        {/* Monthly / annual toggle */}
        <div className="inline-flex items-center rounded-md border bg-card p-0.5 font-mono text-[11px]">
          {(["monthly", "annual"] as const).map((cycle) => (
            <button
              key={cycle}
              type="button"
              onClick={() => setBilling(cycle)}
              className={cn(
                "rounded px-3 py-1.5 transition-colors",
                billing === cycle
                  ? "bg-term-green text-white"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {cycle === "monthly" ? t("plan.monthly") : t("plan.annual")}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {SUBSCRIPTION_PLANS.map((plan) => {
          const free = plan.priceUSD <= 0;
          const price =
            billing === "annual" ? annualPerMonth(plan) : plan.priceUSD;
          return (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col rounded-md border bg-card p-5 transition-shadow",
                plan.popular
                  ? "border-term-green/50 shadow-[0_0_0_1px_rgba(46,125,50,0.25)]"
                  : "",
              )}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-4 rounded-full border border-term-green/40 bg-term-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-term-green-deep">
                  {t("plan.popular")}
                </span>
              )}
              {!free && plan.trialMonths > 0 && (
                <span className="absolute -top-2.5 right-4 flex items-center gap-1 rounded-full border border-term-amber/40 bg-term-amber/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-term-amber">
                  <Sparkles className="size-3" />
                  {t("plan.trial")}
                </span>
              )}

              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <span className="text-term-green">$</span> plan:
                <span className="text-foreground"> {plan.id}</span>
              </p>

              <p className="mt-3 font-mono text-3xl font-bold tracking-tight">
                {free ? plan.welcomeCredits : plan.credits}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                {free
                  ? t("landing.planFreeHint")
                  : t("plan.featureCredits", { n: plan.credits })}
              </p>

              <div className="mt-4 border-t border-dashed pt-4">
                <p className="font-mono text-2xl font-bold text-term-green-deep">
                  ${formatUSD(price)}
                  {!free && (
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("plan.perMonth")}
                    </span>
                  )}
                </p>
                <p className="mt-1 font-mono text-[10px] leading-4 text-muted-foreground">
                  {free
                    ? t("plan.featureFree")
                    : billing === "annual"
                      ? t("plan.billedAnnual")
                      : t("plan.rolloverShort", { n: plan.rolloverCap })}
                </p>
              </div>

              <ul className="mt-4 space-y-1.5">
                {planFeatures(plan).map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-1.5 font-mono text-[11px] leading-4 text-muted-foreground"
                  >
                    <Check className="mt-0.5 size-3 shrink-0 text-term-green" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex-1" />
              {free ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 w-full font-mono text-[11px]"
                  onClick={() => navigate("/auth?returnTo=/dashboard")}
                >
                  {t("landing.planGet")}
                </Button>
              ) : subscribing === plan.id ? (
                <div className="mt-4 flex h-8 items-center justify-center gap-2 rounded-md border font-mono text-[11px] text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" />
                  {t("plan.buying")}
                </div>
              ) : (
                <Button
                  size="sm"
                  className="mt-4 w-full font-mono text-[11px]"
                  disabled={subscribing !== null || !paypalClientId}
                  onClick={() => handleSubscribe(plan)}
                >
                  <CreditCard className="size-3.5" />
                  {t("plan.subscribe")}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );

  const topUpsSection = (
    <>
      <div className="mt-10">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          <span className="text-term-green">//</span> {t("plan.sectionTopups")}
        </p>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          {t("plan.sectionTopupsDesc")}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CREDIT_PACKS.map((pack) => {
          const price = packPrice(pack, currency);
          return (
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
                  {priceSymbol} {formatPrice(price)}
                </p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {t("plan.perCopy", {
                    unit: `${priceSymbol} ${formatPrice(price / pack.credits)}`,
                  })}
                </p>
              </div>

              <div className="mt-5 flex-1">
                {busyTopUp === pack.id ? (
                  <div className="flex h-10 items-center justify-center gap-2 rounded-md border font-mono text-xs text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    {t("plan.buying")}
                  </div>
                ) : !paypalClientId ? (
                  <p className="rounded-md border border-term-amber/40 bg-term-amber/10 px-3 py-2 font-mono text-[11px] leading-4 text-term-amber">
                    {t("plan.errEnv")}
                  </p>
                ) : (
                  <PayPalButtons
                    style={{ layout: "horizontal", color: "gold", shape: "rect", label: "paypal", tagline: false }}
                    disabled={busyTopUp !== null}
                    forceReRender={[pack.id, currency]}
                    createOrder={() =>
                      createPayPalOrder({ packId: pack.id, currency }).then(
                        (order) => order.orderId,
                      )
                    }
                    onApprove={(data) => handleApproveTopUp(pack.id, data.orderID)}
                    onError={() => {
                      setBusyTopUp(null);
                      toast.error(t("plan.errCreate"));
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
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
        {!paypalClientId && (
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

        {/* Subscriptions (approval happens on PayPal, no SDK needed) */}
        {subscriptionsSection}

        {/* Top-ups (PayPal SDK loads only when configured) */}
        {paypalClientId ? (
          <PayPalScriptProvider
            options={{
              clientId: paypalClientId,
              currency,
              intent: "capture",
              components: "buttons",
            }}
          >
            {topUpsSection}
          </PayPalScriptProvider>
        ) : (
          topUpsSection
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
