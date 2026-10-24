# RAIL v7 — "Quiet Confidence" (Coinbase × Apple)

> 사용자 피드백: "디자인을 전면 개편해야 해. 코인베이스 느낌의 애플 느낌으로. 지금은 AI 티가 엄청나서 너무 별로야."
> 목표: **AI가 만든 것처럼 보이는 요소를 전부 제거**하고, 신뢰·여백·정밀함으로 승부하는 메인스트림 핀테크 제품 사이트로 재구축.

## 1. 왜 지금이 AI 티인가 (제거 목록)

| AI 티 | 제거 |
|---|---|
| 다크 그라디언트 히어로 + 글로우 + 그레인/할프톤 | 평평한 warm white 배경, 그림자는 제품 카드에만 |
| 모노 대문자 eyebrow 라벨 도배 (`RWA CREDIT RAIL · SEOUL · 2026`) | 13px muted 문장 라벨, 대문자/자간 트래킹 제거 |
| 8–9px 초소형 텍스트, 낮은 대비 | 최소 12px, 본문 15–17px, AA 이상 |
| 크롬/메탈 텍스처, 스탬프, MRZ, 회전, 틸트, 터미널 크롬 | 없음. 제품은 **정면의 깨끗한 문서/카드**로 |
| acid green(라임) + 오렌지 + 블루 글로우 혼용 | 팔레트 4색 고정, 액센트는 5% 이하 |
| 섹션마다 다른 배경/보더/배지 | 하나의 표면 언어: white surface + hairline + 24px radius |
| 과잉 모션(티커 52s·캐러셀·카운트업·페이지 페이드) | 500ms fade/rise 12px, 상태 변화만 |
| 이모지·과장 카피·느낌표 | 짧고 담백한 카피 |

## 2. 디자인 토큰

```
--bg:        #F7F6F3   /* warm porcelain */
--surface:   #FFFFFF
--ink:       #0A0B0D
--ink-2:     #4A4F57
--ink-3:     #8A8F98
--line:      rgba(10,11,13,.08)
--line-2:    rgba(10,11,13,.14)
--accent:    #F04E23   /* vermilion — CTA/금액/판정에만 */
--accent-2:  #FFEDE7   /* accent tint */
--verified:  #0E7A5F
--canvas:    #0B0C0E   /* dark는 단 한 번, 제품 데모/마무리 */
```

- Radius: card 24px, chip 999px, input 14px
- Shadow: `0 30px 80px -40px rgba(10,11,13,.28)`, hairline border
- Grid: max-w 1120px, gutter 24px, section padding 96–128px
- Type: **Pretendard** (KO), **Inter** (Latin/numeric). 모노는 표의 숫자/ID에만.
  - Display 64/1.12, H2 40/1.2, H3 22/1.35, Body 17/1.65, Small 14/1.6, Label 13
  - 대문자 라벨 금지. 자간: 한글 -0.02em, 라틴 -0.01em.

## 3. 페이지별 IA

### 랜딩 (Apple-like 4막, 6,000px 이하)
1. **Hero** — eyebrow 문장(`수출채권 팩토링 · RWA`), H1 2줄(64px), 1문장 sub, CTA 2개(주 버튼 ink pill, 보조 텍스트 링크). 우측 **Credit Passport 제품 카드**(white, 정면, 부드러운 그림자) + 하단 얇은 live data line.
2. **Demo** — "3분 안에 직접 확인하세요." 지원자 chip 3개 + 실행 버튼 → 4 agents → 판정 카드. 라이트 UI, 한 화면 안에서 동작.
3. **Artifact** — 여권 문서 + RWA 레일 3단계. 탭/스텝 없이 정적인 제품 샷 + 짧은 설명. "1페이지 PDF" 링크.
4. **Proof & CTA** — 숫자 3개(은행 거절 사례, 2.4s/5.3s 판정, 라이브 시장), real vs simulated 한 줄, For Hashed/피드백 링크, 마지막 CTA.
- 제거: 티커 마퀴, case file 풀밴드, proof 원장 풀밴드, carousel 자동재생, 데모 경로 바.
- EN `/en` 동일 구조.

### 데모 (/underwrite, /underwrite/[id])
- Desk: 라이트. 지원자 3–4인 카드(둥근 모서리, hairline), 각 카드에 "은행 3곳 거절 / 2.4s 심사" 한 줄, 클릭 시 run.
- Run: 라이트 페이지 + **판정 카드 sticky**, 콘솔은 다크 캔버스 1개만(대비). Pause/Step/Replay, 판정 숫자 한도/APR 크게.
- Declined 케이스 1개 추가(엔진): 승인/거절이 함께 보이도록.

### 여권 (/passport, /en/passport)
- White A4 문서: 커버 상단 요약(한도/APR/기간/커버리지) → 근거 → 점수 → 리스크 → 약정 → 가격 → RWA 증서 → 서명.
- 라벨 12–13px ink-3, 데이터 15–17px, 숫자 44px. 모노는 ID/표 숫자만.
- 1페이지 PDF primary. 높이 4,500px 이하 목표.

### 보조 페이지 (/market, /agents, /nitro, /feedback, /log)
- 라이트 표면. 카드/표 중심, 모노 대문자 라벨 제거.
- /nitro는 **편지**: letterhead + 수신/발신/날짜 + 3문단 + 서명 + 링크.
- /market: 라이브 지표 카드 4개 + 표 2개.
- /agents: 크루 카드 + 타임라인.

## 4. 공통 셸

- Header: white/80 blur, h-16, wordmark ink, nav 13px(데모·사례·여권·For Hashed), pill CTA ink, EN 토글 텍스트, 모바일 메뉴.
- Footer: light, 3 columns, 14px, 데모 고지 1줄.
- 접근성: focus ring 2px accent, 대비 AA, reduced-motion 존중.
- 금지: 그라디언트(제품 카드 그림자 제외), glassmorphism, emoji, 대문자 모노 라벨.

## 5. QA 게이트

- 390/1440 overflow 0, 콘솔 오류 0
- 랜딩 높이 ≤6,000px, action link ≤8
- 모든 라벨 ≥12px, 본문 ≥15px
- 다크 섹션은 랜딩에서 최대 1개
- EN 동일 품질
