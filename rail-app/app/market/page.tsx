import type { Metadata } from "next";
import { ALL_RESULTS } from "@/lib/engine";
import { engineContextFromMarket, getMarketSnapshot } from "@/lib/market";
import { buildWeather } from "@/lib/weather";
import { LiveTicker } from "@/components/landing/live-ticker";
import { MarketHero } from "@/components/market/market-hero";
import { MarketNumbers } from "@/components/market/market-numbers";
import { OnKoreaSection } from "@/components/market/onkorea-section";
import { SourcesBlock } from "@/components/market/sources-block";
import { StablecoinTable } from "@/components/market/stablecoin-table";
import { TransmissionTable } from "@/components/market/transmission-table";
import { WeatherBoard } from "@/components/market/weather-board";

export const metadata: Metadata = {
  title: "RWA 시장 기상도",
  description:
    "스테이블코인 유동성, USD/KRW, 토큰화 국채 금리, 24시간 온체인 한국자산까지. RAIL 신용 레일이 참조하는 시장 스냅샷.",
};

export default async function MarketPage() {
  const market = await getMarketSnapshot();
  const results = ALL_RESULTS(engineContextFromMarket(market));
  const weather = buildWeather(market);

  return (
    <main className="bg-noir">
      <MarketHero market={market} />
      <LiveTicker market={market} results={results} variant="market" />
      <MarketNumbers market={market} results={results} />
      <OnKoreaSection market={market} />
      <StablecoinTable market={market} />
      <WeatherBoard weather={weather} market={market} />
      <TransmissionTable market={market} />
      <SourcesBlock market={market} />
    </main>
  );
}
