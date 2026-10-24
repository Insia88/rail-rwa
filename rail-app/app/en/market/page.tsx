import type { Metadata } from "next";
import Link from "next/link";
import { getMarketSnapshot } from "@/lib/market";
import { Reveal } from "@/components/ui/motion";
import { pct, usdCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "RWA market snapshot",
  description:
    "Stablecoin liquidity, USD/KRW, tokenized Treasuries and 24/7 on-chain Korean assets — the market snapshot the RAIL credit rail reads.",
  alternates: { canonical: "/en/market" },
};

const nf = (n: number, digits = 2) =>
  n.toLocaleString("en-US", { maximumFractionDigits: digits });
const iso = (s: string) => s.slice(0, 10);

/** /en/market — same light surface language as the KO page. */
export default async function EnMarketPage() {
  const market = await getMarketSnapshot();
  const live = market.status.fx === "live" && market.status.stablecoins === "live";

  const cards = [
    { label: "Stablecoin market cap", value: usdCompact(market.stablecoinMcapUsd) },
    { label: "USD/KRW", value: nf(market.usdKrw) },
    { label: "Tokenized Treasuries", value: usdCompact(market.rwa.tokenizedTreasuryUsd) },
    { label: "RWA total", value: usdCompact(market.rwa.rwaTotalUsd) },
  ];

  return (
    <main className="bg-porcelain" lang="en">
      <div className="mx-auto w-full max-w-[1120px] px-6 pb-20 pt-28 sm:pt-32">
        <Reveal>
          <p className="text-[13px] text-graphite-3">Market snapshot</p>
          <h1 className="mt-4 max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-graphite">
            The market RAIL reads.
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-[1.65] text-graphite-2">
            Stablecoin liquidity, FX, tokenized Treasuries and 24/7 on-chain Korean assets. Every
            figure is fetched server-side with a labelled fallback.
          </p>
          <p className="mt-3 text-[13px] text-graphite-3">
            {live ? "Live" : "Snapshot"} · {iso(market.asOf)} · FX {market.fxSource}
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <dl className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className="bg-surface px-6 py-6">
                <dt className="text-[13px] text-graphite-3">{card.label}</dt>
                <dd className="mt-2 text-[clamp(1.6rem,2.8vw,2.25rem)] font-semibold leading-none tracking-[-0.03em] text-graphite">
                  {card.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-hairline bg-surface">
              <div className="flex items-baseline justify-between border-b border-hairline px-6 py-4">
                <h2 className="text-[17px] font-semibold text-graphite">Stablecoins</h2>
                <p className="text-[13px] text-graphite-3">30-day change</p>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-hairline text-[13px] text-graphite-3">
                    <th className="px-6 py-3 font-normal">Asset</th>
                    <th className="px-3 py-3 text-right font-normal">Market cap</th>
                    <th className="px-3 py-3 text-right font-normal">Share</th>
                    <th className="px-6 py-3 text-right font-normal">30d</th>
                  </tr>
                </thead>
                <tbody>
                  {market.stablecoins.slice(0, 6).map((coin) => (
                    <tr key={coin.symbol} className="border-b border-hairline last:border-b-0">
                      <td className="px-6 py-3.5">
                        <span className="block text-[15px] font-medium text-graphite">
                          {coin.symbol}
                        </span>
                        <span className="block text-[13px] text-graphite-3">{coin.name}</span>
                      </td>
                      <td className="px-3 py-3.5 text-right text-[15px] text-graphite-2">
                        {usdCompact(coin.mcapUsd)}
                      </td>
                      <td className="px-3 py-3.5 text-right text-[15px] text-graphite-2">
                        {nf(coin.sharePct, 1)}%
                      </td>
                      <td className="px-6 py-3.5 text-right text-[15px] text-graphite-2">
                        {coin.change30dPct === null ? "—" : `${nf(coin.change30dPct, 1)}%`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-hairline bg-surface">
              <div className="border-b border-hairline px-6 py-4">
                <h2 className="text-[17px] font-semibold text-graphite">RWA breakdown</h2>
              </div>
              <dl className="px-6 py-2">
                {[
                  { label: "Tokenized Treasuries", value: market.rwa.tokenizedTreasuryUsd },
                  { label: "Tokenized private credit", value: market.rwa.tokenizedPrivateCreditUsd },
                  { label: "RWA total", value: market.rwa.rwaTotalUsd },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between border-b border-hairline py-4 last:border-b-0"
                  >
                    <dt className="text-[14px] text-graphite-2">{row.label}</dt>
                    <dd className="text-[18px] font-semibold text-graphite">
                      {usdCompact(row.value)}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="border-t border-hairline px-6 py-4 text-[12px] leading-[1.6] text-graphite-3">
                Source {market.rwa.source}. Aggregators differ; the page does not blend them.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-[var(--radius-card)] border border-hairline bg-surface">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline px-6 py-4">
              <h2 className="text-[17px] font-semibold text-graphite">
                24/7 on-chain Korean assets
              </h2>
              <p className="text-[13px] text-graphite-3">
                {market.onkorea.dex} · {market.onkorea.status === "live" ? "live" : "snapshot"}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-hairline text-[13px] text-graphite-3">
                  <th className="px-6 py-3 font-normal">Asset</th>
                  <th className="px-3 py-3 text-right font-normal">Mark</th>
                  <th className="px-3 py-3 text-right font-normal">Oracle</th>
                  <th className="px-3 py-3 text-right font-normal">Funding</th>
                  <th className="px-6 py-3 text-right font-normal">Volume</th>
                </tr>
              </thead>
              <tbody>
                {market.onkorea.markets.map((m) => (
                  <tr key={m.coin} className="border-b border-hairline last:border-b-0">
                    <td className="px-6 py-3.5">
                      <span className="block text-[15px] font-medium text-graphite">{m.label}</span>
                      <span className="block font-mono text-[12px] text-graphite-3">{m.coin}</span>
                    </td>
                    <td className="px-3 py-3.5 text-right text-[15px] text-graphite-2">
                      {nf(m.markPx)}
                    </td>
                    <td className="px-3 py-3.5 text-right text-[15px] text-graphite-2">
                      {nf(m.oraclePx)}
                    </td>
                    <td className="px-3 py-3.5 text-right text-[15px] text-graphite-2">
                      {(m.funding * 100).toFixed(3)}%
                    </td>
                    <td className="px-6 py-3.5 text-right text-[15px] text-graphite-2">
                      {usdCompact(m.dayVolumeUsd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
              </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
            <p className="text-[13px] text-graphite-3">
              Benchmark {market.benchmark.label} {pct(market.benchmark.apr, 2)} ·{" "}
              {market.benchmark.source}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href="/en"
                className="text-[15px] font-medium text-graphite-2 underline decoration-hairline-2 underline-offset-4 hover:text-graphite"
              >
                Back to product
              </Link>
              <Link
                href="/en/agents"
                className="text-[15px] font-medium text-graphite-2 underline decoration-hairline-2 underline-offset-4 hover:text-graphite"
              >
                Agent crew
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
