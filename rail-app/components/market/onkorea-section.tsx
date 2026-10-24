import type { MarketSnapshot } from "@/lib/types";
import { Reveal } from "@/components/ui/motion";
import { dateKo } from "@/lib/format";
import { cn } from "@/lib/cn";
import { SectionHead } from "@/components/landing/section-head";

function formatPx(value: number): string {
  return value.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
}

function fundingLabel(funding: number): string {
  if (funding === 0) return "—";
  return `${funding > 0 ? "+" : ""}${(funding * 100).toFixed(4)}%`;
}

/** Required §8 section: Korean equity/index exposure that trades 24/7 on-chain (perps). */
export function OnKoreaSection({ market }: { market: MarketSnapshot }) {
  const onkorea = market.onkorea;
  const live = onkorea.status === "live";

  return (
    <section className="border-b border-line-dark bg-noir">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            index="01"
            kicker="24/7 Onchain Korea"
            title="가격은 국경을 넘고, 시장은 건물을 떠난다."
            sub="코스피200·현대차·SK하이닉스가 같은 블록에서 24시간 가격을 만듭니다."
          />

          <Reveal delay={0.08} className="shrink-0 lg:text-right">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 border px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.14em]",
                live ? "border-acid/30 bg-acid/10 text-acid" : "border-line-dark text-cream/40",
              )}
            >
              <span
                aria-hidden
                className={cn("h-1 w-1 rounded-full", live ? "bg-acid" : "bg-cream/40")}
              />
              {live ? "Live" : "Fallback"}
            </span>
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
              xyz DEX · 24H Volume
            </p>
            <p className="type-data mt-2 text-[clamp(2rem,3.2vw,2.6rem)] font-medium leading-none text-cream">
              {"$"}
              {(onkorea.dayVolumeUsd / 1e9).toFixed(2)}
              <span className="ml-1 inline-block align-baseline font-mono text-[0.42em] font-normal tracking-[0.02em] text-cream/45">
                B
              </span>
            </p>
            <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-cream/30">
              {dateKo(onkorea.asOf)}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 border-t border-line-dark">
          <div className="hidden grid-cols-[1.5fr_repeat(4,1fr)] border-b border-line-dark py-3 sm:grid">
            {["Market", "Mark", "Oracle", "Funding (1H)", "24H Vol"].map((label, i) => (
              <span
                key={label}
                className={cn(
                  "font-mono text-[9px] uppercase tracking-[0.16em] text-cream/30",
                  i > 0 && "text-right",
                )}
              >
                {label}
              </span>
            ))}
          </div>

          {onkorea.markets.map((row) => {
            const positive = row.funding > 0;
            const negative = row.funding < 0;
            return (
              <div
                key={row.coin}
                className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-line-dark py-4 transition-colors duration-200 hover:bg-noir-2/60 sm:grid-cols-[1.5fr_repeat(4,1fr)] sm:items-baseline sm:gap-0"
              >
                <div className="col-span-2 sm:col-span-1">
                  <p className="text-[15px] font-bold tracking-[-0.01em] text-cream">{row.label}</p>
                  <p className="mt-0.5 font-mono text-[9px] tracking-[0.04em] text-cream/30">
                    {row.coin}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream/30 sm:hidden">
                    Mark
                  </p>
                  <p className="type-data text-[20px] leading-none text-cream">
                    {formatPx(row.markPx)}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream/30 sm:hidden">
                    Oracle
                  </p>
                  <p className="type-data text-[13px] text-cream/40">{formatPx(row.oraclePx)}</p>
                </div>
                <div className="sm:text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream/30 sm:hidden">
                    Funding 1H
                  </p>
                  <p
                    className={cn(
                      "type-data text-[13px]",
                      positive && "text-cream/70",
                      negative && "text-signal",
                      row.funding === 0 && "text-cream/30",
                    )}
                  >
                    {fundingLabel(row.funding)}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream/30 sm:hidden">
                    24H Vol
                  </p>
                  <p className="type-data text-[13px] text-cream/50">
                    {`$${(row.dayVolumeUsd / 1e6).toFixed(1)}M`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-4 font-mono text-[9px] leading-relaxed tracking-[0.06em] text-cream/30">
          {"Hyperliquid HIP-3 'xyz' DEX · 파생상품(perp) 시세이며 현물 주식이 아닙니다."}
        </p>
      </div>
    </section>
  );
}
