import type { MarketSnapshot, UnderwritingResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MaskedLines, Reveal } from "@/components/ui/motion";
import { dateKo, krwCompact, pct } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ART } from "./art";
import { HeroBackdrop } from "./hero-backdrop";
import type { HeroCopy } from "./v4-types";

function renderLine(text: string, emphasis?: string, accent?: boolean) {
  if (emphasis && text.includes(emphasis)) {
    const [before, ...rest] = text.split(emphasis);
    return (
      <>
        {before}
        <span className="text-signal">{emphasis}</span>
        {rest.join(emphasis)}
      </>
    );
  }
  return accent ? <span className="text-signal">{text}</span> : text;
}

/**
 * Act 1 — the business first: what RAIL does (spec line), the evidence, and the
 * verdict card with a corrected number hierarchy (LIMIT > APR > coverage; grade chip).
 */
export function HeroBand({
  copy,
  market,
  result,
  locale = "ko",
}: {
  copy: HeroCopy;
  market: MarketSnapshot;
  result: UnderwritingResult;
  locale?: "ko" | "en";
}) {
  const live = market.status.fx === "live" && market.status.stablecoins === "live";
  const rejected = copy.card.bankValue;
  const limitText =
    locale === "en"
      ? `KRW ${Math.round(result.limitKrw / 1e6)}M`
      : `${krwCompact(result.limitKrw)}원`;

  return (
    <section className="relative isolate overflow-hidden bg-noir text-cream">
      <HeroBackdrop image={ART.heroRail} className="opacity-90" />
      <div aria-hidden className="absolute inset-0 bg-noir/35" />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-noir via-noir/70 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-noir/40 via-transparent to-noir"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-20 mix-blend-overlay"
      />

      <div className="relative z-10 mx-auto flex min-h-[720px] w-full max-w-6xl flex-col px-5 pb-10 pt-24 sm:min-h-[780px] sm:px-8 sm:pb-12 sm:pt-28 lg:min-h-[840px] lg:pt-32">
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line-dark pb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/50">
              {copy.eyebrow}
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

        <div className="grid flex-1 items-center gap-12 py-10 lg:grid-cols-12 lg:gap-10 lg:py-14">
          <div className="lg:col-span-7">
            <MaskedLines
              as="h1"
              className="text-[clamp(2.6rem,5.4vw,4.7rem)] font-extrabold leading-[1.12] tracking-[-0.015em] text-cream"
              lineClassName="pb-[0.07em]"
              delay={0.1}
              stagger={0.08}
              lines={copy.lines.map((line, i) => (
                <span key={i} className="[text-wrap:balance]">
                  {renderLine(line.text, line.emphasis, line.accent)}
                </span>
              ))}
            />

            {copy.specLine ? (
              <Reveal delay={0.2}>
                <p className="mt-5 max-w-xl font-mono text-[10.5px] leading-[1.8] tracking-[0.02em] text-cream/65 sm:text-[11px]">
                  {copy.specLine}
                </p>
              </Reveal>
            ) : null}

            <Reveal delay={0.26}>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.6] text-cream/50 sm:text-[16px]">
                {copy.body}
              </p>
            </Reveal>

            <Reveal delay={0.34}>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button href={copy.primary.href} size="lg">
                  {copy.primary.label}
                </Button>
                <Button
                  href={copy.secondary.href}
                  size="lg"
                  variant="outline-inverse"
                  target={copy.secondary.external ? "_blank" : undefined}
                >
                  {copy.secondary.label}
                </Button>
                {copy.ctaNote ? (
                  <span className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.1em] text-cream/35 sm:ml-1">
                    {copy.ctaNote}
                  </span>
                ) : null}
              </div>
            </Reveal>
          </div>

          {/* verdict card — product evidence, no tilt/glow */}
          <Reveal delay={0.22} className="lg:col-span-5">
            <article
              aria-label={copy.card.railLabel}
              className="relative mx-auto w-full max-w-[400px] overflow-hidden border border-chrome-1/50 bg-noir text-cream shadow-[0_24px_60px_-40px_rgba(0,0,0,0.8)] lg:max-w-none"
            >
              <div
                aria-hidden
                className="absolute inset-0 bg-cover bg-center opacity-25"
                style={{ backgroundImage: `url(${ART.passportChrome})` }}
              />
              <div aria-hidden className="absolute inset-0 bg-noir/85" />

              <div className="relative">
                <div className="flex items-center justify-between gap-3 border-b border-line-dark px-5 py-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/40">
                    {copy.card.kicker}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-signal">
                    {dateKo(result.issuedAt)}
                  </span>
                </div>

                <div className="px-5 pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[24px] font-extrabold leading-tight tracking-[-0.02em] text-cream">
                        {result.applicantName}
                      </p>
                      <p className="mt-1 truncate font-mono text-[9px] uppercase tracking-[0.12em] text-cream/35">
                        {copy.card.meta}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="border border-cream/30 bg-cream/5 px-2 py-[3px] font-mono text-[9px] uppercase tracking-[0.14em] text-cream">
                        {copy.card.grade} · {result.grade}
                      </span>
                      <span className="border border-signal/40 bg-signal/10 px-2 py-[3px] font-mono text-[8.5px] uppercase tracking-[0.12em] text-signal">
                        {copy.card.rejected}
                      </span>
                    </div>
                  </div>
                </div>

                {/* bank → rail */}
                <div className="mt-4 grid gap-px border-t border-line-dark bg-line-dark">
                  <div className="bg-noir/70 px-5 py-2.5">
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-cream/30">
                      {copy.card.bankLabel}
                    </p>
                    <p className="mt-1 truncate font-mono text-[10.5px] text-cream/40 line-through decoration-signal/50">
                      {rejected}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 bg-noir/70 px-5 py-2.5">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-cream/30">
                        {copy.card.railLabel}
                      </p>
                      <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-cream">
                        RAIL · {copy.card.decision}
                      </p>
                    </div>
                    <span className="font-mono text-[15px] leading-none text-signal" aria-hidden>
                      →
                    </span>
                  </div>
                </div>

                {/* number hierarchy: LIMIT 40 > APR 34 > COVERAGE 28 */}
                <div className="grid grid-cols-2 border-t border-line-dark">
                  <div className="border-r border-line-dark px-5 py-3.5">
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-cream/30">
                      {copy.card.limit}
                    </p>
                    <p className="type-data mt-1 text-[clamp(1.75rem,3.2vw,2.5rem)] font-medium leading-none text-cream">
                      {limitText}
                    </p>
                  </div>
                  <div className="px-5 py-3.5">
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-cream/30">
                      {copy.card.apr}
                    </p>
                    <p className="type-data mt-1 text-[clamp(1.4rem,2.6vw,2.125rem)] font-medium leading-none text-cream">
                      {pct(result.apr, 2)}
                    </p>
                  </div>
                  <div className="col-span-2 flex items-baseline justify-between gap-3 border-t border-line-dark px-5 py-3">
                    <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-cream/30">
                      {copy.card.coverageLabel ?? "VERIFIED COVERAGE"}
                    </p>
                    <p className="type-data text-[clamp(1.35rem,2.2vw,1.75rem)] font-medium leading-none text-cream">
                      {pct(result.evidenceCoverage * 100, 1)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-line-dark px-5 py-3">
                  <span className="rotate-[-5deg] border border-signal/70 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-signal">
                    {copy.card.stamp}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-cream/30">
                    {copy.card.ready} · {copy.card.coverage}
                  </span>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
