import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/motion";
import { ART } from "./art";
import { SectionKicker } from "./section-head";
import type { ClosingCopy } from "./v4-types";

/** Act 6 — closing: exactly two doors. */
export function ClosingBand({ copy }: { copy: ClosingCopy }) {
  return (
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

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-20 text-center sm:px-8 sm:py-24 lg:py-28">
        <Reveal>
          <SectionKicker tone="orange" className="justify-center">
            {copy.kicker}
          </SectionKicker>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mx-auto mt-5 max-w-4xl text-[clamp(2.4rem,5vw,4.4rem)] font-black leading-[1.05] tracking-[-0.015em] text-ink">
            {copy.title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-3 font-serif-display text-[clamp(1.5rem,2.4vw,2.2rem)] italic leading-tight tracking-[-0.03em] text-ink/70">
            {copy.serif}
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-ink/75 sm:text-base">
            {copy.sub}
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={copy.primary.href}
              size="lg"
              className="bg-ink text-cream hover:bg-noir-2 hover:text-cream"
            >
              {copy.primary.label}
            </Button>
            <Button
              href={copy.secondary.href}
              size="lg"
              variant="outline"
              target={copy.secondary.external ? "_blank" : undefined}
            >
              {copy.secondary.label}
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.22}>
          {copy.contact ? (
            <p className="mt-8 font-mono text-[10px] leading-relaxed tracking-[0.02em] text-ink/55">
              {copy.contact.label}{" "}
              <a
                href={copy.contact.href}
                target="_blank"
                rel="noreferrer"
                className="link-underline text-ink/75 transition-colors duration-200 hover:text-ink"
              >
                github.com/Insia88/rail-rwa/issues
              </a>
            </p>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
