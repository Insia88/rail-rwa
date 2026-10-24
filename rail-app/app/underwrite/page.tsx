import type { Metadata } from "next";
import type { Provenance } from "@/lib/types";
import { PROFILES, TYPE_LABEL } from "@/lib/profiles";
import { krw, krwCompact } from "@/lib/format";
import { ArrowLink, Button } from "@/components/ui/button";
import { Sparkline } from "@/components/ui/sparkline";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { cn } from "@/lib/cn";
import { BorderTrail } from "@/components/flow/border-trail";
import { Kicker, ProvenanceChip } from "@/components/flow/ui";

export const metadata: Metadata = {
  title: "지원자 데스크 — 신용 심사",
  description:
    "세 명의 지원자가 이미 은행에서 거절당했습니다. RAIL의 에이전트 4개가 온체인 증거를 검증하고 신용 여권을 발급합니다.",
};

const RUN_PROTOCOL = [
  { agent: "SCOUT", role: "증거 수집" },
  { agent: "VERIFIER", role: "교차검증" },
  { agent: "UNDERWRITER", role: "신용 판정" },
  { agent: "BROKER", role: "유동성 매칭" },
];

const PROVENANCE_LEGEND: { provenance: Provenance; label: string; body: string }[] = [
  {
    provenance: "onchain",
    label: "온체인",
    body: "지갑·정산 트랜잭션. 조작이 불가능한 가장 강한 증거입니다.",
  },
  {
    provenance: "platform",
    label: "플랫폼 원장",
    body: "읽기 전용 API로 수집한 정산 내역. 수정 불가, 플랫폼 의존도는 따로 기록합니다.",
  },
  {
    provenance: "document",
    label: "문서",
    body: "수출신고·세금계산서·계약·성적서 원본. OCR 대조 후 교차검증합니다.",
  },
  {
    provenance: "self_reported",
    label: "자기신고",
    body: "창업자 진술·추정치. 신용 결정에는 직접 반영하지 않습니다.",
  },
];

function monthlyAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((acc, value) => acc + value, 0) / values.length);
}

export default function UnderwritePage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-noir pt-16 text-cream">
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dot-grid-dark opacity-40 mask-fade-b"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04] mix-blend-overlay print:hidden"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-12 sm:px-8 md:pt-16">
        {/* desk line */}
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.24em]">
          <span className="flex items-center gap-2 text-acid">
            <span aria-hidden className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-acid" />
            Applicant desk
          </span>
          <span className="text-cream/30">
            {String(PROFILES.length).padStart(2, "0")} candidates · Seoul · 2026
          </span>
        </div>

        {/* hero */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <Stagger>
            <StaggerItem>
              <h1 className="text-[clamp(2.9rem,6.2vw,5.4rem)] font-extrabold leading-[1.15] tracking-[-0.015em] text-cream">
                누구의 신용을
                <br />
                심사할까요<span className="text-signal">?</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-6 max-w-xl text-[15px] leading-[1.85] text-cream/55">
                세 명의 지원자가 이미 은행에서 거절당했습니다. RAIL이 읽는 것은 서류가 아니라
                흐름입니다.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/35">
                <span>
                  <span className="text-signal">
                    {String(RUN_PROTOCOL.length).padStart(2, "0")}
                  </span>{" "}
                  agents
                </span>
                <span aria-hidden className="h-px w-6 bg-cream/15" />
                <span>~6s per run</span>
                <span aria-hidden className="h-px w-6 bg-cream/15" />
                <span>deterministic engine</span>
              </div>
            </StaggerItem>
          </Stagger>

          {/* run protocol */}
          <div className="relative animate-rise delay-2 border border-line-dark bg-noir-2/80 p-5">
            <span aria-hidden className="absolute right-0 top-0 h-px w-12 bg-acid" />
            <div className="flex items-center justify-between">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-cream/35">
                Run protocol
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-acid/70">~6s</p>
            </div>
            <ol className="mt-4">
              {RUN_PROTOCOL.map((step, index) => (
                <li
                  key={step.agent}
                  className="flex items-baseline gap-3 border-b border-line-dark py-2.5 last:border-b-0"
                >
                  <span className="font-mono text-[9px] tracking-[0.14em] text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.18em] text-cream">
                    {step.agent}
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-cream/35">{step.role}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 border-t border-line-dark pt-2.5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-cream/25">
              4 agents · sequential · signed off
            </p>
          </div>
        </div>

        {/* applicant cards */}
        <section
          aria-label="지원자 목록"
          className="mt-14 animate-rise delay-3 border-t border-signal/50 pt-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <Kicker tone="cream">Select applicant</Kicker>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-signal/70">
              Bank · rejected
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROFILES.map((profile, index) => {
              const verified = profile.evidence.filter((item) => item.verified).length;
              const inflow = profile.monthlyInflowKrw;
              const latestInflow = inflow[inflow.length - 1] ?? 0;
              return (
                <BorderTrail
                  key={profile.id}
                  className={cn("flex", index === 2 && "sm:col-span-2 lg:col-span-1")}
                >
                  <article className="group relative flex w-full flex-col overflow-hidden border border-line-dark bg-noir-2">
                  <div className="relative px-5 pt-5">
                    <span
                      aria-hidden
                      className="chrome-text pointer-events-none absolute right-4 top-3 select-none font-serif-display text-[54px] italic leading-none opacity-80"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/35">
                      {TYPE_LABEL[profile.type]}
                    </p>
                    <h2 className="mt-3 max-w-[78%] text-[28px] font-extrabold leading-[1.2] tracking-[-0.01em] text-cream">
                      {profile.name}
                    </h2>
                    <p className="mt-2 max-w-[88%] text-[12.5px] leading-relaxed text-cream/50">
                      {profile.tagline}
                    </p>
                  </div>

                  <div className="mt-5 border-y border-line-dark px-5 py-4">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/30">
                          Requested
                        </p>
                        <p className="type-data mt-1 text-[34px] font-bold leading-tight text-signal">
                          {krwCompact(profile.requestedKrw)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/30">
                          Tenor
                        </p>
                        <p className="type-data mt-1 text-[28px] font-semibold leading-none text-cream">
                          {profile.tenorDays}
                          <span className="ml-1 font-sans text-[10px] tracking-normal text-cream/35">
                            일
                          </span>
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 truncate font-mono text-[9px] tnum text-cream/25">
                      {krw(profile.requestedKrw)}
                    </p>
                  </div>

                  <div className="border-b border-line-dark px-5 py-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/30">
                        Monthly inflow · 6m
                      </p>
                      <p className="font-mono text-[9px] tnum text-cream/45">
                        월평균 {krwCompact(monthlyAverage(inflow))}
                      </p>
                    </div>
                    <Sparkline
                      values={inflow}
                      width={280}
                      height={42}
                      className="mt-3 w-full"
                      stroke="#F2EDE2"
                      fill="#131A16"
                    />
                    <div className="mt-1.5 flex justify-between font-mono text-[8px] uppercase tracking-[0.16em] text-cream/20">
                      <span>Oldest</span>
                      <span className="tnum">Latest {krwCompact(latestInflow)}</span>
                    </div>
                  </div>

                  <div className="border-b border-line-dark px-5 py-3.5">
                    <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-signal/70">
                      Bank_result
                    </p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-cream/40">
                      {profile.bankOutcome}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-col gap-3 px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1.5 border border-cream/20 px-2 py-[3px] font-mono text-[9px] uppercase leading-none tracking-[0.14em] text-cream/60">
                        Evidence {String(profile.evidence.length).padStart(2, "0")}
                      </span>
                      <span className="inline-flex items-center gap-1.5 border border-acid/25 px-2 py-[3px] font-mono text-[9px] uppercase leading-none tracking-[0.14em] text-acid">
                        <span aria-hidden className="h-1 w-1 rounded-full bg-acid" />
                        Verified {String(verified).padStart(2, "0")}
                      </span>
                    </div>
                    <Button
                      href={`/underwrite/${profile.id}`}
                      variant="primary"
                      size="md"
                      className="w-full justify-between"
                    >
                      <span>심사 시작</span>
                      <span aria-hidden>→</span>
                    </Button>
                  </div>
                  </article>
                </BorderTrail>
              );
            })}
          </div>
        </section>

        {/* provenance legend */}
        <section
          aria-labelledby="provenance-title"
          className="mt-16 animate-rise delay-4 border-t border-line-dark pt-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2
              id="provenance-title"
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/45"
            >
              Provenance
            </h2>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/25">
              증거의 출처는 여권에 그대로 남습니다
            </span>
          </div>
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROVENANCE_LEGEND.map((item) => (
              <div key={item.provenance} className="border-t border-line-dark pt-4">
                <ProvenanceChip provenance={item.provenance} variant="dark" />
                <p className="mt-2.5 text-[13px] font-semibold text-cream/85">{item.label}</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-cream/40">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-line-dark pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <ArrowLink href="/passport/hanbit" inverse>
                한빛전자 여권 예시
              </ArrowLink>
              <ArrowLink href="/market" inverse>
                RWA 시장 기상도
              </ArrowLink>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-cream/20">
              RAIL / Credit engine — Seoul
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
