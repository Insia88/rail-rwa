import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProfile } from "@/lib/profiles";
import { engineContextFromMarket, getMarketSnapshot } from "@/lib/market";
import { underwrite } from "@/lib/engine";
import { dateEn, krwEn, localizeProfile, localizeResult } from "@/components/en/flow-data";
import { PassportToolbar } from "@/components/flow/passport-toolbar";
import { PassportCover } from "@/components/flow/passport-cover";
import { EnPassportBody } from "@/components/en/passport-body";
import { ArrowLink } from "@/components/ui/button";

const BASE_URL = "https://rail-rwa.vercel.app";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) return { title: "Passport not found" };
  const en = localizeProfile(profile);
  return {
    title: `${en.company} — Credit Passport`,
    description: `${en.name}'s RAIL Credit Passport: the score, grade, limit and APR computed from on-chain evidence, plus the export-receivable RWA issuance plan.`,
    alternates: { canonical: `/en/passport/${id}` },
    openGraph: {
      title: `${en.company} — RAIL Credit Passport`,
      description:
        "The bank prices collateral. RAIL prices cash flow. A Credit Passport issued from on-chain evidence, with the receivable RWA certificate.",
      type: "article",
      locale: "en_US",
      url: `${BASE_URL}/en/passport/${id}`,
    },
  };
}

export default async function EnPassportPage({ params }: PageProps) {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) notFound();

  const market = await getMarketSnapshot();
  const base = underwrite(profile, engineContextFromMarket(market));
  const enProfile = localizeProfile(profile);
  const result = localizeResult(base, profile);
  const shareUrl = `${BASE_URL}/en/passport/${result.profileId}`;

  return (
    <main className="min-h-dvh bg-paper pt-16 text-ink">
      <div className="mx-auto w-full max-w-4xl px-4 pb-14 pt-6 sm:px-8 print:max-w-none print:px-0 print:pt-0">
        {/* toolbar */}
        <div className="no-print flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/en/underwrite"
              className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/65 transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            >
              ← Applicant desk
            </Link>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">
              Credit Passport · {result.passportId} · Issued {dateEn(result.issuedAt)}
            </p>
          </div>
          <PassportToolbar
            locale="en"
            shareUrl={shareUrl}
            data={result}
            filename={`rail-passport-${result.passportId}.json`}
            shareTitle={`${result.company} — RAIL Credit Passport`}
            shareText={`${result.company}'s RAIL Credit Passport · grade ${result.grade} · limit ${krwEn(result.limitKrw)} · APR ${result.apr.toFixed(2)}%`}
          />
        </div>

        {/* artifact */}
        <article className="mt-5 border border-ink/20 bg-paper print:border-0">
          <PassportCover result={result} profile={enProfile} locale="en" />
          <EnPassportBody result={result} profile={enProfile} />
        </article>

        {/* bottom navigation */}
        <div className="no-print mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/20 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink/60">
            Issued by RAIL · deterministic underwriting engine
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <ArrowLink href="/en/underwrite">Run another underwriting</ArrowLink>
            <ArrowLink href="/en/market">View market data</ArrowLink>
          </div>
        </div>
      </div>
    </main>
  );
}
