import Link from "next/link";
import { Reveal } from "@/components/ui/motion";
import { SectionHead } from "@/components/landing/section-head";

const ROWS = [
  {
    layer: "Credit engine",
    detail:
      "lib/engine.ts — a pure function. All score, grade, limit, APR, flags, covenants and RWA certificate fields originate here.",
  },
  {
    layer: "Credit MCP server",
    detail:
      "mcp/server.ts — dependency-free stdio JSON-RPC. Tools: list_applicants, underwrite_applicant, get_rwa_market.",
  },
  {
    layer: "Art MCP server",
    detail:
      "mcp/art-server.mjs — dependency-free stdio JSON-RPC. Tools: list_art_assets, art_pipeline_status, regenerate_art, regenerate_og.",
  },
  {
    layer: "Market data",
    detail:
      "lib/market.ts — server-side fetch, 7s timeout, 30-minute cache, labelled fallback. No API keys required.",
  },
  {
    layer: "Repository",
    detail: "github.com/Insia88/rail-rwa — public, includes the research and the build record.",
  },
] as const;

const LINKS = [
  { href: "/en/underwrite/hanbit", label: "Live demo" },
  { href: "https://github.com/Insia88/rail-rwa", label: "GitHub", external: true },
  { href: "/RAIL-onepager-en.pdf", label: "One-pager (EN)", external: true },
  { href: "/en/agents", label: "Build log" },
] as const;

/** EN-only act — architecture, MCP servers and the agentic build record. */
export function EnBuildBand() {
  return (
    <section
      id="build"
      className="relative scroll-mt-20 overflow-hidden border-y border-line-dark bg-noir-2 text-cream lg:scroll-mt-24"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid-dark opacity-10" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <SectionHead
          index="05"
          kicker="Architecture · open repo"
          title="A small stack. One engine. Two MCP servers."
          sub="Next.js 16 App Router on Vercel, React 19, TypeScript strict, Tailwind v4. No database, no secrets, no server-side model calls."
        />

        <Reveal delay={0.06}>
          <ul className="mt-10 border-t border-line-dark">
            {ROWS.map((row) => (
              <li
                key={row.layer}
                className="grid gap-1 border-b border-line-dark py-3 md:grid-cols-[170px_minmax(0,1fr)] md:items-baseline md:gap-6"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cream/45">
                  {row.layer}
                </span>
                <span className="min-w-0 font-mono text-[11px] leading-[1.65] text-cream/55">
                  {row.detail}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <blockquote className="font-serif-display text-[clamp(1.4rem,2.2vw,2rem)] italic leading-[1.3] tracking-[-0.03em] text-cream/80">
              “Numbers are computed by a deterministic engine. LLMs never invent them.”
            </blockquote>
            <p className="mt-3 max-w-xl text-[12px] leading-[1.7] text-cream/45">
              Agents collect evidence, cross-check claims, explain the decision and broker the
              receivable. The arithmetic stays in code, which makes the passport auditable and
              replayable.
            </p>
            <p className="mt-4 max-w-xl border-t border-line-dark pt-3 font-mono text-[10px] leading-relaxed text-cream/35">
              Verification path: clone the repo, run `npx tsx mcp/server.ts`, call
              underwrite_applicant for `hanbit`, and compare the JSON to the passport on the page.
              The numbers match to the decimal.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-cream/40">
              For partners
            </p>
            <div className="mt-3 flex flex-col gap-2 border-t border-line-dark pt-4">
              {LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={"external" in link && link.external ? "_blank" : undefined}
                  className="link-underline w-fit font-mono text-[10px] uppercase tracking-[0.14em] text-cream/50 transition-colors duration-200 hover:text-cream focus-visible:outline-none"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
            <p className="mt-5 font-mono text-[9px] leading-relaxed tracking-[0.02em] text-cream/30">
              Demo built by one human and seven agents in one day — research, engine, UI, QA and
              deployment. 60 product sites benchmarked, 25 recipes extracted, 19 applied.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
