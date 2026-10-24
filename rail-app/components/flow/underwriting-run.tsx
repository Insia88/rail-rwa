"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import type { Profile, UnderwritingResult } from "@/lib/types";
import { TYPE_LABEL } from "@/lib/profiles";
import { DECISION_LABEL, dateKo, pct } from "@/lib/format";
import { DECISION_LABEL_EN, TYPE_LABEL_EN, dateEn, krwEn } from "@/components/en/flow-data";
import { cn } from "@/lib/cn";
import { wonPhrase } from "./format";
import { SeverityChip, gradeTone } from "./ui";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function logThresholds(count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [0.45];
  return Array.from({ length: count }, (_, i) => 0.2 + (0.68 * i) / (count - 1));
}

type IngestRow = {
  key: string;
  label: string;
  note: string;
  kind: "matched" | "exception";
};

function buildIngestRows(result: UnderwritingResult, profile: Profile, en: boolean): IngestRow[] {
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
      label: en ? "buyer wallet age" : "바이어 지갑 연령",
      note: walletDays > 0 ? `${walletDays}d` : en ? "unverifiable" : "확인 불가",
      kind: "exception",
    },
    {
      key: "xchk-po",
      label: en ? "PO amount mismatch" : "발주서 금액 불일치",
      note: en ? "cross-check" : "교차검증",
      kind: "exception",
    },
    {
      key: "xchk-fx",
      label: en ? "FX hedge missing" : "환헤지 누락",
      note: en ? "hedge" : "헤지",
      kind: "exception",
    },
  ];
  return [...matched, ...exceptions];
}

function IngestLedger({
  result,
  profile,
  elapsed,
  complete,
  reduce,
  en,
}: {
  result: UnderwritingResult;
  profile: Profile;
  elapsed: number;
  complete: boolean;
  reduce: boolean | null;
  en: boolean;
}) {
  const rows = useMemo(() => buildIngestRows(result, profile, en), [result, profile, en]);
  const matched = rows.filter((row) => row.kind === "matched").length;
  const exceptions = rows.length - matched;
  const spread = rows.length > 1 ? 1400 / (rows.length - 1) : 0;

  return (
    <div className="border-t border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-1.5 text-[12px] text-white/45 sm:px-5">
        <span>{en ? "Evidence ingestion" : "증거 수집"}</span>
        <span>{en ? "pending → matched" : "대기 → 일치"}</span>
      </div>
      <ul>
        {rows.map((row, index) => {
          const appearAt = 120 + index * spread;
          const settled = complete || elapsed >= appearAt + 380;
          const visible = complete || elapsed >= appearAt;
          if (!visible) return null;
          const status = settled
            ? row.kind === "matched"
              ? "matched"
              : "exception"
            : "pending";
          return (
            <motion.li
              key={row.key}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="grid grid-cols-[4.8rem_minmax(0,1fr)_auto] items-center gap-2 border-b border-white/[0.06] px-4 py-1 text-[12px] sm:px-5"
            >
              <span
                className={cn(
                  status === "pending" && "text-white/35",
                  status === "matched" && "text-white/70",
                  status === "exception" && "text-vermilion",
                )}
              >
                {status}
              </span>
              <span className="truncate text-white/55">{row.label}</span>
              <span className="truncate text-right text-white/30">{row.note}</span>
            </motion.li>
          );
        })}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 border-t border-white/10 px-4 py-1.5 text-[12px] text-white/45 sm:px-5">
        <span>
          {rows.length} {en ? "rows" : "행"} · {matched} {en ? "matched" : "일치"} · {exceptions}{" "}
          {en ? "exceptions" : "예외"}
        </span>
        <span className={complete ? "text-white/65" : "text-white/35"}>
          {complete ? (en ? "sealed" : "완료") : en ? "streaming" : "수집 중"}
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

  const revealCoverage = complete || completedCount >= 1;
  const revealFlags = complete || completedCount >= 2;
  const revealScore = complete || completedCount >= 3;
  const revealFinal = complete || completedCount >= 4;

  const declined = result.decision === "declined";
  const verifiedCount = result.evidence.filter((item) => item.verified).length;
  const highFlags = result.flags.filter((flag) => flag.severity === "high").length;
  const decisionLabel = en ? DECISION_LABEL_EN[result.decision] : DECISION_LABEL[result.decision];
  const typeLabel = en ? TYPE_LABEL_EN[result.type] : TYPE_LABEL[result.type];
  const limitLabel = declined
    ? en
      ? "KRW 0"
      : "0원"
    : en
      ? krwEn(result.limitKrw)
      : wonPhrase(result.limitKrw);
  const declineFlag = declined
    ? (result.flags.find((flag) => flag.code.startsWith("E-")) ?? result.flags[0])
    : undefined;
  const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
  const durationLabel = en
    ? `engine ${seconds(engineMs)} · animation ~${seconds(totalMs)}`
    : `엔진 ${seconds(engineMs)} · 애니메이션 ~${seconds(totalMs)}`;
  const passportHref = en ? `/en/passport/${result.profileId}` : `/passport/${result.profileId}`;
  const deskHref = en ? "/en/underwrite" : "/underwrite";
  const passportCta = declined
    ? en
      ? "See the reason in the passport →"
      : "여권에서 사유 보기 →"
    : en
      ? "Open the passport →"
      : "신용 여권 열기 →";

  return (
    <div className="min-h-dvh bg-porcelain pb-20 text-graphite">
      <div className="mx-auto w-full max-w-[1120px] px-5 pt-8 sm:px-8">
        <Link
          href={deskHref}
          className="text-[13px] text-graphite-2 transition-colors hover:text-graphite"
        >
          ← {en ? "Applicant desk" : "지원자 목록"}
        </Link>

        <header className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[13px] text-graphite-3">{typeLabel}</p>
            <h1 className="mt-2 text-[30px] font-semibold leading-[1.15] tracking-[-0.02em] text-graphite sm:text-[36px]">
              {result.company}
            </h1>
            <p className="mt-1.5 max-w-xl text-[14.5px] leading-[1.6] text-graphite-2">
              {profile.tagline}
            </p>
          </div>
          <dl className="grid shrink-0 grid-cols-2 gap-x-6 gap-y-2 border-t border-hairline pt-3 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div>
              <dt className="text-[12.5px] text-graphite-3">{en ? "Requested" : "요청 금액"}</dt>
              <dd className="mt-1 text-[15px] font-medium tabular-nums text-graphite">
                {en ? krwEn(result.requestedKrw) : wonPhrase(result.requestedKrw)}
              </dd>
            </div>
            <div>
              <dt className="text-[12.5px] text-graphite-3">{en ? "Tenor" : "기간"}</dt>
              <dd className="mt-1 text-[15px] font-medium tabular-nums text-graphite">
                {result.tenorDays}
                {en ? " days" : "일"}
              </dd>
            </div>
            <div>
              <dt className="text-[12.5px] text-graphite-3">{en ? "As of" : "기준일"}</dt>
              <dd className="mt-1 text-[15px] font-medium tabular-nums text-graphite">
                {en ? dateEn(result.issuedAt) : dateKo(result.issuedAt)}
              </dd>
            </div>
          </dl>
        </header>

        <p className="mt-4 line-clamp-2 text-[13px] leading-[1.6] text-graphite-3">
          <span className="text-graphite-2">{en ? "Bank result · " : "은행 결과 · "}</span>
          {profile.bankOutcome}
        </p>

        {/* sticky verdict */}
        <div className="sticky top-16 z-30 -mx-5 mt-5 bg-porcelain px-5 py-3 sm:-mx-8 sm:px-8">
          <div className="rounded-[24px] border border-hairline bg-surface p-4 shadow-card sm:p-5">
            <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
              <div className="min-w-[8rem]">
                <p className="text-[12.5px] text-graphite-3">{en ? "Decision" : "판정"}</p>
                {revealFinal ? (
                  <>
                    <p className="mt-1 text-[15px] font-semibold leading-tight text-graphite sm:text-[17px]">
                      {decisionLabel}
                    </p>
                    <p className="mt-0.5 text-[12.5px] leading-tight text-graphite-3">
                      {declined
                        ? `${declineFlag?.label ?? "중복 담보"} · ${declineFlag?.code ?? "E-DUP-PLEDGE"}`
                        : en
                          ? result.decision === "approved"
                            ? "Full amount approved"
                            : "Re-priced when conditions are met"
                          : result.decision === "approved"
                            ? "요청액 전액 승인"
                            : "조건 충족 시 재산정"}
                    </p>
                  </>
                ) : (
                  <p className="mt-1.5 text-[14px] text-graphite-2">
                    {en ? "Underwriting…" : "심사 중…"}
                  </p>
                )}
              </div>

              <div>
                <p className="text-[12.5px] text-graphite-3">Grade</p>
                <p
                  className={cn(
                    "mt-1 text-[28px] font-semibold leading-none",
                    revealFinal ? gradeTone(result.grade, "light") : "text-graphite-3/40",
                  )}
                >
                  {revealFinal ? result.grade : "—"}
                </p>
              </div>

              <div>
                <p className="text-[12.5px] text-graphite-3">
                  {en ? "Approved limit" : "승인 한도"}
                </p>
                <p
                  className={cn(
                    "mt-0.5 text-[32px] font-semibold leading-[0.95] tracking-[-0.03em] tabular-nums sm:text-[40px]",
                    revealFinal
                      ? declined
                        ? "text-graphite-3"
                        : "text-vermilion"
                      : "text-graphite-3/40",
                  )}
                >
                  {revealFinal ? limitLabel : "—"}
                </p>
                {revealFinal && declined ? (
                  <p className="text-[12px] text-vermilion">
                    {en ? "Limit 0 · declined" : "한도 0원 · 미승인"}
                  </p>
                ) : null}
              </div>

              <div>
                <p className="text-[12.5px] text-graphite-3">APR</p>
                <p
                  className={cn(
                    "mt-0.5 text-[26px] font-semibold leading-[0.95] tracking-[-0.02em] tabular-nums sm:text-[34px]",
                    revealFinal && !declined ? "text-graphite" : "text-graphite-3/40",
                  )}
                >
                  {revealFinal ? (declined ? "—" : `${result.apr.toFixed(2)}%`) : "—"}
                </p>
              </div>

              <div className="ml-auto flex flex-wrap items-center gap-2">
                <div className="mr-1 hidden w-28 flex-col gap-1 sm:flex">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-hairline">
                    <div
                      className="h-full rounded-full bg-graphite transition-[width] duration-200"
                      style={{
                        width: `${Math.round(
                          (Math.min(elapsed, totalMs) / Math.max(1, totalMs)) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-[12px] tabular-nums text-graphite-3">{durationLabel}</p>
                </div>
                <span className="text-[12.5px] tabular-nums text-graphite-3">
                  {pad2(Math.min(completedCount, result.agents.length))} /{" "}
                  {pad2(result.agents.length)}
                </span>
                {revealFinal ? (
                  <Link
                    href={passportHref}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-graphite px-4 text-[13.5px] font-medium text-white transition-colors hover:bg-graphite/90"
                  >
                    {passportCta}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={skip}
                    className="inline-flex h-10 items-center rounded-full border border-hairline-2 px-4 text-[13.5px] font-medium text-graphite-2 transition-colors hover:border-graphite hover:text-graphite"
                  >
                    {en ? "Skip" : "건너뛰기"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* console + summary */}
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <section className="flex max-h-[420px] flex-col overflow-hidden rounded-[24px] bg-[#0b0c0e] text-white/85">
            <h2 className="sr-only">{en ? "Underwriting console" : "심사 콘솔"}</h2>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3 sm:px-5">
              <span className="text-[13px] text-white/60">
                {en ? "Agent console" : "에이전트 콘솔"}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className={cn(
                    "mr-1 inline-flex items-center gap-1.5 text-[12.5px]",
                    complete ? "text-white/55" : paused ? "text-white/45" : "text-white/65",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      complete ? "bg-white/40" : paused ? "bg-white/35" : "bg-vermilion",
                    )}
                  />
                  {complete
                    ? en
                      ? "Signed off"
                      : "서명 완료"
                    : paused
                      ? en
                        ? "Paused"
                        : "일시정지"
                      : en
                        ? "Running"
                        : "심사 중"}
                </span>
                <button
                  type="button"
                  onClick={togglePause}
                  disabled={complete}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-[12.5px] text-white/70 transition-colors hover:border-white/40 hover:text-white disabled:opacity-40"
                >
                  {en ? "Pause" : "일시정지"}
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={complete}
                  className="rounded-full border border-white/15 px-3 py-1.5 text-[12.5px] text-white/70 transition-colors hover:border-white/40 hover:text-white disabled:opacity-40"
                >
                  {en ? "Step" : "한 단계"}
                </button>
                {complete ? (
                  <button
                    type="button"
                    onClick={replay}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-[12.5px] text-white/70 transition-colors hover:border-white/40 hover:text-white"
                  >
                    {en ? "Replay" : "다시 실행"}
                  </button>
                ) : null}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <ol>
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
                    <li key={agent.key} className="border-b border-white/[0.06] px-4 py-4 sm:px-5">
                      <div className="flex items-baseline justify-between gap-3">
                        <div className="min-w-0">
                          <p
                            className={cn(
                              "text-[14.5px] font-medium leading-tight",
                              state.done || state.running ? "text-white" : "text-white/40",
                            )}
                          >
                            {agent.agent}
                          </p>
                          <p className="mt-0.5 truncate text-[12.5px] text-white/40">
                            {agent.role}
                          </p>
                        </div>
                        <span className="shrink-0 font-mono text-[12px] tabular-nums text-white/35">
                          {state.done || state.running
                            ? `${(durations[i] / 1000).toFixed(1)}s`
                            : "—"}
                        </span>
                      </div>

                      {state.running ? (
                        <div className="mt-2 h-px w-full bg-white/10">
                          <div
                            className="h-full bg-white/60 transition-[width] duration-150"
                            style={{ width: `${Math.round(progress * 100)}%` }}
                          />
                        </div>
                      ) : null}

                      {visible > 0 ? (
                        <ul className="mt-2.5 space-y-1">
                          {agent.logs.slice(0, visible).map((log, logIndex) => (
                            <motion.li
                              key={`${agent.key}-${logIndex}`}
                              initial={reduce ? false : { opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.35, ease: EASE }}
                              className="font-mono text-[12.5px] leading-[1.7] text-white/60"
                            >
                              {log}
                            </motion.li>
                          ))}
                        </ul>
                      ) : null}

                      {state.done ? (
                        <p className="mt-1.5 text-[12.5px] leading-[1.6] text-white/45">
                          {agent.summary}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
              <IngestLedger
                result={result}
                profile={profile}
                elapsed={elapsed}
                complete={complete}
                reduce={reduce}
                en={en}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-1 border-t border-white/10 px-4 py-2 text-[12px] text-white/40 sm:px-5">
              <span>{durationLabel}</span>
              <span className="tabular-nums">
                T+{seconds(Math.min(elapsed, totalMs))} / {seconds(totalMs)}
              </span>
            </div>
          </section>

          {/* summary card */}
          <aside className="rounded-[24px] border border-hairline bg-surface p-5 shadow-card">
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-[15px] font-semibold text-graphite">
                {en ? "Underwriting summary" : "심사 요약"}
              </h2>
              <span className="font-mono text-[11.5px] tabular-nums text-graphite-3">
                {result.passportId}
              </span>
            </div>

            <dl className="mt-4 divide-y divide-hairline">
              <div className="flex items-baseline justify-between gap-3 py-2.5">
                <dt className="text-[13px] text-graphite-3">
                  {en ? "Evidence coverage" : "증거 커버리지"}
                </dt>
                <dd className="text-right">
                  <span className="text-[18px] font-semibold tabular-nums text-graphite">
                    {revealCoverage ? pct(result.evidenceCoverage * 100) : "—"}
                  </span>
                  <span className="ml-2 text-[12px] tabular-nums text-graphite-3">
                    {verifiedCount}/{result.evidence.length}
                  </span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 py-2.5">
                <dt className="text-[13px] text-graphite-3">{en ? "Risk flags" : "리스크"}</dt>
                <dd className="flex items-center gap-2">
                  {revealFlags ? (
                    <>
                      <span className="text-[18px] font-semibold tabular-nums text-graphite">
                        {result.flags.length}
                      </span>
                      {highFlags > 0 ? <SeverityChip severity="high" locale={locale} /> : null}
                    </>
                  ) : (
                    <span className="text-[18px] font-semibold text-graphite-3/40">—</span>
                  )}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3 py-2.5">
                <dt className="text-[13px] text-graphite-3">{en ? "Credit score" : "신용 점수"}</dt>
                <dd className="text-[18px] font-semibold tabular-nums text-graphite">
                  {revealScore ? result.score.toFixed(1) : "—"}
                </dd>
              </div>
            </dl>

            <p className="mt-3 text-[13px] leading-[1.65] text-graphite-2">
              {revealFinal
                ? result.decisionNote
                : en
                  ? "Four agents are collecting and cross-checking the evidence. The verdict appears above."
                  : "네 명의 에이전트가 증거를 수집·교차검증하고 있습니다. 판정은 위에서 갱신됩니다."}
            </p>

            <p className="mt-3 font-mono text-[11.5px] tabular-nums text-graphite-3">
              {result.funding.receivableId} · {result.funding.chain}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={passportHref}
                className={cn(
                  "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-graphite px-5 text-[13.5px] font-medium text-white transition-colors hover:bg-graphite/90",
                  !revealFinal && "pointer-events-none opacity-40",
                )}
                aria-disabled={!revealFinal}
              >
                {passportCta}
              </Link>
              <Link
                href={deskHref}
                className="inline-flex h-11 items-center justify-center rounded-full border border-hairline-2 px-5 text-[13.5px] font-medium text-graphite-2 transition-colors hover:border-graphite hover:text-graphite"
              >
                {en ? "Back to the desk" : "지원자 목록으로"}
              </Link>
            </div>
          </aside>
        </div>

        <p className="mt-6 text-[12.5px] leading-relaxed text-graphite-3">
          {en
            ? "Every number is computed by the rule engine; the same input always returns the same passport. Applicant profiles are constructed and on-chain records are simulated."
            : "모든 수치는 규칙 엔진이 계산합니다. 같은 입력은 항상 같은 여권을 만듭니다. 지원자 프로필은 구성되었고 온체인 기록은 시뮬레이션입니다."}
        </p>
      </div>
    </div>
  );
}
