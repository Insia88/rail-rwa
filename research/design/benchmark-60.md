# RAIL v3 — 60-Site Benchmark & Apply Plan

- 수집: 2026-10-22 (KST), **60개 제품 사이트** (fintech · devtools · AI · crypto · Korean consumer)
- 방법: 6개 배치 × 10사이트, 홈페이지 `web_fetch` + CSS/구조 실측, 3+ 사이트 공통 패턴만 채택. 원본: workflow `rail-benchmark-50` (7 agents)
- 목적: "구조는 좋은데 멋이 없다" → **로고·타이포·모션·색 규율·증거(proof)** 4축을 최상위 제품 수준으로.

## 0. 사이트 목록 (60)

Linear · Vercel · Stripe · Ramp · Mercury · Family · Arc · Resend · Attio · Raycast ·
Framer · Luma · Higgsfield · Notion · Figma · Webflow · Superhuman · Height · Cal.com · Supabase ·
Railway · PlanetScale · Neon · Turso · Clerk · WorkOS · Anthropic · OpenAI · Mistral · Cohere ·
Runway · Midjourney · Pika · ElevenLabs · Synthesia · HeyGen · Coinbase · Kraken · Base · Uniswap ·
Aave · Phantom · Rainbow · MetaMask · Monad · Berachain · Solana · Ethereum · Hyperliquid · Dune ·
Nansen · DefiLlama · L2Beat · Toss · Daangn · Wanted · Channel.io · Ridi · Deel · Rippling

## 1. 25개 레시피 (rank = impact/effort 우선순위)

| # | 레시피 | 적용 파일 |
|---|---|---|
| 1 | **로고에서 사각형 마크 삭제.** 헤더는 22px 워드마크 + 1px 헤어라인. "CREDIT ENGINE"은 footer/OG로 강등 | `ui/logo.tsx`, `site/header.tsx` |
| 2 | **히어로를 3요소로 압축**: 한 문장 H1 · 라이브 facility/passport 오브젝트 · filled CTA + ghost CTA. 콜라주/아이콘/스크롤힌트 삭제 | `landing/hero.tsx` |
| 3 | **3-regime 타입 스케일**: Latin display -0.03em/1.02, **Hangul -0.01em/1.15+**, body 16–18px/1.55, mono label 10–11px +0.14em | `globals.css`, 각 페이지 |
| 4 | **문장형 라이브 티커**: 숫자 나열이 아니라 `이번 블록에서 발급된 여권 3건 · 커버리지 72.0% · 금리 8.55%` + absurd precision 1개 | `ticker`, hero |
| 5 | **색 규율**: orange = 가치/CTA, acid = 상태 칩만. 뷰포트당 chromatic area <5%, 그라데이션 wash 금지 | 전체 |
| 6 | **Act 기반 배경 토큰**: chapter마다 ground 밝기를 미세하게 바꿔 "챕터가 흐르는" 느낌 | `globals.css`, 섹션 |
| 7 | **로고월 대신 Credit Events 원장**: 날짜·이벤트·문서 링크 6행, 1px divider, 카드 없음 | `landing/credit-events.tsx` |
| 8 | **여권 카드가 히어로 오브젝트**: embossed claims(T+0 SETTLE / 72% VERIFIED / KRW 1.8억 / GRADE B)를 카드에 새김 | `landing/passport-card.tsx` |
| 9 | (보류) 히어로 필름 — poster-first, scroll-scrub | — |
| 10 | **섹션 문법**: 챕터 번호 + mono eyebrow + hairline + 40–56px sentence-case H2 + 1문장 | `section-head.tsx` |
| 11 | **인터루드 풀쿼트**: Instrument Serif 40–56px, 12단어 이내, byline 없음, 위아래 120px | 랜딩 |
| 12 | **시그니처 모션 1개**: H1 word-roll (MaskedLines), 그 외엔 12px rise + opacity만 | hero, `ui/motion.tsx` |
| 13 | **Footer 4열 사이트맵 + 11px mono 디스클로저 + 10px `RAIL CREDIT ENGINE · SEOUL`** | `site/footer.tsx` |
| 14 | **보더 트레일 hover**: 카드 테두리 1px conic trail, 표면은 정지(no lift/glow) | shared card |
| 15 | **OG를 같은 토큰으로**: 96px 워드마크 + 한 문장 + 1px 프레임, 글리프/그라데이션 없음 | `app/opengraph-image.png` |
| 16 | **ASCII 워터폴**: `SENIOR → MEZZ → EQUITY` box-drawing, 0.4% fee, p95 row | passport |
| 17 | **인제스천 로그**: PENDING→MATCHED 2초, 의도된 실패 3건, sticky footer `1,284 rows · 1,281 matched · 3 exceptions` | underwrite run |
| 18 | **상태 마퀴**: `COVENANT · PASSING / KYC · VERIFIED / TRANCHE · FUNDED` 40s, 40% opacity | 랜딩 seam |
| 19 | (보류) facility config tabs | — |
| 20 | **그레인 + 18% radial** 다크 챕터마다; mesh gradient 금지 | 전체 |
| 21 | **CTA 2개 규칙**: hero filled 1 + ghost 1, closing 두 문 | 랜딩 |
| 22 | (선택) 커서 추적 radial mask | hero |
| 23 | (보류) sticky-stack acts | — |
| 24 | **⌘K 팔레트**: 지원자/페이지 필터, Enter 이동, mono 키 힌트 — 데모가 조작 가능해짐 | Lead 구현 |
| 25 | **copy-prompt 칩**: `Add RAIL to my agent: rail.credit/SKILL.md [Copy]` 11px mono pill | closing/hero |

## 2. 로고 결론 (10+ 브랜드)

- **wordmark-first, mark-optional.** Webflow·Cal.com·Anthropic·Luma·Figma·Linear 모두 타입만으로 완결.
  `CREDIT ENGINE` 같은 서브라벨은 footer/OG로. (사용자가 지적한 현 로고 = 플레이스홀더 파비콘 문법)
- 헤더 56–64px, 워드마크 18–22px / weight 400–500 / -0.02~-0.03em / H1과 같은 24px 거터.
- 로고는 **무채색**, 오렌지는 focus ring·active chapter에만. 마크는 32px 파비콘 문제로 분리.
- 모바일에서 서브라벨 8px로 찌그러뜨리지 말고 **버린다**.

## 3. 타이포 결론

- 3-voice triad: Pretendard(UI/body) + Instrument Serif(display/quote) + IBM Plex Mono(label/data).
- **한글에 라틴 트래킹 금지**: 라틴 -0.02~-0.04em / 한글 -0.005~-0.01em, leading 한글 1.15–1.25.
- H1/H2는 라벨이 아니라 **주장(argument)**. emphasis는 headline당 1개(영문 serif italic 허용).
- 돈/APR/퍼센트는 `tabular-nums`, mono 라벨은 대문자 + +0.14em.

## 4. 모션 결론

- 페이지당 시그니처 1개(RAIL: **H1 word-roll + 여권 카드 settle**), 그 외 reveal은 12px rise.
- duration: entrance .24s cubic-bezier(.22,1,.36,1), stack .65s, ambient 6s, hover 120–160ms.
- 키프레임은 제품 동사로: `rail-settle`, `rail-scan`, `rail-draw`, `caret-blink`.
- stillness ceiling 준수 — film 1 + marquee 1 + row micro가 전부.

## 5. 컬러/이미지 결론

- 1 accent <5% area (Stripe #635BFF, Resend #62FFB3, Higgsfield #D1FE17처럼).
- warm black + elevated surface 1개 + hairline 1px가 텍스처. warm noir: #08090A / #191D20.
- 제품 표면이 곧 이미지. 반복 3D 오브젝트 1개(크롬 RAIL 카드)만.
- 다크에서 사진 대신 grain (3–4% opacity).
- 엔지니어링 다이어그램 = 모노 ASCII/1px labeled tiles (대시보드 차트 금지).

## 6. 안티패턴 (RAIL이 피할 것)

1. 사각 글리프 + 대문자 서브라벨 로고.
2. 그라데이션 mesh/오로라 배경.
3. 3-up 아이콘 카드 + 라운드 숫자 stat band.
4. orange+lime+cyan+violet 동시 사용.
5. JS scroll-jacking / 전부 로드 애니메이션.
6. 로고월 + 99.9%/$1B 라운드 수치.
7. 스톡 오피스 사진/3D 마스코트/아이소메트릭 일러스트.
8. 한글에 라틴 트래킹(-0.03em)·0.95 leading 적용.

## 7. 이번 라운드 반영 상태

- 반영: 1·2·3·4·5·7·8·10·11·12·13·14·16·17·18·20·21·24·25
- 보류: 9(히어로 필름 — 영상 자산 없음), 19(config tabs), 22(선택), 23(sticky stack — 성능/접근성 리스크)
