import type { Metadata } from "next";
import { ALL_RESULTS } from "@/lib/engine";
import { engineContextFromMarket, getMarketSnapshot } from "@/lib/market";
import {
  artifactV7Ko,
  demoV7Ko,
  heroV7Ko,
  proofV7Ko,
} from "@/components/landing/v7-copy";
import { V7Artifact, V7Hero, V7ProofCta } from "@/components/landing/v7";
import { V7Demo } from "@/components/landing/v7-demo";

export const metadata: Metadata = {
  title: "수출채권 팩토링 · RWA 신용 레일",
  description:
    "RAIL은 수출 정산·구매주문서·특허를 증거로 읽어 신용 여권을 발급하고, 승인된 수출채권을 토큰으로 발행합니다.",
};

/**
 * v7 "Quiet Confidence" landing — light porcelain, four acts, ≤6,000px.
 * Header anchors: #demo (demo), #case (proof), #passport (artifact).
 */
export default async function HomePage() {
  const market = await getMarketSnapshot();
  const results = ALL_RESULTS(engineContextFromMarket(market));

  return (
    <main className="bg-porcelain">
      <V7Hero copy={heroV7Ko} market={market} result={results[0]} />
      <V7Demo copy={demoV7Ko} results={results} />
      <V7Artifact copy={artifactV7Ko} result={results[0]} />
      <V7ProofCta copy={proofV7Ko} />
    </main>
  );
}
