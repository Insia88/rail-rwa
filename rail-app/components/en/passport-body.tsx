import type { Profile, UnderwritingResult } from "@/lib/types";
import { DECISION_LABEL_EN, dateEn, krwEn, krwFullEn, pctF, ppEn } from "@/components/en/flow-data";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { ArtifactHead, ArtifactRow, ArtifactSection } from "@/components/flow/artifact";
import { EvidenceTable } from "@/components/flow/evidence-table";
import { ScoreTable } from "@/components/flow/score-table";
import { RiskFlags } from "@/components/flow/risk-flags";
import { PricingBreakdown } from "@/components/flow/pricing-breakdown";
import { RwaCertificate } from "@/components/flow/rwa-certificate";
import { AgentSignatures } from "@/components/flow/agent-signatures";

const DECISION_STYLE = {
  approved: "bg-graphite text-white",
  conditional: "bg-vermilion-soft text-vermilion",
  declined: "bg-vermilion-soft text-vermilion",
} as const;

export const EN_DEMO_LINE =
  "RAIL is a demo. It is not a financial service; on-chain records are simulated.";

export function EnPassportBody({
  result,
  profile,
}: {
  result: UnderwritingResult;
  profile: Profile;
}) {
  const declined = result.decision === "declined";
  const verifiedCount = result.evidence.filter((item) => item.verified).length;
  const shareUrl = `https://rail-rwa.vercel.app/en/passport/${result.profileId}`;
  const declineFlag = declined
    ? (result.flags.find((flag) => flag.code.startsWith("E-")) ?? result.flags[0])
    : undefined;

  return (
    <div className="divide-y divide-hairline border-t border-hairline">
      {/* 01 decision + terms */}
      <ArtifactSection labelledBy="passport-sec-summary">
        <ArtifactHead
          id="passport-sec-summary"
          index="01"
          title="Underwriting summary"
          kicker="Decision · terms"
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
                {DECISION_LABEL_EN[result.decision]}
              </span>
              <span className="text-[13px] tabular-nums text-graphite-2">
                Score {result.score.toFixed(1)} · Grade {result.grade}
              </span>
              {declineFlag ? (
                <span className="font-mono text-[12.5px] tabular-nums text-vermilion">
                  {declineFlag.code}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-[15.5px] leading-[1.7] text-graphite-2">{result.decisionNote}</p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-graphite-3">
              Every number is computed by the rule engine · same input, same passport
            </p>
          </div>

          <dl className="border-t border-hairline-2">
            <ArtifactRow
              label="Requested amount"
              value={krwEn(result.requestedKrw)}
              sub={krwFullEn(result.requestedKrw)}
            />
            <ArtifactRow
              label="Approved limit"
              value={declined ? "Not approved" : krwEn(result.limitKrw)}
              sub={declined ? "Limit 0 · no facility" : krwFullEn(result.limitKrw)}
              emphasis
            />
            <ArtifactRow
              label="Tenor"
              value={`${result.tenorDays} days`}
              sub={`Matures ${dateEn(result.funding.maturityDate)}`}
            />
            <ArtifactRow
              label="Interest rate · APR"
              value={declined ? "—" : `${result.apr.toFixed(2)}%`}
              sub={
                declined
                  ? "No rate on a declined file"
                  : `Benchmark ${result.benchmarkApr.toFixed(2)}% + spread ${ppEn(Number(result.spreadPct.toFixed(2)))}`
              }
              emphasis
            />
            <ArtifactRow
              label="Market reference"
              value={`USD/KRW ${result.market.usdKrw.toFixed(2)}`}
              sub={`${result.benchmarkLabel} ${result.market.benchmarkApr.toFixed(2)}% · ${dateEn(result.market.asOf)}`}
            />
            <ArtifactRow
              label="Evidence coverage"
              value={pctF(result.evidenceCoverage * 100)}
              sub={`Verified ${verifiedCount} / ${result.evidence.length} items`}
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
          title="Evidence"
          kicker="Source · verification"
        />
        <div className="mt-5">
          <EvidenceTable evidence={result.evidence} coverage={result.evidenceCoverage} locale="en" />
        </div>
      </ArtifactSection>

      {/* 03 score */}
      <ArtifactSection labelledBy="passport-sec-score">
        <ArtifactHead
          id="passport-sec-score"
          index="03"
          title="Score"
          kicker="Weighted components"
        />
        <div className="mt-5">
          <ScoreTable
            components={result.components}
            score={result.score}
            grade={result.grade}
            locale="en"
          />
        </div>
      </ArtifactSection>

      {/* 04 risk flags */}
      <ArtifactSection labelledBy="passport-sec-flags">
        <ArtifactHead
          id="passport-sec-flags"
          index="04"
          title="Risk"
          kicker="Severity · mitigation"
        />
        <div className="mt-5">
          <RiskFlags flags={result.flags} locale="en" />
        </div>
      </ArtifactSection>

      {/* 05 covenants */}
      <ArtifactSection labelledBy="passport-sec-covenants">
        <ArtifactHead
          id="passport-sec-covenants"
          index="05"
          title={declined ? "Re-review conditions" : "Covenants"}
          kicker={declined ? "Reason · release conditions" : "Conditions of approval"}
        />
        <p className="mt-3 text-[13px] text-graphite-3">
          {declined
            ? "The file can be re-underwritten once these conditions are resolved."
            : `${result.covenants.length} conditions · a breach triggers a limit re-pricing`}
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
        <ArtifactHead
          id="passport-sec-pricing"
          index="06"
          title="Pricing"
          kicker="Rate · settlement"
        />
        <div className="mt-5">
          <PricingBreakdown result={result} locale="en" />
        </div>
      </ArtifactSection>

      {/* 07 RWA certificate */}
      <ArtifactSection labelledBy="passport-sec-rwa">
        <ArtifactHead
          id="passport-sec-rwa"
          index="07"
          title="RWA certificate"
          kicker="Tokenized receivable"
        />
        <div className="mt-5">
          <RwaCertificate result={result} locale="en" />
        </div>
      </ArtifactSection>

      {/* 08 signatures */}
      <ArtifactSection labelledBy="passport-sec-agents">
        <ArtifactHead
          id="passport-sec-agents"
          index="08"
          title="Agent signatures"
          kicker="Replayable record"
        />
        <div className="mt-5">
          <AgentSignatures
            agents={result.agents}
            issuedAt={result.issuedAt}
            passportId={result.passportId}
            locale="en"
          />
        </div>
      </ArtifactSection>

      {/* document footer */}
      <div className="border-t border-hairline px-6 py-5 sm:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-1.5">
            <p className="text-[12.5px] leading-relaxed text-graphite-3">
              Market reference {dateEn(result.market.asOf)} · USD/KRW{" "}
              {result.market.usdKrw.toFixed(2)} · {result.market.benchmarkSource}
            </p>
            <p className="text-[12.5px] leading-relaxed text-graphite-3">
              Every number is computed by the rule engine. Agents do not generate numbers; they
              record the reasoning.
            </p>
            <p className="break-all font-mono text-[11.5px] text-graphite-3">{shareUrl}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Link
              href="/en/market"
              className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
            >
              Market weather
            </Link>
            <Link
              href="/en/underwrite"
              className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
            >
              Check another applicant
            </Link>
            <Link
              href="/en/agents"
              className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
            >
              Agent crew
            </Link>
          </div>
        </div>
        <p className="mt-4 border-t border-hairline pt-3 text-[12.5px] leading-relaxed text-graphite-3">
          {EN_DEMO_LINE}
        </p>
      </div>
    </div>
  );
}
