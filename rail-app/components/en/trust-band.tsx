import { Reveal } from "@/components/ui/motion";
import { SectionHead } from "@/components/landing/section-head";
import { cn } from "@/lib/cn";

const ROWS = [
  {
    layer: "Market data",
    status: "Real",
    real: true,
    detail:
      "DefiLlama, Frankfurter/ECB, Hyperliquid and CoinGecko are fetched server-side, cached for 30 minutes, and replaced by a labelled fallback when a feed fails.",
  },
  {
    layer: "Underwriting engine",
    status: "Real",
    real: true,
    detail:
      "Deterministic TypeScript in lib/engine.ts, public in the repository. Same input, same passport.",
  },
  {
    layer: "Applicant profiles",
    status: "Simulated",
    real: false,
    detail:
      "Three personas shaped on Korean export-SME, freelancer and deeptech cash-flow patterns. Not real companies or people.",
  },
  {
    layer: "Credit decisions",
    status: "Engine-computed",
    real: true,
    detail:
      "Scores, grades, limits, APRs and covenants are computed from the simulated evidence. No real credit was extended.",
  },
  {
    layer: "Receivable RWA",
    status: "Simulated",
    real: false,
    detail:
      "Issuance, ERC-3643 token, investor list, funding and escrow are demo records. Nothing was deployed or funded.",
  },
  {
    layer: "Money movement",
    status: "None",
    real: false,
    detail:
      "No funds are raised, lent, or invested. RAIL is not a lender, broker-dealer, or investment adviser.",
  },
  {
    layer: "4.15% benchmark",
    status: "Research snapshot",
    real: false,
    detail:
      "Approximates tokenized Treasury yields as of October 2026. A labelled assumption, not a live rate.",
  },
] as const;

const REGULATORY = [
  "Token securities — amendments to the Electronic Securities Act and the Capital Markets Act passed the National Assembly on 15 January 2026; enforcement is expected in January 2027.",
  "Distribution — two consortia received preliminary approval for fractional-investment OTC venues in February 2026. RAIL is positioned as the issuance, evidence and underwriting layer, not as a venue.",
  "Near term — Financial Services Commission innovative financial services (sandbox) for receivable verification and brokerage.",
  "Settlement — USDC settlement runs through licensed partners inside existing FX and AML frameworks. KRW stablecoin legislation is still pending.",
] as const;

/** EN-only trust block — what is real vs simulated, plus the Korean regulatory path. */
export function EnTrustBand() {
  return (
    <section
      id="trust"
      className="relative scroll-mt-20 overflow-hidden border-y border-line-dark bg-noir text-cream lg:scroll-mt-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid-dark opacity-10" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHead
          index="06"
          kicker="Trust · for partners and reviewers"
          title="What is real, and what is simulated."
          sub="The engine is real. The applicants are not. Here is the line, drawn precisely."
        />

        <Reveal delay={0.06}>
          <ul className="mt-10 border-t border-line-dark">
            {ROWS.map((row) => (
              <li
                key={row.layer}
                className="grid gap-1.5 border-b border-line-dark py-3 md:grid-cols-[170px_130px_minmax(0,1fr)] md:items-baseline md:gap-5"
              >
                <span className="text-[12.5px] font-semibold text-cream">{row.layer}</span>
                <span
                  className={cn(
                    "inline-flex w-fit items-center gap-1.5 border px-2 py-[2px] font-mono text-[8.5px] uppercase tracking-[0.12em]",
                    row.real
                      ? "border-acid/30 bg-acid/10 text-acid"
                      : "border-signal/35 bg-signal/10 text-signal/90",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn("h-1 w-1 rounded-full", row.real ? "bg-acid" : "bg-signal/80")}
                  />
                  {row.status}
                </span>
                <span className="min-w-0 text-[11.5px] leading-[1.6] text-cream/45">
                  {row.detail}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/40">
              Regulatory path · Korea
            </p>
            <ul className="mt-3 space-y-2 border-t border-line-dark pt-3">
              {REGULATORY.map((line) => (
                <li key={line} className="text-[11.5px] leading-[1.65] text-cream/50">
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-5">
            <div className="border-l border-signal/40 pl-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-signal/90">
                Licence status
              </p>
              <p className="mt-2 text-[12px] leading-[1.7] text-cream/55">
                RAIL holds no financial licence. The production model is infrastructure: RAIL provides
                underwriting, evidence and issuance; licensed institutions and LPs provide capital.
              </p>
              <p className="mt-4 font-mono text-[9px] leading-relaxed tracking-[0.02em] text-cream/35">
                Diligence questions stay public and on the record —{" "}
                <a
                  href="https://github.com/Insia88/rail-rwa/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="link-underline text-cream/70 hover:text-cream"
                >
                  github.com/Insia88/rail-rwa/issues
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
