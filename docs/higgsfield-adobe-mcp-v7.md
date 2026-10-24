# Higgsfield · Adobe MCP — 상태와 v7 웹디자인 적용 계획

> 사용자 요청: "힉스필드 어도비 mcp를 더 활용해서 웹디자인 홈페이지 개편". 영상은 제외(웹디자인만).
> 작성: 2026-10-25 · Lead

## 1. 현재 접근 상태 (정직하게)

| 경로 | 상태 | 차단 사유 |
|---|---|---|
| Higgsfield 공식 MCP (`https://mcp.higgsfield.ai/mcp`) | **미연결** | 유료 구독 + 브라우저 OAuth 필요. 익명 접근 401. `HIGGSFIELD_API_KEY` 미설정 |
| Higgsfield REST API | **미연결** | API key + 유료 크레딧($5) 필요. 환경변수 없음 |
| Adobe Firefly / Adobe MCP | **미연결** | 공식 공개 MCP 미확인. Firefly API는 Enterprise 계약/키 필요 |
| 로컬 이미지 파이프라인 | **가동** | Chrome/Pillow/numpy로 렌더·합성 가능 (MCP 아님) |

환경 재확인 결과 `HIGGSFIELD_*`, `ADOBE_*`, `FIREFLY_*` 환경변수가 없습니다.
따라서 이번 라운드에서도 **MCP를 실제 호출해 이미지를 생성하는 것은 불가능**합니다.
필요한 것:
1. Higgsfield: `HIGGSFIELD_API_KEY` (또는 브라우저 OAuth 세션) — 가장 빠른 경로.
2. Adobe: Firefly client id/secret + Enterprise 권한, 또는 Adobe Express MCP 승인.

## 2. v7 "Quiet Confidence"에 필요한 아트 큐

| 자산 | 용도 | 스타일 | 상태 |
|---|---|---|---|
| `hero-passport` | 히어로 우측 제품 카드 뒤 보조 이미지 | warm porcelain 위 정면 문서, 소프트 스튜디오 라이트 | DOM 렌더로 대체 가능 |
| `artifact-light` | Artifact 섹션 대형 제품 샷 | 종이 질감·얕은 그림자, 크롬/네온 금지 | DOM 렌더 |
| `og-v7` | OG/Twitter 1200×630 | 라이트 배경 + 워드마크 + 여권 요약 + 한 줄 | **로컬 생성 완료** |
| `market-cover` | /market 상단 | 라이브 데이터 추상화(선·그리드 최소) | CSS로 충분 |
| `nitro-letter` | /nitro letterhead | 종이·인장 | CSS |

v7 방향은 **AI 생성 이미지보다 실제 제품 화면(DOM)과 조판**이 더 Apple/Coinbase에 가깝습니다.
따라서 MCP 이미지가 연결되면 아래 용도로만 제한적으로 사용:
- 히어로/OG의 **소프트 라이트 배경**(텍스처 없는 스튜디오 조명)
- 여권 문서의 **종이 질감 클로즈업**(과한 크롬/네온 금지)

## 3. Higgsfield 프롬프트 팩 (v7 라이트)

MCP 연결 시 바로 실행할 프롬프트:

1. `hero-light`
   > Premium fintech website hero background, warm porcelain white (#F7F6F3) studio surface, soft directional light from top-left, subtle shadow falloff bottom-right, no text, no objects, ultra clean, Apple product photography lighting, 16:9.
2. `passport-paper`
   > Close-up of a premium A4 credit document on warm white paper, deep black ink, one vermilion red seal, fine rules, soft natural shadow, shot from 15 degrees, no chrome, no neon, no text legible, Apple keynote product shot, 4:3.
3. `og-light`
   > Minimal fintech OG image background, porcelain white with soft warm gradient and one vermilion accent square, no text, lots of negative space, 1200x630.
4. `seal`
   > Single vermilion ink seal stamp on white paper, slightly imperfect edge, top-down macro, soft light, no text, 1:1.

## 4. Adobe 경로

- Adobe Firefly Services API: OAuth Server-to-Server 자격증명 필요. 연결되면 `text-to-image`로 위 4종 생성 → 로컬 Pillow로 리사이즈/합성.
- Adobe Express MCP: 현재 공개 MCP 서버 미확인. 확인 시 `mcp/web-art.mcp.json`에 추가.

## 5. MCP 설정 예시 (자격증명 확보 시)

`rail-app/mcp/web-art.mcp.json`:

```json
{
  "mcpServers": {
    "higgsfield": {
      "url": "https://mcp.higgsfield.ai/mcp",
      "headers": { "Authorization": "Bearer ${HIGGSFIELD_API_KEY}" }
    },
    "adobe-firefly": {
      "command": "npx",
      "args": ["-y", "@adobe/firefly-mcp"],
      "env": {
        "FIREFLY_CLIENT_ID": "${FIREFLY_CLIENT_ID}",
        "FIREFLY_CLIENT_SECRET": "${FIREFLY_CLIENT_SECRET}"
      }
    }
  }
}
```

> 실제 엔드포인트/패키지는 계정 권한 확인 후 확정. 현재는 템플릿.

## 6. 이번 라운드 대체안 (MCP 없이)

- OG 이미지: `design/og-v7/index.html`을 Chrome으로 1200×630 렌더 → `rail-app/app/opengraph-image.png` 교체.
- 제품 샷: 실제 여권 DOM을 2x 스크린샷해 `public/art/v7/`에 저장(텍스트/수치 실제 엔진 값).
- 배경: CSS radial/linear soft light만 사용, 그라디언트/글로우/그레인 금지 규칙 유지.

## 7. 사용자에게 필요한 한 가지

**Higgsfield API 키(또는 OAuth 승인) 하나면** 이번 큐 4종을 실제 MCP로 생성해
히어로/OG/여권 클로즈업에 적용할 수 있습니다. 키를 주시면 다음 라운드에서 바로 실행합니다.
