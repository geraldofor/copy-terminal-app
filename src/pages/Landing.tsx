import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useTypewriter } from "@/hooks/use-typewriter";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { captureTrafficSource } from "@/lib/traffic";
import { SUBSCRIPTION_PLANS, annualPerMonth, formatUSD } from "@/convex/packs";
import { motion } from "framer-motion";
import { ArrowRight, Check, TerminalSquare } from "lucide-react";
import { BlinkCursor, TerminalWindow } from "@/components/copy/Terminal";
import { useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Landing() {
  const { t, templates } = useI18n();
  const typed = useTypewriter(t("landing.heroText"), {
    speed: 11,
    loop: true,
    pause: 2800,
    startDelay: 600,
  });

  const features = [
    t("landing.feature1"),
    t("landing.feature2"),
    t("landing.feature3"),
  ];

  const steps = [
    {
      n: "01",
      title: t("landing.step1.title"),
      desc: t("landing.step1.desc"),
      cmd: "$ copyforge new --template meta-ads",
    },
    {
      n: "02",
      title: t("landing.step2.title"),
      desc: t("landing.step2.desc"),
      cmd: "$ copyforge run --briefing ./brief.md",
    },
    {
      n: "03",
      title: t("landing.step3.title"),
      desc: t("landing.step3.desc"),
      cmd: "$ copyforge save --to library",
    },
  ];

  /* Trust badges shown below hero CTA */
  const trustBadges = [
    t("landing.trust1"),
    t("landing.trust2"),
    t("landing.trust3"),
  ];

  const stats = [
    { value: "5", label: t("landing.stat1.label") },
    { value: "25", label: t("landing.stat2.label") },
    { value: "3", label: t("landing.stat3.label") },
    { value: "$0", label: t("landing.stat4.label") },
  ];

  const faqs = [
    { q: t("landing.faq1q"), a: t("landing.faq1a") },
    { q: t("landing.faq2q"), a: t("landing.faq2a") },
    { q: t("landing.faq3q"), a: t("landing.faq3a") },
    { q: t("landing.faq4q"), a: t("landing.faq4a") },
    { q: t("landing.faq5q"), a: t("landing.faq5a") },
  ];

  useEffect(() => {
    captureTrafficSource();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="#" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-term-green text-white">
              <TerminalSquare className="size-4" />
            </span>
            <span className="font-mono text-sm font-bold">
              <span className="text-term-green">~/</span>copyforge
            </span>
          </a>
          <nav className="hidden items-center gap-6 font-mono text-xs text-muted-foreground md:flex">
            <a href="#templates" className="transition-colors hover:text-foreground">
              <span className="text-term-green">./</span>{t("nav.templates")}
            </a>
            <a href="#como-funciona" className="transition-colors hover:text-foreground">
              <span className="text-term-green">./</span>{t("nav.how")}
            </a>
            <a href="#planos" className="transition-colors hover:text-foreground">
              <span className="text-term-green">./</span>{t("nav.plans")}
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              <span className="text-term-green">./</span>{t("nav.faq")}
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSelect compact />
            <Button asChild variant="ghost" size="sm" className="font-mono">
              <a href="/auth">{t("nav.signin")}</a>
            </Button>
            <Button asChild size="sm" className="font-mono">
              <a href="/auth">
                {t("nav.signup")}
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-grid relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <p className="inline-flex items-center gap-2 rounded-full border border-term-green/30 bg-term-soft/70 px-3 py-1 font-mono text-[11px] text-term-green-deep">
              <span className="size-1.5 animate-pulse rounded-full bg-term-green" />
              {t("landing.badge")}
            </p>
            <h1 className="mt-5 font-mono text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              {t("landing.heroLine1")}
              <br />
              {t("landing.heroLine2")} <span className="text-term-green">{t("landing.heroAccent")}</span>
              <span className="cursor-blink text-term-green">_</span>
            </h1>
            <p className="mt-5 max-w-md font-mono text-sm leading-6 text-muted-foreground">
              {t("landing.heroSub")}
            </p>
            <ul className="mt-6 space-y-2 font-mono text-xs text-foreground/80">
              {features.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-term-green" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="font-mono">
                <a href="/auth">
                  {t("landing.ctaFree")}
                  <ArrowRight className="size-4" />
                </a>
              </Button>
            </div>
            <p className="mt-4 font-mono text-[11px] text-muted-foreground">
              <span className="text-term-green">//</span> {t("landing.note")}
            </p>
            <p className="mt-2 font-mono text-[10px] text-muted-foreground/70">
              <span className="text-term-dim">$</span> {trustBadges.join(" · ")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <TerminalWindow
              title="copyforge — gerar --template meta-ads"
              bodyClassName="min-h-[380px] bg-[linear-gradient(to_bottom,transparent,rgba(60,122,77,0.03))] p-5 font-mono text-[12.5px] leading-6"
            >
              <pre className="whitespace-pre-wrap break-words">
                {typed.split("\n").map((line, i, lines) => {
                  const isLast = i === lines.length - 1;
                  const isCmd = line.startsWith("$");
                  const isLog = line.startsWith("›");
                  const isHead = line.startsWith("## ");
                  const isBullet = line.startsWith("- ");
                  return (
                    <p
                      key={i}
                      className={cn(
                        isCmd && "text-term-green",
                        isLog && "text-muted-foreground",
                        isHead &&
                          "mt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-term-green",
                        isBullet && "text-foreground/90",
                        !isCmd && !isLog && !isHead && !isBullet && line.trim() !== "" &&
                          "text-foreground/90",
                      )}
                    >
                      {isHead && <span className="mr-1.5 text-term-dim">##</span>}
                      {isBullet && <span className="mr-1.5 text-term-dim">-</span>}
                      {isLog && <span className="mr-1.5 text-term-dim">›</span>}
                      {line}
                      {isLast && <BlinkCursor className="ml-0.5" />}
                    </p>
                  );
                })}
              </pre>
              <div className="mt-4 flex items-center justify-between border-t pt-3 font-mono text-[10px] text-muted-foreground">
                <span>
                  <span className="text-term-green">✓</span> {t("landing.termFooter")}
                </span>
                <span className="text-term-dim">exit 0</span>
              </div>
            </TerminalWindow>
          </motion.div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="border-t bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-term-green">
              {t("landing.sectionTemplatesLabel")}
            </p>
            <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              {t("landing.sectionTemplatesTitle")}
            </h2>
            <p className="mt-3 font-mono text-sm leading-6 text-muted-foreground">
              {t("landing.sectionTemplatesDesc")}
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((template, index) => {
              const Icon = template.icon;
              return (
                <motion.a
                  key={template.id}
                  href="/auth"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: index * 0.07 }}
                  className="group flex flex-col rounded-md border bg-card p-4 transition-all hover:-translate-y-1 hover:border-term-green/50 hover:shadow-[0_12px_28px_-16px_rgba(60,122,77,0.45)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-md bg-term-soft text-term-green-deep">
                      <Icon className="size-4" />
                    </span>
                    <span className="font-mono text-[10px] text-term-dim transition-colors group-hover:text-term-green">
                      $ cat {template.id}.ts
                    </span>
                  </div>
                  <h3 className="mt-4 font-mono text-sm font-bold">{template.name}</h3>
                  <p className="mt-1.5 flex-1 font-mono text-[11px] leading-5 text-muted-foreground">
                    {template.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {template.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="rounded-sm font-mono text-[9.5px] font-normal text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="mt-4 font-mono text-[11px] font-semibold text-term-green">
                    {t("landing.useTemplate")} <ArrowRight className="ml-0.5 inline size-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-term-green">
              {t("landing.sectionHowLabel")}
            </p>
            <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              {t("landing.sectionHowTitle")}
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-md border bg-card p-5"
              >
                <span className="font-mono text-[11px] font-bold text-term-green">
                  {t("landing.stepLabel", { n: step.n })}
                </span>
                <h3 className="mt-2 font-mono text-sm font-bold">{step.title}</h3>
                <p className="mt-1.5 font-mono text-[11px] leading-5 text-muted-foreground">
                  {step.desc}
                </p>
                <p className="mt-4 truncate rounded bg-muted px-2.5 py-1.5 font-mono text-[10px] text-term-green-deep">
                  {step.cmd}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-t bg-card/40">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden border sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card px-5 py-8 text-center">
              <p className="font-mono text-2xl font-bold tracking-tight text-term-green">
                {stat.value}
              </p>
              <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-term-green">
              {t("landing.sectionPlansLabel")}
            </p>
            <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              {t("landing.sectionPlansTitle")}
            </h2>
            <p className="mt-3 font-mono text-sm leading-6 text-muted-foreground">
              {t("landing.sectionPlansDesc")}
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Free tier */}
            <motion.a
              href="/auth"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4 }}
              className="group flex flex-col rounded-md border bg-card p-4 transition-all hover:-translate-y-1 hover:border-term-green/50 hover:shadow-[0_12px_28px_-16px_rgba(60,122,77,0.45)]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <span className="text-term-green">$</span> plan:
                <span className="text-foreground"> free</span>
              </p>
              <p className="mt-3 font-mono text-4xl font-bold tracking-tight">25</p>
              <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                {t("landing.planFreeHint")}
              </p>
              <div className="mt-4 border-t border-dashed pt-4">
                <p className="font-mono text-2xl font-bold text-term-green-deep">$0</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {t("landing.planFree")}
                </p>
              </div>
              <span className="mt-auto pt-5 font-mono text-[11px] font-semibold text-term-green">
                {t("landing.planGet")}{" "}
                <ArrowRight className="ml-0.5 inline size-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </motion.a>

            {SUBSCRIPTION_PLANS.filter((plan) => plan.priceUSD > 0).map(
              (plan, index) => (
                <motion.a
                  key={plan.id}
                  href="/auth?returnTo=/plans"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.4, delay: (index + 1) * 0.06 }}
                  className={cn(
                    "group relative flex flex-col rounded-md border bg-card p-4 transition-all hover:-translate-y-1 hover:shadow-[0_12px_28px_-16px_rgba(60,122,77,0.45)]",
                    plan.popular
                      ? "border-term-green/50 hover:border-term-green"
                      : "hover:border-term-green/40",
                  )}
                >
                  {plan.popular && (
                    <span className="absolute -top-2.5 left-4 rounded-full border border-term-green/40 bg-term-soft px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-term-green-deep">
                      {t("plan.popular")}
                    </span>
                  )}
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    <span className="text-term-green">$</span> plan:
                    <span className="text-foreground"> {plan.id}</span>
                  </p>
                  <p className="mt-3 font-mono text-3xl font-bold tracking-tight">
                    ${formatUSD(plan.priceUSD)}
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("landing.planPerMonth")}
                    </span>
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    {t("landing.planCreditsMo", { n: plan.credits })}
                  </p>
                  <div className="mt-4 border-t border-dashed pt-4">
                    <p className="font-mono text-[11px] leading-4 text-term-green-deep">
                      {t("landing.planTrial")} ·{" "}
                      {t("landing.planRollover", { n: plan.rolloverCap })}
                    </p>
                    {plan.seats && (
                      <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                        {t("landing.planSeats", { n: plan.seats })}
                        {plan.api ? ` · ${t("landing.planApi")}` : ""}
                      </p>
                    )}
                    <p className="mt-1.5 font-mono text-[10px] text-muted-foreground">
                      {t("landing.planBilled", {
                        price: `$${formatUSD(annualPerMonth(plan))}`,
                      })}
                    </p>
                  </div>
                  <span className="mt-auto pt-5 font-mono text-[11px] font-semibold text-term-green">
                    {t("landing.planSee")}{" "}
                    <ArrowRight className="ml-0.5 inline size-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </motion.a>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t bg-card/40">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            className="text-center"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-term-green">
              {t("landing.sectionFaqLabel")}
            </p>
            <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              {t("landing.sectionFaqTitle")}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4 }}
          >
            <Accordion type="single" collapsible className="mt-8 overflow-hidden rounded-md border bg-card">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="px-4">
                  <AccordionTrigger className="py-4 font-mono text-[13px] font-medium hover:no-underline">
                    <span className="mr-2 text-term-green">$</span>
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="font-mono text-xs leading-6 text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-term-green">
              {t("landing.ctaLabel")}
            </p>
            <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              {t("landing.ctaTitle")}
            </h2>
            <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-lg border bg-card text-left">
              <div className="border-b bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground">
                copyforge — setup
              </div>
              <div className="space-y-2 p-5 font-mono text-[12.5px] leading-6">
                <p className="text-term-green">$ copyforge --start</p>
                <p className="text-muted-foreground">
                  <span className="mr-1.5 text-term-dim">›</span>{t("landing.setup1")}
                </p>
                <p className="text-muted-foreground">
                  <span className="mr-1.5 text-term-dim">›</span>{t("landing.setup2")}
                </p>
                <p className="text-muted-foreground">
                  <span className="mr-1.5 text-term-dim">›</span>{t("landing.setup3")}
                </p>
                <BlinkCursor className="text-term-green" />
              </div>
            </div>
            <Button asChild size="lg" className="mt-8 font-mono">
              <a href="/auth">
                {t("landing.ctaButton")}
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              {t("landing.hasAccount")}{" "}
              <a href="/auth" className="text-term-green underline underline-offset-4 hover:text-term-green-deep">
                {t("landing.ctaSignin")}
              </a>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-6 font-mono text-[11px] text-muted-foreground sm:flex-row sm:px-6">
          <p>
            <span className="text-term-green">~/</span>copyforge · © 2026
          </p>
          <p className="text-term-dim">{t("landing.footerTagline")}</p>
        </div>
      </footer>
    </div>
  );
}
