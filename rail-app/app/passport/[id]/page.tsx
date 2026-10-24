import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/profiles";
import { engineContextFromMarket, getMarketSnapshot } from "@/lib/market";
import { underwrite } from "@/lib/engine";
import { DECISION_LABEL, dateKo, krw, krwCompact, pct } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ArtifactHead, ArtifactRow, ArtifactSection } from "@/components/flow/artifact";
import { PassportCover } from "@/components/flow/passport-cover";
import { PassportToolbar } from "@/components/flow/passport-toolbar";
import { EvidenceTable } from "@/components/flow/evidence-table";
import { ScoreTable } from "@/components/flow/score-table";
import { RiskFlags } from "@/components/flow/risk-flags";
import { PricingBreakdown } from "@/components/flow/pricing-breakdown";
import { RwaCertificate } from "@/components/flow/rwa-certificate";
import { AgentSignatures } from "@/components/flow/agent-signatures";
import { wonPhrase } from "@/components/flow/format";

const BASE_URL = "https://rail-rwa.vercel.app";

const DECISION_STYLE = {
  approved: "bg-graphite text-white",
  conditional: "bg-vermilion-soft text-vermilion",
  declined: "bg-vermilion-soft text-vermilion",
} as const;

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) return { title: "찾을 수 없는 여권" };
  return {
    title: `${profile.company} — 신용 여권`,
    description: `${profile.name}의 RAIL Credit Passport. 온체인 증거로 계산한 점수·등급·한도·금리와 수출채권 RWA 발행 계획을 담은 설명 가능한 심사 아티팩트입니다.`,
    openGraph: {
      title: `${profile.company} — RAIL 신용 여권`,
      description:
        "은행은 담보를 봅니다. RAIL은 흐름을 봅니다. 온체인 증거로 발급한 신용 여권과 수출채권 RWA 증서.",
      type: "article",
    },
  };
}

export default async function PassportPage({ params }: PageProps) {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) notFound();

  const market = await getMarketSnapshot();
  const result = underwrite(profile, engineContextFromMarket(market));
  const declined = result.decision === "declined";
  const verifiedCount = result.evidence.filter((item) => item.verified).length;
  const shareUrl = `${BASE_URL}/passport/${result.profileId}`;
  const limitLabel = declined ? "미승인" : wonPhrase(result.limitKrw);
  const declineFlag = declined
    ? (result.flags.find((flag) => flag.code.startsWith("E-")) ?? result.flags[0])
    : undefined;

  return (
    <main className="min-h-dvh bg-porcelain pt-16 text-graphite">
      <div className="mx-auto w-full max-w-[880px] px-5 pb-16 pt-8 sm:px-6">
        {/* toolbar */}
        <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/underwrite"
              className="text-[13px] text-graphite-2 transition-colors hover:text-graphite"
            >
              ← 지원자 목록
            </Link>
            <p className="mt-1 font-mono text-[12px] tabular-nums text-graphite-3">
              {result.passportId} · {dateKo(result.issuedAt)}
            </p>
          </div>
          <PassportToolbar
            shareUrl={shareUrl}
            data={result}
            filename={`rail-passport-${result.passportId}.json`}
            shareTitle={`${result.company} — RAIL 신용 여권`}
            shareText={`${result.company}의 RAIL 신용 여권 · 등급 ${result.grade} · 한도 ${krwCompact(result.limitKrw)} · APR ${pct(result.apr, 2)}`}
          />
        </div>

        {/* document */}
        <article className="mt-5 overflow-hidden rounded-[24px] border border-hairline bg-surface shadow-card print:rounded-none print:border-0 print:shadow-none">
          <PassportCover result={result} profile={profile} />

          <div className="divide-y divide-hairline border-t border-hairline">
            {/* 01 decision + terms */}
            <ArtifactSection labelledBy="passport-sec-summary">
              <ArtifactHead
                id="passport-sec-summary"
                index="01"
                title="심사 요약"
                kicker="판정 · 조건"
              />
              <div className="mt-5 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-[12.5px] font-medium",
                        DECISION_STYLE[result.decision],
                      )}
                    >
                      {DECISION_LABEL[result.decision]}
                    </span>
                    <span className="text-[13px] tabular-nums text-graphite-2">
                      점수 {result.score.toFixed(1)} · 등급 {result.grade}
                    </span>
                    {declineFlag ? (
                      <span className="font-mono text-[12.5px] tabular-nums text-vermilion">
                        {declineFlag.code}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-[15.5px] leading-[1.7] text-graphite-2">
                    {result.decisionNote}
                  </p>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-graphite-3">
                    모든 수치는 규칙 엔진이 계산합니다 · 동일 입력, 동일 여권
                  </p>
                </div>

                <dl className="border-t border-hairline-2">
                  <ArtifactRow
                    label="요청 금액"
                    value={krwCompact(result.requestedKrw)}
                    sub={krw(result.requestedKrw)}
                  />
                  <ArtifactRow
                    label="승인 한도"
                    value={limitLabel}
                    sub={declined ? "한도 0원 · 시설 없음" : krw(result.limitKrw)}
                    emphasis
                  />
                  <ArtifactRow
                    label="기간"
                    value={`${result.tenorDays}일`}
                    sub={`만기 ${dateKo(result.funding.maturityDate)}`}
                  />
                  <ArtifactRow
                    label="적용 금리 · APR"
                    value={declined ? "—" : pct(result.apr, 2)}
                    sub={
                      declined
                        ? "미승인 — 금리 없음"
                        : `기준 ${pct(result.benchmarkApr, 2)} + 스프레드 ${result.spreadPct.toFixed(2)}%p`
                    }
                    emphasis
                  />
                  <ArtifactRow
                    label="시장 기준"
                    value={`USD/KRW ${result.market.usdKrw.toFixed(2)}`}
                    sub={`${result.benchmarkLabel} ${pct(result.market.benchmarkApr, 2)} · ${dateKo(result.market.asOf)}`}
                  />
                  <ArtifactRow
                    label="증거 커버리지"
                    value={pct(result.evidenceCoverage * 100)}
                    sub={`검증 ${verifiedCount} / ${result.evidence.length}건`}
                    last
                  />
                </dl>
              </div>
            </ArtifactSection>

            {/* 02 evidence */}
            <ArtifactSection labelledBy="passport-sec-evidence">
              <ArtifactHead id="passport-sec-evidence" index="02" title="증거" kicker="출처 · 검증" />
              <div className="mt-5">
                <EvidenceTable evidence={result.evidence} coverage={result.evidenceCoverage} />
              </div>
            </ArtifactSection>

            {/* 03 score */}
            <ArtifactSection labelledBy="passport-sec-score">
              <ArtifactHead id="passport-sec-score" index="03" title="점수" kicker="가중 항목" />
              <div className="mt-5">
                <ScoreTable
                  components={result.components}
                  score={result.score}
                  grade={result.grade}
                />
              </div>
            </ArtifactSection>

            {/* 04 risk flags */}
            <ArtifactSection labelledBy="passport-sec-flags">
              <ArtifactHead id="passport-sec-flags" index="04" title="리스크" kicker="심각도 · 완화" />
              <div className="mt-5">
                <RiskFlags flags={result.flags} />
              </div>
            </ArtifactSection>

            {/* 05 covenants */}
            <ArtifactSection labelledBy="passport-sec-covenants">
              <ArtifactHead
                id="passport-sec-covenants"
                index="05"
                title={declined ? "재심사 조건" : "약정"}
                kicker={declined ? "거절 사유 · 해소 조건" : "승인 조건"}
              />
              <p className="mt-3 text-[13px] text-graphite-3">
                {declined
                  ? "아래 조건이 해소되면 재심사할 수 있습니다"
                  : `조건 ${result.covenants.length}개 · 미이행 시 한도 재산정 사유`}
              </p>
              <ol className="mt-2">
                {result.covenants.map((covenant, index) => (
                  <li key={covenant} className="flex gap-4 border-b border-hairline py-3">
                    <span className="shrink-0 font-mono text-[12.5px] tabular-nums text-vermilion">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[14.5px] leading-[1.65] text-graphite-2">{covenant}</p>
                  </li>
                ))}
              </ol>
            </ArtifactSection>

            {/* 06 pricing */}
            <ArtifactSection labelledBy="passport-sec-pricing">
              <ArtifactHead id="passport-sec-pricing" index="06" title="가격" kicker="금리 · 정산" />
              <div className="mt-5">
                <PricingBreakdown result={result} />
              </div>
            </ArtifactSection>

            {/* 07 RWA certificate */}
            <ArtifactSection labelledBy="passport-sec-rwa">
              <ArtifactHead
                id="passport-sec-rwa"
                index="07"
                title="RWA 증서"
                kicker="수출채권 토큰화"
              />
              <div className="mt-5">
                <RwaCertificate result={result} />
              </div>
            </ArtifactSection>

            {/* 08 signatures */}
            <ArtifactSection labelledBy="passport-sec-agents">
              <ArtifactHead
                id="passport-sec-agents"
                index="08"
                title="에이전트 서명"
                kicker="재현 가능한 기록"
              />
              <div className="mt-5">
                <AgentSignatures
                  agents={result.agents}
                  issuedAt={result.issuedAt}
                  passportId={result.passportId}
                />
              </div>
            </ArtifactSection>
          </div>

          {/* document footer */}
          <div className="border-t border-hairline px-6 py-5 sm:px-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl space-y-1.5">
                <p className="text-[12.5px] leading-relaxed text-graphite-3">
                  시장 기준 {dateKo(result.market.asOf)} · USD/KRW{" "}
                  {result.market.usdKrw.toFixed(2)} · {result.market.benchmarkSource}
                </p>
                <p className="text-[12.5px] leading-relaxed text-graphite-3">
                  모든 수치는 규칙 엔진이 계산합니다. 에이전트는 수치를 생성하지 않고 판단 근거를
                  남깁니다.
                </p>
                <p className="break-all font-mono text-[11.5px] text-graphite-3">{shareUrl}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Link
                  href="/market"
                  className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
                >
                  RWA 시장 기상도
                </Link>
                <Link
                  href="/underwrite"
                  className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
                >
                  다른 지원자 심사
                </Link>
                <Link
                  href="/agents"
                  className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
                >
                  에이전트 팀
                </Link>
              </div>
            </div>
            <p className="mt-4 border-t border-hairline pt-3 text-[12.5px] leading-relaxed text-graphite-3">
              RAIL은 데모입니다. 실제 금융 서비스가 아니며, 온체인 기록은 시뮬레이션입니다.
            </p>
          </div>
        </article>

        {/* bottom nav */}
        <div className="no-print mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
          <p className="text-[12.5px] text-graphite-3">Issued by RAIL · deterministic engine</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/underwrite"
              className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
            >
              다시 심사하기
            </Link>
            <Link
              href="/market"
              className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
            >
              시장 데이터
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
