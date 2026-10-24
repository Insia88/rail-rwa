import type { MarketSnapshot, OnKoreaMarket, OnKoreaSnapshot, StablecoinLine } from "./types";
import { DEFAULT_CONTEXT } from "./engine";

/**
 * Live market context used by the product:
 *  - stablecoin float & 30d change  → DefiLlama (free, no key)
 *  - USD/KRW                        → Frankfurter (ECB), fallback open.er-api
 *  - 24/7 Korean assets             → Hyperliquid HIP-3 `xyz` perp DEX (POST, no key)
 *  - RWA reference sizing           → CoinGecko categories (2026-10-22 research snapshot)
 *  - benchmark                      → demo assumption, labelled (realized yields need verification)
 *
 * All requests are server-side, cached for 30 minutes, and fail soft to a
 * labelled fallback so the demo never renders an empty panel.
 */

const REVALIDATE = 1800;

/** Korea date (Asia/Seoul) — a UTC "today" is one day behind every Korean morning. */
function seoulToday(): string {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul" }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

const RWA_SNAPSHOT = {
  tokenizedTreasuryUsd: 9_300_000_000,
  tokenizedPrivateCreditUsd: 25_600_000_000,
  rwaTotalUsd: 76_860_000_000,
  asOf: "2026-10-22",
  source: "CoinGecko categories (RWA $76.86B · Tokenized Private Credit $25.60B · Tokenized Treasuries $9.30B), 확인 2026-10-22",
};

const ONKOREA_FALLBACK: OnKoreaSnapshot = {
  dex: "xyz",
  asOf: "2026-10-22",
  dayVolumeUsd: 3_657_371_910,
  markets: [
    { coin: "xyz:KR200", label: "코스피200", markPx: 879.61, oraclePx: 883.68, funding: -0.000207, dayVolumeUsd: 1_000_092 },
    { coin: "xyz:KRW", label: "원/달러", markPx: 1_326.7, oraclePx: 1_326.7, funding: 0, dayVolumeUsd: 0 },
    { coin: "xyz:HYUNDAI", label: "현대차", markPx: 231.63, oraclePx: 232.43, funding: -0.000229, dayVolumeUsd: 965_438 },
    { coin: "xyz:SKHX", label: "SK하이닉스", markPx: 953.42, oraclePx: 960.19, funding: -0.000333, dayVolumeUsd: 342_696_786 },
    { coin: "xyz:EWY", label: "한국 ETF (EWY)", markPx: 154.78, oraclePx: 154.75, funding: 0.00000625, dayVolumeUsd: 38_791_427 },
    { coin: "xyz:SP500", label: "S&P 500", markPx: 7_733.6, oraclePx: 7_735.4, funding: 0.00000126, dayVolumeUsd: 247_876_514 },
  ],
  status: "fallback",
};

export const FALLBACK_MARKET: MarketSnapshot = {
  asOf: "2026-10-22",
  usdKrw: DEFAULT_CONTEXT.usdKrw,
  fxDate: "2026-10-21",
  fxSource: "Frankfurter (ECB) · fallback",
  stablecoinMcapUsd: 305_010_000_000,
  stablecoinChange30dPct: 0.6,
  stablecoins: [
    { symbol: "USDT", name: "Tether", mcapUsd: 182_510_000_000, sharePct: 59.8, change30dPct: -0.4 },
    { symbol: "USDC", name: "USD Coin", mcapUsd: 72_560_000_000, sharePct: 23.8, change30dPct: -2.5 },
    { symbol: "USDS", name: "Sky Dollar", mcapUsd: 6_830_000_000, sharePct: 2.2, change30dPct: 4.5 },
    { symbol: "DAI", name: "Dai", mcapUsd: 4_740_000_000, sharePct: 1.6, change30dPct: -1.2 },
    { symbol: "USDe", name: "Ethena USDe", mcapUsd: 4_700_000_000, sharePct: 1.5, change30dPct: 1.8 },
  ],
  rwa: RWA_SNAPSHOT,
  onkorea: ONKOREA_FALLBACK,
  benchmark: {
    apr: DEFAULT_CONTEXT.benchmarkApr,
    label: DEFAULT_CONTEXT.benchmarkLabel,
    source: DEFAULT_CONTEXT.benchmarkSource,
    asOf: "2026-10-22",
  },
  status: { stablecoins: "fallback", fx: "fallback" },
};

interface LlamaAsset {
  id: string;
  name: string;
  symbol: string;
  pegType?: string;
  circulating?: Record<string, number>;
  circulatingPrevMonth?: Record<string, number>;
}

interface LlamaResponse {
  peggedAssets: LlamaAsset[];
}

interface HlMeta {
  universe: { name: string }[];
}
interface HlCtx {
  markPx?: string;
  oraclePx?: string;
  funding?: string;
  dayNtlVlm?: string;
}

async function getJson<T>(url: string, revalidate = REVALIDATE): Promise<T | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate },
      signal: AbortSignal.timeout(7000),
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function postJson<T>(url: string, body: unknown, revalidate = REVALIDATE): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      next: { revalidate },
      signal: AbortSignal.timeout(7000),
      headers: { accept: "application/json", "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

const ONKOREA_LABELS: Record<string, string> = {
  KR200: "코스피200",
  KRW: "원/달러",
  HYUNDAI: "현대차",
  SKHX: "SK하이닉스",
  EWY: "한국 ETF (EWY)",
  SP500: "S&P 500",
};

/** Hyperliquid HIP-3 `xyz` DEX — Korean equity/index/FX exposure trading 24/7 on-chain (perps). */
async function fetchOnKorea(): Promise<OnKoreaSnapshot | null> {
  const data = await postJson<[HlMeta, HlCtx[]]>("https://api.hyperliquid.xyz/info", {
    type: "metaAndAssetCtxs",
    dex: "xyz",
  });
  if (!Array.isArray(data) || data.length < 2) return null;
  const [meta, ctxs] = data;
  if (!meta?.universe?.length || !ctxs?.length) return null;

  const markets: OnKoreaMarket[] = [];
  let dayVolumeUsd = 0;
  meta.universe.forEach((u, i) => {
    const ctx = ctxs[i] ?? {};
    const vol = Number(ctx.dayNtlVlm ?? 0);
    dayVolumeUsd += vol;
    const base = u.name.split(":").pop() ?? u.name;
    const label = ONKOREA_LABELS[base];
    if (!label) return;
    const markPx = Number(ctx.markPx ?? 0);
    const oraclePx = Number(ctx.oraclePx ?? 0);
    if (!markPx) return;
    markets.push({
      coin: u.name,
      label,
      markPx,
      oraclePx,
      funding: Number(ctx.funding ?? 0),
      dayVolumeUsd: vol,
    });
  });
  if (!markets.length) return null;
  const order = ["코스피200", "원/달러", "현대차", "SK하이닉스", "한국 ETF (EWY)", "S&P 500"];
  markets.sort((a, b) => order.indexOf(a.label) - order.indexOf(b.label));
  return { dex: "xyz", asOf: seoulToday(), dayVolumeUsd, markets, status: "live" };
}

function parseStablecoins(data: LlamaResponse | null): {
  total: number;
  change30d: number | null;
  top: StablecoinLine[];
} | null {
  if (!data?.peggedAssets?.length) return null;
  const usd = data.peggedAssets.filter(
    (a) => (a.pegType ?? "peggedUSD") === "peggedUSD" && a.circulating?.peggedUSD,
  );
  const total = usd.reduce((acc, a) => acc + (a.circulating?.peggedUSD ?? 0), 0);
  const prev = usd.reduce((acc, a) => acc + (a.circulatingPrevMonth?.peggedUSD ?? 0), 0);
  if (!total) return null;
  const top = [...usd]
    .sort((a, b) => (b.circulating?.peggedUSD ?? 0) - (a.circulating?.peggedUSD ?? 0))
    .slice(0, 5)
    .map((a) => {
      const mcapUsd = a.circulating?.peggedUSD ?? 0;
      const pm = a.circulatingPrevMonth?.peggedUSD ?? mcapUsd;
      return {
        symbol: a.symbol,
        name: a.name,
        mcapUsd,
        sharePct: (mcapUsd / total) * 100,
        change30dPct: pm ? (mcapUsd / pm - 1) * 100 : null,
      };
    });
  return {
    total,
    change30d: prev ? (total / prev - 1) * 100 : null,
    top,
  };
}

async function fetchFx(): Promise<{ rate: number; date: string; source: string } | null> {
  const frank = await getJson<{ date: string; rates: { KRW: number } }>(
    "https://api.frankfurter.app/latest?from=USD&to=KRW",
  );
  if (frank?.rates?.KRW) {
    return { rate: frank.rates.KRW, date: frank.date, source: "Frankfurter · ECB 기준환율" };
  }
  const er = await getJson<{ time_last_update_utc?: string; rates: { KRW: number } }>(
    "https://open.er-api.com/v6/latest/USD",
  );
  if (er?.rates?.KRW) {
    return {
      rate: er.rates.KRW,
      date: seoulToday(),
      source: "open.er-api.com",
    };
  }
  return null;
}

export async function getMarketSnapshot(): Promise<MarketSnapshot> {
  const [sc, fx, onkorea] = await Promise.all([
    getJson<LlamaResponse>("https://stablecoins.llama.fi/stablecoins?includePrices=true"),
    fetchFx(),
    fetchOnKorea(),
  ]);
  const parsed = parseStablecoins(sc);
  return {
    ...FALLBACK_MARKET,
    asOf: seoulToday(),
    ...(parsed
      ? {
          stablecoinMcapUsd: parsed.total,
          stablecoinChange30dPct: parsed.change30d,
          stablecoins: parsed.top,
        }
      : {}),
    ...(fx ? { usdKrw: fx.rate, fxDate: fx.date, fxSource: fx.source } : {}),
    ...(onkorea ? { onkorea } : {}),
    status: {
      stablecoins: parsed ? "live" : "fallback",
      fx: fx ? "live" : "fallback",
    },
  };
}

/** Engine context from a live snapshot (keeps passport numbers reproducible per snapshot). */
export function engineContextFromMarket(m: MarketSnapshot) {
  return {
    benchmarkApr: m.benchmark.apr,
    benchmarkLabel: m.benchmark.label,
    benchmarkSource: m.benchmark.source,
    usdKrw: m.usdKrw,
    stablecoinMcapUsd: m.stablecoinMcapUsd,
    asOf: m.asOf,
  };
}
