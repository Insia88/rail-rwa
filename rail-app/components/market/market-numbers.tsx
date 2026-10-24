import type { MarketSnapshot, UnderwritingResult } from "@/lib/types";
import { Reveal } from "@/components/ui/motion";
import { dateKo, signedPct, usdCompact } from "@/lib/format";
import { cn } from "@/lib/cn";

export function MarketNumbers({
  market,
  results,
}: {
  market: MarketSnapshot;
  results: UnderwritingResult[];
}) {
  const totalLimit = results.reduce((acc, r) => acc + r.limitKrw, 0);
  const avgApr =
    results.length > 0 ? results.reduce((acc, r) => acc + r.apr, 0) / results.length : 0;
  const avgScore =
    results.length > 0 ? results.reduce((acc, r) => acc + r.score, 0) / results.length : 0;
  const sc = market.stablecoinChange30dPct;

  const cells = [
    {
      label: "Stablecoin float",
      prefix: "$",
      value: (market.stablecoinMcapUsd / 1e9).toFixed(1),
      unit: "B",
      note: `30D ${signedPct(sc)} · DefiLlama`,
      live: market.status.stablecoins === "live",
    },
    {
      label: "USD / KRW",
      prefix: "",
      value: market.usdKrw.toLocaleString("ko-KR", { maximumFractionDigits: 2 }),
      unit: "",
      note: `${dateKo(market.fxDate)} · ${market.status.fx === "live" ? "LIVE" : "FALLBACK"}`,
      live: market.status.fx === "live",
    },
    {
      label: "Benchmark APR",
      prefix: "",
      value: market.benchmark.apr.toFixed(2),
      unit: "%",
      note: market.benchmark.label,
      live: false,
    },
    {
      label: "RWA · CoinGecko",
      prefix: "$",
      value: (market.rwa.rwaTotalUsd / 1e9).toFixed(1),
      unit: "B",
      note: `토큰화 사모신용 ${usdCompact(market.rwa.tokenizedPrivateCreditUsd)}`,
      live: false,
    },
  ];

  return (
    <section className="bg-noir">
      <div className="mx-auto w-full max-w-6xl px-5 pb-12 pt-8 sm:px-8 sm:pb-14 sm:pt-10">
        <div className="grid grid-cols-2 gap-px border-y border-line-dark bg-line-dark lg:grid-cols-4">
          {cells.map((cell, i) => (
            <Reveal key={cell.label} delay={i * 0.04}>
              <div className="h-full bg-noir px-4 py-6 sm:px-5 sm:py-7">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={cn(
                      "h-1 w-1 rounded-full",
                      cell.live ? "animate-pulse-dot bg-acid" : "bg-cream/20",
                    )}
                  />
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
                    {cell.label}
                  </p>
                </div>
                <p className="type-data mt-3 text-[clamp(1.8rem,3.4vw,2.8rem)] font-medium leading-none text-cream">
                  {cell.prefix}
                  {cell.value}
                  {cell.unit ? (
                    <span className="ml-1 inline-block align-baseline font-mono text-[0.42em] font-normal tracking-[0.02em] text-cream/45">
                      {cell.unit}
                    </span>
                  ) : null}
                </p>
                <p className="mt-2.5 truncate font-mono text-[9px] text-cream/35">{cell.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.12em] text-cream/25">
          서버사이드 스냅샷 · 30분 캐시 · 실패 시 라벨이 붙은 fallback 값으로 렌더링
        </p>
      </div>

      {/* deterministic engine aggregate */}
      <div className="border-y border-line-dark bg-noir-2">
        <div className="mx-auto grid w-full max-w-6xl items-end gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.3fr_repeat(3,1fr)]">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/30">
                Engine
              </span>
              <span aria-hidden className="h-px w-8 bg-line-dark" />
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/45">
                Aggregate
              </span>
            </div>
            <p className="mt-4 max-w-xs text-[15px] font-bold leading-[1.5] tracking-[-0.01em] text-cream/90">
              같은 스냅샷 위에서 심사한 세 개의 여권.
            </p>
            <p className="mt-2 max-w-xs text-[11px] leading-relaxed text-cream/40">
              합계와 평균은 이 시장 스냅샷을 엔진 컨텍스트로 넣어 계산했습니다. 숫자는 언제나
              재현됩니다.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
              총 승인 한도
            </p>
            <p className="type-data mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-none text-cream">
              {(totalLimit / 1e8).toFixed(1)}
              <span className="ml-1 inline-block align-baseline font-mono text-[0.42em] font-normal tracking-[0.02em] text-cream/45">
                억
              </span>
            </p>
            <p className="mt-2 font-mono text-[9px] text-cream/35">{results.length}명 심사 합계</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
              평균 금리
            </p>
            <p className="type-data mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-none text-cream">
              {avgApr.toFixed(2)}
              <span className="ml-1 inline-block align-baseline font-mono text-[0.42em] font-normal tracking-[0.02em] text-cream/45">
                %
              </span>
            </p>
            <p className="mt-2 font-mono text-[9px] text-cream/35">벤치마크 + 등급 스프레드</p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
              평균 점수
            </p>
            <p className="type-data mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-medium leading-none text-cream">
              {avgScore.toFixed(1)}
            </p>
            <p className="mt-2 font-mono text-[9px] text-cream/35">규칙 엔진 가중 합산</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
