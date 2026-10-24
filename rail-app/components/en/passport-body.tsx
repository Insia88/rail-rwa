import type { Profile, UnderwritingResult } from "@/lib/types";
import { DECISION_LABEL_EN, dateEn, krwEn, krwFullEn, pctF, ppEn } from "@/components/en/flow-data";
import { ArrowLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { ArtifactHead, ArtifactRow, ArtifactSection } from "@/components/flow/artifact";
import { EvidenceTable } from "@/components/flow/evidence-table";
import { ScoreTable } from "@/components/flow/score-table";
import { RiskFlags } from "@/components/flow/risk-flags";
import { PricingBreakdown } from "@/components/flow/pricing-breakdown";
import { RwaCertificate } from "@/components/flow/rwa-certificate";
import { AgentSignatures } from "@/components/flow/agent-signatures";
import { AsciiWaterfall } from "@/components/flow/ascii-waterfall";

const DECISION_CHIP = {
  approved: "border-ink/30 bg-ink text-paper",
  conditional: "border-signal/60 text-signal",
  declined: "border-signal text-signal",
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
  const verifiedCount = result.evidence.filter((item) => item.verified).length;
  const limitLabel =
    result.decision === "declined" || result.limitKrw <= 0
      ? "Not approved"
      : krwEn(result.limitKrw);
  const shareUrl = `https://rail-rwa.vercel.app/en/passport/${result.profileId}`;

  return (
    <div className="divide-y divide-ink/10">
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
                  "inline-flex items-center border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em]",
                  DECISION_CHIP[result.decision],
                )}
              >
                {DECISION_LABEL_EN[result.decision]}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/65">
                Score {result.score.toFixed(1)} · Grade {result.grade}
              </span>
            </div>
            <p className="mt-3 text-[15px] leading-[1.8] text-ink/85">{result.decisionNote}</p>
            <p className="mt-3 font-mono text-[10px] uppercase leading-relaxed tracking-[0.12em] text-ink/60">
              Every number is computed by the rule engine · same input, same passport
            </p>
          </div>

          <dl className="border-t border-ink/70">
            <ArtifactRow
              label="Requested amount"
              value={krwEn(result.requestedKrw)}
              sub={krwFullEn(result.requestedKrw)}
            />
            <ArtifactRow
              label="Approved limit"
              value={limitLabel}
              sub={krwFullEn(result.limitKrw)}
              emphasis
            />
            <ArtifactRow
              label="Tenor"
              value={`${result.tenorDays} days`}
              sub={`Matures ${dateEn(result.funding.maturityDate)}`}
            />
            <ArtifactRow
              label="Interest rate · APR"
              value={`${result.apr.toFixed(2)}%`}
              sub={`Benchmark ${result.benchmarkApr.toFixed(2)}% + spread ${ppEn(Number(result.spreadPct.toFixed(2)))}`}
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

      {/* 02 evidence table */}
      <ArtifactSection labelledBy="passport-sec-evidence">
        <ArtifactHead
          id="passport-sec-evidence"
          index="02"
          title="Evidence table"
          kicker="Provenance · trust"
        />
        <div className="mt-5">
          <EvidenceTable evidence={result.evidence} coverage={result.evidenceCoverage} locale="en" />
        </div>
      </ArtifactSection>

      {/* 03 score components */}
      <ArtifactSection labelledBy="passport-sec-score">
        <ArtifactHead
          id="passport-sec-score"
          index="03"
          title="Score components"
          kicker="Weights · score"
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
          title="Risk flags"
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
          title="Covenants"
          kicker="Conditions of approval"
        />
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink/65">
          {result.covenants.length} conditions · a breach triggers a limit re-pricing
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
          title="Pricing"
          kicker="Rate · settlement"
        />
        <div className="mt-5">
          <PricingBreakdown result={result} locale="en" />
          <AsciiWaterfall result={result} profile={profile} />
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

      {/* 08 agent signatures */}
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

      {/* compact document footer */}
      <div className="px-5 py-5 sm:px-7 md:px-9">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl space-y-1.5">
            <p className="text-[11px] leading-relaxed text-ink/65">
              Market reference {dateEn(result.market.asOf)} · USD/KRW{" "}
              {result.market.usdKrw.toFixed(2)} · {result.market.benchmarkSource}
            </p>
            <p className="font-mono text-[10px] leading-relaxed text-ink/60">
              Every number is computed by the rule engine. Agents do not generate numbers; they
              record the reasoning.
            </p>
            <p className="break-all font-mono text-[10px] text-ink/55">{shareUrl}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <ArrowLink href="/en/market">RWA market weather</ArrowLink>
            <ArrowLink href="/en/underwrite">Check another applicant</ArrowLink>
            <ArrowLink href="/en/agents">Agent crew</ArrowLink>
          </div>
        </div>
        <p className="mt-4 border-t border-ink/10 pt-3 font-mono text-[10px] leading-relaxed text-ink/60">
          {EN_DEMO_LINE}
        </p>
      </div>
    </div>
  );
}
