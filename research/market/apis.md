# 데모용 무료 데이터 API 실측 리포트

- **작성일**: 2026-10-22 (KST) · 작성: rwa-researcher
- **대상**: Vercel에 배포할 RWA 신용·수출채권 데모에서 실제로 호출할 무료 API
- **원칙**: 모든 엔드포인트는 **PowerShell 5.1 + curl.exe 8.21.0**으로 실제 호출해 상태코드·지연·응답 크기를 측정했다. 키가 필요한 API는 키 없이 호출한 실제 에러를 기록했다. 측정값은 네트워크 환경에 따라 달라질 수 있다.
- **원본 증거**: 성공 응답은 `research/market/raw/*.json`에 저장(단, 9~10MB 대형 응답 2건은 리포 경량화를 위해 제거 — 본문에 핵심 수치 기록).

---

## 0. 테스트 환경

| 항목 | 값 |
|---|---|
| OS/셸 | Windows, PowerShell 5.1.26100.9711 |
| HTTP 클라이언트 | curl 8.21.0 (Schannel, WinIDN) |
| Node | v24.19.0 / npm 11.17.0 |
| Vercel CLI | 65.0.0 (인증 완료, `npx vercel whoami` 동작) |
| 테스트 시각 | 2026-10-22 07:10~07:40 KST |
| 측정 방식 | `curl.exe -sS -o <file> -w "%{http_code}|%{time_total}|%{size_download}"` |

---

## 1. 한눈에 보는 결과 (모두 2026-10-22 실측)

| # | API | 테스트 엔드포인트 | 상태 | 키 | 지연 | 크기 | 판정 |
|---|---|---|---|---|---|---|---|
| 1 | DefiLlama Stablecoins | `GET https://stablecoins.llama.fi/stablecoins?includePrices=true` | **200** | 불필요 | 297ms | 551,809B | ✅ 데모 추천 |
| 2 | DefiLlama Protocols | `GET https://api.llama.fi/protocols` | **200** | 불필요 | 717ms | 9,334,377B | ⚠️ 런타임 직접 사용 부적합 |
| 3 | DefiLlama Yields | `GET https://yields.llama.fi/pools` | **200** | 불필요 | 796ms | 10,743,123B | ⚠️ 대형, 가공 필요 |
| 4 | DefiLlama RWA overview | `GET https://api.llama.fi/overview/rwa` | **500** | — | 1,291ms | 14B | ❌ 존재하지 않는 무료 경로 |
| 4b | DefiLlama RWA list | `GET https://api.llama.fi/rwa/list` | **404** | — | 419ms | 0B | ❌ |
| 5 | Frankfurter FX | `GET https://api.frankfurter.app/latest?from=USD&to=KRW` | **200** | 불필요 | 402ms | 71B | ✅ 데모 추천 |
| 6 | open.er-api FX | `GET https://open.er-api.com/v6/latest/USD` | **200** | 불필요 | 257ms | 2,960B | ✅ 폴백 추천 |
| 7 | Yahoo Finance(비공식) | `GET https://query1.finance.yahoo.com/v8/finance/chart/KRW=X?range=5d&interval=1d` | **200** | 불필요 | 423ms | 1,774B | ⚠️ 비공식·약관 주의 |
| 8 | CoinGecko ping | `GET https://api.coingecko.com/api/v3/ping` | **200** | 불필요 | 360ms | 34B | ✅ |
| 8b | CoinGecko categories | `GET https://api.coingecko.com/api/v3/coins/categories` | **200** | 불필요 | 281ms | 355,925B | ✅ RWA 시총용 |
| 8c | CoinGecko simple price | `GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,krw` | **200** | 불필요 | 285ms | 81B | ✅ |
| 9 | Hyperliquid info | `POST https://api.hyperliquid.xyz/info` body `{"type":"metaAndAssetCtxs"}` | **200** | 불필요 | 105ms | 72,004B | ✅ |
| 9b | Hyperliquid HIP-3 dex | `POST .../info` body `{"type":"metaAndAssetCtxs","dex":"xyz"}` | **200** | 불필요 | 130ms | 61,423B | ✅ **최우선 추천** |
| 9c | Hyperliquid perpDexs | `POST .../info` body `{"type":"perpDexs"}` | **200** | 불필요 | 111ms | 21,710B | ✅ 빌더 DEX 목록 |
| 10 | Polymarket Gamma | `GET https://gamma-api.polymarket.com/markets?limit=2&active=true` | **연결 리셋** | 불필요 | 157ms | 0B | ❌ 이 네트워크에서 차단 |
| 10b | Polymarket CLOB/Data/Web | `https://clob.polymarket.com`, `https://data-api.polymarket.com`, `https://polymarket.com/api/...` | **451** | — | ~80ms | — | ❌ 지역 제한(451) |
| 11 | RWA.xyz API | `GET https://api.rwa.xyz/v4/assets?ticker=USDC` | **401** | **필요** | 640ms | 101B | 🔑 Bearer 키 필요 |
| 12 | Dune API | `GET https://api.dune.com/api/v1/query/1215386/results` | **401** | **필요** | 977ms | 27B | 🔑 |
| 13 | Etherscan V2 | `GET https://api.etherscan.io/v2/api?chainid=1&module=stats&action=ethprice` | 200이나 본문 에러 | **필요** | 794ms | 67B | 🔑 `Missing/Invalid API Key` |
| 14 | Blockscout(공개) | `GET https://eth.blockscout.com/api/v2/stats` | **200** | 불필요 | 1,371ms | 651B | ✅ 온체인 가스·주소·시총 |
| 15 | x402 facilitator | `GET https://x402.org/facilitator/supported` | **200** | 불필요 | 1,637ms | 1,801B | ✅ 에이전트 결제 증명 |
| 16 | 한국은행 ECOS | `GET https://ecos.bok.or.kr/api/StatisticSearch/sample/json/kr/1/10/722Y001/D/20261001/20261022` | **200** | 데모 키 `sample` | 174ms | 3,461B | ✅ 기준금리(호출당 10행 제한) |
| 16b | ECOS 환율(731Y001) | `GET .../731Y001/D/20261001/20261022` | **200** | `sample` | 173ms | 3,251B | ✅ 매매기준율 |
| 17 | 공공데이터포털(관세청) | `GET https://apis.data.go.kr/1220000/nitemtrade/getNitemtradeList?serviceKey=abc&...` | **403** | **필요** | 79ms | 286B | 🔑 `SERVICE_KEY_IS_NOT_REGISTERED_ERROR` |
| 18 | 무역보험공사 Open API | `https://openapi.ksure.or.kr` | DNS 실패 | — | 30ms | — | ❌ 호스트 없음 → 공공데이터 파일데이터 사용 |
| 19 | 수출입은행 | `https://www.koreaexim.go.kr` | 연결 리셋 | — | 191ms | — | ❌ 이 네트워크에서 차단 |

**요약**: 키 없이 바로 쓸 수 있는 것은 **DefiLlama·CoinGecko(Hyperliquid·Frankfurter·open.er-api·Blockscout·x402·BOK ECOS)** 계열이다. Polymarket은 이 네트워크에서 451/연결 리셋으로 **데모에서 배제**하는 것이 안전하다.

---

## 2. 성공 API 상세

### 2.1 DefiLlama — 스테이블코인 시총 (안정적, 데모 추천)

**요청**
```powershell
curl.exe -sS -o stablecoins.json -w "%{http_code}|%{time_total}|%{size_download}" "https://stablecoins.llama.fi/stablecoins?includePrices=true"
# 결과: 200|0.296828|551809
```

**응답 구조** (실제 저장 파일 `raw/defillama_stablecoins.json` 파싱 결과)
```json
{
  "peggedAssets": [
    {
      "id": "1", "name": "Tether", "symbol": "USDT",
      "circulating": { "peggedUSD": 182509339853.43796 },
      "chains": ["Ethereum", "Tron", "..."],
      "price": 1.0
    }
  ]
}
```

**핵심 실측 필드**
| 필드 | 샘플 값 | 의미 |
|---|---|---|
| `peggedAssets.length` | **424** | 집계 자산 수 |
| Σ `circulating.peggedUSD` | **$305,011,345,890** | 전체 스테이블코인 시총 |
| USDT `circulating.peggedUSD` | **$182,509,339,853.44** | 59.8% |
| USDC `circulating.peggedUSD` | **$72,564,612,499.49** | 23.8% |
| `BUIDL.circulating.peggedUSD` | **≈$2.2B** | 토큰화 MMF가 스테이블코인 목록에 포함됨(주의) |

- **키**: 불필요. **레이트리밋**: 공식 문서에 명시 수치 미확인(`확인 필요`), 과호출 시 429 반환 → 지수 백오프 필요.
- **Vercel 주의**: 552KB 응답이므로 **서버에서 필드 가공 후 ~10KB로 축약**해 클라이언트에 전달. 전체 JSON을 그대로 내려보내면 느려진다.
- **캐싱**: `revalidate 300`(5분) 권장. 시총은 5분 단위로 충분.

**더 가벼운 대안**: `https://stablecoins.llama.fi/stablecoincharts/all`(차트용), `https://api.llama.fi/summary/stablecoins`(확인 필요 — 본 테스트에서는 미호출).

---

### 2.2 DefiLlama — 프로토콜/수익률 (대형 응답, 가공 필수)

**실측**
```
GET https://api.llama.fi/protocols      -> 200, 717ms, 9,334,377B, 8,791개 프로토콜
GET https://yields.llama.fi/pools       -> 200, 796ms, 10,743,123B, 15,608개 풀
```

**핵심 파싱 결과 (2026-10-22)**
- RWA 카테고리 TVL 합계: **$4.02B** (DefiLlama는 DeFi 예치분만 집계)
- 주요 프로토콜 TVL: `Maple` **$2,742,789,804**, `Huma` **$378,761,553**, `Figure Markets Democratized Prime` **$190,258,099**, `Figure Markets Exchange` **$132,193,565**, `Goldfinch` **$2,379,156**, `Credix` **$1**, `Polytrade` **$8**
- yield 풀 15,608개 중 "rwa" 문자열 포함 풀: **71개** (예: `midas-rwa` USDC APY 4.84~7.43%)
- 최대 TVL 풀: `lido STETH` $24.07B (APY 2.232), `binance-staked-eth WBETH` $8.77B, `ether.fi WEETH` $5.47B

**RWA 전용 엔드포인트 테스트 결과**
| 시도한 경로 | 결과 |
|---|---|
| `GET https://api.llama.fi/overview/rwa` | **500** (14B) |
| `GET https://api.llama.fi/rwa/list` | **404** |
| `GET https://api.llama.fi/rwa` | **404** |
- **결론**: DefiLlama의 RWA 전용 데이터(RWA assets/stats)는 **Pro API(키 필요)** 영역이다. 무료로는 `/protocols`의 `category == "RWA"` 필터와 `/pools` 문자열 필터로 대체해야 한다.
- 참고: 공식 Go SDK 문서상 RWA 서비스(`GetCurrentAssets`)는 Pro 키를 요구한다 — https://raw.githubusercontent.com/tigusigalpa/defillama-go/main/README.md (확인 2026-10-22)

**Vercel 주의**: 9~10MB 응답을 **함수 런타임에서 매 요청 fetch하면 안 된다**. 선택지:
1. **빌드 타임 스냅샷**: 배포 시 1회 fetch → 필요한 30~50개 프로토콜만 추려 JSON 커밋 → 정적 import.
2. **ISR/Route Handler 캐시**: `revalidate = 3600`으로 시간당 1회만 대형 fetch.
3. 프로토콜 단건 API(`https://api.llama.fi/protocol/{slug}`) 사용 — 단건은 가볍다(별도 실측 `확인 필요`).

---

### 2.3 Frankfurter — USD/KRW (가장 가벼운 환율, 1순위)

```powershell
curl.exe -sS "https://api.frankfurter.app/latest?from=USD&to=KRW"
```
**응답 (2026-10-21 기준, 실측)**
```json
{"amount":1.0,"base":"USD","date":"2026-10-21","rates":{"KRW":1325.57}}
```
- **키**: 불필요. ECB 기준환율 기반, **일 1회 갱신**(주말·공휴일 전일자 유지). 71바이트로 초경량.
- **Vercel 주의**: 캐시 필수는 아니지만 `s-maxage=3600` 권장. 날짜(`date`)를 UI에 반드시 표기(지연 데이터임을 명시).
- 출처: https://www.frankfurter.app/docs (확인 2026-10-22)

### 2.4 open.er-api — FX 폴백 (전 통화 + 갱신시각 제공)

```powershell
curl.exe -sS "https://open.er-api.com/v6/latest/USD"
```
**핵심 필드 (실측)**: `result: "success"`, `time_last_update_utc: "Wed, 21 Oct 2026 00:02:32 +0000"`, `time_next_update_utc`, `rates.KRW: 1327.17027`, `rates.JPY: 158.224062`, `rates.CNY: 6.691314`
- **키**: 불필요(무료). 일 1회 갱신. 상업적 사용 조건은 약관 확인 필요(`확인 필요`).
- **용도**: Frankfurter 장애/통화쌍 부재 시 폴백.

### 2.5 Yahoo Finance 비공식 — 차트/시계열 (보조)

```powershell
curl.exe -sS "https://query1.finance.yahoo.com/v8/finance/chart/KRW=X?range=5d&interval=1d"
```
**핵심 필드 (실측)**: `chart.result[0].meta.regularMarketPrice = 1326.15`, `chartPreviousClose = 1339.35`, `fiftyTwoWeekHigh = 1587.7`, `fiftyTwoWeekLow = 1322.42`, `timestamp[]`, `indicators.quote[0].close[]`
- **키**: 불필요하지만 **비공식 API** — 예고 없이 차단/스키마 변경 가능. **프로덕션 의존 금지**, 데모 보조용.
- **Vercel 주의**: User-Agent 없으면 429/403 가능. 서버 사이드에서만 호출.

### 2.6 CoinGecko — 무료(키리스) API

```powershell
curl.exe -sS "https://api.coingecko.com/api/v3/ping"                 # {"gecko_says":"(V3) To the Moon!"}
curl.exe -sS "https://api.coingecko.com/api/v3/coins/categories"      # 355,925B
curl.exe -sS "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,krw"
```
**RWA 카테고리 핵심 수치 (2026-10-22 실측)**
| 카테고리 id | 시총 | 24h 거래대금 |
|---|---|---|
| `real-world-assets-rwa` | **$76,857,748,694** | $2,750,992,962 |
| `tokenized-products` | $48,627,919,077 | $1,639,012,277 |
| `tokenized-private-credit` | **$25,599,081,047** | $72,836,466 |
| `tokenized-treasuries` | $9,295,811,654 | $4,531,477 |
| `tokenized-money-market-fund-mmfs` | $3,014,472,565 | $0 |
| `ondo-tokenized-assets` | $1,023,350,291 | $160,741,535 |

- **레이트리밋 (공식 문서 확인 2026-10-22)**: 키리스 요청은 **IP 기반 공유 풀, 분당 약 10~30회(서버 부하에 따라 동적)**, GeckoTerminal 분당 약 10회. 429 시 지수 백오프. 공식 문서: https://docs.coingecko.com/docs/keyless-public-api
- **Vercel 주의**: 같은 Vercel 함수 IP에서 다수 사용자가 호출하면 429 위험 → **서버 캐시 필수**(`revalidate 600` 이상). 카테고리 응답 356KB → 필요한 5~6개 카테고리만 추출.
- **참고**: CoinGecko MCP 서버는 **키 없이** 사용 가능: `https://mcp.api.coingecko.com/mcp` (Streamable HTTP). 에이전트 데모에 활용 가능 — `toolkit/oss.md` 참조.

### 2.7 Hyperliquid info API — 24/7 RWA·한국자산 시세 (최우선 추천)

Hyperliquid의 **HIP-3 빌더 배포 perpetual DEX**를 이용하면 한국 자산과 실물자산이 온체인에서 24/7 거래되는 실제 시세를 무료로 얻을 수 있다. **키 불필요, 응답 105~130ms**로 가장 빠르다.

**(A) 전체 자산 컨텍스트**
```powershell
curl.exe -sS -X POST -H "Content-Type: application/json" -d '{\"type\":\"metaAndAssetCtxs\"}' https://api.hyperliquid.xyz/info
# 200, 105ms, 72,004B — 2개 원소 배열 [meta, ctxs], 자산 234개
```
**응답 형태**: `[ { "universe": [{ "name": "BTC", ... }] }, [ { "markPx":"84698.5","oraclePx":"...","funding":"...","openInterest":"...","dayNtlVlm":"..." } ] ]`

**(B) 빌더 DEX 목록**
```powershell
curl.exe -sS -X POST -H "Content-Type: application/json" -d '{\"type\":\"perpDexs\"}' https://api.hyperliquid.xyz/info
```
- 실측 DEX: `xyz`(XYZ), `flx`(Felix Exchange), `vntl`(Ventuals), `hyna`(HyENA), `km`(Markets by Kinetiq), `abcd`, `cash`(dreamcash), `para`(Paragon), `mkts`, `io`(EntropyIO) 등
- `vntl`에는 **프리IPO 자산**(`vntl:OPENAI`, `vntl:ANTHROPIC`, `vntl:SPACEX`), `km`/`para`에는 **국채금리**(`para:10Y`, `para:2Y`, `para:30Y`)까지 상장.

**(C) 한국 자산·RWA perps (핵심 — 2026-10-22 07:35 KST 실측)**
```powershell
curl.exe -sS -X POST -H "Content-Type: application/json" -d '{\"type\":\"metaAndAssetCtxs\",\"dex\":\"xyz\"}' https://api.hyperliquid.xyz/info
# 200, 130ms, 61,423B — xyz DEX 138개 자산
```
| 마켓 | markPx | oraclePx | funding | dayNtlVlm | 의미 |
|---|---|---|---|---|---|
| `xyz:KR200` | **880.76** | 884.52 | -0.000174 | **$999,682** | 코스피200 지수 perp |
| `xyz:KRW` | **1,326.8** | 1,326.8 | 0.0 | $0 | USD/KRW perp(현재 OI 0, 시세만) |
| `xyz:HYUNDAI` | **231.81** | 232.62 | -0.000229 | $970,852 | 현대차 |
| `xyz:SKHX` | **956.1** | 961.67 | -0.000299 | **$341,856,646** | SK하이닉스 계열(티커 표기) |
| `xyz:EWY` | 154.98 | 154.91 | +0.00000625 | $38,645,542 | 한국 ETF(EWY) |
| `xyz:SP500` | 7,739.5 | 7,741.3 | +0.0000000018 | **$245,995,313** | S&P500 |
| `xyz:GOLD` | 4,139.0 | 4,138.2 | +0.00000625 | $34,579,975 | 금 |
| `xyz:SILVER` | 57.865 | 57.847 | +0.00000625 | $133,493,112 | 은 |
| `xyz:BRENTOIL` | 105.8 | 105.76 | +0.00000625 | $136,423,122 | 브렌트유 |
| `xyz:COPPER` | 6.5683 | 6.5685 | +0.00000625 | $4,541,354 | 구리 |
| `xyz:TSLA` | 378.71 | 378.69 | +0.00000625 | $110,726,887 | 테슬라 |
| `xyz:NVDA` | 221.22 | 221.25 | +0.0000019609 | $127,472,527 | 엔비디아 |
- **xyz DEX 전체 일 거래대금: $3,636,885,257** (138개 자산, 2026-10-22 실측)
- **필드 의미**: `markPx` 마크가격, `oraclePx` 오라클가격, `funding` 펀딩레이트(8시간), `openInterest` 미결제약정(계약수), `dayNtlVlm` 24시간 명목 거래대금, `prevDayPx` 전일가.
- **레이트리밋**: Hyperliquid 공식 문서상 IP/주소 기반 weight 제한이 있으나 본 조사에서 정확한 수치 추출 실패 → `확인 필요`. 공식 문서: https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/rate-limits-and-user-limits (확인 2026-10-22, 페이지 접근 200)
- **Vercel 주의**: POST + JSON body이므로 **Edge 런타임에서도 호출 가능**. 응답 61KB라 서버에서 한국 마켓 6~8개만 추출하면 ~3KB. `revalidate 60`(1분) 권장.
- **주의**: 이는 **파생상품 시세**이며 현물 주가가 아니다. 데모에서 "24/7 온체인 시장에서 한국 자산이 거래된다"는 증거로 쓰되, "주식 토큰화"라고 오표기하지 말 것.

### 2.8 Blockscout — 온체인 스탯 (키 불필요)

```powershell
curl.exe -sS "https://eth.blockscout.com/api/v2/stats"
```
**실측 필드**: `coin_price: "2491.63"`, `market_cap: "304351383242.05"`, `gas_prices: {slow: 0.16, average: 0.35, fast: 1.96}`, `total_addresses: "745235002"`, `total_transactions: "3813002538"`, `network_utilization_percentage: 44.3`
- **용도**: 데모에서 "온체인 정산 레일 상태" 위젯(가스비·활성도)으로 활용.
- **키**: 불필요(공개 인스턴스). 프로덕션 SLA 없음 → 캐시 `revalidate 300`.

### 2.9 x402 facilitator — 에이전트 결제 지원 네트워크

```powershell
curl.exe -sS "https://x402.org/facilitator/supported"
```
**실측 응답 요약**
```json
{
  "kinds": [
    {"x402Version":2,"scheme":"exact","network":"eip155:84532"},
    {"x402Version":2,"scheme":"upto","network":"eip155:84532","extra":{"facilitatorAddress":"0xd407..."}},
    {"x402Version":2,"scheme":"batch-settlement","network":"eip155:84532"},
    {"x402Version":2,"scheme":"exact","network":"solana:EtWTRAB..."},
    {"x402Version":2,"scheme":"exact","network":"algorand:..."},
    {"x402Version":2,"scheme":"exact","network":"aptos:2"},
    {"x402Version":2,"scheme":"exact","network":"stellar:testnet"},
    {"x402Version":2,"scheme":"exact","network":"hedera:testnet"},
    {"x402Version":2,"scheme":"exact","network":"xrpl:1"},
    {"x402Version":1,"scheme":"exact","network":"base-sepolia"}
  ],
  "extensions": ["builder-code","eip2612GasSponsoring","erc20ApprovalGasSponsoring"],
  "signers": {"eip155:*":["0xd407..."],"solana:*":["CKPKJWN..."]}
}
```
- **키**: 불필요. **용도**: "에이전트가 수출채권 데이터·신용점수를 x402로 건당 과금 구매"하는 데모 시나리오의 근거.
- **주의**: 현재 실측 네트워크는 대부분 **테스트넷**(84532 = Base Sepolia). 메인넷 지원은 별도 확인 필요(`확인 필요`).

### 2.10 한국은행 ECOS — 기준금리·환율 (데모 키 `sample`)

```powershell
# 기준금리(일별, 722Y001)
curl.exe -sS "https://ecos.bok.or.kr/api/StatisticSearch/sample/json/kr/1/10/722Y001/D/20261001/20261022"
# 환율(일별, 731Y001)
curl.exe -sS "https://ecos.bok.or.kr/api/StatisticSearch/sample/json/kr/1/10/731Y001/D/20261001/20261022"
```
**실측 결과 (2026-10-22)**
- `722Y001` / `0101000` (한국은행 기준금리): **2026-10-01 = 3.00**, 2026-01-01 = 2.50 → 연중 인상 확인
- 부가: 정책대출금리 3.163%, 자금조정 대출금리 3.5%, 자금조정 예금금리 2.5%
- `731Y001` / `0000001` (원/미국달러 매매기준율): **2026-10-01 = 1,355.7**
- 응답 형식: `{"StatisticSearch":{"list_total_count":2628,"row":[{"STAT_CODE","ITEM_CODE1","TIME","DATA_VALUE",...}]}}`
- **제약**: 공개 데모 키 `sample`은 **호출당 최대 10행**으로 제한. 더 필요하면 ECOS에서 무료 개인 키 발급(https://ecos.bok.or.kr/api). (3자 문서 기준 확인 2026-07-21: https://raw.githubusercontent.com/NomaDamas/k-skill/master/docs/features/bok-ecos-stats.md)
- **Vercel 주의**: 인코딩(EUC-KR 계열) 이슈로 한글 필드가 깨질 수 있음 → `ITEM_CODE`로 매핑하고 한글 라벨은 UI에서 직접 정의. **개인 키를 Vercel 환경변수로** 넣고 클라이언트에 노출 금지.

---

## 3. 실패·키 필요 API (키 없이 호출한 실제 결과)

| API | 호출 | 실제 응답 | 필요한 조치 |
|---|---|---|---|
| **RWA.xyz** | `GET https://api.rwa.xyz/v4/assets?ticker=USDC` | **401** `{"message":"Missing API key. Please provide it in the 'Authorization' header as 'Bearer <API_KEY>'."}` | `app.rwa.xyz` 로그인 → API Keys 발급. 문서: https://docs.rwa.xyz/api/quickstart (확인 2026-10-22). **MCP 서버도 존재**(키 필요): https://docs.rwa.xyz/mcp/overview |
| **Dune** | `GET https://api.dune.com/api/v1/query/1215386/results` | **401** (27B) | 무료 플랜 키 발급(쿼리 실행 크레딧 제한) — 데모에서는 비추천 |
| **Etherscan V2** | `GET https://api.etherscan.io/v2/api?chainid=1&module=stats&action=ethprice` | HTTP 200이나 본문 `{"status":"0","message":"NOTOK","result":"Missing/Invalid API Key"}` | 무료 키 발급(https://etherscan.io/apis). 온체인 읽기는 **Blockscout로 대체 가능** |
| **공공데이터포털(관세청 수출입)** | `GET https://apis.data.go.kr/1220000/nitemtrade/getNitemtradeList?serviceKey=abc&...` | **403** `<errMsg>SERVICE_KEY_IS_NOT_REGISTERED_ERROR</errMsg>` | data.go.kr 회원가입 → 활용신청 → 인증키. 일일 트래픽 한도는 API별 상이(`확인 필요`) |
| **공공데이터포털(수출입총괄)** | `.../tsdataGwanggaek/GetGwanggaekList?...` | **400** `NO_OPENAPI_SERVICE_ERROR` | 엔드포인트/오퍼레이션명이 다름 → data.go.kr에서 정확한 OpenAPI 명세 확인 필요(`확인 필요`) |
| **Polymarket Gamma** | `GET https://gamma-api.polymarket.com/markets?limit=2&active=true` | **curl (35) Recv failure: Connection was reset** | 이 네트워크에서 차단/지역제한. `clob`·`data-api`·`polymarket.com` 모두 **451** → 데모에서 제외. (Vercel 배포 리전에서는 될 수도 있으나 `확인 필요`) |
| **무역보험공사 Open API** | `https://openapi.ksure.or.kr` | **DNS 실패**(호스트 없음) | 공식 Open API 없음 → `data.go.kr` **파일데이터**(단기수출보험 인수·보상·회수, 종목별 인수실적) 다운로드 방식 사용: https://www.data.go.kr/data/15159503/fileData.do |
| **한국수출입은행** | `https://www.koreaexim.go.kr` | **연결 리셋** | 이 네트워크에서 차단. 환율 API는 Frankfurter/open.er-api로 대체 |

> **보안 주의**: 위 키들은 모두 **서버 사이드(Vercel 환경변수)**에서만 사용하고, 클라이언트 번들에 넣지 말 것. 특히 `NEXT_PUBLIC_` 접두사 금지.

---

## 4. Vercel 배포 시 주의점 & 캐싱 전략

### 4.1 런타임 선택

| 상황 | 권장 런타임 | 이유 |
|---|---|---|
| DefiLlama/CoinGecko 대형 JSON 가공, ECOS 파싱 | **Node.js runtime** | JSON 파싱·문자열 처리·라이브러리 사용 자유 |
| Hyperliquid/Frankfurter 단순 프록시 | **Edge runtime** | 낮은 지연, fetch 전역 지원. 단 Node API(`fs`, `Buffer`) 불가 |
| API 키가 필요한 RWA.xyz/Dune | **Node.js** | 키 보관·서버 전용 로직 |

### 4.2 캐싱 설계 (핵심)

1. **Next.js App Router**: `fetch(url, { next: { revalidate: 300 } })` 또는 라우트 세그먼트 `export const revalidate = 300`. ISR 캐시가 CDN에 남아 API 호출을 대폭 줄인다.
2. **Route Handler 응답 헤더**: `Cache-Control: s-maxage=300, stale-while-revalidate=600`.
3. **대형 응답(DefiLlama 9~10MB, CoinGecko 356KB)**: 매 요청 fetch 금지 → **빌드 타임 스냅샷**(`scripts/snapshot.mjs`로 1회 수집 후 `data/*.json` 커밋) 또는 ISR 1시간 캐시.
4. **초경량 응답(Frankfurter 71B, Hyperliquid 한국 마켓 추출 3KB)**: Edge + `revalidate 60~300`.
5. **장애 폴백**: 모든 API 호출에 `AbortController` 3초 타임아웃 + **마지막 정상 스냅샷** 반환. 데모 시연 중 네트워크 장애로 화면이 비는 것을 방지.
6. **Vercel 함수 한도**: 응답 크기·실행시간 한도는 플랜/런타임별로 다르다(`https://vercel.com/docs/functions/limitations` 확인, 2026-10-22 접근 200). **수 MB JSON을 함수 응답으로 직접 반환하지 말 것** — 클라이언트에는 항상 가공된 소형 JSON만.
7. **빌드 타임 API 호출 금지**: 빌드가 외부 API 장애에 의존하면 배포 실패. 스냅샷은 **커밋된 파일**을 읽고, 갱신은 별도 스크립트/크론으로.

### 4.3 데모 시나리오별 데이터 매핑

| 화면 | API | 캐시 |
|---|---|---|
| RWA 시장 개요 (시총 4종 비교) | CoinGecko `/coins/categories` | 10분 |
| 스테이블코인 유동성 게이지 | DefiLlama `/stablecoins` | 5분 |
| 한국 수출기업 신용여권 | 관세청(키 필요) + ECOS + Hyperliquid KRW | 1시간/1분 |
| 수출채권 토큰 발행 | 온체인(데모 컨트랙트) + Frankfurter | 1분 |
| 90일 팩토링 정산 | Hyperliquid `xyz` RWA perps + Blockscout | 1분 |
| 에이전트 과금 증명 | x402 facilitator `/supported` | 1일 |

---

## 5. 데모 추천 API 3개 (정확한 테스트 명령 포함)

### ① Hyperliquid info API — 한국 자산 24/7 온체인 시세
```
POST https://api.hyperliquid.xyz/info
Content-Type: application/json
{"type":"metaAndAssetCtxs","dex":"xyz"}
```
```powershell
curl.exe -sS -X POST -H "Content-Type: application/json" -d '{\"type\":\"metaAndAssetCtxs\",\"dex\":\"xyz\"}' https://api.hyperliquid.xyz/info
```
- 2026-10-22 실측: **200, 130ms, 61,423B**, xyz DEX 138개 자산, 일 거래대금 **$3.64B**
- 뽑을 필드: `xyz:KR200` 880.76 · `xyz:KRW` 1,326.8 · `xyz:HYUNDAI` 231.81 · `xyz:SKHX` 956.1 · `xyz:EWY` 154.98 · `xyz:SP500` 7,739.5
- **왜 1순위인가**: 키 없음, 가장 빠름, "한국 자산이 24/7 온체인에서 거래된다"는 논지를 **실데이터로** 증명.

### ② DefiLlama Stablecoins — USDC 유동성 풀의 실제 크기
```
GET https://stablecoins.llama.fi/stablecoins?includePrices=true
```
```powershell
curl.exe -sS -o raw/defillama_stablecoins.json -w "%{http_code}|%{time_total}|%{size_download}" "https://stablecoins.llama.fi/stablecoins?includePrices=true"
```
- 2026-10-22 실측: **200, 297ms, 551,809B**, 총 **$305.01B**, USDC **$72.56B**, USDT **$182.51B**
- **가공 필드**: `total`, `USDC.circulating.peggedUSD`, 상위 10개 → ~2KB
- **왜 2순위인가**: RWA 레일의 조달 유동성을 가장 신뢰성 있게 보여줌. 캐싱만 하면 안정적.

### ③ Frankfurter — USD/KRW 기준환율 (초경량)
```
GET https://api.frankfurter.app/latest?from=USD&to=KRW
```
```powershell
curl.exe -sS "https://api.frankfurter.app/latest?from=USD&to=KRW"
```
- 2026-10-22 실측: **200, 402ms, 71B**, `{"base":"USD","date":"2026-10-21","rates":{"KRW":1325.57}}`
- **왜 3순위인가**: 수출채권의 84.2%가 달러 표시이므로 **원화 환산·환리스크 표시**에 필수. 71바이트라 부담 0.

**보조 추천**: CoinGecko categories(RWA 시총 4종), 한국은행 ECOS(기준금리 3.00%), x402 facilitator(에이전트 결제), Blockscout(온체인 상태).

---

## 6. 재현 방법 (스크립트)

```powershell
# research/market/raw 디렉터리에서 실행
$dir = "research/market/raw"
$urls = @{
  "defillama_stablecoins" = "https://stablecoins.llama.fi/stablecoins?includePrices=true"
  "frankfurter"           = "https://api.frankfurter.app/latest?from=USD&to=KRW"
  "erapi"                 = "https://open.er-api.com/v6/latest/USD"
  "coingecko_categories"  = "https://api.coingecko.com/api/v3/coins/categories"
  "blockscout"            = "https://eth.blockscout.com/api/v2/stats"
  "x402_facilitator"      = "https://x402.org/facilitator/supported"
}
foreach ($k in $urls.Keys) {
  $code = curl.exe -sS --max-time 40 -A "rwa-research/1.0" -o "$dir/$k.json" -w "%{http_code}|%{time_total}|%{size_download}" $urls[$k]
  Write-Output "$k -> $code"
}
curl.exe -sS --max-time 40 -X POST -H "Content-Type: application/json" -d '{\"type\":\"metaAndAssetCtxs\",\"dex\":\"xyz\"}' -o "$dir/hl_xyz.json" -w "hl_xyz -> %{http_code}|%{time_total}|%{size_download}" https://api.hyperliquid.xyz/info
```

- 저장된 원본: `research/market/raw/` (stablecoins 552KB, coingecko_categories 356KB, hyperliquid 72KB, hl_xyz 61KB, ECOS 3.4KB, FX 3KB 등)
- 파싱 스크립트: `raw/parse_stable.mjs`, `raw/parse_cg.mjs`, `raw/parse_xyz.mjs`, `raw/parse_bok.mjs`(Node 24, ESM)
- 제거한 파일: `defillama_protocols.json`(9.3MB), `defillama_yields.json`(10.7MB) — 리포 경량화 목적. 핵심 수치는 §2.2에 기록.
