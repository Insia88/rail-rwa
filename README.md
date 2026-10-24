# RAIL — 은행이 읽지 못하는 매출을, 신용으로

> **신용이 먼저 도착하는 레일.**
> 수출대금·정산 이력·특허를 온체인 증거로 검증해 담보 없는 기업의 **신용 여권(Credit Passport)** 을 만들고,
> 승인된 수출채권을 **RWA(ERC-3643)** 로 토큰화해 스테이블코인 유동성과 연결하는 온체인 신용 레일입니다.

**데모 (Vercel):** https://rail-rwa.vercel.app
**글로벌 (EN):** https://rail-rwa.vercel.app/en
**Hashed/Nitro 메모:** https://rail-rwa.vercel.app/nitro · **피드백 루프:** https://rail-rwa.vercel.app/feedback · **빌드 로그:** https://rail-rwa.vercel.app/log
**GitHub:** https://github.com/Insia88/rail-rwa
**제작:** 2026-10-22~25, 솔로 파운더 1명 + 에이전트 팀(DSH Agent Teams)
**디자인:** v6 "Core" — 60개 제품 벤치마크 + 외부 비평 3인 루프 + paper 여권 + 6-act 구조 (`research/design/structure-audit.md`, `rail-app/DESIGN-V2.md`, `design/logo/README.md`)

---

## 0. v6 Core — 외부 비평 3인 루프 + 핵심 UI/UX 개편

- 3인 외부 비평(투자자/프로덕트 디자이너/브랜드 디자이너) → 핵심만 남김: hero 사업 스펙, 숫자 위계(한도 40px·APR 34px), 여권 paper 재설계(한도·APR 우선), 심사 판정 sticky, 모바일 메뉴, word-break keep-all.
- 정직성: SIMULATED 라벨, /nitro truth surface(지원자=가상, 실제 고객 0명), decline 룰·economics 가정 공개.
- 피드백 기록: `/log` v6 core 엔트리, `/feedback` 창업자 지시/외부 비평 구분.

---

## 0.1 v5 "Open loop" — 영문 릴리즈 + 직관성 + 공개 피드백 루프

- **영문 제품 데모 릴리즈**: `/en/underwrite` → `/en/underwrite/[id]` → `/en/passport/[id]` (전체 여권 9섹션·가격·RWA·서명 영어) +
  `/en/market` · `/en/agents`. KO/EN 전환이 **현재 경로를 유지**하고, EN 페이지 내부 링크는 전부 `/en/...`입니다.
- **직관적 데모 경로**: 하단 고정 **Demo Path bar**(1 사례 → 2 심사 → 3 여권, 다음 단계 CTA), 랜딩 3-step 스트립,
  각 데모 페이지 breadcrumb(`RAIL / DEMO / 02 UNDERWRITE`) + 한 줄 목적 + next-step hint, 여권 "how to read" 3줄.
- **공개 피드백 루프**: `/feedback`에서 30초 만에 GitHub Issue로 피드백/파트너 소개/직접 메시지 →
  48h 트리아지 → 7일 내 배포 → `/log`에 기록. `.github/ISSUE_TEMPLATE`에 feedback·partner-intro 폼 포함.
- **Hashed/Nitro 메모** `/nitro`: 김서준 대표께 직접 묻는 3개 질문(첫 wedge·8주 KPI·첫 파트너) + Nitro 기준으로 증명한 것 +
  다음 7일 공개 약속. 답은 GitHub Issue 또는 15분 통화로 받는 구조.
- **정합성 수정**: "2.4초" 카피와 실제 4-agent run(~5초) 불일치 제거, EN 랜딩 인라인 심사 → EN 여권 링크 수정,
  `/nitro`·`/feedback`·`/log`에서 EN 토글 404 방지(fallback), KO 회귀 0.

---

## 0.1 v4 "Case first" — 구조를 다시 잡았습니다

실사례 60개를 다시 검증한 결과, v3까지의 랜딩은 **"잘 만든 브랜드 선언문"**이지 최상위 제품의 구조가 아니었습니다.
실측: 10 viewports · 8 acts · action link 16개 · 실제 제품 조작까지 2클릭+페이지 이탈.
상위 제품은 **첫 화면에 제품 증거, 사례 우선, 단일 경로**를 씁니다.

- **구조 감사**: `research/design/structure-audit.md` (Linear/Stripe/Ramp/Attio/Cal.com 등 대비 실측)
- **v4 랜딩(6 acts, 5,050px = 5.6 viewports)**: Hero(판정 카드) → **Case file**(부산 5인 수출기업, 은행 3곳 거절) →
  **Live underwriter**(페이지 이동 없이 3인 탭 → 4 에이전트 → 판정) → Passport×RWA → Proof of rail(라이브·원장·크루) → Closing.
- **글로벌 파트너용 `/en`**: 네이티브 영어 랜딩(별도 8밴드: case·demo·passport·proof·architecture·trust·regulatory·closing) +
  EN one-pager PDF + KO/EN 토글 + hreflang/canonical.
- **냉정 감사**: `docs/global-qa.md` — "첫 화면은 강하지만 투자자 실사 표면은 C-" → P0(영어/PDF/라이선스/연락처/
  why-now/표기 불일치)를 이번 배포에 반영.
- 기존 v3.1 비주얼 자산은 유지: 60-site 벤치마크, Signal Rail 워드마크, 셀프호스팅 폰트, `motion` 14.5, ⌘K, 캐러셀.

- **60개 사이트 벤치마크** (Linear·Vercel·Stripe·Ramp·Mercury·Resend·Attio·Framer·Coinbase·Toss 등) →
  25개 레시피로 정리해 19개 반영: Hero 3요소 압축, 한글/라틴 분리 트래킹, 오렌지 시그널 워드마크,
  문장형 라이브 티커, Credit Events 원장, 인터루드 풀쿼트, 상태 마퀴, 보더 트레일 hover, ASCII 워터폴,
  ⌘K 커맨드 팔레트, 카드/섹션 문법 통일, accent 5% 규율. 출처·근거: `research/design/benchmark-60.md`
- **로고**: Direction A "Signal Rail" — **Archivo 600 · wdth 110 · −0.018em** 워드마크 + 베이스라인 오렌지 시그널 스퀘어.
  사각 마크/`CREDIT ENGINE` 서브라벨 제거. 22px/16px 실루엣 검증, 파비콘·OG·인쇄 동일 path. 스펙: `design/logo/README.md`
- **타이포**: Pretendard(한글, -0.01~-0.02em / 1.15+) · Archivo(브랜드·숫자) · Instrument Serif(라틴 액센트)
  · IBM Plex Mono(라벨/데이터). Archivo·Instrument Serif·Plex Mono는 **셀프호스팅(`public/fonts`)+preload로 FOUT 제거**.
- **모션**: OSS `motion` 14.5 — MaskedLines 히어로 word-roll + Reveal/Stagger/TiltCard + ScrollProgress + ⌘K
  + **페이지 간 페이드 전환(320ms)** + Hero 패럴랙스. 전부 reduced-motion 대응, entrance ≤800ms.
- **캐러셀**: 지원자 3인 신용 여권 reel — spring 트랙·드래그 스와이프·자동 5.6초·hover/focus 일시정지·도트/카운터/키보드.
  (`components/ui/carousel.tsx`, 모바일 가로 오버플로 0 검증)
- **데모 고지**: 화면 곳곳의 문구 제거 → **footer 최하단 1줄** + 여권 인쇄물 10px 1줄만.
- **MCP**: 신용 MCP(`mcp/server.ts`) + 아트 MCP(`mcp/art-server.mjs`).
  Higgsfield는 공식 MCP가 존재하지만 **유료구독 + 브라우저 OAuth** 필요 → 이번 라운드 미연결.
  프로필 `@jammingtadpole1418`은 확인했으나 **게시물 0개(공개 프로필)** 이며, 링크만으로 세션 권한이 생기지 않음.
  연결 절차·프롬프트 팩: `docs/higgsfield-prompt-pack.md`

---

## 1. 왜 지금 (Thesis)

한국의 은행은 세 변수로 신용을 판정합니다: **담보 · 업력 · 재무제표**.
이 문법은 20년간 주택담보대출에 최적화되면서, 실제 경제활동을 읽는 능력을 잃었습니다.

- 매년 **130만 개**의 사업체가 새로 생기지만, 대부분 은행 문턱을 넘지 못합니다.
- 수출대금의 **84.2%**(한국은행 2025)가 달러로 결제되지만, 원화 재무제표에는 잡히지 않습니다.
- 프리랜서의 소득은 **원천징수 영수증**이 없으면 신용평가 체계에 존재하지 않습니다.

동시에 돈과 자산의 레일이 바뀌고 있습니다.

1. **스테이블코인이 결제 인프라가 됩니다.** 크로스보더 정산이 분 단위로 줄고, 에이전트 결제(x402)가 그 위에 올라갑니다.
2. **증권형 토큰은 공통 레일입니다.** 기존 증권을 토큰에 얹는 것이 아니라, 권리·돈·조건·책임이 같은 거래에서 움직이는 구조.
   국내 토큰증권 전자증권법·자본시장법 개정안은 **2026-01-15 국회 통과**, **2027년 1월(잠정) 시행**을 앞두고 있습니다.
3. **신용의 정의권이 이동합니다.** 담보 대신 거래흐름·행동이력·온체인 증명으로 신용을 읽는 레이어가 필요합니다.

RAIL은 이 세 변화가 만나는 지점 — **수출채권** — 에서 시작합니다.
자산(수출채권)과 돈(스테이블코인)과 조건(신용 심사)이 한 거래 구조 안에서 움직이는 첫 번째 상품입니다.

## 2. 제품 데모 (What's in the box)

| Route | 내용 |
|---|---|
| `/` | 제품 선언문 + 실시간 RWA 티커 + 신용 여권 프리뷰 |
| `/underwrite` | 지원자 3인: 수출 중소기업 · 프리랜서 · 딥테크(IP) |
| `/underwrite/[id]` | **에이전트 심사 런** — SCOUT → VERIFIER → UNDERWRITER → BROKER가 증거를 수집·교차검증하고 점수·한도·금리를 계산하는 과정을 실시간으로 보여줍니다. |
| `/passport/[id]` | **신용 여권 아티팩트** — 증거 테이블, 점수 컴포넌트(산식 공개), 리스크 플래그, 약정, 가격 산식, RWA 증서(수출채권 토큰·펀딩·만기), 에이전트 서명. 인쇄/PDF·JSON·공유 지원. |
| `/market` | 실시간 스테이블코인 유동성·USD/KRW·토큰화 국채 벤치마크 + RWA 기상도 |
| `/agents` | 제품을 만든 에이전트 팀과 제작 기록 |

### 심사 예시 (한빛전자, 부산 5인 수출사)

- 은행: 3곳 거절 (담보 없음, 업력 2년, 달러 매출과 원화 재무제표 불일치)
- RAIL: 온체인 USDC 정산 87건 + 수출신고 + 구매주문서 교차검증 → **증빙 커버리지 72%**
- 결과: **등급 B · 1억 8,000만원 승인 · 연 8.55%** (벤치마크 4.15% + 스프레드 3.80%p + 환리스크 0.60%p)
- 조건: 상위 바이어 비중 50% 이하, USD/KRW 헤지, 정산 지갑 화이트리스트
- RWA: 수출채권 `RAIL-R-2026-0001` · Base · ERC-3643 · 풀 모집 62%

## 3. 아키텍처

```
rail-app/
  app/
    page.tsx                 랜딩
    underwrite/[id]/          에이전트 심사 런
    passport/[id]/            신용 여권 (인쇄/JSON/공유)
    market/                   라이브 RWA 컨텍스트
    agents/                   제작 기록
    api/market/route.ts       시장 스냅샷 JSON
  lib/
    types.ts                  도메인 타입
    profiles.ts               지원자 3인 + 증거 데이터
    engine.ts                 결정론적 심사 엔진 (점수·등급·한도·금리·약정·RWA 증서)
    market.ts                 DefiLlama/Frankfurter fetch + 30분 캐시 + fallback
    weather.ts                RWA 기상도 (룰 기반)
  mcp/
    server.ts                 MCP 서버 — 신용 엔진(심사·시장)을 에이전트 도구로 노출
    art-server.mjs            MCP 서버 — 아트 파이프라인(조회·재생성·상태)을 도구로 노출
  public/art/                 v2 생성 이미지 8종 (자체 생성, README 참고)
  scripts/art/                이미지 생성기 (numpy/Pillow, og HTML→Chrome)
  components/                 UI (noir/cream/signal/acid 디자인 시스템)
```

핵심 원칙: **LLM은 숫자를 만들지 않습니다.** 심사 엔진은 결정론적 규칙으로 계산하고(같은 입력 → 같은 결과),
에이전트는 증거 수집·교차검증·설명·중개를 담당합니다. 이 분리가 신용의 감사 가능성(auditability)을 만듭니다.

### 라이브 데이터 (모두 서버사이드 · 무료 · 키 불필요)

- **DefiLlama** — 스테이블코인 시가총액 **$305.0B**, 30일 변화, 상위 5개 (USDT·USDC가 83.6%)
- **Frankfurter (ECB)** — USD/KRW, 실패 시 open.er-api fallback
- **Hyperliquid HIP-3 `xyz`** — 코스피200·현대차·SK하이닉스·한국 ETF(EWY)·원/달러가 24/7 온체인에서 거래되는 perp 시세, 일 거래대금 **$3.6B** (2026-10-22 실측). "24/7 온체인 시장" 논지를 한국 데이터로 실증 (※ 현물이 아닌 파생상품 시세)
- **CoinGecko categories** — RWA **$76.9B** · 토큰화 사모신용 **$25.6B** · 토큰화 국채 **$9.3B** (집계 기준 명시)
- 30분 ISR 캐시, 실패 시 라벨된 fallback (데모가 빈 화면이 되지 않도록)

## 4. MCP (에이전트가 신용 엔진과 아트 파이프라인을 도구로 호출)

### 4.1 신용 MCP — `mcp/server.ts`
의존성 없는 stdio JSON-RPC MCP 서버. 노출 도구:

| Tool | 설명 |
|---|---|
| `list_applicants` | 심사 가능한 지원자 목록 |
| `underwrite_applicant` | `{ profileId }` → 신용 여권 JSON (점수·등급·한도·금리·플래그·약정) |
| `get_rwa_market` | 실시간 스테이블코인/FX/벤치마크 스냅샷 |

### 4.2 아트 MCP — `mcp/art-server.mjs`
v2 이미지 파이프라인을 에이전트 도구로 노출 (의존성 없음, stdio JSON-RPC):

| Tool | 설명 |
|---|---|
| `list_art_assets` | `public/art/*` 자산 목록·크기·수정시각 |
| `art_pipeline_status` | 로컬 생성기/Python/OG 렌더러 상태 + Higgsfield·Adobe 자격증명 감지 |
| `regenerate_art` | `scripts/art/gen_art.py --target …` 실행 |
| `regenerate_og` | 공유 카드 재렌더 |

> **Higgsfield / Adobe MCP 상태(2026-10-22 조사)**: Higgsfield는 공식 원격 MCP(`https://mcp.higgsfield.ai/mcp`)가
> 존재하지만 **활성 유료구독 + 브라우저 OAuth**가 필요하고, Adobe는 Enterprise 계약 + IMS OAuth가 전제라
> 이 환경에서는 연결 불가였습니다. 대신 파이프라인을 MCP로 노출해 **키/계정 확보 시 어댑터만 교체**하면 되도록 했습니다.
> 근거·단가·설정 JSON: `research/design/mcp-image.md`, 가이드: `docs/mcp-art.md`

실행 (Claude Desktop / Cursor / DSH 등 MCP 클라이언트에 등록):

```bash
cd rail-app
npx tsx mcp/server.ts      # 신용
node mcp/art-server.mjs    # 아트
```

```json
{
  "mcpServers": {
    "rail-credit": { "command": "npx", "args": ["tsx", "mcp/server.ts"], "cwd": "C:/.../rail-app" },
    "rail-art": { "command": "node", "args": ["mcp/art-server.mjs"], "cwd": "C:/.../rail-app" }
  }
}
```

이 구조의 의미: 심사 에이전트(고객사)가 우리 엔진을 MCP 도구로 호출하면, **신용 판정이 에이전트 간 거래의 기본 단위**가 됩니다.

## 5. 로컬 실행 / 배포

```bash
cd rail-app
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npx vercel deploy --prod   # Vercel deploy (Next.js 자동 감지)
```

Vercel 특이사항 없음 — Next.js 16 App Router, 서버 컴포넌트 + ISR, 환경변수 불필요.
외부 API는 모두 무료·키 불필요이며 서버사이드에서 30분 캐시합니다.

> **Windows 로컬 배포 팁**: 이 머신의 hostname이 비ASCII("투자왕")라 Vercel CLI 65가
> `Cannot convert argument to a ByteString`으로 실패합니다. 아래처럼 hostname override로 배포하세요.
> ```powershell
> $env:NODE_OPTIONS="--require=$PWD\scripts\cli-safe-host.cjs"
> npx vercel deploy --prod
> Remove-Item Env:NODE_OPTIONS
> ```

**배포 상태 (2026-10-22)**

| 항목 | 값 |
|---|---|
| Production alias | **https://rail-rwa.vercel.app** |
| Vercel project | `sura1818-8130s-projects/rail-rwa` |
| 빌드 | Next.js 16, 정적 5개 + 동적 2개 라우트, 30분 ISR |
| 라이브 데이터 검증 | DefiLlama `$305.01B` · USD/KRW `1,325.57` · Hyperliquid KR200 `879.8` (LIVE) |
| QA 스크립트 | `scripts/screenshot.mjs` (전 라우트 캡처 + 콘솔 오류 수집), `scripts/og-shot.mjs` |

### 제출용 데모 자산 (지원 패키지)

| 자산 | 경로 | 재생성 |
|---|---|---|
| 데모 영상 (1분 50초, 1440×900) | `rail-app/demo/RAIL-demo.mp4` (+ `poster.jpg`) | `cd rail-app && node scripts/demo/record.mjs` (ffmpeg 필요) |
| 1페이지 지원 요약 (A4 PDF) | `docs/RAIL-onepager.pdf` | `cd rail-app && node scripts/build-onepager.mjs` |
| 데모 스크린샷 | `screenshots/final/` | 
ode scripts/final-live-shots.mjs` |

영상 구성: 인트로 카드 → 히어로 → 문제/작동방식/여권/RWA 레일 → 시장(라이브) → 심사 런(에이전트 4명) → 신용 여권 → ⌘K → 아웃트로. 하단에 챕터 캡션(01–08) 표시.

## 5.1 적용한 OSS / MCP (품질 레버)

| 레버 | 사용 | 비고 |
|---|---|---|
| Next.js 16.4 · React 19.3 | App Router 서버 컴포넌트 + ISR | Turbopack 빌드 |
| Tailwind CSS v4.3 | 디자인 토큰 (`app/globals.css @theme`, v2 noir/acid/signal) | 별도 UI 라이브러리 없이 시네마틱 UI 직접 구현 |
| **motion 14.5 (MIT)** | 스크롤 리빌·카운트업·플로팅 | `components/ui/motion.tsx`, reduced-motion 대응 |
| Instrument Serif / Pretendard / IBM Plex Mono | 디스플레이·본문·데이터 타이포 | 전부 OFL 오픈소스 폰트 |
| lucide-react · clsx · tailwind-merge | 아이콘·클래스 유틸 | 번들 최소화 |
| **신용 MCP 서버** (`mcp/server.ts`) | 의존성 없는 stdio JSON-RPC 3 tools | 심사 엔진을 에이전트 도구로 |
| **아트 MCP 서버** (`mcp/art-server.mjs`) | 로컬 생성 파이프라인 4 tools | Higgsfield/Adobe 키 확보 시 어댑터 교체 |
| numpy · Pillow · headless Chrome | 크롬/그레인/오렌지/OG 이미지 생성 | 외부 스톡·생성 API 없음, 자체 생성물 |
| puppeteer-core (dev) | 전 라우트 스크린샷·콘솔 오류 QA | 배포 전 검증 |

다음 업그레이드 후보: `@modelcontextprotocol/sdk`(MCP 표준화), `@number-flow/react` 0.6(오도미터 카운트업),
Higgsfield MCP 연결(계정 확보 시), `recharts` 3.10(수출 실적 차트), `x402` 1.2(여권 조회 과금 데모, 테스트넷 한정).
디자인 리서치: `research/design/patterns.md` · `research/design/oss.md`

## 6. 에이전트 팀 (Agentic build)

이 데모는 2026-10-22 하루 동안 다음 팀이 만들었습니다.

| 역할 | 산출물 |
|---|---|
| Lead (사람 1명 + 총괄 에이전트) | 제품 정의, 심사 엔진, 데이터 레이어, QA, Vercel 배포 |
| telegram-analyst | 해시드 CEO 개인 채널 211개 메시지 → RWA 논지·인용·제품 기회 분석 |
| rwa-researcher | 글로벌 RWA/한국 규제/경쟁/무료 API/OSS·MCP 툴킷 리서치 |
| frontend-builder | 랜딩 · 시장 · 에이전트 페이지 (v2 시네마틱) |
| flow-builder | 심사 런 · 신용 여권 아티팩트 (v2) |
| design-researcher | 2026 MVP/랜딩 12개 실측 분석 · Higgsfield/Adobe MCP 타당성 · OSS 검증 |
| image-smith | v2 아트 자산 8종 자체 생성 (numpy/Pillow + Chrome) + 생성 파이프라인 |

리서치 문서: `../research/` (telegram / market / toolkit)
제작 기록: `/agents`, `AGENTS.md`

## 7. 로드맵 (Nitro 2기 8주)

1. **Weeks 1–2** — 디자인 파트너 3곳 (부산·대구 수출기업 / 팩토링사 / 무역보험) 인터뷰, 증거 스키마 확정
2. **Weeks 3–4** — 온체인 증거 수집기 (Base USDC 입금 + 수출신고 API + 플랫폼 정산 API) 실연결
3. **Weeks 5–6** — 신용 여권 10건 발급, 팩토링사 1곳과 조건부 매입 계약(LOI)
4. **Weeks 7–8** — ERC-3643 테스트넷 발행 + LP 1곳 파일럿, Game Day 데모

**KPI:** 발급 여권 10건 / 팩토링 LOI 1건 / 검증 커버리지 80% / 고객 인터뷰 20건

## 8. 규제 경로

- **단기:** 금융규제 샌드박스(혁신금융서비스) — 수출채권 검증·중개 범위
- **중기:** STO 법제화(전자증권법 개정) 통과 시 수출채권 수익권 토큰 발행
- **구조:** 원화 스테이블코인·USDC 정산은 기존 외환/특금법 테두리 내에서 파트너사 경유
- RAIL은 **심사·증거·발행 인프라**를 제공하고, 자금은 허가된 금융기관/LP가 공급하는 구조를 지향합니다.

## 9. 고지

RAIL은 데모 제품입니다. 실제 금융 서비스가 아니며, 신용 심사·수출채권 발행·온체인 투자 기록은
시뮬레이션입니다. 시장 데이터는 공개 API에서 조회합니다. 투자 권유가 아닙니다.
