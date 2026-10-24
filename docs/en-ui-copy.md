# RAIL — English UI copy (`/en` product demo)

- **Owner:** english-copywriter
- **Status:** copy handoff for the English demo release. Extends `docs/en-landing-copy.md` (tone, terms, notation) into the product routes.
- **Scope:** `/en/underwrite`, `/en/underwrite/[id]`, `/en/passport/[id]`, `/en/market`, `/en/agents` + global demo-path bar + applicant narratives.
- **Rules:** every number stays rendered from `lib/engine.ts` / `lib/profiles.ts` / `lib/market.ts`. This file contains **labels and copy only** — never a hand-typed credit number. Same input, same result. RAIL is a demo; say so where the UI would otherwise imply a live financial service.
- **Notation:** `KRW 180M`, `8.55% APR`, `3.80pp`, `T+0`, `T+1`, `ERC-3643`, `USD/KRW 1,325.57`, ISO dates `2026-10-22`. "Evidence coverage" = verified evidence share. `pp` for percentage points, never `%p` or `bp`.
- **Terminology (fixed):** RAIL · Credit Passport · Applicant desk · Underwriting run · Live verdict · Evidence coverage · Risk flags · Covenants · RWA certificate · Agent signatures · Proof of rail.
- **Do not translate:** agent names `SCOUT / VERIFIER / UNDERWRITER / BROKER`, `RAIL Export Credit Pool I`, `RAIL-R-2026-0001`, `Base`, `USDC`, `ERC-3643`, `HIP-3`, `DeFiLlama`, `Frankfurter`, `Hyperliquid`.
- **KO reference** column is the current Korean string; EN is the shipping string. Where KO is a long paragraph, the key points to the source file instead.

## 0. Global keys (all `/en` product routes)

| key | KO reference | EN |
|---|---|---|
| `common.brand` | RAIL | RAIL |
| `common.locale` | KO | EN |
| `common.demo` | 데모 | Demo |
| `common.demoNotice` | RAIL은 데모입니다. 실제 금융 서비스가 아니며, 온체인 기록은 시뮬레이션입니다. | RAIL is a demo. It is not a financial service; on-chain records are simulated. |
| `common.deterministic` | 같은 입력은 항상 같은 결과를 냅니다. | Same input, same result. |
| `common.deterministicLong` | RAIL의 판단은 규칙 기반 엔진이 계산합니다. | RAIL's decisions are computed by a rule-based engine. |
| `common.simulated` | 시뮬레이션 | Simulated |
| `common.live` | 실시간 | Live |
| `common.snapshot` | 스냅샷 | Snapshot |
| `common.fallback` | 캐시된 값 · API 연결 실패 | Cached value · API unavailable |
| `common.approved` | 승인 | Approved |
| `common.conditional` | 조건부 승인 | Conditional |
| `common.declined` | 거절 | Declined |
| `common.notApproved` | 미승인 | Not approved |
| `common.viewPassport` | 신용 여권 열기 | Open the Credit Passport |
| `common.runAgain` | 다시 심사 | Run again |
| `common.startUnderwriting` | 심사 시작 | Run underwriting |
| `common.otherApplicants` | 다른 지원자 심사 | Check another applicant |
| `common.viewMarket` | 시장 데이터 보기 | View market data |
| `common.viewAgents` | 에이전트 팀 | Agent crew |
| `common.selectApplicant` | 지원자 선택 | Select applicant |
| `common.issued` | 발급 | Issued |
| `common.asOf` | 기준일 | As of |
| `common.maturity` | 만기 | Maturity |
| `common.tenor` | 기간 | Tenor |
| `common.days` | 일 | days |
| `common.requested` | 요청 금액 | Requested amount |
| `common.approvedLimit` | 승인 한도 | Approved limit |
| `common.apr` | 적용 금리 · APR | APR |
| `common.benchmark` | 기준금리 | Benchmark |
| `common.spread` | 스프레드 | Spread |
| `common.score` | 신용 점수 | Credit score |
| `common.grade` | 등급 | Grade |
| `common.coverage` | 증거 커버리지 | Evidence coverage |
| `common.riskFlags` | 리스크 플래그 | Risk flags |
| `common.covenants` | 조건 · 약정 | Covenants |
| `common.verified` | 검증 | Verified |
| `common.unverified` | 미검증 | Unverified |
| `common.total` | 총 | Total |
| `common.items` | 건 | items |
| `common.print` | 인쇄 · PDF | Print · PDF |
| `common.copy` | 복사 | Copy |
| `common.copyLink` | 링크 복사 | Copy link |
| `common.share` | 공유 | Share |
| `common.downloadJson` | JSON 다운로드 | Download JSON |
| `common.downloadJsonShort` | JSON | JSON |
| `common.onePager` | 1페이지 요약 (EN) | One-pager (EN) |
| `common.gitHub` | GitHub 저장소 | GitHub repository |
| `common.contact` | 문의 · GitHub Issues | Contact · GitHub Issues |
| `common.printDemoLine` | RAIL은 데모입니다. 실제 금융 서비스가 아니며, 온체인 기록은 시뮬레이션입니다. | RAIL is a demo. It is not a financial service; on-chain records are simulated. |
| `common.engineCredit` | RAIL Credit Engine · Seoul | RAIL Credit Engine · Seoul |

### 0.1 Demo path bar (new — pinned under the header on all `/en` product routes)

| key | KO reference | EN |
|---|---|---|
| `path.eyebrow` | 데모 경로 | DEMO PATH |
| `path.1.label` | 1 · 지원자 데스크 | 1 · Applicant desk |
| `path.1.note` | 은행 거절 3인 | three bank-rejected applicants |
| `path.2.label` | 2 · 심사 실행 | 2 · Underwriting run |
| `path.2.note` | 에이전트 4 · 결정론 엔진 | four agents · deterministic engine |
| `path.3.label` | 3 · 신용 여권 | 3 · Credit Passport |
| `path.3.note` | 증거 → 판정 → RWA | evidence → verdict → RWA |
| `path.current` | 현재 | Current |
| `path.back` | 이전 | Previous |
| `path.next` | 다음 | Next |
| `path.complete` | 완료 | Complete |

Breadcrumbs: `path.crumbDesk` = `Applicant desk` · `path.crumbRun` = `Underwriting run` · `path.crumbPassport` = `Credit Passport` · `path.crumbMarket` = `Market` · `path.crumbAgents` = `Agent crew`. Separator ` / `, current page in full-opacity cream, ancestors at 40%.

Previous / next labels (bottom of each demo route): `Previous: Applicant desk`, `Next: Credit Passport`, `Back to the run`, `Next applicant`.

## 1. `/en/underwrite` — Applicant desk

Metadata: `meta.title` = `Applicant desk — credit underwriting` · `meta.description` = `Three applicants the banks already declined. Four RAIL agents verify their on-chain evidence and issue a Credit Passport.`

| key | KO reference | EN |
|---|---|---|
| `desk.status` | Applicant desk | Applicant desk |
| `desk.candidates` | {n} candidates · Seoul · 2026 | {n} candidates · Seoul · 2026 |
| `desk.h1a` | 누구의 신용을 | Whose credit |
| `desk.h1b` | 심사할까요? | do we underwrite? |
| `desk.sub` | 세 명의 지원자가 이미 은행에서 거절당했습니다. RAIL이 읽는 것은 서류가 아니라 흐름입니다. | Three applicants the banks already declined. RAIL reads the cash flow, not the paperwork. |
| `desk.agents` | 04 agents | 04 agents |
| `desk.runTime` | ~6s per run | ~6s per run |
| `desk.engine` | deterministic engine | deterministic engine |
| `desk.protocol` | Run protocol | Run protocol |
| `desk.protocolTime` | ~6s | ~6s |
| `desk.protocol.scout` | 증거 수집 | evidence collection |
| `desk.protocol.verifier` | 교차검증 | cross-verification |
| `desk.protocol.underwriter` | 신용 판정 | credit decision |
| `desk.protocol.broker` | 유동성 매칭 | liquidity matching |
| `desk.protocolFoot` | 4 agents · sequential · signed off | 4 agents · sequential · signed off |
| `desk.listLabel` | 지원자 목록 | Applicant list |
| `desk.selectLabel` | Select applicant | Select applicant |
| `desk.rejectedChip` | Bank · rejected | Bank · rejected |
| `desk.card.requested` | Requested | Requested |
| `desk.card.tenor` | Tenor | Tenor |
| `desk.card.monthlyInflow` | Monthly inflow · 6m | Monthly inflow · 6m |
| `desk.card.monthlyAverage` | 월평균 {value} | Monthly avg {value} |
| `desk.card.oldest` | Oldest | Oldest |
| `desk.card.latest` | Latest {value} | Latest {value} |
| `desk.card.bankResult` | Bank_result | Bank result |
| `desk.card.evidence` | Evidence {n} | Evidence {n} |
| `desk.card.verified` | Verified {n} | Verified {n} |
| `desk.card.cta` | 심사 시작 | Run underwriting |
| `desk.provenance.title` | Provenance | Provenance |
| `desk.provenance.sub` | 증거의 출처는 여권에 그대로 남습니다 | Every source stays attached to the passport |
| `desk.legend.onchain` | 온체인 | On-chain |
| `desk.legend.onchainBody` | 지갑·정산 트랜잭션. 조작이 불가능한 가장 강한 증거입니다. | Wallet and settlement transactions. The strongest evidence in the file. |
| `desk.legend.platform` | 플랫폼 원장 | Platform ledger |
| `desk.legend.platformBody` | 읽기 전용 API로 수집한 정산 내역. 수정 불가, 플랫폼 의존도는 따로 기록합니다. | Payout records read from a read-only API. Not editable; platform dependency is recorded separately. |
| `desk.legend.document` | 문서 | Document |
| `desk.legend.documentBody` | 수출신고·세금계산서·계약·성적서 원본. OCR 대조 후 교차검증합니다. | Export declarations, tax invoices, contracts and test reports. OCR-matched, then cross-checked. |
| `desk.legend.self` | 자기신고 | Self-reported |
| `desk.legend.selfBody` | 창업자 진술·추정치. 신용 결정에는 직접 반영하지 않습니다. | Founder statements and estimates. Not counted in the credit decision. |
| `desk.link.examplePassport` | 한빛전자 여권 예시 | Hanbit Electronics passport example |
| `desk.link.market` | RWA 시장 기상도 | RWA market weather |
| `desk.footer` | RAIL / Credit engine — Seoul | RAIL / Credit engine — Seoul |

Applicant card labels carried from `lib/profiles.ts` (see §6): `desk.card.type` = `TYPE_LABEL`, `desk.card.tagline` = `profile.tagline`, `desk.card.bankOutcome` = `profile.bankOutcome`.

## 2. `/en/underwrite/[id]` — Underwriting run

Metadata: `meta.title` = `{company} — underwriting run` · `meta.description` = `{company} — {tagline} Four RAIL agents verify the evidence and issue a Credit Passport.` · not found: `Applicant not found`.

### 2.1 Header and run rail

| key | KO reference | EN |
|---|---|---|
| `run.breadcrumb` | ← Applicant desk | ← Applicant desk |
| `run.id` | RUN_ID · {passportId} | RUN_ID · {passportId} |
| `run.established` | 설립 {year} | Est. {year} |
| `run.requested` | Requested | Requested |
| `run.tenor` | Tenor | Tenor |
| `run.asOf` | As of | As of |
| `run.bankResult` | BANK_RESULT | BANK_RESULT |
| `run.progressLabel` | 심사 진행 {n} / {total} 단계 | Underwriting progress {n} / {total} steps |
| `run.running` | RUNNING | RUNNING |
| `run.complete` | COMPLETE | COMPLETE |
| `run.skip` | 건너뛰고 결과 보기 | Skip to verdict |
| `run.signedOff` | SIGNED OFF | SIGNED OFF |
| `run.terminalTitle` | RAIL // UW-ENGINE | RAIL // UW-ENGINE |
| `run.logLabel` | 에이전트 실행 로그 | Agent run log |
| `run.stream` | 증거 스트림 수신 중… | Receiving evidence stream… |
| `run.engineTime` | ENGINE_TIME {ms} · DETERMINISTIC | ENGINE_TIME {ms} · DETERMINISTIC |
| `run.timecode` | T+{elapsed} / {total} | T+{elapsed} / {total} |
| `run.step.done` | 완료 | DONE |
| `run.step.run` | 실행 | RUN |
| `run.step.wait` | 대기 | WAIT |
| `run.step.ms` | ms | ms |

### 2.2 Ingestion ledger

| key | KO reference | EN |
|---|---|---|
| `ingest.title` | Ingestion · ledger | Ingestion · ledger |
| `ingest.state` | PENDING → MATCHED | PENDING → MATCHED |
| `ingest.pending` | PENDING | PENDING |
| `ingest.matched` | MATCHED | MATCHED |
| `ingest.exception` | EXCEPTION | EXCEPTION |
| `ingest.rows` | {n} rows · {m} matched · {x} exceptions | {n} rows · {m} matched · {x} exceptions |
| `ingest.streaming` | streaming | streaming |
| `ingest.sealed` | sealed | sealed |
| `ingest.buyerWalletAge` | buyer wallet age | buyer wallet age |
| `ingest.poMismatch` | PO amount mismatch | PO amount mismatch |
| `ingest.fxHedge` | FX hedge missing | FX hedge missing |
| `ingest.awaiting` | AWAITING | AWAITING |

### 2.3 Live verdict

| key | KO reference | EN |
|---|---|---|
| `verdict.title` | LIVE VERDICT | LIVE VERDICT |
| `verdict.aria` | 심사 판정 | Underwriting verdict |
| `verdict.sectionCoverage` | 01 · 증거 커버리지 | 01 · Evidence coverage |
| `verdict.sectionFlags` | 02 · 리스크 플래그 | 02 · Risk flags |
| `verdict.sectionScore` | 03 · 신용 점수 | 03 · Credit score |
| `verdict.sectionFinal` | 04 · FINAL DECISION | 04 · FINAL DECISION |
| `verdict.verifiedOf` | 검증 {verified} / {total} | Verified {verified} / {total} |
| `verdict.high` | 높음 {n} | High {n} |
| `verdict.mediumLow` | 중간 {n} · 낮음 {n} | Medium {n} · Low {n} |
| `verdict.components` | {n} components | {n} components |
| `verdict.decision` | DECISION | DECISION |
| `verdict.grade` | GRADE | GRADE |
| `verdict.approvedLimit` | APPROVED LIMIT | APPROVED LIMIT |
| `verdict.apr` | APR | APR |
| `verdict.hint.approved` | 요청액 전액 승인 | Full requested amount approved |
| `verdict.hint.conditional` | 조건 충족 시 재산정 | Limit re-priced when conditions are met |
| `verdict.hint.declined` | 재심사 필요 | Re-underwriting required |
| `verdict.locked` | DECISION LOCKED | DECISION LOCKED |
| `verdict.awaitingSignoff` | {n} AGENTS · AWAITING SIGN-OFF | {n} AGENTS · AWAITING SIGN-OFF |
| `verdict.srComplete` | 심사 완료. {decision}, 등급 {grade}. | Underwriting complete. {decision}, grade {grade}. |
| `verdict.srProgress` | 진행 {done} / {total} 단계. | {done} of {total} steps complete. |
| `verdict.openPassport` | 신용 여권 열기 → | Open the Credit Passport → |
| `verdict.runAgain` | 다시 심사 | Run again |
| `verdict.receivableMeta` | {receivableId} · {chain} · {tokenStandard} | {receivableId} · {chain} · {tokenStandard} |

### 2.4 Deterministic strip (page footer)

| key | KO reference | EN |
|---|---|---|
| `det.kicker` | DETERMINISTIC ENGINE | DETERMINISTIC ENGINE |
| `det.line` | 같은 입력은 항상 같은 결과를 냅니다. RAIL의 판단은 규칙 기반 엔진이 계산합니다. | Same input, same result. Every RAIL decision is computed by a rule-based engine. |
| `det.meta` | {n} WEIGHTS · {date} · USD/KRW {rate} | {n} WEIGHTS · {date} · USD/KRW {rate} |
| `det.passport` | 신용 여권 보기 | Open the Credit Passport |
| `det.other` | 다른 지원자 심사 | Check another applicant |

## 3. `/en/passport/[id]` — Credit Passport

Metadata: `meta.title` = `{company} — Credit Passport` · `meta.description` = `{name}'s RAIL Credit Passport: the score, grade, limit and APR computed from on-chain evidence, plus the export-receivable RWA issuance plan.` · `meta.ogTitle` = `{company} — RAIL Credit Passport` · `meta.ogDescription` = `The bank prices collateral. RAIL prices cash flow. A Credit Passport issued from on-chain evidence, with the receivable RWA certificate.` · not found: `Passport not found`.

### 3.1 Action bar and cover

| key | KO reference | EN |
|---|---|---|
| `passport.copyUrl` | 링크 복사 | Copy link |
| `passport.print` | 인쇄 · PDF | Print · PDF |
| `passport.share` | 공유 | Share |
| `passport.json` | JSON | JSON |
| `passport.shareTitle` | {company} — RAIL 신용 여권 | {company} — RAIL Credit Passport |
| `passport.shareText` | {company}의 RAIL 신용 여권 · 등급 {grade} · 한도 {limit} · APR {apr} | {company}'s RAIL Credit Passport · grade {grade} · limit {limit} · APR {apr} |
| `cover.aria` | 신용 여권 표지 | Credit Passport cover |
| `cover.republic` | Republic of Rail | Republic of Rail |
| `cover.passportNo` | Passport No. | Passport No. |
| `cover.issued` | Issued {date} | Issued {date} |
| `cover.holder` | Holder | Holder |
| `cover.type` | Type | Type |
| `cover.domicile` | Domicile | Domicile |
| `cover.established` | Established | Established |
| `cover.tenor` | Tenor {n} 일 | Tenor {n} days |
| `cover.underwritingScore` | Underwriting score | Underwriting score |
| `cover.decision` | Decision | Decision |
| `cover.approvedLimit` | Approved limit | Approved limit |
| `cover.apr` | APR | APR |
| `cover.evidence` | Evidence | Evidence |
| `cover.settlement` | Settlement | Settlement |
| `cover.verified` | Verified | Verified |
| `cover.facility` | Facility | Facility |
| `cover.stampVerified` | VERIFIED | VERIFIED |
| `cover.stampRwa` | RWA-READY | RWA-READY |
| `cover.stampSigned` | AGENT SIGNED | AGENT SIGNED |

### 3.2 The nine sections (section titles + kickers)

| key | KO reference | EN |
|---|---|---|
| `sec.01.title` | 심사 요약 | Underwriting summary |
| `sec.01.kicker` | Underwriting summary | Underwriting summary |
| `sec.02.title` | 증거 테이블 | Evidence table |
| `sec.02.kicker` | Evidence · provenance | Evidence · provenance |
| `sec.03.title` | 점수 컴포넌트 | Score components |
| `sec.03.kicker` | Score components | Score components |
| `sec.04.title` | 리스크 플래그 | Risk flags |
| `sec.04.kicker` | Risk flags · mitigation | Risk flags · mitigation |
| `sec.05.title` | 조건 · 약정 | Covenants |
| `sec.05.kicker` | Covenants | Covenants |
| `sec.06.title` | 가격 산식 | Pricing |
| `sec.06.kicker` | Pricing · settlement | Pricing · settlement |
| `sec.07.title` | RWA 증서 | RWA certificate |
| `sec.07.kicker` | Receivable · tokenized | Receivable · tokenized |
| `sec.08.title` | 에이전트 서명 | Agent signatures |
| `sec.08.kicker` | Agent signatures | Agent signatures |
| `sec.09.title` | 출처 · 링크 | Sources & links |
| `sec.09.kicker` | Sources | Sources |

### 3.3 Section 01 — settlement terms

| key | KO reference | EN |
|---|---|---|
| `summary.issued` | 발급 {date} | Issued {date} |
| `summary.requested` | 요청 금액 | Requested amount |
| `summary.approvedLimit` | 승인 한도 | Approved limit |
| `summary.tenor` | 기간 | Tenor |
| `summary.maturity` | 만기 {date} | Matures {date} |
| `summary.apr` | 적용 금리 · APR | Interest rate · APR |
| `summary.aprSub` | 기준 {benchmark} + 스프레드 {spread} | Benchmark {benchmark} + spread {spread} |
| `summary.market` | 시장 기준 | Market reference |
| `summary.marketSub` | {benchmarkLabel} {apr} · {date} | {benchmarkLabel} {apr} · {date} |
| `summary.coverage` | 증거 커버리지 | Evidence coverage |
| `summary.coverageSub` | 검증 {verified} / {total}건 | Verified {verified} / {total} items |
| `summary.bankResult` | Bank_result | Bank result |

### 3.4 Section 02 — evidence table

| key | KO reference | EN |
|---|---|---|
| `evidence.total` | 총 {n}건 | Total {n} items |
| `evidence.verified` | 검증 {n}건 | Verified {n} |
| `evidence.unverified` | 미검증 {n}건 | Unverified {n} |
| `evidence.coverage` | Coverage | Coverage |
| `evidence.col.item` | 증거 / 상세 | Evidence / detail |
| `evidence.col.source` | 출처 | Source |
| `evidence.col.type` | 유형 | Type |
| `evidence.col.observed` | 관측일 | Observed |
| `evidence.col.trust` | 신뢰도 | Trust |
| `evidence.coverageMonths` | {n}개월 | {n} months |
| `evidence.footnote` | 미검증 항목은 신용 결정에 직접 반영하지 않습니다. 신뢰도는 교차검증 완성도(0–100)입니다. | Unverified items are not counted in the credit decision. Trust is cross-verification completeness, 0–100. |

Provenance chips: `provenance.onchain` = `On-chain` · `platform` = `Platform` · `document` = `Document` · `self_reported` = `Self-reported`.

### 3.5 Section 03 — score components

| key | KO reference | EN |
|---|---|---|
| `score.total` | 합계 | Total |
| `score.points` | 배점 {max} | Weight {max} |
| `score.max` | {max}점 만점 · 가중 합산 | out of {max} · weighted sum |
| `score.grade` | 등급 | Grade |
| `score.footnote` | 가중치는 공개되어 있고, 같은 입력은 같은 점수를 냅니다. | Weights are published; the same inputs always produce the same score. |

### 3.6 Section 04 — risk flags

| key | KO reference | EN |
|---|---|---|
| `flags.empty` | 현재 증거 기준으로 완화가 필요한 리스크 플래그가 발견되지 않았습니다. | No risk flags require mitigation on the current evidence. |
| `flags.mitigation` | 완화 조건 | Mitigation |
| `flags.evidence` | 근거 증거 · {ids} | Evidence · {ids} |
| `flags.sevHigh` | 높음 리스크 | High risk |
| `flags.sevMedium` | 중간 리스크 | Medium risk |
| `flags.sevLow` | 낮음 리스크 | Low risk |

### 3.7 Section 05 — covenants

| key | KO reference | EN |
|---|---|---|
| `covenants.count` | 조건 {n}개 | {n} conditions |
| `covenants.note` | 미이행 시 한도 재산정 사유 | Breach triggers a limit re-pricing |
| `covenants.item` | {index} · {text} | {index} · {text} |

Covenant texts are engine strings (Korean today). EN translations of the fixed covenant set, to be keyed by flag code: `CUST_CONC` = `Top-buyer share reduced to 50% or less within six months` · `FX_MISMATCH` = `90-day USD/KRW forward hedge, or a KRW-settlement account` · `THIN_FILE` = `Unverified revenue kept below 20%; limit re-priced above it` · `LATE_PAY` = `Buyer DSO managed at 45 days or less` · `PLATFORM_DEP` = `Read access to the platform payout API maintained; a second income source within 12 months` · `PREREVENUE` = `Milestone-based disbursement: pilot line complete, LOI converted to contract` · `IP_VALUATION` = `Pledge on three patents; valuation refreshed every six months` · `LOI_UNBOUND` = `Re-underwrite every three months until a binding contract` · `NO_WITHHOLDING` = `Platform payout ledger plus tax invoices retained as income evidence` · base covenants: `Purpose evidence (PO or purchase invoice)` · `Monthly settlement report and on-chain inflow evidence` · `Settlement-wallet priority repayment (escrow whitelist)`.

### 3.8 Section 06 — pricing

| key | KO reference | EN |
|---|---|---|
| `pricing.benchmark` | 시장 기준금리 | Market benchmark |
| `pricing.benchmarkNote` | 시장 기준금리 · 서버사이드 조회 | Market benchmark · server-side fetch |
| `pricing.gradeSpread` | 신용등급 {grade} 스프레드 | Grade {grade} spread |
| `pricing.gradeSpreadNote` | 점수 · 등급 매트릭스 | Score and grade matrix |
| `pricing.tenorFx` | 기간 · 환율 프리미엄 | Tenor and FX premium |
| `pricing.tenorFxNote` | {days}일 만기 · 통화 익스포저 | {days}-day tenor · currency exposure |
| `pricing.discountRate` | 할인율로 사용 | used as the discount rate |
| `pricing.settlementTitle` | Settlement · 정산 | Settlement |
| `pricing.settlementSub` | {days}일 · {date} 만기 | {days} days · matures {date} |
| `pricing.face` | 수출채권 명목가 · FACE | Receivable face value · FACE |
| `pricing.discount` | 선취 이자 · 할인 | Prepaid interest · discount |
| `pricing.fee` | 발행 · 중개 수수료 | Issuance and brokerage fee |
| `pricing.feeNote` | 명목가의 {rate} | {rate} of face value |
| `pricing.net` | 차입자 실지급액 | Net proceeds to borrower |
| `pricing.footnote` | 할인율(=APR) × 잔여일수로 이자를 선차감한 뒤 대금을 지급합니다. | Interest is discounted up front at the APR over the remaining days, then the balance is paid out. |
| `pricing.maturityLine` | 만기 정산 {date} · 투자자 수익률 {yield} · 할인율 {rate} | Matures {date} · investor yield {yield} · discount rate {rate} |

### 3.9 Section 07 — RWA certificate

| key | KO reference | EN |
|---|---|---|
| `rwa.aria` | 수출채권 수익권 | Export receivable participation |
| `rwa.title` | RWA 증서 | RWA certificate |
| `rwa.receivableId` | RAIL-R-2026-0001 | RAIL-R-2026-0001 |
| `rwa.face` | Face value | Face value |
| `rwa.notIssued` | 미발행 | Not issued |
| `rwa.tenor` | {days}일 · {rate}% 할인율 | {days} days · {rate}% discount rate |
| `rwa.discount` | 할인율 {rate} | Discount rate {rate} |
| `rwa.investorYield` | 투자자 수익률 | Investor yield |
| `rwa.investorYieldSub` | 할인율 {rate} + {spread}%p | Discount rate {rate} + {spread}pp |
| `rwa.chain` | Chain | Chain |
| `rwa.chainSub` | USDC 정산 · 온체인 기록 | USDC settlement · on-chain record |
| `rwa.standard` | Token standard | Token standard |
| `rwa.standardSub` | permissioned · 전송 제한 | permissioned · transfer-restricted |
| `rwa.escrow` | Escrow | Escrow |
| `rwa.escrowSub` | 정산 지갑 화이트리스트 | Settlement-wallet whitelist |
| `rwa.matched` | 명목가 {face} · {n}개 LP와 매칭 | Face value {face} · matched with {n} LPs |
| `rwa.matchingSoon` | 승인 후 유동성 풀 매칭 예정 | Liquidity-pool matching after approval |
| `rwa.pending` | LP 모집 예정 — 승인된 수출채권은 풀 등록 후 스테이블코인 유동성과 매칭됩니다. | LP raise pending — approved receivables are matched to stablecoin liquidity after pool registration. |
| `rwa.notListed` | 미승인 상태로 유동성 풀에 등록되지 않았습니다. | Not approved, so not registered in a liquidity pool. |
| `rwa.issuanceRecord` | 온체인 발행 기록 | On-chain issuance record |
| `rwa.investors` | Investors | Investors |
| `rwa.funded` | {pct}% funded (simulated) | {pct}% funded (simulated) |
| `rwa.pool` | Pool | Pool |

### 3.10 Section 08 — agent signatures

| key | KO reference | EN |
|---|---|---|
| `sig.title` | Agent signatures | Agent signatures |
| `sig.note` | 모든 수치는 규칙 엔진으로 재현 가능 — 동일 입력은 동일한 여권을 발급합니다. | Every number is reproducible by the rule engine — identical inputs issue an identical passport. |
| `sig.signed` | SIGNED | SIGNED |
| `sig.issuedAt` | Issued {date} | Issued {date} |
| `sig.passportId` | {passportId} | {passportId} |

### 3.11 Section 09 — sources, disclosures, bottom actions

| key | KO reference | EN |
|---|---|---|
| `sources.market` | 시장 기준 {date} · USD/KRW {rate} · {source} | Market reference {date} · USD/KRW {rate} · {source} |
| `sources.engine` | 모든 수치는 규칙 엔진이 계산합니다. 점수·한도·금리·리스크 플래그·약정은 증거 입력과 시장 기준만으로 결정되며, 에이전트는 수치를 생성하지 않고 판단 근거를 남깁니다. | Every number is computed by the rule engine. Score, limit, APR, risk flags and covenants follow only from the evidence inputs and the market reference; agents do not generate numbers, they record the reasoning. |
| `sources.links` | Links | Links |
| `sources.marketLink` | RWA 시장 기상도 | RWA market weather |
| `sources.otherApplicants` | 다른 지원자 심사 | Check another applicant |
| `sources.agentsLink` | 에이전트 팀 | Agent crew |
| `disclosures.printLine` | RAIL은 데모입니다. 실제 금융 서비스가 아니며, 온체인 기록은 시뮬레이션입니다. | RAIL is a demo. It is not a financial service; on-chain records are simulated. |
| `bottom.issuedBy` | Issued by RAIL · deterministic underwriting engine | Issued by RAIL · deterministic underwriting engine |
| `bottom.runAgain` | 다시 심사하기 | Run another underwriting |
| `bottom.viewMarket` | 시장 데이터 보기 | View market data |

Print header footer: `Passport · RAIL · Demo record — not a financial instrument` (replace the KO `RAIL은 데모입니다...` line on print only; screen keeps the sentence above).

## 4. `/en/market` — Market weather

Metadata: `meta.title` = `RWA market weather` · `meta.description` = `Stablecoin liquidity, USD/KRW, tokenized Treasury yields and 24/7 on-chain Korean assets — the market snapshot the RAIL credit rail reads.`

| key | KO reference | EN |
|---|---|---|
| `market.heroLine1` | 세계의 긴장을 | The world's tension, |
| `market.heroLine2` | 실시간으로 압축한 기상도. | compressed into a live weather map. |
| `market.heroSub` | 조달 비용과 수요를 동시에 바꾸는 네 개의 숫자, 그리고 그 숫자가 신용으로 번역되는 경로입니다. | Four numbers that move funding cost and demand, and the path by which they become credit. |
| `market.live` | 실시간 | Live |
| `market.snapshot` | 스냅샷 | Snapshot |
| `market.serverNote` | 서버사이드 스냅샷 · 30분 캐시 · 실패 시 라벨이 붙은 fallback 값으로 렌더링 | Server-side snapshot · 30-minute cache · labelled fallback when a feed fails |
| `market.numbers.passports` | 같은 스냅샷 위에서 심사한 세 개의 여권. | Three passports underwritten on the same snapshot. |
| `market.numbers.note` | 합계와 평균은 이 시장 스냅샷을 엔진 컨텍스트로 넣어 계산했습니다. 숫자는 언제나 재현됩니다. | Totals and averages are computed with this snapshot as the engine context. The numbers always reproduce. |
| `market.numbers.totalLimit` | 총 승인 한도 | Total approved limit |
| `market.numbers.totalSub` | {n}명 심사 합계 | Total across {n} applications |
| `market.numbers.avgApr` | 평균 금리 | Average APR |
| `market.numbers.avgAprSub` | 벤치마크 + 등급 스프레드 | Benchmark + grade spread |
| `market.numbers.avgScore` | 평균 점수 | Average score |
| `market.numbers.avgScoreSub` | 규칙 엔진 가중 합산 | Rule-engine weighted sum |
| `market.onkorea.title` | 가격은 국경을 넘고, 시장은 건물을 떠난다. | Prices cross borders; markets leave buildings. |
| `market.onkorea.sub` | 코스피200·현대차·SK하이닉스가 같은 블록에서 24시간 가격을 만듭니다. | KOSPI 200, Hyundai Motor and SK Hynix set prices around the clock, in the same block space. |
| `market.onkorea.footnote` | Hyperliquid HIP-3 'xyz' DEX · 파생상품(perp) 시세이며 현물 주식이 아닙니다. | Hyperliquid HIP-3 'xyz' DEX · perpetual-mark prices, not spot equities. |
| `market.stablecoin.title` | 유동성의 두께가 조달 비용을 정합니다. | Liquidity depth sets the cost of funding. |
| `market.stablecoin.sub` | 상위 5개 스테이블코인의 시총과 30일 변동. 이 잔고가 수출채권 풀의 깊이를 결정합니다. | Market cap and 30-day change for the top five stablecoins. This balance determines the depth of the receivable pool. |
| `market.stablecoin.caption` | 상위 5개 스테이블코인의 시가총액, 전체 대비 점유율, 30일 변동률 | Market cap, share of total and 30-day change for the top five stablecoins |
| `market.stablecoin.totalShare` | 상위 5개 합계 점유율 {pct} | Top-five combined share {pct} |
| `market.stablecoin.source` | DefiLlama · 30D change · USD 기준 | DefiLlama · 30-day change · USD |
| `market.weather.title` | 시장의 공기는 다섯 개의 신호로 읽힙니다. | The market reads through five signals. |
| `market.weather.sub` | buildWeather()가 시장 스냅샷에서 결정론적으로 계산한 신호입니다. 같은 스냅샷은 언제나 같은 기상도를 냅니다. | Signals computed deterministically from the market snapshot by buildWeather(). The same snapshot always produces the same weather map. |
| `market.weather.horizon.now` | 지금 | Now |
| `market.weather.horizon.3m` | 3개월 | 3 months |
| `market.weather.horizon.12m` | 12개월 | 12 months |
| `market.weather.up` | 상승 | Rising |
| `market.weather.down` | 하락 | Falling |
| `market.weather.flat` | 횡보 | Flat |
| `market.weather.legend` | ↑ 상승 · ↓ 하락 · → 횡보 | ↑ rising · ↓ falling · → flat |
| `market.weather.fxWeak` | 환율 약세 — 수출 매출의 원화 환산이 커집니다 | Weak won — the won value of export revenue rises |
| `market.weather.fxStrong` | 환율 강세 — 수출 매출의 원화 환산이 줄어듭니다 | Strong won — the won value of export revenue falls |
| `market.weather.fxFlat` | 환율 중립권 — 비용과 수익을 가릅니다 | Neutral FX band — it separates cost from revenue |
| `market.weather.fxBody` | USD/KRW {rate}. 수출대금의 84.2%가 달러로 결제되는 구조에서(한국은행 2025), 환율은 매출의 크기가 아니라 상환 능력의 변동성입니다. | USD/KRW {rate}. With 84.2% of export settlements in USD (Bank of Korea, 2025), FX is not the size of revenue — it is the volatility of repayment capacity. |
| `market.weather.stablecoinUp` | 스테이블코인 유동성 확장 — 온체인 정산 채널의 깊이가 커집니다 | Stablecoin liquidity expanding — on-chain settlement channels deepen |
| `market.weather.stablecoinDown` | 스테이블코인 시총 감소 — 유동성 조달 비용 상승 신호 | Stablecoin float contracting — a signal of higher funding cost |
| `market.weather.stablecoinFlat` | 스테이블코인 유동성 보합 | Stablecoin liquidity flat |
| `market.weather.stablecoinBody` | 스테이블코인 시가총액 ${mcap}B (30일 {change}). USDT·USDC가 전체의 {share}%를 차지합니다. | Stablecoin market cap ${mcap}B (30-day {change}). USDT and USDC account for {share}% of it. |
| `market.weather.onkoreaTitle` | 한국 자산은 이미 24시간 온체인에서 거래됩니다 | Korean assets already trade on-chain, 24/7 |
| `market.weather.onkoreaBody` | Hyperliquid HIP-3 'xyz' DEX에서 KOSPI 200({px})·현대차·SK하이닉스·EWY·USD/KRW가 24/7 거래됩니다. 일 거래대금 ${volume}B. 이 마크는 수출채권의 담보가치와 환헤지를 실시간으로 갱신합니다. | KOSPI 200 ({px}), Hyundai Motor, SK Hynix, EWY and USD/KRW trade 24/7 on Hyperliquid's HIP-3 'xyz' DEX. Daily volume ${volume}B. The marks update receivable collateral value and FX hedges in real time. |
| `market.weather.benchmarkTitle` | 토큰화 국채 금리가 팩토링 금리의 하한을 만듭니다 | Tokenized Treasury yields set the floor on factoring rates |
| `market.weather.benchmarkBody` | 벤치마크 {apr}% ({label}). 무위험 대체재 수익률이 오르면 RWA 신용 상품은 더 높은 스프레드를 요구받습니다. | Benchmark {apr}% ({label}). When the risk-free substitute yield rises, RWA credit products are repriced at a wider spread. |
| `market.weather.rwaTitle` | 수출채권의 본업은 '발행'입니다 | For export receivables, issuance is the business |
| `market.weather.rwaBody` | 글로벌 RWA 시장은 집계 기준에 따라 $38B–$77B, 그중 토큰화 사모신용은 $25.6B(CoinGecko, 2026-10-22). 다음 단계는 자산을 감싸는 일이 아니라 권리·돈·조건·책임을 같은 거래 구조로 묶는 일입니다. 국내 STO법은 2026-01-15 통과, 시행은 2027년 1월(잠정). | The global RWA market is $38B–$77B depending on the aggregator, of which tokenized private credit is $25.6B (CoinGecko, 2026-10-22). The next step is not wrapping assets but binding rights, money, conditions and obligations into one transaction. Korea's token-securities law passed 2026-01-15; enforcement is expected January 2027. |
| `market.weather.agentsTitle` | 에이전트가 심사하고, 에이전트가 유동성을 매칭합니다 | Agents underwrite; agents match liquidity |
| `market.weather.agentsBody` | 은행 영업시간 밖에서도 신용 판정과 자금 매칭이 이어집니다. 24/7 수출 결제와 속도를 맞춥니다. RAIL은 심사·검증·중개 에이전트를 하루 없이 같은 기준으로 반복합니다. | Credit decisions and funding matches continue outside banking hours, at the speed of 24/7 export settlement. RAIL runs its underwriting, verification and brokerage agents on the same rules, without a closing bell. |
| `market.transmission.title` | 이 숫자가 신용에 반영되는 방식. | How these numbers reach credit. |
| `market.transmission.sub` | 시장 데이터는 금리·한도·담보가치를 바꾸는 입력값입니다. 어떤 경로로 들어가는지 그대로 적습니다. | Market data is an input to rates, limits and collateral value. This is the exact path it takes. |
| `market.transmission.variable` | 시장 변수 | Market variable |
| `market.transmission.value` | 현재 값 | Current value |
| `market.transmission.effect` | 신용 반영 | Credit effect |
| `market.transmission.benchmark` | 벤치마크 금리 | Benchmark rate |
| `market.transmission.effectApr` | APR 하한 | APR floor |
| `market.transmission.benchmarkDetail` | 무위험 대체재 수익률({label}). 팩토링 금리의 기준점입니다. | The risk-free substitute yield ({label}); the reference point for factoring rates. |
| `market.transmission.fx` | USD/KRW | USD/KRW |
| `market.transmission.effectFx` | 환리스크 프리미엄 | FX risk premium |
| `market.transmission.fxDetail` | 달러 결제 비중이 높을수록 금리에 환리스크 가산이 붙습니다. | The higher the USD settlement share, the larger the FX premium on the rate. |
| `market.transmission.stablecoin` | 스테이블코인 유동성 | Stablecoin liquidity |
| `market.transmission.effectDepth` | 풀 깊이 | Pool depth |
| `market.transmission.stablecoinDetail` | USDT·USDC 잔고가 두꺼울수록 LP 모집과 상환이 빨라집니다. | Thicker USDT/USDC balances mean faster LP raising and repayment. |
| `market.transmission.rwa` | RWA 시장 (CoinGecko) | RWA market (CoinGecko) |
| `market.transmission.effectExit` | 출구 유동성 | Exit liquidity |
| `market.transmission.rwaDetail` | 토큰화 사모신용 {amount} 시장이 우리 제품의 직접 비교군입니다. | The tokenized private credit market (${amount}) is the closest comparable. |
| `market.transmission.onkorea` | 온체인 한국자산 마크 | On-chain Korean asset marks |
| `market.transmission.effectCollateral` | 담보가치 · 환헤지 | Collateral value · FX hedge |
| `market.transmission.onkoreaDetail` | 24/7 perp 마크가 담보가치와 환헤지 기준을 실시간으로 갱신합니다. | 24/7 perpetual marks refresh collateral value and FX hedge references in real time. |
| `market.sources.title` | 숫자의 출처를 숨기지 않습니다. | We do not hide where the numbers come from. |
| `market.sources.sub` | 모든 시장 데이터는 서버에서 조회하고 30분마다 재검증합니다. 실패 시 라벨이 붙은 fallback 값으로 렌더링합니다. | Every market data point is fetched server-side and revalidated every 30 minutes. On failure, the page renders a labelled fallback. |
| `market.sources.stablecoin` | 스테이블코인 시가총액 · 점유율 · 30일 변동 | Stablecoin market cap · share · 30-day change |
| `market.sources.fx` | USD/KRW 기준환율 | USD/KRW reference rate |
| `market.sources.onkorea` | 코스피200 · 현대차 · SK하이닉스 24/7 perp 마크 | KOSPI 200 · Hyundai · SK Hynix 24/7 perp marks |
| `market.sources.rwa` | RWA · 토큰화 사모신용 · 토큰화 국채 | RWA · tokenized private credit · tokenized Treasuries |
| `market.sources.research` | RAIL 리서치 스냅샷 | RAIL research snapshot |
| `market.sources.researchDetail` | 벤치마크 금리 · 규제 · 시장 논지 | Benchmark rate · regulation · market thesis |
| `market.closing.line1` | 신용이 먼저 도착하는 레일. | A rail where credit arrives first. |
| `market.closing.line2` | 은행은 담보를 봅니다. RAIL은 흐름을 봅니다. | Banks see collateral. RAIL sees cash flow. |
| `market.closing.cta` | 신용 여권 만들기 | Create a Credit Passport |
| `market.closing.secondary` | 모델 보기 | View the model |

## 5. `/en/agents` — Agent crew and build record

Metadata: `meta.title` = `Agent crew and build record` · `meta.description` = `RAIL is an RWA credit rail built in one day by one human and an agent team. Roles of the four runtime agents and five build agents, the build timeline, and the moat.`

| key | KO reference | EN |
|---|---|---|
| `agents.header` | The Crew · Build Log · Seoul 2026 | The Crew · Build Log · Seoul 2026 |
| `agents.header.count` | 4 runtime · 5 build | 4 runtime · 5 build |
| `agents.hero.line1` | 에이전트가 팀원인 팀. | A team where agents are teammates. |
| `agents.hero.line2` | (serif, English in KO source) one human, four agents. | one human, four agents. |
| `agents.hero.sub` | RAIL은 사람 1명과 에이전트 4명이 리서치·설계·구현·QA를 나눠 하루에 만들고 배포했습니다. | RAIL was researched, designed, implemented, QA'd and deployed in a day by one human and four runtime agents. |
| `agents.runtime.title` | 제품 안에서 판단하는 네 명. | Four agents that make decisions inside the product. |
| `agents.runtime.sub` | RAIL의 심사는 사람의 재량이 아니라 로그로 남는 절차입니다. 판단 근거는 여권에 첨부됩니다. | Underwriting at RAIL is not human discretion; it is a procedure that leaves a log. The reasoning is attached to the passport. |
| `agents.runtime.note` | Runtime agents · 규칙 엔진 호출 · LLM은 숫자를 만들지 않음 | Runtime agents · call the rule engine · LLMs never invent numbers |
| `agents.build.title` | 하루 동안 일한 다섯 명. | Five build agents, one day. |
| `agents.build.sub` | 사람 한 명이 방향과 최종 판단을 맡고, 에이전트 다섯 명이 리서치·구현·QA를 나눴습니다. | One human set direction and made the final calls; five build agents split research, implementation and QA. |
| `agents.log.kicker` | Build Log · 2026-10-22 · 하루 | Build log · 2026-10-22 · one day |
| `agents.log.title` | 기획이 아니라 실행 기록입니다. | An execution record, not a plan. |
| `agents.log.sub` | 절대 시각 대신 작업 시작(T) 기준 상대 표기입니다. 모든 산출물은 같은 날 타입체크와 빌드를 통과했습니다. | Times are relative to the start of work (T), not clock times. Every artifact passed typecheck and build the same day. |
| `agents.moat.title` | 왜 이 방식이 해자입니까. | Why this way of working is the moat. |
| `agents.moat.sub` | 기능은 복제할 수 있습니다. 판단이 남는 방식은 복제하기 어렵습니다. | Features can be copied. A process that leaves its reasoning behind is harder to copy. |
| `agents.moat.speed` | 실행 속도 | Execution speed |
| `agents.moat.speedBody` | 사람이 병목이 아닙니다. 리서치에서 배포까지, 판단 로그가 남은 채로 하루가 걸립니다. | The human is not the bottleneck. Research to deployment takes one day, with the reasoning log intact. |
| `agents.moat.log` | 복제 불가한 판단 로그 | A decision log that cannot be copied |
| `agents.moat.logBody` | 왜 그 결정을 했는지 증거·산식·로그가 남습니다. 결과만 복제해서는 재현되지 않습니다. | Evidence, formulas and logs record why each decision was made. Copying the output does not reproduce it. |
| `agents.moat.radio` | 고객 무전 | Customer radio |
| `agents.moat.radioBody` | 영업시간 밖에도 심사·증빙·정산이 이어집니다. 고객과의 연결이 끊기지 않습니다. | Underwriting, evidence collection and settlement continue outside banking hours. The line to the customer stays open. |
| `agents.closing.title` | 제품과 기록은 같은 저장소에 있습니다. | The product and the record live in the same repository. |
| `agents.closing.sub` | 이 페이지는 제품의 제작 기록입니다. 모든 수치는 규칙 엔진과 시장 스냅샷에서 다시 계산할 수 있습니다. | This page is the build record of the product. Every number can be recomputed from the rule engine and the market snapshot. |
| `agents.closing.primary` | 심사 시작하기 | Run an underwriting |
| `agents.closing.secondary` | 시장 데이터 보기 | View market data |
| `agents.links.title` | 관련 링크 | Related links |
| `agents.links.landing` | 제품 랜딩 | Product landing |
| `agents.links.landingNote` | 랜딩 · 매니페스트 | Landing · manifesto |
| `agents.links.market` | 시장 데이터 | Market data |
| `agents.links.marketNote` | RWA 기상도 | RWA weather |
| `agents.links.readme` | README | README |
| `agents.links.readmeNote` | 제작 기록 | Build record |

Runtime agent rows (role / tools / cadence / decides), EN:

| agent | role | tools | cadence | decides |
|---|---|---|---|---|
| SCOUT | Evidence collection | Base RPC · customs export declarations · platform payout API · KIPRIS patent lookup | On each underwriting request · records the source hash | Which evidence to trust; collection scope and source |
| VERIFIER | Cross-verification | Buyer name, amount and due-date triple match · wallet age · duplicate removal | Immediately after collection · conflict checks across evidence | Evidence coverage, and separation of unverified items |
| UNDERWRITER | Credit decision | Rule-based weighted engine · score components · grade spreads | On each underwriting request · same input = same result | Score · grade · approved limit · APR |
| BROKER | Liquidity matching | ERC-3643 issuance · LP pool · escrow whitelist | After approval · tracked to maturity | Whether to fund, maturity, and the repayment path |

Build agent rows, EN:

| agent | plan / kind | desc | output |
|---|---|---|---|
| telegram-analyst | Research | Extracted market arguments sentence by sentence from a Telegram channel and public sources. Mapped which numbers could carry the product's case. | Market thesis notes |
| rwa-researcher | Research | Researched Korea's STO regime, ERC-3643 rights structures, and DefiLlama/CoinGecko data schemas. Fixed every number's source and aggregation basis. | Regulation and data notes |
| frontend-builder | Implementation | Built the landing, market and agents pages in the v3 benchmark grammar: cinematic dark, chrome, orange editorial system. | Three routes · landing components |
| flow-builder | Implementation | Built the four-step underwriting animation and the Credit Passport artifact. The same result is shown twice: as a log and as a passport. | Underwriting flow · passport |
| lead | Design · Engine · QA · Deploy | Owned product definition, the credit engine, the design system, final QA and the Vercel deployment — one human's judgment decomposed into agent execution. | Engine · system · deployment |

Build log rows, EN: `T+0h` research begins — market thesis, regulation, data-source scan · `T+1h` product definition, credit engine — score components and passport formulas fixed · `T+3h` UI implementation — landing, underwriting flow, passport artifact · `T+5h` QA and Vercel deployment — typecheck, build, production release.

## 6. Applicant narratives (EN)

Numbers stay exactly as in `lib/profiles.ts`. `name`/`company` romanisations are fixed: `Hanbit Electronics Co., Ltd.` (한빛전자 주식회사) · `Kim Do-hyun` · `FiberLogic Co., Ltd.` (파이버로직 주식회사). Type labels: `TYPE_LABEL.exporter` = `Export SME` · `freelancer` = `Freelancer / sole proprietor` · `deeptech` = `Deeptech / IP holder`. Locations: `Sasang-gu, Busan` · `Mapo-gu, Seoul` · `Yuseong-gu, Daejeon`.

### 6.1 Hanbit Electronics (`hanbit`)

| field | EN |
|---|---|
| `name` | Hanbit Electronics |
| `company` | Hanbit Electronics Co., Ltd. |
| `tagline` | A five-person appliance exporter in Busan. Revenue arrives in dollars; the account looks empty. |
| `location` | Sasang-gu, Busan |
| `purpose` | Fund raw-material purchases and three months of production for an additional order from a Vietnamese buyer. |
| `bankOutcome` | Rejected by KB Kookmin, Hana and Busan Bank — no real-estate collateral, two years of operating history, and USD revenue that does not reconcile to a KRW financial statement. |
| `story[0]` | The bank asked for the apartment. We don't own one. Our Vietnamese buyer sends dollars every month, but in the bank's paperwork that money never appears as export revenue. |
| `story[1]` | The shipments leave every month. The money arrives. To take the next order we have to buy materials first, and we don't have the three months of working capital to carry it. |
| `story[2]` | RAIL didn't look at the account balance. It looked at six months of incoming payments. |
| `applicantQuote` | Being told I have revenue but no credit is the part that stings. Can't I just show you the money coming in? |

### 6.2 Kim Do-hyun (`kimfreelance`)

| field | EN |
|---|---|
| `name` | Kim Do-hyun |
| `company` | Freelance developer · Kim Do-hyun |
| `tagline` | A developer earning KRW 6.6M a month. Not a single withholding receipt. |
| `location` | Mapo-gu, Seoul |
| `purpose` | Working capital for equipment replacement and a six-month gap, matched to global platform payout cycles. |
| `bankOutcome` | Rejected by Shinhan and KakaoBank — no employment withholding receipts; in his third year of business income with a broken income-evidence trail. |
| `story[0]` | KRW 6.6M arrives every month. I've been paid by the same platform for 38 months. The bank declined the loan because I don't have a withholding receipt. |
| `story[1]` | The income exists. It just doesn't have a document that fits the bank's folder. |
| `story[2]` | Platform ledgers and on-chain payouts can't be edited. RAIL reconciled the two. |
| `applicantQuote` | I don't lack credit. My credit just doesn't exist in the bank's form. |

### 6.3 FiberLogic (`fiberlogic`)

| field | EN |
|---|---|
| `name` | FiberLogic |
| `company` | FiberLogic Co., Ltd. |
| `tagline` | A fiber-optic sensor startup with 32 patents. Revenue is still zero; one LOI. |
| `location` | Yuseong-gu, Daejeon |
| `purpose` | Build the pilot line — bridge capital before volume production, against an LOI from a mid-sized Korean manufacturer. |
| `bankOutcome` | Rejected by KIBO and its banks — zero revenue, no collateral. The IP exists, but there is no underwriting model or track record for pricing it as collateral. |
| `story[0]` | We hold 32 patents and KRW 420M in government grants. Revenue is still zero. No bank has ever taken a patent as collateral. |
| `story[1]` | We have a purchase intent. With a production line, the first revenue follows. The KRW 300M to build that line is what's missing. |
| `story[2]` | Instead of a revenue ledger, RAIL read patent registrations, grant evaluations and test reports. It tied funding to milestones, not to cash on hand. |
| `applicantQuote` | I'm not borrowing money. I want to buy time with value as the collateral. |

Profile keys not listed (evidence objects, customers, payoutMix) are already structured data. For EN display of evidence labels/sources inside the demo table, these are engine/profile strings today; add EN arrays keyed by evidence id only when the profile fixture moves to the EN surface.

## 7. Implementation notes

1. **Numbers never move into this file.** `{placeholders}` in this deck are filled from `UnderwritingResult`, `Profile` and `MarketSnapshot`. If a copy label contains a number, it is interpolated.
2. **Server components first.** Only the underwriting run (animation) and copy/print/share buttons need `"use client"`. The demo path bar is static and can be a server component.
3. **`/en` route links.** All hrefs inside `/en/*` must stay under `/en` (e.g. `/en/underwrite`, `/en/passport/hanbit`, `/en/market`, `/en/agents`). The KO components currently hardcode KO routes — branch on locale rather than duplicating components.
4. **Locale formatting.** `dateKo` → `formatDateEn` = `Oct 22, 2026`; `krwCompact` → `KRW 180M` / `KRW 9M` / `KRW 54M`; `pct` → `8.55%`; keep `tnum`. Korean won amounts that show the exact value render as `KRW 180,000,000` in EN, not `1억 8,000만원`.
5. **`TYPE_LABEL` and `SEVERITY_LABEL`** need EN maps (`Export SME`, `Freelancer / sole proprietor`, `Deeptech / IP holder`; `High`, `Medium`, `Low`).
6. **`DECISION_LABEL`** EN map: `Approved`, `Conditional`, `Declined`.
7. **Agent `role` strings** come from `lib/engine.ts` (Korean today): `evidence collection`, `cross-verification`, `credit decision`, `liquidity matching`; agent summaries are Korean sentences and should be localized through a keyed map by agent `key` + `profileId` rather than machine translation.
8. **Deterministic note** must appear on the run page and the passport (it is the product's core claim): `Same input, same result.` + `LLMs never invent the numbers.`
9. **Demo notice** must appear once per page: run page footer strip, passport print footer, market footer, agents footer. Never hide it behind a toggle.
10. **Review before ship:** the KO UI has a few internal mono labels (`BANK_RESULT`, `RUN_ID`, `LIVE VERDICT`) that are already English; keep them as-is for visual consistency. Do not translate agent names.
