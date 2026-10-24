import Link from "next/link";
import type { UnderwritingResult } from "@/lib/types";
import { Reveal } from "@/components/ui/motion";
import { ART } from "./art";
import { PassportReel } from "./passport-reel";
import { SectionHead } from "./section-head";
import type { PassportRwaCopy } from "./v4-types";

/** Act 4 — passport × RWA: applicant reel and the five-step rail in one band. */
export function PassportRwaBand({
  copy,
  results,
}: {
  copy: PassportRwaCopy;
  results: UnderwritingResult[];
}) {
  return (
    <section
      id="passport"
      className="relative scroll-mt-20 overflow-hidden bg-paper text-ink lg:scroll-mt-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 paper-grid opacity-70" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-halftone opacity-[0.05]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <SectionHead
              index={copy.index}
              kicker={copy.kicker}
              tone="light"
              title={copy.title}
              sub={copy.sub}
            />

            <Reveal delay={0.06}>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/40">
                {copy.reelLabel}
              </p>
              <ol className="mt-3 border-t border-ink/25">
                {copy.steps.map((step, i) => (
                  <li
                    key={step.title}
                    className="grid grid-cols-[30px_1fr] gap-3 border-b border-ink/15 py-2.5"
                  >
                    <span className="type-data text-[11px] leading-[1.6] text-ink/35">
                      {`0${i + 1}`}
                    </span>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <span className="text-[13px] font-bold tracking-[-0.01em] text-ink">
                        {step.title}
                      </span>
                      <span className="text-[11.5px] leading-[1.5] text-ink/55">{step.body}</span>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.14em] text-ink/35">
                {copy.railLabel}
              </p>
              {copy.bullets && copy.bullets.length > 0 ? (
                <ul className="mt-5 grid gap-x-5 gap-y-3 border-t border-ink/20 pt-4 sm:grid-cols-2">
                  {copy.bullets.map((bullet) => (
                    <li key={bullet.title}>
                      <p className="text-[12px] font-bold tracking-[-0.01em] text-ink">
                        {bullet.title}
                      </p>
                      <p className="mt-1 text-[11px] leading-[1.55] text-ink/55">{bullet.body}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.08}>
              <div className="relative mx-auto w-full max-w-[460px]">
                <div
                  aria-hidden
                  className="absolute -inset-5 rotate-2 bg-cover bg-center opacity-20"
                  style={{ backgroundImage: `url(${ART.passportChrome})` }}
                />
                <div className="relative bg-noir p-3 sm:p-4">
                  <PassportReel results={results} />
                </div>
                <p className="mt-3 flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/40">
                  <span>{copy.dragLabel}</span>
                  <span>Rule engine output</span>
                </p>
                {copy.footnote ? (
                  <p className="mt-2 font-mono text-[9px] leading-relaxed tracking-[0.02em] text-ink/35">
                    {copy.footnote}
                  </p>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>

        {copy.nextLink ? (
          <Reveal delay={0.12}>
            <div className="mt-8 flex justify-end border-t border-ink/20 pt-4">
              <Link
                href={copy.nextLink.href}
                className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/55 transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/50"
              >
                {copy.nextLink.label}
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
