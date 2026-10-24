import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/profiles";
import { engineContextFromMarket, getMarketSnapshot } from "@/lib/market";
import { underwrite } from "@/lib/engine";
import { localizeProfile, localizeResult } from "@/components/en/flow-data";
import { DemoIntro } from "@/components/en/demo-intro";
import { UnderwritingRun } from "@/components/flow/underwriting-run";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) return { title: "Applicant not found" };
  const en = localizeProfile(profile);
  return {
    title: `${en.company} — underwriting run`,
    description: `${en.company} — ${en.tagline} Four RAIL agents verify the evidence and issue a Credit Passport.`,
    alternates: { canonical: `/en/underwrite/${id}` },
  };
}

export default async function EnUnderwritingRunPage({ params }: PageProps) {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) notFound();

  const market = await getMarketSnapshot();
  const base = underwrite(profile, engineContextFromMarket(market));
  const enProfile = localizeProfile(profile);
  const result = localizeResult(base, profile);

  return (
    <main className="relative bg-noir pt-16">
      <div className="mx-auto w-full max-w-6xl px-5 pt-6 sm:px-8">
        <DemoIntro
          step="02 · Underwriting run"
          purpose={`Four agents are underwriting ${enProfile.name}: collecting evidence, cross-checking claims, scoring the file and matching the receivable.`}
          hint="Watch the terminal and the live verdict. The passport opens when all four agents have signed off."          prev={{ href: "/en/underwrite", label: "Applicant desk" }}
          next={{ href: `/en/passport/${result.profileId}`, label: "Next: read the passport" }}
        />
      </div>
      <UnderwritingRun result={result} profile={enProfile} locale="en" />
    </main>
  );
}
