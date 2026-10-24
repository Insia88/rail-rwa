import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/motion";
import { REPO_URL } from "@/lib/feedback";

export const metadata: Metadata = {
  title: "Build log",
  description:
    "RAIL의 공개 빌드 로그 — 어떤 피드백이 들어왔고, 무엇이 바뀌었고, 어디에 배포됐는지 날짜별로 기록합니다.",
};

type Entry = {
  date: string;
  tag: string;
  title: string;
  feedback: string;
  changes: string[];
  links: { label: string; href: string; external?: boolean }[];
};

const ENTRIES: Entry[] = [
  {
    date: "2026.10.25",
    tag: "v6 core",
    title: "외부 비평 3인 → 핵심만 남긴 v6 Core",
    feedback:
      "“아직 한참 부족하다. 핵심적인 것만. UI/UX도 개편해야 한다.” — 투자자·프로덕트 디자이너·브랜드 디자이너 3인 비평",
    changes: [
      "랜딩: hero에 사업 스펙(티켓·수수료·심사 시간), 한도 40px·APR 34px로 숫자 위계 교정, 중복 섹션 축소",
      "여권: noir 크롬 커버 → paper 커버, 첫 화면에 한도·APR·tenor·coverage, 마스트헤드 축소, 대비 상향",
      "심사 런: 판정 sticky, grade 28px, replay/pause/step, duration 표기 통일",
      "내비: 플로팅 데모 바 제거(콘텐츠 가림), 모바일 메뉴 신설, 헤더 4탭 정리",
      "한국어 조판: word-break keep-all로 어절 중간 줄바꿈 제거",
      "정직성: SIMULATED 라벨·/nitro truth surface·decline 룰·economics 가정 공개, '실제 고객 0명' 명시",
      "피드백 페이지: 창업자 지시와 외부 비평을 구분해 기록",
    ],
    links: [
      { label: "/nitro", href: "/nitro" },
      { label: "/feedback", href: "/feedback" },
      { label: "passport", href: "/passport/hanbit" },
    ],
  },
  {
    date: "2026.10.25",
    tag: "Loop",
    title: "공개 피드백 루프를 열었습니다",
    feedback: "“해시드가 관심 가질 만한 퀄리티로, 피드백 루프를 만들어 달라.”",
    changes: [
      "For Hashed / Nitro 메모 — 김서준 대표께 직접 묻는 3개 질문",
      "GitHub Issue 기반 공개 피드백 루프 (48h 트리아지 → 7일 내 배포 → 로그 기록)",
      "영문 데모 경로: /en/underwrite → /en/underwrite/[id] → /en/passport/[id]",
      "KO/EN 언어 전환이 현재 경로를 유지하도록 수정",
      "데모 경로 바(1 사례 → 2 심사 → 3 여권) + 랜딩 3-step 스트립",
    ],
    links: [
      { label: "/nitro", href: "/nitro" },
      { label: "/feedback", href: "/feedback" },
      { label: "Issues", href: "https://github.com/Insia88/rail-rwa/issues", external: true },
    ],
  },
  {
    date: "2026.10.22",
    tag: "Structure",
    title: "10 viewports → 5.6, 사례 우선 6-act로 재구성",
    feedback: "“진짜 실사례를 학습했을 때 이 구조가 최선이었어?”",
    changes: [
      "8 acts·16 action links·2클릭 이탈 → 6 acts·5,050px·인라인 심사",
      "Hero 판정 카드(은행 3곳 거절 → RAIL 승인) + Case file + Live underwriter",
      "PageTransition·Hero parallax 유지, KO 랜딩 회귀 없음",
    ],
    links: [
      { label: "구조 감사", href: "/log" },
      { label: "라이브", href: "/", external: false },
    ],
  },
  {
    date: "2026.10.22",
    tag: "Global",
    title: "영문판·EN one-pager·신뢰 표면을 배포",
    feedback: "“해시드 측 그리고 글로벌 파트너들이 봤을 때도 만족스러울 퀄리티여야 한다.”",
    changes: [
      "/en 네이티브 영어 에디션 + EN A4 one-pager",
      "trust & regulatory 밴드 (real vs simulated, 규제 캘린더, 라이선스 없음 명시)",
      "LICENSE·contact·hreflang·sitemap·robots·canonical 정리",
      "KO one-pager 플레이스홀더 버그 수정",
    ],
    links: [
      { label: "/en", href: "/en" },
      { label: "EN PDF", href: "/RAIL-onepager-en.pdf" },
    ],
  },
  {
    date: "2026.10.21",
    tag: "v3.1",
    title: "캐러셀·셀프호스팅 폰트·페이지 모션",
    feedback: "“캐러셀 + 폰트 + 모션을 더 자연스럽게 이어 붙여줘.”",
    changes: [
      "지원자 3인 여권 캐러셀 (spring·drag·5.6s auto·reduced-motion)",
      "Archivo/Instrument Serif/Plex Mono 셀프호스팅 + preload",
      "라우트 페이드 전환, Hero 패럴랙스, hover 200ms 통일",
    ],
    links: [{ label: "GitHub", href: REPO_URL, external: true }],
  },
  {
    date: "2026.10.21",
    tag: "GitHub",
    title: "공개 데모 저장소 오픈",
    feedback: "“깃헙에 데모 푸시하고 이어서 작업하자.”",
    changes: [
      "https://github.com/Insia88/rail-rwa 공개 (clean snapshot, 개인 지원서 제외)",
      "MCP 2종·결정론 엔진·디자인 시스템 코드 공개",
    ],
    links: [{ label: "GitHub", href: REPO_URL, external: true }],
  },
  {
    date: "2026.10.20",
    tag: "v3",
    title: "Signal Rail — 60-site 벤치마크 적용",
    feedback: "“전체적으로 다시 우수 사례 학습하고 최소 50개 이상 적극 반영해줘.”",
    changes: [
      "60개 제품 사이트 실측 → 25 레시피 → 19개 적용",
      "워드마크 로고, 다크 시네마틱 시스템, ⌘K, 라이브 티커",
    ],
    links: [{ label: "벤치마크", href: "/log" }],
  },
];

export default function LogPage() {
  return (
    <main className="bg-noir text-cream">
      <section className="relative border-b border-line-dark">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-32">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-acid">Build log · public</p>
            <h1 className="mt-5 max-w-3xl text-[clamp(2.2rem,4.6vw,3.8rem)] font-extrabold leading-[1.16] tracking-[-0.02em]">
              무엇이 들어왔고,<br />
              <span className="text-signal">무엇이 바뀌었나.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-[1.75] text-cream/55">
              피드백 → 변경 → 배포를 날짜별로 남깁니다. 각 항목은 실제 배포와 저장소 커밋에 연결됩니다.
              이 기록 자체가 RAIL의 판단 기록입니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/feedback" className="inline-flex h-10 items-center bg-signal px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-noir transition-opacity hover:opacity-90">
                피드백 루프 열기
              </Link>
              <a href={REPO_URL} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center border border-cream/20 px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/65 transition-colors hover:text-cream">
                GitHub ↗
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-20 pt-4 sm:px-8">
        <ol>
          {ENTRIES.map((e, i) => (
            <Reveal key={`${e.date}-${e.title}`} delay={Math.min(i * 0.03, 0.12)}>
              <li className="grid gap-4 border-b border-line-dark py-8 sm:grid-cols-[150px_1fr] sm:gap-10">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/35">{e.date}</p>
                  <p className="mt-2 inline-block border border-acid/30 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.14em] text-acid/80">
                    {e.tag}
                  </p>
                </div>
                <div>
                  <h2 className="text-[18px] font-bold tracking-[-0.01em] text-cream">{e.title}</h2>
                  <p className="mt-2 border-l-2 border-cream/15 pl-3 text-[12.5px] leading-relaxed text-cream/45">
                    {e.feedback}
                  </p>
                  <ul className="mt-3 space-y-1.5">
                    {e.changes.map((c) => (
                      <li key={c} className="flex gap-2 text-[12.5px] leading-relaxed text-cream/65">
                        <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 bg-signal/70" />
                        {c}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    {e.links.map((l) =>
                      l.external ? (
                        <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="font-mono text-[9px] uppercase tracking-[0.12em] text-acid/70 hover:text-acid">
                          {l.label} ↗
                        </a>
                      ) : (
                        <Link key={l.label} href={l.href} className="font-mono text-[9px] uppercase tracking-[0.12em] text-acid/70 hover:text-acid">
                          {l.label} →
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
        <p className="mt-10 font-mono text-[10px] leading-relaxed tracking-[0.02em] text-cream/25">
          다음 기록: 실제 수출기업 1곳의 증거 데이터 · EN 데모 영상 · 파일럿 LOI.
          <br />
          RAIL은 데모입니다. 실제 금융 서비스가 아니며 온체인 기록은 시뮬레이션입니다.
        </p>
      </section>
    </main>
  );
}
