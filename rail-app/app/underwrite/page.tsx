import type { Metadata } from "next";
import Link from "next/link";
import type { Provenance } from "@/lib/types";
import { PROFILES, TYPE_LABEL } from "@/lib/profiles";
import { engineContextFromMarket, getMarketSnapshot } from "@/lib/market";
import { ALL_RESULTS } from "@/lib/engine";
import { krw, krwCompact } from "@/lib/format";
import { Sparkline } from "@/components/ui/sparkline";
import { ProvenanceChip } from "@/components/flow/ui";

export const metadata: Metadata = {
  title: "지원자 데스크 — 신용 심사",
  description:
    "은행이 거절한 수출기업·프리랜서·딥테크 지원자 4명. RAIL의 에이전트 4개가 온체인 증거를 검증하고 신용 여권을 발급합니다. 승인과 거절을 함께 확인하세요.",
};

const DECISION_LABEL_KO = {
  approved: "승인",
  conditional: "조건부 승인",
  declined: "미승인",
} as const;

const DECISION_CHIP = {
  approved: "bg-graphite text-white",
  conditional: "bg-vermilion-soft text-vermilion",
  declined: "bg-vermilion-soft text-vermilion",
} as const;

const PROVENANCE_LEGEND: { provenance: Provenance; label: string; body: string }[] = [
  {
    provenance: "onchain",
    label: "온체인",
    body: "지갑·정산 트랜잭션. 조작이 불가능한 가장 강한 증거입니다.",
  },
  {
    provenance: "platform",
    label: "플랫폼 원장",
    body: "읽기 전용 API로 수집한 정산 내역. 수정 불가, 의존도는 따로 기록합니다.",
  },
  {
    provenance: "document",
    label: "문서",
    body: "수출신고·세금계산서·계약 원본. OCR 대조 후 교차검증합니다.",
  },
  {
    provenance: "self_reported",
    label: "자기신고",
    body: "창업자 진술·추정치. 신용 결정에는 직접 반영하지 않습니다.",
  },
];

export default async function UnderwritePage() {
  const market = await getMarketSnapshot();
  const results = ALL_RESULTS(engineContextFromMarket(market));
  const resultByProfile = new Map(results.map((result) => [result.profileId, result]));
  const approvedCount = results.filter((result) => result.decision === "approved").length;
  const conditionalCount = results.filter((result) => result.decision === "conditional").length;
  const declinedCount = results.filter((result) => result.decision === "declined").length;

  return (
    <main className="min-h-dvh bg-porcelain pt-16 text-graphite">
      <div className="mx-auto w-full max-w-[1120px] px-6 pb-24 pt-14 sm:px-8">
        {/* hero */}
        <p className="text-[13px] font-medium text-graphite-3">수출채권 팩토링 · RWA</p>
        <h1 className="mt-3 max-w-[18ch] text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-graphite sm:text-[44px] lg:text-[54px]">
          은행이 거절한 매출을,
          <br />
          신용으로 바꿉니다.
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-[1.65] text-graphite-2">
          지원자를 고르면 네 명의 에이전트가 증거를 검증하고 2.4초 안에 판정과 신용 여권을
          만듭니다. 승인되지 않는 지원자도 그대로 보여드립니다.
        </p>

        {/* applicants */}
        <section aria-label="지원자 목록" className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-graphite">지원자</h2>
            <p className="text-[13px] text-graphite-3">
              승인 {approvedCount + conditionalCount} · 거절 {declinedCount}
            </p>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {PROFILES.map((profile) => {
              const result = resultByProfile.get(profile.id);
              const decision = result?.decision ?? "conditional";
              const declined = decision === "declined";
              const inflow = profile.monthlyInflowKrw;
              const latestInflow = inflow[inflow.length - 1] ?? 0;
              return (
                <article
                  key={profile.id}
                  className="flex h-full flex-col rounded-[24px] border border-hairline bg-surface p-6 shadow-card transition-shadow duration-300 hover:shadow-float"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] text-graphite-3">{TYPE_LABEL[profile.type]}</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ${DECISION_CHIP[decision]}`}
                    >
                      {DECISION_LABEL_KO[decision]}
                    </span>
                  </div>

                  <h3 className="mt-3 text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-graphite">
                    {profile.name}
                  </h3>
                  <p className="mt-1.5 text-[14.5px] leading-[1.6] text-graphite-2">
                    {profile.tagline}
                  </p>

                  <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-hairline py-4">
                    <div>
                      <dt className="text-[13px] text-graphite-3">요청 금액</dt>
                      <dd className="mt-1 text-[26px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-graphite">
                        {krwCompact(profile.requestedKrw)}
                      </dd>
                      <dd className="mt-1 text-[12px] tabular-nums text-graphite-3">
                        {krw(profile.requestedKrw)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[13px] text-graphite-3">기간</dt>
                      <dd className="mt-1 text-[26px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-graphite">
                        {profile.tenorDays}
                        <span className="ml-1 text-[13px] font-medium text-graphite-2">일</span>
                      </dd>
                      <dd className="mt-1 text-[12px] text-graphite-3">
                        월평균{" "}
                        {krwCompact(
                          Math.round(inflow.reduce((a, v) => a + v, 0) / (inflow.length || 1)),
                        )}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-between">
                      <p className="text-[12.5px] text-graphite-3">월 정산 흐름 · 6개월</p>
                      <p className="text-[12.5px] tabular-nums text-graphite-3">
                        최근 {krwCompact(latestInflow)}
                      </p>
                    </div>
                    <Sparkline
                      values={inflow}
                      width={280}
                      height={40}
                      className="mt-2 w-full"
                      stroke="#0a0b0d"
                      fill="#efeee9"
                    />
                  </div>

                  <div className="mt-4 flex-1">
                    <p className="text-[12.5px] text-graphite-3">은행 결과</p>
                    <p className="mt-1 line-clamp-2 text-[13.5px] leading-[1.6] text-graphite-2">
                      {profile.bankOutcome}
                    </p>
                    {declined ? (
                      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-vermilion">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-vermilion" />
                        중복 담보로 거절
                        <span className="font-mono text-[12px] font-normal tabular-nums">
                          {profile.hardDecline?.code ?? "E-DUP-PLEDGE"}
                        </span>
                      </p>
                    ) : null}
                    <p className="mt-2 text-[12.5px] text-graphite-3">
                      {declined
                        ? "여권에서 거절 사유와 근거를 확인합니다"
                        : "2.4초 에이전트 심사 → 신용 여권"}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <Link
                      href={`/underwrite/${profile.id}`}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-graphite px-5 text-[14px] font-medium text-white transition-colors hover:bg-graphite/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      심사 시작
                      <span aria-hidden>→</span>
                    </Link>
                    <span className="text-[12.5px] text-graphite-3">
                      근거 {profile.evidence.length}건
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* provenance */}
        <section aria-labelledby="provenance-title" className="mt-16">
          <h2
            id="provenance-title"
            className="text-[22px] font-semibold tracking-[-0.01em] text-graphite"
          >
            증거의 출처
          </h2>
          <p className="mt-1.5 max-w-2xl text-[14px] leading-[1.6] text-graphite-2">
            증거의 출처와 검증 상태는 여권에 그대로 남습니다.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROVENANCE_LEGEND.map((item) => (
              <div
                key={item.provenance}
                className="rounded-[16px] border border-hairline bg-surface p-4"
              >
                <ProvenanceChip provenance={item.provenance} variant="light" />
                <p className="mt-2 text-[14px] font-medium text-graphite">{item.label}</p>
                <p className="mt-1 text-[13px] leading-[1.6] text-graphite-2">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* footer links */}
        <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/passport/hanbit"
              className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
            >
              한빛전자 여권 예시
            </Link>
            <Link
              href="/market"
              className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
            >
              RWA 시장
            </Link>
          </div>
          <p className="text-[12.5px] text-graphite-3">
            RAIL은 데모입니다. 지원자 프로필은 구성되었고 온체인 기록은 시뮬레이션입니다.
          </p>
        </div>
      </div>
    </main>
  );
}
