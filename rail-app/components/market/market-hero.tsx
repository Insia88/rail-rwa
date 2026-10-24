import type { MarketSnapshot } from "@/lib/types";
import { MaskedLines, Reveal } from "@/components/ui/motion";
import { dateKo } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ART } from "@/components/landing/art";

/** Market hero — same 3-element grammar as the landing: H1, one sentence, live status. */
export function MarketHero({ market }: { market: MarketSnapshot }) {
  const live = market.status.stablecoins === "live" && market.status.fx === "live";

  return (
    <section className="relative isolate overflow-hidden bg-noir text-cream">
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-screen"
        style={{ backgroundImage: `url(${ART.agentsScan})` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-noir/30 via-transparent to-noir"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-20 mix-blend-overlay"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-14 pt-24 sm:px-8 sm:pb-16 sm:pt-28 lg:pt-32">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-dark pb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/45">
              Market Weather · Seoul · 2026
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">
              <span
                aria-hidden
                className={cn(
                  "h-1 w-1 rounded-full",
                  live ? "animate-pulse-dot bg-signal" : "bg-cream/40",
                )}
              />
              {live ? "Live" : "Snapshot"} · {dateKo(market.asOf)}
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.04}>
          <MaskedLines
            as="h1"
            className="mt-12 max-w-5xl text-[clamp(2.4rem,4.4vw,4rem)] font-extrabold leading-[1.12] tracking-[-0.015em] text-cream"
            lineClassName="pb-[0.07em]"
            delay={0.1}
            stagger={0.08}
            lines={[
              <span key="line-1" className="sm:whitespace-nowrap">
                세계의 긴장을
              </span>,
              <span key="line-2" className="sm:whitespace-nowrap">
                실시간으로 압축한 <span className="text-signal">기상도.</span>
              </span>,
            ]}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-[16px] leading-[1.65] text-cream/55 sm:text-[17px]">
            조달 비용과 수요를 동시에 바꾸는 네 개의 숫자, 그리고 그 숫자가 신용으로 번역되는
            경로입니다.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
