# RAIL v2 디자인 리서치 — "왜 비싸 보이는가"

- **작성**: 2026-10-22 (KST) · design-researcher · 대상: `rail-app/DESIGN-V2.md` "Night Signal"
- **검증 방법**: 각 사이트를 ① `web_fetch`로 공개 텍스트 확인, ② 로컬 headless Chrome(1440×1200, 2026-10-22 07:58–08:02 KST)으로 첫 화면을 캡처한 뒤 `getComputedStyle`로 폰트·크기·자간·배경색을 **실측**했다. 캡처 스크립트와 측정 원본 JSON은 `research/design/_capture/`에 남겼다(PNG 캡처는 용량·저작권 고려로 분석 후 삭제). 마케팅 사이트는 수시로 바뀌므로 수치는 확인일 스냅샷이다.
- **전제**: 2026년 상위권 랜딩의 공통점은 "구조"가 아니라 **대비·스케일·질감의 리듬**이다. RAIL v1(현재 스크린샷)은 구조가 이미 이겼고, v2는 그 위에 리듬을 얹는 작업이다.

---

## 1. 2025–2026 최고 수준 사례 12개

### 1) Linear — [linear.app](https://linear.app) (확인 2026-10-22)
첫 화면: 좌측 2줄 H1(실측 `64px / weight 510 / line-height 64px / letter-spacing −1.408px`), 한 줄 서브("Designed for the AI era."), CTA는 우상단 Sign up 하나뿐. 그 아래 **전체폭 실제 제품 화면**(이슈 DRV-8852, 에이전트 활동 로그, PR diff). 색: bg `#08090a` / 텍스트 `#f7f8f8` — 액센트가 거의 없는 무채색. 폰트: Inter Variable + Berkeley Mono(라벨). 이미지 11장 중 대형 1장, SVG 231개 = 화면 대부분을 이미지가 아니라 **마크업 UI**로 그린다. 증명: 히어로가 곧 제품이다. RAIL 시사: 히어로에 사진·일러스트가 아니라 "여권/심사 화면"을 넣는다.

### 2) Vercel — [vercel.com](https://vercel.com) (확인 2026-10-22)
첫 화면: 좌측 H1 `64px / weight 400 / letter-spacing −3.84px(=−0.06em)` "Agentic Infrastructure", 중앙에 검정 삼각형 하나(글로우), 우측에 3줄의 짧은 가치문("For coding agents / To ship apps and agents / Automated by agents"). bg `#fafafa`. 폰트 GeistSans + Geist Mono. 아래 로고월(Meta·DoorDash·OpenAI·SpaceX·Supreme·Polymarket). 텍스트 블록이 극단적으로 적고 여백이 화면의 70%를 차지한다. 증명: 첫 화면 상단의 "Drop to deploy" 인터랙션, "400+ models". RAIL 시사: 다크 히어로에서 정보를 덜어내는 결단.

### 3) Stripe — [stripe.com](https://stripe.com) (확인 2026-10-22)
첫 화면: 흰 배경 + 우측 대각선 컬러 웨이브(`canvas` 5개 중 히어로 1개), 좌측 H1 `48px / weight 300`에 키워드만 그라데이션 텍스트. H1 위에 **실시간 카운터** "Global GDP running on Stripe: 1.73625453%"가 있고, "business banking,¹"처럼 각주 번호를 쓴다. CTA 보라(`#635BFF`) 1개 + Google 가입. 하단 로고월 6개. 섹션 16개, 색은 히어로 아트에만 몰아넣고 나머지는 무채색. RAIL 시사: 시장 숫자를 히어로로 승격하고 `asOf`를 붙인다.

### 4) Ramp — [ramp.com](https://ramp.com) (확인 2026-10-22, 캡처는 타임아웃·HTML 텍스트 기준)
첫 화면: H1 "Time is money. Save both." + 이메일 입력 + "AGENTS AT WORK TODAY:" 이후 실시간 점유율 "US corporate payments processed by Ramp: 0.9427253%". 증명: 85,000개 기업, "3.2x faster", 고객사별 "$1M+ saved", 첫 페이지에 실명 후기 17개. 섹션 리듬: 기능 5카드 → AI 추천 입력 → "Systems that never spoke"(비주얼 스토리텔링) → Intelligence → Enterprise → 후기 벽. RAIL 시사: 숫자 뒤에 항상 출처·시점을 붙이는 습관.

### 5) Mercury — [mercury.com](https://mercury.com) (확인 2026-10-22)
첫 화면: **풀블리드 시네마틱 영상**(`video` 1개, `hero_start_frame`→`hero_end_frame` 크로스페이드) 위에 중앙 H1 `49.3px / weight 480`(arcadiaDisplay), 이메일 pill + "Launch demo". 히어로 최하단 중앙에 금융 고지 pill: "Mercury is a fintech company, not an FDIC-insured bank. Banking services provided through Choice Financial Group and Column N.A., Members FDIC." 증명: "Loved by 450K+", "$5.2B valuation", "$650M revenue"를 H2로 노출. RAIL 시사: 데모 고지를 히어로 하단 1줄 또는 footer 1줄로 — v1처럼 여러 곳에 반복하지 않는다.

### 6) Attio — [attio.com](https://attio.com) (확인 2026-10-22)
첫 화면: 흰 배경, 중앙 H1 `79.9px / weight 600 / letter-spacing −2.4px(−0.03em)`, 서브 2줄, CTA 2개. 그 아래 브라우저 창 목업(사이드바 + 워크플로 캔버스 + Run history + "Live" 토글 + 149 Completed / 2 Failed). 증명: "Trusted by 30,000+ customers", 그리고 H2 "**SDK. API. MCP.** Build anything on Attio." — MCP를 랜딩 카피에 넣는다. RAIL 시사: MCP 툴 3종을 자랑이 아니라 제품 기능으로 노출.

### 7) Resend — [resend.com](https://resend.com) (확인 2026-10-22)
첫 화면: 검정 `#000` 위 좌측 **세리프 H1 96px**(domaine) + 우측 3D 글로시 블랙 큐브, 상단 pill "Watch Resend Forward Live", CTA 흰 pill + 텍스트 링크. 본문은 Inter, 라벨은 ABC Favorit. `video` 5개, 이미지 63장. 증명: 첫 화면 바로 아래 코드 샘플 블록과 "Open source" CTA. RAIL 시사: 세리프(Instrument Serif) + 다크 + 단일 3D 오브젝트 조합은 v2와 정확히 같은 공식이다.

### 8) Raycast — [raycast.com](https://www.raycast.com) (확인 2026-10-22)
첫 화면: `#07080a` 위 중앙 H1 64px, 중앙 정렬 + 적색 대각선 광선 3D 배경 하나. CTA 아래에 모노 서브라인 "Windows 10+ (x64 or ARM64)" / "Install via WinGet", 보조 pill "The Raycast Keyboard →". 내비게이션은 떠 있는 라운드 pill 바. 증명: 설치 경로·버전 명시 = 실제 배포 제품이라는 신호. RAIL 시사: CTA 아래 mono 메타 한 줄("3분 · 규칙 엔진 · 재현 가능")을 붙인다.

### 9) Framer — [framer.com](https://www.framer.com) (확인 2026-10-22)
첫 화면: 검정, 좌측 H1 `54px / weight 500 / letter-spacing −2.16px`, 흰 pill + 다크 pill CTA, 우측 "New: Skills →". 그 아래 큰 라운드 프레임 안에 **에이전트 채팅 UI 영상(0:36)**. 증명: 하단 로고월(Dribbble·LEGORA·zapier·perplexity), `video` 4개. RAIL 시사: 히어로 안에 "심사 실행 장면"을 모션/영상으로 넣는 것이 가장 강한 증거.

### 10) Luma — [luma.com](https://luma.com) (확인 2026-10-22)
첫 화면: 흰 화면 위에 이벤트 커버 타일 12개가 방사형으로 떠 있고 중앙 H1 `80px / weight 500`, 단어 하나만 오렌지 그라데이션("start here"), 검정 pill CTA. 증명: 바로 아래 "Popular Events in Seoul" 실제 이벤트·시간 = 라이브 데이터. `h1`이 4개(카피 로테이션). RAIL 시사: 오프그리드 카드 배치 + 실데이터 조합.

### 11) Family — [family.co](https://family.co) (확인 2026-10-22)
첫 화면: 흰 배경, 좌우로 3D 일러스트 캐릭터 클러스터, 중앙 H1 `68px / weight 500`, 검정 pill 2개("Download on iOS" / "Watch the Video"). 증명: 제품 UI 조각 카드(송금·스왑·영수증, "Backing Up" 상태 pill, 트랜잭션 타임라인)와 `video` 9개. RAIL 시사: 여권 발급 스텝을 UI 조각 카드로 쪼개 보여준다.

### 12) Higgsfield — [higgsfield.ai](https://higgsfield.ai) (확인 2026-10-22)
첫 화면: `#0f1113`. H1 없이 대문자 H2("ONE CANVAS. EVERY WORKFLOW.", "SUPERCOMPUTER"), 상단 비디오 카드 3장(모델별 캡션), bento 그리드에 "**Higgsfield MCP for Claude**" 카드, 라임 CTA. 섹션 34개, `video` 18개, 이미지 41장. 증명: MCP/API가 GNB 최상위, 모델별 실사용 영상 썸네일. RAIL 시사: 라임을 "데이터/라이브"에만 쓰는 v2 규칙은 이 사례와 동일한 절제다.

**부록 — Arc** [joinarc.com](https://www.joinarc.com) (확인 2026-10-22): 상단 검정 뉴스 바, 중앙 H1 `64px / weight 300`, 제품 대시보드 스크린샷(`$12,085,769.59` 실숫자). 대형 이미지 5장 = 제품 화면이 곧 아트.

**실측 표** (headless Chrome 1440×1200, 2026-10-22)

| 사이트 | 배경(측정) | H1 실측 | 첫 화면 제품 증거 |
|---|---|---|---|
| Linear | `#08090a` | 64px / 510 / −1.408px | 전체폭 앱 UI |
| Vercel | `#fafafa` | 64px / 400 / −3.84px | Drop-to-deploy 인터랙션 |
| Stripe | 흰색+컬러 아트 | 48px / 300 / −0.96px | 라이브 GDP 카운터 |
| Mercury | `#171721` 영상 | 49.3px / 480 / normal | Launch demo + 450K+ |
| Attio | 흰색 | 79.9px / 600 / −2.4px | 앱 목업 + MCP 카피 |
| Resend | `#000` | 96px / 400 / −0.96px | 3D 오브젝트 + 코드 샘플(첫 스크롤) |
| Raycast | `#07080a` | 64px / 600 / normal | 설치 경로·버전 |
| Framer | `#000` | 54px / 500 / −2.16px | 에이전트 UI 영상 |
| Luma | 흰색 | 80px / 500 / −0.8px | 실제 이벤트 리스트 |
| Family | 흰색 | 68px / 500 / −1.36px | 제품 UI 조각 카드 |
| Higgsfield | `#0f1113` | H1 없음(대문자 H2) | 모델별 영상 카드 |
| Arc | 밝은 회색(스크린샷) | 64px / 300 / −0.96px | 대시보드 실숫자 |

**실측 요약**: 상위권 H1은 `48–96px`, 자간은 `−0.02em ~ −0.06em`(Vercel −0.06em가 최대), 본문은 16px 안팎, 그리고 **히어로에 제품 UI 또는 라이브 숫자 중 최소 하나**가 있다. 12개 중 11개가 첫 화면 또는 첫 스크롤 안에 제품 증거를 두었고(예외는 아트 중심의 Resend), 히어로 주비주얼은 사진 스톡보다 3D·제품 UI·타이포인 경우가 대부분이었다.

**섹션 리듬 관찰 4가지**: (a) 상위권은 히어로→증거→기능→수치→사회적 증명→CTA의 5–6막 구조를 반복하되, 막 사이 배경색을 바꾼다. (b) 기능 섹션은 카드 3–4개를 한 화면에 두고 카드마다 **모노 라벨 + 한 줄 설명 + UI 조각**의 동일 포맷을 쓴다. (c) 수치 섹션은 숫자를 40–96px로 키우고 단위·출처를 작게 붙인다(Stripe·Mercury·Attio 공통). (d) 마지막 CTA 직전에 반드시 **후기/로고/실데이터**를 한 번 더 놓아 결정을 밀어준다.

---

## 2. "왜 비싸 보이는가" 메커니즘 8개 + RAIL v2 레시피

**① 대비 리듬 — 색이 아니라 밝기의 반전**
Mercury(다크 영상 히어로), Stripe(흰 바탕+컬러 아트), Linear(전면 다크·무채색) — 상위권은 히어로의 밝기와 본문의 밝기를 의도적으로 다르게 잡고, 밴드마다 명도를 바꿔 스크롤에 리듬을 만든다. RAIL v1 홈은 다크 밴드가 **04 RWA 섹션 1곳뿐**(`home-desktop.png`). v2 레시피: `bg-noir`(hero) → `bg-signal`(problem) → `bg-paper`(passport) → `bg-noir`(rail) → `bg-noir`(market) → `bg-paper`(crew) → `bg-signal`(closing). 토큰은 `app/globals.css`의 `--color-noir/--color-signal/--color-paper` 사용, 섹션 루트에 클래스만 교체.

**② 여백이 아니라 밀도 대비**
Attio·Linear는 히어로가 비어 있는 대신 제품 목업 안이 매우 빽빽하다(10–11px 모노, 헤어라인, 상태 배지). "빈 화면 + 빽빽한 증거물"의 대비가 고급감을 만든다. RAIL 레시피: 히어로 텍스트는 `max-w-[16ch]`로 좁히고, 여권 카드 내부는 `text-[10px] font-mono tracking-[0.18em]` + `border-line-dark` 헤어라인으로 조밀하게. v1처럼 카드 안팎이 같은 밀도면 저렴해 보인다.

**③ 한 화면 한 메시지**
Vercel 히어로는 문장 3개다. RAIL v1 히어로는 eyebrow·H1·thesis 라벨·thesis·본문·데모 문구·목차 내비 = **7블록**(`components/landing/hero.tsx` L36–106). 레시피: H1 + 서브 1줄 + CTA 2개 + 아티팩트 1개로 줄이고, 목차 내비와 데모 문구는 히어로에서 제거(목차는 sticky sub-nav 또는 footer로).

**④ 이미지의 역할 = 배경이 아니라 증거/질감**
Mercury는 초현실적 장면을 브랜드 자산으로, Resend는 단일 3D 오브젝트를, Luma는 실제 이벤트 커버를 쓴다. 공통점은 "의미 없는 추상 이미지"가 없다는 것. RAIL 레시피: `hero-rail.webp`는 **분위기 배경**(ink 55–75% 오버레이 + 하단 페이드), 여권 카드는 **증거물**로 역할을 분리한다. `next/image`는 hero만 `priority`.

**⑤ 크롬·그레인 질감 — 화면 전체가 아니라 한 겹**
Resend의 글로시 블랙, Framer의 블루 글로우, Higgsfield의 크롬 3D 타이포. 질감은 국소적일 때 비싸 보인다. RAIL 레시피: `globals.css`의 `.grain-overlay`(opacity .16, mix-blend overlay)를 다크 섹션에만, `.chrome-text`는 숫자 1개 또는 로고에만. **UI 표면에는 그라데이션 금지**(DESIGN-V2 §1과 일치).

**⑥ 모노 라벨 = 계측기 느낌**
Linear Berkeley Mono, Vercel Geist Mono, Raycast GeistMono. 모노 라벨은 "이 화면은 측정된 데이터"라는 신호다. RAIL 레시피: IBM Plex Mono 10px / uppercase / `tracking-[0.28em]`, **섹션당 1개**(kicker), 그 외에는 표·수치·터미널 로그에만. v1은 모노가 9px로 너무 작고 여러 곳에 흩어져 계측기 느낌이 약하다.

**⑦ 마이크로 인터랙션은 화면당 1개**
Luma 타일, Raycast 키보드, Framer 에이전트 영상. 많으면 산만해지고, 1개면 "만든 사람이 디테일을 본다"는 인상을 준다. RAIL 레시피: 히어로 텍스트 stagger(0.06s) + 여권 카드 hover raise + ticker 무한 marquee. count-up은 숫자 섹션에서 1회만(800ms ease-out). `prefers-reduced-motion`에서 전부 정적.

**⑧ 오프그리드 배치 — 그리드를 깨는 1요소**
Luma의 방사형 타일, Vercel의 중앙 삼각형, Family의 좌우 클러스터. RAIL 레시피: 여권 카드를 `-2deg` 회전 + 컨테이너 오른쪽 밖으로 12px 브레이크아웃, ticker는 `max-w-6xl` 밖 full-bleed, 오렌지 밴드는 섹션 패딩 없이 화면 폭 100%. 단, 오프그리드는 **섹션당 1개**만.

---

## 3. 액셀러레이터/MVP 심사 관점 best practice 10

1. **"이미 움직이는 제품"을 증명한다.** Nitro by Hashed는 비즈니스 플랜이 아니라 **실제 제품과 개선 속도·지표**로 팀을 선발한다고 공개됐다(서울경제 영문판, 2026-04-27: [기사](https://en.sedaily.com/finance/2026/04/27/hashed-to-host-nitro-seoul-game-day-demo-day-for-ai-startups)). RAIL은 라이브 URL + 4개 라우트 + 결정론 엔진으로 답한다.
2. **3분 데모 구조를 고정한다.** 0:00–0:20 문제 한 문장 → 0:20–1:20 실제 입력으로 심사 실행 → 1:20–2:00 여권 아티팩트 → 2:00–2:40 시장·규제 숫자 → 2:40–3:00 팀/고지. 화면 전환은 4회 이하. 리허설 체크: ① 첫 프레임에 여권 점수·한도·APR이 보이는가 ② `건너뛰고 결과 보기`가 동작하는가 ③ 심사 중 숫자가 엔진 값과 일치하는가 ④ 마지막 프레임에 URL이 보이는가.
3. **첫 화면 3초 안에 산출물과 숫자.** 여권 카드(점수·한도·APR)가 첫 화면에 있어야 한다. v1도 카드는 있으나 종이 위 종이 카드라 대비가 약하다. 심사역이 스크롤 없이 "이 제품이 무엇을 출력하는가"를 답할 수 있어야 한다.
4. **실데이터와 시점을 붙인다.** Stripe·Ramp의 라이브 카운터처럼. RAIL은 `market.asOf` + `market.status`(live/fallback)를 히어로와 시장 페이지에 노출. 숫자가 정적이면 "데모"가 아니라 "목업"으로 읽힌다.
5. **폴백·시뮬레이션을 숨기지 않는다.** Mercury의 FDIC 고지, Ramp의 legal footer처럼 **작게, 그러나 명확하게**. RAIL은 footer 1줄 + 데이터 fallback 라벨만. 고지를 키우면 자신 없는 제품으로, 없애면 신뢰를 잃는 제품으로 읽힌다.
6. **MCP/오픈소스 신호를 카피에 넣는다.** Attio "SDK. API. MCP.", Vercel "MCP, and Skills", Resend "Open source". RAIL은 `mcp/server.ts`의 툴 3종을 footer·agents 페이지에 명시.
7. **숫자에 각주를 단다.** Stripe "business banking,¹", Mercury "banking¹" — 상위권 금융사도 각주 관례를 지킨다. RAIL의 84.2%·1.28%·$76.9B에도 ¹²³를 붙이고 하단에 출처 1줄.
8. **"데모" 표기는 1곳.** v1은 히어로(`hero.tsx` L87)·market DEMO DATA·underwrite·agents 4곳에 반복된다. DESIGN-V2 §7대로 footer 최하단 11px 1줄 + 인쇄물 1줄만 남긴다. Stripe는 각주, Mercury는 히어로 하단 pill, Ramp는 legal footer — 셋 다 **본문에서는 주장하고, 고지는 한 곳에서만** 말한다.
9. **심사역이 직접 클릭할 아티팩트를 준비한다.** 공유 URL, JSON 다운로드, 인쇄(PDF). RAIL은 이미 `/passport/[id]`에 `CopyButton`·`PrintButton`·JSON 다운로드가 있다. 데모데이 현장에서 "직접 해보세요"라고 말할 수 있는 링크 1개를 정한다.
10. **빌드 로그와 팀 구성을 보여준다.** Nitro가 8주 스프린트 결과물을 데모데이에서 공개하는 구조와 같다. RAIL `/agents`의 빌드 크루·타임라인을 유지하고, "사람 1명 + 에이전트 4명" 서사를 유지.

---

## 4. RAIL v2 우선순위 수정 리스트 12개

> 라인 번호는 2026-10-22 v1 파일 기준이며, v2 작업이 진행 중이므로 라인은 이동할 수 있다. 클래스·구조 레벨의 지시는 그대로 유효하다.

| # | 문제(현재 스크린샷 근거) | 파일 | 수정 |
|---|---|---|---|
| 1 | 히어로 텍스트 7블록(eyebrow·H1·thesis·본문·데모문구·목차) | `components/landing/hero.tsx` L36–106 | H1+서브1줄+CTA2+카드로 축소, 데모 문구·목차 제거 |
| 2 | 히어로 배경 이미지 없음(페이퍼 그리드만) | `components/landing/hero.tsx` | `hero-rail.webp` full-bleed + ink 오버레이 + 하단 페이드 |
| 3 | 여권 카드가 종이 위 종이 카드(대비 약함) | `components/landing/passport-card.tsx`(v2 신규) | ink 표면 + 크롬 테두리 + `-2deg` + 오렌지 글로우 |
| 4 | 다크 밴드 1개(04 RWA)뿐 → 리듬 없음 | `problem-section.tsx`, `rwa-rail-section.tsx`, `closing-cta.tsx` | 오렌지 풀블리드 problem, 다크 rail, 오렌지 closing으로 3회 반전 |
| 5 | 모노 라벨 9px·다중 위치로 계측기 느낌 약함 | `components/ui/section.tsx` | kicker 10px / `tracking-[0.28em]` / 섹션당 1개로 통일 |
| 6 | 스탯이 40px 고정, 숫자 임팩트 부족 | `components/ui/stat.tsx` | `clamp(48px,7vw,96px)` + tabular + count-up |
| 7 | 섹션 질감 없음(단색 배경) | `app/globals.css` (.grain-overlay/.bg-halftone 존재) | how·rwa·market 섹션에만 그레인/하프톤 적용 |
| 8 | 시장 첫 화면이 표 위주, 라이브감 없음 | `components/market/market-hero.tsx`, `market-numbers.tsx` | LIVE 배지 + `asOf` + 4열 큰 숫자(40px+) |
| 9 | 데모 문구가 여러 곳에 반복(DESIGN-V2 §7에 4곳 이상 명시) | `hero.tsx`, `app/market/page.tsx`, `app/underwrite/[id]/page.tsx`, `app/agents/page.tsx` | footer 1줄 외 전부 삭제 |
| 10 | 히어로 모션 부재(CSS rise만) | `components/ui/motion.tsx`(v2 신규), `hero.tsx` | stagger 0.06s + whileInView 12px, reduced-motion 정적 |
| 11 | 여권 페이지 표지가 크림 배경 위 ink → 대비 부족 | `components/flow/passport-cover.tsx` | 다크 표지 + 크롬 라인 + 스탬프 오렌지 (화면 전체에서 유일한 다크 아티팩트) |
| 12 | OG 카드가 v1 팔레트 | `app/layout.tsx`, `public/art/og-v2.png` | v2 팔레트·타이포로 교체, `metadataBase`/OG 경로 갱신 |

---

**수용 기준(AC)** — 1440/390 스크린샷에서 첫 화면만 봐도 ① 여권 카드의 점수·한도·APR이 읽히고 ② 스크롤 중 배경 반전이 3회 이상이며 ③ 다크 섹션 텍스트 대비가 WCAG AA(크림 `#F2EDE2` on ink ≈ 13:1, ink on 오렌지 ≈ 6:1)를 넘고 ④ 데모 고지가 footer 1줄 외에는 발견되지 않고 ⑤ `prefers-reduced-motion`에서 모션이 전부 정지되고 ⑥ 390px 가로 스크롤이 0이면 통과.

## 5. 결론

RAIL v1의 정보 설계는 이미 상위권과 같은 층이다. 부족한 것은 ① 히어로의 **한 메시지화**, ② 다크·오렌지·크림의 **3회 이상 반전 리듬**, ③ 질감(그레인·크롬)과 스케일 점프다. 이 3개만 고쳐도 "잘 정리된 문서"에서 "돈을 쓴 제품"으로 넘어간다. 디자인 방향은 Resend(다크+세리프+단일 3D)와 Attio(제품 UI 증거)의 중간이 RAIL v2의 정답에 가장 가깝다.

## 출처 (모두 2026-10-22 확인)

- 사례: [linear.app](https://linear.app) · [vercel.com](https://vercel.com) · [stripe.com](https://stripe.com) · [ramp.com](https://ramp.com) · [mercury.com](https://mercury.com) · [attio.com](https://attio.com) · [resend.com](https://resend.com) · [raycast.com](https://www.raycast.com) · [framer.com](https://www.framer.com) · [luma.com](https://luma.com) · [family.co](https://family.co) · [higgsfield.ai](https://higgsfield.ai) · [joinarc.com](https://www.joinarc.com)
- Nitro by Hashed 선발 기준·데모데이: [서울경제 영문, 2026-04-27](https://en.sedaily.com/finance/2026/04/27/hashed-to-host-nitro-seoul-game-day-demo-day-for-ai-startups) · [벤처스퀘어, 2026-04-27](https://www.venturesquare.net/en/1078484/)
- 측정 원본: `research/design/_capture/data.json`(로컬 캡처, 2026-10-22 07:58–08:02 KST)
