import { Button } from "@/components/ui/button";
import { LanguageSelect } from "@/components/LanguageSelect";
import { TerminalSquare } from "lucide-react";

/**
 * Shared layout for static legal pages (/privacy, /terms).
 * Terminal aesthetic to match the rest of the app, kept minimal by design.
 * Content is provided by the pages themselves as structured sections.
 */
export interface LegalSection {
  title: string;
  body: string[];
  /** Optional bullet list rendered under the section body. */
  bullets?: string[];
}

export function LegalPage({
  title,
  version,
  updated,
  sections,
}: {
  title: string;
  version: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <a href="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-md bg-term-green text-white">
              <TerminalSquare className="size-4" />
            </span>
            <span className="font-mono text-sm font-bold">
              <span className="text-term-green">~/</span>copyforge
            </span>
          </a>
          <LanguageSelect compact />
        </div>
      </header>

      {/* Document */}
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-term-green">
          $ copyforge --{title.toLowerCase().includes("privacy") ? "privacy" : "terms"}
        </p>
        <h1 className="mt-2 font-mono text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">
          <span className="text-term-dim">//</span> {version} · {updated}
        </p>

        <div className="mt-8 space-y-8">
          {sections.map((section, index) => (
            <section key={index}>
              <h2 className="font-mono text-sm font-bold uppercase tracking-[0.14em] text-term-green">
                <span className="mr-2 text-term-dim">{String(index + 1).padStart(2, "0")}</span>
                {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="font-mono text-[13px] leading-6 text-foreground/85">
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="space-y-1.5">
                    {section.bullets.map((bullet, i) => (
                      <li key={i} className="flex gap-2 font-mono text-[13px] leading-6 text-foreground/85">
                        <span className="select-none text-term-green">-</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-12 border-t pt-6 font-mono text-[11px] text-muted-foreground">
          <span className="text-term-dim">//</span> Questions about this document?{" "}
          <a href="mailto:support@copyterminal.netlify.app" className="text-term-green underline underline-offset-4">
            contact support
          </a>
          .
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/40">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-3 px-4 py-6 font-mono text-[11px] text-muted-foreground sm:flex-row sm:px-6">
          <p>
            <span className="text-term-green">~/</span>copyforge · © 2026
          </p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="transition-colors hover:text-foreground">
              privacy
            </a>
            <a href="/terms" className="transition-colors hover:text-foreground">
              terms
            </a>
            <a href="/" className="transition-colors hover:text-foreground">
              home
            </a>
          </div>
          <p className="text-term-dim">secure_channel · copyforge</p>
        </div>
      </footer>
    </div>
  );
}
