# RAIL — DESIGN V2 "Night Signal"

> 목적: 구조(정보 설계)는 유지하고, **첫 화면의 임팩트·색 배치·타이포·이미지**를 완전히 갈아엎는다.
> 현재의 "따뜻한 종이 문서" 톤은 정갈하지만 임팩트가 약하다. v2는 **시네마틱 다크 + 크롬 + 오렌지 이그니션 + 애시드 라임 데이터**.
> 키워드: ignition, chrome, rail, passport, telemetry, night.

## 1. 컬러 시스템

```
--ink        #070908   /* near-black, green tint */
--ink-2      #0C110F
--ink-3      #131A16
--paper      #F2EDE2   /* warm cream */
--paper-2    #E7DFCF
--signal     #FF4B1F   /* ignition orange (primary accent) */
--signal-2   #FF7B4D
--glow       #FFB39B   /* orange bloom */
--acid       #D9FF5C   /* lime — live/verified/data only */
--acid-dim   #A8C93F
--chrome-1   #6E7A74
--chrome-2   #E9EFEA
--line-dark  rgba(242,237,226,.14)
--line-light rgba(7,9,8,.14)
```

사용 규칙:
- **다크가 기본.** 랜딩은 다크 밴드(hero, how, rwa rail, market, footer)와 크림 밴드(problem, passport, crew, closing)를 교차.
- **오렌지는 "결정/행동"에만**: CTA 버튼, Problem 섹션 풀블리드 배경, 강조 단어, 라이브 점. 남발 금지.
- **애시드 라임은 "데이터/검증/라이브"에만**: LIVE dot, verified badge, 수치 강조, terminal 로그, ticker. 오렌지와 동시에 큰 면적에 쓰지 않는다.
- 크롬/그라데이션은 **이미지 안에서만**. UI 표면에 그라데이션 금지(버튼/카드 배경은 단색).
- 다크 배경 위 텍스트는 cream(#F2EDE2), 보조는 rgba(242,237,226,.62). 크림 배경 위 텍스트는 ink.

## 2. 타이포그래피

CDN (전부 오픈소스/OFL):
- 한국어: **Pretendard Variable** (기존 유지) — 디스플레이는 weight 800/900, tracking -0.04em.
- 영문 세리프 악센트: **Instrument Serif** (Google Fonts, italic 400) — 풀쿼트, 여권 제목, 숫자 옆 장식. "Editorial luxury" 포인트.
- 모노: **IBM Plex Mono** (기존) — 라벨/데이터/터미널.

스케일:
- Hero H1: `clamp(3.2rem, 7.4vw, 7.2rem)`, line-height .98, weight 800, letter-spacing -.045em. 마지막 단어만 오렌지 + 마침표.
- 섹션 H2: `clamp(2rem, 4.2vw, 3.6rem)`, weight 800, tracking -.035em.
- 영문 kicker: mono 10px, tracking .28em, uppercase, 색 acid/오렌지/크림 보조.
- 풀쿼트/감정 라인: Instrument Serif italic, `clamp(1.6rem, 3vw, 2.6rem)`, line-height 1.25.
- 본문: Pretendard 15–17px, line-height 1.75, word-break keep-all.
- 숫자: tabular, 크게(48–96px), 단위는 작게.

## 3. 첫 화면 (Hero) — "the money shot"

구성(데스크톱):
- 배경: `public/art/hero-rail.webp` 풀블리드 (다크 크롬 레일 + 오렌지 이그니션, 시네마틱 그레인). 위에 ink 55–75% 오버레이 + 하단 페이드.
- 좌상단: RAIL 로고(cream) + mono 상태 "SEOUL · 2026" + 우상단: 얇은 라이브 점(acid) + "MARKET LIVE".
- 좌측 대형 H1: `매출은 있는데,` / `신용이 없습니다.` ("없습니다" 오렌지). 아래 mono 서브: `RWA CREDIT RAIL · 수출대금 84.2%가 달러로 결제됩니다`.
- 본문 1–2줄, CTA 2개: primary 오렌지 `3분 데모: 한빛전자 심사` / ghost cream outline `RWA 시장 보기`.
- 우측: **floating passport card** — 크롬 엣지 + ink 표면, -2° 회전, 오렌지 글로우 그림자. 내용은 실제 result[0] 수치. 카드 뒤로 `passport-chrome.webp` 크롭 이미지가 살짝 비침.
- 하단: 풀폭 ticker (다크, acid live dots) — 기존 MarketTicker v2 스타일.
- **데모 문구 제거**: hero에서 "데모 제품" 라인 삭제. 대신 footer 최하단 1줄만.

모바일: H1 2줄 유지, 카드 아래로, CTA 풀폭, 배경 이미지 세로 크롭.

## 4. 섹션별 아트 디렉션

### 01 Problem — "BURN ORANGE"
- 풀블리드 **오렌지 밴드** (`orange-band.webp` 배경 + #FF4B1F 오버레이). 텍스트는 ink (오렌지 위 검정) — 강한 대비.
- H2: `은행의 문법은 세 변수로 작동합니다.` (ink, 800). 아래 3개 컴럼: 담보 / 업력 / 재무제표 — 각 상단 mono 번호, 두꺼운 ink 헤어라인.
- 큰 stat 3개 ink: 130만 개 / 84.2% / 1.28%. note cream-dark.
- 풀쿼트: Instrument Serif italic ink — "신용이 없는 것이 아니라, 신용이 은행의 문법 밖에 있는 것뿐입니다."

### 02 How — "NIGHT TERMINAL"
- 다크. 좌측 큰 H2 + 우측 RUN PROTOCOL 리스트(mono, acid dots).
- 4개 에이전트 카드: ink-2 표면, 1px line-dark, 상단 mono agent name + 오른쪽 상태(acid `IDLE`/`ON CALL`), 하단 실제 로그 1줄을 mono 11px acid 터미널 박스로.
- 배경에 `grain.png` 오버레이 + 아주 옅은 dot-grid.

### 03 Passport — "PAPER + CHROME"
- 크림 밴드. 좌: H2 `점수는 숨기지 않습니다.` + 4개 feature rows(헤어라인) + CTA.
- 우: **여권 아티팩트 카드** — 실제 결과 수치, ink 표면에 크롬 테두리(이미지 `passport-chrome.webp` 크롭), 회전 -1.5°, 오렌지 스탬프. Score/grade/limit/APR + 점수 바 2개 + ProvenanceBadge 2개.
- 배경: 옅은 paper-grid.

### 04 RWA rail — "CHROME TRACK"
- 풀블리드 다크 + `chrome-ribbon.webp` 배경(하단 페이드). 
- H2 cream: `자산과 돈이 같은 거래에서 움직일 때, RWA는 금융이 됩니다.`
- 5-step 레일: 수평 라인(acid) + 노드(오렌지 원), 각 단계 mono 라벨 + 1줄 설명. 모바일 세로.
- 숫자 3개: `$76.9B` / `$25.6B` / `$305B` — 큰 cream 숫자 + acid 단위.

### 05 Market — "TELEMETRY"
- 다크. H2 + LIVE 배지(acid). 
- 상단 4열 수치 스트립(헤어라인), 각 수치 40px+ cream, 라벨 mono.
- 24/7 온체인 한국자산: 가로 스크롤/그리드 테이블, markPx 크게, funding은 acid/오렌지 부호색.
- 날씨 시그널 카드: ink-2, horizon mono chip, 제목 800.
- 배경 `agents-scan.webp` 아주 옅게.

### 06 Crew — "TEAM SHEET"
- 크림. H2 `사람 한 명, 에이전트 네 명.` + 큰 Instrument Serif 인용.
- 4 에이전트를 "레이스 팀 시트"처럼: 큰 번호(01–04) + 이름 + role + runtime + status. 헤어라인 그리드.

### Closing CTA — "LAST LAP"
- 풀블리드 오렌지(또는 크롬+오렌지). 초대형 cream/ink 타이포 `담보가 아니라 흐름을 담보로.` + 서브 + primary CTA(ink 배경/cream 텍스트 또는 cream/ink).

### Footer
- ink 배경, cream 텍스트. 3컬럼(제품/데이터/에이전트 팀). 
- **데모 고지 1줄을 최하단 11px, rgba(cream,.45)로 작게**: `RAIL은 데모입니다. 실제 금융 서비스가 아니며 온체인 기록은 시뮬레이션입니다.` 다른 곳의 데모 배지/문구는 전부 제거.

## 5. 모션 (OSS: `motion`)

- `motion` 패키지 설치 (motion.dev, MIT). 
- Hero: 텍스트 stagger fade/slide up (0.06s 간격), passport card subtle float(6s loop, 3px), 배경 이미지 1.04→1.0 scale-in.
- 섹션 진입: whileInView fade-up 12px, once, viewport margin -80px.
- Ticker: CSS 무한 marquee 유지.
- 숫자: viewport 진입 시 count-up (직접 구현, 800ms ease-out).
- Passport card: hover 시 살짝 rotate/raise.
- `prefers-reduced-motion`에서는 전부 정적.
- Lenis smooth scroll은 도입하지 않는다(성능·접근성 리스크).

## 6. 이미지 자산 (자체 생성, 외부 라이선스 없음)

`rail-app/public/art/`에 생성. 전부 **자체 제작**(numpy/Pillow + Chrome 캔버스 렌더), 외부 스톡/생성형 API 사용 안 함(키 없음). 파일:

| 파일 | 크기 | 내용 |
|---|---|---|
| `hero-rail.webp` | 2400×1500 | 다크 크롬 레일 원근 + 오렌지 이그니션 글로우 + 필름 그레인 |
| `passport-chrome.webp` | 1600×1200 | 크롬/메탈 포일 추상 (여권 카드 배경용) |
| `orange-band.webp` | 2400×1200 | 오렌지 그라데이션 메시 + 크롬 반사 + 그레인 |
| `chrome-ribbon.webp` | 2000×1200 | 리퀴드 크롬 리본 (RWA 레일 밴드 배경) |
| `halftone-grid.webp` | 1600×1600 | 하프톤 도트 패턴 (오버레이) |
| `grain.png` | 512×512 | 무결 필름 그레인 타일 (alpha) |
| `agents-scan.webp` | 1600×1000 | 스캔라인/텔레메트리 텍스처 |
| `og-v2.png` | 1200×630 | 새 공유 카드 (v2 팔레트/타이포) |

사용 규칙: 다크 섹션 배경은 `background-image` + ink 오버레이(가독성). 이미지 위 텍스트는 항상 그림자/오버레이 확보. `next/image` 사용 시 `priority`는 hero만.

## 7. 데모 고지 정리 (전역)

- 삭제: hero 하단 "데모 제품 · …", market hero "DEMO DATA", underwrite 상단/하단 demo note, passport의 "데모" 반복 문구, agents 페이지 disclaimer 박스.
- 유지(작게): footer 최하단 1줄(11px), passport 인쇄물 최하단 1줄(10px), 데이터 fallback이 떴을 때만 "fallback" 라벨.
- 모바일 헤더 CTA 문구: "데모" → "여권 만들기".

## 8. OSS / MCP

- 추가 OSS: `motion` (MIT) — 설치. 폰트: Instrument Serif(OFL), Pretendard(OFL), IBM Plex Mono(OFL).
- MCP: 이 환경에는 Higgsfield/Adobe MCP 서버가 연결되어 있지 않고 키도 없음. 
  → `design/mcp-image.md`에 **연결 방법(설정 JSON, 필요한 env, 확인 사항)** 문서화 + `scripts/art-gen.mjs`에 provider 어댑터(local 기본, higgsfield/adobe는 키 설정 시 사용) 구조를 넣는다. 
  → 이번 라운드의 실제 자산은 local generator로 생성(자체 제작).

## 9. 품질 기준

- 1440 / 390 스크린샷에서 첫 화면만 봐도 "돈을 쓴 제품"처럼 보여야 한다.
- 다크↔크림↔오렌지 밴드의 리듬이 명확해야 하고, 스크롤 중 색 반전이 최소 3번 있어야 한다.
- 텍스트 대비 WCAG AA: 다크 위 cream(≈13:1), 오렌지 위 ink(≈6:1), 크림 위 ink.
- 새 콘솔 오류 0, 390px 가로 스크롤 0, reduced-motion 정상.
- 데모 고지는 footer 1줄 외 발견되지 않아야 한다.
