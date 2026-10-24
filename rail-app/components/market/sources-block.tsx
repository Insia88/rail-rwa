import type { MarketSnapshot } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { cn } from "@/lib/cn";
import { ART } from "@/components/landing/art";
import { SectionHead } from "@/components/landing/section-head";

export function SourcesBlock({ market }: { market: MarketSnapshot }) {
  const liveStable = market.status.stablecoins === "live";
  const liveFx = market.status.fx === "live";
  const liveKorea = market.onkorea.status === "live";

  const sources = [
    {
      name: "DefiLlama · Stablecoins",
      detail: "스테이블코인 시가총액 · 점유율 · 30일 변동",
      status: liveStable ? "LIVE" : "FALLBACK",
      live: liveStable,
    },
    {
      name: "Frankfurter (ECB)",
      detail: "USD/KRW 기준환율",
      status: liveFx ? "LIVE" : "FALLBACK",
      live: liveFx,
    },
    {
      name: "Hyperliquid HIP-3 · xyz",
      detail: "코스피200 · 현대차 · SK하이닉스 24/7 perp 마크",
      status: liveKorea ? "LIVE" : "FALLBACK",
      live: liveKorea,
    },
    {
      name: "CoinGecko categories",
      detail: "RWA · 토큰화 사모신용 · 토큰화 국채",
      status: "SNAPSHOT",
      live: false,
    },
    {
      name: "RAIL 리서치 스냅샷",
      detail: "벤치마크 금리 · 규제 · 시장 논지",
      status: "SNAPSHOT",
      live: false,
    },
  ] as const;

  return (
    <>
      <section className="bg-noir-2">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHead
              index="05"
              kicker="Sources"
              title="숫자의 출처를 숨기지 않습니다."
              sub="모든 시장 데이터는 서버에서 조회하고 30분마다 재검증합니다. 실패 시 라벨이 붙은 fallback 값으로 렌더링합니다."
            />
            <Reveal delay={0.1}>
              <p className="mt-8 max-w-md border-t border-line-dark pt-4 font-mono text-[9px] uppercase leading-relaxed tracking-[0.12em] text-cream/25">
                Snapshot {market.asOf} · Server-side · revalidate 30m
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="lg:col-span-6 lg:col-start-7">
            <ul className="border-t border-line-dark">
              {sources.map((source) => (
                <li
                  key={source.name}
                  className="flex items-center justify-between gap-4 border-b border-line-dark py-4 transition-colors duration-200 hover:bg-noir/40"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] tracking-[0.02em] text-cream/85">
                      {source.name}
                    </p>
                    <p className="mt-1 text-[11px] text-cream/35">{source.detail}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 border px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.14em]",
                      source.live
                        ? "border-acid/30 bg-acid/10 text-acid"
                        : "border-line-dark text-cream/35",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "h-1 w-1 rounded-full",
                        source.live ? "bg-acid" : "bg-cream/25",
                      )}
                    />
                    {source.status}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* last lap CTA */}
      <section className="relative overflow-hidden bg-signal text-ink">
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url(${ART.orangeBand})` }}
        />
        <div aria-hidden className="absolute inset-0 bg-signal/70" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grain opacity-20 mix-blend-overlay"
        />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-24">
          <Reveal>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60">
              Last Lap
            </span>
            <h2 className="mx-auto mt-5 max-w-3xl text-[clamp(2.2rem,4.8vw,4rem)] font-black leading-[1.05] tracking-[-0.015em] text-ink">
              신용이 먼저 도착하는 레일.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-ink/75">
              은행은 담보를 봅니다. RAIL은 흐름을 봅니다.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                href="/underwrite"
                size="lg"
                className="bg-ink text-cream hover:bg-noir-2 hover:text-cream"
              >
                신용 여권 만들기
              </Button>
              <Button href="/agents" size="lg" variant="outline">
                모델 보기
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
