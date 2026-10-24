import type { MarketSnapshot, WeatherSignal } from "@/lib/types";
import { Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/cn";
import { SectionHead } from "@/components/landing/section-head";

const HORIZONS: WeatherSignal["horizon"][] = ["지금", "3개월", "12개월"];

const ARROW = {
  up: { glyph: "↑", label: "상승" },
  down: { glyph: "↓", label: "하락" },
  flat: { glyph: "→", label: "횡보" },
} as const;

export function WeatherBoard({
  weather,
  market,
}: {
  weather: WeatherSignal[];
  market: MarketSnapshot;
}) {
  const groups = HORIZONS.map((horizon) => ({
    horizon,
    items: weather.filter((signal) => signal.horizon === horizon),
  })).filter((group) => group.items.length > 0);

  return (
    <section className="border-b border-line-dark bg-noir-2">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHead
          index="03"
          kicker="Market Weather · Signals"
          title="시장의 공기는 다섯 개의 신호로 읽힙니다."
          sub="buildWeather()가 시장 스냅샷에서 결정론적으로 계산한 신호입니다. 같은 스냅샷은 언제나 같은 기상도를 냅니다."
        />

        <div className="mt-12 border-y border-line-dark">
          {groups.map((group) => (
            <div
              key={group.horizon}
              className="grid gap-6 border-b border-line-dark py-8 last:border-b-0 lg:grid-cols-12"
            >
              <div className="lg:col-span-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/45">
                  {group.horizon}
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/25">
                  Horizon · {group.items.length}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:col-span-10">
                {group.items.map((signal) => (
                  <article key={signal.title} className="border-l border-line-dark pl-5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm leading-none text-cream/40" aria-hidden>
                        {ARROW[signal.direction].glyph}
                      </span>
                      <span className="sr-only">{ARROW[signal.direction].label}</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream/25">
                        Signal
                      </span>
                    </div>
                    <h3 className="mt-2.5 text-[17px] font-bold leading-[1.4] tracking-[-0.015em] text-cream">
                      {signal.title}
                    </h3>
                    <p className="mt-2 text-[12.5px] leading-[1.75] text-cream/50">{signal.body}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream/25">
            Snapshot · {market.asOf} · {weather.length} signals
          </p>
          <p className={cn("font-mono text-[9px] uppercase tracking-[0.12em] text-cream/25")}>
            ↑ 상승 · ↓ 하락 · → 횡보
          </p>
        </div>
      </div>
    </section>
  );
}
