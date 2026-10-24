import type { Metadata } from "next";
import { ALL_RESULTS } from "@/lib/engine";
import { engineContextFromMarket, getMarketSnapshot } from "@/lib/market";
import {
  artifactV7En,
  demoV7En,
  heroV7En,
  proofV7En,
} from "@/components/landing/v7-copy";
import { V7Artifact, V7Hero, V7ProofCta } from "@/components/landing/v7";
import { V7Demo } from "@/components/landing/v7-demo";

export const metadata: Metadata = {
  title: { absolute: "RAIL — Credit for the cash flow banks can't read" },
  description:
    "Verified export cash flow becomes an explainable Credit Passport, then ERC-3643 receivables on Base. A Seoul demo, built by one human and agents.",
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

/** EN landing — same 4 acts and components, native English copy. */
export default async function EnLandingPage() {
  const market = await getMarketSnapshot();
  const results = ALL_RESULTS(engineContextFromMarket(market));

  return (
    <main className="bg-porcelain" lang="en">
      <V7Hero copy={heroV7En} market={market} result={results[0]} locale="en" />
      <V7Demo copy={demoV7En} results={results} locale="en" />
      <V7Artifact copy={artifactV7En} result={results[0]} locale="en" />
      <V7ProofCta copy={proofV7En} />
    </main>
  );
}
