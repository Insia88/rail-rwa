"use client";

import Link from "next/link";
import type { UnderwritingResult } from "@/lib/types";
import { Carousel } from "@/components/ui/carousel";
import { DECISION_LABEL, krwCompact, pct } from "@/lib/format";
import { ART } from "./art";

const TYPE_LABEL: Record<UnderwritingResult["type"], string> = {
  exporter: "수출 중소기업",
  freelancer: "프리랜서 · 1인 사업자",
  deeptech: "딥테크 · IP 보유",
};

/** Compact passport card used inside the applicant carousel (dark chrome surface). */
function ReelCard({ result }: { result: UnderwritingResult }) {
  return (
    <article
      aria-label={`${result.applicantName} 신용 여권 요약`}
      className="relative flex h-full min-h-[392px] w-full min-w-0 flex-col overflow-hidden border border-chrome-1/40 bg-noir text-cream"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${ART.passportChrome})` }}
      />
      <div aria-hidden className="absolute inset-0 bg-noir/85" />

      <div className="relative flex flex-1 flex-col">
        <div className="flex items-center justify-between gap-3 border-b border-line-dark px-5 py-3">
          <span className="font-serif-display text-base italic tracking-[-0.03em] text-cream/70">
            Republic of Rail
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-signal">
            Credit Passport
          </span>
        </div>

        <div className="px-5 pt-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
            {TYPE_LABEL[result.type]}
          </p>
          <div className="mt-1.5 flex items-start justify-between gap-3">
            <h3 className="truncate text-[26px] font-extrabold leading-tight tracking-[-0.015em] text-cream">
              {result.applicantName}
            </h3>
            <span className="shrink-0 border border-signal/70 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
              {result.grade}
            </span>
          </div>
          <p className="mt-1 truncate font-mono text-[9px] tracking-[0.04em] text-cream/35">
            {result.company} · {result.passportId}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 border-t border-line-dark">
          <div className="border-b border-r border-line-dark px-5 py-3.5">
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-cream/30">
              Credit score
            </p>
            <p className="type-data mt-1 text-[28px] font-medium leading-none text-cream">
              {result.score.toFixed(1)}
            </p>
          </div>
          <div className="border-b border-line-dark px-5 py-3.5">
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-cream/30">
              Decision
            </p>
            <p className="mt-2 font-mono text-[13px] font-medium tracking-[0.02em] text-cream">
              {DECISION_LABEL[result.decision]}
            </p>
          </div>
          <div className="border-r border-line-dark px-5 py-3.5">
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-cream/30">
              Approved limit
            </p>
            <p className="type-data mt-1 text-[16px] font-medium leading-none text-cream">
              {`${krwCompact(result.limitKrw)}원`}
            </p>
          </div>
          <div className="px-5 py-3.5">
            <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-cream/30">
              APR · {result.tenorDays}D
            </p>
            <p className="type-data mt-1 text-[16px] font-medium leading-none text-cream">
              {pct(result.apr, 2)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-line-dark px-5 py-3">
          <span className="inline-flex items-center gap-1.5 border border-acid/30 bg-acid/10 px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.14em] text-acid">
            <span aria-hidden className="h-1 w-1 rounded-full bg-acid" />
            Verified
          </span>
          <span className="inline-flex items-center gap-1.5 border border-signal/40 bg-signal/10 px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.14em] text-signal">
            Bank rejected
          </span>
        </div>

        <Link
          href={`/passport/${result.profileId}`}
          aria-label={`${result.applicantName} passport`}
          className="group mt-auto flex items-center justify-between border-t border-line-dark px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/55 transition-colors duration-200 hover:text-cream focus-visible:outline-none"
        >
          PASSPORT
          <span
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

/**
 * Three applicants, one rail. Spring track + drag swipe + auto-advance live in
 * the shared Carousel primitive; this component only composes data → cards.
 */
export function PassportReel({ results }: { results: UnderwritingResult[] }) {
  return (
    <Carousel
      items={results}
      ariaLabel="지원자 신용 여권"
      autoMs={5600}
      render={(result) => <ReelCard result={result} />}
    />
  );
}
