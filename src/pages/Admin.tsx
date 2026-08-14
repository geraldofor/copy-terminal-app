import { api } from "@/convex/_generated/api";
import { formatBRL, formatUSD } from "@/convex/packs";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import {
  CheckCircle2,
  HandCoins,
  Loader2,
  Save,
  Shield,
  ShieldOff,
  Trash2,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type AdminUser = {
  _id: string;
  _creationTime: number;
  name: string | null;
  email: string | null;
  isAnonymous: boolean;
  role: "admin" | "user" | "member";
  blocked: boolean;
  credits: number;
  creditsTotal: number;
  generatedTotal: number;
  savedCount: number;
};

type ManualOrder = {
  _id: string;
  createdAt: number;
  itemType: "pack" | "subscription";
  itemId: string;
  itemName: string;
  credits: number;
  amount: number;
  currency: string;
  reference: string;
  status: "pending" | "confirmed" | "cancelled";
  userEmail: string | null;
};

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <div className="rounded-md border bg-card p-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <span className="text-term-green">//</span> {label}
      </p>
      <p className="mt-2 font-mono text-2xl font-bold tracking-tight">
        {value}
      </p>
      <p className="mt-1 font-mono text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const { t, dateLocale } = useI18n();
  const navigate = useNavigate();

  const adminExists = useQuery(api.admin.adminExists);
  const stats = useQuery(api.admin.adminStats);
  const users = useQuery(api.admin.listUsers);

  const claimAdmin = useMutation(api.admin.claimAdmin);
  const setRole = useMutation(api.admin.setRole);
  const adjustCredits = useMutation(api.admin.adjustCredits);
  const setBlocked = useMutation(api.admin.setBlocked);
  const deleteUser = useMutation(api.admin.deleteUser);

  const orders = useQuery(api.manualPayments.listOrders);
  const pendingCount = useQuery(api.manualPayments.listPendingOrders);
  const manualInfo = useQuery(api.manualPayments.getManualPaymentInfo);
  const confirmOrder = useMutation(api.manualPayments.confirmOrder);
  const cancelOrder = useMutation(api.manualPayments.cancelOrder);
  const saveManualPaymentInfo = useMutation(
    api.manualPayments.saveManualPaymentInfo,
  );

  const [query, setQuery] = useState("");
  const [deltas, setDeltas] = useState<Record<string, string>>({});
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [instructions, setInstructions] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");
  const [syncedInstructions, setSyncedInstructions] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<ManualOrder | null>(null);
  const [cancelTarget, setCancelTarget] = useState<ManualOrder | null>(null);

  // Load the saved payment info once the query resolves.
  useEffect(() => {
    if (manualInfo !== undefined && !syncedInstructions) {
      setSyncedInstructions(true);
      setInstructions(manualInfo.instructions);
      setPaymentUrl(manualInfo.paymentUrl ?? "");
    }
  }, [manualInfo, syncedInstructions]);

  const formatOrderAmount = (order: ManualOrder) =>
    order.currency === "BRL"
      ? `R$ ${formatBRL(order.amount)}`
      : `US$ ${formatUSD(order.amount)}`;

  const orderStatusPill = (status: ManualOrder["status"]) => {
    const className =
      status === "confirmed"
        ? "border-term-green/40 bg-term-soft text-term-green-deep"
        : status === "cancelled"
          ? "border-border text-muted-foreground"
          : "border-term-amber/40 bg-term-amber/10 text-term-amber";
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
          className,
        )}
      >
        {status === "confirmed"
          ? t("manual.confirmed", { credits: "" })
          : status === "cancelled"
            ? t("manual.cancelled")
            : t("manual.pending")}
      </span>
    );
  };

  const handleConfirmOrder = async () => {
    if (!confirmTarget) return;
    try {
      await confirmOrder({ orderId: confirmTarget._id as never });
      toast.success(t("manual.confirmedOk"));
    } catch (error) {
      toast.error(error instanceof ConvexError ? error.message : t("manual.err"));
    }
    setConfirmTarget(null);
  };

  const handleCancelOrder = async () => {
    if (!cancelTarget) return;
    try {
      await cancelOrder({ orderId: cancelTarget._id as never });
      toast.success(t("manual.cancelledOrder"));
    } catch (error) {
      toast.error(error instanceof ConvexError ? error.message : t("manual.err"));
    }
    setCancelTarget(null);
  };

  const handleSaveConfig = async () => {
    setSavingConfig(true);
    try {
      await saveManualPaymentInfo({ instructions, paymentUrl });
      toast.success(t("manual.configSaved"));
    } catch (error) {
      toast.error(error instanceof ConvexError ? error.message : t("manual.err"));
    }
    setSavingConfig(false);
  };

  const isAdmin = user?.role === "admin";
  const loading = adminExists === undefined || users === undefined || stats === undefined;

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.name, u.email, u._id].some((v) => v?.toLowerCase().includes(q)),
    );
  }, [users, query]);

  const roleLabel = (role: string) =>
    role === "admin"
      ? t("admin.roleAdmin")
      : role === "member"
        ? t("admin.roleMember")
        : t("admin.roleUser");

  const roleClass = (role: string, blocked: boolean) =>
    cn(
      "border font-mono text-[10px] uppercase tracking-wider",
      blocked
        ? "border-term-amber/40 bg-term-amber/10 text-term-amber"
        : role === "admin"
          ? "border-term-green/40 bg-term-soft text-term-green-deep"
          : "text-muted-foreground",
    );

  const handleClaim = async () => {
    try {
      await claimAdmin();
      toast.success(t("admin.claimedOk"));
    } catch (error) {
      toast.error(
        error instanceof ConvexError ? error.message : t("admin.err"),
      );
    }
  };

  const run = async (fn: () => Promise<unknown>, okMsg: string) => {
    try {
      await fn();
      toast.success(okMsg);
    } catch (error) {
      toast.error(error instanceof ConvexError ? error.message : t("admin.err"));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteUser({ userId: deleteTarget as never });
      toast.success(t("admin.deleteOk"));
    } catch (error) {
      toast.error(error instanceof ConvexError ? error.message : t("admin.err"));
    }
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-10">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-mono text-xl font-bold tracking-tight">
              <span className="text-term-green">$</span> copyforge{" "}
              <span className="text-term-dim">admin</span>
            </h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              {t("admin.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              ← {t("admin.back")}
            </Button>
            {isAdmin && (
              <span className="flex items-center gap-1.5 rounded-md border border-term-green/40 bg-term-soft px-2.5 py-1.5 font-mono text-[11px] text-term-green-deep">
                <Shield className="size-3.5" />
                {t("admin.roleAdmin")}
              </span>
            )}
          </div>
        </header>

        {/* Loading */}
        {loading && (
          <main className="flex items-center justify-center gap-2 py-24 font-mono text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            {t("admin.loading")}
          </main>
        )}

        {/* First-admin claim flow */}
        {!loading && !isAdmin && adminExists === false && (
          <main className="mx-auto mt-16 max-w-lg rounded-md border bg-card p-8 text-center">
            <UserPlus className="mx-auto size-8 text-term-green" />
            <h2 className="mt-4 font-mono text-lg font-bold">
              {t("admin.claimTitle")}
            </h2>
            <p className="mt-2 font-mono text-xs leading-5 text-muted-foreground">
              {t("admin.claimDesc")}
            </p>
            <Button className="mt-6" onClick={handleClaim}>
              {t("admin.claimBtn")}
            </Button>
          </main>
        )}

        {/* Non-admin with existing admin */}
        {!loading && !isAdmin && adminExists === true && (
          <main className="mx-auto mt-16 max-w-lg rounded-md border bg-card p-8 text-center">
            <ShieldOff className="mx-auto size-8 text-term-amber" />
            <h2 className="mt-4 font-mono text-lg font-bold">
              {t("admin.deniedTitle")}
            </h2>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              {t("admin.deniedDesc")}
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => navigate("/dashboard")}
            >
              ← {t("admin.back")}
            </Button>
          </main>
        )}

        {/* Admin panel */}
        {isAdmin && stats && (
          <>
            <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label={t("admin.statUsers")}
                value={stats.totalUsers}
                hint={t("admin.statUsersHint")}
              />
              <StatCard
                label={t("admin.statCopies")}
                value={stats.totalCopies}
                hint={t("admin.statCopiesHint")}
              />
              <StatCard
                label={t("admin.statCredits")}
                value={stats.creditsIssued}
                hint={t("admin.statCreditsHint")}
              />
              <StatCard
                label={t("admin.statGenerated")}
                value={stats.generatedTotal}
                hint={t("admin.statGeneratedHint")}
              />
            </section>

            {/* Manual payment orders */}
            <section className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <HandCoins className="mr-1.5 inline size-4 text-term-green" />
                  {t("manual.adminSection")}
                  {pendingCount != null && pendingCount > 0 && (
                    <span className="ml-2 text-term-amber">({pendingCount} ⚠)</span>
                  )}
                </h2>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {t("manual.adminSectionDesc")}
                </p>
              </div>

              <div className="mt-4 overflow-hidden rounded-md border">
                <div className="hidden grid-cols-[1.2fr_1.4fr_0.8fr_0.8fr_1fr_1fr] gap-3 border-b bg-card px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:grid">
                  <span>{t("manual.colOrder")}</span>
                  <span>{t("manual.colUser")}</span>
                  <span>{t("manual.colItem")}</span>
                  <span>{t("manual.colAmount")}</span>
                  <span>{t("manual.colStatus")}</span>
                  <span className="text-right">{t("admin.colActions")}</span>
                </div>

                {!orders || orders.length === 0 ? (
                  <div className="bg-card px-4 py-10 text-center font-mono text-xs text-muted-foreground">
                    {t("manual.noOrders")}
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order._id}
                      className="grid grid-cols-1 gap-2 border-b bg-card px-4 py-3 last:border-b-0 sm:grid-cols-[1.2fr_1.4fr_0.8fr_0.8fr_1fr_1fr] sm:items-center sm:gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-mono text-xs font-semibold">
                          {order.reference}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString(dateLocale)}
                        </p>
                      </div>
                      <p className="truncate font-mono text-xs text-muted-foreground">
                        {order.userEmail ?? "—"}
                      </p>
                      <p className="font-mono text-xs">{order.itemName}</p>
                      <p className="font-mono text-xs font-semibold">
                        {formatOrderAmount(order)}
                      </p>
                      <div>{orderStatusPill(order.status)}</div>
                      <div className="flex flex-wrap items-center justify-start gap-1.5 sm:justify-end">
                        {order.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="h-7 px-2 font-mono text-[11px]"
                              onClick={() => setConfirmTarget(order)}
                            >
                              <CheckCircle2 className="size-3.5" />
                              {t("manual.confirm")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 font-mono text-[11px]"
                              onClick={() => setCancelTarget(order)}
                            >
                              <XCircle className="size-3.5" />
                              {t("manual.cancel")}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Manual payment instructions config */}
            <section className="mt-8 rounded-md border bg-card p-4">
              <h2 className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-muted-foreground">
                <Save className="mr-1.5 inline size-4 text-term-green" />
                {t("manual.configTitle")}
              </h2>
              <p className="mt-1 font-mono text-[11px] leading-4 text-muted-foreground">
                {t("manual.configDesc")}
              </p>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={4}
                className="mt-3 font-mono text-xs leading-5"
                placeholder={"PIX: ...\nMercado Pago: ...\nPayPal.me: ...\nBanco: ..."}
              />
              <label className="mt-3 block">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {t("manual.paymentUrlLabel")}
                </span>
                <Input
                  value={paymentUrl}
                  onChange={(e) => setPaymentUrl(e.target.value)}
                  className="mt-1.5 font-mono text-xs"
                  placeholder="https://link.mercadopago.com.br/..."
                />
              </label>
              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  className="font-mono text-[11px]"
                  onClick={handleSaveConfig}
                  disabled={savingConfig}
                >
                  {savingConfig ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Save className="size-3.5" />
                  )}
                  {t("manual.configSave")}
                </Button>
              </div>
            </section>

            <section className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-mono text-sm font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <Users className="mr-1.5 inline size-4 text-term-green" />
                  {t("admin.statUsers")}
                  <span className="ml-2 text-term-dim">({users?.length ?? 0})</span>
                </h2>
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("admin.search")}
                  className="h-9 w-full font-mono text-xs sm:w-80"
                />
              </div>

              <div className="mt-4 overflow-hidden rounded-md border">
                <div className="hidden grid-cols-[1.6fr_1fr_0.7fr_0.7fr_0.7fr_1.2fr] gap-3 border-b bg-card px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:grid">
                  <span>{t("admin.colUser")}</span>
                  <span>{t("admin.colCredits")}</span>
                  <span>{t("admin.colSaved")}</span>
                  <span>{t("admin.colGenerated")}</span>
                  <span>{t("admin.role")}</span>
                  <span className="text-right">{t("admin.colActions")}</span>
                </div>

                {filtered.length === 0 && (
                  <div className="bg-card px-4 py-10 text-center font-mono text-xs text-muted-foreground">
                    {t("admin.noUsers")}
                  </div>
                )}

                {filtered.map((u: AdminUser) => (
                  <div
                    key={u._id}
                    className="grid grid-cols-1 gap-2 border-b bg-card px-4 py-3 last:border-b-0 sm:grid-cols-[1.6fr_1fr_0.7fr_0.7fr_0.7fr_1.2fr] sm:items-center sm:gap-3"
                  >
                    {/* User */}
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs font-semibold">
                        {u.name ?? u.email ?? "—"}
                        {u._id === user?._id && (
                          <span className="text-term-green"> {t("admin.you")}</span>
                        )}
                      </p>
                      <p className="truncate font-mono text-[11px] text-muted-foreground">
                        {u.email ?? "—"} ·{" "}
                        {new Date(u._creationTime).toLocaleDateString(dateLocale)}
                        {u.isAnonymous && (
                          <span className="ml-1 text-term-amber">
                            ({t("admin.anon")})
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Credits */}
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs">{u.credits}</span>
                      <Input
                        type="number"
                        value={deltas[u._id] ?? ""}
                        onChange={(e) =>
                          setDeltas((d) => ({ ...d, [u._id]: e.target.value }))
                        }
                        placeholder="±"
                        className="h-7 w-16 font-mono text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 font-mono text-[11px]"
                        onClick={() =>
                          run(
                            () =>
                              adjustCredits({
                                userId: u._id as never,
                                delta: Number(deltas[u._id] ?? 0) || 0,
                              }),
                            t("admin.creditsOk"),
                          )
                        }
                      >
                        {t("admin.apply")}
                      </Button>
                    </div>

                    {/* Saved / generated */}
                    <span className="font-mono text-xs text-muted-foreground">
                      {u.savedCount}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {u.generatedTotal}
                    </span>

                    {/* Role */}
                    <Badge variant="outline" className={roleClass(u.role, u.blocked)}>
                      {u.blocked
                        ? t("admin.blocked")
                        : roleLabel(u.role)}
                    </Badge>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-start gap-1.5 sm:justify-end">
                      {u.role !== "admin" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 font-mono text-[11px]"
                          onClick={() =>
                            run(
                              () => setRole({ userId: u._id as never, role: "admin" }),
                              t("admin.roleOk"),
                            )
                          }
                        >
                          {t("admin.promote")}
                        </Button>
                      ) : (
                        u._id !== user?._id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 font-mono text-[11px]"
                            onClick={() =>
                              run(
                                () => setRole({ userId: u._id as never, role: "user" }),
                                t("admin.roleOk"),
                              )
                            }
                          >
                            {t("admin.demote")}
                          </Button>
                        )
                      )}
                      {u._id !== user?._id && (
                        <Button
                          size="sm"
                          variant={u.blocked ? "outline" : "destructive"}
                          className="h-7 px-2 font-mono text-[11px]"
                          onClick={() =>
                            run(
                              () =>
                                setBlocked({ userId: u._id as never, blocked: !u.blocked }),
                              t("admin.blockOk"),
                            )
                          }
                        >
                          {u.blocked ? t("admin.unblock") : t("admin.block")}
                        </Button>
                      )}
                      {u._id !== user?._id && (
                        <AlertDialog
                          open={deleteTarget === u._id}
                          onOpenChange={(open) => !open && setDeleteTarget(null)}
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 px-2 font-mono text-[11px] text-destructive hover:bg-destructive hover:text-white"
                              onClick={() => setDeleteTarget(u._id)}
                            >
                              <Trash2 className="size-3.5" />
                              {t("admin.delete")}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {t("admin.deleteTitle")}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {t("admin.deleteDesc")}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                {t("admin.delete")}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Confirm / cancel order dialogs */}
            <AlertDialog
              open={!!confirmTarget}
              onOpenChange={(open) => !open && setConfirmTarget(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("manual.confirmTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("manual.confirmDesc", {
                      ref: confirmTarget?.reference ?? "",
                      credits: confirmTarget?.credits ?? "",
                      email: confirmTarget?.userEmail ?? "",
                    })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmOrder}
                    className="bg-term-green hover:bg-term-green/90"
                  >
                    {t("manual.confirm")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
              open={!!cancelTarget}
              onOpenChange={(open) => !open && setCancelTarget(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("manual.cancelTitle")}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("manual.cancelDesc", {
                      ref: cancelTarget?.reference ?? "",
                    })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleCancelOrder}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    {t("manual.cancel")}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
}
