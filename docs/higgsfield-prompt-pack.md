# Higgsfield x RAIL — 연결 상태 & 이미지 프롬프트 팩

- 기준: 2026-10-22 (KST)
- 계정 확인: `https://higgsfield.ai/@jammingtadpole1418` → **프로필 존재, 게시물 0개**. 공개 프로필 페이지이며 로그인 세션/API 권한을 부여하는 링크는 아님.
- 결론: **이 링크만으로는 MCP/API 이미지 생성 불가.** 아래 3가지 중 하나가 필요하다.

## 0. 왜 링크만으로는 안 되나

| 경로 | 필요한 것 | 현재 |
|---|---|---|
| 공식 MCP `https://mcp.higgsfield.ai/mcp` | higgsfield.ai 계정 + **활성 유료 구독** + **브라우저 OAuth 승인** | ❌ OAuth 승인 필요 (프로필 링크로 대체 불가) |
| 공식 API `api.higgsfield.ai` | 콘솔(`open.higgsfield.ai`)에서 발급한 **API 키** + 선불 잔액(최소 $5) | ❌ 키 없음 |
| CLI | `npm i -g @higgsfield/cli` → `higgsfield auth login` (브라우저 로그인) | ❌ 대화형 로그인 필요 |

> ⚠️ 프로필 링크는 공개 페이지라 계정 소유 증명이 아니며, 에이전트가 대신 OAuth를 통과할 수 없다.
> 다만 이 링크로 **계정이 살아있는 것은 확인**했으므로, 아래 중 하나만 완료되면 즉시 연결 가능하다.

## 1. 가장 빠른 연결 방법 (택1)

### A. MCP OAuth (권장)
1. Claude Desktop/Cursor/Claude Code 등 MCP 클라이언트에 원격 MCP 등록
```json
{
  "mcpServers": {
    "higgsfield": { "type": "http", "url": "https://mcp.higgsfield.ai/mcp" }
  }
}
```
2. 처음 연결 시 뜨는 **브라우저 로그인**에서 `@jammingtadpole1418` 계정으로 승인
3. "What is my Higgsfield credit balance?"로 툴 호출 확인
4. 이후 RAIL 파이프라인: 생성 → 다운로드 → `rail-app/public/art/` 교체 → `npx vercel --prod`

### B. API 키 (자동화에 가장 적합)
```bash
# 콘솔에서 키 발급 후
export HIGGSFIELD_API_KEY="hf_..."
# RAIL 아트 MCP 상태 확인
cd rail-app && node mcp/art-server.mjs   # art_pipeline_status → higgsfield: key detected
```
비동기 생성(요청 ID → 상태 폴링/webhook → 파일 다운로드). 이미지 단가 예: **Soul 2 / Soul Cinema $0.0032/장** (2026-10-22 공개 가격표).
REST 정확한 경로·헤더·바디 스키마는 공식 문서 본문 미확보 → **확인 필요** (어댑터 구현 전 검증 1시간).

### C. CLI
```bash
npm i -g @higgsfield/cli
higgsfield auth login   # 브라우저 로그인 (사용자가 직접)
```

## 2. RAIL v3 이미지 프롬프트 팩 (연결 즉시 실행)

공통 네거티브: `text, watermark, logo, typography, people, faces, stock-photo, cartoon, oversaturated, mesh gradient, neon purple, lens flare spam, low contrast, banding`
공통 후처리: 2× 업스케일 → WebP q84–88 → `scripts/art/gen_art.py`의 **grain/dither 레이어** 합성 → 밴딩 확인.

### 2.1 Hero — `public/art/hero-rail.webp` (2400×1500)
> **Prompt:** "Cinematic ultra-wide abstract photograph of eight polished chrome rails converging to a vanishing point at golden ratio right-of-center, deep warm black background (#070908), single orange ignition flare (#FF4B1F) rim-lighting the rails from the right, soft volumetric haze, macro scratches on metal, subtle film grain, shallow depth of field, no text, no people. Left third intentionally dark and quiet for UI headline overlay. Editorial fintech campaign, Arri Alexa look, 35mm anamorphic."
> **Model:** Soul Cinema / Soul 2 · **Aspect:** 16:10 · **Variations:** 8 → pick 2 → composite if needed.

### 2.2 OG card 배경 — `public/art/og-bg.webp` (2400×1260)
> "Dark premium fintech key art: liquid chrome ribbon crossing a warm-black field diagonally, one orange rim light, subtle grain, large empty upper-left area for headline, no text, no logos, high contrast, cinematic."

### 2.3 Passport foil — `public/art/passport-chrome.webp` (1600×1200)
> "Macro photograph of brushed chrome and blackened steel passport cover, embossed minimal rail grooves, warm reflection, orange micro glint in one corner, luxury security document texture, no text, no seals."

### 2.4 Orange band — `public/art/orange-band.webp` (2400×1200)
> "Flat-lit warm signal-orange (#FF4B1F) gradient field with faint brushed-metal sheen and fine grain, very low contrast variation, designed as a background for black typography, no objects, no text, no vignette."

### 2.5 Chrome ribbon — `public/art/chrome-ribbon.webp` (2000×1200)
> "Abstract liquid chrome ribbon flowing horizontally across a warm black background, mirror-polished metal with one orange reflection, soft studio lighting, ultra fine grain, cinematic still, no text."

### 2.6 OG 카드 최종 (1200×630)
생성 배경 + 기존 `scripts/art/og_v2.html` 타이포(RAIL, `매출은 있는데, 신용이 없습니다.`, URL) 합성.
**주의:** "0 posts" 프로필이므로 스타일 레퍼런스는 없음 — 위 프롬프트가 곧 아트디렉션.

## 3. 연결 후 RAIL에 반영하는 절차

1. `public/art/` 교체 (동일 파일명 유지 → 코드 수정 0)
2. `node mcp/art-server.mjs` → `regenerate_og`로 OG 재렌더 (또는 `node scripts/art/og_v2.mjs`)
3. `npm run build && npx vercel deploy --prod`
4. 아트 MCP `art_pipeline_status`에서 `higgsfield: key detected` 확인

## 4. 비용 가이드 (2026-10-22 공개 가격표 기준)

- Soul 2 이미지 **$0.0032/장** → 8장 배리에이션 ≈ **$0.026**
- v3 전체 아트 8종 × 8 배리에이션 ≈ **$0.20** 수준 (영상 제외)
- 영상(Kling 3.0 $0.112/s 등)은 히어로 필름 도입 시 별도 예산 필요

## 5. 법적/라이선스 체크 (연결 전 확인)

- API 생성물 **상업적 이용 조건**: 공식 FAQ 답변 본문 미확인 → **확인 필요**
- RAIL은 데모이므로 저작권 리스크는 낮지만, 공개 배포 시 생성물 이용약관 확인 권장
- Adobe는 Firefly/Photoshop API 모두 **Enterprise 계약 + IMS OAuth** 전제 → 이번 라운드 제외

참고: `research/design/mcp-image.md` (조사 원문) · `docs/mcp-art.md` (MCP 연결 가이드)
