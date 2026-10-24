"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { animate, motion, useReducedMotion } from "motion/react";
import type { Profile, UnderwritingResult } from "@/lib/types";
import { TYPE_LABEL } from "@/lib/profiles";
import { DECISION_LABEL, dateKo, pct } from "@/lib/format";
import { DECISION_LABEL_EN, TYPE_LABEL_EN, dateEn, krwEn } from "@/components/en/flow-data";
import { ProgressRail, ScoreBar } from "@/components/ui/bars";
import { ArrowLink, Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { wonPhrase } from "./format";
import { Kicker, SeverityChip, gradeTone } from "./ui";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function msLabel(ms: number): string {
  return `${Math.round(ms).toLocaleString("ko-KR")}ms`;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

/** Deterministic log reveal thresholds inside a single agent step. */
function logThresholds(count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [0.45];
  return Array.from({ length: count }, (_, i) => 0.2 + (0.68 * i) / (count - 1));
}

/** Number that counts up from zero the moment its block is revealed. */
function AnimatedNumber({
  value,
  decimals = 0,
  suffix = "",
  active,
  reduce,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  active: boolean;
  reduce: boolean | null;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!active) {
      setDisplay(0);
      return;
    }
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 0.55,
      ease: EASE,
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [active, value, reduce]);

  return (
    <span className="tnum">
      {display.toLocaleString("ko-KR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

type IngestRow = {
  key: string;
  label: string;
  note: string;
  kind: "matched" | "exception";
};

/**
 * Ingestion ledger: the checks behind the verdict.
 * Matched rows mirror verified evidence; the three exceptions are the
 * intentional cross-check failures the demo is designed around.
 */
function buildIngestRows(result: UnderwritingResult, profile: Profile): IngestRow[] {
  const matched: IngestRow[] = result.evidence
    .filter((item) => item.verified)
    .map((item) => ({
      key: item.id,
      label: item.label,
      note: item.source.split("·")[0].trim(),
      kind: "matched",
    }));
  const buyer = profile.customers[1] ?? profile.customers[0];
  const walletDays = buyer?.walletAgeDays ?? 0;
  const exceptions: IngestRow[] = [
    {
      key: "xchk-wallet",
      label: "buyer wallet age",
      note: walletDays > 0 ? `${walletDays}d` : "unverifiable",
      kind: "exception",
    },
    { key: "xchk-po", label: "PO amount mismatch", note: "cross-check", kind: "exception" },
    { key: "xchk-fx", label: "FX hedge missing", note: "hedge", kind: "exception" },
  ];
  return [...matched, ...exceptions];
}

function IngestionLedger({
  result,
  profile,
  elapsed,
  complete,
  reduce,
}: {
  result: UnderwritingResult;
  profile: Profile;
  elapsed: number;
  complete: boolean;
  reduce: boolean | null;
}) {
  const rows = useMemo(() => buildIngestRows(result, profile), [result, profile]);
  const matched = rows.filter((row) => row.kind === "matched").length;
  const exceptions = rows.length - matched;
  const spread = rows.length > 1 ? 1400 / (rows.length - 1) : 0;

  return (
    <div className="relative border-t border-line-dark bg-noir/40">
      <div className="flex items-center justify-between border-b border-line-dark/70 px-4 py-1.5 sm:px-5">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/55">
          Ingestion · ledger
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/45">
          PENDING → MATCHED
        </span>
      </div>
      <div>
        <ul>
          {rows.map((row, index) => {
            const appearAt = 120 + index * spread;
            const settled = complete || elapsed >= appearAt + 380;
            const visible = complete || elapsed >= appearAt;
            if (!visible) return null;
            const status = settled
              ? row.kind === "matched"
                ? "MATCHED"
                : "EXCEPTION"
              : "PENDING";
            return (
              <motion.li
                key={row.key}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="grid grid-cols-[5.4rem_minmax(0,1fr)_auto] items-center gap-2 border-b border-line-dark/40 px-4 py-1 font-mono text-[10px] sm:px-5"
              >
                <span
                  className={cn(
                    "uppercase tracking-[0.1em]",
                    status === "PENDING" && "text-cream/35",
                    status === "MATCHED" && "text-acid",
                    status === "EXCEPTION" && "text-signal",
                  )}
                >
                  {status}
                </span>
                <span className="truncate text-cream/55">{row.label}</span>
                <span className="truncate text-right text-cream/30">{row.note}</span>
              </motion.li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 border-t border-line-dark bg-noir-2/95 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-cream/55 sm:px-5">
        <span className="tnum">
          {String(rows.length).padStart(2, "0")} rows · {String(matched).padStart(2, "0")} matched ·{" "}
          {String(exceptions).padStart(2, "0")} exceptions
        </span>
        <span className={complete ? "text-acid/80" : "text-cream/25"}>
          {complete ? "sealed" : "streaming"}
        </span>
      </div>
    </div>
  );
}

export function UnderwritingRun({
  result,
  profile,
  locale = "ko",
}: {
  result: UnderwritingResult;
  profile: Profile;
  locale?: "ko" | "en";
}) {
  const en = locale === "en";
  /**
   * Animation cadence is derived from the engine's own recorded step durations,
   * normalised into the 1200–1460ms window the run is designed around.
   */
  const durations = useMemo(
    () =>
      result.agents.map((agent) =>
        Math.max(1200, Math.min(1460, 1200 + (Math.round(agent.durationMs) % 240))),
      ),
    [result.agents],
  );

  const starts = useMemo(() => {
    const out: number[] = [];
    let acc = 0;
    for (const d of durations) {
      out.push(acc);
      acc += d;
    }
    return out;
  }, [durations]);

  const totalMs =
    durations.length > 0 ? starts[starts.length - 1] + durations[durations.length - 1] : 0;
  const engineMs = result.agents.reduce((acc, agent) => acc + agent.durationMs, 0);

  const reduce = useReducedMotion();
  const [elapsed, setElapsed] = useState(0);
  const [complete, setComplete] = useState(false);
  const [paused, setPaused] = useState(false);
  const [runId, setRunId] = useState(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    elapsedRef.current = elapsed;
  }, [elapsed]);

  useEffect(() => {
    if (complete || paused) return;
    if (totalMs === 0) {
      setComplete(true);
      return;
    }
    if (reduce) {
      setElapsed(totalMs);
      setComplete(true);
      return;
    }
    const base = elapsedRef.current;
    const startedAt = Date.now();
    const id = window.setInterval(() => {
      const next = base + (Date.now() - startedAt);
      if (next >= totalMs) {
        setElapsed(totalMs);
        setComplete(true);
        window.clearInterval(id);
        return;
      }
      setElapsed(next);
    }, 70);
    return () => window.clearInterval(id);
  }, [totalMs, complete, reduce, paused, runId]);

  const skip = () => {
    setPaused(false);
    setElapsed(totalMs);
    setComplete(true);
  };

  const togglePause = () => {
    if (complete) return;
    setPaused((value) => !value);
  };

  const nextStep = () => {
    if (complete) return;
    const current = elapsedRef.current;
    const index = starts.findIndex((start, i) => current < start + durations[i]);
    if (index === -1) {
      setElapsed(totalMs);
      setComplete(true);
      return;
    }
    const boundary = starts[index] + durations[index];
    setPaused(true);
    setElapsed(Math.min(totalMs, boundary + 1));
    if (boundary + 1 >= totalMs) setComplete(true);
  };

  const replay = () => {
    elapsedRef.current = 0;
    setElapsed(0);
    setComplete(false);
    setPaused(false);
    setRunId((value) => value + 1);
  };

  const stepStates = result.agents.map((_, i) => {
    const done = complete || elapsed >= starts[i] + durations[i];
    const running = !done && elapsed >= starts[i];
    return { done, running };
  });
  const completedCount = stepStates.filter((step) => step.done).length;
  const railCurrent = complete
    ? result.agents.length
    : Math.min(completedCount, Math.max(0, result.agents.length - 1));

  const revealCoverage = complete || completedCount >= 1;
  const revealFlags = complete || completedCount >= 2;
  const revealScore = complete || completedCount >= 3;
  const revealFinal = complete || completedCount >= 4;

  const verifiedCount = result.evidence.filter((item) => item.verified).length;
  const highFlags = result.flags.filter((flag) => flag.severity === "high").length;
  const mediumFlags = result.flags.filter((flag) => flag.severity === "medium").length;
  const lowFlags = result.flags.length - highFlags - mediumFlags;
  const limitLabel =
    result.decision === "declined" || result.limitKrw <= 0
      ? en
        ? "Not approved"
        : "미승인"
      : en
        ? krwEn(result.limitKrw)
        : wonPhrase(result.limitKrw);
  const decisionLabel = en ? DECISION_LABEL_EN[result.decision] : DECISION_LABEL[result.decision];
  const typeLabel = en ? TYPE_LABEL_EN[result.type] : TYPE_LABEL[result.type];

  const decisionHint = en
    ? result.decision === "approved"
      ? "Full requested amount approved"
      : result.decision === "conditional"
        ? "Limit re-priced when conditions are met"
        : "Re-underwriting required"
    : result.decision === "approved"
      ? "요청액 전액 승인"
      : result.decision === "conditional"
        ? "조건 충족 시 재산정"
        : "재심사 필요";

  const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
  const durationLabel = en
    ? `engine ${seconds(engineMs)} · animation ~${seconds(totalMs)}`
    : `엔진 ${seconds(engineMs)} · 애니메이션 ~${seconds(totalMs)}`;

  return (
    <div className="relative min-h-dvh bg-noir text-cream">
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dot-grid-dark opacity-40 mask-fade-b"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04] mix-blend-overlay"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-10 pt-8 sm:px-8 md:pt-10">
        {/* breadcrumb */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.18em]"
        >
          {en ? (
            <span className="text-cream/20" aria-hidden>
              &nbsp;
            </span>
          ) : (
            <Link
              href="/underwrite"
              className="text-cream/40 transition-colors hover:text-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              ← Applicant desk
            </Link>
          )}
          <span className="text-cream/30">
            RUN_ID · <span className="text-acid/70">{result.passportId}</span>
          </span>
        </motion.div>

        {/* applicant header */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: EASE }}
          >
            <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
              <span className="text-acid">{typeLabel}</span>
              <span aria-hidden className="h-px w-6 bg-cream/20" />
              <span className="text-cream/35">
                {en
                  ? `${profile.location} · Est. ${profile.foundedYear}`
                  : `${profile.location} · 설립 ${profile.foundedYear}`}
              </span>
            </div>
            <h1 className="mt-4 text-[clamp(2.5rem,5.6vw,4.6rem)] font-extrabold leading-[1.15] tracking-[-0.015em] text-cream">
              {result.company}
            </h1>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-cream/55">
              {profile.tagline}
            </p>
          </motion.div>

          <motion.dl
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14, ease: EASE }}
            className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-3 border-t border-line-dark pt-4 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
          >
            <div className="col-span-2 sm:col-span-1">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/60">
                Requested
              </dt>
              <dd className="type-data mt-1.5 break-words text-[24px] font-extrabold leading-tight text-signal sm:text-[26px]">
                {en ? krwEn(result.requestedKrw) : wonPhrase(result.requestedKrw)}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/60">
                Tenor
              </dt>
              <dd className="type-data mt-1.5 text-[26px] font-semibold leading-none text-cream">
                {result.tenorDays}
                <span className="ml-1 font-sans text-[11px] tracking-normal text-cream/40">
                  {en ? "days" : "일"}
                </span>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/60">
                As of
              </dt>
              <dd className="mt-1.5 font-mono text-[13px] leading-none tnum text-cream/80">
                {en ? dateEn(result.issuedAt) : dateKo(result.issuedAt)}
              </dd>
            </div>
          </motion.dl>
        </div>

        {/* bank history */}
        <div className="mt-5 flex flex-col gap-1 border-l-2 border-signal/60 pl-3 sm:flex-row sm:items-baseline sm:gap-3">
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-signal">
            BANK_RESULT
          </span>
          <p className="max-w-3xl text-[12.5px] leading-relaxed text-cream/60">
            {profile.bankOutcome}
          </p>
        </div>

        {/* run rail */}
        <div className="mt-7 flex flex-col gap-3 border-t border-line-dark pt-4 sm:flex-row sm:items-center">
          <div
            role="status"
            aria-live="polite"
            aria-label={
              en
                ? `Underwriting progress ${Math.min(completedCount, result.agents.length)} / ${result.agents.length} steps`
                : `심사 진행 ${Math.min(completedCount, result.agents.length)} / ${result.agents.length} 단계`
            }
            className="min-w-0 flex-1"
          >
            <ProgressRail
              steps={result.agents.map((agent) => agent.agent)}
              current={railCurrent}
              inverse
            />
          </div>
          <div className="flex shrink-0 items-center gap-3 font-mono text-[10px] tracking-[0.14em] text-cream/40">
            <span className="tnum text-cream/70">
              {pad2(Math.min(completedCount, result.agents.length))} / {pad2(result.agents.length)}
            </span>
            <span
              aria-hidden
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                complete ? "bg-acid" : "animate-pulse-dot bg-signal",
              )}
            />
            <span className={complete ? "text-acid/80" : "text-signal/90"}>
              {complete ? "COMPLETE" : "RUNNING"}
            </span>
          </div>
        </div>

        {/* sticky verdict — decision, limit and APR are always in view */}
        <div className="sticky top-16 z-30 -mx-5 mt-5 border-y border-line-dark bg-noir-2 px-5 py-3 sm:-mx-8 sm:px-8">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
            <div className="min-w-[8.5rem]">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/60">
                {en ? "Decision" : "판정"}
              </p>
              {revealFinal ? (
                <>
                  <p className="mt-0.5 text-[18px] font-extrabold leading-tight text-cream">
                    {decisionLabel}
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] leading-tight text-cream/60">
                    {decisionHint}
                  </p>
                </>
              ) : (
                <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.1em] text-cream/50">
                  {en ? "Underwriting…" : "심사 중…"}
                </p>
              )}
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/60">
                Grade
              </p>
              <p
                className={cn(
                  "mt-0.5 text-[28px] font-extrabold leading-none",
                  revealFinal ? gradeTone(result.grade, "dark") : "text-cream/20",
                )}
              >
                {revealFinal ? result.grade : "—"}
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/60">
                {en ? "Approved limit" : "승인 한도"}
              </p>
              <p
                className={cn(
                  "type-data mt-0.5 text-[40px] font-semibold leading-[0.85]",
                  revealFinal ? "text-signal" : "text-cream/20",
                )}
              >
                {revealFinal ? limitLabel : "—"}
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/60">APR</p>
              <p
                className={cn(
                  "type-data mt-0.5 text-[34px] font-semibold leading-[0.85]",
                  revealFinal ? "text-cream" : "text-cream/20",
                )}
              >
                {revealFinal ? `${result.apr.toFixed(2)}%` : "—"}
              </p>
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <span className="hidden font-mono text-[10px] tracking-[0.06em] text-cream/45 sm:inline">
                {durationLabel}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream/55">
                {pad2(Math.min(completedCount, result.agents.length))} /{" "}
                {pad2(result.agents.length)}
              </span>
              {revealFinal ? (
                <Button
                  href={en ? `/en/passport/${result.profileId}` : `/passport/${result.profileId}`}
                  variant="primary"
                  size="sm"
                >
                  {en ? "Open the passport →" : "신용 여권 열기 →"}
                </Button>
              ) : (
                <Button
                  variant="outline-inverse"
                  size="sm"
                  onClick={skip}
                  className="h-8 font-mono text-[10px] uppercase tracking-[0.08em]"
                >
                  {en ? "Skip" : "건너뛰기"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.22fr)_minmax(0,1fr)] lg:items-start">
          {/* ── terminal ─────────────────────────────────────────── */}
          <section className="relative flex max-h-[360px] flex-col overflow-hidden border border-line-dark bg-noir-3">
            <h2 className="sr-only">{en ? "Agent run console" : "에이전트 실행 콘솔"}</h2>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage: "url('/art/agents-scan.webp')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="relative flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line-dark bg-noir-2/90 px-4 py-2.5 sm:px-5">
              <div className="flex min-w-0 items-center gap-2.5">
                <span aria-hidden className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  <span className="h-1.5 w-1.5 rounded-full bg-acid/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-cream/20" />
                </span>
                <span className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-cream/55">
                  RAIL // UW-ENGINE
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    "flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em]",
                    complete ? "text-acid" : paused ? "text-cream/70" : "text-signal",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      complete
                        ? "bg-acid"
                        : paused
                          ? "bg-cream/50"
                          : "animate-pulse-dot bg-signal",
                    )}
                  />
                  {complete ? "SIGNED OFF" : paused ? "PAUSED" : "RUNNING"}
                </span>
                <button
                  type="button"
                  onClick={togglePause}
                  disabled={complete}
                  className="h-7 border border-cream/25 px-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-cream/75 transition-colors hover:border-cream hover:text-cream disabled:opacity-40"
                >
                  {en ? "Pause" : "일시정지"}
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={complete}
                  className="h-7 border border-cream/25 px-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-cream/75 transition-colors hover:border-cream hover:text-cream disabled:opacity-40"
                >
                  {en ? "Step" : "한 단계"}
                </button>
                {complete ? (
                  <button
                    type="button"
                    onClick={replay}
                    className="h-7 border border-acid/40 px-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-acid/90 transition-colors hover:border-acid hover:text-acid"
                  >
                    {en ? "Replay" : "다시 실행"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={skip}
                    className="h-7 border border-cream/25 px-2.5 font-mono text-[10px] uppercase tracking-[0.08em] text-cream/75 transition-colors hover:border-cream hover:text-cream"
                  >
                    {en ? "Skip" : "건너뛰기"}
                  </button>
                )}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-label={en ? "Agent run log" : "에이전트 실행 로그"}
              className="relative"
            >
              <ol className="divide-y divide-line-dark/70">
                {result.agents.map((agent, i) => {
                  const state = stepStates[i];
                  const thresholds = logThresholds(agent.logs.length);
                  const progress = state.done
                    ? 1
                    : Math.max(0, Math.min(1, (elapsed - starts[i]) / durations[i]));
                  const visible = state.done
                    ? agent.logs.length
                    : thresholds.filter((threshold) => progress >= threshold).length;
                  return (
                    <li
                      key={agent.key}
                      className={cn(
                        "px-4 py-3.5 sm:px-5",
                        !state.done && !state.running && "opacity-30",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "font-mono text-[10px] uppercase tracking-[0.14em]",
                            state.done ? "text-acid/60" : state.running ? "text-acid" : "text-cream/25",
                          )}
                        >
                          {state.done ? "DONE" : state.running ? "RUN" : "WAIT"}
                        </span>
                        <span aria-hidden className="h-px w-3 bg-cream/20" />
                        <span className="font-mono text-[11.5px] font-semibold tracking-[0.2em] text-cream">
                          {agent.agent}
                        </span>
                        <span className="truncate font-mono text-[10px] text-cream/35">
                          {agent.role}
                        </span>
                        <span className="ml-auto shrink-0 font-mono text-[10px] tnum text-cream/45">
                          {state.done || state.running ? msLabel(agent.durationMs) : "—"}
                        </span>
                      </div>

                      {state.running && (
                        <div className="mt-2 h-px w-full bg-cream/10">
                          <motion.div
                            className="h-full bg-acid"
                            initial={false}
                            animate={{ width: `${Math.round(progress * 100)}%` }}
                            transition={{ duration: 0.12, ease: "linear" }}
                          />
                        </div>
                      )}

                      {visible > 0 && (
                        <ul className="mt-2.5 space-y-1.5">
                          {agent.logs.slice(0, visible).map((log, logIndex) => (
                            <motion.li
                              key={`${agent.key}-${logIndex}`}
                              initial={reduce ? false : { opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, ease: EASE }}
                              className="flex gap-2 font-mono text-[10.5px] leading-relaxed text-cream/70"
                            >
                              <span aria-hidden className="select-none text-signal/70">
                                ›
                              </span>
                              <span>{log}</span>
                            </motion.li>
                          ))}
                          {state.running && (
                            <li aria-hidden className="flex items-center gap-2">
                              <span className="text-signal/70">›</span>
                              <span className="inline-block h-2.5 w-1.5 animate-pulse bg-signal motion-reduce:animate-none" />
                            </li>
                          )}
                        </ul>
                      )}
                      {state.running && visible === 0 && (
                        <motion.p
                          initial={reduce ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-2 font-mono text-[10px] text-cream/30"
                        >
                          {en ? "Receiving evidence stream…" : "증거 스트림 수신 중…"}
                        </motion.p>
                      )}
                      {state.done && (
                        <p className="mt-1.5 flex gap-2 font-mono text-[10px] leading-relaxed text-cream/40">
                          <span aria-hidden className="text-acid/60">
                            →
                          </span>
                          <span>{agent.summary}</span>
                        </p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            <IngestionLedger
              result={result}
              profile={profile}
              elapsed={elapsed}
              complete={complete}
              reduce={reduce}
            />
            </div>

            <div className="relative flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-line-dark bg-noir-2/90 px-4 py-2 font-mono text-[10px] tracking-[0.1em] text-cream/60 sm:px-5">
              <span>{durationLabel}</span>
              <span className="tnum text-cream/70">
                T+{seconds(Math.min(elapsed, totalMs))} / {seconds(totalMs)}
              </span>
            </div>
          </section>

          {/* ── supporting metrics ───────────────────────────────── */}
          <aside className="relative flex flex-col border border-line-dark bg-noir-2">
            <h2 className="sr-only">{en ? "Underwriting verdict" : "심사 판정"}</h2>
            <p className="sr-only" role="status">
              {complete
                ? en
                  ? `Underwriting complete. ${decisionLabel}, grade ${result.grade}.`
                  : `심사 완료. ${decisionLabel}, 등급 ${result.grade}.`
                : en
                  ? `${completedCount} of ${result.agents.length} steps complete.`
                  : `진행 ${completedCount} / ${result.agents.length} 단계.`}
            </p>
            <div className="flex items-center justify-between border-b border-line-dark px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/60">
                {en ? "Live verdict" : "실시간 판정"}
              </span>
              <span className="font-mono text-[10px] tracking-[0.1em] text-cream/50">
                {result.passportId}
              </span>
            </div>

            <div className="divide-y divide-line-dark">
              {/* coverage */}
              <div className="px-4 py-3.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/60">
                    01 · {en ? "Evidence coverage" : "증거 커버리지"}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream/45">
                    {en
                      ? `Verified ${verifiedCount} / ${result.evidence.length}`
                      : `검증 ${verifiedCount} / ${result.evidence.length}`}
                  </span>
                </div>
                <p className="type-data mt-1.5 text-[36px] font-semibold leading-[0.9] text-cream">
                  {revealCoverage ? (
                    <AnimatedNumber
                      value={result.evidenceCoverage * 100}
                      decimals={1}
                      suffix="%"
                      active={revealCoverage}
                      reduce={reduce}
                    />
                  ) : (
                    <span className="text-cream/25">—</span>
                  )}
                </p>
                <ScoreBar
                  score={result.evidenceCoverage * 100}
                  max={100}
                  tone="acid"
                  track="dark"
                  className="mt-2"
                />
              </div>

              {/* flags */}
              <div className="px-4 py-3.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/60">
                    02 · {en ? "Risk flags" : "리스크 플래그"}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream/45">
                    {en
                      ? `High ${highFlags} · Medium ${mediumFlags}`
                      : `높음 ${highFlags} · 중간 ${mediumFlags}`}
                  </span>
                </div>
                <div className="mt-1.5 flex items-end justify-between gap-3">
                  <p className="type-data text-[36px] font-semibold leading-[0.9] text-cream">
                    {revealFlags ? (
                      <AnimatedNumber value={result.flags.length} active={revealFlags} reduce={reduce} />
                    ) : (
                      <span className="text-cream/25">—</span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    {revealFlags
                      ? result.flags.slice(0, 3).map((flag) => (
                          <SeverityChip
                            key={flag.code}
                            severity={flag.severity}
                            variant="dark"
                            locale={locale}
                          />
                        ))
                      : null}
                  </div>
                </div>
              </div>

              {/* score */}
              <div className="px-4 py-3.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/60">
                    03 · {en ? "Credit score" : "신용 점수"}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cream/45">
                    {result.components.length} components
                  </span>
                </div>
                <div className="mt-1.5 flex items-end justify-between gap-3">
                  <p className="type-data text-[36px] font-semibold leading-[0.9] text-cream">
                    {revealScore ? (
                      <AnimatedNumber
                        value={result.score}
                        decimals={1}
                        active={revealScore}
                        reduce={reduce}
                      />
                    ) : (
                      <span className="text-cream/25">—</span>
                    )}
                  </p>
                  <p className="pb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cream/50">
                    {en ? "Rule engine" : "규칙 엔진"}
                  </p>
                </div>
                <ScoreBar score={result.score} max={100} tone="cream" track="dark" className="mt-2" />
              </div>
            </div>

            <div className="border-t border-line-dark px-4 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/60">
                {en ? "Rationale" : "판정 근거"}
              </p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-cream/65">
                {result.decisionNote}
              </p>
              <p className="mt-3 break-words font-mono text-[10px] uppercase tracking-[0.08em] text-cream/45">
                {result.funding.receivableId} · {result.funding.chain} ·{" "}
                {result.funding.tokenStandard}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                <Button
                  href={en ? `/en/passport/${result.profileId}` : `/passport/${result.profileId}`}
                  variant="primary"
                  size="sm"
                  className="w-full"
                >
                  {en ? "Next: read the passport →" : "신용 여권 열기 →"}
                </Button>
                <Button
                  href={en ? "/en/underwrite" : "/underwrite"}
                  variant="outline-inverse"
                  size="sm"
                  className="w-full"
                >
                  {en ? "Run again" : "다시 심사"}
                </Button>
              </div>
            </div>
          </aside>
        </div>

        {/* deterministic strip */}
        <div className="mt-8 flex flex-col gap-5 border-t border-line-dark pt-5 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <Kicker tone="acid">DETERMINISTIC ENGINE</Kicker>
            <p className="mt-2 text-[13px] leading-relaxed text-cream/55">
              {en ? "Same input, same result. " : "같은 입력은 항상 같은 결과를 냅니다. "}
              <span className="text-cream/90">
                {en
                  ? "Every RAIL decision is computed by a rule-based engine."
                  : "RAIL의 판단은 규칙 기반 엔진이 계산합니다."}
              </span>
            </p>
            <p className="mt-1 font-mono text-[10px] leading-relaxed text-cream/55">
              {result.components.length} WEIGHTS ·{" "}
              {en ? dateEn(result.issuedAt) : dateKo(result.issuedAt)} · USD/KRW{" "}
              {result.market.usdKrw.toFixed(2)}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-2 md:items-end">
            <ArrowLink
              href={en ? `/en/passport/${result.profileId}` : `/passport/${result.profileId}`}
              inverse
            >
              {en ? "Open the Credit Passport" : "신용 여권 보기"}
            </ArrowLink>
            <ArrowLink href={en ? "/en/underwrite" : "/underwrite"} inverse>
              {en ? "Check another applicant" : "다른 지원자 심사"}
            </ArrowLink>
          </div>
        </div>
      </div>
    </div>
  );
}
