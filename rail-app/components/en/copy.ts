import type {
  CaseFileCopy,
  ClosingCopy,
  DemoPathCopy,
  HeroCopy,
  LiveUnderwriterCopy,
  PassportRwaCopy,
  ProofCopy,
} from "@/components/landing/v4-types";

/**
 * EN copy — aligned with docs/en-landing-copy.md (english-copywriter deck).
 * Figures are rendered from engine/market props; only labels/copy live here.
 */
export const heroEn: HeroCopy = {
  eyebrow: "RWA credit rail · Seoul · 2026",
  lines: [
    { text: "Credit for the cash flow", emphasis: "cash flow" },
    { text: "the bank can't read." },
  ],
  body: "RAIL verifies export receipts, platform payouts, and patents as evidence, issues a Credit Passport, and tokenizes approved receivables as ERC-3643 RWAs on Base.",
  specLine:
    "90-day export receivable factoring · KRW 30M–300M per deal · 1.5–3% fee · 4-minute underwriting",
  primary: { href: "/en/underwrite/hanbit", label: "Run the Hanbit underwriting" },
  secondary: { href: "/RAIL-onepager-en.pdf", label: "Read the one-page summary", external: true },
  ctaNote: "no signup · 3 demo applicants · live market",
  card: {
    kicker: "Underwriting verdict",
    bankLabel: "Bank result",
    bankValue: "KB · Hana · Busan Bank",
    rejected: "3 DECLINED",
    railLabel: "RAIL verdict",
    decision: "Approved",
    grade: "GRADE",
    limit: "APPROVED LIMIT",
    apr: "APR · 90D",
    coverage: "verified",
    coverageLabel: "VERIFIED COVERAGE",
    meta: "Busan · export SME · 5 people",
    stamp: "Verified",
    ready: "RWA-READY",
  },
};

export const caseFileEn: CaseFileCopy = {
  index: "01",
  kicker: "Case file · 001",
  title: "Three banks said no. The money was already arriving.",
  sub: "A five-person exporter in Busan was rejected by three banks. Hanbit Electronics sells to buyers in Vietnam and Indonesia, books KRW 2.46B in annual revenue, gets paid in USD and USDC, owns no real estate, and is two years old. The bank file did not fail on the numbers. It failed on the format.",
  bankLabel: "What the bank saw",
  bankValue:
    "No real estate collateral. Two years of operating history. Dollar revenue that does not reconcile to a KRW financial statement. Three banks declined the same way.",
  facts: [
    { value: "3", label: "banks declined" },
    { value: "KRW 0", label: "real estate collateral" },
    { value: "{limit}", label: "approved limit" },
  ],
  whyNow: [
    { label: "Token-securities law", value: "Passed 2026-01-15 · effective Jan 2027 (expected)" },
    { label: "Stablecoin liquidity", value: "$305B float · USDC settlement rails" },
    { label: "24/7 on-chain market", value: "KOSPI 200, Hyundai and SK Hynix trade around the clock" },
  ],
  steps: [
    {
      tag: "01",
      title: "Evidence, graded by provenance",
      detail:
        "USDC settlements, POs, B/Ls, customs filings — {evidenceCount} items. Verified coverage {coverage}; unverified items stay in the file but out of the decision.",
    },
    {
      tag: "02",
      title: "A deterministic decision",
      detail:
        "Grade {grade} · KRW limit {limit} · APR {apr} · {flags} risk flags, each with a covenant and mitigation.",
    },
    {
      tag: "03",
      title: "The receivable becomes a token",
      detail: "{receivableId} · {chain} · {tokenStandard} · {funded} funded (simulated).",
    },
  ],
  runCta: { href: "#run", label: "Run the underwriting yourself" },
  evidenceLabel: "What RAIL read",
  evidence: [
    {
      label: "USDC settlements from buyer wallets, 6 months",
      value: "87 settlements · KRW 354M",
      provenance: "On-chain · Base",
    },
    {
      label: "Purchase orders from buyers",
      value: "3 POs · KRW 214M",
      provenance: "Document · OCR",
    },
    {
      label: "USD wire deposits, foreign-currency account",
      value: "14 deposits · KRW 96M",
      provenance: "Bank statement",
    },
    {
      label: "Bills of lading and customs export declarations",
      value: "6 B/Ls · KRW 268M",
      provenance: "Customs · freight",
    },
    {
      label: "2025 VAT return",
      value: "KRW 2.46B revenue",
      provenance: "Tax filing",
    },
    {
      label: "Buyer credit profile — verified?",
      value: "No",
      provenance: "Public database",
    },
    {
      label: "Founder revenue projection — verified?",
      value: "No",
      provenance: "Self-reported",
    },
  ],
};

export const liveUnderwriterEn: LiveUnderwriterCopy = {
  index: "02",
  kicker: "Demo · run in the page",
  title: "The engine runs where the evidence is.",
  sub: "Choose an applicant, run the underwriting, and watch four agents work through the evidence. The decision appears in the page — no navigation, no model call.",
  typeLabels: {
    exporter: "exporter · Busan",
    freelancer: "freelance developer · Seoul",
    deeptech: "IP-backed deeptech · Daejeon",
  },
  tabLabels: {
    hanbit: "Hanbit Electronics",
    kimfreelance: "Kim Do-hyun",
    fiberlogic: "FiberLogic",
  },
  progressLabels: {
    scout: "SCOUT · collecting evidence",
    verifier: "VERIFIER · cross-checking claims",
    underwriter: "UNDERWRITER · computing score, limit, APR",
    broker: "BROKER · matching the receivable",
  },
  decisions: { approved: "Approved", conditional: "Conditional", declined: "Declined" },
  run: "Run underwriting",
  running: "Underwriting",
  again: "Run again",
  profileLink: "Open the passport",
  idle:
    "Run underwriting to watch SCOUT → VERIFIER → UNDERWRITER → BROKER produce a verdict in place.",
  verdict: "Verdict",
  bankBadge: "BANK-REJECTED APPLICANTS",
  score: "CREDIT SCORE",
  grade: "GRADE",
  limit: "LIMIT",
  apr: "APR",
  flags: "RISK FLAGS",
  coverage: "evidence coverage",
  agents: "Agent console",
  logs: "evidence → verdict",
  disclaimer: "Simulated applicants. Deterministic engine. Same inputs, same output.",
  readingHint: "How to read the passport — grade → limit → APR → risk flags.",
};

export const passportRwaEn: PassportRwaCopy = {
  index: "03",
  kicker: "Product · Credit Passport",
  title: "Every number arrives with its evidence attached.",
  sub: "A Credit Passport is a machine-readable credit file: evidence with provenance, a score with published weights, a limit, a price, and the receivable that carries it.",
  reelLabel: "Three passports, one rail.",
  dragLabel: "Drag · Auto 5.6s",
  railLabel: "Five steps",
  steps: [
    { title: "Evidence", body: "provenance-graded inputs" },
    { title: "Score", body: "published weights, 100 points" },
    { title: "Limit", body: "verified inflow × score scale" },
    { title: "APR", body: "benchmark + spread + FX" },
    { title: "RWA", body: "ERC-3643 receivable on Base" },
  ],
  bullets: [
    {
      title: "Evidence, graded by provenance",
      body: "On-chain, platform, document and self-reported items are separated. Unverified revenue is shown but excluded from the decision.",
    },
    {
      title: "A score with published weights",
      body: "Seven components sum to 100 points and a letter grade. No hidden model, no LLM arithmetic.",
    },
    {
      title: "A limit and a price, line by line",
      body: "Benchmark + grade spread + tenor premium + FX premium, printed on the passport.",
    },
    {
      title: "A receivable that settles as a token",
      body: "The approved receivable becomes a permissioned ERC-3643 RWA with escrow, maturity and investor yield.",
    },
  ],
  footnote:
    "Two of the three applicants are approved conditionally, at a fraction of their request. The engine does not approve what the evidence does not support.",
  nextLink: { href: "/en/market", label: "Next: live market data" },
};

export const proofEn: ProofCopy = {
  index: "04",
  kicker: "Proof · live data and build record",
  title: "Live where it is live. Labelled where it is not.",
  sub: "Market context comes from public APIs on the server. Credit numbers come from a deterministic engine. The applicants are constructed for the demo and marked as such.",
  liveLabel: "LIVE",
  metricLabels: ["STABLECOIN FLOAT", "USD/KRW", "RWA CONTEXT", "BENCHMARK"],
  eventsLabel: "SIMULATED RUNS · not real issuance or funding",
  events: [
    "Credit passport issued",
    "Export receivable tokenized",
    "LP tranche matched",
    "Underwriting run",
    "Underwriting run",
    "Market snapshot refreshed",
  ],
  crewLabel: "THE CREW",
  crew: [
    { name: "SCOUT", role: "evidence collection", status: "IDLE" },
    { name: "VERIFIER", role: "cross-check", status: "IDLE" },
    { name: "UNDERWRITER", role: "credit decision", status: "ON CALL" },
    { name: "BROKER", role: "liquidity matching", status: "IDLE" },
  ],
  decisions: { approved: "Approved", conditional: "Conditional", declined: "Declined" },
  links: {
    market: { href: "/en/market", label: "Market data" },
    agents: { href: "/en/agents", label: "Agent crew" },
  },
  notes: [
    "RWA market size depends on the aggregator: RWA.xyz $38.6B, Token Terminal $46.2B, CoinGecko $76.9B on adjacent dates. RAIL publishes the source next to the number and does not blend the estimates.",
    "All external data is fetched server-side with a timeout, a 30-minute cache and a labelled fallback. If a feed fails, the page says so.",
  ],
};

export const closingEn: ClosingCopy = {
  kicker: "Nitro Seoul 2 · Seoul · 2026",
  title: "Credit begins where the bank's file ends.",
  serif: "credit settles.",
  sub: "RAIL is applying to Nitro Seoul 2 to turn this demo into a production evidence layer for Korean export credit.",
  primary: { href: "/en/underwrite", label: "Run the demo" },
  secondary: { href: "/en/agents", label: "Read the build log" },
  contact: {
    label: "Diligence and partnership:",
    href: "https://github.com/Insia88/rail-rwa/issues",
  },
};

/** EN version of the 3-step demo path strip. */
export const demoPathEn: DemoPathCopy = {
  kicker: "3-minute demo",
  title: "Read it in this order",
  items: [
    {
      n: "①",
      title: "Read the case",
      detail: "Why a five-person exporter was declined — and what RAIL read instead.",
      time: "15s",
      href: "#case",
    },
    {
      n: "②",
      title: "Run the underwriting",
      detail: "Pick an applicant and run the agents: a verdict in 2.4 seconds.",
      time: "60s",
      href: "#run",
    },
    {
      n: "③",
      title: "Open the passport",
      detail: "Read the grade, limit, APR and conditions behind the decision.",
      time: "60s",
      href: "#passport",
    },
  ],
};
