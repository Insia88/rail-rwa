import type { MarketSnapshot, UnderwritingResult } from "@/lib/types";
import { dateKo, pct, usdCompact } from "@/lib/format";
import { cn } from "@/lib/cn";

type Variant = "credit" | "market" | "crew";
type Locale = "ko" | "en";

interface Segment {
  tag: string;
  tone: "live" | "fixture" | "runtime";
  full: string;
  compact: string;
}

/** Absurd-precision figure — shown only in the MARKET (live) segment. */
function absurdFloat(n: number): string {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
}

function buildSegments(
  variant: Variant,
  market: MarketSnapshot | null,
  results: UnderwritingResult[] | null,
  locale: Locale,
): Segment[] {
  const en = locale === "en";

  if (variant === "crew") {
    return [
      {
        tag: "RUNTIME",
        tone: "runtime",
        full: "SCOUT IDLE · VERIFIER IDLE · UNDERWRITER ON CALL · BROKER IDLE",
        compact: "SCOUT IDLE · UNDERWRITER ON CALL",
      },
      {
        tag: "DEMO",
        tone: "fixture",
        full: en ? "5 build agents · shipped 2026-10-22" : "빌드 에이전트 5명 · 배포 2026.10.22",
        compact: en ? "5 build agents" : "빌드 5명",
      },
    ];
  }

  if (!market) {
    return [
      { tag: "RAIL", tone: "fixture", full: "CREDIT ENGINE · SEOUL", compact: "CREDIT ENGINE" },
    ];
  }

  const fx = market.usdKrw.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  const hero = results?.[0];
  const issued = results?.length ?? 0;
  const coverage = hero ? `${(hero.evidenceCoverage * 100).toFixed(1)}%` : "—";
  const apr = hero ? pct(hero.apr, 2) : pct(market.benchmark.apr, 2);
  const live = market.status.stablecoins === "live" && market.status.fx === "live";

  return [
    {
      tag: live ? "MARKET · LIVE" : "MARKET · SNAPSHOT",
      tone: live ? "live" : "fixture",
      full: en
        ? `USD/KRW ${fx} · stablecoin float ${absurdFloat(market.stablecoinMcapUsd)} · RWA ${usdCompact(market.rwa.rwaTotalUsd)} · benchmark ${pct(market.benchmark.apr, 2)}`
        : `USD/KRW ${fx} · 스테이블코인 잔고 ${absurdFloat(market.stablecoinMcapUsd)} · RWA ${usdCompact(market.rwa.rwaTotalUsd)} · 벤치마크 ${pct(market.benchmark.apr, 2)}`,
      compact: en
        ? `USD/KRW ${fx} · stablecoins ${usdCompact(market.stablecoinMcapUsd)} · RWA ${usdCompact(market.rwa.rwaTotalUsd)}`
        : `USD/KRW ${fx} · 스테이블코인 ${usdCompact(market.stablecoinMcapUsd)} · RWA ${usdCompact(market.rwa.rwaTotalUsd)}`,
    },
    {
      tag: "DEMO · FIXTURE",
      tone: "fixture",
      full: en
        ? `${issued} credit passports issued this block (fixtures) · evidence coverage ${coverage} · proposed APR ${apr}`
        : `이번 블록 여권 ${issued}건(픽스처) · 증빙 커버리지 ${coverage} · 제안 금리 ${apr}`,
      compact: en
        ? `${issued} passports (fixtures) · coverage ${coverage}`
        : `여권 ${issued}건(픽스처) · 커버리지 ${coverage}`,
    },
  ];
}

/**
 * v6 ticker — two labelled segments: MARKET (real, live/fallback) and
 * DEMO (fixture). Duplicated track for a seamless marquee; pauses on hover.
 */
export function LiveTicker({
  market = null,
  results = null,
  variant = "credit",
  locale = "ko",
  className,
}: {
  market?: MarketSnapshot | null;
  results?: UnderwritingResult[] | null;
  variant?: Variant;
  locale?: Locale;
  className?: string;
}) {
  const segments = buildSegments(variant, market, results, locale);

  const Tag = ({ segment }: { segment: Segment }) => (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 border px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.12em]",
        segment.tone === "live"
          ? "border-acid/30 bg-acid/10 text-acid"
          : "border-line-dark text-cream/35",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1 w-1 rounded-full",
          segment.tone === "live" ? "animate-pulse-dot bg-acid" : "bg-cream/25",
        )}
      />
      {segment.tag}
    </span>
  );

  const Row = ({ ariaHidden }: { ariaHidden?: boolean }) => (
    <div
      className="flex shrink-0 items-center gap-5 whitespace-nowrap px-6"
      aria-hidden={ariaHidden ? true : undefined}
    >
      {segments.map((segment, i) => (
        <div key={`${segment.tag}-${i}`} className="flex items-center gap-3">
          <Tag segment={segment} />
          <span className="font-mono text-[11px] tracking-[0.04em] text-cream/60">
            <span className="sm:hidden">{segment.compact}</span>
            <span className="hidden sm:inline">{segment.full}</span>
          </span>
          <span aria-hidden className="h-1 w-1 rounded-full bg-cream/15" />
        </div>
      ))}
      <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream/20">
        {market ? dateKo(market.asOf) : "RAIL · SEOUL"}
      </span>
    </div>
  );

  return (
    <div
      className={cn(
        "ticker-pause relative overflow-hidden border-y border-line-dark bg-noir-2/60 py-2.5",
        className,
      )}
      aria-label="실시간 신용 레일 상태"
    >
      <div className="animate-ticker flex w-max">
        <Row />
        <Row ariaHidden />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-noir to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-noir to-transparent" />
    </div>
  );
}
