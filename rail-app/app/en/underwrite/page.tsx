import type { Metadata } from "next";
import type { Provenance } from "@/lib/types";
import { PROFILES } from "@/lib/profiles";
import { TYPE_LABEL_EN, krwEn, krwFullEn, localizeProfile } from "@/components/en/flow-data";
import { DemoIntro } from "@/components/en/demo-intro";
import { BorderTrail } from "@/components/flow/border-trail";
import { ProvenanceChip } from "@/components/flow/ui";
import { ArrowLink, Button } from "@/components/ui/button";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { Sparkline } from "@/components/ui/sparkline";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Applicant desk — credit underwriting",
  description:
    "Three applicants the banks already declined. Four RAIL agents verify their on-chain evidence and issue a Credit Passport.",
  alternates: { canonical: "/en/underwrite" },
};

function monthlyAverage(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((acc, value) => acc + value, 0) / values.length);
}

const RUN_PROTOCOL = [
  { agent: "SCOUT", role: "evidence collection" },
  { agent: "VERIFIER", role: "cross-verification" },
  { agent: "UNDERWRITER", role: "credit decision" },
  { agent: "BROKER", role: "liquidity matching" },
];

const PROVENANCE_LEGEND: { provenance: Provenance; label: string; body: string }[] = [
  {
    provenance: "onchain",
    label: "On-chain",
    body: "Wallet and settlement transactions. The strongest evidence in the file.",
  },
  {
    provenance: "platform",
    label: "Platform ledger",
    body: "Payout records read from a read-only API. Not editable; platform dependency is recorded separately.",
  },
  {
    provenance: "document",
    label: "Document",
    body: "Export declarations, tax invoices, contracts and test reports. OCR-matched, then cross-checked.",
  },
  {
    provenance: "self_reported",
    label: "Self-reported",
    body: "Founder statements and estimates. Not counted in the credit decision.",
  },
];

export default function EnUnderwritePage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-noir pt-16 text-cream">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 dot-grid-dark opacity-40 mask-fade-b"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04] mix-blend-overlay print:hidden"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-8 sm:px-8 md:pt-10">
        <DemoIntro
          step="01 · Applicant desk"
          purpose="Pick one of three applicants the banks declined. A deterministic four-agent run turns their evidence into a Credit Passport."
          hint="Each run ends in a verdict and a passport — no model call, no hidden step."
          next={{ href: "/en/underwrite/hanbit", label: "Start with Hanbit Electronics" }}
        />

        {/* hero */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <Stagger>
            <StaggerItem>
              <h1 className="text-[clamp(2.6rem,5.6vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.03em] text-cream">
                Whose credit
                <br />
                do we underwrite<span className="text-signal">?</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-6 max-w-xl text-[15px] leading-[1.8] text-cream/55">
                Three applicants the banks already declined. RAIL reads the cash flow, not the
                paperwork.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[10px] uppercase tracking-[0.18em] text-cream/35">
                <span>
                  <span className="text-signal">
                    {String(RUN_PROTOCOL.length).padStart(2, "0")}
                  </span>{" "}
                  agents
                </span>
                <span aria-hidden className="h-px w-6 bg-cream/15" />
                <span>4 agents · signed off</span>
                <span aria-hidden className="h-px w-6 bg-cream/15" />
                <span>deterministic engine</span>
              </div>
            </StaggerItem>
          </Stagger>

          {/* run protocol */}
          <div className="relative border border-line-dark bg-noir-2/80 p-5">
            <span aria-hidden className="absolute right-0 top-0 h-px w-12 bg-acid" />
            <div className="flex items-center justify-between">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-cream/35">
                Run protocol
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-acid/70">
                4 agents
              </p>
            </div>
            <ol className="mt-4">
              {RUN_PROTOCOL.map((step, index) => (
                <li
                  key={step.agent}
                  className="flex items-baseline gap-3 border-b border-line-dark py-2.5 last:border-b-0"
                >
                  <span className="font-mono text-[9px] tracking-[0.14em] text-signal">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.18em] text-cream">
                    {step.agent}
                  </span>
                  <span className="ml-auto font-mono text-[10px] text-cream/35">{step.role}</span>
                </li>
              ))}
            </ol>
            <p className="mt-3 border-t border-line-dark pt-2.5 font-mono text-[9px] uppercase leading-relaxed tracking-[0.16em] text-cream/25">
              4 agents · sequential · signed off
            </p>
          </div>
        </div>

        {/* applicant cards */}
        <section aria-label="Applicant list" className="mt-14 border-t border-signal/50 pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream/40">
              Select applicant
            </p>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-signal/70">
              Bank · rejected
            </span>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROFILES.map((baseProfile, index) => {
              const profile = localizeProfile(baseProfile);
              const verified = baseProfile.evidence.filter((item) => item.verified).length;
              const inflow = baseProfile.monthlyInflowKrw;
              const latestInflow = inflow[inflow.length - 1] ?? 0;
              return (
                <BorderTrail
                  key={profile.id}
                  className={cn("flex", index === 2 && "sm:col-span-2 lg:col-span-1")}
                >
                  <article className="group relative flex w-full flex-col overflow-hidden border border-line-dark bg-noir-2">
                    <div className="relative px-5 pt-5">
                      <span
                        aria-hidden
                        className="chrome-text pointer-events-none absolute right-4 top-3 select-none font-serif-display text-[54px] italic leading-none opacity-80"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/35">
                        {TYPE_LABEL_EN[profile.type]}
                      </p>
                      <h2 className="mt-3 max-w-[78%] text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em] text-cream">
                        {profile.name}
                      </h2>
                      <p className="mt-2 max-w-[88%] text-[12.5px] leading-relaxed text-cream/50">
                        {profile.tagline}
                      </p>
                    </div>

                    <div className="mt-5 border-y border-line-dark px-5 py-4">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/30">
                            Requested
                          </p>
                          <p className="type-data mt-1 text-[34px] font-bold leading-tight text-signal">
                            {krwEn(profile.requestedKrw)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/30">
                            Tenor
                          </p>
                          <p className="type-data mt-1 text-[28px] font-semibold leading-none text-cream">
                            {profile.tenorDays}
                            <span className="ml-1 font-sans text-[10px] tracking-normal text-cream/35">
                              days
                            </span>
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 truncate font-mono text-[9px] tnum text-cream/25">
                        {krwFullEn(profile.requestedKrw)}
                      </p>
                    </div>

                    <div className="border-b border-line-dark px-5 py-4">
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/30">
                          Monthly inflow · 6m
                        </p>
                        <p className="font-mono text-[9px] tnum text-cream/45">
                          Monthly avg {krwEn(monthlyAverage(inflow))}
                        </p>
                      </div>
                      <Sparkline
                        values={inflow}
                        width={280}
                        height={42}
                        className="mt-3 w-full"
                        stroke="#F2EDE2"
                        fill="#131A16"
                      />
                      <div className="mt-1.5 flex justify-between font-mono text-[8px] uppercase tracking-[0.16em] text-cream/20">
                        <span>Oldest</span>
                        <span className="tnum">Latest {krwEn(latestInflow)}</span>
                      </div>
                    </div>

                    <div className="border-b border-line-dark px-5 py-3.5">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-signal/70">
                        Bank result
                      </p>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-cream/40">
                        {profile.bankOutcome}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-col gap-3 px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1.5 border border-cream/20 px-2 py-[3px] font-mono text-[9px] uppercase leading-none tracking-[0.14em] text-cream/60">
                          Evidence {String(baseProfile.evidence.length).padStart(2, "0")}
                        </span>
                        <span className="inline-flex items-center gap-1.5 border border-acid/25 px-2 py-[3px] font-mono text-[9px] uppercase leading-none tracking-[0.14em] text-acid">
                          <span aria-hidden className="h-1 w-1 rounded-full bg-acid" />
                          Verified {String(verified).padStart(2, "0")}
                        </span>
                      </div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-cream/30">
                        4-agent run → Credit Passport
                      </p>
                      <Button
                        href={`/en/underwrite/${profile.id}`}
                        variant="primary"
                        size="md"
                        className="w-full justify-between"
                      >
                        <span>Run underwriting</span>
                        <span aria-hidden>→</span>
                      </Button>
                    </div>
                  </article>
                </BorderTrail>
              );
            })}
          </div>
        </section>

        {/* provenance legend */}
        <section
          aria-labelledby="provenance-title"
          className="mt-16 border-t border-line-dark pt-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2
              id="provenance-title"
              className="font-mono text-[10px] uppercase tracking-[0.24em] text-cream/45"
            >
              Provenance
            </h2>
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/25">
              Every source stays attached to the passport
            </span>
          </div>
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROVENANCE_LEGEND.map((item) => (
              <div key={item.provenance} className="border-t border-line-dark pt-4">
                <ProvenanceChip provenance={item.provenance} variant="dark" locale="en" />
                <p className="mt-2.5 text-[13px] font-semibold text-cream/85">{item.label}</p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-cream/40">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-line-dark pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <ArrowLink href="/en/passport/hanbit" inverse>
                Hanbit Electronics passport example
              </ArrowLink>
              <ArrowLink href="/en/market" inverse>
                RWA market weather
              </ArrowLink>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-cream/20">
              RAIL / Credit engine — Seoul
            </p>
          </div>
          <p className="mt-4 max-w-2xl font-mono text-[9px] leading-relaxed text-cream/25">
            RAIL is a demo. It is not a financial service; applicant profiles are constructed and
            on-chain records are simulated.
          </p>
        </section>
      </div>
    </main>
  );
}
