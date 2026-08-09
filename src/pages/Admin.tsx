import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { ConvexError } from "convex/values";
import { Loader2, Shield, ShieldOff, UserPlus, Users } from "lucide-react";
import { useMemo, useState } from "react";
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

  const [query, setQuery] = useState("");
  const [deltas, setDeltas] = useState<Record<string, string>>({});

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
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
