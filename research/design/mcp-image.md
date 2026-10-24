# 이미지 MCP/API 타당성 — Higgsfield · Adobe (RAIL v2)

- **작성**: 2026-10-22 (KST) · design-researcher
- **검증 방법**: 공식 문서·공식 블로그·npm/GitHub를 `web_fetch` / `web_search`로 직접 확인. **확인하지 못한 것은 "확인 필요"로 표기**했고 추정으로 채우지 않았다.
- **한 줄 결론**: **지금 이 환경에서 Higgsfield/Adobe MCP로 이미지를 만드는 것은 불가능하다.** Higgsfield는 공식 MCP+API가 실존하므로 계정·유료 구독·브라우저 OAuth(또는 API 키+$5 충전)만 확보되면 즉시 연결 가능하고, Adobe는 **Enterprise 계약이 전제**라 이번 라운드에서는 제외한다. 이번 아트는 로컬 파이프라인 + 제품 UI 중심으로 간다.

---

## 1. Higgsfield — 공식 MCP/API 모두 확인됨 ✅

### 1.1 공식 MCP 서버 (원격)

| 항목 | 확인 내용 | 출처(확인일 2026-10-22) |
|---|---|---|
| 존재 | ✅ 공식. "Higgsfield MCP는 Claude 또는 MCP 호환 에이전트에서 이미지·영상·캐릭터·오디오를 생성하는 커넥터" | [공식 Help Center (2026-08-01)](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-higgsfield-mcp) |
| 커넥터 URL | `https://mcp.higgsfield.ai/mcp` (원격 MCP 엔드포인트) | 위 문서 |
| 인증 | **API 키 불필요.** higgsfield.ai 계정으로 OAuth 로그인/승인. **활성 유료 구독 필요** | [연결 가이드 (2026-08-01)](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent) |
| 과금 | MCP/CLI 경유 생성은 **전부 크레딧 차감**(플랜의 Unlimited·무료 생성 미적용) | 위 MCP 문서 |
| 지원 작업 | 이미지·영상 생성, 업스케일, 배경 제거, 아웃페인트/리프레임, Kling 3.0 Motion Control, Soul 캐릭터·레퍼런스, 오디오(보이스오버·클로닝·더빙), Personal Clipper, 크레딧 잔액/생성 목록 조회 | 연결 가이드 |
| 클라이언트 | Claude(커스텀 커넥터), ChatGPT(공식 플러그인), Cursor(마켓플레이스), Claude Code·OpenClaw·Hermes(`npm i -g @higgsfield/cli` → `higgsfield auth login` → `npx skills add higgsfield-ai/skills`) | 연결 가이드 |
| 연결 확인법 | 새 대화에서 "What is my Higgsfield credit balance?" → 툴 호출이 일어나면 정상 | 연결 가이드 |

### 1.2 공식 API (개발자용, MCP와 별개)

| 항목 | 확인 내용 | 출처(2026-10-22) |
|---|---|---|
| 존재 | ✅ 공식 self-serve API. 콘솔 `open.higgsfield.ai`, 문서 `docs.higgsfield.ai`, 호출 도메인 `api.higgsfield.ai` | [Help Center (2026-09-16)](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api) |
| 인증/계정 | 플랜과 **완전히 분리된 API 계정**. 키는 콘솔에서 발급, **최초 1회만 표시**, 키당 동시 20 요청 | 위 문서 |
| 과금 | USD 선불 잔액. **최소 충전 $5**. 영상은 초 단위, 이미지는 장당. 실패 요청은 자동 환불. 잔액 0이면 요청 대기(음수 불가), 자동 충전 옵션 있음 | 위 문서 + [블로그 (2026-09-16)](https://higgsfield.ai/blog/higgsfield-api) |
| 생성 방식 | 비동기 — 요청 ID 발급 → 상태 폴링 또는 webhook → 결과 파일 다운로드. **비용 사전 견적 엔드포인트** 있음 | 위 문서들 |
| 파일 보존 | 생성물은 최소 7일 보관, 이후 삭제될 수 있음 → 장기 보관은 직접 다운로드 | Help Center |
| 공개 단가(일부) | Soul 2 / Soul Cinema **$0.0032/장**, Marketing Studio Image $0.0059/장, DoP $0.125/생성, Kling 2.5 $0.042/s, Kling 2.6 $0.07/s, Seedance 2.5 $0.0738/s, Kling 3.0 $0.112/s, PixVerse 6 $0.115/s, MiniMax H3 $0.13/s, LTX 2.5 Pro $0.17/s, Wan 3.0 $0.20/s, Seedance 2.0 $0.9332/s | 블로그 가격표 |

### 1.3 확인 필요 (문서에서 확인 못 한 것)

- REST **정확한 경로·인증 헤더 형식**(Bearer 여부)·요청 바디 스키마: `docs.higgsfield.ai`는 이번 검증에서 본문을 확보하지 못했다 → **확인 필요**.
- 한국 결제수단/세금계산서, 기업 계정 조건 → **확인 필요**.
- API 생성물의 **상업적 이용 조건**: Help Center FAQ에 "Can I use content generated through the API commercially?" 질문 항목은 확인했으나 답변 본문은 미확인 → **확인 필요**.

**판정**: 이 환경(키·계정 없음)에서 Higgsfield는 **즉시 사용 불가**. 계정+유료 구독 확보 시 MCP는 설정 5분, API는 키 발급 후 어댑터 1시간 규모.

---

## 2. Adobe — API는 실존, MCP는 공식 확인 안 됨 ⚠️

### 2.1 Firefly API ✅ (공식)

- 인증: **Adobe IMS OAuth Server-to-Server**. Adobe Developer Console 프로젝트에서 **Client ID / Client Secret** 발급.
- 토큰: `POST https://ims-na1.adobelogin.com/ims/token/v3`, `grant_type=client_credentials`, scope `openid,AdobeID,session,additional_info,read_organizations,firefly_api,ff_apis`, 응답 `expires_in` = 86399초(24시간).
- 전제: Adobe 담당자와 세팅, Developer Console 계정, Firefly API OAuth S2S 자격증명 프로젝트.
- 출처: [Firefly API Authentication (확인 2026-10-22)](https://developer.adobe.com/firefly-services/docs/firefly-api/getting-started/)

### 2.2 Photoshop API ✅ (공식)

- 인증: 동일 IMS, scope `openid,AdobeID,read_organizations`, env 이름 예시 `PS_FF_SERVICES_CLIENT_ID` / `PS_FF_SERVICES_CLIENT_SECRET` / `PS_FF_SERVICES_ACCESS_TOKEN`.
- 호출 예: `GET https://image.adobe.io/pie/psdService/hello` + `Authorization: Bearer $TOKEN` + `x-api-key: $CLIENT_ID`.
- **전제 조건에 "Firefly Services가 포함된 활성 Enterprise 계약"이 명시**되어 있다 → 개인/소규모 데모가 self-serve로 쓸 수 없다.
- 출처: [Photoshop API Authentication (확인 2026-10-22)](https://developer.adobe.com/firefly-services/docs/photoshop/getting-started/)

### 2.3 Adobe MCP 서버 — 공식 확인 안 됨

- 2026-10-22 기준 **Adobe 공식 MCP 서버**의 문서·저장소를 확인하지 못했다 → **확인 필요**.
- 검색에서 확인된 것은 **제3자 커뮤니티 구현**뿐: PyPI `adobe-mcp`, npm `@alisaitteke/photoshop-mcp`, GitHub `zachshallbetter/adobe-mcp`. 라이선스·유지보수·보안 검증이 안 됐고, Photoshop은 로컬 앱 연결(플러그인/스크립트) 구조라 클라우드 데모에 부적합 → **RAIL 도입 비권장**.
- Adobe의 Slack 연동은 제품 통합이지 MCP가 아니다(별개).

**판정**: Adobe는 **이번 라운드 사용 불가**(Enterprise 계약 + OAuth S2S + 공식 MCP 부재). 비용 대비 효익이 없어 제외를 권고한다.

---

## 3. 이 환경(Windows, 키 없음, DSH CLI)에서 가능한 것 / 불가능한 것

| 구분 | 항목 | 근거(확인 2026-10-22) |
|---|---|---|
| ✅ 지금 가능 | 로컬 절차적 아트 생성(numpy + Pillow, 고정 시드) | `rail-app/scripts/art/gen_art.py` 존재, `public/art/`에 7개 자산 생성 완료(치수 실측) |
| ✅ 지금 가능 | HTML/CSS/SVG → Chrome 캡처 | `puppeteer-core` 25.15.0 설치, Chrome `C:\Program Files\Google\Chrome\Application\chrome.exe` 확인, 기존 `scripts/screenshot.mjs` 동작 확인 |
| ✅ 지금 가능 | OG 카드/텍스처/하프톤 후처리 | `scripts/og-shot.mjs`, `scripts/og.html` 존재 |
| ❌ 불가 | Higgsfield MCP | 유료 계정 + 브라우저 OAuth 로그인 필요. 현재 계정·구독 없음 |
| ❌ 불가 | Higgsfield API | API 키 + 결제수단 + 최소 $5 충전 필요 |
| ❌ 불가 | Adobe Firefly/Photoshop API | Enterprise 계약 + Developer Console Client ID/Secret 필요 |
| ❌ 불가 | Adobe 공식 MCP | 공식 서버 자체가 확인되지 않음 |
| ⚠️ 조건부 | 위 API들을 감싼 **로컬 어댑터**(키 확보 시) | 아래 §4-B 형태로 구현 가능. 미구현 상태 |

---

## 4. MCP 클라이언트 설정 예시 2종

> 아래는 **일반적인 MCP 클라이언트 JSON 형태**다. 클라이언트마다 필드가 다르며(Claude Desktop은 UI 커넥터, Cursor는 마켓플레이스, Claude Code는 CLI), Higgsfield 공식 문서는 "MCP 호환 클라이언트는 MCP 서버 URL을 설정에 넣는다"고만 안내한다.

### A) 원격 HTTP — Higgsfield 공식 MCP (계정·구독 확보 시)

```json
{
  "mcpServers": {
    "higgsfield": {
      "type": "http",
      "url": "https://mcp.higgsfield.ai/mcp"
    }
  }
}
```

- 인증은 JSON에 키를 넣는 방식이 아니라 **최초 연결 시 브라우저 OAuth 로그인**으로 이뤄진다(공식 문서).
- 계정에 활성 유료 구독이 없으면 연결은 되더라도 생성이 크레딧 부족으로 실패한다.

### B) 로컬 stdio — 제안: RAIL 아트 provider 어댑터 (미구현)

```json
{
  "mcpServers": {
    "rail-art": {
      "command": "node",
      "args": ["scripts/art/mcp-server.mjs"],
      "cwd": "C:/Users/User/Documents/deepseek-harness/default-workspace/rwa-nitro/rail-app",
      "env": {
        "RAIL_ART_PROVIDER": "local",
        "HIGGSFIELD_API_KEY": "",
        "ADOBE_FIREFLY_CLIENT_ID": "",
        "ADOBE_FIREFLY_CLIENT_SECRET": "",
        "RAIL_ART_OUT_DIR": "public/art"
      }
    }
  }
}
```

- 기존 RAIL MCP 서버(`mcp/server.ts`, stdio, `npx tsx mcp/server.ts`)와 같은 방식으로 붙일 수 있다. 아트 어댑터는 **미구현 제안**이며, `RAIL_ART_PROVIDER=local`이면 기존 `gen_art.py`를 호출하고 `higgsfield`일 때만 외부 API를 호출하는 구조를 권한다(키 없을 때 자동 local fallback).

### 환경변수 이름 제안

| 변수 | 용도 | 비고 |
|---|---|---|
| `RAIL_ART_PROVIDER` | `local` \| `higgsfield` \| `adobe` | 기본 `local` |
| `HIGGSFIELD_API_KEY` | Higgsfield API 인증 | **client 번들 노출 금지**, `.env.local`/Vercel env만 |
| `HIGGSFIELD_MCP_URL` | `https://mcp.higgsfield.ai/mcp` | 기본값 내장 가능 |
| `ADOBE_FIREFLY_CLIENT_ID` / `ADOBE_FIREFLY_CLIENT_SECRET` | IMS OAuth S2S | Enterprise 계약 필요 |
| `ADOBE_IMS_TOKEN_URL` | `https://ims-na1.adobelogin.com/ims/token/v3` | 기본값 내장 가능 |
| `RAIL_ART_OUT_DIR` | 생성물 저장 경로 | 기본 `public/art` |

---

## 5. 다음 액션 체크리스트

1. **이번 라운드 결정**: 키/계약이 없으므로 `local` 파이프라인으로 확정하고, MCP 연결은 문서화만 남긴다(이 문서 + DESIGN-V2 §8).
2. **Higgsfield를 시도할 경우(권장 순서)**: ① 계정 생성 → ② 유료 플랜 결제 → ③ Claude/Cursor에 `https://mcp.higgsfield.ai/mcp` 커넥터 추가 → ④ "credit balance" 툴 호출로 연결 확인 → ⑤ Soul 2로 히어로 배경 1장 테스트($0.0032/장).
3. **API를 쓸 경우**: `open.higgsfield.ai`에서 결제수단 등록 → **$5 충전** → 키 발급(1회 표시, 즉시 보관) → `docs.higgsfield.ai`에서 REST 경로·헤더 확인 → estimate 엔드포인트로 비용 확인 → 이미지 1장 생성.
4. **키 관리**: `.env.local`(gitignore 확인) + Vercel Environment Variables. `components/`에 절대 두지 않는다(AGENTS.md 5번).
5. **Adobe**: Enterprise 계약·Developer Console 프로젝트가 없으면 이번 라운드 **제외**. 필요 시 Firefly API 인증 문서만 참조.
6. **생성물 라이선스**: Higgsfield 상업적 이용 FAQ 답변 확인 전에는 생성물을 외부 배포물(OG/발표자료)에 쓰지 않는다 → `확인 필요`.
7. **데모 정직성**: 외부 생성 이미지를 쓰더라도 "데모" 고지·시뮬레이션 라벨은 그대로 유지(AGENTS.md 4번).

---

## 6. 로컬 대체 파이프라인 — 품질 상한과 한계

**현재 파이프라인**: `rail-app/scripts/art/gen_art.py` — numpy + Pillow, 고정 시드, 선형광(linear-light) 합성 → 필름식 롤오프 → sRGB → 그레인/디더 → WebP(q86). spectral 1/f 노이즈, fbm, 도메인 워프, 원근 레일, 크롬 리본, 길리오슈(여권), 하프톤, 스캔라인.

**실측 산출물(2026-10-22)**

| 파일 | 치수 | 바이트 |
|---|---|---|
| `hero-rail.webp` | 2400×1500 | 138,704 |
| `passport-chrome.webp` | 1600×1200 | 680,228 |
| `chrome-ribbon.webp` | 2000×1200 | 450,458 |
| `orange-band.webp` | 2400×1200 | 232,998 |
| `halftone-grid.webp` | 1600×1600 | 221,502 |
| `grain.png` | 512×512 | 422,443 |
| `agents-scan.webp` | 1600×1000 | 9,226 |

**가능한 것**: 추상 배경, 그라데이션 메시, 노이즈/그레인/하프톤 텍스처, 원근 기하(레일), 얕은 크롬 광택, 텍스트 안전영역 확보, 1차원 그라데이션 위 텍스트 가독성.

**불가능/한계**: 실사 크롬의 날카로운 스펙큘러 하이라이트와 환경 반사, 렌즈 플레어·심도, 인물/사물/제품 사진, 3D 타이포그래피, 유체·연기 시뮬레이션, 영상(MP4) 생성. `hero-rail.webp`를 직접 열어보면 레일 원근과 오렌지 글로우는 설득력 있지만 **표면이 부드럽고 반사 디테일이 없다** — 상용 히어로 아트와의 차이가 정확히 여기서 난다.

**현실적 품질 상한**: "Mercury/Resend급 시네마틱 히어로 이미지"는 로컬로 **재현 불가**하다고 보는 것이 정직하다. 대신 **Linear/Attio 공식(제품 UI를 히어로로)** 을 택하면 이미지 품질 의존 자체를 없앨 수 있다. RAIL v2에는 이쪽이 더 안전하고, 실제로 상위권 12개 중 다수가 이 방식을 쓴다(`research/design/patterns.md` §1).

**실무 규칙**: ① 생성형 사실주의 흉내 금지(uncanny valley), ② 텍스처는 opacity ≤0.20, ③ 텍스트 위 이미지는 항상 오버레이로 대비 확보, ④ WebP q86·파일당 <500KB, ⑤ `prefers-reduced-motion`에서 배경 모션 정지, ⑥ 모든 이미지는 자체 제작(외부 라이선스 없음) — DESIGN-V2 §6과 동일.

---

## 출처 (모두 2026-10-22 확인)

- Higgsfield MCP: [What is Higgsfield MCP (2026-08-01)](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-higgsfield-mcp) · [연결 가이드 (2026-08-01)](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent)
- Higgsfield API: [Help Center (2026-09-16)](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api) · [블로그·가격표 (2026-09-16)](https://higgsfield.ai/blog/higgsfield-api)
- Adobe: [Firefly API Authentication](https://developer.adobe.com/firefly-services/docs/firefly-api/getting-started/) · [Photoshop API Authentication](https://developer.adobe.com/firefly-services/docs/photoshop/getting-started/)
- 로컬 자산: `rail-app/scripts/art/gen_art.py`, `rail-app/public/art/*` (치수·바이트 실측)
