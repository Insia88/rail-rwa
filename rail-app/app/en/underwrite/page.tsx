import type { Metadata } from "next";
import Link from "next/link";
import type { Provenance } from "@/lib/types";
import { PROFILES } from "@/lib/profiles";
import { engineContextFromMarket, getMarketSnapshot } from "@/lib/market";
import { ALL_RESULTS } from "@/lib/engine";
import { TYPE_LABEL_EN, krwEn, krwFullEn, localizeProfile } from "@/components/en/flow-data";
import { Sparkline } from "@/components/ui/sparkline";
import { ProvenanceChip } from "@/components/flow/ui";

export const metadata: Metadata = {
  title: "Applicant desk — credit underwriting",
  description:
    "Four applicants the banks declined: exporters, a freelancer and a deep-tech team. Four RAIL agents verify on-chain evidence and issue a Credit Passport. Approvals and one decline, side by side.",
  alternates: { canonical: "/en/underwrite" },
};

const DECISION_LABEL = {
  approved: "Approved",
  conditional: "Conditional",
  declined: "Declined",
} as const;

const DECISION_CHIP = {
  approved: "bg-graphite text-white",
  conditional: "bg-vermilion-soft text-vermilion",
  declined: "bg-vermilion-soft text-vermilion",
} as const;

const PROVENANCE_LEGEND: { provenance: Provenance; label: string; body: string }[] = [
  {
    provenance: "onchain",
    label: "On-chain",
    body: "Wallet and settlement transactions. The strongest evidence in the file.",
  },
  {
    provenance: "platform",
    label: "Platform ledger",
    body: "Payout records read from a read-only API. Not editable; dependency is recorded.",
  },
  {
    provenance: "document",
    label: "Document",
    body: "Export declarations, tax invoices and contracts. OCR-matched, then cross-checked.",
  },
  {
    provenance: "self_reported",
    label: "Self-reported",
    body: "Founder statements and estimates. Not counted in the credit decision.",
  },
];

export default async function EnUnderwritePage() {
  const market = await getMarketSnapshot();
  const results = ALL_RESULTS(engineContextFromMarket(market));
  const resultByProfile = new Map(results.map((result) => [result.profileId, result]));
  const approvedCount = results.filter((result) => result.decision === "approved").length;
  const conditionalCount = results.filter((result) => result.decision === "conditional").length;
  const declinedCount = results.filter((result) => result.decision === "declined").length;

  return (
    <main className="min-h-dvh bg-porcelain pt-16 text-graphite">
      <div className="mx-auto w-full max-w-[1120px] px-6 pb-24 pt-14 sm:px-8">
        {/* hero */}
        <p className="text-[13px] font-medium text-graphite-3">Export receivable factoring · RWA</p>
        <h1 className="mt-3 max-w-[20ch] text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-graphite sm:text-[44px] lg:text-[54px]">
          Revenue the banks declined,
          <br />
          turned into credit.
        </h1>
        <p className="mt-4 max-w-2xl text-[17px] leading-[1.65] text-graphite-2">
          Pick an applicant. Four agents verify the evidence and return a verdict and a Credit
          Passport in 2.4 seconds. We show the declined file too.
        </p>

        {/* applicants */}
        <section aria-label="Applicant list" className="mt-12">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-[22px] font-semibold tracking-[-0.01em] text-graphite">
              Applicants
            </h2>
            <p className="text-[13px] text-graphite-3">
              {approvedCount + conditionalCount} approved · {declinedCount} declined
            </p>
          </div>

          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {PROFILES.map((baseProfile) => {
              const profile = localizeProfile(baseProfile);
              const result = resultByProfile.get(baseProfile.id);
              const decision = result?.decision ?? "conditional";
              const declined = decision === "declined";
              const inflow = baseProfile.monthlyInflowKrw;
              const latestInflow = inflow[inflow.length - 1] ?? 0;
              return (
                <article
                  key={profile.id}
                  className="flex h-full flex-col rounded-[24px] border border-hairline bg-surface p-6 shadow-card transition-shadow duration-300 hover:shadow-float"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] text-graphite-3">{TYPE_LABEL_EN[profile.type]}</p>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-medium ${DECISION_CHIP[decision]}`}
                    >
                      {DECISION_LABEL[decision]}
                    </span>
                  </div>

                  <h3 className="mt-3 text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-graphite">
                    {profile.name}
                  </h3>
                  <p className="mt-1.5 text-[14.5px] leading-[1.6] text-graphite-2">
                    {profile.tagline}
                  </p>

                  <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-hairline py-4">
                    <div>
                      <dt className="text-[13px] text-graphite-3">Requested</dt>
                      <dd className="mt-1 text-[26px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-graphite">
                        {krwEn(profile.requestedKrw)}
                      </dd>
                      <dd className="mt-1 text-[12px] tabular-nums text-graphite-3">
                        {krwFullEn(profile.requestedKrw)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[13px] text-graphite-3">Tenor</dt>
                      <dd className="mt-1 text-[26px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-graphite">
                        {profile.tenorDays}
                        <span className="ml-1 text-[13px] font-medium text-graphite-2">days</span>
                      </dd>
                      <dd className="mt-1 text-[12px] text-graphite-3">
                        Monthly avg{" "}
                        {krwEn(
                          Math.round(inflow.reduce((a, v) => a + v, 0) / (inflow.length || 1)),
                        )}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-4">
                    <div className="flex items-baseline justify-between">
                      <p className="text-[12.5px] text-graphite-3">Monthly settlement · 6 months</p>
                      <p className="text-[12.5px] tabular-nums text-graphite-3">
                        Latest {krwEn(latestInflow)}
                      </p>
                    </div>
                    <Sparkline
                      values={inflow}
                      width={280}
                      height={40}
                      className="mt-2 w-full"
                      stroke="#0a0b0d"
                      fill="#efeee9"
                    />
                  </div>

                  <div className="mt-4 flex-1">
                    <p className="text-[12.5px] text-graphite-3">Bank result</p>
                    <p className="mt-1 line-clamp-2 text-[13.5px] leading-[1.6] text-graphite-2">
                      {profile.bankOutcome}
                    </p>
                    {declined ? (
                      <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-medium text-vermilion">
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-vermilion" />
                        Declined for duplicate collateral
                        <span className="font-mono text-[12px] font-normal tabular-nums">
                          {baseProfile.hardDecline?.code ?? "E-DUP-PLEDGE"}
                        </span>
                      </p>
                    ) : null}
                    <p className="mt-2 text-[12.5px] text-graphite-3">
                      {declined
                        ? "Read the reason and the evidence in the passport"
                        : "2.4s agent run → Credit Passport"}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <Link
                      href={`/en/underwrite/${profile.id}`}
                      className="inline-flex h-11 items-center gap-2 rounded-full bg-graphite px-5 text-[14px] font-medium text-white transition-colors hover:bg-graphite/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermilion focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                    >
                      Run underwriting
                      <span aria-hidden>→</span>
                    </Link>
                    <span className="text-[12.5px] text-graphite-3">
                      {baseProfile.evidence.length} evidence items
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* provenance */}
        <section aria-labelledby="provenance-title" className="mt-16">
          <h2
            id="provenance-title"
            className="text-[22px] font-semibold tracking-[-0.01em] text-graphite"
          >
            Where evidence comes from
          </h2>
          <p className="mt-1.5 max-w-2xl text-[14px] leading-[1.6] text-graphite-2">
            Every source and verification state stays attached to the passport.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROVENANCE_LEGEND.map((item) => (
              <div
                key={item.provenance}
                className="rounded-[16px] border border-hairline bg-surface p-4"
              >
                <ProvenanceChip provenance={item.provenance} variant="light" locale="en" />
                <p className="mt-2 text-[14px] font-medium text-graphite">{item.label}</p>
                <p className="mt-1 text-[13px] leading-[1.6] text-graphite-2">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* footer links */}
        <div className="mt-12 flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/en/passport/hanbit"
              className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
            >
              Hanbit passport example
            </Link>
            <Link
              href="/en/market"
              className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
            >
              RWA market
            </Link>
          </div>
          <p className="text-[12.5px] text-graphite-3">
            RAIL is a demo. Applicant profiles are constructed and on-chain records are simulated.
          </p>
        </div>
      </div>
    </main>
  );
}
