import type { Metadata } from "next";
import Link from "next/link";
import { REPO_URL } from "@/lib/feedback";

export const metadata: Metadata = {
  title: "빌드 로그",
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
    tag: "v7 디자인",
    title: "라이트 v7 — AI 티를 걷어내고 조용한 신뢰로",
    feedback: "“코인베이스 느낌의 애플 느낌으로. 지금은 AI 티가 엄청나서 별로야.”",
    changes: [
      "다크 시네마틱 히어로·글로우·그레인 제거 → warm porcelain 표면, 제품 카드 그림자만 남김",
      "대문자 모노 라벨 전면 폐기 → 13px muted 문장 라벨, 본문 15–17px로 상향",
      "카드 언어 통일: white surface + hairline + 24px radius, 액센트는 vermilion 5% 이하",
      "히어로에 소프트 스튜디오 라이트·검증 칩, 아티팩트는 다크 시네마틱 밴드 위 white 여권으로 대비",
      "엔진에 declined 지원자(세종트레이딩 · E-DUP-PLEDGE) 추가 — 승인 3 · 거절 1",
      "/nitro·/feedback·/log를 라이트 편지·루프·타임라인 구조로 재작성",
      "OG/공유 이미지를 v7 라이트로 재생성(1200×630)",
      "Higgsfield·Adobe MCP는 자격증명 부재로 미연결 — 프롬프트 팩·설정 템플릿 준비(docs/higgsfield-adobe-mcp-v7.md)",
    ],
    links: [
      { label: "/nitro", href: "/nitro" },
      { label: "/feedback", href: "/feedback" },
      { label: "declined 사례", href: "/passport/sejong" },
    ],
  },
  {
    date: "2026.10.25",
    tag: "v6 코어",
    title: "외부 비평 3인 → 핵심만 남긴 v6 Core",
    feedback: "“아직 한참 부족하다. 핵심적인 것만. UI/UX도 개편해야 한다.”",
    changes: [
      "랜딩: 히어로에 사업 스펙(티켓·수수료·심사 시간), 한도와 APR 숫자 위계 교정, 중복 섹션 축소",
      "여권: 크롬 커버 → paper 커버, 첫 화면에 한도·APR·기간·커버리지",
      "심사 런: 판정 sticky, replay·pause·step, 소요 시간 표기 통일",
      "내비게이션: 플로팅 데모 바 제거, 모바일 메뉴 신설, 헤더 4탭 정리",
      "한국어 조판: 어절 중간 줄바꿈 제거(keep-all)",
      "정직성: SIMULATED 라벨, truth surface, decline 룰, economics 가정 공개",
    ],
    links: [
      { label: "/nitro", href: "/nitro" },
      { label: "/feedback", href: "/feedback" },
      { label: "여권 보기", href: "/passport/hanbit" },
    ],
  },
  {
    date: "2026.10.25",
    tag: "루프",
    title: "공개 피드백 루프를 열었습니다",
    feedback: "“해시드가 관심 가질 만한 퀄리티로, 피드백 루프를 만들어 달라.”",
    changes: [
      "For Hashed 메모 — 김서준 대표께 직접 묻는 3개 질문",
      "GitHub Issue 기반 공개 루프: 48시간 트리아지 → 7일 내 배포 → 로그 기록",
      "영문 데모 경로: /en/underwrite → 심사 → 여권",
      "KO/EN 언어 전환이 현재 경로를 유지하도록 수정",
    ],
    links: [
      { label: "/nitro", href: "/nitro" },
      { label: "/feedback", href: "/feedback" },
      { label: "Issues", href: "https://github.com/Insia88/rail-rwa/issues", external: true },
    ],
  },
  {
    date: "2026.10.22",
    tag: "구조",
    title: "10 viewports → 5.6, 사례 우선 6-act로 재구성",
    feedback: "“진짜 실사례를 학습했을 때 이 구조가 최선이었어?”",
    changes: [
      "8 acts·16 action links·2클릭 이탈 → 6 acts·5,050px·인라인 심사",
      "히어로 판정 카드(은행 3곳 거절 → RAIL 승인), 사례 파일, 라이브 심사로 재배치",
      "페이지 전환과 히어로 패럴랙스는 유지하되 랜딩 회귀 없음",
    ],
    links: [
      { label: "구조 감사", href: "/log" },
      { label: "라이브", href: "/" },
    ],
  },
  {
    date: "2026.10.22",
    tag: "글로벌",
    title: "영문판·EN one-pager·신뢰 표면을 배포",
    feedback: "“해시드 측 그리고 글로벌 파트너들이 봤을 때도 만족스러울 퀄리티여야 한다.”",
    changes: [
      "/en 네이티브 영어 에디션과 EN A4 one-pager",
      "trust·regulatory 밴드: real vs simulated, 규제 캘린더, 라이선스 없음 명시",
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
      "지원자 3인 여권 캐러셀: spring·drag·5.6초 자동·reduced-motion 대응",
      "Archivo·Instrument Serif·Plex Mono 셀프호스팅과 preload",
      "라우트 페이드 전환, 히어로 패럴랙스, hover 200ms 통일",
    ],
    links: [{ label: "GitHub", href: REPO_URL, external: true }],
  },
  {
    date: "2026.10.21",
    tag: "GitHub",
    title: "공개 데모 저장소 오픈",
    feedback: "“깃헙에 데모 푸시하고 이어서 작업하자.”",
    changes: [
      "공개 저장소(clean snapshot, 개인 지원서 제외)",
      "MCP 2종·결정론 엔진·디자인 시스템 코드 공개",
    ],
    links: [{ label: "GitHub", href: REPO_URL, external: true }],
  },
  {
    date: "2026.10.20",
    tag: "v3",
    title: "60개 제품 사이트 벤치마크 적용",
    feedback: "“전체적으로 다시 우수 사례 학습하고 최소 50개 이상 적극 반영해줘.”",
    changes: [
      "60개 제품 사이트 실측 → 25개 레시피로 정리, 19개 적용",
      "워드마크 로고, 다크 시네마틱 시스템, ⌘K, 라이브 티커",
    ],
    links: [{ label: "벤치마크 기록", href: "/log" }],
  },
];

export default function LogPage() {
  return (
    <main className="bg-porcelain text-graphite">
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-24 sm:px-6 sm:pt-28">
        <header className="max-w-[680px]">
          <p className="text-[13px] leading-[1.6] text-graphite-2">공개 빌드 로그</p>
          <h1 className="mt-4 text-[clamp(2rem,4.4vw,3rem)] font-semibold leading-[1.2] tracking-[-0.025em]">
            무엇이 들어왔고,
            <br />
            무엇이 바뀌었나.
          </h1>
          <p className="mt-5 text-[17px] leading-[1.75] text-graphite-2">
            피드백 → 변경 → 배포를 날짜별로 남깁니다. 이 기록 자체가 RAIL의 판단 기록입니다.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/feedback"
              className="inline-flex h-11 items-center rounded-chip bg-graphite px-5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-porcelain"
            >
              피드백 남기기
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[14px] font-medium text-graphite underline decoration-hairline-2 underline-offset-4 transition-colors hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-porcelain"
            >
              GitHub 저장소
            </a>
          </div>
        </header>

        <ol className="mt-14 border-t border-hairline">
          {ENTRIES.map((e) => (
            <li
              key={`${e.date}-${e.title}`}
              className="grid gap-4 border-b border-hairline py-8 sm:grid-cols-[144px_1fr] sm:gap-10 sm:py-10"
            >
              <div className="flex flex-wrap items-start gap-x-3 gap-y-2 sm:flex-col sm:items-start sm:gap-2.5">
                <span className="text-[13px] leading-[1.6] text-graphite-2">{e.date}</span>
                <span className="inline-flex rounded-chip border border-hairline-2 bg-surface px-2.5 py-1 text-[13px] leading-none text-graphite-2">
                  {e.tag}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="text-[clamp(1.15rem,2vw,1.4rem)] font-semibold leading-[1.35] tracking-[-0.015em]">
                  {e.title}
                </h2>
                <p className="mt-3 border-l-2 border-hairline-2 pl-4 text-[15px] leading-[1.7] text-graphite-2">
                  {e.feedback}
                </p>
                {e.changes.length > 0 ? (
                  <ul className="mt-4 space-y-2">
                    {e.changes.map((c) => (
                      <li key={c} className="flex gap-2.5 text-[15px] leading-[1.7] text-graphite">
                        <span
                          aria-hidden
                          className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-vermilion"
                        />
                        <span className="min-w-0">{c}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {e.links.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                    {e.links.map((l) =>
                      l.external ? (
                        <a
                          key={l.label}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[14px] font-medium text-graphite underline decoration-hairline-2 underline-offset-4 transition-colors hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-porcelain"
                        >
                          {l.label} ↗
                        </a>
                      ) : (
                        <Link
                          key={l.label}
                          href={l.href}
                          className="text-[14px] font-medium text-graphite underline decoration-hairline-2 underline-offset-4 transition-colors hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-porcelain"
                        >
                          {l.label} →
                        </Link>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-[640px] text-[13px] leading-[1.7] text-graphite-2">
          다음 기록: 실제 수출기업 1곳의 증거 데이터 · 영문 데모 영상 · 파일럿 LOI.
          <br />
          RAIL은 데모입니다. 실제 금융 서비스가 아니며, 온체인 기록은 시뮬레이션입니다.
        </p>
      </div>
    </main>
  );
}
