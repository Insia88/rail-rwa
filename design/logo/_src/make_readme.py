"""make_readme.py — composes design/logo/README.md with the *exact* integrated
logo.tsx snippet and live file listings, so docs cannot drift from the code."""
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
LOGO_DIR = os.path.dirname(HERE)
ROOT = os.path.dirname(os.path.dirname(LOGO_DIR))
BRAND = os.path.join(ROOT, "rail-app", "public", "brand")
LOGO_TSX = os.path.join(ROOT, "rail-app", "components", "ui", "logo.tsx")


def read(path):
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def snippet_from_logo_tsx():
    src = read(LOGO_TSX)
    m = re.search(r"export function RailWordmark\(.*?\n}\n", src, re.S)
    n = re.search(r"export function Logo\(.*?\n}\n", src, re.S)
    if not (m and n):
        raise SystemExit("cannot locate RailWordmark/Logo in logo.tsx")
    return m.group(0).rstrip(), n.group(0).rstrip()


def listing(path, pattern):
    out = []
    for fn in sorted(os.listdir(path)):
        full = os.path.join(path, fn)
        if os.path.isfile(full) and re.search(pattern, fn):
            out.append(f"| `{fn}` | {os.path.getsize(full):,} B |")
    return out


def main():
    wordmark, logo = snippet_from_logo_tsx()
    brand_rows = "\n".join(listing(BRAND, r"\.(svg|png)$"))
    a_rows = "\n".join(listing(os.path.join(LOGO_DIR, "A"), r"\.svg$"))
    b_rows = "\n".join(listing(os.path.join(LOGO_DIR, "B"), r"\.svg$"))
    c_rows = "\n".join(listing(os.path.join(LOGO_DIR, "C"), r"\.svg$"))

    md = f"""# RAIL — Brand / Logo System

> **확정 방향: Direction A — “Signal Rail” (wordmark-first).** 2026-10-22 채택, `components/ui/logo.tsx` 및 `app/icon.png`에 적용 완료.
> 원칙: **타입만으로 완결되는 워드마크** + 오렌지 시그널 1점. 마크·서브라벨은 헤더에서 쓰지 않는다.

- 미리보기: `design/logo/preview-A.png` (2x, 2480×3468) — 다크 헤더 실맥락 / cream / 16·24·32·48px 축소 / 파비콘·탭·16px 픽셀뷰 / 단색·역상
- 콘셉트 대안: `preview-B.png` (Signature R — mark+wordmark), `preview-C.png` (Masthead — editorial). **B/C는 콘셉트 스케치이며 프로덕션 사용 금지.**

---

## 1. 추천 — Direction A “Signal Rail”

현재 로고(사각 마크 + 모노 RAIL + “CREDIT ENGINE”)의 문제는 ① 1초 안에 읽히지 않는 부가 텍스트, ② 작은 사각 마크가 브랜드 의미를 만들지 못함, ③ 얇은 모노 세팅이 헤더에서 존재감이 없음. A는 이 셋을 동시에 제거한다.

**추천 이유 5가지**

1. **헤더 22px에서 가장 또렷하다.** Archivo 600·wdth 110 아웃라인 + −0.018em 트래킹 → cap 22px에서 폭 81px. 64px 헤더에서 좌측 로고로 자연스러운 비율(≈1.2:3)을 만들고, 390px 모바일에서도 CTA와 충돌하지 않는다.
2. **브랜드가 1초에 읽힌다.** “RAIL” + 오렌지 스퀘어 하나. “CREDIT ENGINE” 같은 서브라벨/마크 병치가 없어 인지 부하가 0이다.
3. **시스템과 정확히 맞물린다.** DESIGN-V2에서 오렌지는 “결정/행동(시그널)”에만 쓰는 색. 워드마크의 오렌지 스퀘어 1점이 그 규칙의 최소 단위이며, 크롬·그라데이션·글로우에 의존하지 않는다.
4. **다크/크림 양쪽에서 실루엣이 동일하다.** cream·ink·currentColor 3색 세트가 같은 path를 쓰므로 섹션 색 반전에도 로고가 깨지지 않고, 16px cap(폭 59px)까지 형태가 유지된다.
5. **벡터 고정 = 어디서나 동일.** 폰트 로딩 없이 path만 쓰므로 OG 이미지·파비콘·이메일·인쇄에서 같은 모양이 보장된다. 마크·SEOUL 태그가 필요해지면 B/C의 자산을 그대로 참조할 수 있다.

## 2. 확정 스펙 (lockup anatomy)

| 항목 | 값 |
|---|---|
| 워드마크 | Archivo 600 (`wght 600`, `wdth 110`) 아웃라인 — 앱이 이미 로드하는 Archivo variable과 동일 계열 |
| 트래킹 | **−0.018em** (cap=100 기준 잉크 갭 12 / 10 / 10) |
| 시그널 | 베이스라인에 붙은 **오렌지 스퀘어 15×15u**, L 우측 15u 간격. `#FF4B1F` 고정 |
| 좌표계 | cap height = 100, baseline = y100, viewBox `-1.5 -1.5 370.83 103` |
| 헤더 사이즈 | CSS height **21–22px** (cap ≈ 20–21px, 폭 ≈ 75–79px) |
| 최소 사이즈 | **cap 16px** (폭 ≈ 59px). 그 이하에서는 파비콘/마크만 |
| 클리어스페이스 | **1C = cap height** (워드마크 상하좌우 최소 1C). 마크는 마크 높이 1배 |
| 단색 | `currentColor` 세트 — 텍스트 색을 그대로 상속, 오렌지만 예외 |
| 역상 | cream `#F2EDE2` + signal (다크 표면) / ink `#070908` + signal (크림 표면) |
| 파비콘 | 32px ink 타일(`rx 7`) + cream R + signal 스퀘어. `app/icon.png` = 32px, `public/brand/rail-favicon.svg` 제공 |
| 서브라벨 | **없음.** 상태 텍스트는 로고가 아니라 헤더의 별도 chip(`SEOUL · 2026`)이 담당 |

## 3. 사용 규칙

- **헤더는 워드마크만.** 마크를 헤더에 병치하지 않는다(마크+워드마크는 B안의 언어이며 A안에서는 금지).
- **마크는 파비콘/아티팩트 전용.** `rail-app/app/icon.png`(32px), 여권 커버 등 인쇄물 아티팩트, OG 모서리. 헤더/네비에는 사용하지 않는다.
- **사이즈**: 워드마크 cap 16px 이상. 헤더는 21–22px. 24px 초과 확대는 히어로/OG에서만.
- **여백**: 로고 사방 최소 1C(cap height). 다른 요소(네비, chip, 보더)와 1C 이하로 붙이지 않는다.
- **색**: 단색 베이스 + 오렌지 1점. 다크 표면 cream / 크림 표면 ink / 모노 currentColor. 오렌지 스퀘어를 acid·cream·다른 색으로 바꾸지 않는다.
- **역상**: 다크 섹션에서는 `rail-wordmark-inverse.svg`(또는 `text-cream` + currentColor path), 크림 섹션은 `rail-wordmark.svg`(ink).
- **파비콘**: 32px PNG(SVG 지원 브라우저는 `rail-favicon.svg`). 16px에서도 R 실루엣이 유지되도록 타일 대비를 유지한다.
- **OG/아티팩트**: `rail-wordmark-inverse.svg`를 이미지 위에 얹고, 배경 대비(ink 55% 이상 오버레이)를 확보한다.

## 4. 금지 (Don’ts)

- ❌ **“CREDIT ENGINE” 등 서브라벨 부착** — 이번 재디자인의 핵심 제거 항목.
- ❌ 헤더 로고 옆에 마크 추가, 또는 마크만 있는 헤더 로고.
- ❌ 그라데이션·크롬 텍스처·글로우·그림자·아웃라인(stroke) 버전.
- ❌ 오렌지 확장(레터 일부 컬러, 배경 오렌지), acid/기타 색으로 시그널 스퀘어 변경.
- ❌ 자간/비율 임의 수정(늘리기·기울이기·좁히기), 폰트로 다시 세팅해 path와 다르게 렌더.
- ❌ 16px cap 이하로 축소하거나, 16px 이하에서 마크 없이 워드마크만 쓰는 파비콘.
- ❌ B/C 콘셉트 자산(마크+워드마크 락업, SEOUL 태그)을 A안과 혼용.

## 5. 파일

**프로덕션 (앱에서 사용)**

| 경로 | 용도 |
|---|---|
| `rail-app/components/ui/logo.tsx` | 인라인 컴포넌트 (정본). `RailWordmark` / `Logo` |
| `rail-app/app/icon.png` | Next metadata 파비콘 32px |
| `rail-app/public/brand/rail-wordmark.svg` | ink + signal · 밝은 표면 |
| `rail-app/public/brand/rail-wordmark-inverse.svg` | cream + signal · 어두운 표면 |
| `rail-app/public/brand/rail-wordmark-plain(-inverse).svg` | 시그널 스퀘어 없는 워드마크(축소/모노 제약용) |
| `rail-app/public/brand/rail-lockup.svg` / `-inverse` / `-mono` | 워드마크 락업(현재 = 워드마크), 단색 포함 |
| `rail-app/public/brand/rail-mark.svg` / `-inverse` / `-mono` | R + 시그널 마크 — 파비콘/아티팩트 전용 |
| `rail-app/public/brand/rail-favicon.svg` | 벡터 파비콘 (32×32) |
| `rail-app/public/brand/favicon-32.png` | 32px 래스터 파비콘 |

**디자인 소스 (`design/logo/`)**

A (확정) — {len(a_rows.splitlines())} SVG:
{a_rows}

B (콘셉트) — {len(b_rows.splitlines())} SVG:
{b_rows}

C (콘셉트) — {len(c_rows.splitlines())} SVG:
{c_rows}

워크벤치: `design/logo/_src/` — `build_brand.py`(자산 생성), `previews.py`(프리뷰 시트), `render.mjs`(Chrome headless), `glyphs.json`(OFL 폰트 아웃라인), `build.ps1`(전체 재생성). 캘리브레이션 증거: `fast-a.png`, `fast-a2.png`, `calib-p*.png`.

## 6. 통합 스니펫 — `components/ui/logo.tsx`

현재 적용된 정본 코드(아래 그대로 교체/유지). 워드마크만 인라인 SVG로 두고 `currentColor`를 상속하며, 시그널 스퀘어만 `var(--color-signal)`을 쓴다.

```tsx
// components/ui/logo.tsx — RAIL identity v3 "Signal Rail" (Direction A)
import Link from "next/link";
import {{ cn }} from "@/lib/cn";

{wordmark}

export function Wordmark({{ className }}: {{ className?: string }}) {{
  return (
    <span className={{cn("inline-flex items-center", className)}}>
      <RailWordmark className="h-[21px] text-cream" />
    </span>
  );
}}

{logo}
```

**사용처**

```tsx
// 헤더 (다크 고정): 워드마크만, 마크 없음
<Logo inverse />

// 크림 섹션/푸터 밝은 표면
<Logo inverse={{false}} />

// OG/아티팩트: public/brand/rail-wordmark-inverse.svg 를 그대로 사용
```

**파비콘**: `rail-app/app/icon.png` (32px)이 Next metadata icon으로 자동 적용. 정적 참조가 필요하면 `public/brand/rail-favicon.svg` 사용.
**여권 커버 등 아티팩트**: 코드의 `RailMark`(레일 트랙 글리프, 여권 커버 전용 변형) 또는 `rail-mark.svg`. 단, 파비콘과 아티팩트 마크가 서로 다르므로 **여유가 있을 때 한쪽으로 수렴 권장**(파비콘을 RailMark로 통일하려면 `app/icon.png` 재생성).

## 7. 폐기한 탐색 (이유 기록)

| 탐색 | 결과 | 이유 |
|---|---|---|
| I를 “평행 2선 + 오렌지 신호점”으로 치환 | 폐기 | cap 22px에서 `RAIIL`로 읽힘. 2선이 글자로 분리되고, 16-18px에서 seam이 회색으로 뜸. 증거: `_src/fast-a.png` |
| 900 weight·wdth 125 하드 트래킹 | 폐기 | 헤더 22px에서 과하게 무겁고 “포스터” 느낌. 600으로 내림 |
| 워드마크 뒤 시그널 블록/긴 오렌지 바 | 폐기 | 타입 완결성 훼손 + C안(시그널 바)과 역할 충돌 |
| 마크+워드마크 (B안) | 콘셉트 보류 | 22px 헤더에서 R 마크가 P로 읽히는 리스크. 파비콘/아티팩트로는 유효 |
| 모노 대문자 + CREDIT ENGINE | 폐기 | 인지 부하·존재감 부족. 현재 로고의 핵심 불만 |

## 8. 벤치마크 — 실제 아이덴티티 12+ 관찰

| 브랜드 | 헤더 구성 | 타입/마크 처리 | 서브라벨 | 시사점 |
|---|---|---|---|---|
| Vercel | 심볼(▲) + 로고타입 | 공간 부족 시 심볼만, 클리어스페이스 = 심볼 높이 | 없음 | 심볼/워드마크 역할 분리, 모노 |
| Resend | 워드마크 우선 | “브랜드 인지도를 위해 워드마크 사용”, 아이콘은 별도 글리프 | 없음 | **워드마크가 기본, 아이콘은 보조** |
| Linear | 워드마크만 | 커스텀 소문자, 모노크롬 | 없음 | 헤더는 타입 하나로 끝냄 |
| Stripe | 워드마크 | 커스텀 산세리프, 마크는 앱/OG | 없음 | 타입 완결성 |
| Arc | 워드마크 중심 | 마크 최소화, 색은 표면에서 | 없음 | 장식 최소 |
| Family | 워드마크 | 커스텀 라운드, 모노 | 없음 | 소문자 친화 |
| Raycast | 심볼 + 워드마크 | 레드 라운드 스퀘어 심볼이 정체성 | 없음 | 심볼은 채움형·고대비 |
| Attio | 워드마크 중심 | 커스텀 그로테스크, 작은 심볼 | 없음 | 절제된 자간 |
| Mercury | 워드마크 | 모노크롬 | 없음 | 핀테크도 모노 |
| Ramp | 워드마크 | 단일 액센트(라임) | 없음 | **액센트 1개 규칙** |
| Coinbase | 심볼(원) + 워드마크 | 원형 심볼, 모노 | 없음 | 심볼 단순성 |
| Monad / Hyperliquid | 심볼 + 워드마크 | 단일 실루엣 심볼 | 없음 | 16px 생존 |
| Toss | 워드마크 중심 | 라운드 심볼 별도, 리뉴얼 시 타입 중심 | 없음 | 리뉴얼은 서브라벨 제거 방향 |
| Wanted / Channel | 워드마크 | 소문자/커스텀 그로테스크 | 없음 | 헤더 타입 우선 |

**추출한 원칙**
1. 헤더는 **워드마크 우선**(12/14). 심볼은 파비콘·앱아이콘·아티팩트로 분리.
2. 로고 높이는 헤더 높이의 **약 30–35%** (64px 헤더 → 20–24px).
3. 헤더 서브라벨은 사실상 쓰지 않음. 상태 정보는 별도 chip/모노 라벨로.
4. 심볼은 **단일 실루엣·채움형**, 16px에서 최소 2px 획.
5. 액센트는 **1개**. 나머지는 모노, 그라데이션/크롬은 이미지 안에서만.
6. 클리어스페이스는 **심볼/캡 높이 1배**, 최소 크기는 파비콘 32px / 워드마크 cap 16px.
7. 워드마크는 **커스텀 또는 변형 폰트**, 자간 −0.01~−0.04em, 비율 3:1~4.5:1.

출처: [Vercel brand](https://vercel.com/brand), [Resend brand kit](https://resend.com/brand), [Linear brand](https://linear.app/brand), [Toss 로고 리뉴얼](https://toss.im/tossfeed/article/toss-logo-user-interface-renewal) + 나머지는 공개 사이트 관찰.

## 9. 재생성

```powershell
# rail-app/node_modules 의 puppeteer-core 사용 (Chrome: C:/Program Files/Google/Chrome/Application/chrome.exe)
powershell -File design/logo/_src/build.ps1
# 또는 개별:
python design/logo/_src/build_brand.py assets    # design/logo/{{A,B,C}}/*.svg
python design/logo/_src/build_brand.py favicons  # 파비콘 HTML
python design/logo/_src/previews.py              # 프리뷰 HTML
node design/logo/_src/render.mjs design/logo/_src/preview-a.html design/logo/preview-A.png 1240 800 2 full
```

폰트: **Archivo** variable, **IBM Plex Mono** (둘 다 OFL). `_src/fonts/`는 소스 재생성용이며 `public/`에 배포하지 않는다. 로고 아웃라인 사용은 OFL에서 허용된다.
"""
    out = os.path.join(LOGO_DIR, "README.md")
    with open(out, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(md)
    print("wrote", out, len(md), "chars")


if __name__ == "__main__":
    main()
