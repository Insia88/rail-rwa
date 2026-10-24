import type { Metadata } from "next";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import { issueUrl, ISSUES_URL, REPO_URL } from "@/lib/feedback";

export const metadata: Metadata = {
  title: "Feedback loop",
  description:
    "RAIL의 공개 피드백 루프 — 피드백은 GitHub Issue로 기록되고, 48시간 안에 트리아지되어 7일 안에 제품에 반영됩니다.",
};

const CHANNELS = [
  {
    tag: "Product feedback",
    title: "제품에 대한 의견",
    detail: "구조·카피·데모 흐름·신뢰 표면. “안 쓸 이유”가 가장 도움이 됩니다.",
    href: issueUrl({
      title: "[Feedback] RAIL 제품 피드백",
      body: "## 어떤 화면/흐름인가요?\n\n\n## 무엇이 불편하거나 이해되지 않나요?\n\n\n## 어떻게 바뀌면 좋을까요?\n\n\n---\nRAIL demo: https://rail-rwa.vercel.app",
      template: "feedback.yml",
    }),
    cta: "제품 피드백 남기기",
  },
  {
    tag: "Partner / pilot",
    title: "파트너·파일럿 소개",
    detail: "수출 중소기업, 팩토링사, 무역보험, LP. 소개 요청은 별도 템플릿으로.",
    href: issueUrl({
      title: "[Partner] RAIL 파일럿 파트너 소개",
      body: "## 소개 요청\n\n## 소개할 곳 (회사명/담당자/왜 적합한지)\n",
      template: "partner-intro.yml",
    }),
    cta: "파트너 소개하기",
  },
  {
    tag: "Direct",
    title: "창업자에게 직접",
    detail: "15분 통화, 투자/협업 제안, 그 외 무엇이든. GitHub Issue로 시작합니다.",
    href: issueUrl({
      title: "[Direct] RAIL 창업자에게",
      body: "## 용건\n\n## 배경\n\n---\nRAIL demo: https://rail-rwa.vercel.app",
    }),
    cta: "메시지 남기기",
  },
];

const RECENT = [
  {
    date: "2026-10-25",
    incoming: "외부 비평 3인 — “아직 한참 부족하다. 핵심만. UI/UX도 개편해라.”",
    shipped: "v6 Core: hero 사업 스펙·숫자 위계, 여권 paper 재설계(한도·APR 우선), 심사 판정 sticky, 모바일 내비, 한국어 keep-all",
    where: "v6 core",
    href: "/log",
  },
  {
    date: "2026-10-25",
    incoming: "정직성 비평 — “3/3 승인, 가짜 원장, 실제 고객 0명을 숨긴다.”",
    shipped: "SIMULATED 라벨·truth surface·decline 룰·economics 가정 공개, /nitro의 과장 제거",
    where: "/nitro",
    href: "/nitro",
  },
  {
    date: "2026-10-25",
    incoming: "“영문 버전도 릴리즈해줘”",
    shipped: "EN 데모 경로(/en/underwrite → /en/underwrite/[id] → /en/passport/[id]) + KO/EN 언어 전환",
    where: "/en",
    href: "/en",
  },
  {
    date: "2026-10-25",
    incoming: "“직관적으로 구성될 필요가 있다”",
    shipped: "랜딩 3-step 스트립·breadcrumb·next-step hint (플로팅 바는 콘텐츠를 가려 v6에서 제거)",
    where: "demo path",
    href: "/underwrite",
  },
  {
    date: "2026-10-22",
    incoming: "“실사례를 학습했을 때 이 구조가 최선인가?”",
    shipped: "10 viewports → 5.6, 8 acts → 6 acts, 인라인 심사 위젯, 사례 우선 구조",
    where: "structure audit",
    href: "/log",
  },
  {
    date: "2026-10-22",
    incoming: "“해시드·글로벌 파트너가 만족할 퀄리티”",
    shipped: "/en 영어 에디션, EN one-pager, trust·regulatory 밴드, LICENSE·contact·hreflang",
    where: "/en",
    href: "/en",
  },
];

const RULES = [
  { t: "공개 기록", d: "모든 피드백은 GitHub Issue에 남습니다. 삭제하지 않습니다." },
  { t: "48시간", d: "라벨·우선순위를 정해 Issue에 답합니다." },
  { t: "7일", d: "제품·카피·구조에 반영하거나, 반영하지 않는 이유를 씁니다." },
  { t: "기록", d: "무엇이 왜 바뀌었는지 /log에 남깁니다." },
];

export default function FeedbackPage() {
  return (
    <main className="bg-noir text-cream">
      <section className="relative overflow-hidden border-b border-line-dark">
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-28 sm:px-8 sm:pb-20 sm:pt-32">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-acid">
              Feedback loop · open
            </p>
            <h1 className="mt-5 max-w-3xl text-[clamp(2.2rem,4.6vw,3.8rem)] font-extrabold leading-[1.16] tracking-[-0.02em]">
              피드백이<br />
              <span className="text-signal">RAIL을 바꿉니다.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-[1.75] text-cream/55">
              이 페이지는 장식이 아닙니다. 창업자 지시 4건과 <strong className="font-semibold text-cream/80">외부 비평 3인</strong>
              (투자자·프로덕트 디자이너·브랜드 디자이너)의 비평이 실제로 랜딩 구조·영문판·데모 동선·여권 UI를
              바꿨습니다. 모든 피드백은 공개 Issue로 기록되고, 7일 안에 배포 여부를 회신합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={ISSUES_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center bg-signal px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-noir transition-opacity hover:opacity-90"
              >
                공개 Issue 목록 보기 ↗
              </a>
              <Link
                href="/log"
                className="inline-flex h-11 items-center border border-cream/25 px-5 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/80 transition-colors hover:border-cream/50 hover:text-cream"
              >
                Build log 보기
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line-dark">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">Three channels</p>
            <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.2] tracking-[-0.02em]">
              어디로 보내면 되나요.
            </h2>
          </Reveal>
          <Stagger className="mt-8 grid gap-3 md:grid-cols-3" step={0.05}>
            {CHANNELS.map((c) => (
              <StaggerItem key={c.tag}>
                <div className="flex h-full flex-col border border-line-dark bg-noir-2/40 p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-signal">{c.tag}</p>
                  <p className="mt-2 text-[16px] font-bold text-cream">{c.title}</p>
                  <p className="mt-2 flex-1 text-[12.5px] leading-[1.65] text-cream/50">{c.detail}</p>
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex h-10 items-center justify-center border border-cream/20 px-4 font-mono text-[10px] uppercase tracking-[0.12em] text-cream/70 transition-colors hover:border-signal/60 hover:text-cream"
                  >
                    {c.cta} ↗
                  </a>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.12em] text-cream/25">
            GitHub 계정이 필요합니다 · 민감정보는 남기지 마세요 · 공개 기록입니다
          </p>
        </div>
      </section>

      <section className="border-b border-line-dark">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">The loop</p>
            <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.2] tracking-[-0.02em]">
              피드백이 제품이 되는 네 단계.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RULES.map((r, i) => (
              <Reveal key={r.t} delay={i * 0.04}>
                <div className="h-full border border-line-dark p-5">
                  <p className="type-data text-[13px] text-cream/30">{`0${i + 1}`}</p>
                  <p className="mt-2 text-[14px] font-bold text-cream">{r.t}</p>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-cream/45">{r.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line-dark">
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">Recent loop</p>
            <h2 className="mt-3 text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-[1.2] tracking-[-0.02em]">
              최근 피드백 → 배포.
            </h2>
          </Reveal>
          <div className="mt-8 border-t border-line-dark">
            {RECENT.map((r) => (
              <Reveal key={`${r.date}-${r.incoming}`}>
                <div className="grid gap-3 border-b border-line-dark py-5 sm:grid-cols-[100px_1fr_1.2fr] sm:gap-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream/35">{r.date}</span>
                  <p className="text-[13px] text-cream/60">{r.incoming}</p>
                  <div>
                    <p className="text-[13px] font-medium text-cream/90">{r.shipped}</p>
                    <Link href={r.href} className="mt-1.5 inline-block font-mono text-[9px] uppercase tracking-[0.12em] text-acid/75 hover:text-acid">
                      {r.where} →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-[12px] leading-relaxed text-cream/35">
            전체 변경 이력은 <Link href="/log" className="text-cream/70 underline underline-offset-4">/log</Link>에,
            소스는 <a href={REPO_URL} target="_blank" rel="noreferrer" className="text-cream/70 underline underline-offset-4">GitHub</a>에
            있습니다. 코드는 공개, 판단 기록은 이 저장소와 Issue에 남습니다.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <Reveal>
            <div className="border border-line-dark bg-noir-2/40 p-6 sm:p-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">특히 필요한 피드백</p>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-cream/70">
                <li>— 이 제품을 <strong className="text-cream">안 쓸 이유</strong> (가장 도움이 됩니다)</li>
                <li>— 첫 고객이 될 수 있는 <strong className="text-cream">수출기업/팩토링사 1곳</strong></li>
                <li>— 8주 안에 증명해야 할 <strong className="text-cream">KPI 하나</strong></li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/nitro" className="inline-flex h-10 items-center bg-cream px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-noir transition-opacity hover:opacity-90">
                  Hashed/Nitro 메모 보기
                </Link>
                <Link href="/underwrite" className="inline-flex h-10 items-center border border-cream/20 px-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/70 transition-colors hover:text-cream">
                  데모 보기
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
