import type { Profile, UnderwritingResult } from "@/lib/types";
import { TYPE_LABEL } from "@/lib/profiles";
import { DECISION_LABEL, dateKo, krw, krwCompact, pct } from "@/lib/format";
import {
  DECISION_LABEL_EN,
  TYPE_LABEL_EN,
  dateEn,
  krwEn,
  krwFullEn,
  pctF,
} from "@/components/en/flow-data";
import { printExact } from "./artifact";
import { wonPhrase } from "./format";

type Locale = "ko" | "en";

function Claim({
  label,
  value,
  sub,
  emphasis,
}: {
  label: string;
  value: string;
  sub?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="min-w-0">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65">{label}</dt>
      <dd
        className={
          emphasis
            ? "type-data mt-1.5 whitespace-nowrap text-[30px] font-semibold leading-[0.95] text-signal sm:text-[44px] lg:text-[48px]"
            : "type-data mt-1.5 whitespace-nowrap text-[24px] font-semibold leading-[0.95] text-ink sm:text-[30px]"
        }
      >
        {value}
      </dd>
      {sub ? <dd className="mt-1 text-[11px] leading-snug text-ink/60">{sub}</dd> : null}
    </div>
  );
}

/**
 * v6 cover: a credit memo on paper, not a chrome object.
 * The decision, limit and APR are readable in the first viewport; the seal is
 * the only decorative element. Every figure comes from the engine result.
 */
export function PassportCover({
  result,
  profile,
  locale = "ko",
}: {
  result: UnderwritingResult;
  profile: Profile;
  locale?: Locale;
}) {
  const en = locale === "en";
  const limitLabel =
    result.decision === "declined" || result.limitKrw <= 0
      ? en
        ? "Not approved"
        : "미승인"
      : en
        ? krwEn(result.limitKrw)
        : `${krwCompact(result.limitKrw)}원`;
  const decisionLabel = en ? DECISION_LABEL_EN[result.decision] : DECISION_LABEL[result.decision];
  const typeLabel = en ? TYPE_LABEL_EN[result.type] : TYPE_LABEL[result.type];
  const issued = en ? dateEn(result.issuedAt) : dateKo(result.issuedAt);
  const maturity = en ? dateEn(result.funding.maturityDate) : dateKo(result.funding.maturityDate);
  const verifiedCount = result.evidence.filter((item) => item.verified).length;
  const rationale = `${result.decisionNote.split(". ")[0].trim().replace(/\.$/, "")}.`;
  const limitExact = en ? krwFullEn(result.limitKrw) : `${wonPhrase(result.limitKrw)} · ${krw(result.limitKrw)}`;
  const coverage = en ? pctF(result.evidenceCoverage * 100) : pct(result.evidenceCoverage * 100);

  return (
    <section
      aria-label={en ? "Credit Passport cover" : "신용 여권 표지"}
      style={printExact}
      className="relative bg-paper text-ink"
    >
      <div className="px-5 pb-6 pt-5 sm:px-7 sm:pt-6">
        {/* masthead — ≤120px tall */}
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/65">
              <span className="text-ink">RAIL Credit Engine · Seoul</span>
              <span aria-hidden className="h-px w-5 bg-ink/25" />
              <span>{result.passportId}</span>
              <span aria-hidden className="h-px w-5 bg-ink/25" />
              <span>Issued {issued}</span>
            </div>

            <h1 className="mt-3 font-serif-display text-[40px] leading-[0.95] tracking-[-0.02em] text-ink sm:text-[46px]">
              Credit Passport
            </h1>
            <p className="mt-2 text-[18px] font-bold leading-tight tracking-[-0.01em] text-ink">
              {result.applicantName}
              <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[0.12em] text-ink/60">
                {typeLabel}
              </span>
            </p>
            <p className="mt-1 text-[12px] leading-snug text-ink/70">
              {result.company} · {profile.location}
            </p>
          </div>

          {/* vermilion seal — the only decorative element */}
          <div
            aria-hidden
            className="relative mr-1 mt-1 flex h-[92px] w-[92px] shrink-0 flex-col items-center justify-center border-2 border-signal text-signal"
          >
            <span className="absolute inset-[5px] border border-signal/50" aria-hidden />
            <span className="px-2 text-center font-mono text-[11px] font-semibold uppercase leading-tight tracking-[0.1em]">
              {decisionLabel}
            </span>
            <span className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-signal/80">
              RAIL
            </span>
          </div>
        </div>

        {/* decision chip + score context */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <span
            className={
              result.decision === "approved"
                ? "inline-flex items-center border border-ink/30 bg-ink px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper"
                : "inline-flex items-center border border-signal/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-signal"
            }
          >
            {decisionLabel}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/70">
            {en
              ? `Score ${result.score.toFixed(1)} · Grade ${result.grade}`
              : `점수 ${result.score.toFixed(1)} · 등급 ${result.grade}`}
          </span>
        </div>

        {/* four decision numbers */}
        <dl className="mt-3 grid grid-cols-2 gap-x-5 gap-y-5 border-y border-ink/20 py-5 sm:grid-cols-4">
          <Claim
            label={en ? "Approved limit" : "승인 한도"}
            value={limitLabel}
            sub={limitExact}
            emphasis
          />
          <Claim
            label={en ? "APR" : "적용 금리 · APR"}
            value={pct(result.apr, 2)}
            sub={
              en
                ? `Benchmark ${pct(result.benchmarkApr, 2)} + spread ${result.spreadPct.toFixed(2)}pp`
                : `기준 ${pct(result.benchmarkApr, 2)} + 스프레드 ${result.spreadPct.toFixed(2)}%p`
            }
          />
          <Claim
            label={en ? "Tenor" : "기간"}
            value={en ? `${result.tenorDays} days` : `${result.tenorDays}일`}
            sub={en ? `Matures ${maturity}` : `만기 ${maturity}`}
          />
          <Claim
            label={en ? "Evidence coverage" : "증거 커버리지"}
            value={coverage}
            sub={
              en
                ? `Verified ${verifiedCount} / ${result.evidence.length} items`
                : `검증 ${verifiedCount} / ${result.evidence.length}건`
            }
          />
        </dl>

        {/* one-line rationale + the bank's rejection */}
        <div className="mt-4 grid gap-4 md:grid-cols-[1.15fr_1fr] md:gap-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65">
              {en ? "Why this decision" : "판정 근거"}
            </p>
            <p className="mt-1.5 text-[14px] leading-[1.65] text-ink/85">{rationale}</p>
          </div>
          <div className="border-l-0 border-ink/15 md:border-l md:pl-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65">
              {en ? "Bank result" : "은행 결과"}
            </p>
            <p className="mt-1.5 text-[12px] leading-[1.65] text-ink/70">{profile.bankOutcome}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-ink/15 pt-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">
            {en
              ? "Rule-engine output · same input, same result"
              : "규칙 엔진 산출 · 같은 입력, 같은 결과"}
          </p>
          <p className="font-mono text-[10px] tracking-[0.08em] text-ink/55">
            {result.funding.receivableId} · {result.funding.chain}
          </p>
        </div>
      </div>
    </section>
  );
}
