# RAIL v4 글로벌/Hashed QA 감사

- **작성**: 2026-10-22 (KST) · design-researcher
- **감사 대상**: 라이브 **v3.1** — https://rail-rwa.vercel.app (2026-10-22 배포본). 보조: 로컬 http://127.0.0.1:3100
- **방법**: headless Chrome 1440×900으로 DOM/좌표/타임라인 실측 + HTTP 상태·헤더 검사 + GitHub raw 확인. 측정 스크립트·원본 JSON은 세션 temp(`rail-qa/audit.json`, `probe.json`)에 있고 저장소에는 남기지 않았다. 스크린샷은 `screenshots/final/`(v3.1), `screenshots/final2/`(캐러셀).
- **버전 주의(중요)**: 로컬 3100은 `next start`(PID 10528)로 **v3.1 프로덕션 빌드를 서빙 중**이다. v4 재구성(`app/en/`, `components/landing/hero-band.tsx`·`case-file-band.tsx`, `components/en/*`, footer/header 수정, `robots.ts`·`sitemap.ts`, EN one-pager)은 **코드에만 존재하고 아직 빌드·배포되지 않았다.** 따라서 본 감사는 **라이브 v3.1 기준**이며 v4 예정 변경은 `[v4]`로 별도 표기한다. v4 실측은 rebuild 후 재감사 필요.
- **냉정한 한 줄**: **첫 화면은 이미 강하다. 그러나 첫 60초는 "무엇/작동/누구"만 통과하고 "왜 지금/신뢰/글로벌 접근"이 60초 밖에 있거나 아예 없다.** Hashed 파트너가 30초 만에 결론을 내리는 상황을 가정하면, 제품 데모는 A-, 투자자 실사 표면은 C-다.

---

## 1. 첫 60초 평가 (실측)

> 환산 초 모델: 히어로 8초 체류 + 이후 1 viewport(900px)당 3초 스캔(빠른 검토). 실제 읽기 속도에 따라 ±20%. 좌표는 절대 y(px), 1440×900 기준.

| # | 질문 | 첫 노출 위치(실측) | 환산 초 | 근거 | 판정 |
|---|---|---|---|---|---|
| a | **무엇을 하는지** | H1 y=307(첫 화면) · 본문 y=525 · "CREDIT PASSPORT 73.4 B / 1억 8,000만원 / 8.55%" 카드 첫 화면 내 | ~8s | H1은 은유("매출은 있는데, 신용이 없습니다")지만 여권 카드가 산출물을 즉시 보여줌. 금융 리터러시 있는 심사역은 10초 내 이해 | **PASS** |
| b | **실제로 작동하는지** | CTA "한빛전자 3분 심사" y=617 → 클릭 | 클릭 시 0.56s 도착 + 13ms 판정 표시(SSR) + **7.2s 애니메이션** | 2클릭/2페이지 전환, 판정은 스크롤 없이 첫 화면에. 단 랜딩 안에서는 작동 장면을 볼 수 없음 | **PASS** (클릭 시) / **PARTIAL** (랜딩만 볼 때) |
| c | **누구를 위한 것인지** | "담보 없는 기업" H1·본문(첫 화면) · "수출기업" y=1,153 · "수출 중소기업" y=3,807 | ~8s(암시) / ~9s / ~18s | 첫 화면은 "담보 없는 기업"으로 일반화. 명시적 세그먼트(수출 중소기업·프리랜서·딥테크)는 4번째 viewport | **PASS**(암시) ~ **PARTIAL**(명시) |
| d | **왜 지금인지** | 스테이블코인 데이터 y=892(데이터일 뿐) · RWA 레일 서사 y=4,497 | ~20s(개념) | "왜 지금"을 주장하는 블록이 없음. 규제 캘린더("2026-01-15 통과, 2027년 1월 시행(잠정)")는 **`/market` 페이지에만** 존재 | **PARTIAL** |
| e | **신뢰할 근거** | LIVE·asOf y=892(첫 화면) · 출처·집계 기준 y=5,035~5,099 · GitHub/연락/라이선스 **전무** | ~10s(마켓 데이터) / ~22s(출처) / ∞(실사) | 데이터 신뢰 표면은 22초 안에 나오지만, 파트너 실사 표면(공개 repo 링크·문의·라이선스·보안)이 사이트 어디에도 없음 | **FAIL**(파트너 실사) / **PARTIAL**(데이터) |

**첫 60초 추가 실측**
- 첫 화면 구성: H1(y=307) · 본문(y=525) · CTA 2개(y=617) · 여권 카드(점수/등급/한도/APR) · 하단 라이브 티커(y=892). **첫 화면에 제품 산출물과 숫자가 동시에 보인다 — 이건 상위 10% 수준.**
- 첫 화면 링크 9개(내비 5 + SEARCH + 헤더 CTA + 히어로 CTA 2), 페이지 전체 링크 31개·가시 인터랙티브 29개.
- 로드: networkidle2 기준 4.76s(첫 로드), HTML 응답 0.74s, 콘솔 오류 0. 서버 `icn1`(서울 리전).
- 언어: `html lang="ko"`, 본문 서사 100% 한국어. `/en`은 **404**, hreflang 0, canonical 없음.

---

## 2. Hashed 렌즈 체크리스트 (7항목)

| 항목 | 판정 | 근거(실측/파일) | 보완 포인트 |
|---|---|---|---|
| **제품 완성도** | **PARTIAL (높은 데모 완성도)** | 6개 라우트 전부 200, 콘솔 오류 0, 결정론 엔진, 실데이터 4종, 여권 아티팩트(인쇄/PDF·JSON·공유), ⌘K. 단 인증·영속화·실연결 수집기 없음 | "데모 완성도"와 "제품 완성도"를 구분해 말할 것. 데모데이엔 완성도로 이기고, 실사에선 로드맵으로 답해야 함 |
| **실제 트랙션** | **FAIL (정직하게 0)** | 사이트에 사용자 수·인터뷰·LOI 없음. footer 1줄 데모 고지만 | 트랙션을 꾸미지 말 것. 대신 "pre-launch, 인터뷰 N건 예정"을 명시하고 8주 KPI를 사이트에 노출 |
| **팀/에이전트 운영 방식** | **PASS (차별점)** | `/agents`: "4 RUNTIME · 5 BUILD", 빌드 로그·타임라인. README에 역할표. Nitro가 보는 "실제 제품+개선 속도"와 정합 | 에이전트 수가 소스마다 다름(사이트 4 runtime/5 build · README 표 7행 · EN one-pager "1 human + 7 agents") → **숫자 통일 필요** |
| **AI가 핵심 가치에 깊이** | **PARTIAL** | Ticker·캐러셀·이벤트 원장까지는 제품. 그러나 LLM이 제품 루프에 없고(숫자는 결정론 엔진), AI는 "빌드 방식+에이전트 서사"에 가까움. MCP 2종(신용·아트)은 존재하나 사이트에서 데모되지 않음 | "왜 LLM을 쓰지 않는가(감사가능성)"를 1문장으로 명시하고, MCP 호출 장면을 사이트에 노출하면 오히려 AI-native 논지가 강해짐 |
| **복제 불가 자산** | **PARTIAL** | 결정론 심사 스키마·증거 provenance 모델, 리서치 코퍼스(텔레그램 211개 메시지·시장/규제 문서), 하루 빌드 속도 | 아직 데이터 네트워크·실고객·라이선스가 없음. "복제 불가"라고 말하려면 실데이터 1건이 먼저 |
| **고객 무전/GTM** | **FAIL (사이트 기준)** | 랜딩·푸터에 GTM·고객·파트너·문의 채널 없음(외부 링크 0). README 로드맵에만 존재 | 최소한 "디자인 파트너 3곳 인터뷰 예정/진행"과 contact 1개는 사이트에 있어야 함 |
| **규제 이해** | **PARTIAL** | `/market`에 규제 캘린더, footer 고지, README §8, EN trust band(라이선스·규제 경로) | KO 랜딩 표면에는 없음. 규제 주장(2026-01-15 통과/2027 시행)에 **출처 링크**가 없다(리서치 문서에는 있음) → 사이트에도 각주 필요 |

---

## 3. 글로벌 파트너 렌즈

| 항목 | 실측 결과 | 판정 | `[v4]` 변경 예정 |
|---|---|---|---|
| **영어 접근성** | `/en` **404**, hreflang 0, `html lang="ko"`, canonical 없음, 영문은 라벨·숫자뿐 | **FAIL** | `app/en/page.tsx` + `components/en/*` 존재(8밴드 EN 카피, 문장 품질 양호), 헤더 KO/EN 스위치, `alternates.languages {ko:"/", en:"/en"}`·canonical 코드 추가됨. 단 `app/en/layout.tsx`가 없어 `<html lang>`은 여전히 `ko`, 루트의 `canonical: "/"`가 다른 라우트에 상속되지 않는지 확인 필요 → 수정 후 배포 |
| **국제 금융 표기** | "1억 8,000만원"·"1.8억 KRW limit" 혼용, 날짜 `2026.10.22`, `%p`와 `bp` 혼용, USD 환산 없음 | **PARTIAL** | 병기 필요: `KRW 180,000,000 (≈ USD 135,800 @ 1,325.57)` · `2026-10-22` ISO · `%p`로 통일 |
| **데이터 출처/집계 기준** | footer DATA 6종 + 랜딩 각주 "출처: CoinGecko categories · DefiLlama, 2026-10-22", "집계 기준 명시(RWA $38B~$77B 격차)", API JSON `source`·`asOf` 포함 | **PASS(명시) / PARTIAL(검증)** | 출처에 **클릭 링크**가 없음(외부 링크 0). 링크·원문 표기 추가 |
| **라이선스·보안·프라이버시** | 사이트 라이선스 언급 0. GitHub `LICENSE` **404(미푸시)**. `/terms` `/privacy` 404. HSTS ✓, CSP·X-Frame-Options ✗, security.txt ✗. 폰트 2개(Pretendard jsDelivr, Noto Serif KR Google)는 제3자 CDN | **FAIL** | `LICENSE` 커밋 + privacy/terms 최소 페이지 + 보안 헤더. 폰트 완전 셀프호스팅 |
| **contact/법적 고지** | 문의·이메일·GitHub 링크 **0**. 데모 고지는 footer 1줄(✓, 정책 준수). © 2026 표기 | **FAIL(contact) / PASS(고지)** | footer "Docs & Contact"(GitHub·Issues·one-pager) 추가 + EN trust band의 라이선스 문구 KO에도 |
| **GitHub 품질** | 공개 repo(raw 200), README **16,311B** 한국어 심층(아키텍처·MCP·한계·로드맵·규제), 데모 MP4 8.96MB 커밋, LICENSE **미푸시**, CI 없음, 커밋 6개 | **PARTIAL** | LICENSE·README 최상단 EN 6줄 요약·repo About/토픽·CI(타입체크) 추가. **이 환경은 `github.com`·`api.github.com` 접근 차단(DNS), raw만 가능 → star/issue 상태는 확인 불가** |
| **데모 영상/원페이저 언어** | 영상 1:50 캡션 **한국어만**(`scripts/demo/record.mjs`). KO one-pager는 `docs/`에만 있고 **사이트 `/RAIL-onepager.pdf` 404**. EN one-pager PDF(252KB)·A4 EN 페이지는 v4에서 제작됨(품질 높음), 역시 미배포 | **PARTIAL** | 두 PDF를 `public/`에 배포하고 헤더/푸터에 링크. KO one-pager의 `github.com/[repo]` **플레이스홀더 버그** 수정 |

---

## 4. 구조 감사 검증 — 3분 데모 경로 재현

### 4.1 구조 감사 수치 재검증 (라이브 v3.1)

| 항목 | structure-audit.md | 이번 실측(2026-10-22) | 판정 |
|---|---|---|---|
| 페이지 높이 | 9,026px = 10 viewports | **9,026px = 10.0 viewports** | 일치(변경 없음) |
| 챕터 수 | 7 + hero = 8 acts | **hero + H2 섹션 8개 = 9 acts**(closing 포함, ledger 추가) | 1개 증가, 여전히 김 |
| 액션 링크 | 16개(전체 31) | 전체 링크 31 · 가시 인터랙티브 **29** · 첫 화면 **9** | "16"은 CTA성 링크 기준. 실측 인터랙티브가 더 많음 |
| 2-click 이탈 | header CTA → run → 판정 | **클릭 2 · 페이지 전환 2 · 총 14.7초** | 유지 |
| 첫 화면 제품 증거 | 정적 여권 카드 | 카드에 실제 엔진 출력(73.4/B/1.8억/8.55%) + 라이브 티커 | 부분 개선 |

### 4.2 3분 데모 시나리오 실측 타임라인 (라이브)

| 시점 | 행동 | 실측 |
|---|---|---|
| 0:00–0:20 | 랜딩 읽기(첫 화면) | H1·카드·CTA·티커 노출. **작동 장면 없음** |
| 0:20 | "한빛전자 3분 심사" 클릭 | 페이지 전환 **0.56s** |
| 0:21 | `/underwrite/hanbit` 도착 | 최종 판정 텍스트 **13ms**(SSR), 판정 패널은 **스크롤 없이 보임** |
| 0:21–0:28 | 에이전트 4단계 애니메이션 관찰 | 텍스트 안정화 **7.2s**(COMPLETE 2.8s) |
| 0:48 | "신용 여권 열기" 클릭 | 전환 **1.53s** |
| 1:30 | 여권(증거 테이블·산식·약관·RWA 증서) 읽기 | 페이지 6,613자, 출처 9회 |
| 2:10 | `/market` 이동 | 200, LIVE 배지 10개 |
| 3:00 | 마무리 | **3분 내 충분**. 단 **페이지 전환 3회 + 대기 7.2s**가 데모 리듬을 끊는다 |

**검증 결론**: structure-audit의 "2-click 이탈"은 실제 문제다. 랜딩만 보는 심사역은 제품이 "작동하는 장면"을 못 보고, 발표자가 클릭해야만 보인다. `[v4]`의 landing 내 `LiveUnderwriter` 밴드가 이 문제를 직접 해결한다(코드 존재, 미배포).

---

## 5. P0/P1/P2 개선 리스트 15개

> P0 = **이번 배포 전 필수**. 소요는 1인 에이전트 기준 추정.

### P0 (배포 전)

| # | 항목 | 파일/화면 | 예상 | 근거 |
|---|---|---|---|---|
| P0-1 | **`/en` 실제 배포 + `<html lang="en">` + hreflang/canonical 정합 + KO↔EN 스위치 dead-link 방지** (hreflang·canonical은 v4 코드에 추가됨 → 페이지별 canonical 충돌만 확인) | `rail-app/app/en/layout.tsx`(신규), `app/layout.tsx`, `components/site/header.tsx` | 45m | `/en` 404 · hreflang 0 · canonical 0 (실측) |
| P0-2 | **one-pager 2종 사이트 배포·링크**(KO/EN PDF → `public/`, 헤더/푸터/히어로 보조 CTA) | `rail-app/public/RAIL-onepager(-en).pdf`, `components/site/footer.tsx`, `components/en/copy.ts` | 15m | `/RAIL-onepager.pdf` 404 (실측) |
| P0-3 | **문의·GitHub·라이선스 표면화**: footer Docs&Contact, EN trust band 배포, `LICENSE` 커밋·푸시 | `components/site/footer.tsx`, `LICENSE`, `components/en/trust-band.tsx` | 25m | 사이트 외부링크 0 · raw LICENSE 404 |
| P0-4 | **"왜 지금" + 타깃 고객을 첫 2 viewport로**: 히어로 서브에 세그먼트 1줄, case-file 상단에 규제 캘린더 3줄(2026-01-15 통과/2027 시행, 출처 링크) | `components/landing/hero-band.tsx`, `case-file-band.tsx`, `components/en/copy.ts`, `components/landing/v4-types.ts` | 60m | why-now 부재(첫 60초 표 d) |
| P0-5 | **자료 수치·표기 정합성**: KO one-pager `github.com/[repo]` 수정, 에이전트 수(4 runtime/5 build/7 agents) 통일, `%p`/날짜/통화 표기 규칙 | `design/onepager/index.html`, `rail-app/scripts/build-onepager.mjs`, `README.md`, `components/landing/*` | 30m | EN one-pager "1 human + 7 agents" vs 사이트 "4 runtime · 5 build" |

### P1 (이번 주)

| # | 항목 | 파일/화면 | 예상 | 근거 |
|---|---|---|---|---|
| P1-1 | robots.txt·sitemap.xml 배포, KO canonical, EN OG 이미지 | `app/robots.ts`, `app/sitemap.ts`, `app/layout.tsx`, `public/art/og-en.png` | 30m | `/robots.txt` `/sitemap.xml` 404 |
| P1-2 | 보안 헤더(CSP·X-Frame-Options·Referrer-Policy) + `/.well-known/security.txt` | `rail-app/next.config.ts`, `app/.well-known/security.txt/route.ts` | 30m | CSP·XFO 없음, security.txt 404 |
| P1-3 | terms/privacy 최소 페이지(데모 고지·데이터 출처·쿠키/추적 없음 명시) | `app/terms/page.tsx`, `app/privacy/page.tsx` | 40m | `/terms` `/privacy` 404 |
| P1-4 | 국제 표기 병기: KRW+USD 환산, ISO 날짜, bp/%p 통일 | `lib/format.ts`, `components/flow/passport-cover.tsx`, `pricing-breakdown.tsx` | 45m | 1.8억/1억 8,000만원 혼용 |
| P1-5 | 트랙션 정직 라벨("Pre-launch demo · no customers yet") + 8주 KPI 사이트 노출 | `app/agents/page.tsx`, `components/en/trust-band.tsx` | 30m | 예상질문 1·4 대응 |

### P2 (다음 라운드)

| # | 항목 | 파일/화면 | 예상 | 근거 |
|---|---|---|---|---|
| P2-1 | EN 데모 영상(90–120s, EN 자막) 제작·게시 | `rail-app/scripts/demo/record.mjs`, `rail-app/demo/` | 3h | 영상 캡션 한국어만 |
| P2-2 | MCP 실제 호출 로그를 `/agents`에 노출(신용 MCP 3 tools JSON) | `app/agents/page.tsx`, `mcp/server.ts` | 1h | AI 깊이 PARTIAL 보완 |
| P2-3 | 폰트 완전 셀프호스팅(Pretendard·Noto Serif KR CDN 제거) | `app/layout.tsx`, `public/fonts/` | 30m | 제3자 CDN 2종 |
| P2-4 | 실고객/디자인 파트너 1건(익명) 사례 카드 + 인터뷰 수 공개 | `components/landing/case-file-band.tsx` | 2주 | 트랙션 FAIL |
| P2-5 | EN 원어민 최종 카피 QA + EN OG/소셜 카드 | `components/en/copy.ts`, `public/art/` | 2h | EN 문장 품질은 좋으나 검수 필요 |

---

## 6. Hashed 예상 질문 10개 — 사이트가 답 못하는 부분

| # | 예상 질문 | 사이트 답변 | 부족 지점(보완 위치) |
|---|---|---|---|
| 1 | "지금 고객·디자인 파트너가 있나? 누가 써봤나?" | **없음** | README 로드맵에만. 사이트에 "인터뷰 N건/LOI 예정" 필요(P1-5, P2-4) |
| 2 | "왜 수출채권인가? 왜 지금인가?" | 개념 서사만 | 규제 캘린더가 `/market`에만, 랜딩에 없음(P0-4) |
| 3 | "AI/에이전트가 실제로 무엇을 하나? LLM이 숫자를 만드나?" | `/agents` 서사 | "LLM은 숫자를 만들지 않는다 — 엔진이 계산, 에이전트는 수집·검증" 1문장이 랜딩에 없음(README에만) |
| 4 | "그럼 AI가 핵심 가치에 얼마나 깊이 들어갔나? LLM 없어도 되는 것 아닌가?" | **없음** | MCP 호출 장면·에이전트 판단 로그를 사이트에 노출해야 답이 됨(P2-2) |
| 5 | "데이터는 어디서 오나? 신뢰할 수 있나?" | **부분 답** | footer DATA + 각주 ✓. 단 출처가 링크가 아니고, 집계 기준은 RWA에만 한정 |
| 6 | "규제·라이선스는 어떻게 되나?" | footer 1줄 | "RAIL holds no financial licence"·샌드박스 경로가 KO 사이트에 없음(v4 EN trust band에만) |
| 7 | "수익 모델·단위경제는?" | **없음** | 사이트 어디에도 없음. 최소 발표 자료에 1장 필요 |
| 8 | "해자는? 복제 가능성은?" | **없음** | 결정론 스키마·provenance·리서치 코퍼스·빌드 속도(P2-2, README 인용) |
| 9 | "팀은 누구인가? 왜 이 팀인가?" | "human 1 + agents 4" | **인간 창업자 배경·이력이 사이트에 없음**. Hashed는 팀을 본다 → `/agents`에 창업자 1단락 필요(P1-5) |
| 10 | "이건 데모인가 실서비스인가? 글로벌 확장은?" | 데모 고지 ✓ | `/en` 404로 확장 의지가 부정됨. EN 배포가 가장 강한 답(P0-1) |

---

## 7. `[v4]`에서 달라질 부분 (감사 기준과 분리 표기)

| 영역 | 라이브 v3.1 (이번 감사) | v4 코드 상태(미배포, 2026-10-22 확인) | 배포 후 기대 |
|---|---|---|---|
| 영어 랜딩 | `/en` 404 | `app/en/page.tsx` + `components/en/{copy,trust-band,build-band}.tsx` (EN 카피 문장 품질 양호, real vs simulated 표·라이선스 상태·GitHub Issues 포함) | 글로벌 파트너 렌즈 FAIL → PASS 가능. 단 `app/en/layout.tsx` 없어 `<html lang>` 수정 필요 |
| 언어 스위치/내비 | KO 5탭, 31링크 | 헤더 `LangSwitch`(KO/EN 토글) + KO/EN 4탭(사례/심사/여권/증거) | 2-click 이탈·링크 과다 동시 개선 |
| 데모 위치 | 클릭 후 별도 페이지(2 전환, 7.2s 대기) | `components/landing/live-underwriter.tsx` 랜딩 내 심사 밴드 | "랜딩만 보는 심사역" 문제 해결 |
| 푸터/연락 | 외부 링크 0 | footer에 Docs & Contact(GitHub·Issues·EN one-pager), EN trust band | 실사 표면 확보 |
| One-pager | `/RAIL-onepager.pdf` 404 | `docs/RAIL-onepager-en.pdf`(252KB)·KO PDF·`design/onepager-en/` 생성 완료, `build-onepager.mjs` KO/EN 지원 | 배포만 하면 됨(P0-2) |
| 폰트 | Pretendard(jsDelivr)·Noto Serif KR(Google) CDN + 3종 셀프호스팅 | 3종 셀프호스팅 유지, CDN 2종은 잔존 | 제3자 요청 제거 여지 |
| SEO/보안 | robots/sitemap 404, CSP 없음 | `app/robots.ts`·`app/sitemap.ts` 추가됨 | P1-1 일부 해결 |

**v4 배포 전 재감사 체크리스트**: ① `npm run build` 성공·`/en` 200 ② `<html lang>` KO/EN 분기 ③ hreflang·canonical ④ 신규 링크 전부 200(특히 `/RAIL-onepager*.pdf`, `/en`) ⑤ 1440/390 스크린샷 재측정 ⑥ 첫 60초 표 재측정(why-now가 20초 안쪽으로 이동했는지) ⑦ 에이전트 수·수치 일관성.

---

## 부록 — 측정 방법·한계

- **측정**: headless Chrome 1440×900 (Chrome 141 계열), `waitUntil=networkidle2`, 1.2s 안정화 후 DOM 좌표·`innerText`·`getComputedStyle` 수집. 데모 경로는 실제 클릭·`waitForNavigation`·텍스트 안정화 폴링(200ms)으로 계측.
- **HTTP**: `fetch`/`Invoke-WebRequest`로 상태·헤더 확인. `/api/market` JSON 실측(asOf 2026-10-22, USD/KRW 1,325.57, 스테이블코인 $305.67B, onkorea 일 거래대금 $3.39B, RWA $76.86B).
- **한계**: ① 이 환경은 `github.com`·`api.github.com` 접근이 차단되어(DNS) repo star/issue/공개 여부는 raw 파일(README 200 / LICENSE 404)로만 판단 ② 로컬 3100은 `next start` 구버전 빌드라 v4는 코드 리뷰로만 평가 ③ 환산 초는 명시한 모델 기반 추정치 ④ 데모 영상·PDF는 파일 메타데이터와 생성 스크립트로 확인(영상 재생 검수는 미실시).
- **참고 파일**: `screenshots/final/`(v3.1 라이브 캡처), `research/design/structure-audit.md`, `research/design/benchmark-60.md`, `rail-app/README.md`, `LICENSE`, GitHub raw README.
