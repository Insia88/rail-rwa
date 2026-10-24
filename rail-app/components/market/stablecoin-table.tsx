import type { MarketSnapshot } from "@/lib/types";
import { Reveal } from "@/components/ui/motion";
import { ShareBar } from "@/components/ui/bars";
import { signedPct, usdCompact } from "@/lib/format";
import { cn } from "@/lib/cn";
import { SectionHead } from "@/components/landing/section-head";

export function StablecoinTable({ market }: { market: MarketSnapshot }) {
  const topShare = market.stablecoins.reduce((acc, c) => acc + c.sharePct, 0);

  return (
    <section className="border-b border-line-dark bg-noir">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHead
          index="02"
          kicker="Stablecoin Liquidity"
          title="유동성의 두께가 조달 비용을 정합니다."
          sub="상위 5개 스테이블코인의 시총과 30일 변동. 이 잔고가 수출채권 풀의 깊이를 결정합니다."
        />

        <Reveal delay={0.08}>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                상위 5개 스테이블코인의 시가총액, 전체 대비 점유율, 30일 변동률
              </caption>
              <thead>
                <tr className="border-y border-line-dark">
                  <th
                    scope="col"
                    className="py-3 pr-4 font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-cream/30"
                  >
                    Asset
                  </th>
                  <th
                    scope="col"
                    className="py-3 pr-4 text-right font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-cream/30"
                  >
                    Market cap
                  </th>
                  <th
                    scope="col"
                    className="hidden w-[32%] py-3 pl-6 pr-4 font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-cream/30 sm:table-cell"
                  >
                    Share
                  </th>
                  <th
                    scope="col"
                    className="py-3 text-right font-mono text-[9px] font-normal uppercase tracking-[0.16em] text-cream/30"
                  >
                    30D
                  </th>
                </tr>
              </thead>
              <tbody>
                {market.stablecoins.map((coin, i) => {
                  const change = coin.change30dPct;
                  return (
                    <tr
                      key={coin.symbol}
                      className="border-b border-line-dark transition-colors duration-200 hover:bg-noir-2/60"
                    >
                      <td className="py-4 pr-4">
                        <div className="flex items-baseline gap-2">
                          <span className="font-mono text-[13px] font-semibold tracking-[0.02em] text-cream">
                            {coin.symbol}
                          </span>
                          <span className="max-w-[130px] truncate text-[11px] text-cream/35 sm:max-w-none">
                            {coin.name}
                          </span>
                          <span className="font-mono text-[8px] text-cream/20">
                            {`0${i + 1}`}
                          </span>
                        </div>
                      </td>
                      <td className="type-data whitespace-nowrap py-4 pr-4 text-right text-[13px] text-cream">
                        {usdCompact(coin.mcapUsd)}
                      </td>
                      <td className="hidden py-4 pl-6 pr-4 sm:table-cell">
                        <div className="flex items-center gap-3">
                          <ShareBar
                            pct={coin.sharePct}
                            tone="cream"
                            track="dark"
                            className="max-w-[180px] flex-1"
                          />
                          <span className="type-data w-10 text-right text-[10px] text-cream/40">
                            {coin.sharePct.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td
                        className={cn(
                          "type-data whitespace-nowrap py-4 text-right text-[12px]",
                          change === null
                            ? "text-cream/30"
                            : change >= 0
                              ? "text-cream/70"
                              : "text-signal",
                        )}
                      >
                        {signedPct(change, 2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream/30">
              상위 5개 합계 점유율 {topShare.toFixed(1)}%
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream/30">
              DefiLlama · 30D change · USD 기준
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
