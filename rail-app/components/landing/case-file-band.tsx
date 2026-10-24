import Link from "next/link";
import type { UnderwritingResult } from "@/lib/types";
import { krwCompact, pct } from "@/lib/format";
import { Reveal } from "@/components/ui/motion";
import { ART } from "./art";
import { SectionHead } from "./section-head";
import type { CaseFileCopy } from "./v4-types";

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => vars[key] ?? match);
}

/**
 * Act 2 — case file. The problem is told through one real applicant:
 * bank rejections, then evidence → verdict → RWA issuance.
 */
export function CaseFileBand({
  copy,
  result,
  locale = "ko",
}: {
  copy: CaseFileCopy;
  result: UnderwritingResult;
  locale?: "ko" | "en";
}) {
  const vars = {
    evidenceCount: String(result.evidence.length),
    coverage: pct(result.evidenceCoverage * 100, 1),
    grade: result.grade,
    score: result.score.toFixed(1),
    limit:
      locale === "en"
        ? `KRW ${Math.round(result.limitKrw / 1e6)}M`
        : `${krwCompact(result.limitKrw)}원`,
    apr: pct(result.apr, 2),
    flags: String(result.flags.length),
    receivableId: result.funding.receivableId,
    chain: result.funding.chain,
    tokenStandard: result.funding.tokenStandard.split(" ")[0],
    funded: `${result.funding.fundedPct}%`,
    maturity: result.funding.maturityDate,
    pool: result.funding.pool,
  };

  return (
    <section
      id="case"
      className="relative scroll-mt-20 overflow-hidden bg-signal text-ink lg:scroll-mt-24"
    >
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

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHead
          index={copy.index}
          kicker={copy.kicker}
          tone="orange"
          title={copy.title}
          sub={copy.sub}
        />

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <Reveal delay={0.06}>
              <div className="border-l-2 border-ink/70 pl-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/55">
                  {copy.bankLabel}
                </p>
                <p className="mt-2 max-w-xl text-[15px] font-medium leading-[1.6] text-ink">
                  {copy.bankValue}
                </p>
              </div>

              <div className="mt-8 grid gap-3 border-y-2 border-ink/70 py-5 sm:grid-cols-3 sm:gap-4 sm:py-6">
                {copy.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-baseline justify-between gap-3 sm:block"
                  >
                    <p className="type-data text-[clamp(1.5rem,2.6vw,2.1rem)] font-medium leading-none text-ink">
                      {fill(fact.value, vars)}
                    </p>
                    <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.1em] text-ink/60 sm:mt-2">
                      {fact.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <ol className="border-t border-ink/30">
              {copy.steps.map((step, i) => (
                <Reveal key={step.tag} delay={0.08 + i * 0.04}>
                  <li className="grid grid-cols-[40px_1fr] gap-4 border-b border-ink/20 py-4">
                    <span className="type-data text-[12px] leading-[1.6] text-ink/40">
                      {step.tag}
                    </span>
                    <div>
                      <p className="text-[15px] font-bold tracking-[-0.01em] text-ink">
                        {step.title}
                      </p>
                      <p className="mt-1 text-[12.5px] leading-[1.6] text-ink/70">
                        {fill(step.detail, vars)}
                      </p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>

        {copy.whyNow && copy.whyNow.length > 0 ? (
          <Reveal delay={0.18}>
            <div className="mt-10 grid gap-6 border-t border-ink/30 pt-5 sm:grid-cols-3">
              {copy.whyNow.map((item) => (
                <div key={item.label}>
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/55">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-[13px] font-medium leading-[1.6] text-ink">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}

        {copy.evidence && copy.evidence.length > 0 ? (
          <Reveal delay={0.16}>
            <div className="mt-10 border-t border-ink/30 pt-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink/55">
                {copy.evidenceLabel}
              </p>
              <ul className="mt-2">
                {copy.evidence.map((item) => (
                  <li
                    key={item.label}
                    className="grid gap-1 border-b border-ink/15 py-2 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-baseline md:gap-5"
                  >
                    <span className="min-w-0 text-[12px] text-ink/80">{item.label}</span>
                    <span className="type-data whitespace-nowrap text-[11px] text-ink/60">
                      {item.value}
                    </span>
                    <span className="whitespace-nowrap font-mono text-[8.5px] uppercase tracking-[0.1em] text-ink/45">
                      {item.provenance}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ) : null}

        {copy.runCta ? (
          <Reveal delay={0.2}>
            <div className="mt-8 flex justify-end border-t border-ink/25 pt-4">
              <Link
                href={copy.runCta.href}
                className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/65 transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/50"
              >
                {copy.runCta.label}
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </Link>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
