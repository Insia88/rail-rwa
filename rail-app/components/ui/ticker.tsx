import type { MarketSnapshot } from "@/lib/types";
import { usdCompact, dateKo } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * v2 "telemetry" ticker — dark strip, acid live dots, mono data.
 * Duplicated track for a seamless CSS marquee; respects reduced motion.
 */
export function MarketTicker({ market, className }: { market: MarketSnapshot; className?: string }) {
  const kr200 = market.onkorea.markets.find((m) => m.label === "코스피200");
  const items = [
    {
      label: "USD/KRW",
      value: market.usdKrw.toLocaleString("ko-KR", { maximumFractionDigits: 2 }),
      note: market.fxSource,
      live: market.status.fx === "live",
    },
    {
      label: "STABLECOIN FLOAT",
      value: usdCompact(market.stablecoinMcapUsd),
      note:
        market.stablecoinChange30dPct === null
          ? "30D —"
          : `30D ${market.stablecoinChange30dPct > 0 ? "+" : ""}${market.stablecoinChange30dPct.toFixed(1)}%`,
      live: market.status.stablecoins === "live",
    },
    {
      label: "ONCHAIN KOREA · KR200",
      value: kr200 ? kr200.markPx.toLocaleString("ko-KR", { maximumFractionDigits: 2 }) : "—",
      note: `24/7 perp · ${usdCompact(market.onkorea.dayVolumeUsd)}/day`,
      live: market.onkorea.status === "live",
    },
    {
      label: "RWA · COINGECKO",
      value: usdCompact(market.rwa.rwaTotalUsd),
      note: `P.CREDIT ${usdCompact(market.rwa.tokenizedPrivateCreditUsd)}`,
      live: false,
    },
    {
      label: "BENCHMARK",
      value: `${market.benchmark.apr.toFixed(2)}%`,
      note: market.benchmark.label,
      live: false,
    },
    {
      label: "AS OF",
      value: dateKo(market.asOf),
      note: "30분 캐시 · 서버사이드",
      live: true,
    },
  ];

  const Row = ({ ariaHidden }: { ariaHidden?: boolean }) => (
    <div className="flex shrink-0 items-center" aria-hidden={ariaHidden ? true : undefined}>
      {items.map((it) => (
        <div key={`${it.label}-${ariaHidden ? "b" : "a"}`} className="flex items-center gap-3 px-6">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/40">
            {it.label}
          </span>
          <span className="tnum font-mono text-[12px] font-medium text-cream">{it.value}</span>
          <span className="hidden items-center gap-1.5 font-mono text-[9px] text-cream/35 sm:flex">
            <span
              className={cn(
                "h-1 w-1 rounded-full",
                it.live ? "animate-pulse-dot bg-acid" : "bg-cream/25",
              )}
            />
            {it.note}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden border-y border-line-dark bg-noir-2/80 py-2.5",
        className,
      )}
    >
      <div className="animate-ticker flex w-max">
        <Row />
        <Row ariaHidden />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-noir to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-noir to-transparent" />
    </div>
  );
}
