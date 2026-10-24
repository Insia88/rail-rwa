# RAIL — Build Spec (single source of truth)

> Read this fully before writing code. Product copy below is verbatim — use it as-is.
> Do not edit files outside your assigned write scope. Never invent market numbers:
> all live numbers come from `lib/market.ts`. All passport numbers come from `lib/engine.ts`.

## 0. Context

RAIL is a **demo product** for a solo founder + agent team applying to **Nitro Seoul 2기 (Hashed)**.
It is an **on-chain credit rail for Korean businesses the bank system can't read**:

1. Collect evidence a bank ignores: on-chain settlement receipts, platform payout ledgers, export declarations, patents, R&D grants.
2. Verify & cross-check it (agent crew: SCOUT → VERIFIER → UNDERWRITER → BROKER).
3. Issue a **Credit Passport** — an explainable, shareable underwriting artifact: score, grade, limit, APR, conditions, risk flags.
4. Turn the approved receivable into a **permissioned RWA token** (ERC-3643 on Base) funded by stablecoin liquidity, so the exporter gets cash before the buyer pays.

Thesis line: **"은행은 담보를 봅니다. RAIL은 흐름을 봅니다."**
Brand line: **"신용이 먼저 도착하는 레일."**
Disclaimer line (footer/artifact): "RAIL은 데모 제품입니다. 실제 금융 서비스가 아니며, 온체인 발행·투자 기록은 시뮬레이션입니다."

Tone: editorial Korean fintech manifesto. Precise, calm, slightly declarative. No emoji, no hype words
("혁신적", "게임체인저" 금지), no generic SaaS-speak. Numbers first. Short sentences.
Visual identity: warm paper (#f5f1e8) + ink (#101512) + signal orange (#e8451f) + verified green
(#15654f). Editorial serif headlines (`font-display`), Pretendard body, IBM Plex Mono labels.
Hairlines, ruled tables, passport stamps, monospace data. **No gradients-on-gradient, no glassmorphism,
no purple, no rounded-3xl blobs.** Radii small (rounded-sm / rounded-none). Generous whitespace.

## 1. Pages and routes

| Route | Owner | Purpose |
|---|---|---|
| `/` | frontend-builder | Landing / manifesto |
| `/underwrite` | flow-builder | Applicant picker |
| `/underwrite/[id]` | flow-builder | Animated agent underwriting run |
| `/passport/[id]` | flow-builder | Shareable Credit Passport artifact |
| `/market` | frontend-builder | Live RWA market context + weather |
| `/agents` | frontend-builder | Agent crew & how the demo was built |
| `/api/market` | Lead | JSON market snapshot (optional use) |

Header/footer are a **Lead-owned shared component** (`components/site/header.tsx`, `footer.tsx`),
already wired into pages via `app/layout.tsx`. Do not duplicate them; just render page content.
Both builders may import every component from `components/ui/*` (Lead-owned, ready to use).

## 2. Data & imports (use these, do not reimplement)

```ts
import { PROFILES, PROFILE_MAP, TYPE_LABEL, getProfile } from "@/lib/profiles";
import { underwrite, underwriteById, ALL_RESULTS, DEFAULT_CONTEXT } from "@/lib/engine";
import { getMarketSnapshot, engineContextFromMarket, FALLBACK_MARKET } from "@/lib/market";
import { buildWeather } from "@/lib/weather";
import { krw, krwCompact, usdCompact, pct, signedPct, dateKo, dateKrLong, DECISION_LABEL, GRADE_TONE, SEVERITY_LABEL } from "@/lib/format";
```

Server-component pattern for pages that need live data:

```tsx
const market = await getMarketSnapshot();
const ctx = engineContextFromMarket(market);
const result = underwrite(PROFILE_MAP[id], ctx)!;
```

`UnderwritingResult` shape is in `lib/types.ts` — read it. Key fields:
`passportId, score, grade, decision, decisionNote, limitKrw, requestedKrw, tenorDays, apr,
benchmarkApr, spreadPct, discountKrw, netProceedsKrw, evidenceCoverage, components[], flags[],
covenants[], evidence[], agents[] (4 steps), funding{receivableId, faceValueKrw, fundedPct,
investors[], chain, tokenStandard, pool, maturityDate, escrow}, market{usdKrw, stablecoinMcapUsd,...}`.

## 3. Shared UI primitives (already written by Lead)

- `components/ui/logo.tsx` — `<Logo />`, `<RailMark />`
- `components/ui/button.tsx` — `<Button href variant="primary|outline|ghost" size="md|sm">` (renders Link if href)
- `components/ui/badge.tsx` — `<Badge tone="signal|verified|gold|neutral">`, `<ProvenanceBadge provenance={...} />`, `<SeverityBadge severity={...} />`
- `components/ui/section.tsx` — `<SectionLabel index="01" kicker="THE PROBLEM">`, `<Eyebrow>`, `<PageIntro title ...>`
- `components/ui/stat.tsx` — `<Stat value label note />`, `<StatRow>`
- `components/ui/sparkline.tsx` — `<Sparkline values={number[]} />`
- `components/ui/bars.tsx` — `<ScoreBar score max label detail />`, `<ShareBar pct />`
- `components/ui/ticker.tsx` — `<MarketTicker market={market} />`
- `components/ui/actions.tsx` — `<CopyButton text label />`, `<PrintButton />`, `<ShareButton title text />` (client components)
- `components/site/header.tsx` + `footer.tsx` — in layout; landing may pass nothing.
- If a primitive you need is missing, build it **inside your own components folder**, don't edit `components/ui`.

Layout container convention: `<main className="pt-28">` or pages render `<div className="mx-auto w-full max-w-6xl px-5 sm:px-8">` sections.
Header is fixed; add top padding (`pt-24 md:pt-28`).
Responsive: mobile-first, test 390px and 1440px widths. Max content width 1152px (max-w-6xl).

## 4. Landing page `/` — structure & verbatim copy

Landing is a server component. Compute `market` and `results = ALL_RESULTS(ctx)`.
Use `results[0]` (한빛전자) in the hero passport visual and results for numbers.

### 4.1 Hero (full-width paper, dot-grid or paper-grid background, generous height)
- Eyebrow (mono, uppercase, tracking): `RWA CREDIT RAIL · SEOUL · 2026`
- H1 (font-display, huge: text-5xl sm:text-6xl lg:text-7xl, leading-[1.05]):
  `매출은 있는데,`<br/>`신용이 없습니다.`
- Sub headline (serif, text-2xl): `은행은 담보를 봅니다. RAIL은 흐름을 봅니다.`
- Body (text-base text-ink-soft max-w-xl): `RAIL은 수출대금·정산 이력·특허를 온체인 증거로 검증해, 담보 없는 기업의 신용 여권을 만듭니다. 그 여권은 수출채권 RWA가 되어 스테이블코인 유동성과 만납니다.`
- CTAs: primary `3분 데모: 한빛전자 심사하기` → `/underwrite/hanbit`; outline `RWA 시장 보기` → `/market`.
- Small meta under CTAs (mono text-xs): `데모 제품 · 실제 금융 서비스 아님 · 온체인 발행 시뮬레이션`
- Right column: **Passport preview card** (component you build, reuse of hero artifact): dark green passport cover, `REPUBLIC OF RAIL` eyebrow, `CREDIT PASSPORT` mono, applicant `한빛전자`, score `73.4`, grade `B`, limit `1억 8,000만원`, APR `8.55%`, stamp `VERIFIED`.
  Numbers from `results[0]`. Slight rotate (-1.5deg), shadow-sm.
- Below hero: `<MarketTicker market={market} />` with USD/KRW, stablecoin mcap, benchmark, tokenized treasury $12.8B. Show `LIVE`/`FALLBACK` dot from `market.status`.

### 4.2 Section 01 — 문제 (id="problem")
- SectionLabel: index `01`, kicker `THE PROBLEM`, title `은행의 문법은 세 변수로 작동합니다.`
- Lead paragraph: `담보, 업력, 재무제표. 20년간 주택담보대출에 최적화된 이 문법은 실제 경제활동을 읽지 못합니다. 매출이 달러로 들어오는 수출기업의 통장은 비어 보이고, 플랫폼에서 월 600만원을 버는 개발자의 소득은 서류에 없습니다.`
- Three-column cards (hairline top, number 01/02/03):
  1. `담보` — `아파트가 없으면 신용이 없습니다.` / `부동산 담보 판정이 신용평가를 대체한 지 20년. 무형자산·수출채권을 평가할 근육은 사라졌습니다.`
  2. `업력` — `3년을 살아남았는가가 미래를 결정합니다.` / `살아남은 과거를 확인하는 일은 신용평가가 아니라 생존 편향의 확인입니다.`
  3. `재무제표` — `달러 매출은 원화 장부에서 사라집니다.` / `수출대금의 84.2%가 달러로 결제되지만, 은행의 서류함에 들어갈 원화 재무제표에는 잡히지 않습니다.`
- Stat row: `130만 개` / `매년 새로 생기는 사업체` · `84.2%` / `수출대금 달러 결제 비중 (한국은행 2025)` · `1.28%` / `정책금융 수출팩토링 중 중소기업 비중 (2022 국회자료)`
- Pull quote (serif, large, bordered left): `“신용이 없는 것이 아니라, 신용이 은행의 문법 밖에 있는 것뿐입니다.”`
  — attributed `프리랜서 개발자 김도현 · RAIL 지원자`

### 4.3 Section 02 — 작동 방식 (id="how")
- SectionLabel: `02`, `HOW IT WORKS`, title `네 개의 에이전트가, 은행이 하지 않는 일을 합니다.`
- Sub: `증거 수집부터 유동성 매칭까지. 각 에이전트의 판단 근거는 여권에 그대로 남습니다.`
- Four cards in 2x2 (or 4-col on lg), each: mono agent name, role, 2-line description, one log line in mono box:
  - `SCOUT / 증거 수집` — `지갑·플랫폼·수출신고·세금계산서를 읽습니다.` log: `정산 지갑 0x8f…c21 → USDC 입금 87건`
  - `VERIFIER / 교차검증` — `자기신고와 검증 기록의 간극을 계산합니다.` log: `자기신고 4.62억 vs 온체인 3.54억`
  - `UNDERWRITER / 신용 판정` — `설명 가능한 가중치로 점수·한도·금리를 계산합니다.` log: `벤치마크 4.15% + 스프레드 3.80%p`
  - `BROKER / 유동성 매칭` — `수출채권을 RWA로 발행하고 LP와 연결합니다.` log: `RAIL-R-2026-0001 · Base · ERC-3643`
- CTA link: `한빛전자 심사 과정 보기 →` → `/underwrite/hanbit`

### 4.4 Section 03 — 신용 여권 (id="passport")
- SectionLabel: `03`, `THE CREDIT PASSPORT`, title `점수는 숨기지 않습니다.`
- Sub: `왜 이 금리인지, 어떤 증거가 몇 점을 만들었는지 여권에 전부 적습니다. 은행이 감춘 산식을 우리는 발급합니다.`
- Two columns: left = 4 feature rows (hairline separated):
  1. `증거 테이블` — `온체인·플랫폼·문서·자기신고를 구분해 표시하고, 신뢰도와 검증 주체를 함께 남깁니다.`
  2. `점수 컴포넌트` — `증빙 커버리지 30점, 현금흐름 안정성 20점… 가중치와 산식을 공개합니다.`
  3. `조건과 약정` — `집중도·환리스크·플랫폼 의존을 리스크 플래그로 만들고, 완화 조건을 계약에 넣습니다.`
  4. `RWA 증서` — `승인된 수출채권은 ERC-3643 수익권 토큰으로 발행되어 스테이블코인 LP와 연결됩니다.`
- Right: a `PassportMock` card showing 한빛전자 result: decision/grade/limit/APR/score bars mini + 2 evidence rows with provenance badges.
- CTA: `한빛전자의 여권 열기 →` → `/passport/hanbit`

### 4.5 Section 04 — RWA 레일 (id="rail")
- SectionLabel: `04`, `THE RWA RAIL`, title `자산과 돈이 같은 거래에서 움직일 때, RWA는 금융이 됩니다.`
- Sub: `토큰화는 증권을 새 선로에 올리는 일이 아니라, 권리·돈·조건·책임이 끊기지 않고 흐르는 공통 레일을 까는 일입니다.`
- Horizontal 5-step rail (line with nodes, responsive vertical on mobile):
  `신용 여권` → `수출채권 토큰 발행` → `스테이블코인 LP 모집` → `만기 정산` → `온체인 이력이 다음 신용의 증거로`
  Each node: short 1-line description.
- Numbers strip (from `market.rwa` + `market.stablecoinMcapUsd`): `$76.9B` RWA (CoinGecko 기준) · `$25.6B` 토큰화 사모신용 · `$305B` 스테이블코인 유동성 — note `출처: CoinGecko categories · DefiLlama, 2026-10-22. 집계 기준 명시 (RWA 집계는 기관별 $38B~$77B 격차).`
- Quote (serif): `“토큰을 걷어냈을 때 기관의 업무 순서와 장부 대사가 그대로 남는다면, 바뀐 것은 표기 방식뿐입니다.”` — note `RAIL 리서치 · 증권형 토큰 논의에서`

### 4.6 Section 05 — 시장 기상도 (id="market")
- SectionLabel: `05`, `MARKET WEATHER`, title `24시간 열린 시장, 잠들지 않는 신용.`
- Sub: `스테이블코인 유동성과 환율, 토큰화 국채 금리는 팩토링 금리의 하한과 수요를 동시에 바꿉니다. 코스피200·현대차·SK하이닉스는 이미 온체인에서 24시간 거래됩니다.`
- Show first 3 `buildWeather(market)` signals as cards: horizon tag, direction arrow (↑/↓/→), title, body.
- Optional: a small live strip from `market.onkorea.markets` (kr200 / hyundai / skhx mark prices + `market.onkorea.dayVolumeUsd`), labelled `Hyperliquid HIP-3 xyz · perp`.
- CTA: `전체 기상도 보기 →` → `/market`

### 4.7 Section 06 — 에이전트 팀 (id="agents")
- SectionLabel: `06`, `THE CREW`, title `사람 한 명, 에이전트 네 명.`
- Body: `RAIL은 혼자 만든 데모가 아닙니다. 리서치·설계·엔진·UI·QA를 나눠 맡은 에이전트 팀이 하루 동안 만들고 배포했습니다. 이 제품이 보여주는 것은 기능이 아니라 일하는 방식입니다.`
- 4 compact agent cards: `SCOUT`, `VERIFIER`, `UNDERWRITER`, `BROKER` with runtime status `IDLE / ON CALL` and "runtime" labels (e.g., `research`, `cross-check`, `scoring`, `liquidity`).
- CTA: `에이전트 팀과 제작 기록 보기 →` → `/agents`

### 4.8 Closing CTA
- Big serif statement: `담보가 아니라 흐름을 담보로.` / sub: `다음 랩의 신용은, 이미 흐르고 있는 매출에서 시작됩니다.`
- Buttons: primary `신용 여권 만들기` → `/underwrite`; outline `시장 데이터 보기` → `/market`.

## 5. `/underwrite` — applicant picker
- Page intro: eyebrow `APPLICANT DESK`, title `누구의 신용을 심사할까요?`, sub `세 명의 지원자가 이미 은행에서 거절당했습니다. RAIL이 읽는 것은 서류가 아니라 흐름입니다.`
- Three cards (one per `PROFILES`), rich:
  - type label + name + tagline
  - requested (`krwCompact`) / tenor
  - `은행 결과` row with muted text from `profile.bankOutcome`
  - sparkline of `monthlyInflowKrw`
  - evidence count + verified count badges
  - link button `심사 시작 →` → `/underwrite/{id}`
- Bottom explainer strip: provenance legend (ONCHAIN / PLATFORM / DOCUMENT / SELF-REPORTED) + a note that numbers are demo data.

## 6. `/underwrite/[id]` — agent run (the "wow" moment)
Server page: resolve profile, `market`, `result = underwrite(profile, ctx)`, pass to client `<UnderwritingRun result profile market />`.
`UnderwritingRun` behavior:
- Layout: header (applicant, requested, tenor), two columns: left = agent console (dark terminal panel), right = live verdict panel.
- On mount, run 4 agent steps sequentially from `result.agents` with 1100–1600ms each: show agent name, role, streaming log lines (typewriter or fade-in), elapsed ms. A thin progress rail shows 1/4…4/4.
- After each agent completes, update right panel: coverage %, flags count, score, then final decision card with grade/limit/APR.
- Verdict reveal: grade big serif, `DECISION_LABEL[decision]`, limit, APR, and primary CTA `신용 여권 열기 →` → `/passport/{id}`; secondary `다시 심사`.
- Must include: `건너뛰고 결과 보기` button (sets all steps done instantly); respects `prefers-reduced-motion`.
- Bottom strip: "이 판단은 규칙 기반 엔진이 계산했습니다. 같은 입력은 항상 같은 결과를 냅니다." + link to `/passport`.
- Numbers must come from `result` (no hardcoding).
- Client component must be in `components/flow/underwriting-run.tsx` and `"use client"`.

## 7. `/passport/[id]` — the artifact
Server page with `print` support (`window.print` via `<PrintButton />`).
Sections top→bottom:
1. **Cover** (dark `bg-night text-cream`, gold-ish lines): `REPUBLIC OF RAIL` mono / `CREDIT PASSPORT` display / `PASSPORT No. {passportId}` / applicant name & company / score + grade big / `ISSUED 2026.10.22` / stamp row (VERIFIED, RWA-READY, AGENT SIGNED). Add MRZ-like mono line at bottom (`P<RAIL{passportId}<<{name}<<<<` style, purely decorative).
2. **심사 요약**: decision badge, `decisionNote`, requested vs approved, tenor, market context (`USD/KRW`, benchmark).
3. **증거 테이블**: rows = `result.evidence`; columns 증거 / 출처 / 유형(ProvenanceBadge) / 관측일 / 신뢰도(bar + number). Verified vs unverified visually distinguished.
4. **점수 컴포넌트**: rows with `ScoreBar` (score/max) + detail text. Total row.
5. **리스크 플래그**: cards with severity + detail + mitigation.
6. **조건(약정)**: numbered list.
7. **가격 산식**: `benchmarkApr` + `spreadPct` + (tenor/fx premiums already baked) = `apr`; show face `faceValueKrw`, discount `discountKrw`, fee `feeKrw`, net proceeds `netProceedsKrw`, maturity `funding.maturityDate`. Explain in one line: `할인율(=APR) × 잔여일수로 이자를 선차감한 뒤 대금을 지급합니다.`
8. **RWA 증서**: receivableId, face, pool, chain, token standard, funded % progress, investor list (alias/type/amount), escrow.
9. **서명**: 4 agents with `AGENT SIGNED` mono + issuedAt; note "모든 수치는 규칙 엔진으로 재현 가능".
10. Footer disclaimers + links (`/market`, `/underwrite`), actions bar top or bottom: `<CopyButton text={shareUrl}/>`, `<PrintButton />`, JSON download (client: Blob of `JSON.stringify(result)`, label `JSON 다운로드`).
Mobile: single column; cover first.

## 8. `/market` — live context
- `getMarketSnapshot()` + `buildWeather(market)`; `results = ALL_RESULTS(ctx)` for aggregate stats (총 승인 한도, 평균 금리).
- Hero: eyebrow `MARKET WEATHER`, title `세계의 긴장을 실시간으로 압축한 기상도.`, sub + `LIVE`/`FALLBACK` badge + `asOf` date.
- Big number row (4): stablecoin mcap + 30d change (`market.stablecoinMcapUsd`), USD/KRW + date (`market.usdKrw`), benchmark APR (`market.benchmark.apr`), RWA (CoinGecko) `market.rwa.rwaTotalUsd` with note `토큰화 사모신용 ${usdCompact(market.rwa.tokenizedPrivateCreditUsd)}`.
- **24/7 온체인 한국자산** section (REQUIRED): title `가격은 국경을 넘고, 시장은 건물을 떠난다.` Show `market.onkorea.markets` rows: label (`코스피200` 등), markPx, oraclePx, funding (%, 소수 4자리), dayVolumeUsd (usdCompact), plus total `market.onkorea.dayVolumeUsd` and `LIVE` badge (`market.onkorea.status`). Note: `Hyperliquid HIP-3 'xyz' DEX · 파생상품(perp) 시세이며 현물 주식이 아닙니다.` — 이 문구 필수.
- Stablecoin table (top 5): symbol/name, mcap, share bar, 30d change colored.
- Weather signal cards (all 5–6): horizon, title, body, direction arrow.
- `이 숫자가 신용에 반영되는 방식` explainer: benchmark → APR floor; FX → fx premium; stablecoin float → pool depth; RWA TVL → exit liquidity; onkorea mark → 담보가치/환헤지 실시간 마크. Small table.
- Sources block: DefiLlama stablecoins, Frankfurter (ECB), Hyperliquid HIP-3, CoinGecko categories, 리서치 스냅샷. Note revalidate 30분.
- CTA: `/underwrite`.

## 9. `/agents` — crew & build log
- Title `에이전트가 팀원인 팀.` sub `RAIL은 사람 1명과 에이전트 4명이 리서치·설계·구현·QA를 나눠 하루에 만들고 배포했습니다.`
- Runtime crew: 4 agent cards (role, tools, cadence, what it decides). (These are product-runtime agents.)
- Build crew: 5 cards — `telegram-analyst` (시장 논지 추출), `rwa-researcher` (규제·데이터·OSS), `frontend-builder`, `flow-builder`, `lead` (설계·엔진·QA·배포). Honest description.
- Build timeline (2026-10-22): `09:00 리서치 시작` → `11:00 제품 정의` → `12:00 신용 엔진` → `14:00 UI` → `17:00 QA` → `18:00 Vercel 배포` (edit if inaccurate times — keep to 4 lines).
- `왜 이 방식이 해자입니까` block: 3 bullets (실행 속도, 복제 불가한 판단 로그, 고객 무전).
- Links: `제품 데모` / `시장 데이터` / `README` (link to `/` etc., no external URL needed).
- Disclaimer.

## 10. Header/footer nav (Lead provides)
Header: logo left; nav `문제 / 작동 방식 / 여권 / 시장 / 에이전트`; right CTA `신용 여권 만들기`.
Footer: 3 columns (product, data sources, demo disclaimer) + copyright.

## 11. Quality bar
- `npm run build` must pass (typecheck included). No `any` unless unavoidable. No unused imports.
- No hardcoded market/passport numbers — always from result/market props.
- Korean copy: no typos, no machine-translated feel, no emoji. Use `Intl.NumberFormat("ko-KR")` via lib/format.
- Accessible: semantic headings (one h1/page), alt-free (no images), focus-visible rings, `aria` labels on progress bars, buttons type.
- No new npm packages without Lead approval (lucide-react, clsx, tailwind-merge available).
- Only CSS/SVG visuals. No external image URLs. No `next/image` remote images.
- List your created files in your completion message.
