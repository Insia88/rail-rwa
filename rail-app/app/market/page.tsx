import type { Metadata } from "next";
import Link from "next/link";
import { getMarketSnapshot } from "@/lib/market";
import { Reveal } from "@/components/ui/motion";
import { dateKo, pct, usdCompact } from "@/lib/format";

export const metadata: Metadata = {
  title: "RWA 시장 스냅샷",
  description:
    "스테이블코인 유동성, USD/KRW, 토큰화 국채, 24시간 온체인 한국자산까지. RAIL 신용 레일이 참조하는 시장 스냅샷.",
};

const nf = (n: number, digits = 2) =>
  n.toLocaleString("ko-KR", { maximumFractionDigits: digits });

/** /market — light surface, hairline cards and tables, numbers first. */
export default async function MarketPage() {
  const market = await getMarketSnapshot();
  const fx = nf(market.usdKrw);
  const live = market.status.fx === "live" && market.status.stablecoins === "live";

  const cards = [
    { label: "스테이블코인 시가총액", value: usdCompact(market.stablecoinMcapUsd) },
    { label: "USD/KRW", value: fx },
    { label: "토큰화 국채", value: usdCompact(market.rwa.tokenizedTreasuryUsd) },
    { label: "RWA 전체", value: usdCompact(market.rwa.rwaTotalUsd) },
  ];

  return (
    <main className="bg-porcelain">
      <div className="mx-auto w-full max-w-[1120px] px-6 pb-20 pt-28 sm:pt-32">
        <Reveal>
          <p className="text-[13px] text-graphite-3">시장 스냅샷</p>
          <h1 className="mt-4 max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-graphite">
            RAIL이 참조하는 시장.
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-[1.65] text-graphite-2">
            스테이블코인 유동성, 환율, 토큰화 국채, 24시간 온체인 한국자산. 모든 수치는 서버에서
            가져오며, 실패하면 라벨을 붙여 대체합니다.
          </p>
          <p className="mt-3 text-[13px] text-graphite-3">
            {live ? "실시간" : "스냅샷"} · {dateKo(market.asOf)} · FX {market.fxSource}
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
                <h2 className="text-[17px] font-semibold text-graphite">스테이블코인</h2>
                <p className="text-[13px] text-graphite-3">30일 변동</p>
              </div>
              <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-hairline text-[13px] text-graphite-3">
                    <th className="px-6 py-3 font-normal">자산</th>
                    <th className="px-3 py-3 text-right font-normal">시가총액</th>
                    <th className="px-3 py-3 text-right font-normal">점유</th>
                    <th className="px-6 py-3 text-right font-normal">30일</th>
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
                <h2 className="text-[17px] font-semibold text-graphite">RWA 구성</h2>
              </div>
              <dl className="px-6 py-2">
                {[
                  { label: "토큰화 국채", value: market.rwa.tokenizedTreasuryUsd },
                  { label: "토큰화 사모신용", value: market.rwa.tokenizedPrivateCreditUsd },
                  { label: "RWA 전체", value: market.rwa.rwaTotalUsd },
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
                출처 {market.rwa.source} · 집계 기준에 따라 범위가 달라집니다.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-[var(--radius-card)] border border-hairline bg-surface">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline px-6 py-4">
              <h2 className="text-[17px] font-semibold text-graphite">24시간 온체인 한국자산</h2>
              <p className="text-[13px] text-graphite-3">
                {market.onkorea.dex} · {market.onkorea.status === "live" ? "실시간" : "스냅샷"}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-hairline text-[13px] text-graphite-3">
                  <th className="px-6 py-3 font-normal">자산</th>
                  <th className="px-3 py-3 text-right font-normal">마크</th>
                  <th className="px-3 py-3 text-right font-normal">오라클</th>
                  <th className="px-3 py-3 text-right font-normal">펀딩</th>
                  <th className="px-6 py-3 text-right font-normal">거래량</th>
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
              벤치마크 {market.benchmark.label} {pct(market.benchmark.apr, 2)} ·{" "}
              {market.benchmark.source}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href="/"
                className="text-[15px] font-medium text-graphite-2 underline decoration-hairline-2 underline-offset-4 hover:text-graphite"
              >
                제품으로 돌아가기
              </Link>
              <Link
                href="/agents"
                className="text-[15px] font-medium text-graphite-2 underline decoration-hairline-2 underline-offset-4 hover:text-graphite"
              >
                에이전트 팀
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
