import { getMarketSnapshot, engineContextFromMarket } from "@/lib/market";
import { ALL_RESULTS } from "@/lib/engine";
import { CaseFileBand } from "@/components/landing/case-file-band";
import { ClosingBand } from "@/components/landing/closing-band";
import {
  caseFileKo,
  closingKo,
  demoPathKo,
  heroKo,
  liveUnderwriterKo,
  passportRwaKo,
  proofKo,
} from "@/components/landing/copy-ko";
import { DemoPath } from "@/components/landing/demo-path";
import { HeroBand } from "@/components/landing/hero-band";
import { LiveTicker } from "@/components/landing/live-ticker";
import { LiveUnderwriter } from "@/components/landing/live-underwriter";
import { PassportRwaBand } from "@/components/landing/passport-rwa-band";
import { ProofBand } from "@/components/landing/proof-band";

/**
 * v4 landing — 6 acts, action links ≤6, target height ≤6,300px @1440.
 * #case / #run / #passport / #proof are the deep-link ids used by the header.
 */
export default async function HomePage() {
  const market = await getMarketSnapshot();
  const results = ALL_RESULTS(engineContextFromMarket(market));

  return (
    <main className="bg-noir">
      <HeroBand copy={heroKo} market={market} result={results[0]} />
      <LiveTicker market={market} results={results} variant="credit" />
      <DemoPath copy={demoPathKo} />

      <CaseFileBand copy={caseFileKo} result={results[0]} />
      <LiveUnderwriter copy={liveUnderwriterKo} results={results} />
      <PassportRwaBand copy={passportRwaKo} results={results} />
      <ProofBand copy={proofKo} market={market} results={results} />

      <ClosingBand copy={closingKo} />
    </main>
  );
}
