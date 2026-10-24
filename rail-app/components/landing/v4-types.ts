/** Shared copy contracts for the v4 landing bands (KO + EN pages). */

export interface ActionLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface HeroCopy {
  eyebrow: string;
  lines: { text: string; accent?: boolean; emphasis?: string }[];
  body: string;
  /** One-line business spec under H1 (term · ticket size · fee · speed). */
  specLine?: string;
  primary: ActionLink;
  secondary: ActionLink;
  /** Small mono line next to the CTAs (e.g. "2.4s verdict · no signup"). */
  ctaNote?: string;
  card: {
    kicker: string;
    bankLabel: string;
    bankValue: string;
    rejected: string;
    railLabel: string;
    decision: string;
    grade: string;
    limit: string;
    apr: string;
    coverage: string;
    coverageLabel?: string;
    meta: string;
    stamp: string;
    ready: string;
  };
}

export interface CaseFileCopy {
  index: string;
  kicker: string;
  title: string;
  sub: string;
  bankLabel: string;
  bankValue: string;
  facts: { value: string; label: string }[];
  steps: { tag: string; title: string; detail: string }[];
  /** Optional "why now" strip shown at the bottom of the case file. */
  whyNow?: { label: string; value: string }[];
  /** Optional evidence ledger (EN depth block). */
  evidenceLabel?: string;
  evidence?: { label: string; value: string; provenance: string }[];
  /** "Try the underwriting yourself ↓" — anchors to #run. */
  runCta?: ActionLink;
}

export interface LiveUnderwriterCopy {
  index: string;
  kicker: string;
  title: string;
  sub: string;
  typeLabels: Record<string, string>;
  /** Optional per-applicant tab labels (fallback: applicantName + type). */
  tabLabels?: Record<string, string>;
  /** Optional per-agent progress lines (fallback: engine log). */
  progressLabels?: Record<string, string>;
  decisions: Record<"approved" | "conditional" | "declined", string>;
  run: string;
  running: string;
  again: string;
  profileLink: string;
  idle: string;
  verdict: string;
  bankBadge: string;
  score: string;
  grade: string;
  limit: string;
  apr: string;
  flags: string;
  coverage: string;
  agents: string;
  logs: string;
  disclaimer?: string;
  /** Short "how to read the passport" hint under the verdict. */
  readingHint?: string;
}

export interface PassportRwaCopy {
  index: string;
  kicker: string;
  title: string;
  sub: string;
  reelLabel: string;
  dragLabel: string;
  railLabel: string;
  steps: { title: string; body: string }[];
  /** Optional product-depth blocks (EN page). */
  bullets?: { title: string; body: string }[];
  footnote?: string;
  /** "Next: live market data" link at the bottom of the band. */
  nextLink?: ActionLink;
}

/** 3-step demo path strip copy (KO + EN). */
export interface DemoPathCopy {
  kicker: string;
  title: string;
  items: {
    n: string;
    title: string;
    detail: string;
    time: string;
    href: string;
  }[];
}

export interface ProofCopy {
  index: string;
  kicker: string;
  title: string;
  sub: string;
  liveLabel: string;
  metricLabels: string[];
  eventsLabel: string;
  events: string[];
  crewLabel: string;
  crew: { name: string; role: string; status: string }[];
  decisions: Record<"approved" | "conditional" | "declined", string>;
  links: { market: ActionLink; agents: ActionLink };
  /** Optional trust notes under the metrics strip (EN page). */
  notes?: string[];
}

export interface ClosingCopy {
  kicker: string;
  title: string;
  serif: string;
  sub: string;
  primary: ActionLink;
  secondary: ActionLink;
  contact?: { label: string; href: string };
}
