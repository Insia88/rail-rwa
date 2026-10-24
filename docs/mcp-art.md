# RAIL Art MCP — 이미지 파이프라인을 에이전트 도구로

RAIL v2("Night Signal")의 이미지 자산은 **외부 생성 API 없이 로컬에서 직접 생성**했습니다.
그 파이프라인을 MCP 서버로 노출해, 어떤 에이전트든 "아트 자산 조회 / 재생성 / 상태 확인"을 도구로 호출할 수 있습니다.

```
rail-app/mcp/
  server.ts        # 신용 심사 MCP (list_applicants / underwrite_applicant / get_rwa_market)
  art-server.mjs   # 아트 파이프라인 MCP (list_art_assets / art_pipeline_status / regenerate_art / regenerate_og)
```

## 1. 연결 방법

```json
{
  "mcpServers": {
    "rail-credit": {
      "command": "npx",
      "args": ["tsx", "mcp/server.ts"],
      "cwd": "<repo>/rail-app"
    },
    "rail-art": {
      "command": "node",
      "args": ["mcp/art-server.mjs"],
      "cwd": "<repo>/rail-app",
      "env": {
        "RAIL_PYTHON": "<python executable with numpy/Pillow>"
      }
    }
  }
}
```

두 서버 모두 **의존성 없는 stdio JSON-RPC 2.0**입니다 (별도 SDK 불필요).

## 2. 아트 MCP 도구

| Tool | 설명 |
|---|---|
| `list_art_assets` | `public/art/*` 자산 목록·크기·수정시각 |
| `art_pipeline_status` | 로컬 생성기/Python/OG 렌더러 준비 상태, Higgsfield·Adobe 자격증명 감지 결과 |
| `regenerate_art` | `scripts/art/gen_art.py` 실행 (`target`: hero-rail, chrome-ribbon, orange-band …) |
| `regenerate_og` | `scripts/art/og_v2.mjs`로 공유 카드 재렌더 |

## 3. 왜 Higgsfield/Adobe MCP가 아니라 로컬 생성인가

사용자 요청: "힉스필드·어도비 MCP로 이미지를 더 세련되게." 이 환경에서는 **계정/키가 없어 즉시 사용 불가**입니다.
조사 결과(2026-10-22, `research/design/mcp-image.md`):

| 제공자 | 실제 상태 | 이 환경 |
|---|---|---|
| **Higgsfield MCP** | 공식 원격 MCP `https://mcp.higgsfield.ai/mcp` 실존. API 키 불필요, **활성 유료 구독 + 브라우저 OAuth** 필요. 생성은 크레딧 차감 | ❌ 계정·구독 없음 |
| **Higgsfield API** | 공식 self-serve API 실존. API 키 + **최소 $5 충전**, 비동기 생성(요청 ID→폴링/webhook), Soul 2 $0.0032/장 | ❌ 키·결제수단 없음 |
| **Adobe Firefly/Photoshop API** | 실존하나 **Enterprise 계약 + Adobe IMS OAuth(S2S)** 전제 | ❌ 계약 없음 |
| **Adobe MCP** | 2026-10-22 기준 **공식 MCP 서버 확인 안 됨**(커뮤니티 구현만 존재, 도입 비권장) | ❌ |

**대안(이번 라운드 실제 사용)**: numpy/Pillow 절차적 생성 + HTML/CSS/SVG→headless Chrome 캡처.
결과물은 `public/art/` 8종 — hero-rail, passport-chrome, orange-band, chrome-ribbon, halftone-grid,
grain, agents-scan, og-v2. 전부 자체 생성물이며 외부 라이선스가 없습니다.

## 4. Higgsfield/Adobe를 연결하려면 (다음 단계)

1. **Higgsfield**: higgsfield.ai 계정 + 유료 구독 → Claude/Cursor에 원격 MCP 등록(`https://mcp.higgsfield.ai/mcp`) → OAuth 승인.
   또는 API 콘솔(`open.higgsfield.ai`)에서 키 발급 + $5 충전 → 아래 env 주입 후 어댑터 구현.
   ```
   HIGGSFIELD_API_KEY=
   ```
   ⚠️ REST 정확한 경로/인증 헤더/요청 스키마는 공식 문서 본문 미확보 → **확인 필요** (추측 구현 금지).
2. **Adobe**: Enterprise 계약 + Adobe Developer Console 프로젝트 → IMS OAuth S2S 자격증명.
   ```
   ADOBE_FIREFLY_CLIENT_ID=
   ADOBE_FIREFLY_CLIENT_SECRET=
   ```
   공식 MCP가 확인되지 않아, 필요하면 Firefly API를 직접 감싸는 어댑터를 별도로 둬야 합니다.
3. 어댑터를 추가할 때 `art_pipeline_status`의 provider 분기와 `regenerate_art`의 provider 인자만 확장하면
   기존 UI·빌드 파이프라인은 그대로 유지됩니다.

## 5. 로컬 파이프라인 재현

```bash
# Python (numpy + Pillow)
python scripts/art/gen_art.py --target all

# 공유 카드 (HTML → Chrome)
node scripts/art/og_v2.mjs
```

- 결정론적(고정 시드) — 같은 스크립트는 같은 결과를 냅니다.
- 각 자산 < 700KB, WebP 품질 82–88.
- 자산 목록/생성 방식/라이선스는 `public/art/README.md`에 기록.
