import type { Metadata } from "next";
import { DemoIntro } from "@/components/en/demo-intro";
import { ArrowLink, Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "Agent crew and build record",
  description:
    "RAIL is an RWA credit rail built in one day by one human and an agent team. Roles of the four runtime agents and five build agents, the build timeline, and the moat.",
  alternates: { canonical: "/en/agents" },
};

const RUNTIME_CREW = [
  {
    name: "SCOUT",
    status: "IDLE",
    role: "Evidence collection",
    tools: "Base RPC · customs export declarations · platform payout API · KIPRIS patent lookup",
    cadence: "On each underwriting request · records the source hash",
    decides: "Which evidence to trust; collection scope and source",
  },
  {
    name: "VERIFIER",
    status: "IDLE",
    role: "Cross-verification",
    tools: "Buyer name, amount and due-date triple match · wallet age · duplicate removal",
    cadence: "Immediately after collection · conflict checks across evidence",
    decides: "Evidence coverage, and separation of unverified items",
  },
  {
    name: "UNDERWRITER",
    status: "ON CALL",
    role: "Credit decision",
    tools: "Rule-based weighted engine · score components · grade spreads",
    cadence: "On each underwriting request · same input = same result",
    decides: "Score · grade · approved limit · APR",
  },
  {
    name: "BROKER",
    status: "IDLE",
    role: "Liquidity matching",
    tools: "ERC-3643 issuance · LP pool · escrow whitelist",
    cadence: "After approval · tracked to maturity",
    decides: "Whether to fund, maturity, and the repayment path",
  },
] as const;

const BUILD_CREW = [
  {
    name: "telegram-analyst",
    kind: "Research",
    desc: "Extracted market arguments sentence by sentence from a Telegram channel and public sources. Mapped which numbers could carry the product's case.",
    output: "Market thesis notes",
  },
  {
    name: "rwa-researcher",
    kind: "Research",
    desc: "Researched Korea's STO regime, ERC-3643 rights structures, and DefiLlama/CoinGecko data schemas. Fixed every number's source and aggregation basis.",
    output: "Regulation and data notes",
  },
  {
    name: "frontend-builder",
    kind: "Implementation",
    desc: "Built the landing, market and agents pages in the v3 benchmark grammar: cinematic dark, chrome, orange editorial system.",
    output: "Three routes · landing components",
  },
  {
    name: "flow-builder",
    kind: "Implementation",
    desc: "Built the four-step underwriting animation and the Credit Passport artifact. The same result is shown twice: as a log and as a passport.",
    output: "Underwriting flow · passport",
  },
  {
    name: "lead",
    kind: "Design · Engine · QA · Deploy",
    desc: "Owned product definition, the credit engine, the design system, final QA and the Vercel deployment — one human's judgment decomposed into agent execution.",
    output: "Engine · system · deployment",
  },
] as const;

const TIMELINE = [
  { time: "T+0h", label: "Research begins", detail: "Market thesis · regulation · data-source scan" },
  { time: "T+1h", label: "Product definition, credit engine", detail: "Score components and passport formulas fixed" },
  { time: "T+3h", label: "UI implementation", detail: "Landing · underwriting flow · passport artifact" },
  { time: "T+5h", label: "QA and Vercel deployment", detail: "Typecheck · build · production release" },
] as const;

const MOAT = [
  {
    title: "Execution speed",
    body: "The human is not the bottleneck. Research to deployment takes one day, with the reasoning log intact.",
  },
  {
    title: "A decision log that cannot be copied",
    body: "Evidence, formulas and logs record why each decision was made. Copying the output does not reproduce it.",
  },
  {
    title: "Customer radio",
    body: "Underwriting, evidence collection and settlement continue outside banking hours. The line to the customer stays open.",
  },
] as const;

const LINKS = [
  { href: "/en", label: "Product landing", note: "Landing · manifesto" },
  { href: "/en/market", label: "Market data", note: "RWA weather" },
  { href: "/en/underwrite", label: "Run the demo", note: "Three applicants" },
] as const;

export default function EnAgentsPage() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-noir pt-16 text-cream">
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid-dark opacity-30 mask-fade-b" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04] mix-blend-overlay" />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-8 sm:px-8">
        <DemoIntro
          step="Agent crew"
          purpose="RAIL is a product demo built by one human and an agent crew: four runtime agents decide inside the product, five build agents made it."
          hint="This page is the build record. Every number in the product can be recomputed from the rule engine and the market snapshot."
          prev={{ href: "/en/market", label: "Market weather" }}
          next={{ href: "/en/underwrite", label: "Next: run an underwriting" }}
        />

        {/* hero */}
        <div className="mt-8 grid gap-8 border-b border-line-dark pb-10 lg:grid-cols-[1.35fr_1fr] lg:items-end">
          <div>
            <Eyebrow>The Crew · Build Log · Seoul 2026</Eyebrow>
            <h1 className="mt-3 text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold leading-[1.06] tracking-[-0.03em]">
              A team where agents
              <br />
              are teammates.
            </h1>
            <p className="mt-4 font-serif-display text-[clamp(1.5rem,2.6vw,2.2rem)] italic leading-[1.2] text-cream/70">
              one human, four agents.
            </p>
            <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-cream/50">
              RAIL was researched, designed, implemented, QA&apos;d and deployed in a day by one
              human and four runtime agents.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line-dark pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/30">
                Runtime
              </dt>
              <dd className="type-data mt-1 text-[30px] font-semibold leading-none text-cream">04</dd>
              <dd className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/35">
                agents inside the product
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/30">
                Build
              </dt>
              <dd className="type-data mt-1 text-[30px] font-semibold leading-none text-cream">05</dd>
              <dd className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/35">
                agents on the build
              </dd>
            </div>
            <div className="col-span-2">
              <dt className="font-mono text-[9px] uppercase tracking-[0.18em] text-cream/30">
                Human
              </dt>
              <dd className="mt-1 text-[14px] font-semibold text-cream">01</dd>
              <dd className="mt-1 text-[11px] leading-relaxed text-cream/35">
                Direction, final calls, deployment.
              </dd>
            </div>
          </dl>
        </div>

        {/* runtime crew */}
        <section aria-labelledby="runtime-title" className="mt-14">
          <Eyebrow>Runtime · inside the product</Eyebrow>
          <h2
            id="runtime-title"
            className="mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold leading-[1.15] tracking-[-0.02em]"
          >
            Four agents that make decisions inside the product.
          </h2>
          <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-cream/45">
            Underwriting at RAIL is not human discretion; it is a procedure that leaves a log. The
            reasoning is attached to the passport.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {RUNTIME_CREW.map((agent) => (
              <article key={agent.name} className="border border-line-dark bg-noir-2/50 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[12px] font-semibold tracking-[0.2em] text-cream">
                    {agent.name}
                  </p>
                  <span
                    className={`font-mono text-[8px] uppercase tracking-[0.16em] ${
                      agent.status === "ON CALL" ? "text-signal" : "text-cream/30"
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-cream/35">
                  {agent.role}
                </p>
                <dl className="mt-4 space-y-2.5">
                  {[
                    { label: "Tools", value: agent.tools },
                    { label: "Cadence", value: agent.cadence },
                    { label: "Decides", value: agent.decides },
                  ].map((row) => (
                    <div key={row.label}>
                      <dt className="font-mono text-[8px] uppercase tracking-[0.18em] text-cream/25">
                        {row.label}
                      </dt>
                      <dd className="mt-1 text-[11.5px] leading-relaxed text-cream/55">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
          <p className="mt-3 font-mono text-[9px] text-cream/25">
            Runtime agents · call the rule engine · LLMs never invent numbers
          </p>
        </section>

        {/* build crew */}
        <section aria-labelledby="build-title" className="mt-14">
          <Eyebrow>Build crew · one day</Eyebrow>
          <h2
            id="build-title"
            className="mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold leading-[1.15] tracking-[-0.02em]"
          >
            Five build agents, one day.
          </h2>
          <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-cream/45">
            One human set direction and made the final calls; five build agents split research,
            implementation and QA.
          </p>
          <ul className="mt-5 border-t border-line-dark">
            {BUILD_CREW.map((agent) => (
              <li
                key={agent.name}
                className="grid gap-2 border-b border-line-dark py-4 md:grid-cols-[190px_minmax(0,1fr)_180px] md:gap-5"
              >
                <div>
                  <p className="font-mono text-[11px] tracking-[0.06em] text-cream/85">
                    {agent.name}
                  </p>
                  <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-cream/30">
                    {agent.kind}
                  </p>
                </div>
                <p className="text-[12px] leading-relaxed text-cream/50">{agent.desc}</p>
                <p className="font-mono text-[9px] leading-relaxed text-cream/35">{agent.output}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* build log */}
        <section aria-labelledby="log-title" className="mt-14">
          <Eyebrow>Build log · 2026-10-22 · one day</Eyebrow>
          <h2
            id="log-title"
            className="mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold leading-[1.15] tracking-[-0.02em]"
          >
            An execution record, not a plan.
          </h2>
          <div className="mt-5 border border-line-dark">
            {TIMELINE.map((row) => (
              <div
                key={row.time}
                className="grid gap-1 border-b border-line-dark/60 px-4 py-3 last:border-b-0 sm:grid-cols-[80px_240px_minmax(0,1fr)] sm:items-baseline sm:gap-4"
              >
                <span className="font-mono text-[10px] tracking-[0.12em] text-acid/80">
                  {row.time}
                </span>
                <span className="text-[12.5px] font-semibold text-cream/85">{row.label}</span>
                <span className="text-[11.5px] leading-relaxed text-cream/45">{row.detail}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 font-mono text-[9px] text-cream/25">
            Times are relative to the start of work (T), not clock times.
          </p>
        </section>

        {/* moat */}
        <section aria-labelledby="moat-title" className="mt-14">
          <Eyebrow>The moat</Eyebrow>
          <h2
            id="moat-title"
            className="mt-3 text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold leading-[1.15] tracking-[-0.02em]"
          >
            Why this way of working is the moat.
          </h2>
          <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-cream/45">
            Features can be copied. A process that leaves its reasoning behind is harder to copy.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {MOAT.map((row) => (
              <article key={row.title} className="border border-line-dark bg-noir-2/40 p-5">
                <p className="text-[14px] font-bold tracking-[-0.01em] text-cream">{row.title}</p>
                <p className="mt-2 text-[11.5px] leading-relaxed text-cream/45">{row.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* closing */}
        <div className="mt-14 flex flex-col gap-5 border-t border-line-dark pt-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-[clamp(1.5rem,2.6vw,2.1rem)] font-extrabold leading-[1.15] tracking-[-0.02em]">
              The product and the record live in the same repository.
            </h2>
            <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-cream/45">
              This page is the build record of the product. Every number can be recomputed from the
              rule engine and the market snapshot.
            </p>
            <p className="mt-4 max-w-2xl font-mono text-[9px] leading-relaxed text-cream/25">
              RAIL is a demo. It is not a financial service; applicant profiles are constructed and
              on-chain records are simulated.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button href="/en/underwrite" variant="primary" size="sm">
              Run an underwriting
            </Button>
            <Button href="/en/market" variant="outline-inverse" size="sm">
              View market data
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-2 border-t border-line-dark pt-6 sm:grid-cols-3">
          {LINKS.map((link) => (
            <div key={link.href}>
              <ArrowLink href={link.href} inverse>
                {link.label}
              </ArrowLink>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-cream/25">
                {link.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
