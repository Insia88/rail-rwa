import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Provenance, Severity } from "@/lib/types";

/** Small mono kicker used across the dark surfaces. */
export function Kicker({
  children,
  className,
  tone = "acid",
}: {
  children: ReactNode;
  className?: string;
  tone?: "acid" | "signal" | "cream";
}) {
  return (
    <p
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.28em]",
        tone === "acid" && "text-acid/85",
        tone === "signal" && "text-signal",
        tone === "cream" && "text-cream/40",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Hairline rules for dark / cream surfaces. */
export function RuleDark({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-line-dark", className)} />;
}

export function RuleInk({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-noir/12", className)} />;
}

const PROVENANCE_LABEL: Record<Provenance, string> = {
  onchain: "ONCHAIN",
  platform: "PLATFORM",
  document: "DOCUMENT",
  self_reported: "SELF-REPORTED",
};

const PROVENANCE_LABEL_EN: Record<Provenance, string> = {
  onchain: "ON-CHAIN",
  platform: "PLATFORM",
  document: "DOCUMENT",
  self_reported: "SELF-REPORTED",
};

/**
 * Provenance chip in both surface tones.
 * dark  → for noir surfaces (acid = on-chain)
 * light → for the cream "guarantee document" (ink rules; acid is too weak on cream)
 */
export function ProvenanceChip({
  provenance,
  variant = "dark",
  locale = "ko",
  className,
}: {
  provenance: Provenance;
  variant?: "dark" | "light";
  locale?: "ko" | "en";
  className?: string;
}) {
  const dark: Record<Provenance, string> = {
    onchain: "border-acid/35 bg-acid/[0.08] text-acid",
    platform: "border-cream/25 bg-cream/[0.04] text-cream/75",
    document: "border-line-dark text-cream/45",
    self_reported: "border-signal/40 bg-signal/[0.08] text-signal",
  };
  const light: Record<Provenance, string> = {
    onchain: "border-ink/35 bg-ink/[0.05] text-ink",
    platform: "border-ink/25 text-ink/75",
    document: "border-ink/20 text-ink/65",
    self_reported: "border-signal/60 bg-signal/[0.06] text-signal",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-[3px] font-mono text-[10px] uppercase leading-none tracking-[0.12em]",
        variant === "dark" ? dark[provenance] : light[provenance],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1 w-1 rounded-full",
          provenance === "onchain"
            ? "bg-acid"
            : provenance === "self_reported"
              ? "bg-signal"
              : variant === "dark"
                ? "bg-cream/40"
                : "bg-ink/40",
        )}
      />
      {locale === "en" ? PROVENANCE_LABEL_EN[provenance] : PROVENANCE_LABEL[provenance]}
    </span>
  );
}

const SEVERITY_LABEL: Record<Severity, string> = { high: "높음", medium: "중간", low: "낮음" };
const SEVERITY_LABEL_EN: Record<Severity, string> = { high: "High", medium: "Medium", low: "Low" };

export function SeverityChip({
  severity,
  variant = "light",
  locale = "ko",
  className,
}: {
  severity: Severity;
  variant?: "dark" | "light";
  locale?: "ko" | "en";
  className?: string;
}) {
  const dark: Record<Severity, string> = {
    high: "border-signal/45 bg-signal/[0.08] text-signal",
    medium: "border-cream/25 text-cream/70",
    low: "border-line-dark text-cream/40",
  };
  const light: Record<Severity, string> = {
    high: "border-signal/60 bg-signal/[0.06] text-signal",
    medium: "border-ink/30 text-ink/80",
    low: "border-ink/20 text-ink/65",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-[3px] font-mono text-[10px] uppercase leading-none tracking-[0.1em]",
        variant === "dark" ? dark[severity] : light[severity],
        className,
      )}
    >
      <span aria-hidden className="h-1 w-1 rounded-full bg-current" />
      {locale === "en"
        ? `${SEVERITY_LABEL_EN[severity]} risk`
        : `${SEVERITY_LABEL[severity]} 리스크`}
    </span>
  );
}

/** Grade tone per surface — acid is data, orange is caution. */
export function gradeTone(grade: string, variant: "dark" | "light" = "dark"): string {
  const strong = grade === "A" || grade === "B+";
  const mid = grade === "B" || grade === "C+";
  if (variant === "dark") return strong ? "text-acid" : mid ? "text-cream" : "text-signal";
  return strong ? "text-ink" : mid ? "text-ink/80" : "text-signal";
}
