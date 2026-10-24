# OSS·MCP 툴킷 — 데모 품질 향상 후보 (실존·최신버전 검증)

- **작성일**: 2026-10-22 (KST) · 작성: rwa-researcher
- **검증 방법**: `npm view <pkg> version license` + `GitHub API /repos/{owner}/{repo}` + `curl raw README`를 **실제 실행**해 확인. star 수·버전·라이선스는 2026-10-22 측정값이며 이후 변할 수 있다.
- **적용 대상**: `rwa-nitro` Next.js 16 데모(README·AGENTS.md 기준 스택: Next 16 App Router, React 19, TS strict, Tailwind v4, `mcp/server.ts` stdio MCP 서버)
- **원칙**: AGENTS.md의 제품 보장(숫자는 `lib/engine.ts`에서만 계산, 외부 fetch는 timeout+cache+fallback)과 충돌하지 않는 것만 추천한다.

---

## 1. UI / 시각화 — 실제 npm 설치 가능 확인

| 패키지 | npm 최신 | 라이선스(npm) | GitHub repo | Stars | 데모 적용 포인트 |
|---|---|---|---|---|---|
| **shadcn** (shadcn/ui CLI) | **4.22.1** | MIT | [shadcn-ui/ui](https://github.com/shadcn-ui/ui) | **126,148** | `components/ui/*`를 `npx shadcn add`로 생성. AGENTS.md의 디자인 시스템(토큰 `paper/ink/signal/verified/gold/night`)에 그대로 매핑. 이미 쓰고 있다면 유지 |
| **radix-ui** (primitives) | **1.8.1** | MIT | [radix-ui/primitives](https://github.com/radix-ui/primitives) | 19,415 | Dialog·Tabs·Tooltip·Progress 접근성. 수출채권 상세/신용여권 모달에 사용 |
| **tailwindcss** | **4.3.3** | MIT | [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss) | 97,960 | v4는 `app/globals.css`의 `@theme` 토큰 방식. 커스텀 토큰 6종 정의에 적합 |
| **motion** (구 framer-motion) | **14.5.0** | MIT | [motiondivision/motion](https://github.com/motiondivision/motion) | 34,418 | 신용평가 진행 단계(수출실적→거래흐름→온체인증거→한도) 애니메이션. `AnimatePresence`로 단계 전환 |
| **recharts** | **3.10.1** | MIT | [recharts/recharts](https://github.com/recharts/recharts) | 27,646 | 수출실적 월별 막대, 금리/APR 라인, 팩토링 만기 분포. SSR 이슈 있으니 `"use client"` 격리 |
| **lucide-react** | **1.61.0** | ISC | [lucide-icons/lucide](https://github.com/lucide-icons/lucide) | 25,191 (GitHub license `NOASSERTION`→ npm 기준 ISC) | 아이콘. AGENTS.md의 "emoji 금지" 준수에 적합 |
| **magicuidesign/magicui** | npm 배포 없음(복사형) | MIT(repo) | [magicuidesign/magicui](https://github.com/magicuidesign/magicui) | 22,778 | 숫자 카운트업·marquee 등. **복사형 컴포넌트**라 의존성 추가 없이 일부만 차용 |
| **airbnb/visx** | npm `@visx/*` 개별 | MIT(repo) | [airbnb/visx](https://github.com/airbnb/visx) | 21,082 | 저수준 D3 차트. recharts로 부족할 때만. 러닝커브 높음 |

**실측 로그 (2026-10-22)**
```
shadcn           -> version=4.22.1 license=MIT
radix-ui         -> version=1.8.1  license=MIT
tailwindcss      -> version=4.3.3  license=MIT
motion           -> version=14.5.0 license=MIT
recharts         -> version=3.10.1 license=MIT
lucide-react     -> version=1.61.0 license=ISC
GitHub: shadcn-ui/ui 126,148★ · radix-ui/primitives 19,415★ · tailwindlabs/tailwindcss 97,960★
        motiondivision/motion 34,418★ · recharts/recharts 27,646★ · magicuidesign/magicui 22,778★ · airbnb/visx 21,082★
```

**주의**
- **Aceternity UI는 검증하지 못했다**(npm 패키지 형태가 아닌 복사형, 라이선스 조건 별도) → `확인 필요`. 도입하려면 라이선스 원문 확인 후.
- AGENTS.md가 "gradient·glassmorphism·remote image 금지"이므로 magicui/aceternity의 화려한 효과 컴포넌트는 **선별 사용**. 데모 신뢰도(금융 문서 느낌)가 우선.
- recharts 3.x는 React 19 호환. 설치 후 `npx tsc --noEmit` 확인 필수.

---

## 2. 데이터 / 웹3 / 에이전트

| 패키지 | npm 최신 | 라이선스 | GitHub repo | Stars | 데모 적용 포인트 |
|---|---|---|---|---|---|
| **zod** | **4.6.7** | MIT | [colinhacks/zod](https://github.com/colinhacks/zod) | 44,168 | `lib/types.ts` 스키마 검증 + MCP 툴 입출력 스키마 + 외부 API 응답 검증(fail-soft) |
| **viem** | **2.57.8** | MIT(npm) / repo `NOASSERTION` | [wevm/viem](https://github.com/wevm/viem) | 3,590 | 온체인 읽기(USDC 잔액, 이벤트 로그). **읽기 전용**으로만 사용(AGENTS.md: 데모는 시뮬레이션 라벨) |
| **wagmi** | **3.7.9** | MIT | [wevm/wagmi](https://github.com/wevm/wagmi) | 6,762 | 지갑 연결이 필요한 경우만. 데모에 지갑 연결이 없으면 **도입 불필요** |
| **ai** (Vercel AI SDK) | **7.0.148** | Apache-2.0(npm) / repo `NOASSERTION` | [vercel/ai](https://github.com/vercel/ai) | 27,435 | 에이전트 narration(숫자는 엔진에서 주입). `generateObject`+zod로 서술 텍스트만 생성 |
| **@modelcontextprotocol/sdk** | **1.32.1** | MIT | [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) | 91,450 (repo `NOASSERTION`) | `mcp/server.ts` stdio 서버 구현. 툴 정의·스키마·stdio transport |
| **x402** | **1.2.0** | Apache-2.0 | [coinbase/x402](https://github.com/coinbase/x402) | 172 | 유료 API 게이트(신용여권 조회 1건 과금) 데모 — "에이전트 참여자" 서사 |
| **@coinbase/x402** | **2.1.0** | Apache-2.0 | 위와 동일 | — | facilitator 연동 |
| **@x402/fetch** | **2.28.0** | Apache-2.0 | 위와 동일 | — | fetch 래퍼로 402 자동 결제 흐름 구현 |
| **@coingecko/coingecko-mcp** | **8.2.1** | Apache-2.0 | [coingecko/coingecko-typescript](https://github.com/coingecko/coingecko-typescript/tree/main/packages/mcp-server) | — | 로컬 MCP 서버(키 필요). 원격 키리스 MCP는 §3 참조 |

**실측 로그 (2026-10-22)**
```
zod          -> version=4.6.7   license=MIT
viem         -> version=2.57.8  license=MIT
wagmi        -> version=3.7.9   license=MIT
ai           -> version=7.0.148 license=Apache-2.0
x402         -> version=1.2.0   license=Apache-2.0
@coinbase/x402 -> version=2.1.0 license=Apache-2.0
@x402/fetch  -> version=2.28.0  license=Apache-2.0
@modelcontextprotocol/sdk -> version=1.32.1 license=MIT
@coingecko/coingecko-mcp  -> version=8.2.1  license=Apache-2.0
```

**주의**
- `ai`(AI SDK) v7은 **메이저 버전이 빠르게 변한다**(7.0.x). LLM 호출은 "내러티브만" — AGENTS.md 1번 보장(숫자 생성 금지)을 코드로 강제: 엔진 출력 JSON을 프롬프트에 넣고 `generateObject`로 문장만 받는다.
- `viem`으로 서명·전송까지 데모에 넣으면 "실제 금융 서비스"로 오인될 수 있음. **읽기 전용 + 명시적 시뮬레이션 라벨** 원칙 준수.

---

## 3. MCP 서버 후보 (존재·키 필요 여부 확인)

| MCP 서버 | 존재 확인 | 키 | 용도 | 데모 적용도 |
|---|---|---|---|---|
| **CoinGecko MCP (공식, 원격)** | ✅ 공식 문서 `https://mcp.api.coingecko.com/mcp` (Streamable HTTP, `/sse`도 지원) — 확인 2026-10-22 | **불필요(키리스)** | 실시간 시세·시총·카테고리 조회 | ★★★★★ (리서치/검증 자동화) |
| **CoinGecko MCP (키 사용)** | ✅ `https://mcp.pro-api.coingecko.com/mcp` | 필요 | 높은 레이트리밋·전체 툴 | ★★ |
| **RWA.xyz MCP (공식)** | ✅ 문서 존재 `https://docs.rwa.xyz/mcp/overview` — 확인 2026-10-22 | **필요** | RWA 자산별 시총·발행사·네트워크 | ★★★★ (발표 시 심사역 질의 데모) |
| **modelcontextprotocol/servers (레퍼런스)** | ✅ repo 91,450★, README 200(8,707B) | 대부분 불필요 | filesystem·fetch·git·memory 등 | ★★★ (문서 수집·저장) |
| **github/github-mcp-server (공식)** | ✅ 33,828★, MIT, 2026-10-21 푸시 | 필요(PAT) | 이슈/PR 자동화 | ★★ (개발 워크플로) |
| **DefiLlama MCP** | ⚠️ 공식 없음. 커뮤니티 npm `defillama-mcp@1.0.2` 존재(라이선스 확인 필요) / PyPI `iflow-mcp_demcp-defillama-mcp` | 불필요(추정) | TVL·yields 조회 | ★★ (공식 아님 → 데모 의존 비추천) |
| **로컬 RWA MCP** | ⚠️ npm `rwa-mcp@0.1.0` 존재(정체 `확인 필요`) | — | — | ☆ (검증 불가) |

**MCP 연결 설정 예시 (프로젝트 루트 `.mcp.json` 또는 클라이언트 설정)**

Claude Desktop / Claude Code 계열(`mcpServers`):
```json
{
  "mcpServers": {
    "coingecko": {
      "type": "http",
      "url": "https://mcp.api.coingecko.com/mcp"
    },
    "rail": {
      "command": "npx",
      "args": ["tsx", "mcp/server.ts"]
    }
  }
}
```

VS Code / Cursor 계열(`.vscode/mcp.json`, `servers` 키):
```json
{
  "servers": {
    "coingecko": { "type": "http", "url": "https://mcp.api.coingecko.com/mcp" },
    "rail": { "type": "stdio", "command": "npx", "args": ["tsx", "mcp/server.ts"] }
  }
}
```

- Git 커밋 시 **키가 들어간 MCP 설정은 제외**(`.env`, `RWA_API_KEY`는 Vercel 환경변수/로컬 `.env.local`).
- 사내(에이전트 팀) 실행은 `npx tsx mcp/server.ts`(AGENTS.md 커맨드와 동일)로 stdio 검증.

---

## 4. 에이전트 워크플로 / 문서 표준

| 항목 | 확인 결과 | 데모 적용 |
|---|---|---|
| **AGENTS.md 표준** | ✅ `https://agents.md` HTTP 200, 81,690B (확인 2026-10-22). Codex·Cursor 등이 읽는 에이전트 지침 표준 | 이미 `rwa-nitro/AGENTS.md` 존재 — **제품 보장 5개**(숫자 엔진 단일 소스·결정성·fail-soft·데모 정직성·시크릿 금지)를 그대로 유지. 리서치 문서가 이 보장과 어긋나지 않게 작성됨 |
| **oh-my-opencode 계열** | ⚠️ `code-yeongyu/oh-my-opencode`는 GitHub API에서 조회 실패(리포지토리명 변경/삭제 추정 → `확인 필요`). GitHub 검색 결과 **`alvinunreal/oh-my-opencode-slim` 9,718★, MIT** 확인 | 에이전트 오케스트레이션 참고용. **데모 런타임 의존은 금지**(개발 워크플로 도구) |
| **DSH 팀 워크플로** | 이 세션에서 사용 중(공유 태스크·write scope·AGENTS.md) | 리서치 산출물은 `research/market/`·`research/toolkit/`만 수정. 코드 파일은 소유자(Lead/frontend/flow)만 수정 |
| **MCP config 예시** | §3 참조 | 심사 데모에서 "에이전트가 MCP로 신용 데이터를 질의" 장면 연출 가능 |
| **skills 표준** | DSH 스킬 카탈로그(office 등) 사용 가능 | 해당 없음 |

---

## 5. "MCP로 품질 올리기" 실행 제안 3개 (이 데모에 실제로 쓸 수 있는 것만)

### 제안 A — CoinGecko 키리스 MCP를 리서치·검증 파이프라인에 연결 ★★★★★
- **무엇**: `https://mcp.api.coingecko.com/mcp`(키 불필요)를 에이전트(Claude Code/Cursor/DSH)에 연결해, `landscape.md`·UI 카피에 들어가는 시장 수치를 **매번 실측으로 검증**한다.
- **왜 품질이 오르나**: AGENTS.md 1번 보장(숫자 창작 금지)을 **리서치 단계에서부터** 강제. "RWA $76.86B" 같은 수치가 바뀌면 즉시 감지.
- **구현(30분)**: ① `.mcp.json`에 coingecko 서버 추가 ② `research/scripts/verify-numbers.md`(체크리스트)에 "RWA 카테고리 시총·토큰화 국채 시총 재조회" 항목 ③ PR 전 1회 실행.
- **리스크**: 키리스는 분당 10~30회 제한 → 캐시/간헐 호출. 프로덕션 런타임에서는 사용하지 말고 **개발·검증용**으로만.

### 제안 B — 자체 `mcp/server.ts` 툴 3종으로 "에이전트가 신용을 판독한다" 데모 ★★★★★
- **무엇**: 이미 존재하는 stdio MCP 서버에 AGENTS.md 보장을 지키는 **읽기 전용 툴 3개**를 노출한다.
  1. `get_credit_passport(company_id)` → `lib/engine.ts`가 계산한 점수·등급·한도·APR·플래그(순수 함수 결과)
  2. `get_export_receivable(receivable_id)` → 수출채권 메타(수입자·금액·만기·통화·증빙 상태)
  3. `quote_factoring(receivable_id, days)` → 90일 팩토링 견적(엔진 계산값)
- **왜 품질이 오르나**: 심사역이 MCP 클라이언트로 직접 질의하는 장면 = "AI 에이전트 팀이 만든 제품"이라는 Nitro 지원 취지와 정확히 일치. LLM은 툴 결과를 **서술만** 하므로 숫자 환각 0.
- **구현(2~3시간)**: `@modelcontextprotocol/sdk@1.32.1` + `zod@4.6.7` 스키마, `readOnlyHint` 어노테이션, stdio transport. 서버 내부에서 `lib/engine.ts`만 import(엔진 밖 계산 금지 원칙 준수).
- **검증**: `echo '{"jsonrpc":"2.0","method":"tools/list","id":1}' | npx tsx mcp/server.ts`로 툴 목록 확인, `npx tsc --noEmit` 통과.

### 제안 C — x402 + `@x402/fetch`로 "데이터 1건당 과금" 결제 레일 데모 ★★★★
- **무엇**: 신용여권 조회 API를 **HTTP 402 유료 엔드포인트**로 만들고, `@x402/fetch`(2.28.0)로 에이전트가 자동 결제 후 데이터를 받는 흐름을 시연. facilitator는 `https://x402.org/facilitator/supported`(실측 200) 사용.
- **왜 품질이 오르나**: 김서준 논지의 "에이전트 참여자"를 **실제 결제 프로토콜**로 보여준다. 데모의 마지막 장면("에이전트가 수출기업 신용데이터를 사고, 그 대금이 온체인으로 정산된다")으로 강력.
- **구현(반나절)**: ① `/api/passport/[id]`에 402 챌린지 ② `@x402/fetch` 클라이언트로 결제→재요청 ③ **테스트넷(Base Sepolia `eip155:84532`)만 사용**하고 UI에 "테스트넷 시뮬레이션" 명시(AGENTS.md 4번 보장).
- **리스크**: 메인넷 지원·파트너십은 `확인 필요`. 실결제 절대 금지, 테스트넷·모의 정산만.

---

## 6. 설치 검증 로그 요약 (재현용)

```powershell
# npm 실존·버전·라이선스 확인
npm view shadcn version; npm view tailwindcss version; npm view motion version
npm view recharts version; npm view zod version; npm view viem version
npm view ai version; npm view x402 version; npm view @x402/fetch version
npm view @modelcontextprotocol/sdk version; npm view @coingecko/coingecko-mcp version

# GitHub stars·라이선스 확인
curl.exe -sS -H "Accept: application/vnd.github+json" https://api.github.com/repos/shadcn-ui/ui
curl.exe -sS -H "Accept: application/vnd.github+json" https://api.github.com/repos/modelcontextprotocol/servers

# README 실존 확인
curl.exe -sS -o NUL -w "%{http_code}" https://raw.githubusercontent.com/modelcontextprotocol/servers/main/README.md
curl.exe -sS -o NUL -w "%{http_code}" https://raw.githubusercontent.com/coinbase/x402/main/README.md
curl.exe -sS -o NUL -w "%{http_code}" https://agents.md
```

**검증 결과**: npm 14개 패키지 존재·버전 확인, GitHub repo 16개 stars/라이선스 확인, raw README 2건(200) + agents.md(200, 81,690B) 확인. (2026-10-22)

---

## 7. 결론 — 지금 바로 도입할 5개

1. **`zod` 4.6.7** — 외부 API 응답·MCP 툴 스키마 검증(가장 적은 비용으로 fail-soft 품질 확보)
2. **`@modelcontextprotocol/sdk` 1.32.1** — `mcp/server.ts`에 신용여권·채권·견적 툴 3종 노출(제안 B)
3. **CoinGecko 키리스 MCP** — 리서치 수치 실측 검증(제안 A, 설치 0)
4. **`@x402/fetch` 2.28.0 + `x402` 1.2.0** — 에이전트 과금 레일 데모(제안 C, 테스트넷 한정)
5. **`motion` 14.5.0 + `recharts` 3.10.1** — 신용평가 단계 전환·수출실적 차트(이미 스택에 있으면 버전만 확인)

> **주의**: 이 문서의 star·버전은 2026-10-22 스냅샷이다. `package.json`에 버전을 고정(pin)하고, `npm audit`·`npx tsc --noEmit`을 통과한 뒤 도입할 것. AGENTS.md의 "숫자는 `lib/engine.ts`에서만" 원칙은 어떤 OSS/MCP보다 우선한다.
