"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { UnderwritingResult } from "@/lib/types";
import { cn } from "@/lib/cn";
import { displayName } from "./v7";
import { krwCompact, pct } from "@/lib/format";
import { Reveal } from "@/components/ui/motion";
import type { V7DemoCopy } from "./v7-copy";

type Phase = "idle" | "running" | "done";
type Locale = "ko" | "en";

const STEP_MS = 600;

function limitText(limitKrw: number, locale: Locale) {
  return locale === "en" ? `KRW ${Math.round(limitKrw / 1e6)}M` : `${krwCompact(limitKrw)}원`;
}

function typeLabel(type: string, locale: Locale) {
  const ko: Record<string, string> = {
    exporter: "수출 중소기업",
    freelancer: "프리랜서",
    deeptech: "딥테크",
  };
  const en: Record<string, string> = {
    exporter: "Exporter",
    freelancer: "Freelancer",
    deeptech: "Deep tech",
  };
  return (locale === "en" ? en : ko)[type] ?? type;
}

/** Act 2 — Demo: light inline underwriting, one viewport, no page navigation. */
export function V7Demo({
  copy,
  results,
  locale = "ko",
}: {
  copy: V7DemoCopy;
  results: UnderwritingResult[];
  locale?: Locale;
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
  const approved = results.filter((r) => r.decision !== "declined").length;
  const declined = results.filter((r) => r.decision === "declined").length;

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

  const status = (i: number): "wait" | "run" | "done" =>
    done || i < step ? "done" : running && i === step ? "run" : "wait";

  return (
    <section id="demo" className="scroll-mt-24 border-y border-hairline bg-surface">
      <div className="mx-auto w-full max-w-[1120px] px-6 py-20 lg:py-24">
        <Reveal>
          <p className="text-[13px] text-graphite-3">{copy.label}</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-[1.2] tracking-[-0.03em] text-graphite">
            {copy.title}
          </h2>
          <p className="mt-4 max-w-xl text-[17px] leading-[1.65] text-graphite-2">{copy.sub}</p>
          <p className="mt-2 text-[13px] text-graphite-3">
            {locale === "en"
              ? `Approved ${approved} · Declined ${declined}`
              : `승인 ${approved} · 거절 ${declined}`}
          </p>
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center gap-2" role="tablist" aria-label={copy.title}>
          {results.map((item, i) => (
            <button
              key={item.profileId}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                "rounded-full border px-4 py-2.5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                i === active
                  ? "border-graphite bg-graphite text-white"
                  : "border-hairline bg-surface text-graphite-2 hover:border-hairline-2",
              )}
            >
              <span className="block text-[14px] font-medium leading-tight">{displayName(item, locale)}</span>
              <span
                className={cn(
                  "mt-0.5 block text-[13px]",
                  i === active ? "text-white/60" : "text-graphite-3",
                )}
              >
                {typeLabel(item.type, locale)}
              </span>
            </button>
          ))}

          <button
            type="button"
            onClick={run}
            disabled={running}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-graphite px-6 py-3.5 text-[15px] font-medium text-white transition-colors duration-200 hover:bg-graphite/85 disabled:cursor-default disabled:bg-graphite/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface sm:mt-0 sm:ml-auto sm:w-auto"
          >
            {running ? copy.running : done ? copy.again : copy.run}
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <div>
            <div className="flex items-center justify-between border-b border-hairline pb-3">
              <p className="text-[13px] text-graphite-3">{copy.progress}</p>
              <p className="text-[13px] text-graphite-3">
                {done ? "4 / 4" : `${step} / 4`}
              </p>
            </div>
            <ol className="mt-2" aria-live="polite">
              {result.agents.map((agent, i) => {
                const state = status(i);
                return (
                  <li
                    key={agent.key}
                    className="grid grid-cols-[14px_1fr] gap-3 border-b border-hairline py-3.5 last:border-b-0"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "mt-[7px] h-1.5 w-1.5 rounded-full",
                        state === "done"
                          ? "bg-graphite"
                          : state === "run"
                            ? "bg-vermilion"
                            : "bg-hairline-2",
                      )}
                    />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <p
                          className={cn(
                            "text-[15px] font-medium",
                            state === "wait" ? "text-graphite-3" : "text-graphite",
                          )}
                        >
                          {agent.agent}
                        </p>
                        <p className="text-[13px] text-graphite-3">{copy.agents[i] ?? agent.role}</p>
                      </div>
                      <p className="mt-1 text-[13px] leading-[1.55] text-graphite-2">
                        {state === "wait"
                          ? "—"
                          : state === "run"
                            ? agent.logs[0]
                            : agent.summary}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div
            className="rounded-[var(--radius-card)] border border-hairline bg-surface p-6 shadow-[var(--shadow-card)]"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-3 border-b border-hairline pb-4">
              <p className="text-[13px] text-graphite-3">{copy.verdict}</p>
              <span className="rounded-full border border-hairline px-2.5 py-1 text-[13px] text-graphite-2">
                {locale === "en" ? "Grade" : "등급"} {done ? result.grade : "—"}
              </span>
            </div>

            <p className="mt-5 text-[20px] font-semibold tracking-[-0.02em]">
              <span
                className={cn(
                  done ? (result.decision === "declined" ? "text-graphite-2" : "text-vermilion") : "text-graphite-3",
                )}
              >
                {done ? copy.decisions[result.decision] : running ? copy.running : "—"}
              </span>
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 border-t border-hairline pt-5">
              <div>
                <dt className="text-[13px] text-graphite-3">{copy.limit}</dt>
                <dd className="mt-1 text-[clamp(1.5rem,3vw,2.5rem)] font-semibold leading-none tracking-[-0.03em] text-graphite">
                  {done ? limitText(result.limitKrw, locale) : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[13px] text-graphite-3">{copy.apr}</dt>
                <dd className="mt-1 text-[clamp(1.3rem,2.3vw,1.9rem)] font-semibold leading-none tracking-[-0.03em] text-graphite">
                  {done ? pct(result.apr, 2) : "—"}
                </dd>
              </div>
              <div className="col-span-2 flex items-baseline justify-between border-t border-hairline pt-4">
                <dt className="text-[13px] text-graphite-3">{copy.evidence}</dt>
                <dd className="text-[18px] font-semibold text-graphite">
                  {done ? pct(result.evidenceCoverage * 100, 1) : "—"}
                </dd>
              </div>
            </dl>

            {done ? (
              <div className="mt-6 border-t border-hairline pt-4">
                <Link
                  href={`${locale === "en" ? "/en" : ""}/passport/${result.profileId}`}
                  className="inline-flex items-center gap-1 text-[15px] font-medium text-graphite underline decoration-hairline-2 underline-offset-4 transition-colors duration-200 hover:text-vermilion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion/40"
                >
                  {copy.passportLink} <span aria-hidden>→</span>
                </Link>
                <p className="mt-2 text-[13px] leading-[1.55] text-graphite-3">{copy.hint}</p>
              </div>
            ) : null}
          </div>
        </div>

        <p className="mt-6 text-[12px] text-graphite-3">{copy.disclaimer}</p>
      </div>
    </section>
  );
}
