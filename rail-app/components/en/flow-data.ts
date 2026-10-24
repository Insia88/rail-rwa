import type {
  AgentStep,
  ApplicantType,
  Decision,
  EvidenceItem,
  FundingInvestor,
  Profile,
  RiskFlag,
  ScoreComponent,
  Severity,
  UnderwritingResult,
} from "@/lib/types";

/**
 * EN presentation layer for the demo routes.
 *
 * Credit numbers are never authored here: `localizeResult()` only swaps
 * engine/profile strings for English and recomputes the same derived figures
 * from the same inputs. The one fixture-level translation table is
 * `EVIDENCE_EN`, keyed by evidence id (sanctioned by docs/en-ui-copy.md §6).
 */

const clean = (value: number, digits = 1): string =>
  value.toFixed(digits).replace(/\.0+$/, "");

export const pctF = (value: number): string => `${clean(value)}%`;

export function dateEn(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split("-");
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** 180,000,000 → "KRW 180M" · 2,460,000,000 → "KRW 2.46B" · 9,000 → "KRW 9K" */
export function krwEn(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  if (abs >= 1e9) return `${sign}KRW ${abs / 1e9 >= 100 ? Math.round(abs / 1e9) : clean(abs / 1e9, 2)}B`;
  if (abs >= 1e6) return `${sign}KRW ${abs / 1e6 >= 100 ? Math.round(abs / 1e6) : clean(abs / 1e6, 2)}M`;
  if (abs >= 1e3) return `${sign}KRW ${Math.round(abs / 1e3)}K`;
  return `${sign}KRW ${Math.round(abs)}`;
}

/** 180,000,000 → "KRW 180,000,000" */
export function krwFullEn(n: number): string {
  return `KRW ${Math.round(n).toLocaleString("en-US")}`;
}

export function ppEn(n: number): string {
  return `${n.toFixed(2)}pp`;
}

export function daysEn(n: number): string {
  return `${n} day${n === 1 ? "" : "s"}`;
}

export const TYPE_LABEL_EN: Record<ApplicantType, string> = {
  exporter: "Export SME",
  freelancer: "Freelancer / sole proprietor",
  deeptech: "Deeptech / IP holder",
};

export const DECISION_LABEL_EN: Record<Decision, string> = {
  approved: "Approved",
  conditional: "Conditional",
  declined: "Declined",
};

export const SEVERITY_LABEL_EN: Record<Severity, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

/* ── profile narratives (docs/en-ui-copy.md §6) ───────────────────── */

type ProfileNarrative = {
  name: string;
  company: string;
  tagline: string;
  location: string;
  purpose: string;
  bankOutcome: string;
  applicantQuote: string;
  story: string[];
};

const PROFILE_EN: Record<string, ProfileNarrative> = {
  hanbit: {
    name: "Hanbit Electronics",
    company: "Hanbit Electronics Co., Ltd.",
    tagline:
      "A five-person appliance exporter in Busan. Revenue arrives in dollars; the account looks empty.",
    location: "Sasang-gu, Busan",
    purpose:
      "Fund raw-material purchases and three months of production for an additional order from a Vietnamese buyer.",
    bankOutcome:
      "Rejected by KB Kookmin, Hana and Busan Bank — no real-estate collateral, two years of operating history, and USD revenue that does not reconcile to a KRW financial statement.",
    applicantQuote:
      "Being told I have revenue but no credit is the part that stings. Can't I just show you the money coming in?",
    story: [
      "The bank asked for the apartment. We don't own one. Our Vietnamese buyer sends dollars every month, but in the bank's paperwork that money never appears as export revenue.",
      "The shipments leave every month. The money arrives. To take the next order we have to buy materials first, and we don't have the three months of working capital to carry it.",
      "RAIL didn't look at the account balance. It looked at six months of incoming payments.",
    ],
  },
  kimfreelance: {
    name: "Kim Do-hyun",
    company: "Freelance developer · Kim Do-hyun",
    tagline: "A developer earning KRW 6.6M a month. Not a single withholding receipt.",
    location: "Mapo-gu, Seoul",
    purpose:
      "Working capital for equipment replacement and a six-month gap, matched to global platform payout cycles.",
    bankOutcome:
      "Rejected by Shinhan and KakaoBank — no employment withholding receipts; in his third year of business income with a broken income-evidence trail.",
    applicantQuote:
      "I don't lack credit. My credit just doesn't exist in the bank's form.",
    story: [
      "KRW 6.6M arrives every month. I've been paid by the same platform for 38 months. The bank declined the loan because I don't have a withholding receipt.",
      "The income exists. It just doesn't have a document that fits the bank's folder.",
      "Platform ledgers and on-chain payouts can't be edited. RAIL reconciled the two.",
    ],
  },
  fiberlogic: {
    name: "FiberLogic",
    company: "FiberLogic Co., Ltd.",
    tagline: "A fiber-optic sensor startup with 32 patents. Revenue is still zero; one LOI.",
    location: "Yuseong-gu, Daejeon",
    purpose:
      "Build the pilot line — bridge capital before volume production, against an LOI from a mid-sized Korean manufacturer.",
    bankOutcome:
      "Rejected by KIBO and its banks — zero revenue, no collateral. The IP exists, but there is no underwriting model or track record for pricing it as collateral.",
    applicantQuote:
      "I'm not borrowing money. I want to buy time with value as the collateral.",
    story: [
      "We hold 32 patents and KRW 420M in government grants. Revenue is still zero. No bank has ever taken a patent as collateral.",
      "We have a purchase intent. With a production line, the first revenue follows. The KRW 300M to build that line is what's missing.",
      "Instead of a revenue ledger, RAIL read patent registrations, grant evaluations and test reports. It tied funding to milestones, not to cash on hand.",
    ],
  },
  sejong: {
    name: "Sejong Trading",
    company: "Sejong Trading Co., Ltd.",
    tagline:
      "Export filings exist, but the same invoice was already pledged to another funder as collateral.",
    location: "Namdong-gu, Incheon",
    purpose:
      "Refinance an existing factoring loan — attempting to re-pledge the same export receivable.",
    bankOutcome:
      "Rejected by two banks — prior pledge to a factoring company; the banks asked for a duplicate-collateral check.",
    applicantQuote:
      "I didn't know it had already been paid out somewhere else. I'd like to know if there is a way.",
    story: [
      "The export declarations and invoices are real. But the same receivable has already been funded elsewhere.",
      "RAIL's VERIFIER matched the collateral ledgers and found the duplicate. The evidence is not thin — the same evidence cannot be used twice.",
      "This applicant was declined. A decline is part of a credit rail, too.",
    ],
  },
};

export function localizeProfile(profile: Profile): Profile {
  const en = PROFILE_EN[profile.id];
  if (!en) return profile;
  return {
    ...profile,
    name: en.name,
    company: en.company,
    tagline: en.tagline,
    location: en.location,
    purpose: en.purpose,
    bankOutcome: en.bankOutcome,
    applicantQuote: en.applicantQuote,
    story: en.story,
  };
}

/* ── evidence fixtures (keyed by evidence id) ─────────────────────── */

type EvidenceEn = { label: string; detail: string; source: string };

const EVIDENCE_EN: Record<string, EvidenceEn> = {
  "ev-hb-01": {
    label: "USDC settlement receipts (87)",
    detail:
      "Vina Home and Sinar Jaya buyer wallets → Hanbit settlement wallet on Base. Six-month total: KRW 354M equivalent.",
    source: "Base RPC · settlement wallet 0x8f…c21",
  },
  "ev-hb-02": {
    label: "Export purchase orders (3)",
    detail:
      "Original buyer POs. Buyer, quantity, delivery date and payment terms cross-checked.",
    source: "Buyer-stamped PO · OCR + buyer email match",
  },
  "ev-hb-03": {
    label: "USD wire deposits",
    detail:
      "14 deposits into the foreign-currency account at IBK. Buyer names and PO amounts match.",
    source: "Bank statement (reconciled to VAT invoices)",
  },
  "ev-hb-04": {
    label: "Logistics and shipping evidence",
    detail:
      "Six bills of lading and customs export declarations confirm when revenue was recognised.",
    source: "Korea Customs export declaration · forwarder B/L",
  },
  "ev-hb-05": {
    label: "VAT return revenue",
    detail:
      "2025 annual revenue KRW 2.46B. Export revenue is zero-rated in the KRW ledger and cannot be used as collateral.",
    source: "National Tax Service VAT filing",
  },
  "ev-hb-06": {
    label: "Buyer credit profile",
    detail:
      "Vina Home: nine years operating, two local bank accounts, no missed payments on public record.",
    source: "Public credit database",
  },
  "ev-hb-07": {
    label: "Self-reported revenue forecast",
    detail:
      "Q4 2026 average of KRW 310M per month expected. Unverified founder estimate.",
    source: "Founder interview · financial projection",
  },
  "ev-kd-01": {
    label: "Platform payout API, 38 months",
    detail:
      "Monthly payouts, FX and fees from the platform ledger. Six-month verified revenue KRW 40.8M.",
    source: "Platform OAuth payout API (read-only)",
  },
  "ev-kd-02": {
    label: "On-chain payouts received (30)",
    detail:
      "30 USDC payouts from platform to personal wallet. Amounts and timestamps match the platform ledger.",
    source: "Base RPC · wallet 0x2b…91d",
  },
  "ev-kd-03": {
    label: "Business income tax filings, 3 years",
    detail:
      "2023–2025 business income filed. Pre-expense income does not match bank underwriting forms.",
    source: "National Tax Service · income tax return",
  },
  "ev-kd-04": {
    label: "Direct-contract invoices (8)",
    detail: "Eight invoices with a Korean agency. Zero late payments.",
    source: "e-Tax invoice (National Tax Service)",
  },
  "ev-kd-05": {
    label: "Platform reputation and completion",
    detail: "99.2% completion, 71% repeat contracts, 4.9/5 rating. No disputes.",
    source: "Public platform profile metrics",
  },
  "ev-kd-06": {
    label: "Income scenario",
    detail:
      "Assumes an 8% monthly income drop if platform fees rise. Estimate, not verified.",
    source: "Self-authored scenario",
  },
  "ev-fl-01": {
    label: "32 registered patents",
    detail:
      "32 fiber-optic distributed sensor and signal-processing patents (Korea 21, US 7, PCT 4). All registered.",
    source: "KIPRIS · USPTO",
  },
  "ev-fl-02": {
    label: "Two government R&D grants",
    detail:
      "Two Ministry of Trade, Industry and Energy materials grants. KRW 420M, interim grade A.",
    source: "National R&D Information System · grant agreements",
  },
  "ev-fl-03": {
    label: "LOI from a Korean mid-size manufacturer",
    detail:
      "Letter of intent for KRW 1.2B annual purchases. Non-binding; purchase terms not fixed.",
    source: "LOI scan (counterparty signature)",
  },
  "ev-fl-04": {
    label: "Pilot performance test report",
    detail: "KTL test report — ±0.3% measurement precision, meets target spec.",
    source: "Korea Testing Laboratory",
  },
  "ev-fl-05": {
    label: "Founding team track record",
    detail:
      "CEO: 12 years in fiber-optic sensors, former ETRI senior researcher. CTO: 9 years in semiconductor equipment process engineering.",
    source: "Public career record · supporting documents",
  },
  "ev-fl-06": {
    label: "Third-party IP valuation",
    detail:
      "Third-party valuation of KRW 1.28B for three patents. Sensitive to market assumptions.",
    source: "Valuation report (summary)",
  },
  "ev-fl-07": {
    label: "Production readiness",
    detail: "Pilot line quote KRW 290M. Certification and production schedule not fixed.",
    source: "Self-authored business plan",
  },
  "ev-sj-01": {
    label: "Export declarations (6)",
    detail:
      "Six export declarations to the same buyer. Declaration and invoice numbers checked.",
    source: "Korea Customs Service export declarations",
  },
  "ev-sj-02": {
    label: "Duplicate invoice pledge record",
    detail:
      "The same export declaration number appears in factoring company A's collateral ledger. Found by VERIFIER's duplicate cross-check.",
    source: "Factoring collateral ledger comparison",
  },
  "ev-sj-03": {
    label: "USDC settlements (39)",
    detail:
      "Thirty-nine direct-to-wallet USDC settlements from the buyer. Amounts match the export declaration; the duplicate pledge is a separate issue.",
    source: "Base RPC · wallet 0x9c…4e2",
  },
  "ev-sj-04": {
    label: "Platform settlement ledger",
    detail:
      "Access to the settlement platform API was denied; the last four months of ledger could not be verified.",
    source: "Platform API access denied",
  },
  "ev-sj-05": {
    label: "Revenue projection scenario",
    detail: "Self-authored six-month revenue projection. No third-party verification.",
    source: "Self-authored",
  },
};

function localizeEvidence(item: EvidenceItem): EvidenceItem {
  const en = EVIDENCE_EN[item.id];
  if (!en) return item;
  return { ...item, label: en.label, detail: en.detail, source: en.source };
}

/* ── score components ─────────────────────────────────────────────── */

const mean = (xs: number[]): number => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const stdev = (xs: number[]): number => {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
};

const COMPONENT_LABELS: Record<ApplicantType, Record<string, string>> = {
  exporter: {
    evidence: "Evidence coverage",
    stability: "Cash-flow stability",
    concentration: "Buyer concentration",
    counterparty: "Buyer quality",
    tenure: "Operating history",
    fx: "Currency & FX risk",
    track: "Track record",
  },
  freelancer: {
    evidence: "Evidence coverage",
    stability: "Cash-flow stability",
    concentration: "Revenue concentration",
    counterparty: "Counterparty quality",
    tenure: "Operating history",
    fx: "Currency & FX risk",
    track: "Track record",
  },
  deeptech: {
    evidence: "Evidence coverage",
    ip: "IP strength",
    grant: "Grant credibility",
    team: "Team track record",
    milestone: "Milestone clarity",
    revenue: "Commercial validation",
    track: "Track record",
  },
};

function localizeComponent(
  component: ScoreComponent,
  result: UnderwritingResult,
  profile: Profile,
): ScoreComponent {
  const type = profile.type;
  const label = COMPONENT_LABELS[type]?.[component.key] ?? component.label;
  const coverage = result.evidenceCoverage;
  const inflow = profile.monthlyInflowKrw;
  const avg = mean(inflow);
  const cv = avg > 0 ? (stdev(inflow) / avg) * 100 : 0;
  const year = Number(result.market.asOf.slice(0, 4)) || 2026;
  const years = Math.max(0, year - profile.foundedYear);
  const usdShare = profile.payoutMix.usdcPct + profile.payoutMix.usdWirePct;
  const lastPct = (value: string): string => value.match(/(\d+(?:\.\d+)?)%/g)?.slice(-1)[0] ?? "—";

  let detail = component.detail;
  if (type === "exporter") {
    if (component.key === "evidence")
      detail = `Cross-verified inflow (on-chain, bank, customs): ${pctF(coverage * 100)}. Banks do not read this as credit.`;
    else if (component.key === "stability")
      detail = `Six-month average ${krwEn(avg)}, coefficient of variation ${clean(cv)}%.`;
    else if (component.key === "concentration")
      detail = `Top buyer share ${pctF(profile.topCustomerShare * 100)}. Linear penalty above 25%.`;
    else if (component.key === "counterparty")
      detail = `Weighted average ${lastPct(component.detail)} across wallet age, transaction count and country mix.`;
    else if (component.key === "tenure")
      detail = `Founded ${profile.foundedYear} (${years} year${years === 1 ? "" : "s"} in operation).`;
    else if (component.key === "fx")
      detail = `USD-linked settlement ${pctF(usdShare)}; no FX hedge in place.`;
    else if (component.key === "track")
      detail = `Late payments ${profile.latePayments} (9 days), disputes ${profile.disputes}.`;
  } else if (type === "freelancer") {
    if (component.key === "evidence")
      detail = `Inflow verified through the platform payout ledger: ${pctF(coverage * 100)}. No withholding statement.`;
    else if (component.key === "stability")
      detail = `Six-month average ${krwEn(avg)}, coefficient of variation ${clean(cv)}%.`;
    else if (component.key === "concentration")
      detail = `Platform dependence ${pctF(profile.topCustomerShare * 100)}. Strong platform credit quality, single-channel risk.`;
    else if (component.key === "counterparty")
      detail = `Platform rating ${profile.platform?.rating ?? "-"}/5, payout history ${profile.platform?.payoutHistoryMonths ?? 0} months, 99.2% completion.`;
    else if (component.key === "tenure") detail = `Year ${years} in business.`;
    else if (component.key === "fx")
      detail = `USD settlement share ${pctF(usdShare)}; no FX hedge.`;
    else if (component.key === "track")
      detail = `Late payments ${profile.latePayments}, disputes ${profile.disputes}.`;
  } else {
    if (component.key === "evidence")
      detail = `Verified inflow share ${pctF(coverage * 100)}. Patents, grants and test reports confirmed; no revenue evidence.`;
    else if (component.key === "ip")
      detail = `${profile.patents ?? 0} registered patents, ${krwEn(profile.grantsKrw ?? 0)} government grants, one purchase LOI.`;
    else if (component.key === "grant")
      detail =
        "National R&D agreement and grade-A interim review confirmed. 18 months of government payouts.";
    else if (component.key === "team")
      detail = "CEO: 12 years in fiber-optic sensors, ex-ETRI. CTO: 9 years in process engineering.";
    else if (component.key === "milestone")
      detail = "LOI is non-binding; delivery terms not fixed. Pilot line quote secured.";
    else if (component.key === "revenue")
      detail = profile.monthlyInflowKrw.some((value) => value > 0)
        ? "No revenue beyond government grants."
        : "Zero revenue. Pre-first-delivery.";
    else if (component.key === "track") detail = "No late payments or disputes.";
  }
  return { ...component, label, detail };
}

/* ── risk flags ───────────────────────────────────────────────────── */

const FLAG_LABELS_EN: Record<string, string> = {
  CUST_CONC: "Top-buyer concentration",
  FX_MISMATCH: "Unhedged FX exposure",
  THIN_FILE: "Thin verified coverage",
  LATE_PAY: "Past late payment",
  PLATFORM_DEP: "Platform dependence",
  PREREVENUE: "Zero revenue",
  IP_VALUATION: "IP valuation uncertainty",
  LOI_UNBOUND: "Non-binding LOI",
  NO_WITHHOLDING: "Broken income evidence",
  "E-DUP-PLEDGE": "Duplicate receivable pledge",
};

const FLAG_MITIGATION_EN: Record<string, string> = {
  CUST_CONC: "Covenant to cut top-buyer share to 50% or less within six months.",
  FX_MISMATCH:
    "Covenant: a 90-day forward hedge, or a KRW-settlement account designated for payouts.",
  THIN_FILE: "Re-price the rate once unverified revenue is below 20%.",
  LATE_PAY: "Buyer DSO managed at 45 days or less.",
  PLATFORM_DEP:
    "Keep read access to the payout API; add a second income source within 12 months.",
  PREREVENUE:
    "Milestone-based disbursement: convert the LOI to a binding contract and complete the pilot line.",
  IP_VALUATION: "Pledge three patents; refresh the third-party valuation every six months.",
  LOI_UNBOUND: "Re-underwrite every three months until a binding contract is signed.",
  NO_WITHHOLDING:
    "Accept the platform payout ledger plus tax invoices as substitute income evidence.",
  "E-DUP-PLEDGE":
    "Resolve the existing pledge first; no re-underwriting until the duplicate collateral is released.",
};

function flagDetailEn(
  flag: RiskFlag,
  profile: Profile,
  result: UnderwritingResult,
): string {
  const usdShare = profile.payoutMix.usdcPct + profile.payoutMix.usdWirePct;
  const topShare = profile.topCustomerShare * 100;
  const coverage = result.evidenceCoverage;
  switch (flag.code) {
    case "CUST_CONC":
      return `The top buyer accounts for ${pctF(topShare)} of verified revenue. If that buyer leaves, repayment capacity falls sharply.`;
    case "FX_MISMATCH":
      return `${pctF(usdShare)} of settlement is in USD or stablecoins, with no hedge contract in place.`;
    case "THIN_FILE":
      return `${pctF((1 - coverage) * 100)} of revenue relies on self-reported or document-only evidence. Only verified revenue entered the decision.`;
    case "LATE_PAY":
      return `${profile.latePayments} late buyer payment${profile.latePayments === 1 ? "" : "s"} (max 9 days). Limited structural impact on repayment capacity.`;
    case "PLATFORM_DEP":
      return `${pctF(topShare)} of income depends on a single platform payout. A policy change hits cash flow immediately.`;
    case "PREREVENUE":
      return "No commercial revenue yet. Repayment depends on LOI conversion and follow-on investment.";
    case "IP_VALUATION":
      return "Patent valuation is sensitive to market assumptions. The collateral liquidation path is unverified.";
    case "LOI_UNBOUND": {
      const loi = profile.evidence.find((item) => item.id === "ev-fl-03");
      return `The ${loi?.valueKrw ? krwEn(loi.valueKrw) : "LOI"} LOI is non-binding; purchase terms are not fixed.`;
    }
    case "NO_WITHHOLDING":
      return "No withholding statement, so income does not exist inside the bank credit system.";
    case "E-DUP-PLEDGE":
      return "The same export declaration is already registered as collateral with another funder. The file cannot be approved until the duplicate pledge is released.";
    default:
      return flag.detail;
  }
}

function localizeFlag(
  flag: RiskFlag,
  profile: Profile,
  result: UnderwritingResult,
): RiskFlag {
  return {
    ...flag,
    label: FLAG_LABELS_EN[flag.code] ?? flag.label,
    detail: flagDetailEn(flag, profile, result),
    mitigation: FLAG_MITIGATION_EN[flag.code] ?? flag.mitigation,
  };
}

/* ── covenants (doc §3.7) ─────────────────────────────────────────── */

const COVENANT_EN: Record<string, string> = {
  "자금 용도 증빙(발주서·매입세금계산서) 제출": "Purpose evidence (PO or purchase invoice) submitted",
  "월별 정산 리포트 열람 및 온체인 입금 증빙 공유":
    "Monthly settlement report and on-chain inflow evidence shared",
  "상환 전 정산 지갑 잔액 우선 변제(에스크로 화이트리스트)":
    "Settlement-wallet priority repayment (escrow whitelist)",
  "상위 바이어 매출 비중 6개월 내 50% 이하로 축소":
    "Top-buyer share reduced to 50% or less within six months",
  "USD/KRW 90일 선물환 헤지 또는 원화 전환 정산 계좌 지정":
    "90-day USD/KRW forward hedge, or a KRW-settlement account",
  "미검증 매출 비중 20% 이하 유지, 초과 시 한도 재산정":
    "Unverified revenue kept below 20%; limit re-priced above it",
  "바이어 DSO 45일 이하 관리": "Buyer DSO managed at 45 days or less",
  "플랫폼 정산 API 읽기 권한 유지, 12개월 내 제2 수익원 확보":
    "Read access to the platform payout API maintained; a second income source within 12 months",
  "파일럿 라인 완료·LOI 본계약 전환 마일스톤별 분할 집행":
    "Milestone-based disbursement: pilot line complete, LOI converted to contract",
  "특허 3건 질권 설정 및 반기별 가치평가 갱신":
    "Pledge on three patents; valuation refreshed every six months",
  "본계약 체결 전 3개월 단위 재심사":
    "Re-underwrite every three months until a binding contract",
  "플랫폼 정산 원장 + 세금계산서 조합 증빙 유지":
    "Platform payout ledger plus tax invoices retained as income evidence",
  "미검증 항목 보완 시 금리 인하 재산정":
    "Rate reviewed downward once unverified items are supplied",
};

function localizeCovenant(text: string): string {
  return COVENANT_EN[text] ?? text;
}

/* ── agents ───────────────────────────────────────────────────────── */

const AGENT_ROLE_EN: Record<string, string> = {
  scout: "Evidence collection",
  verifier: "Cross-verification",
  underwriter: "Credit decision",
  broker: "Liquidity matching",
};

function agentsEn(result: UnderwritingResult, profile: Profile): AgentStep[] {
  const inflow = profile.monthlyInflowKrw;
  const shares = profile.verifiedShareByMonth;
  const verified3 = mean(inflow.slice(-3).map((value, i) => value * (shares[shares.length - 3 + i] ?? 0)));
  const coverage = pctF(result.evidenceCoverage * 100);
  const buyer = profile.customers[0];
  const leads = result.components.length;
  const scoutLogs =
    profile.type === "exporter"
      ? [
          "Scanned settlement wallet and customs export declarations",
          "OCR purchase orders → buyer, amount, delivery date",
          "Recorded source hash and observation timestamp",
        ]
      : profile.type === "freelancer"
        ? [
            "Linked platform OAuth → 38 months of payout ledger",
            "OCR 3 purchase orders → buyer, amount, delivery date",
            "Recorded source hash and observation timestamp",
          ]
        : [
            "Queried KIPRIS → 32 registered patents",
            "Collected 2 national R&D agreements and KTL test reports",
            "Recorded source hash and observation timestamp",
          ];
  const durations = result.agents.map((agent) => agent.durationMs);
  return [
    {
      key: "scout",
      agent: "SCOUT",
      role: AGENT_ROLE_EN.scout,
      summary: `Collected ${profile.evidence.length} evidence items from wallets, platforms, customs filings and tax invoices.`,
      logs: scoutLogs,
      durationMs: durations[0] ?? 640,
    },
    {
      key: "verifier",
      agent: "VERIFIER",
      role: AGENT_ROLE_EN.verifier,
      summary: `Verified coverage ${coverage}. Removed duplicate and conflicting evidence.`,
      logs: [
        `Verified inflow ${coverage} · unverified ${pctF((1 - result.evidenceCoverage) * 100)}`,
        `Top buyer wallet age ${buyer?.walletAgeDays ?? 0}d / ${buyer?.txCount ?? 0} tx`,
        "Three-way match complete: buyer, amount, delivery date",
      ],
      durationMs: durations[1] ?? 850,
    },
    {
      key: "underwriter",
      agent: "UNDERWRITER",
      role: AGENT_ROLE_EN.underwriter,
      summary: `Score ${result.score} / grade ${result.grade}. Proposed APR ${result.apr}%.`,
      logs: [
        `${leads} weighted components → ${result.score} points`,
        `Benchmark ${result.benchmarkApr}% + spread ${result.spreadPct}pp → ${result.apr}%`,
        `Verified 3M average ${krwEn(verified3)} × 1.34 → limit ${krwEn(result.limitKrw)}`,
      ],
      durationMs: durations[2] ?? 1000,
    },
    {
      key: "broker",
      agent: "BROKER",
      role: AGENT_ROLE_EN.broker,
      summary:
        result.decision === "declined"
          ? `No facility issued. ${result.funding.receivableId} is not registered in a pool.`
          : `Issued receivable ${result.funding.receivableId} · pool matched ${result.funding.fundedPct}%.`,
      logs:
        result.decision === "declined"
          ? [
              "Decision gate: declined — no issuance prepared",
              `${result.funding.chain} · ${result.funding.tokenStandard} issuance skipped`,
              "No maturity or investor yield — receivable not funded",
            ]
          : [
              "Checked remaining liquidity in RAIL Export Credit Pool I",
              `${result.funding.chain} · ${result.funding.tokenStandard} issuance prepared`,
              `Maturity ${dateEn(result.funding.maturityDate)} · investor yield ${result.funding.investorYield}%`,
            ],
      durationMs: durations[3] ?? 1120,
    },
  ];
}

/* ── decision note ────────────────────────────────────────────────── */

function decisionNoteEn(result: UnderwritingResult, profile: Profile): string {
  const shares = profile.verifiedShareByMonth;
  const last3VerifiedAvg = mean(
    profile.monthlyInflowKrw
      .slice(-3)
      .map((value, i) => value * (shares[shares.length - 3 + i] ?? 0)),
  );
  if (result.decision === "approved") {
    return `Verified three-month export receipts averaged ${krwEn(last3VerifiedAvg)} and were accepted as repayment capacity, so the full requested amount was approved. Six months of on-chain settlement history and customs export declarations replaced collateral.`;
  }
  if (result.decision === "conditional") {
    return `Score ${result.score} · grade ${result.grade}. ${krwEn(result.limitKrw)} of the ${krwEn(profile.requestedKrw)} requested was approved conditionally. Meeting the conditions below re-prices the limit and APR at the next review.`;
  }
  if (profile.hardDecline) {
    return `The same export declaration is already registered as collateral with another funder, so the request was not approved. Reason code ${profile.hardDecline.code}. No re-underwriting until the duplicate collateral is released.`;
  }
  return "Repayment capacity could not be verified from the current evidence, so the request was not approved. Re-review opens once three months of verifiable cash flow accumulates.";
}

/* ── funding / market labels ──────────────────────────────────────── */

const INVESTOR_TYPE_EN: Record<string, string> = {
  "싱가포르 패밀리오피스": "Singapore family office",
  "스테이블코인 수익 볼트": "Stablecoin yield vault",
  "국내 신용펀드": "Korean credit fund",
  "크립토 네이티브 펀드": "Crypto-native fund",
  "개인 LP (온체인)": "Individual LP (on-chain)",
  "수익 볼트": "Yield vault",
};

const ESCROW_EN = "On-chain escrow 0x71… · settlement-wallet whitelist";

const BENCHMARK_LABEL_EN: Record<string, string> = {
  "토큰화 단기국채 수익률": "Tokenized short-term Treasury yield",
};

const BENCHMARK_SOURCE_EN: Record<string, string> = {
  "Ondo OUSG · BlackRock BUIDL 근사 (2026-10 리서치 스냅샷)":
    "Ondo OUSG · BlackRock BUIDL approximation (Oct 2026 research snapshot)",
};

/* ── the single localization entry point ─────────────────────────── */

export function localizeResult(result: UnderwritingResult, profile: Profile): UnderwritingResult {
  const enProfile = localizeProfile(profile);
  return {
    ...result,
    applicantName: enProfile.name,
    company: enProfile.company,
    evidence: result.evidence.map(localizeEvidence),
    components: result.components.map((component) => localizeComponent(component, result, profile)),
    flags: result.flags.map((flag) => localizeFlag(flag, profile, result)),
    covenants: result.covenants.map(localizeCovenant),
    agents: agentsEn(result, profile),
    decisionNote: decisionNoteEn(result, profile),
    funding: {
      ...result.funding,
      investors: result.funding.investors.map(
        (investor: FundingInvestor): FundingInvestor => ({
          ...investor,
          type: INVESTOR_TYPE_EN[investor.type] ?? investor.type,
        }),
      ),
      escrow: ESCROW_EN,
    },
    market: {
      ...result.market,
      benchmarkSource:
        BENCHMARK_SOURCE_EN[result.market.benchmarkSource] ?? result.market.benchmarkSource,
    },
    benchmarkLabel: BENCHMARK_LABEL_EN[result.benchmarkLabel] ?? result.benchmarkLabel,
  };
}
