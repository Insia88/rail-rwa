import type { Metadata } from "next";
import Link from "next/link";
import { issueUrl, ISSUES_URL, REPO_URL } from "@/lib/feedback";

export const metadata: Metadata = {
  title: "피드백 루프",
  description:
    "RAIL의 공개 피드백 루프 — 모든 피드백은 GitHub Issue로 기록하고, 48시간 안에 정리해 7일 안에 제품에 반영합니다.",
};

const CHANNELS = [
  {
    tag: "제품 피드백",
    title: "구조·카피·정보 흐름",
    detail: "불편했던 화면, 이해되지 않은 문장, 빠졌으면 하는 요소를 알려주세요. 가장 빠른 개선이 일어나는 채널입니다.",
    cta: "제품 피드백 남기기",
    href: issueUrl({
      title: "[Feedback] RAIL 제품 피드백",
      body: "## 어떤 화면/흐름인가요\n\n\n## 무엇이 불편하거나 이해되지 않나요\n\n\n## 어떻게 바뀌면 좋을까요\n\n\n---\nRAIL demo: https://rail-rwa.vercel.app",
      template: "feedback.yml",
    }),
  },
  {
    tag: "파트너·파일럿",
    title: "수출기업·팩토링사·무역보험·LP",
    detail: "첫 파일럿 파트너가 되어주실 곳, 혹은 소개해주실 곳을 받습니다. 소개 요청은 별도 템플릿으로 정리합니다.",
    cta: "파트너 소개하기",
    href: issueUrl({
      title: "[Partner] RAIL 파일럿 파트너 소개",
      body: "## 소개 요청\n\n## 소개할 곳 (회사명 / 담당자 / 왜 적합한지)\n",
      template: "partner-intro.yml",
    }),
  },
  {
    tag: "직접",
    title: "15분 통화·투자·협업",
    detail: "투자자·운영 파트너·채용 관련 제안은 GitHub Issue로 시작합니다. 공개 기록이 남는 편이 서로에게 낫습니다.",
    cta: "통화 요청하기",
    href: issueUrl({
      title: "[Direct] RAIL 창업자와 15분",
      body: "## 용건\n\n## 배경\n\n## 가능한 시간\n\n---\nRAIL demo: https://rail-rwa.vercel.app",
    }),
  },
];

const LOOP = [
  { step: "01", title: "공개 기록", detail: "모든 피드백은 GitHub Issue에 남습니다. 삭제하지 않습니다." },
  { step: "02", title: "48시간", detail: "라벨과 우선순위를 정해 Issue에 답합니다." },
  { step: "03", title: "7일", detail: "제품·카피·구조에 반영하거나, 반영하지 않는 이유를 씁니다." },
  { step: "04", title: "기록", detail: "무엇이 왜 바뀌었는지 빌드 로그에 남깁니다." },
];

const RECENT = [
  {
    date: "2026.10.25",
    incoming: "외부 비평 3인 — “핵심만 남기고 UI/UX를 개편해야 한다”",
    shipped: "v6 Core: 랜딩 사업 스펙·숫자 위계, 여권 paper 재설계, 심사 런 sticky 판정, 모바일 내비",
    where: "빌드 로그",
    href: "/log",
  },
  {
    date: "2026.10.25",
    incoming: "“정직성은 좋지만 읽기 어려운 문장이 많다”",
    shipped: "라이트 표면으로 전환, 라벨 13px·본문 15–17px 기준 정리, 대문자 모노 라벨 제거",
    where: "/nitro",
    href: "/nitro",
  },
  {
    date: "2026.10.25",
    incoming: "“해시드·글로벌 파트너가 만족할 퀄리티여야 한다”",
    shipped: "영문 에디션·EN one-pager, trust·regulatory 밴드, LICENSE·contact·hreflang",
    where: "/en",
    href: "/en",
  },
  {
    date: "2026.10.22",
    incoming: "“실사례를 기준으로 보면 이 구조가 최선인가?”",
    shipped: "10 viewports → 5.6, 8 acts → 6 acts, 사례 우선 구조로 재편",
    where: "구조 감사",
    href: "/log",
  },
];

const CTA_ISSUE = issueUrl({
  title: "[Direct] RAIL과 15분 통화",
  body: "## 용건\n\n## 배경\n\n---\nRAIL demo: https://rail-rwa.vercel.app",
});

export default function FeedbackPage() {
  return (
    <main className="bg-porcelain text-graphite">
      <div className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-24 sm:px-6 sm:pt-28">
        <header className="max-w-[680px]">
          <p className="text-[13px] leading-[1.6] text-graphite-2">공개 피드백 루프</p>
          <h1 className="mt-4 text-[clamp(2rem,4.4vw,3rem)] font-semibold leading-[1.2] tracking-[-0.025em]">
            피드백이
            <br />
            RAIL을 바꿉니다.
          </h1>
          <p className="mt-5 text-[17px] leading-[1.75] text-graphite-2">
            이 페이지는 장식이 아닙니다. 창업자 지시 4건과 외부 비평 3인의 의견이 실제로 랜딩
            구조, 영문판, 데모 동선, 여권 화면을 바꿨습니다. 모든 피드백은 공개 Issue로 기록하고
            7일 안에 배포 여부를 회신합니다.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={ISSUES_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-chip bg-graphite px-5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-porcelain"
            >
              공개 Issue 목록 보기 ↗
            </a>
            <Link
              href="/log"
              className="text-[14px] font-medium text-graphite underline decoration-hairline-2 underline-offset-4 transition-colors hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-porcelain"
            >
              빌드 로그 보기
            </Link>
          </div>
        </header>

        <section className="mt-16" aria-labelledby="channels">
          <h2
            id="channels"
            className="text-[clamp(1.4rem,2.4vw,1.8rem)] font-semibold leading-[1.3] tracking-[-0.02em]"
          >
            어디로 보내면 되나요
          </h2>
          <p className="mt-3 max-w-[560px] text-[15px] leading-[1.7] text-graphite-2">
            세 개의 채널로 나눠 받습니다. 어떤 채널이든 GitHub 계정이 필요하고, 내용은 공개됩니다.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {CHANNELS.map((c) => (
              <div
                key={c.tag}
                className="flex h-full flex-col rounded-card border border-hairline bg-surface p-7"
              >
                <p className="text-[13px] leading-[1.6] text-graphite-2">{c.tag}</p>
                <p className="mt-2 text-[19px] font-semibold leading-[1.4] tracking-[-0.01em]">
                  {c.title}
                </p>
                <p className="mt-3 flex-1 text-[15px] leading-[1.7] text-graphite-2">{c.detail}</p>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex text-[14px] font-medium text-graphite underline decoration-hairline-2 underline-offset-4 transition-colors hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                >
                  {c.cta} ↗
                </a>
              </div>
            ))}
          </div>
          <p className="mt-4 text-[13px] leading-[1.7] text-graphite-2">
            GitHub 계정이 필요합니다 · 민감정보는 남기지 마세요 · 남긴 내용은 공개 기록으로
            유지됩니다.
          </p>
        </section>

        <section className="mt-16" aria-labelledby="loop">
          <h2
            id="loop"
            className="text-[clamp(1.4rem,2.4vw,1.8rem)] font-semibold leading-[1.3] tracking-[-0.02em]"
          >
            피드백이 제품이 되는 네 단계
          </h2>
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {LOOP.map((s) => (
              <div key={s.step} className="border-t border-hairline-2 pt-5">
                <p className="text-[13px] leading-[1.6] text-graphite-2">{s.step}</p>
                <p className="mt-2 text-[17px] font-semibold leading-[1.4]">{s.title}</p>
                <p className="mt-2 text-[15px] leading-[1.7] text-graphite-2">{s.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16" aria-labelledby="recent">
          <h2
            id="recent"
            className="text-[clamp(1.4rem,2.4vw,1.8rem)] font-semibold leading-[1.3] tracking-[-0.02em]"
          >
            최근 피드백 → 배포
          </h2>
          <p className="mt-3 max-w-[560px] text-[15px] leading-[1.7] text-graphite-2">
            무엇이 들어왔고, 무엇을 배포했는지 날짜순으로 남깁니다. 전체 이력은 빌드 로그에
            있습니다.
          </p>
          <ol className="mt-6 border-t border-hairline">
            {RECENT.map((r) => (
              <li
                key={`${r.date}-${r.incoming}`}
                className="grid gap-2 border-b border-hairline py-6 sm:grid-cols-[112px_1fr_1.15fr] sm:gap-6"
              >
                <span className="text-[13px] leading-[1.6] text-graphite-2">{r.date}</span>
                <p className="text-[15px] leading-[1.7] text-graphite-2">{r.incoming}</p>
                <div>
                  <p className="text-[15px] font-medium leading-[1.7]">{r.shipped}</p>
                  <Link
                    href={r.href}
                    className="mt-1.5 inline-flex text-[14px] font-medium text-graphite underline decoration-hairline-2 underline-offset-4 transition-colors hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-porcelain"
                  >
                    {r.where} →
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16" aria-labelledby="ask">
          <div className="rounded-card border border-hairline bg-surface p-7 sm:p-10">
            <h2
              id="ask"
              className="text-[clamp(1.3rem,2.2vw,1.6rem)] font-semibold leading-[1.35] tracking-[-0.02em]"
            >
              특히 필요한 피드백
            </h2>
            <ul className="mt-4 space-y-2 text-[16px] leading-[1.7] text-graphite-2">
              <li>이 제품을 쓰지 않을 이유 — 가장 도움이 됩니다.</li>
              <li>첫 고객이 될 수 있는 수출기업 또는 팩토링사 1곳.</li>
              <li>Nitro 2기 8주 안에 증명해야 할 KPI 하나.</li>
            </ul>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={CTA_ISSUE}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center rounded-chip bg-graphite px-5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                15분 통화 요청하기
              </a>
              <Link
                href="/nitro"
                className="text-[14px] font-medium text-graphite underline decoration-hairline-2 underline-offset-4 transition-colors hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
              >
                Hashed·Nitro 메모 보기
              </Link>
            </div>
            <p className="mt-6 text-[13px] leading-[1.7] text-graphite-2">
              소스와 판단 기록은{" "}
              <a
                href={REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-hairline-2 underline-offset-4 transition-colors hover:text-vermilion"
              >
                GitHub
              </a>
              에 있습니다. RAIL은 데모이며 실제 금융 서비스가 아닙니다.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
