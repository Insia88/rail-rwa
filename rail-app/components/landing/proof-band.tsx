import Link from "next/link";
import type { MarketSnapshot, UnderwritingResult } from "@/lib/types";
import { Reveal } from "@/components/ui/motion";
import { dateKo, krwCompact, pct, usdCompact } from "@/lib/format";
import { cn } from "@/lib/cn";
import { SectionHead } from "./section-head";
import type { ProofCopy } from "./v4-types";

/**
 * Act 5 — proof of rail: live market metrics, the dated credit-events ledger,
 * and the runtime crew in a single trust block.
 */
export function ProofBand({
  copy,
  market,
  results,
}: {
  copy: ProofCopy;
  market: MarketSnapshot;
  results: UnderwritingResult[];
}) {
  const [r0, r1, r2] = results;
  const fx = market.usdKrw.toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  const date = dateKo(market.asOf);

  const metrics = [
    { label: copy.metricLabels[0], value: usdCompact(market.stablecoinMcapUsd) },
    { label: copy.metricLabels[1], value: fx },
    { label: copy.metricLabels[2], value: pct(market.benchmark.apr, 2) },
    { label: copy.metricLabels[3], value: usdCompact(market.rwa.rwaTotalUsd) },
  ];

  const events = [
    {
      name: copy.events[0],
      detail: `${r0.applicantName} · ${r0.grade} · ${krwCompact(r0.limitKrw)} · ${pct(r0.apr, 2)}`,
      doc: `PASSPORT ${r0.passportId}`,
    },
    {
      name: copy.events[1],
      detail: `${r0.funding.receivableId} · ${r0.funding.chain} · ${r0.funding.tokenStandard.split(" ")[0]}`,
      doc: "RECEIVABLE",
    },
    {
      name: copy.events[2],
      detail: `${r0.funding.fundedPct}% funded · ${r0.funding.pool} · ${r0.funding.maturityDate}`,
      doc: "FUNDING",
    },
    {
      name: copy.events[3],
      detail: `${r1.applicantName} · ${copy.decisions[r1.decision]} · ${krwCompact(r1.limitKrw)}`,
      doc: "RUN",
    },
    {
      name: copy.events[4],
      detail: `${r2.applicantName} · ${copy.decisions[r2.decision]} · ${krwCompact(r2.limitKrw)}`,
      doc: "RUN",
    },
    {
      name: copy.events[5],
      detail: `USD/KRW ${fx} · RWA ${usdCompact(market.rwa.rwaTotalUsd)} · ${pct(market.benchmark.apr, 2)}`,
      doc: "SNAPSHOT",
    },
  ];

  return (
    <section
      id="proof"
      className="relative scroll-mt-20 overflow-hidden border-y border-line-dark bg-noir-3 text-cream lg:scroll-mt-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid-dark opacity-10" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHead
          index={copy.index}
          kicker={copy.kicker}
          title={copy.title}
          sub={copy.sub}
        />

        <Reveal delay={0.04}>
          <div className="mt-8 grid grid-cols-2 gap-px border-y border-line-dark bg-line-dark sm:grid-cols-4">
            {metrics.map((metric, i) => (
              <div key={metric.label} className="bg-noir-3 px-4 py-4">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={cn(
                      "h-1 w-1 rounded-full",
                      i < 2 ? "animate-pulse-dot bg-acid" : "bg-cream/20",
                    )}
                  />
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-cream/35">
                    {metric.label}
                  </p>
                </div>
                <p className="type-data mt-2 text-[clamp(1.4rem,2.2vw,1.9rem)] font-medium leading-none text-cream">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {copy.notes && copy.notes.length > 0 ? (
          <Reveal delay={0.05}>
            <ul className="mt-3 max-w-4xl space-y-1 border-l border-line-dark pl-4">
              {copy.notes.map((note) => (
                <li
                  key={note}
                  className="font-mono text-[9px] leading-relaxed tracking-[0.02em] text-cream/30"
                >
                  {note}
                </li>
              ))}
            </ul>
          </Reveal>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <Reveal delay={0.06}>
              <div className="flex items-center justify-between gap-3 border-b border-line-dark pb-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/40">
                  {copy.eventsLabel}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream/25">
                  {date} · {events.length} rows · FIXTURE
                </p>
              </div>
              <ol>
                {events.map((event, i) => (
                  <li
                    key={`${event.name}-${i}`}
                    className="grid gap-1 border-b border-line-dark py-3 md:grid-cols-[86px_minmax(0,1fr)_auto] md:items-baseline md:gap-4"
                  >
                    <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.1em] text-cream/25">
                      {date}
                    </span>
                    <p className="min-w-0">
                      <span className="text-[12.5px] font-semibold text-cream">{event.name}</span>
                      <span className="ml-2 text-[11.5px] text-cream/40">{event.detail}</span>
                    </p>
                    <span className="flex items-center justify-end gap-2 whitespace-nowrap">
                      <span className="inline-flex items-center border border-signal/35 bg-signal/10 px-1.5 py-[1px] font-mono text-[8px] uppercase tracking-[0.1em] text-signal/90">
                        SIM
                      </span>
                      <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-cream/25">
                        {event.doc}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.08}>
              <div className="flex items-center justify-between gap-3 border-b border-line-dark pb-2">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/40">
                  {copy.crewLabel}
                </p>
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-cream/25">
                  Runtime
                </span>
              </div>
              <ul>
                {copy.crew.map((agent) => {
                  const onCall = agent.status === "ON CALL";
                  return (
                    <li
                      key={agent.name}
                      className="flex items-center justify-between gap-3 border-b border-line-dark py-2.5"
                    >
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] tracking-[0.12em] text-cream">
                          {agent.name}
                        </span>
                        <span className="ml-2 text-[11px] text-cream/40">{agent.role}</span>
                      </div>
                      <span
                        className={cn(
                          "inline-flex shrink-0 items-center gap-1.5 border px-1.5 py-[2px] font-mono text-[8px] uppercase tracking-[0.12em]",
                          onCall
                            ? "border-signal/40 bg-signal/10 text-signal"
                            : "border-line-dark text-cream/30",
                        )}
                      >
                        <span
                          aria-hidden
                          className={cn(
                            "h-1 w-1 rounded-full",
                            onCall ? "bg-signal" : "bg-cream/25",
                          )}
                        />
                        {agent.status}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                <Link
                  href={copy.links.market.href}
                  className="link-underline font-mono text-[10px] uppercase tracking-[0.12em] text-cream/45 transition-colors duration-200 hover:text-cream"
                >
                  {copy.links.market.label} →
                </Link>
                <Link
                  href={copy.links.agents.href}
                  className="link-underline font-mono text-[10px] uppercase tracking-[0.12em] text-cream/45 transition-colors duration-200 hover:text-cream"
                >
                  {copy.links.agents.label} →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
