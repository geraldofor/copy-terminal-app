import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTypewriter } from "@/hooks/use-typewriter";
import { TEMPLATES } from "@/lib/copy-templates";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ArrowRight, Check, TerminalSquare } from "lucide-react";
import { BlinkCursor, TerminalWindow } from "@/components/copy/Terminal";

const HERO_TEXT = `$ copyforge run meta-ads --tone persuasivo
› modelo de linguagem … ok
› público: criadores de conteúdo … ok
› tom: persuasivo … ok

## 3 TÍTULOS (A/B/C)
- Copy que converte, sem chute.
- Para criadores que querem vender mais.
- Chega de perder tempo — copyforge resolve.

## TEXTO PRINCIPAL
Escreva anúncios, legendas e e-mails que
vendem — em segundos, não em horas.

## CTA
- Comece grátis hoje →`;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Landing() {
  const typed = useTypewriter(HERO_TEXT, { speed: 11, loop: true, pause: 2800, startDelay: 600 });

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
              <span className="text-term-green">./</span>templates
            </a>
            <a href="#como-funciona" className="transition-colors hover:text-foreground">
              <span className="text-term-green">./</span>como-funciona
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="font-mono">
              <a href="/auth">entrar</a>
            </Button>
            <Button asChild size="sm" className="font-mono">
              <a href="/auth">
                começar grátis
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
              copywriting assistido por IA · pt-BR
            </p>
            <h1 className="mt-5 font-mono text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
              Escreva copy
              <br />
              que <span className="text-term-green">converte</span>
              <span className="cursor-blink text-term-green">_</span>
            </h1>
            <p className="mt-5 max-w-md font-mono text-sm leading-6 text-muted-foreground">
              O terminal de copywriting para criadores de conteúdo e profissionais
              de marketing. Gere anúncios, legendas, roteiros e e-mails em
              segundos — com o tom certo para cada marca.
            </p>
            <ul className="mt-6 space-y-2 font-mono text-xs text-foreground/80">
              {[
                "4 templates profissionais de copy",
                "25 créditos grátis para começar",
                "histórico ilimitado de textos salvos",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="size-4 text-term-green" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="font-mono">
                <a href="/auth">
                  criar conta grátis
                  <ArrowRight className="size-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="font-mono">
                <a href="#templates">ver templates</a>
              </Button>
            </div>
            <p className="mt-4 font-mono text-[11px] text-muted-foreground">
              <span className="text-term-green">//</span> sem cartão de crédito ·
              cancele quando quiser
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
                  <span className="text-term-green">✓</span> 1 copy gerada · 24
                  créditos restantes
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
              // ls ~/templates
            </p>
            <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              Templates prontos para cada canal
            </h2>
            <p className="mt-3 font-mono text-sm leading-6 text-muted-foreground">
              Cada template tem campos próprios — público-alvo, tom de voz,
              objetivo — e devolve uma copy estruturada e pronta para publicar.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((template, index) => {
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
                    usar template <ArrowRight className="ml-0.5 inline size-3 transition-transform group-hover:translate-x-0.5" />
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
              // cat README.md
            </p>
            <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              Do briefing à publicação em 3 passos
            </h2>
          </motion.div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Monte o briefing",
                desc: "Preencha público-alvo, produto, tom de voz e objetivo no template escolhido.",
                cmd: "$ copyforge new --template meta-ads",
              },
              {
                n: "02",
                title: "Gere a copy",
                desc: "A IA estrutura variações prontas para testar, com o tom exato que você pediu.",
                cmd: "$ copyforge run --briefing ./brief.md",
              },
              {
                n: "03",
                title: "Salve e publique",
                desc: "Copie, edite ou salve no histórico. Tudo organizado na sua biblioteca.",
                cmd: "$ copyforge save --to biblioteca",
              },
            ].map((step, index) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-md border bg-card p-5"
              >
                <span className="font-mono text-[11px] font-bold text-term-green">
                  passo {step.n}
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
          {[
            { value: "+40k", label: "copies geradas" },
            { value: "4", label: "templates profissionais" },
            { value: "25", label: "créditos grátis" },
            { value: "99,9%", label: "tempo no ar" },
          ].map((stat) => (
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
              // pronto para rodar?
            </p>
            <h2 className="mt-3 font-mono text-2xl font-bold tracking-tight sm:text-3xl">
              Sua próxima copy está a um comando de distância
            </h2>
            <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-lg border bg-card text-left">
              <div className="border-b bg-muted/50 px-4 py-2 font-mono text-xs text-muted-foreground">
                copyforge — setup
              </div>
              <div className="space-y-2 p-5 font-mono text-[12.5px] leading-6">
                <p className="text-term-green">$ copyforge --comecar</p>
                <p className="text-muted-foreground">
                  <span className="mr-1.5 text-term-dim">›</span>criando conta
                  gratuita … <span className="text-term-green">ok</span>
                </p>
                <p className="text-muted-foreground">
                  <span className="mr-1.5 text-term-dim">›</span>créditos de
                  boas-vindas: <span className="text-term-green">+25</span>
                </p>
                <p className="text-muted-foreground">
                  <span className="mr-1.5 text-term-dim">›</span>sem cartão de
                  crédito · cancele quando quiser
                </p>
                <BlinkCursor className="text-term-green" />
              </div>
            </div>
            <Button asChild size="lg" className="mt-8 font-mono">
              <a href="/auth">
                criar conta grátis
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              já tem conta? <a href="/auth" className="text-term-green underline underline-offset-4 hover:text-term-green-deep">entrar →</a>
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
          <p className="text-term-dim">feito para criadores de conteúdo e profissionais de marketing</p>
        </div>
      </footer>
    </div>
  );
}
