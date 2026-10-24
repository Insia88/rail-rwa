import type { EvidenceItem } from "@/lib/types";
import { dateKo, krwCompact, pct } from "@/lib/format";
import { cn } from "@/lib/cn";
import { dateEn, krwEn } from "@/components/en/flow-data";
import { ProvenanceChip } from "./ui";

type Locale = "ko" | "en";

function TrustBar({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-14 shrink-0 overflow-hidden rounded-full bg-hairline">
        <div
          className="h-full rounded-full bg-graphite"
          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
        />
      </div>
      <span className="font-mono text-[13px] tabular-nums text-graphite-2">{score}</span>
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
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-graphite-3">
          <span>
            {en ? "Total" : "전체"} <span className="font-medium text-graphite">{evidence.length}</span>
            {en ? " items" : "건"}
          </span>
          <span>
            {en ? "Verified" : "검증"} <span className="font-medium text-graphite">{verified}</span>
            {en ? "" : "건"}
          </span>
          <span>
            {en ? "Unverified" : "미검증"}{" "}
            <span className="font-medium text-vermilion">{unverified}</span>
            {en ? "" : "건"}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[13px] text-graphite-3">{en ? "Coverage" : "커버리지"}</span>
          <span className="text-[22px] font-semibold leading-none tabular-nums text-graphite">
            {pct(coverage * 100)}
          </span>
        </div>
      </div>

      <div className="mt-4 hidden grid-cols-[minmax(0,2.6fr)_minmax(0,1.5fr)_6.5rem_6rem_8rem] gap-4 border-b border-hairline-2 pb-2 text-[12.5px] text-graphite-3 md:grid">
        <span>{en ? "Evidence" : "증거"}</span>
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
              "grid grid-cols-1 gap-2 border-b border-hairline py-3.5 md:grid-cols-[minmax(0,2.6fr)_minmax(0,1.5fr)_6.5rem_6rem_8rem] md:items-start md:gap-4",
              !item.verified && "bg-vermilion-soft/40",
            )}
          >
            <div className="min-w-0">
              <div className="flex items-start gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full",
                    item.verified ? "bg-graphite" : "bg-vermilion",
                  )}
                />
                <p className="text-[15px] font-medium leading-[1.45] text-graphite">
                  {item.label}
                </p>
              </div>
              <p className="mt-1 pl-4 text-[14px] leading-[1.6] text-graphite-2">{item.detail}</p>
              <p className="mt-1.5 pl-4 font-mono text-[12px] tabular-nums text-graphite-3">
                {item.id}
                {typeof item.valueKrw === "number" ? ` · ${formatAmount(item.valueKrw)}` : ""}
                {typeof item.coverageMonths === "number"
                  ? en
                    ? ` · ${item.coverageMonths} months`
                    : ` · ${item.coverageMonths}개월`
                  : ""}
              </p>
            </div>

            <div className="min-w-0 pl-4 md:pl-0">
              <p className="text-[12.5px] text-graphite-3 md:hidden">{en ? "Source" : "출처"}</p>
              <p className="mt-0.5 text-[14px] leading-[1.55] text-graphite-2 md:mt-0">
                {item.source}
              </p>
            </div>

            <div className="pl-4 md:pl-0">
              <p className="text-[12.5px] text-graphite-3 md:hidden">{en ? "Type" : "유형"}</p>
              <div className="mt-1 md:mt-0">
                <ProvenanceChip provenance={item.provenance} variant="light" locale={locale} />
              </div>
              {!item.verified ? (
                <p className="mt-1.5 text-[12.5px] font-medium text-vermilion">
                  {en ? "Unverified" : "미검증"}
                </p>
              ) : null}
            </div>

            <div className="pl-4 md:pl-0">
              <p className="text-[12.5px] text-graphite-3 md:hidden">
                {en ? "Observed" : "관측일"}
              </p>
              <p className="mt-0.5 text-[13px] tabular-nums text-graphite-2 md:mt-0">
                {formatDate(item.observedAt)}
              </p>
            </div>

            <div className="pl-4 md:pl-0">
              <p className="text-[12.5px] text-graphite-3 md:hidden">{en ? "Trust" : "신뢰도"}</p>
              <div className="mt-1 md:mt-0">
                <TrustBar score={item.trust} />
              </div>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-[12.5px] leading-relaxed text-graphite-3">
        {en
          ? "Unverified items are not counted in the credit decision. Trust is cross-verification completeness, 0–100."
          : "미검증 항목은 신용 결정에 직접 반영하지 않습니다. 신뢰도는 교차검증 완성도(0–100)입니다."}
      </p>
    </div>
  );
}
