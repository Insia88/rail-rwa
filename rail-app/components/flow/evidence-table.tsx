import type { EvidenceItem } from "@/lib/types";
import { dateKo, krwCompact, pct } from "@/lib/format";
import { ScoreBar } from "@/components/ui/bars";
import { cn } from "@/lib/cn";
import { dateEn, krwEn } from "@/components/en/flow-data";
import { ProvenanceChip } from "./ui";

type Locale = "ko" | "en";

function TrustCell({ evidence }: { evidence: EvidenceItem }) {
  return (
    <div className="flex items-center gap-2">
      <ScoreBar
        score={evidence.trust}
        max={100}
        tone={evidence.trust >= 78 ? "ink" : "signal"}
        className="w-14 shrink-0"
      />
      <span className="font-mono text-[14px] font-semibold tnum text-ink">{evidence.trust}</span>
    </div>
  );
}

export function EvidenceTable({
  evidence,
  coverage,
  locale = "ko",
}: {
  evidence: EvidenceItem[];
  coverage: number;
  locale?: Locale;
}) {
  const en = locale === "en";
  const verified = evidence.filter((item) => item.verified).length;
  const unverified = evidence.length - verified;
  const formatDate = en ? dateEn : dateKo;
  const formatAmount = en ? krwEn : krwCompact;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/70">
          <span>
            {en ? "Total" : "총"}{" "}
            <span className="text-[14px] font-semibold text-ink">{evidence.length}</span>
            {en ? " items" : "건"}
          </span>
          <span>
            {en ? "Verified" : "검증"}{" "}
            <span className="text-[14px] font-semibold text-ink">{verified}</span>
            {en ? "" : "건"}
          </span>
          <span>
            {en ? "Unverified" : "미검증"}{" "}
            <span className="text-[14px] font-semibold text-signal">{unverified}</span>
            {en ? "" : "건"}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/70">
            Coverage
          </span>
          <span className="type-data text-[30px] font-semibold leading-none text-signal">
            {pct(coverage * 100)}
          </span>
        </div>
      </div>

      <div className="mt-4 hidden grid-cols-[minmax(0,2.5fr)_minmax(0,1.5fr)_6.5rem_5.5rem_8rem] gap-4 border-b border-ink/70 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/70 md:grid">
        <span>{en ? "Evidence / detail" : "증거 / 상세"}</span>
        <span>{en ? "Source" : "출처"}</span>
        <span>{en ? "Type" : "유형"}</span>
        <span>{en ? "Observed" : "관측일"}</span>
        <span>{en ? "Trust" : "신뢰도"}</span>
      </div>

      <ul>
        {evidence.map((item) => (
          <li
            key={item.id}
            className={cn(
              "grid grid-cols-1 gap-2.5 border-b border-ink/10 py-4 md:grid-cols-[minmax(0,2.5fr)_minmax(0,1.5fr)_6.5rem_5.5rem_8rem] md:items-start md:gap-4",
              !item.verified && "bg-signal/[0.04]",
            )}
          >
            <div className="min-w-0">
              <div className="flex items-start gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full",
                    item.verified ? "bg-ink" : "bg-signal",
                  )}
                />
                <p className="text-[14px] font-semibold leading-snug text-ink">{item.label}</p>
              </div>
              <p className="mt-1 pl-4 text-[12.5px] leading-relaxed text-ink/70">{item.detail}</p>
              <p className="mt-1.5 pl-4 font-mono text-[10px] uppercase tracking-[0.08em] text-ink/60">
                {item.id.toUpperCase()}
                {typeof item.valueKrw === "number" ? ` · ${formatAmount(item.valueKrw)}` : ""}
                {typeof item.coverageMonths === "number"
                  ? en
                    ? ` · ${item.coverageMonths} months`
                    : ` · ${item.coverageMonths}개월`
                  : ""}
              </p>
            </div>

            <div className="min-w-0 pl-4 md:pl-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 md:hidden">
                {en ? "Source" : "출처"}
              </p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-ink/75 md:mt-0">{item.source}</p>
            </div>

            <div className="pl-4 md:pl-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 md:hidden">
                {en ? "Type" : "유형"}
              </p>
              <div className="mt-1 md:mt-0">
                <ProvenanceChip provenance={item.provenance} variant="light" locale={locale} />
              </div>
              {!item.verified ? (
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-signal">
                  Unverified
                </p>
              ) : null}
            </div>

            <div className="pl-4 md:pl-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 md:hidden">
                {en ? "Observed" : "관측일"}
              </p>
              <p className="mt-0.5 font-mono text-[13px] tnum text-ink/75 md:mt-0">
                {formatDate(item.observedAt)}
              </p>
            </div>

            <div className="pl-4 md:pl-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 md:hidden">
                {en ? "Trust" : "신뢰도"}
              </p>
              <div className="mt-1 md:mt-0">
                <TrustCell evidence={item} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink/60">
        {en
          ? "Unverified items are not counted in the credit decision. Trust is cross-verification completeness, 0–100."
          : "미검증 항목은 신용 결정에 직접 반영하지 않습니다. 신뢰도는 교차검증 완성도(0–100)입니다."}
      </p>
    </div>
  );
}
