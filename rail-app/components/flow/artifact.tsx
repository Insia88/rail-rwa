import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Printing the passport: keep the paper / seal tones exact when a reader saves
 * the artifact as PDF (browsers otherwise drop backgrounds).
 */
export const printExact = {
  printColorAdjust: "exact",
  WebkitPrintColorAdjust: "exact",
} as unknown as CSSProperties;

/** One numbered section of the paper credit memo. */
export function ArtifactSection({
  id,
  labelledBy,
  children,
  className,
}: {
  id?: string;
  labelledBy?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("px-5 py-7 sm:px-7 sm:py-8 md:px-9", className)}
    >
      {children}
    </section>
  );
}

export function ArtifactHead({
  index,
  title,
  kicker,
  id,
}: {
  index: string;
  title: string;
  kicker: string;
  id: string;
}) {
  return (
    <header className="border-b border-ink/80 pb-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
          CH.{index}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/70">
          {kicker}
        </span>
      </div>
      <h2
        id={id}
        className="mt-2 text-[26px] font-extrabold leading-[1.15] tracking-[-0.012em] text-ink sm:text-[32px]"
      >
        {title}
      </h2>
    </header>
  );
}

export function ArtifactRow({
  label,
  value,
  sub,
  last,
  emphasis,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  last?: boolean;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 border-b border-ink/10 py-2.5",
        last && "border-b-0",
      )}
    >
      <dt className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/70">
        {label}
      </dt>
      <dd className="min-w-0 text-right">
        <p
          className={cn(
            "font-mono text-[14px] font-semibold tracking-[-0.01em] tnum",
            emphasis ? "text-signal" : "text-ink",
          )}
        >
          {value}
        </p>
        {sub ? (
          <p className="mt-0.5 break-words font-mono text-[11px] leading-relaxed tnum text-ink/60">
            {sub}
          </p>
        ) : null}
      </dd>
    </div>
  );
}

/** Seal-style label used inside the RWA certificate plate. */
export function Stamp({
  label,
  tone = "ink",
  rotate = "",
}: {
  label: string;
  tone?: "ink" | "signal" | "muted";
  rotate?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center border px-2.5 font-mono text-[10px] uppercase tracking-[0.16em]",
        tone === "ink" && "border-ink/50 text-ink/75",
        tone === "signal" && "border-signal/70 text-signal",
        tone === "muted" && "border-ink/25 text-ink/55",
        rotate,
      )}
    >
      {label}
    </span>
  );
}
