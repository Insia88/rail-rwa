import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Agent crew and build record",
  description:
    "RAIL is an RWA credit rail built in one day by one human and an agent team. The four runtime agents, five build agents, the build timeline and the moat.",
  alternates: { canonical: "/en/agents" },
};

const RUNTIME = [
  {
    name: "SCOUT",
    status: "IDLE",
    role: "Evidence collection",
    tools: "Base RPC · export declarations · payout APIs · KIPRIS patent lookup",
    decides: "Which evidence to trust; collection scope and source",
  },
  {
    name: "VERIFIER",
    status: "IDLE",
    role: "Cross-verification",
    tools: "Buyer, amount and due-date triple match · wallet age · duplicate removal",
    decides: "Evidence coverage and separation of unverified items",
  },
  {
    name: "UNDERWRITER",
    status: "ON CALL",
    role: "Credit decision",
    tools: "Rule-weighted engine · score components · grade spread",
    decides: "Score, grade, approved limit and APR",
  },
  {
    name: "BROKER",
    status: "IDLE",
    role: "Liquidity matching",
    tools: "ERC-3643 issuance · LP pool · escrow allowlist",
    decides: "Whether it funds, at what maturity, and the repayment path",
  },
];

const BUILD = [
  {
    name: "telegram-analyst",
    kind: "Research",
    desc: "Extracted market theses from public channels and documents, sentence by sentence, and fixed which numbers anchor the product.",
    output: "Market thesis notes",
  },
  {
    name: "rwa-researcher",
    kind: "Research",
    desc: "Surveyed Korean STO rules, ERC-3643 rights and DefiLlama/CoinGecko schemas. Sources and aggregation rules were pinned before any copy.",
    output: "Regulation · data notes",
  },
  {
    name: "frontend-builder",
    kind: "Implementation",
    desc: "Built the landing, market and agents routes on one light surface system: type scale, hairlines, motion budget.",
    output: "3 routes · landing components",
  },
  {
    name: "flow-builder",
    kind: "Implementation",
    desc: "Built the four-step underwriting animation and the Credit Passport artifact, so the same result is read twice: log and document.",
    output: "Flow · passport",
  },
  {
    name: "lead",
    kind: "Design · Engine · QA · Deploy",
    desc: "Owned product definition, the credit engine, the design system, QA and deployment. One human's judgement split into agent runs.",
    output: "Engine · system · deploy",
  },
];

const TIMELINE = [
  { time: "T+0h", label: "Research", detail: "Market notes · regulation · data sources" },
  { time: "T+1h", label: "Product + credit engine", detail: "Score components and passport format fixed" },
  { time: "T+3h", label: "UI implementation", detail: "Landing · underwriting flow · passport artifact" },
  { time: "T+5h", label: "QA · Vercel deploy", detail: "Typecheck · build · production" },
];

const MOAT = [
  {
    title: "Execution speed",
    body: "The human bottleneck is gone. Research to deploy takes one day, with the decision log attached.",
  },
  {
    title: "A decision log you cannot copy",
    body: "Evidence, reasoning and logs stay with every decision. Copying the output does not reproduce it.",
  },
  {
    title: "Always-on coverage",
    body: "Underwriting, evidence and settlement keep running outside business hours.",
  },
];

const LINKS = [
  { href: "/en", label: "Product", note: "Landing · manifesto" },
  { href: "/en/market", label: "Market data", note: "RWA snapshot" },
  { href: "https://github.com/Insia88/rail-rwa", label: "README", note: "Build record" },
  { href: "/nitro", label: "For Hashed", note: "Nitro Seoul 2" },
];

function StatusChip({ status }: { status: string }) {
  return (
    <span
      className={
        status === "ON CALL"
          ? "inline-flex shrink-0 items-center rounded-full border border-vermilion/30 bg-vermilion-soft px-2.5 py-1 text-[13px] text-vermilion"
          : "inline-flex shrink-0 items-center rounded-full border border-hairline px-2.5 py-1 text-[13px] text-graphite-3"
      }
    >
      {status === "ON CALL" ? "On call" : "Idle"}
    </span>
  );
}

/** /en/agents — English mirror, light surface. */
export default function EnAgentsPage() {
  return (
    <main className="bg-porcelain" lang="en">
      <div className="mx-auto w-full max-w-[1120px] px-6 pb-20 pt-28 sm:pt-32">
        <Reveal>
          <p className="text-[13px] text-graphite-3">Agent crew</p>
          <h1 className="mt-4 max-w-2xl text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-graphite">
            One human, nine agents.
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-[1.65] text-graphite-2">
            RAIL was built and deployed in one day. Four runtime agents make decisions inside the
            product; five build agents made it.
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <dl className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-hairline bg-hairline sm:grid-cols-4">
            {[
              { term: "People", value: "1" },
              { term: "Runtime agents", value: "4" },
              { term: "Build agents", value: "5" },
              { term: "Shipped", value: "2026-10-22" },
            ].map((stat) => (
              <div key={stat.term} className="bg-surface px-6 py-6">
                <dt className="text-[13px] text-graphite-3">{stat.term}</dt>
                <dd className="mt-2 text-[clamp(1.5rem,2.6vw,2.25rem)] font-semibold leading-none tracking-[-0.03em] text-graphite">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <section className="mt-16">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-graphite">
              Four decide inside the product.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {RUNTIME.map((agent) => (
              <Reveal key={agent.name} delay={0.04}>
                <article className="h-full rounded-[var(--radius-card)] border border-hairline bg-surface p-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[17px] font-semibold text-graphite">{agent.name}</p>
                    <StatusChip status={agent.status} />
                  </div>
                  <p className="mt-1 text-[15px] text-graphite-2">{agent.role}</p>
                  <p className="mt-4 text-[14px] leading-[1.6] text-graphite-2">{agent.tools}</p>
                  <p className="mt-3 border-t border-hairline pt-3 text-[13px] leading-[1.6] text-graphite-3">
                    Decides: {agent.decides}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-graphite">
              Five built it in a day.
            </h2>
          </Reveal>
          <div className="mt-8 overflow-hidden rounded-[var(--radius-card)] border border-hairline bg-surface">
            {BUILD.map((agent) => (
              <div
                key={agent.name}
                className="grid gap-2 border-b border-hairline px-6 py-5 last:border-b-0 sm:grid-cols-[200px_1fr_auto] sm:gap-6"
              >
                <div>
                  <p className="text-[15px] font-semibold text-graphite">{agent.name}</p>
                  <p className="mt-0.5 text-[13px] text-graphite-3">{agent.kind}</p>
                </div>
                <p className="text-[14px] leading-[1.6] text-graphite-2">{agent.desc}</p>
                <p className="text-[13px] text-graphite-3 sm:text-right">{agent.output}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-graphite">
              Build record.
            </h2>
          </Reveal>
          <ol className="mt-8">
            {TIMELINE.map((item) => (
              <li
                key={item.time}
                className="grid gap-1 border-b border-hairline py-4 sm:grid-cols-[80px_220px_1fr] sm:items-baseline sm:gap-4"
              >
                <span className="text-[13px] text-graphite-3">{item.time}</span>
                <span className="text-[15px] font-medium text-graphite">{item.label}</span>
                <span className="text-[14px] text-graphite-2">{item.detail}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <Reveal>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-graphite">
              Why this is a moat.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {MOAT.map((item) => (
              <Reveal key={item.title} delay={0.04}>
                <article className="h-full rounded-[var(--radius-card)] border border-hairline bg-surface p-6">
                  <p className="text-[15px] font-semibold text-graphite">{item.title}</p>
                  <p className="mt-2 text-[14px] leading-[1.65] text-graphite-2">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-hairline pt-8">
          <p className="text-[13px] text-graphite-3">Read more</p>
          <nav aria-label="Related links" className="mt-3">
            {LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                className="flex items-center justify-between gap-4 border-b border-hairline py-4 transition-colors duration-200 hover:text-vermilion"
              >
                <span className="flex items-baseline gap-3">
                  <span className="text-[15px] font-medium text-graphite">{link.label}</span>
                  <span className="text-[13px] text-graphite-3">{link.note}</span>
                </span>
                <span aria-hidden className="text-graphite-3">
                  →
                </span>
              </Link>
            ))}
          </nav>
        </section>
      </div>
    </main>
  );
}
