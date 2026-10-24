# 구조 감사 — "60개 사례를 학습했을 때 이 구조가 최선이었나?"

- 작성: 2026-10-22 (KST) · 대상: v3.1 랜딩 (`https://rail-rwa.vercel.app`)
- 측정: headless Chrome 1440×900, 실측 DOM (스크립트: `rail-app/scripts/structure-audit2.mjs`)

## 0. 결론 (한 줄)

**아니었다.** 60-site 벤치마크에서 실제로 학습한 것은 "보이는 방식(visual system)"이었고,
**정보 구조(IA)는 v1의 목차를 그대로 유지**했다. 실사례의 구조 패턴과 비교하면 현재 랜딩은
"제품 데모"가 아니라 "브랜드 선언문 + 피치덱"에 가깝다.

## 1. 현재 구조 실측

| 항목 | 측정값 | 상위 제품군 관찰 |
|---|---|---|
| 페이지 높이 | **9,026px = 10 viewports** | 대부분 5–7 viewports (Linear/Stripe/Resend), 긴 페이지도 인터랙티브 아티팩트로 밀도 유지 |
| 섹션 수 | **7 + hero = 8 acts** | 5–7 acts; 첫 화면 다음에 바로 제품 증거 |
| 액션 링크 수 | **16개** (전체 링크 31) | 1개 primary CTA + 1 ghost가 표준 (Figma 1 CTA) |
| 첫 화면 | H1 + passport mock + CTA 2 + header 액션 7 | 제품 UI/플레이어블 아티팩트가 첫 화면에 (Linear 라이브 앱, Attio 플레이어블 데모, Cal.com 라이브 캘린더) |
| 첫 섹션 | `#problem` (은행 문법 3변수) 이론 설명 (y=919) | 제품 결과/사례가 먼저, 이론 설명은 없거나 뒤 |
| 제품 상호작용까지 | header CTA → `/underwrite/hanbit` → 8초 애니메이션 → 판정 (2 click depth, 페이지 이탈) | 스크롤 안에서 바로 조작 가능한 데모가 다수 |
| 실데이터/시장 | y=6,227 (69% 지점)의 별도 섹션 + `/market` 분리 | 첫 화면 또는 2번째 act에 라이브 숫자 노출 |
| 신뢰/기록 | Credit Events y=5,441 (60%) | dated proof는 보통 상단 또는 중단에 배치 |

## 2. 실사례가 지지하는 구조 원칙 (60-site 요약 재해석)

1. **product-first, 그 다음 서사**: 상위 12개 중 11개가 첫 화면에 제품 UI/플레이어블 아티팩트를 둔다.
   (Linear: 라이브 앱 + "2min ago", Attio: 스크러버 데모, Cal.com: 실제 캘린더)
2. **한 화면 한 결정, 하나의 경로**: primary CTA 1개. 보조 링크는 footer/문맥 안으로.
3. **이론보다 사례**: "문제 정의" 섹션은 거의 없고, **구체적 고객 사례/숫자**가 문제를 대신 설명한다.
4. **실데이터는 위로**: 라이브 지표·dated proof는 신뢰 형성 지점(첫 2 act)에.
5. **깊이는 페이지 수가 아니라 인터랙션으로**: landing에서 제품을 직접 조작하게 하고,
   깊은 플로우는 별도 route로.

## 3. 제안 구조 (v4, 6 acts)

| Act | 내용 | 근거 |
|---|---|---|
| 1. Hero | H1 + 한 줄 + **primary 1** (`한빛전자 3분 심사`) + ghost 1 (`1페이지 요약`) · 우측 **판정 카드**(은행 3곳 거절 → RAIL 승인, 실제 수치) · 하단 라이브 티커 | 제품 증거 첫 화면 (Linear/Stripe) |
| 2. Case file | "부산 5인 수출기업, 은행 3곳에서 거절" → 증거 → 판정 → RWA 발행. 담보/업력/달러 84.2%를 *이론*이 아니라 *이 사례의 근거*로 | 사례 우선 (Anthropic dated, Ramp metric) |
| 3. Live underwriter | 3인 지원자 탭 → `심사 실행` → 4 에이전트 진행(2.5s) → 판정 카드, **페이지 이동 없이** | 플레이어블 데모 (Attio/Cal.com) |
| 4. Passport × RWA rail | 지원자 캐러셀 + 5단계 레일 압축 (크롬 밴드) | 제품 아티팩트 + 오브젝트 반복 (Mercury/Resend) |
| 5. Proof of rail | 라이브 시장 지표 + Credit Events 원장 + 에이전트 크루를 한 act로 결합 | 실데이터·기록·팀을 신뢰 블록으로 |
| 6. Closing | 두 문: `데모 시작` / `Nitro 지원 패키지` + contact | CTA 2개 규칙 |

- 목표: 8 acts/16 action links/10 viewports → **6 acts / 6 action links 이하 / 7 viewports 이하**.

## 4. "해시드·글로벌 파트너 기준" 추가 갭

1. **영어 버전 부재**: 글로벌 파트너/Hashed 해외 네트워크가 읽을 수 있는 `/en`과 EN one-pager 필요.
2. **문의·신뢰 표면**: contact, GitHub, 라이선스, 데이터 출처 명시가 footer에 정리되어야 함.
3. **영상/PDF 자산의 언어**: 데모 영상·원페이저가 한국어뿐 → EN 버전 필요.
4. **제품 깊이의 증명**: "에이전트가 만든 데모"를 넘어, 실제 증거 스키마/검증 규칙/실패 로그를 보여주는
   아티팩트(예: `/agents`의 decision log, `AGENTS.md`)가 상위에서 보여야 함.
5. **일관된 국제 금융 표기**: USD/KRW, basis point, APR, T+0, ERC-3643 등 표기 통일 (대부분 충족).

## 5. 이번 라운드 실행 범위

- KO landing v4 재구성 (6 acts, CTA 축소, inline underwriter, 시장/에이전트 통합)
- `/en` 글로벌 파트너용 영어 페이지 + EN one-pager PDF + KO/EN 토글
- footer 정리(GitHub/contact/sources), OG EN
- 배포 + GitHub main 스냅샷 업데이트
- (다음 라운드) EN 데모 영상, 실제 고객 데이터 1건
