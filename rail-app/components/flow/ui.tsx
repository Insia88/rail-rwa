import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Provenance, Severity } from "@/lib/types";

/** Quiet text label used above sections (sentence case, never mono caps). */
export function Kicker({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  /** @deprecated legacy tone prop — light surfaces use graphite-3 only */
  tone?: "acid" | "signal" | "cream";
}) {
  return (
    <p className={cn("text-[13px] font-medium leading-[1.5] text-graphite-3", className)}>
      {children}
    </p>
  );
}

export function RuleDark({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-white/10", className)} />;
}

export function RuleInk({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-hairline", className)} />;
}

const PROVENANCE_LABEL: Record<Provenance, string> = {
  onchain: "온체인",
  platform: "플랫폼 원장",
  document: "문서",
  self_reported: "자기신고",
};

const PROVENANCE_LABEL_EN: Record<Provenance, string> = {
  onchain: "On-chain",
  platform: "Platform ledger",
  document: "Document",
  self_reported: "Self-reported",
};

const PROVENANCE_DOT: Record<Provenance, string> = {
  onchain: "bg-graphite",
  platform: "bg-graphite-2",
  document: "bg-graphite-3",
  self_reported: "bg-vermilion",
};

export function ProvenanceChip({
  provenance,
  variant = "light",
  locale = "ko",
  className,
}: {
  provenance: Provenance;
  variant?: "light" | "dark";
  locale?: "ko" | "en";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[12.5px] leading-none",
        variant === "dark" ? "text-white/65" : "text-graphite-2",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          variant === "dark" ? "bg-white/50" : PROVENANCE_DOT[provenance],
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
  variant?: "light" | "dark";
  locale?: "ko" | "en";
  className?: string;
}) {
  const light: Record<Severity, string> = {
    high: "bg-vermilion-soft text-vermilion",
    medium: "border border-hairline-2 bg-porcelain text-graphite-2",
    low: "border border-hairline-2 text-graphite-3",
  };
  const dark: Record<Severity, string> = {
    high: "bg-vermilion/20 text-vermilion",
    medium: "border border-white/15 text-white/65",
    low: "border border-white/10 text-white/45",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium leading-none",
        variant === "dark" ? dark[severity] : light[severity],
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {locale === "en"
        ? `${SEVERITY_LABEL_EN[severity]} risk`
        : `${SEVERITY_LABEL[severity]} 리스크`}
    </span>
  );
}

/** Grade tone on the light document surface. */
export function gradeTone(grade: string, variant: "light" | "dark" = "light"): string {
  const strong = grade === "A" || grade === "B+";
  const mid = grade === "B" || grade === "C+";
  if (variant === "dark") return strong ? "text-white" : mid ? "text-white/85" : "text-vermilion";
  return strong ? "text-graphite" : mid ? "text-graphite-2" : "text-vermilion";
}
