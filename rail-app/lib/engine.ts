/**
 * RAIL underwriting engine — deterministic, explainable, reproducible.
 *
 * Every number in a Credit Passport is derived from a profile's evidence with a
 * documented weight. The same input always produces the same passport, which is
 * what makes the artifact auditable (and demo-safe: no hidden model calls).
 *
 * Production note: in the real product this engine is a deterministic core that an
 * agent crew orchestrates and narrates; LLMs never get to invent the numbers.
 */

import { getProfile, PROFILE_MAP, profileIndex } from "./profiles";
import type {
  AgentStep,
  Decision,
  EvidenceItem,
  FundingInvestor,
  FundingPlan,
  Grade,
  Profile,
  RiskFlag,
  ScoreComponent,
  UnderwritingResult,
} from "./types";

export interface EngineContext {
  benchmarkApr: number;
  benchmarkLabel: string;
  benchmarkSource: string;
  usdKrw: number;
  stablecoinMcapUsd: number;
  asOf: string;
}

export const DEFAULT_CONTEXT: EngineContext = {
  benchmarkApr: 4.15,
  benchmarkLabel: "토큰화 단기국채 수익률",
  benchmarkSource: "Ondo OUSG · BlackRock BUIDL 근사 (2026-10 리서치 스냅샷)",
  usdKrw: 1_325.57,
  stablecoinMcapUsd: 315_000_000_000,
  asOf: "2026-10-22",
};

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const round = (v: number, digits = 0) => {
  const f = 10 ** digits;
  return Math.round(v * f) / f;
};
const pct = (v: number, digits = 1) => `${round(v * 100, digits)}%`;

function mean(xs: number[]) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}
function stdev(xs: number[]) {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
}
function sum(xs: number[]) {
  return xs.reduce((a, b) => a + b, 0);
}

const GRADE_SPREAD: Record<Grade, number> = {
  A: 2.1,
  "B+": 3.0,
  B: 3.8,
  "C+": 4.9,
  C: 6.2,
  D: 7.8,
};

const GRADE_ORDER: Grade[] = ["A", "B+", "B", "C+", "C", "D"];

function gradeFromScore(score: number): Grade {
  if (score >= 85) return "A";
  if (score >= 78) return "B+";
  if (score >= 70) return "B";
  if (score >= 62) return "C+";
  if (score >= 52) return "C";
  return "D";
}

/** Never let an unproven commercial profile borrow above its evidence tier. */
function capGrade(grade: Grade, maxGrade: Grade): Grade {
  return GRADE_ORDER.indexOf(grade) < GRADE_ORDER.indexOf(maxGrade) ? maxGrade : grade;
}

/** "3억원" / "4,700만원" — used inside generated Korean sentences. */
function wonPhrase(n: number): string {
  if (n >= 100_000_000) {
    const eok = n / 100_000_000;
    return `${eok >= 10 ? Math.round(eok) : eok.toFixed(1).replace(/\.0$/, "")}억원`;
  }
  return `${Math.round(n / 10_000).toLocaleString("ko-KR")}만원`;
}

function yearsSince(foundedYear: number) {
  return Math.max(0, 2026 - foundedYear);
}

function customerQuality(p: Profile): number {
  if (p.type === "freelancer" && p.platform) {
    const rating = clamp(p.platform.rating / 5);
    const history = clamp(p.platform.payoutHistoryMonths / 36);
    return clamp(0.55 * rating + 0.45 * history);
  }
  if (p.type === "deeptech") {
    // No paying counterparties yet — LOI quality only.
    return 0.42;
  }
  const countries = new Set(p.customers.map((c) => c.country));
  const diversity = clamp(countries.size / 3);
  const perCustomer = p.customers.map((c) => {
    const age = clamp(c.walletAgeDays / 365);
    const tx = clamp(c.txCount / 60);
    const geo = c.country === "대한민국" ? 0.6 : 1;
    return clamp(0.35 * age + 0.35 * tx + 0.3 * geo);
  });
  const weighted = p.customers.reduce(
    (acc, c, i) => acc + c.share * perCustomer[i],
    0,
  );
  return clamp(0.8 * weighted + 0.2 * diversity);
}

function ipStrength(p: Profile): number {
  const patents = clamp((p.patents ?? 0) / 40);
  const grants = clamp((p.grantsKrw ?? 0) / 500_000_000);
  const loi = p.evidence.some((e) => e.id.includes("loi")) ? 1 : 0;
  return clamp(0.5 * patents + 0.25 * grants + 0.25 * loi);
}

function buildComponents(p: Profile, coverage: number, stability: number, concentration: number, fxRisk: number, track: number): ScoreComponent[] {
  const tenure = clamp(yearsSince(p.foundedYear) / 3);
  const cp = customerQuality(p);

  if (p.type === "deeptech") {
    const commercial = p.monthlyInflowKrw.some((m) => m > 0) ? 0.15 : 0;
    return [
      {
        key: "evidence",
        label: "증빙 커버리지",
        max: 20,
        score: round(20 * (0.25 + 0.75 * coverage ** 0.9), 1),
        detail: `검증 가능한 유입 비중 ${pct(coverage)}. 특허·과제·시험성적서는 확인됨, 매출 증빙은 없음.`,
      },
      {
        key: "ip",
        label: "IP 강도",
        max: 24,
        score: round(24 * ipStrength(p), 1),
        detail: `등록 특허 ${p.patents ?? 0}건, 정부 과제비 ${round((p.grantsKrw ?? 0) / 1e8, 1)}억원, 구매의향서 1건.`,
      },
      {
        key: "grant",
        label: "과제 신뢰도",
        max: 14,
        score: round(14 * clamp(0.7 * clamp((p.grantsKrw ?? 0) / 500_000_000) + 0.3), 1),
        detail: "국가R&D 협약·중간평가 A등급 확인. 정부 지급 이력은 18개월.",
      },
      {
        key: "team",
        label: "팀 이력",
        max: 10,
        score: round(10 * clamp(0.9), 1),
        detail: "대표 광섬유 센서 12년·전 ETRI, CTO 공정기술 9년.",
      },
      {
        key: "milestone",
        label: "마일스톤 명확성",
        max: 16,
        score: round(16 * 0.6, 1),
        detail: "LOI 구속력·납기 조건 미확정. 파일럿 라인 견적은 확보.",
      },
      {
        key: "revenue",
        label: "상업적 검증",
        max: 10,
        score: round(10 * commercial, 1),
        detail: p.monthlyInflowKrw.some((m) => m > 0)
          ? "정부과제 수입 외 매출 없음."
          : "매출 0원. 첫 납품 전 단계.",
      },
      {
        key: "track",
        label: "거래 이력",
        max: 6,
        score: round(6 * track, 1),
        detail: "연체·분쟁 이력 없음.",
      },
    ];
  }

  if (p.type === "freelancer") {
    return [
      {
        key: "evidence",
        label: "증빙 커버리지",
        max: 30,
        score: round(30 * (0.25 + 0.75 * coverage ** 0.9), 1),
        detail: `플랫폼 정산 원장으로 검증된 유입 ${pct(coverage)}. 원천징수 영수증은 없음.`,
      },
      {
        key: "stability",
        label: "현금흐름 안정성",
        max: 18,
        score: round(18 * stability, 1),
        detail: `6개월 월평균 ${Math.round(mean(p.monthlyInflowKrw) / 1e4)}만원, 변동계수 ${round(stdev(p.monthlyInflowKrw) / Math.max(1, mean(p.monthlyInflowKrw)) * 100, 1)}%.`,
      },
      {
        key: "concentration",
        label: "수익원 집중도",
        max: 10,
        score: round(10 * 0.3, 1),
        detail: `플랫폼 의존도 ${pct(p.topCustomerShare)}. 플랫폼 자체 신용도는 높지만 단일 채널 리스크.`,
      },
      {
        key: "counterparty",
        label: "거래처 신용도",
        max: 16,
        score: round(16 * cp, 1),
        detail: `플랫폼 평점 ${p.platform?.rating ?? "-"}/5, 정산 이력 ${p.platform?.payoutHistoryMonths ?? 0}개월, 완료율 99.2%.`,
      },
      {
        key: "tenure",
        label: "업력",
        max: 10,
        score: round(10 * tenure, 1),
        detail: `사업 ${yearsSince(p.foundedYear)}년차.`,
      },
      {
        key: "fx",
        label: "통화·환리스크",
        max: 8,
        score: round(8 * (1 - fxRisk), 1),
        detail: `달러 결제 비중 ${p.payoutMix.usdcPct + p.payoutMix.usdWirePct}%, 환헤지 없음.`,
      },
      {
        key: "track",
        label: "거래 이력",
        max: 8,
        score: round(8 * track, 1),
        detail: `연체 ${p.latePayments}건, 분쟁 ${p.disputes}건.`,
      },
    ];
  }

  // exporter (default)
  return [
    {
      key: "evidence",
      label: "증빙 커버리지",
      max: 30,
      score: round(30 * (0.25 + 0.75 * coverage ** 0.9), 1),
      detail: `온체인·은행·수출신고 교차검증 유입 ${pct(coverage)}. 은행은 이 증빙을 신용으로 읽지 않음.`,
    },
    {
      key: "stability",
      label: "현금흐름 안정성",
      max: 20,
      score: round(20 * stability, 1),
      detail: `6개월 월평균 ${Math.round(mean(p.monthlyInflowKrw) / 1e4)}만원, 변동계수 ${round(stdev(p.monthlyInflowKrw) / Math.max(1, mean(p.monthlyInflowKrw)) * 100, 1)}%.`,
    },
    {
      key: "concentration",
      label: "바이어 집중도",
      max: 16,
      score: round(16 * concentration, 1),
      detail: `상위 바이어 비중 ${pct(p.topCustomerShare)}. 25% 초과분에 대해 선형 감점.`,
    },
    {
      key: "counterparty",
      label: "바이어 신용도",
      max: 12,
      score: round(12 * cp, 1),
      detail: `지갑 연령·거래횟수·국가 분산 기준 가중 평균 ${pct(cp)}.`,
    },
    {
      key: "tenure",
      label: "업력",
      max: 8,
      score: round(8 * tenure, 1),
      detail: `설립 ${p.foundedYear}년 (${yearsSince(p.foundedYear)}년차).`,
    },
    {
      key: "fx",
      label: "통화·환리스크",
      max: 8,
      score: round(8 * (1 - fxRisk), 1),
      detail: `달러 결제 비중 ${p.payoutMix.usdcPct + p.payoutMix.usdWirePct}%, 환헤지 미체결.`,
    },
    {
      key: "track",
      label: "거래 이력",
      max: 6,
      score: round(6 * track, 1),
      detail: `연체 ${p.latePayments}건(9일), 분쟁 ${p.disputes}건.`,
    },
  ];
}

function buildFlags(p: Profile, coverage: number, fxRisk: number): RiskFlag[] {
  const flags: RiskFlag[] = [];
  const ev = (idPart: string) => p.evidence.filter((e) => e.id.includes(idPart)).map((e) => e.id);

  if (p.topCustomerShare > 0.55 && p.type === "exporter") {
    flags.push({
      code: "CUST_CONC",
      label: "상위 바이어 집중",
      severity: "high",
      detail: `상위 거래처가 검증 매출의 ${pct(p.topCustomerShare)}를 차지합니다. 해당 바이어 이탈 시 상환 재원이 급감합니다.`,
      evidenceIds: ev("hb-01"),
      mitigation: "상위 바이어 매출 비중을 6개월 내 50% 이하로 낮추는 조건을 부과합니다.",
    });
  }
  if (fxRisk >= 0.6) {
    flags.push({
      code: "FX_MISMATCH",
      label: "환리스크 미헤지",
      severity: "medium",
      detail: `결제 통화의 ${p.payoutMix.usdcPct + p.payoutMix.usdWirePct}%가 달러·스테이블코인이고 환헤지 계약이 없습니다.`,
      evidenceIds: ev("hb-03").concat(ev("kd-01")),
      mitigation: "90일 선물환 헤지 또는 원화 전환 정산 계좌 지정을 조건으로 부과합니다.",
    });
  }
  if (coverage < 0.7) {
    flags.push({
      code: "THIN_FILE",
      label: "검증 커버리지 부족",
      severity: "medium",
      detail: `매출 중 ${pct(1 - coverage)}는 자기신고/문서에만 의존합니다. 신용 결정에는 검증분만 반영했습니다.`,
      evidenceIds: ev("self").concat(p.evidence.filter((e) => !e.verified).map((e) => e.id)),
      mitigation: "미검증 매출 비중을 20% 이하로 축소하면 금리 재산정.",
    });
  }
  if (p.latePayments > 0) {
    flags.push({
      code: "LATE_PAY",
      label: "과거 지연 결제",
      severity: "low",
      detail: `바이어 지연 결제 ${p.latePayments}건(최장 9일). 상환 능력에 구조적 영향은 제한적입니다.`,
      evidenceIds: ev("hb-03"),
      mitigation: "DSO 45일 이하 관리 조건.",
    });
  }
  if (p.type === "freelancer" && p.topCustomerShare > 0.8) {
    flags.push({
      code: "PLATFORM_DEP",
      label: "플랫폼 의존",
      severity: "high",
      detail: `수입의 ${pct(p.topCustomerShare)}가 단일 플랫폼 정산에 의존합니다. 정산 정책 변경 시 현금흐름이 즉시 영향을 받습니다.`,
      evidenceIds: ev("kd-01"),
      mitigation: "정산 API 읽기 권한 유지, 12개월 내 제2 수익원 확보 조건.",
    });
  }
  if (p.type === "deeptech") {
    flags.push({
      code: "PREREVENUE",
      label: "매출 0원",
      severity: "high",
      detail: "상업적 매출이 아직 발생하지 않았습니다. 상환 재원은 LOI 전환과 후속 투자에 의존합니다.",
      evidenceIds: p.evidence.filter((e) => e.verified).map((e) => e.id),
      mitigation: "LOI 구속력 전환 및 파일럿 라인 완료를 마일스톤으로 분할 집행.",
    });
    flags.push({
      code: "IP_VALUATION",
      label: "IP 가치평가 불확실",
      severity: "medium",
      detail: "특허 가치평가는 시장성 가정에 민감합니다. 담보 처분 경로가 검증되지 않았습니다.",
      evidenceIds: ev("fl-06"),
      mitigation: "특허 3건 질권 설정 및 제3자 가치평가 재확인.",
    });
    flags.push({
      code: "LOI_UNBOUND",
      label: "구매의향서 비구속",
      severity: "medium",
      detail: "연 12억원 LOI는 구속력이 없고 구매 조건이 미확정입니다.",
      evidenceIds: ev("fl-03"),
      mitigation: "본계약 체결 전까지 한도를 3개월 단위로 재검토.",
    });
  }
  if (p.type === "freelancer") {
    flags.push({
      code: "NO_WITHHOLDING",
      label: "소득 증빙 단절",
      severity: "medium",
      detail: "근로소득 원천징수 영수증이 없어 금융권 신용평가 체계에서 소득이 '존재하지 않는' 상태입니다.",
      evidenceIds: ev("kd-03"),
      mitigation: "플랫폼 정산 원장 + 세금계산서 조합을 소득 증빙으로 대체 인정.",
    });
  }
  return flags;
}

function buildCovenants(p: Profile, flags: RiskFlag[], coverage: number): string[] {
  const base = [
    "자금 용도 증빙(발주서·매입세금계산서) 제출",
    "월별 정산 리포트 열람 및 온체인 입금 증빙 공유",
    "상환 전 정산 지갑 잔액 우선 변제(에스크로 화이트리스트)",
  ];
  const byCode: Record<string, string> = {
    CUST_CONC: "상위 바이어 매출 비중 6개월 내 50% 이하로 축소",
    FX_MISMATCH: "USD/KRW 90일 선물환 헤지 또는 원화 전환 정산 계좌 지정",
    THIN_FILE: "미검증 매출 비중 20% 이하 유지, 초과 시 한도 재산정",
    LATE_PAY: "바이어 DSO 45일 이하 관리",
    PLATFORM_DEP: "플랫폼 정산 API 읽기 권한 유지, 12개월 내 제2 수익원 확보",
    PREREVENUE: "파일럿 라인 완료·LOI 본계약 전환 마일스톤별 분할 집행",
    IP_VALUATION: "특허 3건 질권 설정 및 반기별 가치평가 갱신",
    LOI_UNBOUND: "본계약 체결 전 3개월 단위 재심사",
    NO_WITHHOLDING: "플랫폼 정산 원장 + 세금계산서 조합 증빙 유지",
  };
  for (const f of flags) {
    const c = byCode[f.code];
    if (c) base.push(c);
  }
  if (coverage < 0.55) base.push("미검증 항목 보완 시 금리 인하 재산정");
  return Array.from(new Set(base));
}

function buildAgents(p: Profile, coverage: number, result: UnderwritingResult): AgentStep[] {
  const verified3 = mean(p.monthlyInflowKrw.slice(-3).map((v, i) => v * p.verifiedShareByMonth[p.verifiedShareByMonth.length - 3 + i]));
  const base = profileIndex(p.id) * 170 + 640;
  return [
    {
      key: "scout",
      agent: "SCOUT",
      role: "증거 수집",
      summary: `지갑·플랫폼·수출신고·세금계산서에서 증거 ${p.evidence.length}건을 수집했습니다.`,
      logs: [
        p.type === "exporter"
          ? "정산 지갑 0x8f…c21 스캔 → USDC 입금 87건"
          : p.type === "freelancer"
            ? "플랫폼 OAuth 연결 → 정산 원장 38개월 조회"
            : "특허청 KIPRIS 조회 → 등록 특허 32건",
        p.type === "deeptech" ? "국가R&D 협약 2건 · KTL 성적서 수집" : "구매주문서 3건 OCR → 발주처·금액·납기 추출",
        "증빙 원본 해시 기록 · 관찰 시각 기록",
      ],
      durationMs: base,
    },
    {
      key: "verifier",
      agent: "VERIFIER",
      role: "교차검증",
      summary: `자기신고 대비 검증 커버리지 ${pct(coverage)}. 중복·상충 증빙을 제거했습니다.`,
      logs: [
        `검증 유입 ${pct(coverage)} · 미검증 ${pct(1 - coverage)}`,
        `상위 바이어 지갑 연령 ${p.customers[0]?.walletAgeDays ?? 0}일 / ${p.customers[0]?.txCount ?? 0} tx`,
        "바이어명·금액·납기 3중 대조 완료",
      ],
      durationMs: base + 210,
    },
    {
      key: "underwriter",
      agent: "UNDERWRITER",
      role: "신용 판정",
      summary: `점수 ${result.score} / 등급 ${result.grade}. 제안 금리 ${result.apr}%.`,
      logs: [
        `컴포넌트 ${result.components.length}개 가중 합산 → ${result.score}점`,
        `벤치마크 ${result.benchmarkApr}% + 스프레드 ${result.spreadPct}%p → ${result.apr}%`,
        `검증 3개월 평균 ${Math.round(verified3 / 1e4)}만원 × 1.34 → 한도 ${Math.round(result.limitKrw / 1e4)}만원`,
      ],
      durationMs: base + 360,
    },
    {
      key: "broker",
      agent: "BROKER",
      role: "유동성 매칭",
      summary: `수출채권 ${result.funding.receivableId} 발행 · 풀 매칭 ${result.funding.fundedPct}%.`,
      logs: [
        `RAIL Export Credit Pool I 잔여 유동성 확인`,
        `${result.funding.chain} · ${result.funding.tokenStandard} 발행 준비`,
        `만기 ${result.funding.maturityDate} · 투자자 수익률 ${result.funding.investorYield}%`,
      ],
      durationMs: base + 480,
    },
  ];
}

function addDays(dateIso: string, days: number) {
  const d = new Date(`${dateIso}T00:00:00+09:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function fundingInvestors(p: Profile, fundedPct: number, face: number): FundingInvestor[] {
  if (fundedPct <= 0) return [];
  const total = Math.round((face * fundedPct) / 100 / 1_000_000) * 1_000_000;
  const splits =
    p.type === "exporter"
      ? [
          { alias: "LP-01", type: "싱가포르 패밀리오피스", region: "SG", w: 0.46 },
          { alias: "LP-02", type: "스테이블코인 수익 볼트", region: "GLOBAL", w: 0.34 },
          { alias: "LP-03", type: "국내 신용펀드", region: "KR", w: 0.2 },
        ]
      : [
          { alias: "LP-01", type: "크립토 네이티브 펀드", region: "GLOBAL", w: 0.5 },
          { alias: "LP-02", type: "개인 LP (온체인)", region: "KR", w: 0.3 },
          { alias: "LP-03", type: "수익 볼트", region: "GLOBAL", w: 0.2 },
        ];
  return splits.map((s) => ({
    alias: s.alias,
    type: s.type,
    region: s.region,
    amountKrw: Math.round((total * s.w) / 1_000_000) * 1_000_000,
  }));
}

export function underwrite(profile: Profile, ctx: EngineContext = DEFAULT_CONTEXT): UnderwritingResult {
  const p = profile;
  const months = p.monthlyInflowKrw.length;
  const verifiedMonthly = p.monthlyInflowKrw.map((v, i) => v * (p.verifiedShareByMonth[i] ?? 0));
  const totalInflow = sum(p.monthlyInflowKrw);
  const totalVerified = sum(verifiedMonthly);
  const coverage = totalInflow > 0 ? totalVerified / totalInflow : 0;

  const avg = mean(p.monthlyInflowKrw);
  const cv = avg > 0 ? stdev(p.monthlyInflowKrw) / avg : 1;
  const stability = clamp(1 - cv / 1.2);
  const top = p.topCustomerShare;
  const concentration = clamp(1 - Math.max(0, top - 0.25) / 0.55);

  const usdShare = (p.payoutMix.usdcPct + p.payoutMix.usdWirePct) / 100;
  const fxRisk = usdShare >= 0.6 ? 0.7 : usdShare >= 0.3 ? 0.3 : 0.08;
  const track = clamp(1 - p.latePayments * 0.12 - p.disputes * 0.25);

  const components = buildComponents(p, coverage, stability, concentration, fxRisk, track);
  const score = round(components.reduce((a, c) => a + c.score, 0), 1);

  let grade = gradeFromScore(score);
  const hasRevenue = p.monthlyInflowKrw.some((m) => m > 0);
  // Pre-commercial IP bridge: even a high evidence score cannot exceed C+ until
  // there is recurring commercial revenue (grant income is not repayment capacity).
  if (p.type === "deeptech") grade = capGrade(grade, "C+");
  if (p.type === "exporter" && coverage < 0.5) grade = capGrade(grade, "C");

  const tenorPremium = round(Math.max(0, p.tenorDays - 90) / 365 * 1.5, 2);
  const fxPremium = fxRisk >= 0.6 ? 0.6 : 0;
  const spreadPct = GRADE_SPREAD[grade];
  const apr = round(ctx.benchmarkApr + spreadPct + tenorPremium + fxPremium, 2);

  // limit: verified trailing-3-month average, scaled by score, capped by request.
  const last3 = p.monthlyInflowKrw.slice(-3);
  const last3VerifiedAvg = mean(
    last3.map((v, i) => v * (p.verifiedShareByMonth[p.verifiedShareByMonth.length - 3 + i] ?? 0)),
  );
  const scale = 1.0 + 0.7 * (score / 100);
  let limitBase = last3VerifiedAvg * scale;
  if (p.type === "deeptech") limitBase = Math.min(limitBase, 60_000_000);
  let limitKrw = Math.floor(Math.min(p.requestedKrw, limitBase) / 1_000_000) * 1_000_000;
  if (p.type === "deeptech") limitKrw = Math.floor(Math.min(limitKrw, 60_000_000) / 1_000_000) * 1_000_000;

  let decision: Decision;
  if (score >= 70 && limitKrw >= p.requestedKrw * 0.95) {
    decision = "approved";
  } else if (score >= 52 && limitKrw > 0) {
    decision = "conditional";
    limitKrw = Math.floor((limitKrw * 0.9) / 1_000_000) * 1_000_000;
  } else {
    decision = "declined";
    limitKrw = 0;
  }
  if (p.type === "deeptech" && decision === "approved") decision = "conditional";
  if (p.hardDecline) {
    decision = "declined";
    limitKrw = 0;
  }

  const faceValueKrw = limitKrw;
  const discountKrw = Math.round((faceValueKrw * apr) / 100 * (p.tenorDays / 365));
  const feeKrw = Math.round(faceValueKrw * 0.005);
  const netProceedsKrw = faceValueKrw - discountKrw - feeKrw;

  const flags = buildFlags(p, coverage, fxRisk);
  if (p.hardDecline) {
    flags.unshift({
      code: p.hardDecline.code,
      label: p.hardDecline.label,
      severity: "high",
      detail: p.hardDecline.detail,
      evidenceIds: p.evidence.filter((e) => e.label.includes("중복")).map((e) => e.id),
      mitigation: "기존 담보 해지 또는 펀더 간 우선순위 확인 후 재심사",
    });
  }
  const covenants = buildCovenants(p, flags, coverage);

  const idx = profileIndex(p.id) + 1;
  const passportId = `RAIL-P-2026-${String(idx).padStart(4, "0")}`;
  const receivableId = `RAIL-R-2026-${String(idx).padStart(4, "0")}`;
  const fundedPct = p.hardDecline ? 0 : p.type === "exporter" ? 62 : 0;

  const decisionNote =
    decision === "approved"
      ? `검증된 3개월 수출대금 월평균 ${wonPhrase(last3VerifiedAvg)}을 상환 재원으로 인정해 요청액 전액을 승인했습니다. 담보 대신 6개월 온체인 정산 이력과 수출신고를 근거로 사용했습니다.`
      : decision === "conditional"
        ? `점수 ${score}점·등급 ${grade}. 요청 ${wonPhrase(p.requestedKrw)} 중 ${wonPhrase(limitKrw)}을 조건부 승인했습니다. 아래 조건을 충족하면 다음 랩에서 한도와 금리를 재산정합니다.`
        : p.hardDecline
          ? `${p.hardDecline.detail} 사유 코드 ${p.hardDecline.code}. 중복 담보 해소 전에는 재심사하지 않습니다.`
          : `현재 증빙으로는 상환 재원을 검증할 수 없어 승인하지 않았습니다. 3개월 내 검증 가능한 현금흐름이 쌓이면 재심사합니다.`;

  const maturityDate = addDays(ctx.asOf, p.tenorDays);
  const funding: FundingPlan = {
    receivableId,
    faceValueKrw,
    discountRate: apr,
    investorYield: round(apr + 0.4, 2),
    fundedPct,
    investors: fundingInvestors(p, fundedPct, faceValueKrw),
    chain: "Base",
    tokenStandard: "ERC-3643 (permissioned RWA)",
    pool:
      p.type === "exporter"
        ? "RAIL Export Credit Pool I"
        : p.type === "freelancer"
          ? "RAIL Creator Income Pool"
          : "RAIL IP Bridge Pool",
    maturityDate,
    escrow: "온체인 에스크로 0x71… · 정산 지갑 화이트리스트",
  };

  const result: UnderwritingResult = {
    profileId: p.id,
    passportId,
    issuedAt: ctx.asOf,
    applicantName: p.name,
    company: p.company,
    type: p.type,
    score,
    grade,
    decision,
    decisionNote,
    requestedKrw: p.requestedKrw,
    limitKrw,
    tenorDays: p.tenorDays,
    benchmarkApr: ctx.benchmarkApr,
    benchmarkLabel: ctx.benchmarkLabel,
    spreadPct,
    apr,
    faceValueKrw,
    discountKrw,
    feeKrw,
    netProceedsKrw,
    evidenceCoverage: round(coverage, 4),
    components,
    flags,
    covenants,
    evidence: p.evidence,
    agents: [],
    funding,
    market: {
      usdKrw: ctx.usdKrw,
      stablecoinMcapUsd: ctx.stablecoinMcapUsd,
      benchmarkApr: ctx.benchmarkApr,
      benchmarkSource: ctx.benchmarkSource,
      asOf: ctx.asOf,
    },
  };
  result.agents = buildAgents(p, coverage, result);
  return result;
}

export function underwriteById(id: string, ctx: EngineContext = DEFAULT_CONTEXT): UnderwritingResult | null {
  const p = getProfile(id);
  if (!p) return null;
  return underwrite(p, ctx);
}

export const ALL_RESULTS = (ctx: EngineContext = DEFAULT_CONTEXT) =>
  Object.values(PROFILE_MAP).map((p) => underwrite(p, ctx));
