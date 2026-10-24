"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { UnderwritingResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { krwCompact, pct } from "@/lib/format";
import { SectionHead } from "./section-head";
import type { LiveUnderwriterCopy } from "./v4-types";

type Phase = "idle" | "running" | "done";

const STEP_MS = 600;

/**
 * Act 3 — live underwriter. Pick one of the three applicants, run the four
 * agents in place, and get the verdict without leaving the page.
 * All results are precomputed on the server and passed as props.
 */
export function LiveUnderwriter({
  copy,
  results,
  locale = "ko",
}: {
  copy: LiveUnderwriterCopy;
  results: UnderwritingResult[];
  locale?: "ko" | "en";
}) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => clear, []);

  useEffect(() => {
    clear();
    setPhase("idle");
    setStep(0);
  }, [active]);

  const result = results[active];
  const running = phase === "running";
  const done = phase === "done";

  const run = () => {
    clear();
    if (reduce) {
      setStep(4);
      setPhase("done");
      return;
    }
    setPhase("running");
    setStep(0);
    for (let i = 1; i <= 4; i++) {
      timers.current.push(window.setTimeout(() => setStep(i), i * STEP_MS));
    }
    timers.current.push(window.setTimeout(() => setPhase("done"), 4 * STEP_MS + 150));
  };

  const statusLabel = (i: number): string => {
    if (done || i < step) return "DONE";
    if (running && i === step) return "RUN";
    return "WAIT";
  };

  return (
    <section
      id="run"
      className="relative scroll-mt-20 overflow-hidden border-y border-line-dark bg-noir text-cream lg:scroll-mt-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid-dark opacity-15" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHead
          index={copy.index}
          kicker={copy.kicker}
          title={copy.title}
          sub={copy.sub}
        />

        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label={copy.title}>
          {results.map((item, i) => (
            <button
              key={item.profileId}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "border px-3.5 py-2 text-left transition-colors duration-200 focus-visible:outline-none",
                i === active
                  ? "border-cream/45 bg-cream/5"
                  : "border-line-dark hover:border-cream/25",
              )}
            >
              <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-cream">
                {copy.tabLabels?.[item.profileId] ?? item.applicantName}
              </span>
              <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.1em] text-cream/35">
                {copy.typeLabels[item.type]}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-px border border-line-dark bg-line-dark lg:grid-cols-12">
          {/* agent console */}
          <div className="bg-noir p-5 lg:col-span-7 lg:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-line-dark pb-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/40">
                {copy.agents}
              </span>
              <span
                className={cn(
                  "font-mono text-[9px] uppercase tracking-[0.14em]",
                  done ? "text-cream/60" : running ? "text-signal" : "text-cream/25",
                )}
              >
                {done ? "4 / 4" : `${step} / 4`}
              </span>
            </div>

            <ol className="mt-1">
              {result.agents.map((agent, i) => {
                const state = statusLabel(i);
                return (
                  <li
                    key={agent.key}
                    className="grid grid-cols-[86px_1fr] gap-3 border-b border-line-darker py-2.5 last:border-b-0"
                  >
                    <div>
                      <p
                        className={cn(
                          "font-mono text-[10px] tracking-[0.12em]",
                          state === "WAIT" ? "text-cream/25" : "text-cream",
                        )}
                      >
                        {agent.agent}
                      </p>
                      <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-cream/25">
                        {agent.role}
                      </p>
                    </div>
                    <div className="min-w-0">
                      {state === "WAIT" ? (
                        <p className="font-mono text-[10px] leading-relaxed text-cream/15">
                          {copy.logs}
                        </p>
                      ) : (
                        <p className="font-mono text-[10px] leading-relaxed text-cream/55">
                          <span
                            className={state === "RUN" ? "text-signal" : "text-cream/30"}
                            aria-hidden
                          >
                            {state === "RUN" ? "▍" : "✓"}{" "}
                          </span>
                          {copy.progressLabels?.[agent.key] ?? agent.logs[0]}
                        </p>
                      )}
                      {state === "DONE" ? (
                        <p className="mt-0.5 truncate font-mono text-[9px] text-cream/30">
                          {agent.summary}
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button onClick={run} size="md">
                {running ? copy.running : done ? copy.again : copy.run}
              </Button>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream/25">
                {copy.bankBadge}
              </span>
            </div>
          </div>

          {/* verdict */}
          <div className="bg-noir p-5 lg:col-span-5 lg:p-6" aria-live="polite">
            {phase === "idle" ? (
              <p className="max-w-xs font-mono text-[11px] leading-[1.8] text-cream/35">
                {copy.idle}
              </p>
            ) : (
              <div className={cn("transition-opacity duration-300", done ? "opacity-100" : "opacity-70")}>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/35">
                  {copy.verdict}
                </p>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="type-data text-[48px] font-medium leading-none text-cream">
                    {done ? result.grade : "··"}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-signal">
                    {done ? copy.decisions[result.decision] : copy.running}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 border-t border-line-dark">
                  {[
                    {
                      label: copy.limit,
                      value: done
                        ? locale === "en"
                          ? `KRW ${Math.round(result.limitKrw / 1e6)}M`
                          : `${krwCompact(result.limitKrw)}원`
                        : "··",
                    },
                    { label: copy.apr, value: done ? pct(result.apr, 2) : "··" },
                  ].map((row) => (
                    <div key={row.label} className="border-b border-line-dark py-2.5 odd:pr-4">
                      <dt className="font-mono text-[8px] uppercase tracking-[0.14em] text-cream/25">
                        {row.label}
                      </dt>
                      <dd className="type-data mt-1 text-[18px] font-medium leading-none text-cream">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {done ? (
                  <div className="mt-4">
                    <Link
                      href={`${locale === "en" ? "/en" : ""}/passport/${result.profileId}`}
                      className="group inline-flex items-center gap-1.5 border border-cream/25 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cream/70 transition-colors duration-200 hover:border-cream hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60"
                    >
                      {copy.profileLink}
                      <span
                        aria-hidden
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                    {copy.readingHint ? (
                      <p className="mt-3 font-mono text-[9px] leading-relaxed tracking-[0.02em] text-cream/30">
                        {copy.readingHint}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {copy.disclaimer ? (
          <p className="mt-3 font-mono text-[9px] leading-relaxed tracking-[0.04em] text-cream/25">
            {copy.disclaimer}
          </p>
        ) : null}
      </div>
    </section>
  );
}
