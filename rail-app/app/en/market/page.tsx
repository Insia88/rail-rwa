import type { Metadata } from "next";
import Link from "next/link";
import type { MarketSnapshot, WeatherSignal } from "@/lib/types";
import { getMarketSnapshot } from "@/lib/market";
import { pct, signedPct, usdCompact } from "@/lib/format";
import { dateEn } from "@/components/en/flow-data";
import { DemoIntro } from "@/components/en/demo-intro";
import { ArrowLink, Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eyebrow, Hairline } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "RWA market weather",
  description:
    "Stablecoin liquidity, USD/KRW, tokenized Treasury yields and 24/7 on-chain Korean assets — the market snapshot the RAIL credit rail reads.",
  alternates: { canonical: "/en/market" },
};

const ONKOREA_LABELS: Record<string, string> = {
  "코스피200": "KOSPI 200",
  "원/달러": "USD/KRW",
  현대차: "Hyundai Motor",
  "SK하이닉스": "SK Hynix",
  "한국 ETF (EWY)": "Korea ETF (EWY)",
  "S&P 500": "S&P 500",
};

/** EN mirror of lib/weather.ts — same deterministic thresholds, English copy. */
function buildWeatherEn(m: MarketSnapshot): WeatherSignal[] {
  const signals: WeatherSignal[] = [];
  const fx = m.usdKrw;
  const fxDirection: WeatherSignal["direction"] =
    fx >= 1_380 ? "up" : fx <= 1_300 ? "down" : "flat";
  signals.push({
    horizon: "지금",
    direction: fxDirection,
    title:
      fxDirection === "up"
        ? "Weak won — the won value of export revenue rises"
        : fxDirection === "down"
          ? "Strong won — the won value of export revenue falls"
          : "Neutral FX band — it separates cost from revenue",
    body: `USD/KRW ${fx.toFixed(2)}. With 84.2% of export settlements in USD (Bank of Korea, 2025), FX is not the size of revenue — it is the volatility of repayment capacity.`,
  });

  const sc = m.stablecoinChange30dPct;
  signals.push({
    horizon: "지금",
    direction: sc === null ? "flat" : sc >= 0.5 ? "up" : sc <= -0.5 ? "down" : "flat",
    title:
      sc !== null && sc >= 0.5
        ? "Stablecoin liquidity expanding — on-chain settlement channels deepen"
        : sc !== null && sc <= -0.5
          ? "Stablecoin float contracting — a signal of higher funding cost"
          : "Stablecoin liquidity flat",
    body: `Stablecoin market cap ${usdCompact(m.stablecoinMcapUsd)} (30-day ${signedPct(sc)}). USDT and USDC account for ${m.stablecoins
      .slice(0, 2)
      .reduce((acc, coin) => acc + coin.sharePct, 0)
      .toFixed(1)}% of it.`,
  });

  const kr200 = m.onkorea.markets.find((item) => item.label === "코스피200");
  signals.push({
    horizon: "지금",
    direction: "up",
    title: "Korean assets already trade on-chain, 24/7",
    body: `KOSPI 200 (${kr200 ? kr200.markPx.toFixed(2) : "—"}), Hyundai Motor, SK Hynix, EWY and USD/KRW trade 24/7 on Hyperliquid's HIP-3 'xyz' DEX. Daily volume ${usdCompact(m.onkorea.dayVolumeUsd)}. The marks update receivable collateral value and FX hedges in real time.`,
  });

  signals.push({
    horizon: "3개월",
    direction: m.benchmark.apr >= 4.5 ? "up" : m.benchmark.apr <= 3.8 ? "down" : "flat",
    title: "Tokenized Treasury yields set the floor on factoring rates",
    body: `Benchmark ${m.benchmark.apr.toFixed(2)}% (${m.benchmark.label}). When the risk-free substitute yield rises, RWA credit products are repriced at a wider spread.`,
  });

  signals.push({
    horizon: "12개월",
    direction: "up",
    title: "For export receivables, issuance is the business",
    body: `The global RWA market is ${usdCompact(m.rwa.rwaTotalUsd)} depending on the aggregator, of which tokenized private credit is ${usdCompact(m.rwa.tokenizedPrivateCreditUsd)} (CoinGecko, ${dateEn(m.rwa.asOf)}). The next step is not wrapping assets but binding rights, money, conditions and obligations into one transaction. Korea's token-securities law passed 2026-01-15; enforcement is expected January 2027.`,
  });

  signals.push({
    horizon: "12개월",
    direction: "up",
    title: "Agents underwrite; agents match liquidity",
    body: "Credit decisions and funding matches continue outside banking hours, at the speed of 24/7 export settlement. RAIL runs its underwriting, verification and brokerage agents on the same rules, without a closing bell.",
  });

  return signals;
}

const HORIZON_EN: Record<WeatherSignal["horizon"], string> = {
  지금: "Now",
  "3개월": "3 months",
  "12개월": "12 months",
};

const ARROW: Record<WeatherSignal["direction"], string> = { up: "↑", down: "↓", flat: "→" };

const TRANSMISSION = [
  {
    variable: "Benchmark rate",
    effect: "APR floor",
    detail: "The risk-free substitute yield; the reference point for factoring rates.",
  },
  {
    variable: "USD/KRW",
    effect: "FX risk premium",
    detail: "The higher the USD settlement share, the larger the FX premium on the rate.",
  },
  {
    variable: "Stablecoin liquidity",
    effect: "Pool depth",
    detail: "Thicker USDT and USDC balances mean faster LP raising and repayment.",
  },
  {
    variable: "RWA market (CoinGecko)",
    effect: "Exit liquidity",
    detail: "Tokenized private credit is the closest comparable market for this product.",
  },
  {
    variable: "On-chain Korean asset marks",
    effect: "Collateral value · FX hedge",
    detail: "24/7 perpetual marks refresh collateral value and FX hedge references in real time.",
  },
];

const SOURCES = [
  { name: "DefiLlama", detail: "Stablecoin market cap · share · 30-day change" },
  { name: "Frankfurter (ECB)", detail: "USD/KRW reference rate" },
  { name: "Hyperliquid HIP-3", detail: "KOSPI 200 · Hyundai · SK Hynix 24/7 perp marks" },
  { name: "CoinGecko categories", detail: "RWA · tokenized private credit · tokenized Treasuries" },
  { name: "RAIL research snapshot", detail: "Benchmark rate · regulation · market thesis" },
];

export default async function EnMarketPage() {
  const market = await getMarketSnapshot();
  const weather = buildWeatherEn(market);
  const live = market.status.fx === "live" && market.status.stablecoins === "live";

  return (
    <main className="relative min-h-dvh overflow-hidden bg-noir pt-16 text-cream">
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid-dark opacity-30 mask-fade-b" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04] mix-blend-overlay" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-8 sm:px-8">
        <DemoIntro
          step="Market weather"
          purpose="Four numbers move funding cost and demand: stablecoin liquidity, USD/KRW, tokenized Treasury yields and 24/7 on-chain Korean assets."
          hint="Every reading is fetched server-side with a 30-minute cache and a labelled fallback when a feed fails."
          prev={{ href: "/en/passport/hanbit", label: "Credit Passport" }}
          next={{ href: "/en/agents", label: "Next: the crew" }}
        />

        {/* hero */}
        <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-b border-line-dark pb-8">
          <div className="max-w-3xl">
            <Eyebrow>Market weather · {dateEn(market.asOf)}</Eyebrow>
            <h1 className="mt-3 text-[clamp(2.2rem,4.6vw,3.8rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-cream">
              The world&apos;s tension,
              <br />
              compressed into a live weather map.
            </h1>
            <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-cream/55">
              Four numbers that move funding cost and demand, and the path by which they become
              credit.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <Badge tone={live ? "acid" : "cream"}>{live ? "Live" : "Snapshot"}</Badge>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/30">
              Server-side snapshot · 30-minute cache
            </p>
          </div>
        </div>

        {/* numbers strip */}
        <div className="mt-8 grid gap-px border border-line-dark bg-line-dark/40 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Stablecoin float",
              value: usdCompact(market.stablecoinMcapUsd),
              note: `30D ${signedPct(market.stablecoinChange30dPct)}`,
            },
            {
              label: "USD/KRW",
              value: market.usdKrw.toFixed(2),
              note: `${market.fxSource} · ${dateEn(market.fxDate)}`,
            },
            {
              label: "Benchmark",
              value: `${market.benchmark.apr.toFixed(2)}%`,
              note: market.benchmark.label,
            },
            {
              label: "RWA · private credit",
              value: usdCompact(market.rwa.rwaTotalUsd),
              note: `${usdCompact(market.rwa.tokenizedPrivateCreditUsd)} tokenized private credit`,
            },
          ].map((item) => (
            <div key={item.label} className="bg-noir px-5 py-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-cream/35">
                {item.label}
              </p>
              <p className="type-data mt-2 text-[34px] font-semibold leading-none text-cream">
                {item.value}
              </p>
              <p className="mt-2 text-[10.5px] leading-relaxed text-cream/35">{item.note}</p>
            </div>
          ))}
        </div>

        {/* onkorea */}
        <section className="mt-14" aria-labelledby="onkorea-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>On-chain Korea · HIP-3</Eyebrow>
              <h2
                id="onkorea-title"
                className="mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold leading-[1.15] tracking-[-0.02em]"
              >
                Prices cross borders; markets leave buildings.
              </h2>
            </div>
            <p className="max-w-md text-[12.5px] leading-relaxed text-cream/45">
              KOSPI 200, Hyundai Motor and SK Hynix set prices around the clock, in the same block
              space.
            </p>
          </div>
          <div className="mt-5 overflow-x-auto border border-line-dark">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-dark bg-noir-2/70 font-mono text-[8px] uppercase tracking-[0.18em] text-cream/35">
                  <th className="px-4 py-2.5 font-normal">Market</th>
                  <th className="px-4 py-2.5 text-right font-normal">Mark</th>
                  <th className="px-4 py-2.5 text-right font-normal">Oracle</th>
                  <th className="px-4 py-2.5 text-right font-normal">Funding</th>
                  <th className="px-4 py-2.5 text-right font-normal">24h volume</th>
                </tr>
              </thead>
              <tbody>
                {market.onkorea.markets.map((row) => (
                  <tr key={row.coin} className="border-b border-line-dark/60 last:border-b-0">
                    <td className="px-4 py-2.5 text-[12.5px] text-cream/80">
                      {ONKOREA_LABELS[row.label] ?? row.label}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[12px] tnum text-cream">
                      {row.markPx.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[11px] tnum text-cream/50">
                      {row.oraclePx.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right font-mono text-[11px] tnum ${
                        row.funding >= 0 ? "text-acid/80" : "text-signal/85"
                      }`}
                    >
                      {(row.funding * 100).toFixed(4)}%
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-[11px] tnum text-cream/45">
                      {usdCompact(row.dayVolumeUsd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 font-mono text-[9px] text-cream/25">
            Hyperliquid HIP-3 &apos;xyz&apos; DEX · perpetual-mark prices, not spot equities.
          </p>
        </section>

        {/* stablecoins */}
        <section className="mt-14" aria-labelledby="stablecoin-title">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Stablecoin float</Eyebrow>
              <h2
                id="stablecoin-title"
                className="mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold leading-[1.15] tracking-[-0.02em]"
              >
                Liquidity depth sets the cost of funding.
              </h2>
            </div>
            <p className="max-w-md text-[12.5px] leading-relaxed text-cream/45">
              Market cap and 30-day change for the top five stablecoins. This balance determines the
              depth of the receivable pool.
            </p>
          </div>
          <div className="mt-5 border border-line-dark">
            <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))_minmax(0,1.6fr)] gap-3 border-b border-line-dark bg-noir-2/70 px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.16em] text-cream/35">
              <span>Stablecoin</span>
              <span className="text-right">Market cap</span>
              <span className="text-right">Share</span>
              <span className="text-right">30D</span>
              <span className="hidden sm:block">Share of total</span>
            </div>
            {market.stablecoins.map((coin) => (
              <div
                key={coin.symbol}
                className="grid grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))_minmax(0,1.6fr)] items-center gap-3 border-b border-line-dark/50 px-4 py-3 last:border-b-0"
              >
                <span className="min-w-0">
                  <span className="font-mono text-[12px] font-semibold tracking-[0.06em] text-cream">
                    {coin.symbol}
                  </span>
                  <span className="ml-2 truncate text-[11px] text-cream/35">{coin.name}</span>
                </span>
                <span className="text-right font-mono text-[12px] tnum text-cream/85">
                  {usdCompact(coin.mcapUsd)}
                </span>
                <span className="text-right font-mono text-[11px] tnum text-cream/50">
                  {pct(coin.sharePct)}
                </span>
                <span
                  className={`text-right font-mono text-[11px] tnum ${
                    coin.change30dPct === null
                      ? "text-cream/30"
                      : coin.change30dPct >= 0
                        ? "text-acid/80"
                        : "text-signal/85"
                  }`}
                >
                  {signedPct(coin.change30dPct)}
                </span>
                <div className="hidden sm:block">
                  <div className="h-[3px] w-full bg-cream/10" aria-hidden>
                    <div
                      className="h-full bg-cream/60"
                      style={{ width: `${Math.min(100, Math.max(0, coin.sharePct))}%` }}
                    />
                  </div>
                  <span className="mt-1 block font-mono text-[8px] text-cream/25">DefiLlama</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* weather */}
        <section className="mt-14" aria-labelledby="weather-title">
          <Eyebrow>Weather signals · buildWeather()</Eyebrow>
          <h2
            id="weather-title"
            className="mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold leading-[1.15] tracking-[-0.02em]"
          >
            The market reads through five signals.
          </h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {weather.map((signal, index) => (
              <article key={index} className="border border-line-dark bg-noir-2/50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-cream/35">
                    {HORIZON_EN[signal.horizon]}
                  </span>
                  <span
                    className={`font-mono text-[13px] ${
                      signal.direction === "up"
                        ? "text-acid"
                        : signal.direction === "down"
                          ? "text-signal"
                          : "text-cream/40"
                    }`}
                    aria-label={signal.direction}
                  >
                    {ARROW[signal.direction]}
                  </span>
                </div>
                <h3 className="mt-3 text-[14px] font-bold leading-[1.3] tracking-[-0.01em] text-cream">
                  {signal.title}
                </h3>
                <p className="mt-2 text-[11.5px] leading-relaxed text-cream/45">{signal.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* transmission */}
        <section className="mt-14" aria-labelledby="transmission-title">
          <Eyebrow>Transmission</Eyebrow>
          <h2
            id="transmission-title"
            className="mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold leading-[1.15] tracking-[-0.02em]"
          >
            How these numbers reach credit.
          </h2>
          <div className="mt-5 border border-line-dark">
            {TRANSMISSION.map((row) => (
              <div
                key={row.variable}
                className="grid gap-1 border-b border-line-dark/60 px-4 py-3 last:border-b-0 sm:grid-cols-[180px_160px_minmax(0,1fr)] sm:items-baseline sm:gap-4"
              >
                <span className="text-[12.5px] font-semibold text-cream/85">{row.variable}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-signal/80">
                  {row.effect}
                </span>
                <span className="text-[11.5px] leading-relaxed text-cream/45">{row.detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* sources */}
        <section className="mt-14" aria-labelledby="sources-title">
          <Eyebrow>Sources</Eyebrow>
          <h2
            id="sources-title"
            className="mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold leading-[1.15] tracking-[-0.02em]"
          >
            We do not hide where the numbers come from.
          </h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {SOURCES.map((source) => (
              <li key={source.name} className="border border-line-dark/70 bg-noir-2/40 px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/75">
                  {source.name}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-cream/40">{source.detail}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 font-mono text-[9px] leading-relaxed text-cream/25">
            Every market data point is fetched server-side and revalidated every 30 minutes. On
            failure, the page renders a labelled fallback.
          </p>
        </section>

        {/* closing */}
        <div className="mt-14 flex flex-col gap-5 border-t border-line-dark pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-serif-display text-[clamp(1.5rem,2.6vw,2.2rem)] italic leading-[1.2] text-cream/85">
              A rail where credit arrives first.
            </p>
            <p className="mt-2 text-[13px] text-cream/45">
              Banks see collateral. RAIL sees cash flow.
            </p>
            <p className="mt-4 max-w-2xl font-mono text-[9px] leading-relaxed text-cream/25">
              RAIL is a demo. It is not a financial service; market data comes from public APIs and
              on-chain records are simulated.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button href="/en/underwrite" variant="primary" size="sm">
              Create a Credit Passport
            </Button>
            <Button href="/en/agents" variant="outline-inverse" size="sm">
              Agent crew
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-line-dark pt-5">
          <ArrowLink href="/en" inverse>
            Product landing
          </ArrowLink>
          <ArrowLink href="/en/underwrite" inverse>
            Run the demo
          </ArrowLink>
          <Link
            href="/en/agents"
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-cream/35 hover:text-cream"
          >
            Build log
          </Link>
        </div>
        <Hairline className="mt-8 bg-line-dark" />
        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-cream/20">
          RAIL Credit Engine · Seoul · Base · USDC
        </p>
      </div>
    </main>
  );
}
