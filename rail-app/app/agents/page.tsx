import type { Metadata } from "next";
import Link from "next/link";
import { ALL_RESULTS } from "@/lib/engine";
import { engineContextFromMarket, getMarketSnapshot } from "@/lib/market";
import { Button } from "@/components/ui/button";
import { MaskedLines, Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/cn";
import { ART } from "@/components/landing/art";
import { LiveTicker } from "@/components/landing/live-ticker";
import { SectionHead } from "@/components/landing/section-head";

export const metadata: Metadata = {
  title: "에이전트 팀과 제작 기록",
  description:
    "RAIL은 사람 1명과 에이전트 팀이 하루 동안 만들고 배포한 RWA 신용 레일입니다. 런타임 에이전트 4명과 빌드 에이전트 5명의 역할, 제작 타임라인, 해자 논리를 기록합니다.",
};

const RUNTIME_CREW = [
  {
    name: "SCOUT",
    status: "IDLE",
    role: "증거 수집",
    tools: "Base RPC · 수출신고 · 정산 API · KIPRIS 특허 조회",
    cadence: "심사 요청 시 · 원본 해시 기록",
    decides: "어떤 증거를 신뢰할지, 수집 범위와 원본",
  },
  {
    name: "VERIFIER",
    status: "IDLE",
    role: "교차검증",
    tools: "바이어명·금액·납기 3중 대조 · 지갑 연령 · 중복 제거",
    cadence: "수집 직후 · 증거 간 상충 검사",
    decides: "검증 커버리지와 미검증 항목의 분리",
  },
  {
    name: "UNDERWRITER",
    status: "ON CALL",
    role: "신용 판정",
    tools: "규칙 기반 가중 엔진 · 점수 컴포넌트 · 등급 스프레드",
    cadence: "심사 요청 시 · 동일 입력 = 동일 결과",
    decides: "점수 · 등급 · 승인 한도 · 금리",
  },
  {
    name: "BROKER",
    status: "IDLE",
    role: "유동성 매칭",
    tools: "ERC-3643 발행 · LP 풀 · 에스크로 화이트리스트",
    cadence: "승인 후 · 만기까지 추적",
    decides: "자금 조달 여부 · 만기 · 상환 경로",
  },
] as const;

const BUILD_CREW = [
  {
    name: "telegram-analyst",
    kind: "Research",
    desc: "텔레그램 채널과 공개 자료에서 시장 논지를 문장 단위로 추출했습니다. 어떤 숫자가 이 제품의 논거가 되는지 정리.",
    output: "시장 논지 노트",
  },
  {
    name: "rwa-researcher",
    kind: "Research",
    desc: "국내 STO 제도, ERC-3643 권리 구조, DefiLlama·CoinGecko 데이터 스키마를 조사했습니다. 숫자의 출처와 집계 기준을 고정.",
    output: "규제·데이터 노트",
  },
  {
    name: "frontend-builder",
    kind: "Implementation",
    desc: "랜딩·시장·에이전트 페이지를 v3 벤치마크 문법으로 구현했습니다. 시네마틱 다크·크롬·오렌지의 에디토리얼 시스템.",
    output: "3개 라우트 · 랜딩 컴포넌트",
  },
  {
    name: "flow-builder",
    kind: "Implementation",
    desc: "4단계 심사 애니메이션과 Credit Passport 아티팩트를 구현했습니다. 같은 결과를 로그와 여권으로 두 번 보여주는 구조.",
    output: "심사 플로우 · 여권",
  },
  {
    name: "lead",
    kind: "Design · Engine · QA · Deploy",
    desc: "제품 정의와 신용 엔진, 디자인 시스템, 최종 QA와 Vercel 배포를 맡았습니다. 사람 한 명의 판단을 에이전트 실행으로 분해.",
    output: "엔진 · 시스템 · 배포",
  },
] as const;

const TIMELINE = [
  { time: "T+0h", label: "리서치 시작", detail: "시장 논지 · 규제 · 데이터 소스 스캔" },
  { time: "T+1h", label: "제품 정의 · 신용 엔진", detail: "점수 컴포넌트와 여권 산식 확정" },
  { time: "T+3h", label: "UI 구현", detail: "랜딩 · 심사 플로우 · 여권 아티팩트" },
  { time: "T+5h", label: "QA · Vercel 배포", detail: "타입체크 · 빌드 · 프로덕션 배포" },
] as const;

const MOAT = [
  {
    title: "실행 속도",
    body: "사람이 병목이 아닙니다. 리서치에서 배포까지, 판단 로그가 남은 채로 하루가 걸립니다.",
  },
  {
    title: "복제 불가한 판단 로그",
    body: "왜 그 결정을 했는지 증거·산식·로그가 남습니다. 결과만 복제해서는 재현되지 않습니다.",
  },
  {
    title: "고객 무전",
    body: "영업시간 밖에도 심사·증빙·정산이 이어집니다. 고객과의 연결이 끊기지 않습니다.",
  },
] as const;

const CONSOLE_LINES = [
  { name: "SCOUT", call: "evidence.collect()", status: "IDLE" },
  { name: "VERIFIER", call: "evidence.crosscheck()", status: "IDLE" },
  { name: "UNDERWRITER", call: "credit.score()", status: "ON CALL" },
  { name: "BROKER", call: "rwa.match()", status: "IDLE" },
] as const;

const LINKS = [
  { href: "/", label: "제품 랜딩", note: "랜딩 · 매니페스토" },
  { href: "/market", label: "시장 데이터", note: "RWA 기상도" },
  { href: "/agents", label: "README", note: "제작 기록" },
] as const;

function StatusChip({ status }: { status: string }) {
  const onCall = status === "ON CALL";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 border px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.14em]",
        onCall ? "border-acid/30 bg-acid/10 text-acid" : "border-line-dark text-cream/35",
      )}
    >
      <span aria-hidden className={cn("h-1 w-1 rounded-full", onCall ? "bg-acid" : "bg-cream/25")} />
      {status}
    </span>
  );
}

function RuntimeCrewSection() {
  return (
    <section className="border-b border-line-dark bg-noir-2">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHead
          index="01"
          kicker="Runtime Crew"
          title="제품 안에서 판단하는 네 명."
          sub="RAIL의 심사는 사람의 재량이 아니라 로그로 남는 절차입니다. 판단 근거는 여권에 첨부됩니다."
        />

        <div className="mt-12 grid gap-px border border-line-dark bg-line-dark sm:grid-cols-2">
          {RUNTIME_CREW.map((agent, i) => (
            <Reveal key={agent.name} delay={0.04 + i * 0.04}>
              <article className="h-full bg-noir-2">
                <div className="flex items-center justify-between gap-3 border-b border-line-dark px-6 py-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[13px] font-semibold tracking-[0.16em] text-cream">
                      {agent.name}
                    </span>
                    <span className="text-[12px] text-cream/40">{agent.role}</span>
                  </div>
                  <StatusChip status={agent.status} />
                </div>
                <dl className="divide-y divide-line-dark">
                  {[
                    { term: "Role", value: agent.role },
                    { term: "Tools", value: agent.tools },
                    { term: "Cadence", value: agent.cadence },
                    { term: "Decides", value: agent.decides },
                  ].map((row) => (
                    <div key={row.term} className="grid grid-cols-[70px_1fr] gap-3 px-6 py-2.5">
                      <dt className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream/25">
                        {row.term}
                      </dt>
                      <dd className="text-[11.5px] leading-[1.65] text-cream/60">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/25">
          Runtime agents · 규칙 엔진 호출 · LLM은 숫자를 만들지 않음
        </p>
      </div>
    </section>
  );
}

function BuildCrewSection() {
  return (
    <section className="relative overflow-hidden border-b border-ink/10 bg-paper text-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0 paper-grid opacity-60" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHead
          index="02"
          kicker="Build Crew"
          tone="light"
          title="하루 동안 일한 다섯 명."
          sub="사람 한 명이 방향과 최종 판단을 맡고, 에이전트 다섯 명이 리서치·구현·QA를 나눴습니다."
        />

        <ol className="mt-12 border-t-2 border-ink/80">
          {BUILD_CREW.map((agent, i) => (
            <Reveal key={agent.name} delay={0.03 * i}>
              <li className="grid gap-3 border-b border-ink/15 py-5 transition-colors duration-200 hover:bg-paper-2/60 sm:grid-cols-12 sm:items-baseline sm:gap-6">
                <span className="type-data text-[22px] font-medium leading-none text-ink/20 sm:col-span-1">
                  {`0${i + 1}`}
                </span>
                <div className="sm:col-span-3">
                  <p className="font-mono text-[12px] font-semibold tracking-[0.02em] text-ink">
                    {agent.name}
                  </p>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/45">
                    {agent.kind}
                  </p>
                </div>
                <p className="text-[13px] leading-[1.75] text-ink/65 sm:col-span-5">
                  {agent.desc}
                </p>
                <p className="font-mono text-[10px] tracking-[0.02em] text-ink/40 sm:col-span-3 sm:text-right">
                  {agent.output}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function BuildLogSection() {
  return (
    <section
      id="build-log"
      className="relative scroll-mt-20 overflow-hidden border-b border-line-dark bg-noir lg:scroll-mt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-20 mix-blend-overlay"
      />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHead
          index="03"
          kicker="Build Log · 2026-10-22 · 하루"
          title="기획이 아니라 실행 기록입니다."
          sub="절대 시각 대신 작업 시작(T) 기준 상대 표기입니다. 모든 산출물은 같은 날 타입체크와 빌드를 통과했습니다."
        />

        <ol className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-4">
          {TIMELINE.map((entry, i) => (
            <Reveal key={entry.time} delay={0.05 * i}>
              <li className="relative border-t border-cream/25 pt-5 sm:pr-4">
                <span aria-hidden className="absolute -top-[3px] left-0 h-1.5 w-1.5 bg-signal" />
                <p className="type-data text-[12px] tracking-[0.04em] text-cream/50">
                  {entry.time}
                </p>
                <p className="mt-2 text-[18px] font-bold leading-snug tracking-[-0.015em] text-cream">
                  {entry.label}
                </p>
                <p className="mt-1.5 text-[11.5px] leading-[1.65] text-cream/45">{entry.detail}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function MoatSection() {
  return (
    <section className="relative overflow-hidden border-b border-ink/10 bg-paper text-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0 paper-grid opacity-60" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHead
          index="04"
          kicker="Why this is a moat"
          tone="light"
          title="왜 이 방식이 해자입니까."
          sub="기능은 복제할 수 있습니다. 판단이 남는 방식은 복제하기 어렵습니다."
        />

        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-3">
          {MOAT.map((item, i) => (
            <Reveal key={item.title} delay={0.05 * i}>
              <article className="border-t-2 border-ink/80 pt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-xl font-bold leading-snug tracking-[-0.015em] text-ink">
                    {item.title}
                  </h3>
                  <span className="font-mono text-[10px] tracking-[0.14em] text-ink/30">
                    {`0${i + 1}`}
                  </span>
                </div>
                <p className="mt-3 text-[13px] leading-[1.75] text-ink/60">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function AgentsPage() {
  const market = await getMarketSnapshot();
  const results = ALL_RESULTS(engineContextFromMarket(market));

  return (
    <main className="bg-noir">
      {/* hero */}
      <section className="relative isolate overflow-hidden bg-noir text-cream">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
          style={{ backgroundImage: `url(${ART.agentsScan})` }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-noir/40 via-transparent to-noir"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grain opacity-20 mix-blend-overlay"
        />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 pt-24 sm:px-8 sm:pb-16 sm:pt-28 lg:pt-32">
          <Reveal>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-dark pb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/45">
                The Crew · Build Log · Seoul 2026
              </span>
              <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/35">
                <span aria-hidden className="h-1 w-1 animate-pulse-dot rounded-full bg-acid" />4
                runtime · 5 build
              </span>
            </div>
          </Reveal>

          <div className="grid items-center gap-12 pt-12 lg:grid-cols-12 lg:gap-10 lg:pt-16">
            <div className="lg:col-span-7">
              <MaskedLines
                as="h1"
                className="text-[clamp(2.4rem,4.2vw,3.6rem)] font-extrabold leading-[1.14] tracking-[-0.015em] text-cream"
                lineClassName="pb-[0.07em]"
                delay={0.1}
                stagger={0.08}
                lines={[
                  <span key="line-1" className="sm:whitespace-nowrap">
                    에이전트가 팀원인 팀.
                  </span>,
                  <span
                    key="line-2"
                    className="font-serif-display italic tracking-[-0.03em] sm:whitespace-nowrap"
                  >
                    one human, four agents.
                  </span>,
                ]}
              />
              <Reveal delay={0.3}>
                <p className="mt-7 max-w-lg text-[16px] leading-[1.65] text-cream/55 sm:text-[17px]">
                  RAIL은 사람 1명과 에이전트 4명이 리서치·설계·구현·QA를 나눠 하루에 만들고
                  배포했습니다.
                </p>
              </Reveal>
              <Reveal delay={0.36}>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button href="/underwrite" size="lg">
                    심사 시작하기
                  </Button>
                  <Button href="/market" size="lg" variant="outline-inverse">
                    시장 데이터 보기
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.28} className="lg:col-span-5">
              <div className="relative">
                <div className="relative border border-line-dark bg-noir-2/90">
                  <div className="flex items-center justify-between gap-3 border-b border-line-dark px-4 py-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/45">
                      Rail / Agent Runtime
                    </span>
                    <span className="inline-flex items-center gap-1.5 border border-acid/30 bg-acid/10 px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.14em] text-acid">
                      <span aria-hidden className="h-1 w-1 rounded-full bg-acid" />4 registered
                    </span>
                  </div>
                  <div className="space-y-2.5 px-4 py-4">
                    {CONSOLE_LINES.map((line) => (
                      <div
                        key={line.name}
                        className="grid grid-cols-[76px_1fr_auto] items-baseline gap-2 font-mono text-[10px]"
                      >
                        <span className="tracking-[0.06em] text-cream/75">{line.name}</span>
                        <span className="truncate text-cream/30">{line.call}</span>
                        <span
                          className={cn(
                            "text-[8px] uppercase tracking-[0.12em]",
                            line.status === "ON CALL" ? "text-acid" : "text-cream/25",
                          )}
                        >
                          {line.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-line-dark px-4 py-3 font-mono text-[9px] leading-relaxed text-cream/25">
                    <p>$ rail run --applicant hanbit</p>
                    <p className="mt-1 text-cream/45">
                      → 4 steps · deterministic engine · logs attached to passport
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.5}>
            <dl className="mt-12 grid grid-cols-2 gap-px border-y border-line-dark bg-line-dark sm:grid-cols-4">
              {[
                { term: "People", value: "1" },
                { term: "Runtime agents", value: "4" },
                { term: "Build agents", value: "5" },
                { term: "Shipped", value: "2026.10.22" },
              ].map((stat) => (
                <div key={stat.term} className="bg-noir/50 px-4 py-4">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/30">
                    {stat.term}
                  </dt>
                  <dd className="type-data mt-2 text-[clamp(1.4rem,2.2vw,1.9rem)] font-medium leading-none text-cream">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <LiveTicker variant="crew" />

      <RuntimeCrewSection />
      <BuildCrewSection />
      <BuildLogSection />
      <MoatSection />

      {/* read more */}
      <section className="bg-noir-2">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <SectionHead
                index="05"
                kicker="Read more"
                title="제품과 기록은 같은 저장소에 있습니다."
                sub="이 페이지는 제품의 제작 기록입니다. 모든 수치는 규칙 엔진과 시장 스냅샷에서 다시 계산할 수 있습니다."
              />
              <Reveal delay={0.1}>
                <div className="mt-7">
                  <Button href="/underwrite" size="lg">
                    심사 시작하기
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-7">
              <nav aria-label="관련 링크" className="border-t border-line-dark">
                {LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group flex items-center justify-between gap-4 border-b border-line-dark py-5 transition-colors duration-200 hover:bg-noir/50 focus-visible:outline-none"
                  >
                    <span className="flex items-baseline gap-4">
                      <span className="text-[15px] font-bold text-cream">{link.label}</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream/30">
                        {link.note}
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className="font-mono text-[13px] text-cream/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-cream"
                    >
                      →
                    </span>
                  </Link>
                ))}
              </nav>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
