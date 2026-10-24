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

const DECISION_STYLE: Record<UnderwritingResult["decision"], string> = {
  approved: "bg-graphite text-white",
  conditional: "bg-vermilion-soft text-vermilion",
  declined: "bg-vermilion-soft text-vermilion",
};

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
      <dt className="text-[13px] leading-snug text-graphite-3">{label}</dt>
      <dd
        className={
          emphasis
            ? "mt-1.5 whitespace-nowrap text-[30px] font-semibold leading-[0.95] tracking-[-0.03em] tabular-nums text-vermilion sm:text-[44px]"
            : "mt-1.5 whitespace-nowrap text-[24px] font-semibold leading-[0.95] tracking-[-0.02em] tabular-nums text-graphite sm:text-[30px]"
        }
      >
        {value}
      </dd>
      {sub ? <dd className="mt-1 text-[12.5px] leading-snug text-graphite-3">{sub}</dd> : null}
    </div>
  );
}

/**
 * v7 cover: the decision memo at the top of a white A4 document.
 * No chrome, stamps, seals or rotation — the numbers carry the page.
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
  const declined = result.decision === "declined";
  const limitLabel = declined
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
  const limitExact = declined
    ? en
      ? "Limit 0 · no facility"
      : "한도 0원 · 시설 없음"
    : en
      ? krwFullEn(result.limitKrw)
      : `${wonPhrase(result.limitKrw)} · ${krw(result.limitKrw)}`;
  const coverage = en ? pctF(result.evidenceCoverage * 100) : pct(result.evidenceCoverage * 100);
  const declineFlag = declined
    ? (result.flags.find((flag) => flag.code.startsWith("E-")) ?? result.flags[0])
    : undefined;

  return (
    <section
      aria-label={en ? "Credit Passport summary" : "신용 여권 요약"}
      style={printExact}
      className="bg-surface px-6 pb-7 pt-7 sm:px-10 sm:pt-8"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-[13px] font-medium text-graphite-3">
          {en ? "Credit Passport" : "신용 여권"}
        </p>
        <p className="font-mono text-[12.5px] tabular-nums text-graphite-3">
          {result.passportId} · {issued}
        </p>
      </div>

      <h1 className="mt-3 text-[30px] font-semibold leading-[1.12] tracking-[-0.02em] text-graphite sm:text-[36px]">
        {result.company}
      </h1>
      <p className="mt-1.5 text-[14.5px] leading-relaxed text-graphite-2">
        {result.applicantName} · {typeLabel} · {profile.location}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-[12.5px] font-medium ${DECISION_STYLE[result.decision]}`}
        >
          {decisionLabel}
        </span>
        <span className="text-[13px] text-graphite-2">
          {en
            ? `Score ${result.score.toFixed(1)} · Grade ${result.grade}`
            : `점수 ${result.score.toFixed(1)} · 등급 ${result.grade}`}
        </span>
        {declineFlag ? (
          <span className="font-mono text-[12.5px] tabular-nums text-vermilion">
            {declineFlag.code}
          </span>
        ) : null}
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-hairline py-5 sm:grid-cols-4">
        <Claim
          label={en ? "Approved limit" : "승인 한도"}
          value={limitLabel}
          sub={limitExact}
          emphasis
        />
        <Claim
          label={en ? "APR" : "적용 금리 · APR"}
          value={declined ? "—" : pct(result.apr, 2)}
          sub={
            declined
              ? en
                ? "No rate on a declined file"
                : "미승인 — 금리 없음"
              : en
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

      <div className="mt-4 grid gap-4 md:grid-cols-[1.15fr_1fr] md:gap-8">
        <div>
          <p className="text-[13px] text-graphite-3">
            {declined
              ? en
                ? "Why it was declined"
                : "미승인 사유"
              : en
                ? "Why this decision"
                : "판정 근거"}
          </p>
          <p className="mt-1.5 text-[15.5px] leading-[1.65] text-graphite-2">{rationale}</p>
          {declineFlag ? (
            <p className="mt-2 text-[13px] leading-relaxed text-graphite-3">
              {declineFlag.label}
            </p>
          ) : null}
        </div>
        <div className="md:border-l md:border-hairline md:pl-6">
          <p className="text-[13px] text-graphite-3">{en ? "Bank result" : "은행 결과"}</p>
          <p className="mt-1.5 text-[13px] leading-[1.65] text-graphite-2">{profile.bankOutcome}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-hairline pt-3">
        <p className="text-[12.5px] text-graphite-3">
          {en
            ? "Computed by the rule engine · same input, same passport"
            : "규칙 엔진 산출 · 같은 입력, 같은 여권"}
        </p>
        <p className="font-mono text-[12px] tabular-nums text-graphite-3">
          {result.funding.receivableId} · {result.funding.chain}
        </p>
      </div>
    </section>
  );
}
