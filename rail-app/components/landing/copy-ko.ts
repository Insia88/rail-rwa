import type {
  CaseFileCopy,
  ClosingCopy,
  DemoPathCopy,
  HeroCopy,
  LiveUnderwriterCopy,
  PassportRwaCopy,
  ProofCopy,
} from "./v4-types";

/** Korean copy for the v4 6-act landing. */
export const heroKo: HeroCopy = {
  eyebrow: "RWA Credit Rail · Seoul · 2026",
  lines: [{ text: "매출은 있는데," }, { text: "신용이 없습니다.", emphasis: "없습니다." }],
  body: "수출대금·정산 이력·특허를 온체인 증거로 검증해, 담보 없는 기업의 신용 여권을 만듭니다.",
  specLine: "90일 수출채권 팩토링 · 건당 3,000만–3억원 · 수수료 1.5–3% · 심사 4분",
  primary: { href: "/underwrite/hanbit", label: "한빛전자 3분 심사" },
  secondary: { href: "/RAIL-onepager.pdf", label: "1페이지 요약", external: true },
  ctaNote: "가입 없음 · 지원자 3인 · 라이브 시장",
  card: {
    kicker: "Underwriting verdict",
    bankLabel: "Bank result",
    bankValue: "국민 · 하나 · 부산은행",
    rejected: "3 REJECTED",
    railLabel: "RAIL verdict",
    decision: "승인",
    grade: "GRADE",
    limit: "APPROVED LIMIT",
    apr: "APR · 90D",
    coverage: "verified",
    coverageLabel: "검증 커버리지",
    meta: "부산 · 수출 중소기업 · 5인",
    stamp: "Verified",
    ready: "RWA-READY",
  },
};

export const caseFileKo: CaseFileCopy = {
  index: "01",
  kicker: "Case file",
  title: "부산 5인 수출기업, 은행 3곳에서 거절.",
  sub: "한빛전자. 매출은 달러로 들어오지만, 담보도 업력도 원화 재무제표도 없습니다.",
  bankLabel: "은행 심사 결과",
  bankValue:
    "국민·하나·부산은행 3곳 거절 — 부동산 담보 없음, 업력 2년, 원화 재무제표와 달러 매출의 불일치",
  facts: [
    { value: "3곳", label: "은행 거절" },
    { value: "0원", label: "부동산 담보" },
    { value: "{limit}", label: "승인 한도" },
  ],
  whyNow: [
    { label: "STO 법제화", value: "2026-01-15 국회 통과 · 2027.1 시행(잠정)" },
    { label: "스테이블코인 유동성", value: "$305B · USDC 정산 채널 확장" },
    { label: "24/7 온체인 시장", value: "코스피200·현대차·SK하이닉스가 24시간 거래" },
  ],
  steps: [
    {
      tag: "01",
      title: "증거를 읽습니다",
      detail: "수출신고·USDC 정산·구매주문서 등 {evidenceCount}건. 검증 커버리지 {coverage}.",
    },
    {
      tag: "02",
      title: "신용을 판정합니다",
      detail: "등급 {grade} · 한도 {limit} · APR {apr} · 리스크 플래그 {flags}건.",
    },
    {
      tag: "03",
      title: "RWA로 발행합니다",
      detail: "{receivableId} · {chain} · {tokenStandard} · LP {funded} 매칭.",
    },
  ],
  runCta: { href: "#run", label: "심사를 직접 해보세요" },
};

export const liveUnderwriterKo: LiveUnderwriterCopy = {
  index: "02",
  kicker: "Live underwriter",
  title: "세 명을 직접 심사해 보세요.",
  sub: "지원자를 고르고 심사를 실행하면, 네 에이전트가 같은 규칙으로 판정합니다. 페이지를 떠나지 않습니다.",
  typeLabels: {
    exporter: "수출 중소기업",
    freelancer: "프리랜서",
    deeptech: "딥테크",
  },
  decisions: { approved: "승인", conditional: "조건부 승인", declined: "거절" },
  run: "심사 실행",
  running: "심사 중",
  again: "다시 심사",
  profileLink: "여권 전체 보기",
  idle: "심사를 실행하면 SCOUT → VERIFIER → UNDERWRITER → BROKER 순서로 판정이 진행됩니다.",
  verdict: "Verdict",
  bankBadge: "BANK-REJECTED APPLICANTS",
  score: "CREDIT SCORE",
  grade: "GRADE",
  limit: "LIMIT",
  apr: "APR",
  flags: "RISK FLAGS",
  coverage: "검증 커버리지",
  agents: "Agent console",
  logs: "evidence → verdict",
  readingHint: "여권 읽는 법 — 등급 → 한도 → APR → 리스크 플래그 순서로 읽습니다.",
};

export const passportRwaKo: PassportRwaCopy = {
  index: "03",
  kicker: "Passport × RWA",
  title: "여권이 발행되고, 채권이 유동성이 됩니다.",
  sub: "승인된 수출채권은 ERC-3643 수익권이 되어 스테이블코인 LP와 만납니다.",
  reelLabel: "세 명의 여권, 같은 레일.",
  dragLabel: "Drag · Auto 5.6s",
  railLabel: "THE RWA RAIL",
  steps: [
    { title: "신용 여권", body: "점수·한도·금리를 발급" },
    { title: "토큰 발행", body: "ERC-3643 권리로 발행" },
    { title: "LP 모집", body: "USDC 유동성이 매입" },
    { title: "만기 정산", body: "에스크로 상환" },
    { title: "다음 신용", body: "상환이 증거가 됨" },
  ],
  nextLink: { href: "/market", label: "다음: 라이브 시장 보기" },
};

export const proofKo: ProofCopy = {
  index: "04",
  kicker: "Proof of rail",
  title: "지금 이 레일 위에서 벌어지는 일.",
  sub: "시장 스냅샷, 원장, 크루까지. 모두 같은 엔진과 같은 날짜에서 나옵니다.",
  liveLabel: "LIVE",
  metricLabels: ["스테이블코인", "USD/KRW", "벤치마크", "RWA"],
  eventsLabel: "SIMULATED RUNS · 실제 발행/펀딩 아님",
  events: [
    "신용 여권 발급",
    "수출채권 RWA 발행",
    "LP 트랜치 매칭",
    "심사 런",
    "심사 런",
    "시장 데이터 갱신",
  ],
  crewLabel: "THE CREW",
  crew: [
    { name: "SCOUT", role: "증거 수집", status: "IDLE" },
    { name: "VERIFIER", role: "교차검증", status: "IDLE" },
    { name: "UNDERWRITER", role: "신용 판정", status: "ON CALL" },
    { name: "BROKER", role: "유동성 매칭", status: "IDLE" },
  ],
  decisions: { approved: "승인", conditional: "조건부 승인", declined: "거절" },
  links: {
    market: { href: "/market", label: "시장 데이터" },
    agents: { href: "/agents", label: "에이전트 팀" },
  },
};

export const closingKo: ClosingCopy = {
  kicker: "Fin · Seoul 2026",
  title: "담보가 아니라 흐름을 담보로.",
  serif: "credit settles.",
  sub: "다음 랩의 신용은, 이미 흐르고 있는 매출에서 시작됩니다.",
  primary: { href: "/underwrite", label: "데모 시작" },
  secondary: { href: "/RAIL-onepager.pdf", label: "Nitro 지원 패키지", external: true },
};

/** 3-step demo path — the first thing a first-time visitor should follow. */
export const demoPathKo: DemoPathCopy = {
  kicker: "3분 데모",
  title: "이 순서로 보면 됩니다",
  items: [
    {
      n: "①",
      title: "사례 읽기",
      detail: "부산 5인 수출기업이 왜 거절됐고, RAIL은 무엇을 읽었는지.",
      time: "15초",
      href: "#case",
    },
    {
      n: "②",
      title: "직접 심사",
      detail: "지원자를 골라 심사를 실행하면 네 에이전트가 약 5초 만에 판정합니다.",
      time: "60초",
      href: "#run",
    },
    {
      n: "③",
      title: "여권 확인",
      detail: "발급된 여권의 등급·한도·APR·조건을 직접 읽어보세요.",
      time: "60초",
      href: "#passport",
    },
  ],
};
