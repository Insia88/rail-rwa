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
    <main className="min-h-dvh bg-porcelain pt-16 text-graphite">
      <div className="mx-auto w-full max-w-[880px] px-5 pb-16 pt-8 sm:px-6">
        {/* toolbar */}
        <div className="no-print flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/en/underwrite"
              className="text-[13px] text-graphite-2 transition-colors hover:text-graphite"
            >
              ← Applicant desk
            </Link>
            <p className="mt-1 font-mono text-[12px] tabular-nums text-graphite-3">
              {result.passportId} · {dateEn(result.issuedAt)}
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

        {/* document */}
        <article className="mt-5 overflow-hidden rounded-[24px] border border-hairline bg-surface shadow-card print:rounded-none print:border-0 print:shadow-none">
          <PassportCover result={result} profile={enProfile} locale="en" />
          <EnPassportBody result={result} profile={enProfile} />
        </article>

        {/* bottom nav */}
        <div className="no-print mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
          <p className="text-[12.5px] text-graphite-3">Issued by RAIL · deterministic engine</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link
              href="/en/underwrite"
              className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
            >
              Run another underwriting
            </Link>
            <Link
              href="/en/market"
              className="text-[13.5px] text-graphite-2 transition-colors hover:text-graphite"
            >
              Market data
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
