import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/profiles";
import { engineContextFromMarket, getMarketSnapshot } from "@/lib/market";
import { underwrite } from "@/lib/engine";
import { localizeProfile, localizeResult } from "@/components/en/flow-data";
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
    <main className="min-h-dvh bg-porcelain pt-16 text-graphite">
      <UnderwritingRun result={result} profile={enProfile} locale="en" />
    </main>
  );
}
