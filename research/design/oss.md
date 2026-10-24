# OSS 검증 — v2 모션·카운트업·타이포 후보 (npm 실측)

- **작성**: 2026-10-22 (KST) · design-researcher · 대상: `rail-app` v2 "Night Signal"
- **검증 방법**: 로컬에서 `npm view <pkg> version license dist.unpackedSize dependencies`를 **실제 실행**(Node v24.19.0 / npm 11.17.0, 2026-10-22)했고, 번들 크기는 [bundlephobia API](https://bundlephobia.com)로 min/gzip을 실측했다. 폰트 라이선스는 저장소 원문(raw GitHub)으로 확인했다.
- **주의**: bundlephobia 수치는 패키지 엔트리 기준이며 Next.js 트리셰이킹 결과와 다를 수 있다. 최종 수치는 `npm run build`의 route별 First Load JS로 확인해야 한다.

---

## 1. npm 실측 표

| 패키지 | latest | 라이선스 | npm unpacked | min (bundlephobia) | **gzip** | 의존성 | v2 판정 |
|---|---|---|---|---|---|---|---|
| **motion** | **14.5.0** | MIT | 890,190 B | 168,905 B | **56,930 B** | `framer-motion@14.5.0`, `tslib` (+motion-dom, motion-utils) | ✅ **채택** (이미 `package.json`에 `^14.5.0`) |
| **@number-flow/react** | **0.6.2** | MIT | 25,039 B | 18,920 B | **6,271 B** | `number-flow@0.6.2`, `esm-env` | ✅ **채택** (카운트업) |
| **@fontsource/instrument-serif** | **5.3.0** | OFL-1.1 | 147,162 B | — (폰트) | — | 없음 | ✅ **채택** (세리프 자체 호스팅) |
| lenis | 1.3.27 | MIT | 458,320 B | 18,852 B | 5,458 B | 없음 | ❌ 미채택 (DESIGN-V2 §5) |
| vaul | 1.1.2 | MIT | 184,301 B | 59,959 B | 18,498 B | `@radix-ui/react-dialog` 외 다수 | ❌ 미채택 |
| rough-notation | 0.5.1 | MIT | 63,172 B | 10,671 B | 3,981 B | 없음 | ❌ 미채택 |
| geist | 1.8.2 | OFL(SIL Open Font License) | 7,999,640 B | — (폰트) | — | 없음 | ❌ 미채택 |
| `instrument-serif` (npm 단독명) | **E404 없음** | — | — | — | — | — | ⚠️ 존재하지 않음 → `@fontsource/*` 사용 |
| @fontsource/ibm-plex-mono (참고) | 5.3.0 | OFL-1.1 | 1,489,824 B | — | — | 없음 | 참고(현재 CDN 사용 중) |
| @fontsource/pretendard (참고) | 5.3.0 | OFL-1.1 | 16,988,258 B | — | — | 없음 | 참고(현재 jsDelivr CDN 사용 중) |

**실측 로그(요약)**
```
motion               -> 14.5.0  MIT   unpacked=890190  min=168905 gzip=56930
@number-flow/react   -> 0.6.2   MIT   unpacked=25039   min=18920  gzip=6271
lenis                -> 1.3.27  MIT   unpacked=458320  min=18852  gzip=5458
vaul                 -> 1.1.2   MIT   unpacked=184301  min=59959   gzip=18498
rough-notation       -> 0.5.1   MIT   unpacked=63172   min=10671  gzip=3981
geist                -> 1.8.2   OFL   unpacked=7999640
@fontsource/instrument-serif -> 5.3.0 OFL-1.1 unpacked=147162
instrument-serif     -> E404 (npm 레지스트리에 없음)
```

현재 `rail-app/package.json`에는 이미 `motion ^14.5.0`이 있고, `components/ui/motion.tsx`가 `motion/react`의 `motion`, `useReducedMotion`, `useInView`, `animate`로 **Reveal(스크롤 진입) / CountUp / Float**를 직접 구현해 두었다(2026-10-22 확인). 즉 **모션 기반은 이미 깔려 있고**, 남은 결정은 "카운트업을 직접 구현으로 둘지, number-flow로 바꿀지"다.

---

## 2. v2에 실제 쓸 3개 추천 (이유 포함)

### ① `motion` 14.5.0 — 히어로 stagger + 스크롤 리빌 (필수, 이미 설치됨)

- **이유**: v2 모션 요구(DESIGN-V2 §5: 텍스트 stagger 0.06s, whileInView fade-up 12px, `prefers-reduced-motion` 정적)를 한 패키지로 커버한다. MIT, gzip **약 56.9KB**. `components/ui/motion.tsx`의 `Reveal`이 이미 `useReducedMotion()` 분기를 갖고 있어 접근성 요구를 만족한다.
- **비용 판단**: gzip 57KB는 히어로 임팩트에 비해 합리적이다. 단, **한 route에서 `motion/react`를 쓰는 컴포넌트가 많을수록 공통 청크에 실리므로** 랜딩·시장 양쪽에서 쓰는 `Reveal`은 클라이언트 경계를 최소화한다(`"use client"`는 프리미티브에만, 페이지는 서버 유지).
- **레시피(이미 구현된 API 기준)**:
  ```tsx
  // components/ui/motion.tsx 의 Reveal 사용
  <Reveal delay={0.06 * i} y={12}>…</Reveal>
  // 히어로는 variants + staggerChildren 0.06 (motion/react)
  <motion.h1 variants={rise} initial="hidden" animate="show" />
  ```
- **검증**: `npx tsc --noEmit` → `npm run build`에서 `/` First Load JS 변화 확인.

### ② `@number-flow/react` 0.6.2 — 카운트업 (선택적 교체)

- **이유**: v2는 숫자를 "증거"로 쓰므로(점수 73.4, 한도 1억 8,000만원, APR 8.55%) 숫자가 **레이아웃 시프트 없이** 자리에서 굴러가야 한다. number-flow는 자릿수 폭을 고정한 채 숫자만 전환하고, `Intl.NumberFormat` 기반 포맷을 지원한다. MIT, gzip **6,271B**, 번들 영향이 거의 없다.
- **현재 구현과의 관계**: `components/ui/motion.tsx`의 `CountUp`(motion `animate`)은 이미 동작하며 추가 의존성이 0이다. **차이는 연출**이다 — `CountUp`은 값이 증가하는 카운터, number-flow는 **오도미터(자릿수 롤)** 다. "비싸 보이는" 숫자 연출에는 오도미터가 유리하지만, 필수는 아니다.
- **권고**: ① 시간이 없으면 기존 `CountUp` 유지(의존성 0, 요구사항 충족) ② 히어로/여권의 핵심 숫자 1~2개에만 number-flow 적용. 전체 숫자에 남용하지 않는다.
- **사용(최소 형태, 정확한 props는 [문서](https://number-flow.barvian.me) 참조)**:
  ```tsx
  import NumberFlow from "@number-flow/react";
  <NumberFlow value={result.score} />
  ```
- **주의**: `prefers-reduced-motion`에서 숫자가 정지하는지 실제 브라우저에서 반드시 확인(패키지가 자체 처리하더라도 검수 필요).

### ③ `@fontsource/instrument-serif` 5.3.0 — 세리프 자체 호스팅 (타이포 필수요소)

- **이유**: DESIGN-V2 §2가 요구하는 Instrument Serif(italic 400)는 v2의 유일한 "editorial luxury" 장치다. 현재 `app/layout.tsx`는 `fonts.googleapis.com` CSS를 **렌더 블로킹으로 로드**한다. `@fontsource/instrument-serif`(OFL-1.1, 147KB 패키지)를 쓰면 필요한 weight/italic woff2만 번들에 포함되고 외부 요청이 사라진다.
- **더 좋은 무설치 대안**: Next.js 내장 `next/font/google`(빌드 시 셀프호스팅)을 쓰면 **추가 npm 패키지 0개**로 같은 효과를 낸다. 현재 레포는 `<link>` CDN 방식이므로, 리드가 "새 패키지 최소화"를 원하면 `next/font/google` 전환이 1순위, 네트워크가 불안한 CI/오프라인 빌드라면 `@fontsource`가 2순위다.
- **OFL 의무**: 자체 호스팅 시 저작권 고지 + OFL 원문을 저장소에 포함해야 한다(예: `public/fonts/OFL-InstrumentSerif.txt`).
- **사용 예(대안)**:
  ```tsx
  import { Instrument_Serif } from "next/font/google";
  const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal","italic"], variable: "--font-serif-display", display: "swap" });
  ```

> **3개 요약**: 모션 = `motion`(stagger·리빌), 숫자 = `@number-flow/react`(카운트업), 타이포 = `@fontsource/instrument-serif`(또는 `next/font/google` 무설치 대안). 이 셋이면 v2 모션·숫자·세리프 요구가 전부 채워진다.

---

## 3. 미채택 후보와 이유 (근거 수치 포함)

| 패키지 | 왜 안 쓰는가 |
|---|---|
| **lenis 1.3.27** (gzip 5.4KB) | DESIGN-V2 §5가 "성능·접근성 리스크"로 명시 배제. 게다가 Lenis는 스크롤을 가로채 `prefers-reduced-motion`·키보드 스크롤과 충돌 검수가 필요하다. **이번 라운드 도입하지 않는다.** |
| **vaul 1.1.2** (gzip 18.5KB, `@radix-ui/react-dialog` 의존) | 모바일 드로어가 필요한 화면이 없다. 여권 액션은 이미 `CopyButton`/`PrintButton`/JSON 다운로드로 충분. 의존성 트리(radix 다수)가 과하다. |
| **rough-notation 0.5.1** (gzip 4KB) | 손그림 밑줄/서클은 "금융 문서·계측기" 톤과 충돌한다. RAIL의 강조는 오렌지·모노 라벨·헤어라인으로 이미 해결된다. |
| **geist 1.8.2** (unpacked 8.0MB) | 폰트 패키지 자체는 우수하지만 v2는 Geist Sans를 쓰지 않고, 라벨은 IBM Plex Mono로 확정. 8MB 패키지를 추가할 이유가 없다. |
| **instrument-serif (npm 단독)** | **레지스트리에 존재하지 않음(E404)** → 이름만 보고 `npm i instrument-serif`를 시도하면 실패한다. 반드시 `@fontsource` 또는 `next/font/google`을 쓴다. |

---

## 4. 폰트 라이선스 검증 (전부 OFL 1.1)

| 폰트 | 라이선스 | 저작권/조건 | 출처(확인 2026-10-22) |
|---|---|---|---|
| **Instrument Serif** | SIL OFL 1.1 | © 2022 The Instrument Serif Project Authors. 임베딩·수정·재배포 가능, 예약 폰트명 사용 제한 | [google/fonts OFL.txt](https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/OFL.txt) |
| **Pretendard** | SIL OFL 1.1 | © 2021 Kil Hyung-jin, **Reserved Font Name 'Pretendard'**, Source/Inter/M PLUS 1 파생 명시 | [orioncactus/pretendard LICENSE](https://raw.githubusercontent.com/orioncactus/pretendard/main/LICENSE) |
| **IBM Plex Mono** | SIL OFL 1.1 | © 2017 IBM Corp., **Reserved Font Name "Plex"** | [IBM/plex LICENSE.txt](https://raw.githubusercontent.com/IBM/plex/master/LICENSE.txt) |

**결론**: 세 폰트 모두 상업적 사용·웹 임베딩 가능. 단 ① 자체 호스팅 시 **OFL 원문·저작권 고지를 저장소에 포함**, ② 폰트 파일을 단독으로 판매하지 않고, ③ 수정본에 예약 폰트명(Pretendard/Plex)을 쓰지 않는다 — 현재 계획(CDN 또는 자체 호스팅, 수정 없음)은 모두 문제없다.

---

## 5. 도입 절차 및 검증 커맨드

```powershell
# 1) 추가 설치 (motion은 이미 있음 — 버전만 확인)
npm view motion version            # 14.5.0
npm install @number-flow/react@0.6.2
npm install @fontsource/instrument-serif@5.3.0   # next/font/google 대안 선택 시 생략

# 2) 타입·빌드 검증
npx tsc --noEmit
npm run build        # route별 First Load JS로 gzip 증가분 확인
npm run dev          # 390 / 1440 + prefers-reduced-motion 에뮬레이션 확인
```

**수용 기준**: ① `npx tsc --noEmit` clean ② `npm run build` 성공 ③ 랜딩 First Load JS 증가가 **+70KB(gzip) 이내** ④ reduced-motion에서 카운트업·stagger·float 정지 ⑤ 새 콘솔 오류 0.

---

## 6. 결론

v2에 필요한 것은 **motion 1개(이미 설치) + 카운트업 1개(선택) + 세리프 1개(대안: next/font)** 뿐이다. lenis·vaul·rough-notation·geist는 지금 단계에서 도입 이유가 약하고, 특히 **lenis는 DESIGN-V2가 이미 배제한 결정**이므로 재검토하지 않는다. 숫자에 오도미터 연출이 필요하면 `@number-flow/react`(gzip 6.3KB)를 핵심 숫자 1~2개에만 적용하는 것이 비용 대비 효과가 가장 좋다.

## 출처 (모두 2026-10-22 확인)

- npm/레지스트리: `npm view` 실측 로그(본문 §1) — [motion](https://www.npmjs.com/package/motion) · [@number-flow/react](https://www.npmjs.com/package/@number-flow/react) · [lenis](https://www.npmjs.com/package/lenis) · [vaul](https://www.npmjs.com/package/vaul) · [rough-notation](https://www.npmjs.com/package/rough-notation) · [geist](https://www.npmjs.com/package/geist) · [@fontsource/instrument-serif](https://www.npmjs.com/package/@fontsource/instrument-serif)
- 번들 크기: [bundlephobia](https://bundlephobia.com) API 실측(2026-10-22)
- 라이선스 원문: [Instrument Serif OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/instrumentserif/OFL.txt) · [Pretendard LICENSE](https://raw.githubusercontent.com/orioncactus/pretendard/main/LICENSE) · [IBM Plex LICENSE](https://raw.githubusercontent.com/IBM/plex/master/LICENSE.txt)
- 현행 코드 상태: `rail-app/package.json`, `rail-app/app/layout.tsx`(폰트 CDN), `rail-app/components/ui/motion.tsx`(Reveal/CountUp/Float)
