import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/i18n";
import { LanguageSelect } from "@/components/LanguageSelect";
import { TerminalSquare } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { TerminalWindow } from "@/components/copy/Terminal";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error ? error.message : t("auth.errSend"),
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError(t("auth.errOtp"));
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      setError(
        t("auth.errGuest", {
          msg: error instanceof Error ? error.message : "Unknown error",
        }),
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-grid flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2.5 font-mono text-sm font-bold"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-term-green text-white">
              <TerminalSquare className="size-4" />
            </span>
            <span>
              <span className="text-term-green">~/</span>copyforge
            </span>
          </a>
          <LanguageSelect compact />
        </div>

        <TerminalWindow
          title="copyforge — login"
          bodyClassName="p-6 sm:p-7"
        >
          {step === "signIn" ? (
            <>
              <h1 className="font-mono text-lg font-bold tracking-tight">
                {isLoading ? t("auth.sending") : t("auth.loginTitle")}
              </h1>
              <p className="mt-1.5 font-mono text-[11px] leading-5 text-muted-foreground">
                <span className="text-term-green">//</span> {t("auth.subtitle")}
              </p>

              <form onSubmit={handleEmailSubmit} className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block font-mono text-[11px] text-muted-foreground">
                    <span className="text-term-green">$</span>{" "}
                    <span className="text-term-dim">{t("auth.emailLabel")}</span>
                    <span className="text-term-green"> =</span>
                  </span>
                  <Input
                    name="email"
                    placeholder={t("auth.emailPlaceholder")}
                    type="email"
                    className="font-mono text-sm"
                    disabled={isLoading}
                    required
                  />
                </label>
                {error && (
                  <p className="rounded border border-term-amber/40 bg-term-amber/10 px-3 py-2 font-mono text-[11px] text-term-amber">
                    ! {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full font-mono"
                  disabled={isLoading}
                >
                  {isLoading ? t("auth.sendingCode") : t("auth.sendCode")}
                </Button>
              </form>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {t("auth.or")}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full font-mono"
                onClick={handleGuestLogin}
                disabled={isLoading}
              >
                {t("auth.guest")}
              </Button>
            </>
          ) : (
            <>
              <h1 className="font-mono text-lg font-bold tracking-tight">
                {t("auth.verifyTitle")}
              </h1>
              <p className="mt-1.5 font-mono text-[11px] leading-5 text-muted-foreground">
                <span className="text-term-green">//</span>{" "}
                {t("auth.verifySubtitle", { email: step.email })}
              </p>

              <form onSubmit={handleOtpSubmit} className="mt-5 space-y-4">
                <input type="hidden" name="email" value={step.email} />
                <input type="hidden" name="code" value={otp} />
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                        const form = (e.target as HTMLElement).closest("form");
                        if (form) form.requestSubmit();
                      }
                    }}
                  >
                    <InputOTPGroup>
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {error && (
                  <p className="rounded border border-term-amber/40 bg-term-amber/10 px-3 py-2 text-center font-mono text-[11px] text-term-amber">
                    ! {error}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full font-mono"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? t("auth.verifying") : t("auth.verifyCode")}
                </Button>
                <p className="text-center font-mono text-[11px] text-muted-foreground">
                  {t("auth.notReceived")}{" "}
                  <Button
                    variant="link"
                    className="h-auto p-0 font-mono text-[11px] text-term-green"
                    onClick={() => setStep("signIn")}
                  >
                    {t("auth.tryAgain")}
                  </Button>
                </p>
              </form>
            </>
          )}

          <p className="mt-6 border-t pt-4 text-center font-mono text-[10px] text-muted-foreground">
            secure_channel:{" "}
            <a
              href="https://freebuff.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-term-green underline underline-offset-4 hover:text-term-green-deep"
            >
              freebuff.com
            </a>
          </p>
        </TerminalWindow>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
