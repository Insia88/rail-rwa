import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/profiles";
import { getMarketSnapshot, engineContextFromMarket } from "@/lib/market";
import { underwrite } from "@/lib/engine";
import { UnderwritingRun } from "@/components/flow/underwriting-run";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) return { title: "찾을 수 없는 지원자" };
  return {
    title: `${profile.name} 신용 심사`,
    description: `${profile.company} — ${profile.tagline} RAIL 에이전트 4개가 증거를 검증하고 신용 여권을 발급합니다.`,
  };
}

export default async function UnderwriteRunPage({ params }: PageProps) {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) notFound();

  const market = await getMarketSnapshot();
  const result = underwrite(profile, engineContextFromMarket(market));

  return (
    <main className="relative bg-noir pt-16">
      <UnderwritingRun result={result} profile={profile} />
    </main>
  );
}
