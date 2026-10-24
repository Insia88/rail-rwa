import type { Metadata } from "next";
import { ALL_RESULTS } from "@/lib/engine";
import { engineContextFromMarket, getMarketSnapshot } from "@/lib/market";
import {
  caseFileEn,
  closingEn,
  demoPathEn,
  heroEn,
  liveUnderwriterEn,
  passportRwaEn,
  proofEn,
} from "@/components/en/copy";
import { EnBuildBand } from "@/components/en/build-band";
import { EnTrustBand } from "@/components/en/trust-band";
import { CaseFileBand } from "@/components/landing/case-file-band";
import { ClosingBand } from "@/components/landing/closing-band";
import { DemoPath } from "@/components/landing/demo-path";
import { HeroBand } from "@/components/landing/hero-band";
import { LiveTicker } from "@/components/landing/live-ticker";
import { LiveUnderwriter } from "@/components/landing/live-underwriter";
import { PassportRwaBand } from "@/components/landing/passport-rwa-band";
import { ProofBand } from "@/components/landing/proof-band";

export const metadata: Metadata = {
  title: { absolute: "RAIL — Credit for the cash flow banks can't read" },
  description:
    "Verified export cash flow becomes an explainable Credit Passport, then ERC-3643 receivables on Base. A Seoul demo, built by one human and seven agents.",
  alternates: { canonical: "/en" },
  openGraph: {
    title: "RAIL — Credit for the cash flow banks can't read",
    description:
      "An RWA credit rail for Korean exporters the bank file can't price. Live market data, a deterministic underwriting engine, and a public repo. Demo.",
    type: "website",
    locale: "en_US",
    url: "https://rail-rwa.vercel.app/en",
  },
};

/** Global-partner landing — same design system and bands as the KO page, EN copy. */
export default async function EnLandingPage() {
  const market = await getMarketSnapshot();
  const results = ALL_RESULTS(engineContextFromMarket(market));

  return (
    <main className="bg-noir" lang="en">
      <HeroBand copy={heroEn} market={market} result={results[0]} locale="en" />
      <LiveTicker market={market} results={results} variant="credit" locale="en" />
      <DemoPath copy={demoPathEn} />

      <CaseFileBand copy={caseFileEn} result={results[0]} locale="en" />
      <LiveUnderwriter copy={liveUnderwriterEn} results={results} locale="en" />
      <PassportRwaBand copy={passportRwaEn} results={results} />
      <ProofBand copy={proofEn} market={market} results={results} />

      <EnBuildBand />
      <EnTrustBand />
      <ClosingBand copy={closingEn} />
    </main>
  );
}
