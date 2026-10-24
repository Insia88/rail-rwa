import type { UnderwritingResult } from "@/lib/types";
import { dateKrLong, krw, krwCompact, pct } from "@/lib/format";
import { cn } from "@/lib/cn";
import { dateEn, krwEn, krwFullEn } from "@/components/en/flow-data";

type Locale = "ko" | "en";

function CertField({
  label,
  value,
  sub,
  className,
}: {
  label: string;
  value: string;
  sub?: string;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-[12.5px] leading-snug text-graphite-3">{label}</dt>
      <dd className="mt-1 break-words text-[14.5px] font-medium leading-snug tabular-nums text-graphite">
        {value}
      </dd>
      {sub ? (
        <dd className="mt-0.5 break-words text-[12.5px] leading-relaxed text-graphite-3">
          {sub}
        </dd>
      ) : null}
    </div>
  );
}

/** The tokenized receivable, as a quiet white instrument card. */
export function RwaCertificate({
  result,
  locale = "ko",
}: {
  result: UnderwritingResult;
  locale?: Locale;
}) {
  const en = locale === "en";
  const declined = result.decision === "declined";
  const { funding } = result;
  const funded = Math.max(0, Math.min(100, funding.fundedPct));
  const issued = !declined && funding.faceValueKrw > 0;
  const formatDate = en ? dateEn : dateKrLong;
  const compact = en ? krwEn : krwCompact;
  const full = en ? krwFullEn : krw;

  return (
    <div className="rounded-[16px] border border-hairline bg-porcelain/50 p-5">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-hairline pb-4">
        <div>
          <p className="text-[13px] text-graphite-3">{en ? "RWA certificate" : "RWA 증서"}</p>
          <p className="mt-1.5 font-mono text-[15px] font-medium tabular-nums text-graphite">
            {funding.receivableId}
          </p>
          <p className="mt-1 text-[13px] text-graphite-2">
            {en ? `Pool · ${funding.pool}` : funding.pool}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[13px] text-graphite-3">
            {en ? "Funded · simulated" : "펀딩 · 시뮬레이션"}
          </p>
          <p
            className={cn(
              "mt-1 text-[24px] font-semibold leading-none tracking-[-0.02em] tabular-nums",
              issued ? "text-vermilion" : "text-graphite-3",
            )}
          >
            {pct(funded, 0)}
          </p>
          <p className="mt-1 text-[12.5px] text-graphite-3">
            {funding.investors.length} {en ? "LP" : "LP"} · {funding.chain}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="h-1 w-full overflow-hidden rounded-full bg-hairline">
          <div
            className={cn("h-full rounded-full", issued ? "bg-vermilion" : "bg-graphite-3/40")}
            style={{ width: `${funded}%` }}
          />
        </div>
        <p className="mt-2 text-[12.5px] text-graphite-3">
          {issued
            ? en
              ? `Face value ${compact(funding.faceValueKrw)} · matched with ${funding.investors.length} LPs`
              : `명목가 ${compact(funding.faceValueKrw)} · ${funding.investors.length}개 LP와 매칭`
            : declined
              ? en
                ? "No facility issued — the receivable cannot be registered in a pool."
                : "미승인 — 수출채권을 유동성 풀에 등록하지 않습니다."
              : en
                ? "Liquidity-pool matching after approval"
                : "승인 후 유동성 풀 매칭 예정"}
        </p>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-hairline pt-4 sm:grid-cols-4">
        <CertField
          label={en ? "Face value" : "명목가"}
          value={
            funding.faceValueKrw > 0
              ? compact(funding.faceValueKrw)
              : en
                ? "Not issued"
                : "미발행"
          }
          sub={funding.faceValueKrw > 0 ? full(funding.faceValueKrw) : undefined}
        />
        <CertField
          label={en ? "Maturity" : "만기"}
          value={formatDate(funding.maturityDate)}
          sub={
            en
              ? `${result.tenorDays} days · ${funding.discountRate.toFixed(2)}% discount`
              : `${result.tenorDays}일 · 할인율 ${funding.discountRate.toFixed(2)}%`
          }
        />
        <CertField
          label={en ? "Investor yield" : "투자자 수익률"}
          value={pct(funding.investorYield, 2)}
          sub={
            en
              ? `Discount ${pct(funding.discountRate, 2)} + ${(funding.investorYield - funding.discountRate).toFixed(2)}pp`
              : `할인율 ${pct(funding.discountRate, 2)} + ${(funding.investorYield - funding.discountRate).toFixed(2)}%p`
          }
        />
        <CertField
          label={en ? "Chain" : "체인"}
          value={funding.chain}
          sub={en ? "USDC settlement · on-chain record" : "USDC 정산 · 온체인 기록"}
        />
        <CertField
          label={en ? "Token standard" : "토큰 표준"}
          value={funding.tokenStandard}
          sub={en ? "permissioned · transfer-restricted" : "permissioned · 전송 제한"}
          className="col-span-2"
        />
        <CertField
          label={en ? "Escrow" : "에스크로"}
          value={funding.escrow}
          sub={en ? "Settlement-wallet whitelist" : "정산 지갑 화이트리스트"}
          className="col-span-2"
        />
      </dl>

      <div className="mt-5 border-t border-hairline pt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[13px] text-graphite-3">
            {en ? "Investors · liquidity providers" : "유동성 공급자"}
          </p>
          <p className="text-[12.5px] text-graphite-3">
            {funding.chain} · {en ? "held in escrow" : "에스크로 보관"}
          </p>
        </div>
        {funding.investors.length > 0 ? (
          <ul className="mt-2">
            {funding.investors.map((investor) => (
              <li
                key={investor.alias}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-hairline py-2 last:border-b-0"
              >
                <span className="text-[13.5px] font-medium text-graphite-2">{investor.alias}</span>
                <span className="min-w-0 truncate text-[13.5px] text-graphite-2">
                  {investor.type} · {investor.region}
                </span>
                <span className="font-mono text-[13px] tabular-nums text-graphite">
                  {compact(investor.amountKrw)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 rounded-[12px] border border-dashed border-hairline-2 px-3 py-3 text-[13px] leading-relaxed text-graphite-3">
            {declined
              ? en
                ? "Not registered in a liquidity pool."
                : "유동성 풀에 등록되지 않았습니다."
              : issued
                ? en
                  ? "LP raise pending — matched to stablecoin liquidity after pool registration."
                  : "LP 모집 예정 — 풀 등록 후 스테이블코인 유동성과 매칭됩니다."
                : en
                  ? "Not approved, so not registered in a liquidity pool."
                  : "미승인 상태로 유동성 풀에 등록되지 않았습니다."}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-hairline pt-3">
        <p className="text-[12.5px] text-graphite-3">
          {funding.chain} · {funding.tokenStandard}
        </p>
        <p className="ml-auto text-[12.5px] text-graphite-3">
          {en ? "On-chain issuance record" : "온체인 발행 기록"}
        </p>
      </div>
    </div>
  );
}
