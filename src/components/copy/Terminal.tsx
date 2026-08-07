import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Terminal window chrome: traffic-light dots + a mono title bar. */
export function TerminalBar({
  title,
  right,
  className,
}: {
  title: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b bg-muted/50 px-3 py-2",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="size-2.5 shrink-0 rounded-full border border-term-amber/40 bg-term-amber/60" />
        <span className="size-2.5 shrink-0 rounded-full border border-term-amber/30 bg-term-amber/30" />
        <span className="size-2.5 shrink-0 rounded-full border border-term-green/40 bg-term-green/60" />
        <span className="ml-2 truncate font-mono text-xs text-muted-foreground">
          {title}
        </span>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

/** Full terminal-window shell used by the dashboard and landing page. */
export function TerminalWindow({
  title,
  children,
  className,
  bodyClassName,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border bg-card shadow-[0_1px_0_rgba(35,42,38,0.04),0_8px_24px_-12px_rgba(35,42,38,0.18)]",
        className,
      )}
    >
      <TerminalBar title={title} />
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </div>
  );
}

/** Blinking block cursor. */
export function BlinkCursor({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("cursor-blink text-term-green", className)}>
      ▌
    </span>
  );
}
