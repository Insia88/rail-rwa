import type { UnderwritingResult } from "@/lib/types";
import { dateKrLong, krw, krwCompact, pct } from "@/lib/format";
import { cn } from "@/lib/cn";
import { dateEn, krwEn, krwFullEn, ppEn } from "@/components/en/flow-data";

type Locale = "ko" | "en";

const round2 = (value: number) => Math.round(value * 100) / 100;

function pctPoint(value: number, locale: Locale): string {
  return locale === "en" ? ppEn(round2(value)) : `${round2(value).toFixed(2)}%p`;
}

function RateRow({ label, note, value }: { label: string; note?: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-2.5 last:border-b-0">
      <dt className="text-[14px] leading-snug text-graphite-2">
        {label}
        {note ? <span className="mt-0.5 block text-[12.5px] text-graphite-3">{note}</span> : null}
      </dt>
      <dd className="shrink-0 font-mono text-[14px] font-medium tabular-nums text-graphite">
        {value}
      </dd>
    </div>
  );
}

function SettleRow({
  label,
  note,
  value,
  deduction,
}: {
  label: string;
  note?: string;
  value: string;
  deduction?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-hairline py-2 last:border-b-0">
      <dt className="text-[14px] leading-snug text-graphite-2">
        {label}
        {note ? <span className="mt-0.5 block text-[12.5px] text-graphite-3">{note}</span> : null}
      </dt>
      <dd
        className={cn(
          "shrink-0 font-mono text-[14px] tabular-nums",
          deduction ? "text-vermilion" : "text-graphite",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export function PricingBreakdown({
  result,
  locale = "ko",
}: {
  result: UnderwritingResult;
  locale?: Locale;
}) {
  const en = locale === "en";
  const declined = result.decision === "declined";
  const premium = round2(result.apr - result.benchmarkApr - result.spreadPct);
  const feeRate =
    result.faceValueKrw > 0
      ? `${((result.feeKrw / result.faceValueKrw) * 100).toFixed(1)}%`
      : "—";
  const formatDate = en ? dateEn : dateKrLong;
  const full = en ? krwFullEn : krw;
  const compact = en ? krwEn : krwCompact;

  return (
    <div className="grid gap-7 lg:grid-cols-[1.05fr_1fr] lg:gap-9">
      <div>
        <p className="text-[13px] font-medium text-graphite-3">
          {en ? "Rate build-up" : "금리 구성"}
        </p>
        <dl className="mt-3">
          <RateRow
            label={result.benchmarkLabel}
            note={en ? "Market benchmark" : "시장 기준금리"}
            value={`+ ${pct(result.benchmarkApr, 2)}`}
          />
          <RateRow
            label={en ? `Grade ${result.grade} spread` : `신용등급 ${result.grade} 스프레드`}
            note={en ? "Score and grade matrix" : "점수 · 등급 매트릭스"}
            value={`+ ${pctPoint(result.spreadPct, locale)}`}
          />
          <RateRow
            label={en ? "Tenor and FX premium" : "기간 · 환율 프리미엄"}
            note={
              en
                ? `${result.tenorDays}-day tenor · currency exposure`
                : `${result.tenorDays}일 만기 · 통화 익스포저`
            }
            value={`+ ${pctPoint(premium, locale)}`}
          />
        </dl>

        <div className="mt-4 flex items-end justify-between gap-4 border-y border-hairline-2 py-3">
          <div>
            <p className="text-[13px] text-graphite-3">
              {declined ? (en ? "Applied APR · none" : "적용 금리 · 없음") : en ? "Applied APR" : "적용 금리"}
            </p>
            <p className="mt-0.5 text-[12.5px] text-graphite-3">
              {declined
                ? en
                  ? "No facility on a declined file"
                  : "미승인 — 시설 없음"
                : en
                  ? "used as the discount rate"
                  : "할인율로 사용"}
            </p>
          </div>
          <p
            className={cn(
              "text-[26px] font-semibold leading-none tracking-[-0.02em] tabular-nums",
              declined ? "text-graphite-3" : "text-vermilion",
            )}
          >
            {declined ? "—" : pct(result.apr, 2)}
          </p>
        </div>

        <p className="mt-3 text-[12.5px] leading-relaxed text-graphite-3">
          {en
            ? "Interest is discounted up front at the APR over the remaining days, then the balance is paid out."
            : "할인율(=APR) × 잔여일수로 이자를 선차감한 뒤 대금을 지급합니다."}
        </p>
      </div>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[13px] font-medium text-graphite-3">
            {en ? "Settlement" : "정산"}
          </p>
          <p className="text-[12.5px] tabular-nums text-graphite-3">
            {en
              ? `${result.tenorDays} days · matures ${formatDate(result.funding.maturityDate)}`
              : `${result.tenorDays}일 · ${formatDate(result.funding.maturityDate)} 만기`}
          </p>
        </div>
        <dl className="mt-3">
          <SettleRow
            label={en ? "Receivable face value" : "수출채권 명목가"}
            value={full(result.faceValueKrw)}
          />
          <SettleRow
            label={en ? "Prepaid interest · discount" : "선취 이자 · 할인"}
            note={`${pct(result.apr, 2)} × ${result.tenorDays}/365`}
            value={`- ${full(result.discountKrw)}`}
            deduction
          />
          <SettleRow
            label={en ? "Issuance and brokerage fee" : "발행 · 중개 수수료"}
            note={en ? `${feeRate} of face value` : `명목가의 ${feeRate}`}
            value={`- ${full(result.feeKrw)}`}
            deduction
          />
        </dl>

        <div className="mt-2 flex items-end justify-between gap-4 border-y border-hairline-2 py-3">
          <div>
            <p className="text-[13px] text-graphite-3">{en ? "Net proceeds" : "실지급액"}</p>
            <p className="mt-0.5 text-[12.5px] text-graphite-3">
              {en ? "Net proceeds to borrower" : "차입자 실지급액"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[22px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-graphite">
              {full(result.netProceedsKrw)}
            </p>
            <p className="mt-1 font-mono text-[12px] tabular-nums text-graphite-3">
              ≈ {compact(result.netProceedsKrw)}
            </p>
          </div>
        </div>

        <p className="mt-3 break-words text-[12.5px] leading-relaxed tabular-nums text-graphite-3">
          {en
            ? `Matures ${formatDate(result.funding.maturityDate)} · investor yield ${pct(result.funding.investorYield, 2)} · discount rate ${pct(result.funding.discountRate, 2)}`
            : `만기 정산 ${formatDate(result.funding.maturityDate)} · 투자자 수익률 ${pct(result.funding.investorYield, 2)} · 할인율 ${pct(result.funding.discountRate, 2)}`}
        </p>
      </div>
    </div>
  );
}
