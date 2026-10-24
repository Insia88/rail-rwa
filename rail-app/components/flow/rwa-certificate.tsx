import type { UnderwritingResult } from "@/lib/types";
import { dateKrLong, krw, krwCompact, pct } from "@/lib/format";
import { ScoreBar } from "@/components/ui/bars";
import { cn } from "@/lib/cn";
import { dateEn, krwEn, krwFullEn } from "@/components/en/flow-data";
import { Stamp } from "./artifact";
import { BorderTrail } from "./border-trail";

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
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/65">{label}</dt>
      <dd className="mt-1 break-words font-mono text-[14px] leading-snug tnum text-ink">{value}</dd>
      {sub ? (
        <dd className="mt-0.5 break-words font-mono text-[11px] leading-relaxed text-ink/60">
          {sub}
        </dd>
      ) : null}
    </div>
  );
}

/** The tokenized receivable — an ink-ruled instrument plate inside the paper memo. */
export function RwaCertificate({
  result,
  locale = "ko",
}: {
  result: UnderwritingResult;
  locale?: Locale;
}) {
  const en = locale === "en";
  const { funding } = result;
  const funded = Math.max(0, Math.min(100, funding.fundedPct));
  const issued = result.decision !== "declined" && funding.faceValueKrw > 0;
  const formatDate = en ? dateEn : dateKrLong;
  const compact = en ? krwEn : krwCompact;
  const full = en ? krwFullEn : krw;

  return (
    <BorderTrail className="block" tone="signal">
      <div
        aria-label={en ? "Export receivable participation" : "수출채권 수익권"}
        className="relative border border-ink/30 bg-paper p-4 sm:p-5"
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-signal" />
        <div className="pt-1">
          {/* head */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink/15 pb-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                RWA Certificate
              </p>
              <p className="mt-1 text-[11px] tracking-[-0.005em] text-ink/65">
                {en ? "Export receivable participation" : "수출채권 수익권"}
              </p>
              <p className="mt-1.5 font-serif-display text-[26px] leading-none text-ink">
                {funding.receivableId}
              </p>
              <p className="mt-1.5 font-mono text-[11px] tracking-[0.04em] text-ink/65">
                {en ? `Pool · ${funding.pool}` : funding.pool}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65">
                {en ? "Funded · simulated" : "펀딩 · 시뮬레이션"}
              </p>
              <p className="type-data mt-1 text-[40px] font-semibold leading-[0.85] text-signal">
                {pct(funded, 0)}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60">
                {funding.investors.length} LP · {funding.chain}
              </p>
            </div>
          </div>

          {/* funded progress */}
          <div className="mt-3">
            <ScoreBar score={funded} max={100} tone="signal" track="paper" />
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/65">
              {issued
                ? en
                  ? `Face value ${compact(funding.faceValueKrw)} · matched with ${funding.investors.length} LPs`
                  : `명목가 ${compact(funding.faceValueKrw)} · ${funding.investors.length}개 LP와 매칭`
                : en
                  ? "Liquidity-pool matching after approval"
                  : "승인 후 유동성 풀 매칭 예정"}
            </p>
          </div>

          {/* instrument fields */}
          <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 border-t border-ink/15 pt-4 sm:grid-cols-4">
            <CertField
              label="Face value"
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
              label="Maturity"
              value={formatDate(funding.maturityDate)}
              sub={
                en
                  ? `${result.tenorDays} days · ${funding.discountRate.toFixed(2)}% discount rate`
                  : `${result.tenorDays}일 · ${funding.discountRate.toFixed(2)}% 할인율`
              }
            />
            <CertField
              label="Investor yield"
              value={pct(funding.investorYield, 2)}
              sub={
                en
                  ? `Discount rate ${pct(funding.discountRate, 2)} + ${(funding.investorYield - funding.discountRate).toFixed(2)}pp`
                  : `할인율 ${pct(funding.discountRate, 2)} + ${(funding.investorYield - funding.discountRate).toFixed(2)}%p`
              }
            />
            <CertField
              label="Chain"
              value={funding.chain}
              sub={en ? "USDC settlement · on-chain record" : "USDC 정산 · 온체인 기록"}
            />
            <CertField
              label="Token standard"
              value={funding.tokenStandard}
              sub={en ? "permissioned · transfer-restricted" : "permissioned · 전송 제한"}
              className="col-span-2"
            />
            <CertField
              label="Escrow"
              value={funding.escrow}
              sub={en ? "Settlement-wallet whitelist" : "정산 지갑 화이트리스트"}
              className="col-span-2"
            />
          </dl>

          {/* liquidity providers */}
          <div className="mt-5 border-t border-ink/15 pt-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65">
                {en ? "Investors · liquidity providers" : "유동성 공급자"}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/55">
                {funding.chain} · held in escrow
              </p>
            </div>
            {funding.investors.length > 0 ? (
              <ul className="mt-2">
                {funding.investors.map((investor) => (
                  <li
                    key={investor.alias}
                    className="grid grid-cols-[3.5rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-ink/10 py-2 last:border-b-0"
                  >
                    <span className="font-mono text-[11px] tracking-[0.1em] text-signal">
                      {investor.alias}
                    </span>
                    <span className="min-w-0 truncate text-[12.5px] text-ink/75">
                      {investor.type} · {investor.region}
                    </span>
                    <span className="font-mono text-[13px] tnum text-ink">
                      {compact(investor.amountKrw)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 border border-dashed border-ink/25 px-3 py-3 font-mono text-[11px] leading-relaxed text-ink/65">
                {issued
                  ? en
                    ? "LP raise pending — approved receivables are matched to stablecoin liquidity after pool registration."
                    : "LP 모집 예정 — 승인된 수출채권은 풀 등록 후 스테이블코인 유동성과 매칭됩니다."
                  : en
                    ? "Not approved, so not registered in a liquidity pool."
                    : "미승인 상태로 유동성 풀에 등록되지 않았습니다."}
              </p>
            )}
          </div>

          {/* footer */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink/15 pt-3">
            <Stamp label="RWA-READY" tone="signal" />
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60">
              {funding.chain} · {funding.tokenStandard}
            </p>
            <p className="ml-auto font-mono text-[10px] uppercase tracking-[0.12em] text-ink/55">
              {en ? "On-chain issuance record" : "온체인 발행 기록"}
            </p>
          </div>
        </div>
      </div>
    </BorderTrail>
  );
}
