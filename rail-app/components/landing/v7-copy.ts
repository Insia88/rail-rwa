/** v7 "Quiet Confidence" landing copy — KO + EN share the same 4-act structure. */

export interface V7HeroCopy {
  label: string;
  title1: string;
  title2: string;
  sub: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string; external?: boolean };
  card: {
    kicker: string;
    meta: string;
    decisionLabel: string;
    decision: string;
    gradeLabel: string;
    limitLabel: string;
    aprLabel: string;
    coverageLabel: string;
    footer: string;
  };
}

export interface V7DemoCopy {
  index: string;
  label: string;
  title: string;
  sub: string;
  run: string;
  running: string;
  again: string;
  verdict: string;
  decisions: Record<"approved" | "conditional" | "declined", string>;
  limit: string;
  apr: string;
  evidence: string;
  passportLink: string;
  hint: string;
  agents: string[];
  progress: string;
  disclaimer: string;
}

export interface V7ArtifactCopy {
  index: string;
  label: string;
  title: string;
  sub: string;
  docKicker: string;
  docFooter: string;
  steps: { tag: string; title: string; body: string }[];
  pdfLink: { href: string; label: string; external?: boolean };
}

export interface V7ProofCopy {
  index: string;
  label: string;
  title: string;
  sub: string;
  stats: { value: string; label: string }[];
  faithNote: string;
  links: { nitro: { href: string; label: string }; feedback: { href: string; label: string } };
  ctaTitle: string;
  ctaPrimary: { href: string; label: string };
  ctaSecondary: { href: string; label: string };
}

export const heroV7Ko: V7HeroCopy = {
  label: "수출채권 팩토링 · RWA",
  title1: "은행이 외면한 매출,",
  title2: "신용이 됩니다.",
  sub: "RAIL은 수출 정산·구매주문서·특허를 증거로 읽어 신용 여권을 만들고, 승인된 수출채권을 토큰으로 발행합니다.",
  primary: { href: "/underwrite/hanbit", label: "한빛전자 3분 심사" },
  secondary: { href: "/RAIL-onepager.pdf", label: "1페이지 요약", external: true },
  card: {
    kicker: "Credit Passport",
    meta: "부산 · 수출 중소기업 · 5인",
    decisionLabel: "판정",
    decision: "승인",
    gradeLabel: "등급",
    limitLabel: "승인 한도",
    aprLabel: "금리 · 90일",
    coverageLabel: "증빙 커버리지",
    footer: "규칙 엔진 산출 · 2026.10.22",
  },
};

export const heroV7En: V7HeroCopy = {
  label: "Export receivable factoring · RWA",
  title1: "Revenue the bank ignored,",
  title2: "becomes credit.",
  sub: "RAIL reads settlement receipts, purchase orders and patents as evidence, issues a Credit Passport, and tokenizes the approved export receivable.",
  primary: { href: "/en/underwrite/hanbit", label: "Run the Hanbit underwriting" },
  secondary: { href: "/RAIL-onepager-en.pdf", label: "Read the one-pager", external: true },
  card: {
    kicker: "Credit Passport",
    meta: "Busan · export SME · 5 people",
    decisionLabel: "Decision",
    decision: "Approved",
    gradeLabel: "Grade",
    limitLabel: "Approved limit",
    aprLabel: "APR · 90d",
    coverageLabel: "Evidence coverage",
    footer: "Rule-engine output · 2026-10-22",
  },
};

export const demoV7Ko: V7DemoCopy = {
  index: "01",
  label: "데모",
  title: "3분 안에 직접 확인하세요.",
  sub: "지원자를 고르고 실행하면 네 에이전트가 같은 규칙으로 심사합니다. 페이지를 떠나지 않습니다.",
  run: "심사 실행",
  running: "심사 중",
  again: "다시 심사",
  verdict: "판정",
  decisions: { approved: "승인", conditional: "조건부 승인", declined: "거절" },
  limit: "승인 한도",
  apr: "금리 · 90일",
  evidence: "증빙 커버리지",
  passportLink: "여권 전체 보기",
  hint: "여권에서 근거·점수·약정을 모두 볼 수 있습니다.",
  agents: ["증거 수집", "교차검증", "신용 판정", "유동성 매칭"],
  progress: "진행",
  disclaimer: "지원자와 발행은 데모입니다. 수치는 규칙 엔진이 계산합니다.",
};

export const demoV7En: V7DemoCopy = {
  index: "01",
  label: "Demo",
  title: "See it in three minutes.",
  sub: "Pick an applicant and run the underwriting. Four agents apply the same rules, without leaving this page.",
  run: "Run underwriting",
  running: "Underwriting",
  again: "Run again",
  verdict: "Decision",
  decisions: { approved: "Approved", conditional: "Conditional", declined: "Declined" },
  limit: "Approved limit",
  apr: "APR · 90d",
  evidence: "Evidence coverage",
  passportLink: "Open the passport",
  hint: "The passport holds the evidence, score and covenants.",
  agents: ["Evidence", "Cross-check", "Credit decision", "Liquidity match"],
  progress: "Progress",
  disclaimer: "Applicants and issuances are simulated. Every number is computed by the rule engine.",
};

export const artifactV7Ko: V7ArtifactCopy = {
  index: "02",
  label: "아티팩트",
  title: "여권은 문서이고, 채권은 토큰입니다.",
  sub: "정적 결과물을 그대로 보여드립니다. 발급된 여권 한 장과 RWA 레일 세 단계.",
  docKicker: "Credit Passport",
  docFooter: "규칙 엔진 산출 · 데모",
  steps: [
    {
      tag: "01",
      title: "여권 발급",
      body: "점수·등급·한도·금리·약정을 한 문서에 기록합니다.",
    },
    {
      tag: "02",
      title: "수출채권 토큰화",
      body: "승인된 채권을 ERC-3643 수익권으로 발행합니다.",
    },
    {
      tag: "03",
      title: "LP 정산",
      body: "스테이블코인 LP가 매입하고 만기에 에스크로로 상환합니다.",
    },
  ],
  pdfLink: { href: "/RAIL-onepager.pdf", label: "1페이지 PDF로 보기", external: true },
};

export const artifactV7En: V7ArtifactCopy = {
  index: "02",
  label: "Artifact",
  title: "The passport is a document. The receivable is a token.",
  sub: "A static look at the output: one issued passport and three steps of the RWA rail.",
  docKicker: "Credit Passport",
  docFooter: "Rule-engine output · demo",
  steps: [
    {
      tag: "01",
      title: "Passport issued",
      body: "Score, grade, limit, APR and covenants recorded in one document.",
    },
    {
      tag: "02",
      title: "Receivable tokenized",
      body: "The approved receivable is issued as an ERC-3643 security token.",
    },
    {
      tag: "03",
      title: "LPs settle",
      body: "Stablecoin LPs fund it and escrow repays at maturity.",
    },
  ],
  pdfLink: { href: "/RAIL-onepager-en.pdf", label: "Open the one-page PDF", external: true },
};

export const proofV7Ko: V7ProofCopy = {
  index: "03",
  label: "증거와 마무리",
  title: "숫자로 확인하고, 직접 판단하세요.",
  sub: "은행이 거절한 사례 하나에서 시작했습니다. 시장 데이터는 실시간, 지원자와 발행은 데모로 표시합니다.",
  stats: [
    { value: "3곳", label: "은행이 거절한 사례" },
    { value: "2.4s", label: "에이전트 심사 시간" },
    { value: "4", label: "심사 지원자" },
  ],
  faithNote: "시장 데이터는 실시간, 지원자와 발행은 시뮬레이션입니다. 모든 수치는 규칙 엔진이 계산합니다.",
  links: {
    nitro: { href: "/nitro", label: "For Hashed" },
    feedback: { href: "/feedback", label: "피드백 루프" },
  },
  ctaTitle: "지금 심사해 보세요.",
  ctaPrimary: { href: "/underwrite", label: "데모 시작" },
  ctaSecondary: { href: "/nitro", label: "For Hashed" },
};

export const proofV7En: V7ProofCopy = {
  index: "03",
  label: "Proof",
  title: "Check the numbers. Then judge it yourself.",
  sub: "It started with one exporter three banks declined. Market data is live; applicants and issuances are labelled simulations.",
  stats: [
    { value: "3", label: "banks declined the case" },
    { value: "2.4s", label: "agent underwriting run" },
    { value: "4", label: "demo applicants" },
  ],
  faithNote:
    "Market data is live. Applicants and issuances are simulated. Every number is computed by the rule engine.",
  links: {
    nitro: { href: "/nitro", label: "For Hashed" },
    feedback: { href: "/feedback", label: "Feedback loop" },
  },
  ctaTitle: "Run the underwriting.",
  ctaPrimary: { href: "/underwrite", label: "Start the demo" },
  ctaSecondary: { href: "/nitro", label: "For Hashed" },
};
