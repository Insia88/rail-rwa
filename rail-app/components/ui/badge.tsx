import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { Provenance, Severity } from "@/lib/types";
import { SEVERITY_LABEL } from "@/lib/format";

type Tone = "signal" | "verified" | "gold" | "neutral" | "night" | "acid" | "cream";

const tones: Record<Tone, string> = {
  signal: "border-signal/35 bg-signal/12 text-signal",
  verified: "border-verified/30 bg-verified-soft text-verified",
  gold: "border-gold/30 bg-[#f4ecd9] text-gold",
  neutral: "border-line bg-paper-2 text-ink-soft",
  night: "border-line-dark bg-noir-2 text-cream/80",
  acid: "border-acid/30 bg-acid/10 text-acid",
  cream: "border-cream/20 bg-cream/5 text-cream/70",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  mono = true,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  mono?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-[3px] text-[10px] leading-none",
        mono && "font-mono uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const PROVENANCE: Record<Provenance, { label: string; tone: Tone }> = {
  onchain: { label: "ONCHAIN", tone: "acid" },
  platform: { label: "PLATFORM", tone: "gold" },
  document: { label: "DOCUMENT", tone: "neutral" },
  self_reported: { label: "SELF-REPORTED", tone: "signal" },
};

export function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  const p = PROVENANCE[provenance];
  return <Badge tone={p.tone}>{p.label}</Badge>;
}

export function VerifiedDot({ verified }: { verified: boolean }) {
  return (
    <span
      className={cn(
        "inline-block h-1.5 w-1.5 rounded-full",
        verified ? "bg-acid" : "bg-cream/25",
      )}
      aria-hidden
    />
  );
}

const SEVERITY_TONE: Record<Severity, Tone> = {
  high: "signal",
  medium: "gold",
  low: "cream",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge tone={SEVERITY_TONE[severity]}>
      <span className="h-1 w-1 rounded-full bg-current" aria-hidden />
      {SEVERITY_LABEL[severity]} 리스크
    </Badge>
  );
}

export function GradeBadge({
  grade,
  className,
  inverse,
}: {
  grade: string;
  className?: string;
  inverse?: boolean;
}) {
  const good = grade === "A" || grade === "B+" || grade === "B";
  return (
    <span
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center border px-2 font-mono text-sm font-semibold",
        inverse
          ? "border-acid/40 text-acid"
          : good
            ? "border-verified/40 bg-verified-soft text-verified"
            : "border-signal/40 bg-signal/10 text-signal",
        className,
      )}
      aria-label={`신용 등급 ${grade}`}
    >
      {grade}
    </span>
  );
}
