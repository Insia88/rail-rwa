/**
 * RAIL — shared domain types
 * Everything in this file is consumed by both the underwriting engine and the UI.
 */

export type ApplicantType = "exporter" | "freelancer" | "deeptech";

export type Provenance = "onchain" | "platform" | "document" | "self_reported";

export type Severity = "low" | "medium" | "high";

export type Grade = "A" | "B+" | "B" | "C+" | "C" | "D";

export type Decision = "approved" | "conditional" | "declined";

export interface EvidenceItem {
  id: string;
  label: string;
  detail: string;
  provenance: Provenance;
  verified: boolean;
  /** KRW amount covered by the evidence, when applicable */
  valueKrw?: number;
  /** months of history the evidence covers */
  coverageMonths?: number;
  source: string;
  /** ISO date the evidence was observed / attested */
  observedAt: string;
  /** 0–100: how much an underwriter can lean on this item */
  trust: number;
}

export interface Counterparty {
  name: string;
  country: string;
  /** share of trailing-90d verified inflow, 0–1 */
  share: number;
  paidVia: string;
  walletAgeDays: number;
  txCount: number;
}

export interface Profile {
  id: string;
  name: string;
  company: string;
  type: ApplicantType;
  tagline: string;
  location: string;
  foundedYear: number;
  employees: number;
  /** requested facility */
  requestedKrw: number;
  tenorDays: number;
  purpose: string;
  bankOutcome: string;
  /** trailing 6 months of inflow, oldest first, KRW */
  monthlyInflowKrw: number[];
  /** share of each month's inflow that is independently attributable (0–1) */
  verifiedShareByMonth: number[];
  topCustomerShare: number;
  customers: Counterparty[];
  payoutMix: { usdcPct: number; usdWirePct: number; krwPct: number };
  platform?: { name: string; rating: number; payoutHistoryMonths: number };
  patents?: number;
  grantsKrw?: number;
  ipRoyaltyKrw?: number;
  disputes: number;
  latePayments: number;
  evidence: EvidenceItem[];
  /** short narrative lines shown on the passport */
  story: string[];
  /** three sentences the applicant would say in an interview */
  applicantQuote: string;
  /** hard, evidence-based decline rule (e.g. duplicate pledge) — demo fixture */
  hardDecline?: { code: string; label: string; detail: string };
}

export interface ScoreComponent {
  key: string;
  label: string;
  score: number;
  max: number;
  detail: string;
}

export interface RiskFlag {
  code: string;
  label: string;
  severity: Severity;
  detail: string;
  evidenceIds: string[];
  mitigation: string;
}

export interface AgentStep {
  key: string;
  agent: string;
  role: string;
  /** sentence describing what the agent concluded */
  summary: string;
  logs: string[];
  durationMs: number;
}

export interface FundingInvestor {
  alias: string;
  type: string;
  amountKrw: number;
  region: string;
}

export interface FundingPlan {
  receivableId: string;
  faceValueKrw: number;
  discountRate: number;
  investorYield: number;
  fundedPct: number;
  investors: FundingInvestor[];
  chain: string;
  tokenStandard: string;
  pool: string;
  maturityDate: string;
  escrow: string;
}

export interface UnderwritingResult {
  profileId: string;
  passportId: string;
  issuedAt: string;
  applicantName: string;
  company: string;
  type: ApplicantType;

  score: number;
  grade: Grade;
  decision: Decision;
  decisionNote: string;

  requestedKrw: number;
  limitKrw: number;
  tenorDays: number;

  benchmarkApr: number;
  benchmarkLabel: string;
  spreadPct: number;
  apr: number;
  /** face value actually proposed after limit/request reconciliation */
  faceValueKrw: number;
  discountKrw: number;
  feeKrw: number;
  netProceedsKrw: number;

  evidenceCoverage: number;
  components: ScoreComponent[];
  flags: RiskFlag[];
  covenants: string[];
  evidence: EvidenceItem[];
  agents: AgentStep[];
  funding: FundingPlan;

  /** market reference used at decision time */
  market: {
    usdKrw: number;
    stablecoinMcapUsd: number;
    benchmarkApr: number;
    benchmarkSource: string;
    asOf: string;
  };
}

export interface StablecoinLine {
  symbol: string;
  name: string;
  mcapUsd: number;
  sharePct: number;
  change30dPct: number | null;
}

export interface OnKoreaMarket {
  coin: string;
  label: string;
  markPx: number;
  oraclePx: number;
  /** hourly funding rate (raw, e.g. -0.0002) */
  funding: number;
  dayVolumeUsd: number;
}

export interface OnKoreaSnapshot {
  dex: string;
  asOf: string;
  dayVolumeUsd: number;
  markets: OnKoreaMarket[];
  status: "live" | "fallback";
}

export interface MarketSnapshot {
  asOf: string;
  usdKrw: number;
  fxDate: string;
  fxSource: string;
  stablecoinMcapUsd: number;
  stablecoinChange30dPct: number | null;
  stablecoins: StablecoinLine[];
  rwa: {
    /** tokenized treasuries, CoinGecko category (2026-10-22) */
    tokenizedTreasuryUsd: number;
    /** tokenized private credit — direct comp for credit RAIL */
    tokenizedPrivateCreditUsd: number;
    /** broad RWA category, CoinGecko (2026-10-22) */
    rwaTotalUsd: number;
    asOf: string;
    source: string;
  };
  onkorea: OnKoreaSnapshot;
  benchmark: {
    apr: number;
    label: string;
    source: string;
    asOf: string;
  };
  status: {
    stablecoins: "live" | "fallback";
    fx: "live" | "fallback";
  };
}

export interface WeatherSignal {
  horizon: "지금" | "3개월" | "12개월";
  title: string;
  body: string;
  direction: "up" | "down" | "flat";
}
