# RAIL — QA / 배포 검증 리포트 (v3 "Signal Rail")

- 검증 시각: 2026-10-22 (KST) · 대상: **https://rail-rwa.vercel.app**
- 도구: puppeteer-core + Chrome headless (스크롤 워밍업 후 캡처, 콘솔/요청 오류 수집)
- 스크린샷: `screenshots/v4/` (v3 최종), `screenshots/v3/` (v2), `screenshots/` (v1 아카이브)

## 1. 라우트 (배포 후)

| Route | HTTP | 크기 | 콘솔 오류 | 비고 |
|---|---|---|---|---|
| `/` | 200 | ~168 KB | 0 | 60-site 레시피 반영 랜딩 (7챕터 + Credit Events 원장) |
| `/market` | 200 | ~126 KB | 0 | DefiLlama/FX/Hyperliquid LIVE |
| `/agents` | 200 | ~91 KB | 0 | 런타임/빌드 크루 |
| `/underwrite` | 200 | ~74 KB | 0 | 지원자 데스크 + BorderTrail |
| `/underwrite/hanbit` | 200 | ~52 KB | 0 | 심사 런 + INGESTION·LEDGER |
| `/passport/hanbit` | 200 | ~190 KB | 0 | 여권 + ASCII 워터폴 |
| `/api/market` | 200 | 2.2 KB | 0 | JSON 스냅샷 |
| `/opengraph-image.png` | 200 | 482 KB | 0 | v3 워드마크 반영 OG |
| `/icon.png` | 200 | 705 B | 0 | Direction A 파비콘 |

## 2. 라이브 데이터 (2026-10-22)

`asOf=2026-10-22 · USD/KRW 1,325.57 · stablecoin $305.0B · Hyperliquid KR200 LIVE` —
DefiLlama · Frankfurter(ECB) · Hyperliquid HIP-3 3종 모두 LIVE, 실패 시 라벨된 FALLBACK.

## 3. v3 디자인 QA

| 항목 | 결과 |
|---|---|
| 로고 | Direction A 워드마크("RAIL." + 오렌지 시그널 스퀘어) 적용, 서브라벨/사각 마크 제거 |
| Hero | 3요소 압축(H1 word-roll + 여권 오브젝트 + CTA 2개), MaskedLines 시그니처 모션 |
| 섹션 문법 | CH.01–07, mono eyebrow +0.16em, hairline, 40–56px sentence-case H2 |
| 타이포 | 한글 -0.015em/1.15+ · 라틴 -0.03em · 숫자 Archivo tabular |
| 색 규율 | orange=가치/CTA, acid=상태 칩만, accent 면적 <5% |
| 신규 섹션 | Credit Events 원장(6행) · Interlude 풀쿼트 · Status Marquee |
| ⌘K | 커맨드 팔레트(지원자/페이지/데이터 검색, 키보드 내비) |
| 모션 예산 | 페이지당 시그니처 1개 + reveal + hover, ≤800ms, reduced-motion 정적 |
| 데모 고지 | footer 최하단 1줄 + 여권 인쇄물 10px 1줄만 |
| 반응형 | 390 / 768 / 1440 캡처, 가로 스크롤 0 |

## 4. 60-site 벤치마크 반영 상태

- 반영 19/25: 로고, hero 3요소, 타입 스케일, 문장형 티커, 색 규율, Credit Events, embossed claims,
  섹션 문법, 인터루드, 시그니처 모션, footer 사이트맵, 보더 트레일, ASCII 워터폴, 인제스천 로그,
  상태 마퀴, 그레인, CTA 규칙, ⌘K, copy-prompt 칩
- 보류: 히어로 필름(영상 자산 없음), config tabs, sticky-stack acts(접근성/성능 리스크)
- 근거 문서: `research/design/benchmark-60.md`

## 5. 알려진 한계

1. 심사 대상 3인은 데모 페르소나 — footer 1줄 고지.
2. 온체인 발행·LP·모집률은 시뮬레이션 — 여권 인쇄물 1줄 고지.
3. 벤치마크 금리 4.15%는 데모 가정 (리서치에 `확인 필요`).
4. RWA 규모는 집계 기준 명시(CoinGecko $76.9B, 기관별 $38B~$77B).
5. Hyperliquid는 perp 시세(현물 아님) — UI 명시.
6. **Higgsfield/Adobe MCP 미연결**: 프로필(`@jammingtadpole1418`, 게시물 0)은 확인했으나 공개 링크로는
   OAuth 세션/키를 얻을 수 없음. 유료구독 OAuth 또는 API 키 필요 → `docs/higgsfield-prompt-pack.md`에
   프롬프트 팩·연결 절차·예상 비용($0.20 수준) 준비 완료.
7. CountUp 제거(수치 정적) — 모션 예산 준수 목적.
