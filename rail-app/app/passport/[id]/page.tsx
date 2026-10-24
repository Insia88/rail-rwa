import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/profiles";
import { getMarketSnapshot, engineContextFromMarket } from "@/lib/market";
import { underwrite } from "@/lib/engine";
import { DECISION_LABEL, dateKo, krw, krwCompact, pct } from "@/lib/format";
import { ArrowLink } from "@/components/ui/button";
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
import { AsciiWaterfall } from "@/components/flow/ascii-waterfall";
import { wonPhrase } from "@/components/flow/format";

const BASE_URL = "https://rail-rwa.vercel.app";

const DECISION_CHIP = {
  approved: "border-ink/30 bg-ink text-paper",
  conditional: "border-signal/60 text-signal",
  declined: "border-signal text-signal",
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

  const shareUrl = `${BASE_URL}/passport/${result.profileId}`;
  const verifiedCount = result.evidence.filter((item) => item.verified).length;
  const limitLabel =
    result.decision === "declined" || result.limitKrw <= 0 ? "미승인" : wonPhrase(result.limitKrw);

  return (
    <main className="min-h-dvh bg-paper pt-16 text-ink">
      <div className="mx-auto w-full max-w-4xl px-4 pb-14 pt-6 sm:px-8 print:max-w-none print:px-0 print:pt-0">
        {/* toolbar */}
        <div className="no-print flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/underwrite"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65 transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              ← 지원자 목록
            </Link>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">
              Credit Passport · {result.passportId} · Issued {dateKo(result.issuedAt)}
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

        {/* artifact */}
        <article className="mt-5 border border-ink/20 bg-paper print:border-0">
          <PassportCover result={result} profile={profile} />

          <div className="divide-y divide-ink/10">
            {/* 01 decision + terms */}
            <ArtifactSection labelledBy="passport-sec-summary">
              <ArtifactHead
                id="passport-sec-summary"
                index="01"
                title="심사 요약"
                kicker="Decision · terms"
              />
              <div className="mt-5 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={cn(
                        "inline-flex items-center border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]",
                        DECISION_CHIP[result.decision],
                      )}
                    >
                      {DECISION_LABEL[result.decision]}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/65">
                      점수 {result.score.toFixed(1)} · 등급 {result.grade}
                    </span>
                  </div>
                  <p className="mt-3 text-[15px] leading-[1.8] text-ink/85">{result.decisionNote}</p>
                  <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-ink/60">
                    모든 수치는 규칙 엔진이 계산합니다 · 동일 입력, 동일 여권
                  </p>
                </div>

                <dl className="border-t border-ink/70">
                  <ArtifactRow
                    label="요청 금액"
                    value={krwCompact(result.requestedKrw)}
                    sub={krw(result.requestedKrw)}
                  />
                  <ArtifactRow
                    label="승인 한도"
                    value={limitLabel}
                    sub={krw(result.limitKrw)}
                    emphasis
                  />
                  <ArtifactRow
                    label="기간"
                    value={`${result.tenorDays}일`}
                    sub={`만기 ${dateKo(result.funding.maturityDate)}`}
                  />
                  <ArtifactRow
                    label="적용 금리 · APR"
                    value={pct(result.apr, 2)}
                    sub={`기준 ${pct(result.benchmarkApr, 2)} + 스프레드 ${result.spreadPct.toFixed(2)}%p`}
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
              <ArtifactHead
                id="passport-sec-evidence"
                index="02"
                title="증거 테이블"
                kicker="Evidence · provenance"
              />
              <div className="mt-5">
                <EvidenceTable evidence={result.evidence} coverage={result.evidenceCoverage} />
              </div>
            </ArtifactSection>

            {/* 03 score */}
            <ArtifactSection labelledBy="passport-sec-score">
              <ArtifactHead
                id="passport-sec-score"
                index="03"
                title="점수 컴포넌트"
                kicker="Weights · score"
              />
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
              <ArtifactHead
                id="passport-sec-flags"
                index="04"
                title="리스크 플래그"
                kicker="Severity · mitigation"
              />
              <div className="mt-5">
                <RiskFlags flags={result.flags} />
              </div>
            </ArtifactSection>

            {/* 05 covenants */}
            <ArtifactSection labelledBy="passport-sec-covenants">
              <ArtifactHead
                id="passport-sec-covenants"
                index="05"
                title="조건 · 약정"
                kicker="Covenants"
              />
              <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink/65">
                조건 {result.covenants.length}개 · 미이행 시 한도 재산정 사유
              </p>
              <ol className="mt-2">
                {result.covenants.map((covenant, index) => (
                  <li key={covenant} className="flex gap-4 border-b border-ink/10 py-3">
                    <span className="shrink-0 font-mono text-[11px] tracking-[0.12em] text-signal tnum">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[14px] leading-relaxed text-ink/80">{covenant}</p>
                  </li>
                ))}
              </ol>
            </ArtifactSection>

            {/* 06 pricing */}
            <ArtifactSection labelledBy="passport-sec-pricing">
              <ArtifactHead
                id="passport-sec-pricing"
                index="06"
                title="가격 산식"
                kicker="Rate · settlement"
              />
              <div className="mt-5">
                <PricingBreakdown result={result} />
                <AsciiWaterfall result={result} profile={profile} />
              </div>
            </ArtifactSection>

            {/* 07 RWA certificate */}
            <ArtifactSection labelledBy="passport-sec-rwa">
              <ArtifactHead
                id="passport-sec-rwa"
                index="07"
                title="RWA 증서"
                kicker="Tokenized receivable"
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
                kicker="Agent signatures"
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

          {/* compact document footer — replaces the old sources section */}
          <div className="border-t border-ink/20 px-5 py-5 sm:px-7 md:px-9">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl space-y-1.5">
                <p className="text-[11px] leading-relaxed text-ink/65">
                  시장 기준 {dateKo(result.market.asOf)} · USD/KRW{" "}
                  {result.market.usdKrw.toFixed(2)} · {result.market.benchmarkSource}
                </p>
                <p className="font-mono text-[10px] leading-relaxed text-ink/60">
                  모든 수치는 규칙 엔진이 계산합니다. 에이전트는 수치를 생성하지 않고 판단 근거를
                  남깁니다.
                </p>
                <p className="break-all font-mono text-[10px] text-ink/55">{shareUrl}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <ArrowLink href="/market">RWA 시장 기상도</ArrowLink>
                <ArrowLink href="/underwrite">다른 지원자 심사</ArrowLink>
                <ArrowLink href="/agents">에이전트 팀</ArrowLink>
              </div>
            </div>
            <p className="mt-4 border-t border-ink/10 pt-3 font-mono text-[10px] leading-relaxed text-ink/60">
              RAIL은 데모입니다. 실제 금융 서비스가 아니며, 온체인 기록은 시뮬레이션입니다.
            </p>
          </div>
        </article>

        {/* bottom navigation */}
        <div className="no-print mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/20 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">
            Issued by RAIL · deterministic underwriting engine
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <ArrowLink href="/underwrite">다시 심사하기</ArrowLink>
            <ArrowLink href="/market">시장 데이터 보기</ArrowLink>
          </div>
        </div>
      </div>
    </main>
  );
}
