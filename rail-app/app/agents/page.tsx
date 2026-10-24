import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "에이전트 팀과 제작 기록",
  description:
    "RAIL은 사람 1명과 에이전트 팀이 하루 동안 만들고 배포한 RWA 신용 레일입니다. 런타임 에이전트 4명과 빌드 에이전트 5명의 역할, 제작 타임라인, 해자 논리를 기록합니다.",
};

const RUNTIME = [
  {
    name: "SCOUT",
    status: "IDLE",
    role: "증거 수집",
    tools: "Base RPC · 수출신고 · 정산 API · KIPRIS 특허 조회",
    decides: "어떤 증거를 신뢰할지, 수집 범위와 원본",
  },
  {
    name: "VERIFIER",
    status: "IDLE",
    role: "교차검증",
    tools: "바이어명·금액·납기 3중 대조 · 지갑 연령 · 중복 제거",
    decides: "검증 커버리지와 미검증 항목의 분리",
  },
  {
    name: "UNDERWRITER",
    status: "ON CALL",
    role: "신용 판정",
    tools: "규칙 기반 가중 엔진 · 점수 컴포넌트 · 등급 스프레드",
    decides: "점수 · 등급 · 승인 한도 · 금리",
  },
  {
    name: "BROKER",
    status: "IDLE",
    role: "유동성 매칭",
    tools: "ERC-3643 발행 · LP 풀 · 에스크로 화이트리스트",
    decides: "자금 조달 여부 · 만기 · 상환 경로",
  },
];

const BUILD = [
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
    desc: "랜딩·시장·에이전트 페이지를 라이트 시스템으로 구현했습니다. 타입·표면·모션 예산을 하나로 유지.",
    output: "3개 라우트 · 랜딩 컴포넌트",
  },
  {
    name: "flow-builder",
    kind: "Implementation",
    desc: "4단계 심사 애니메이션과 Credit Passport 아티팩트를 구현했습니다. 같은 결과를 로그와 여권으로 두 번 확인하는 구조.",
    output: "심사 플로우 · 여권",
  },
  {
    name: "lead",
    kind: "Design · Engine · QA · Deploy",
    desc: "제품 정의와 신용 엔진, 디자인 시스템, 최종 QA와 배포를 맡았습니다. 사람 한 명의 판단을 에이전트 실행으로 분해.",
    output: "엔진 · 시스템 · 배포",
  },
];

const TIMELINE = [
  { time: "T+0h", label: "리서치 시작", detail: "시장 일지 · 규제 · 데이터 소스 탐색" },
  { time: "T+1h", label: "제품 정의 · 신용 엔진", detail: "점수 컴포넌트와 여권 형식 확정" },
  { time: "T+3h", label: "UI 구현", detail: "랜딩 · 심사 플로우 · 여권 아티팩트" },
  { time: "T+5h", label: "QA · Vercel 배포", detail: "타입 체크 · 빌드 · 프로덕션 배포" },
];

const MOAT = [
  {
    title: "실행 속도",
    body: "사람의 병목을 없앴습니다. 리서치에서 배포까지, 판단 로그가 남는 채로 하루가 걸립니다.",
  },
  {
    title: "복제 불가한 판단 로그",
    body: "왜 그 결정인지 증거·근거·로그가 남습니다. 결과만 복제해서는 재현되지 않습니다.",
  },
  {
    title: "고객 무전",
    body: "영업 시간 밖에도 심사·증빙·정산이 이어집니다. 고객과의 연결이 끊기지 않습니다.",
  },
];

const LINKS = [
  { href: "/", label: "제품 랜딩", note: "랜딩 · 매니페스토" },
  { href: "/market", label: "시장 데이터", note: "RWA 기상도" },
  { href: "https://github.com/Insia88/rail-rwa", label: "README", note: "시작 기록" },
  { href: "/nitro", label: "For Hashed", note: "Nitro Seoul 2" },
];

function StatusChip({ status }: { status: string }) {
  const onCall = status === "ON CALL";
  return (
    <span
      className={
        onCall
          ? "inline-flex shrink-0 items-center rounded-full border border-vermilion/30 bg-vermilion-soft px-2.5 py-1 text-[13px] text-vermilion"
          : "inline-flex shrink-0 items-center rounded-full border border-hairline px-2.5 py-1 text-[13px] text-graphite-3"
      }
    >
      {onCall ? "호출 대기" : "대기"}
    </span>
  );
}

/** /agents — light surface, hairline cards, no uppercase labels. */
export default function AgentsPage() {
  return (
    <main className="bg-porcelain">
      <div className="mx-auto w-full max-w-[1120px] px-6 pb-20 pt-28 sm:pt-32">
        <Reveal>
          <p className="text-[13px] text-graphite-3">에이전트 팀</p>
          <h1 className="mt-4 max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-graphite">
            사람 1명, 에이전트 9명.
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-[1.65] text-graphite-2">
            RAIL은 하루 동안 만들어 배포한 RWA 신용 레일입니다. 제품 안에서 판단하는 런타임
            에이전트 4명과, 그것을 만든 빌드 에이전트 5명의 기록입니다.
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <dl className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-hairline bg-hairline sm:grid-cols-4">
            {[
              { term: "사람", value: "1" },
              { term: "런타임 에이전트", value: "4" },
              { term: "빌드 에이전트", value: "5" },
              { term: "배포", value: "2026.10.22" },
            ].map((stat) => (
              <div key={stat.term} className="bg-surface px-6 py-6">
                <dt className="text-[13px] text-graphite-3">{stat.term}</dt>
                <dd className="mt-2 text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-none tracking-[-0.03em] text-graphite">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <section className="mt-16">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-graphite">
              제품 안에서 판단하는 네 명.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {RUNTIME.map((agent) => (
              <Reveal key={agent.name} delay={0.04}>
                <article className="h-full rounded-[var(--radius-card)] border border-hairline bg-surface p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[17px] font-semibold text-graphite">{agent.name}</p>
                    <StatusChip status={agent.status} />
                  </div>
                  <p className="mt-1 text-[15px] text-graphite-2">{agent.role}</p>
                  <p className="mt-4 text-[14px] leading-[1.6] text-graphite-2">{agent.tools}</p>
                  <p className="mt-3 border-t border-hairline pt-3 text-[13px] leading-[1.6] text-graphite-3">
                    결정: {agent.decides}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-graphite">
              하루 동안 일한 다섯 명.
            </h2>
          </Reveal>
          <div className="mt-8 overflow-hidden rounded-[var(--radius-card)] border border-hairline bg-surface">
            {BUILD.map((agent) => (
              <div
                key={agent.name}
                className="grid gap-2 border-b border-hairline px-6 py-5 last:border-b-0 sm:grid-cols-[200px_1fr_auto] sm:gap-6"
              >
                <div>
                  <p className="text-[15px] font-semibold text-graphite">{agent.name}</p>
                  <p className="mt-0.5 text-[13px] text-graphite-3">{agent.kind}</p>
                </div>
                <p className="text-[14px] leading-[1.6] text-graphite-2">{agent.desc}</p>
                <p className="text-[13px] text-graphite-3 sm:text-right">{agent.output}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-graphite">
              실행 기록.
            </h2>
          </Reveal>
          <ol className="mt-8">
            {TIMELINE.map((item) => (
              <li
                key={item.time}
                className="grid gap-1 border-b border-hairline py-4 sm:grid-cols-[80px_220px_1fr] sm:items-baseline sm:gap-4"
              >
                <span className="text-[13px] text-graphite-3">{item.time}</span>
                <span className="text-[15px] font-medium text-graphite">{item.label}</span>
                <span className="text-[14px] text-graphite-2">{item.detail}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-graphite">
              왜 이 방식이 해자입니까.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {MOAT.map((item) => (
              <Reveal key={item.title} delay={0.04}>
                <article className="h-full rounded-[var(--radius-card)] border border-hairline bg-surface p-6">
                  <p className="text-[15px] font-semibold text-graphite">{item.title}</p>
                  <p className="mt-2 text-[14px] leading-[1.65] text-graphite-2">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-hairline pt-8">
          <p className="text-[13px] text-graphite-3">더 읽기</p>
          <nav aria-label="관련 링크" className="mt-3">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="flex items-center justify-between gap-4 border-b border-hairline py-4 transition-colors duration-200 hover:text-vermilion"
              >
                <span className="flex items-baseline gap-3">
                  <span className="text-[15px] font-medium text-graphite">{link.label}</span>
                  <span className="text-[13px] text-graphite-3">{link.note}</span>
                </span>
                <span aria-hidden className="text-graphite-3">
                  →
                </span>
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
