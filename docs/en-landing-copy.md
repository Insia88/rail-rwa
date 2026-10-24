# RAIL — English copy deck (`/en` landing + A4 one-pager)

- **Owner:** english-copywriter
- **Status:** copy handoff for the `/en` route and `design/onepager-en/index.html`
- **Audience:** Hashed's global network, international VCs and partners, English-language reviewers
- **Built from:** `research/design/structure-audit.md` (6 acts), `research/design/benchmark-60.md`, `README.md`, `rail-app/lib/engine.ts`, `rail-app/lib/profiles.ts`, `rail-app/lib/market.ts`, `research/market/landscape.md`
- **Numbers:** every figure in this deck already exists in this repository (engine output, live-data snapshot dated 2026-10-22, or cited research). §14 maps each number to its source. If a number changes, it changes in `lib/engine.ts` / `lib/profiles.ts` and this deck is updated after, never before.
- **Companion A4 one-pager:** `design/onepager-en/index.html` (A4, exactly one page; rendered preview `design/onepager-en/preview.png`; the Lead builds `docs/RAIL-onepager-en.pdf` with `rail-app/scripts/build-onepager.mjs en`). The one-pager is a condensed cut of this deck, not a separate message.

## 0. Voice and constraints

RAIL is a demo. The copy can be confident about what was built; it cannot imply a live financial service. That line is drawn in every section, most explicitly in the trust block (§10).

- **Register:** Stripe / Ramp / Mercury. Calm, precise, declarative. Short sentences. The number does the persuading.
- **Claims:** every claim is either a computed number, a dated live-data reading, or a repository artifact. No adjectives standing in for evidence.
- **Never use:** revolutionary, game-changing, disruptive, world's first, cutting-edge, seamless, frictionless, unlock, empower, supercharge, 10x, "the future of finance", exclamation marks.
- **Never imply:** real customers, real credit decisions, real issuance, real funding, real users, real revenue. The three applicants are constructed personas. The funding percentage is simulated.
- **Typography conventions:** `KRW 180M` (not ₩180,000,000), `8.55% APR`, `3.80pp` for percentage points, `T+0`, `ERC-3643`, `USD/KRW 1,325.57`. Use `≈` only where the source is a live feed that moves.
- **One CTA per screen.** Primary action is filled; secondary is ghost. Contact happens in closing and footer only.

## 1. Route and anchor map

The `/en` page mirrors the 6-act structure. Nav (already wired in `components/site/header.tsx`):

| Nav label | Anchor | Act |
|---|---|---|
| Case | `#case` | 2 — Case file |
| Demo | `#run` | 3 — Live underwriter |
| Passport | `#passport` | 4 — Credit Passport × RWA rail |
| Proof | `#proof` | 5 — Proof of rail |

- Act 1 Hero has no anchor (top of page).
- Act 6 Trust + Closing has no nav entry; it sits between `#proof` and the footer.
- `<html lang="en">`; add `<link rel="alternate" hreflang="en" href="/en">` and the KO counterpart on `/`.

## 2. SEO meta

**Title — 48 characters (limit 60)**

```text
RAIL — Credit for the cash flow banks can't read
```

**Description — 151 characters (limit 155)**

```text
Verified export cash flow becomes an explainable Credit Passport, then ERC-3643 receivables on Base. A Seoul demo, built by one human and seven agents.
```

**Open Graph**

```text
og:title        RAIL — Credit for the cash flow banks can't read
og:description  An RWA credit rail for Korean exporters the bank file can't price. Live market data, a deterministic underwriting engine, and a public repo. Demo.
og:type         website
og:url          https://rail-rwa.vercel.app/en
og:image        /opengraph-image.png
```

**Optional keywords line (do not keyword-stuff the body):**

```text
RWA credit, export receivables, tokenized private credit, ERC-3643, Korea, stablecoin liquidity, credit underwriting
```

## 3. Act 1 — Hero

**Eyebrow** (mono, uppercase, 10–11px):

> RWA credit rail · Seoul · 2026

**H1 — 9 words** (emphasis on "cash flow" in signal orange):

> Credit for the cash flow the bank can't read.

**Sub — one sentence:**

> RAIL verifies export receipts, platform payouts, and patents as evidence, issues a Credit Passport, and tokenizes approved receivables as ERC-3643 RWAs on Base.

**Primary CTA** (filled, → `/underwrite/hanbit`):

> Run the Hanbit underwriting

**Secondary CTA** (ghost, → `/RAIL-onepager-en.pdf`):

> Read the one-page summary

**Hero object caption** (under the passport card, mono 9px):

> RAIL-P-2026-0001 · Credit Passport · Rule-engine output

**Live / snapshot status** (top-right microcopy, one of two states):

> Live market data · 22 Oct 2026

> Snapshot · public APIs cached

Implementation note: the passport card in the hero is generated from `underwriteById("hanbit")`. Do not hand-type the numbers on it; render `score`, `grade`, `limitKrw`, `apr`, `evidenceCoverage` from the engine output.

## 4. Act 2 — Case file (`#case`)

**Eyebrow:**

> Case file · 001

**H2 — 9 words:**

> Three banks said no. The money was already arriving.

**Required opening line** (use verbatim):

> A five-person exporter in Busan was rejected by three banks.

**Lede — one paragraph:**

> Hanbit Electronics sells consumer electronics to buyers in Vietnam and Indonesia. It books KRW 2.46B in annual revenue, gets paid in USD and USDC, owns no real estate, is two years old, and its KRW statements do not show the dollars arriving. The bank file did not fail on the numbers. It failed on the format.

**Facts strip** (three figures, footnotes on page footer or inline superscripts):

| Figure | Label | Source |
|---|---|---|
| 1.3M | new businesses registered in Korea each year¹ | research snapshot; primary citation pending |
| 84.2% | of Korea's 2025 export settlements were in USD² | Bank of Korea |
| 1.28% | of policy export factoring reached SMEs, 2017–2021³ | 2022 National Assembly data |

**"What the bank saw" — three reasons on file:**

> No real estate collateral. Two years of operating history. Dollar revenue that does not reconcile to a KRW financial statement. Three banks declined the same way.

**"What RAIL read" — evidence ledger rows** (this is the strongest block on the page; keep the dates):

| Evidence | Amount / count | Provenance |
|---|---|---|
| USDC settlements from buyer wallets, 6 months | 87 settlements · KRW 354M equivalent | On-chain, Base |
| Purchase orders from buyers | 3 POs · KRW 214M | Document, OCR + buyer email cross-check |
| USD wire deposits, foreign-currency account | 14 deposits · KRW 96M | Bank statement + VAT reconciliation |
| Bills of lading and customs export declarations | 6 B/Ls · KRW 268M | Customs and freight documents |
| 2025 VAT return | KRW 2.46B annual revenue | Tax filing |
| Buyer credit profile — verified? | No | Public database, not verified |
| Founder revenue projection — verified? | No | Self-reported |

**Coverage line (use as one paragraph or three columns):**

> Seven evidence items. Five verified, two not. Verified coverage of reported inflow: 72.0%. The unverified items are shown in the passport but excluded from the decision — they are not averaged in.

**Decision card**

| Field | Value |
|---|---|
| Decision | **Approved** |
| Grade | **B** (score 73.4 / 100) |
| Limit | **KRW 180M** — full request, 90-day tenor |
| APR | **8.55%** = 4.15% benchmark + 3.80pp grade spread + 0.60pp FX premium |
| RWA | `RAIL-R-2026-0001` · Base · ERC-3643 · 62% funded (simulated) |
| Conditions | Top buyer share ≤50% within 6 months · USD/KRW hedge or KRW settlement account · settlement-wallet whitelist and priority repayment |

**Risk disclosure line** (do not omit; this is the credibility):

> The passport also records what the decision ignores: top-buyer concentration at 58%, 78% of settlement in USD with no hedge, and one late payment (9 days). Each carries a covenant and a mitigation.

**Optional pull quote** (only if the layout has room; attribute it as a demo persona):

> "It's the 'revenue but no credit' line that stings. Can't I just show you the money coming in?"
> — Demo applicant · Hanbit Electronics

**Section footnote (small, mono):**

> Demo applicant profiles are constructed from Korean export-SME cash-flow patterns. They are not real companies. Credit decisions shown are computed by the engine from this constructed data.

## 5. Act 3 — Live underwriter (`#run`)

**Eyebrow:**

> Demo · run in the page

**H2 — 7 words:**

> The engine runs where the evidence is.

**Sub — one sentence:**

> Choose an applicant, run the underwriting, and watch four agents work through the evidence. The decision appears in the page — no navigation, no model call.

**Applicant tabs** (three tabs; keep the descriptor short):

> Hanbit Electronics — exporter · Busan
> Kim Do-hyun — freelance developer · Seoul
> FiberLogic — IP-backed deeptech · Daejeon

**Run button:**

> Run underwriting

**Progress states** (mono, in order; each is one line):

> SCOUT · collecting evidence
> VERIFIER · cross-checking claims
> UNDERWRITER · computing score, limit, APR
> BROKER · matching the receivable

**Result labels** (same order as the passport card):

> Decision
> Grade
> Limit
> APR
> Evidence coverage

**Result buttons:**

> Open the passport
> Run again

**Inline disclaimer under the runner (mono, 10px):**

> Simulated applicants. Deterministic engine. Same inputs, same output.

Implementation note: the runner is a client component that displays the precomputed `UnderwritingResult` from `lib/engine.ts` with a ~2.5s progressive reveal. It must not call an LLM and must not recompute numbers in the component.

## 6. Act 4 — Credit Passport × RWA rail (`#passport`)

**Eyebrow:**

> Product · Credit Passport

**H2 — 7 words:**

> Every number arrives with its evidence attached.

**Sub — one sentence:**

> A Credit Passport is a machine-readable credit file: evidence with provenance, a score with published weights, a limit, a price, and the receivable that carries it.

**Five-step rail labels** (the horizontal chain):

> 01 Evidence → 02 Score → 03 Limit → 04 APR → 05 RWA

**Four product bullets (~4 blocks):**

1. **Evidence, graded by provenance.**
   > Every item is tagged on-chain, platform, document, or self-reported, with an observation date and a trust weight. Unverified revenue is shown in the file and excluded from the decision. Hanbit: 7 items, 5 verified, 2 excluded.

2. **A score with published weights.**
   > Seven components — evidence coverage (30), cash-flow stability (20), buyer concentration (16), buyer quality (12), tenure (8), FX exposure (8), track record (6) — sum to a 100-point score and a letter grade. Hanbit: 73.4, grade B.

3. **A limit and a price, line by line.**
   > Limit: verified trailing three-month inflow × a score scale, capped at the request. APR: tokenized T-bill benchmark + grade spread + tenor premium + FX premium. Hanbit: KRW 180M approved at 8.55% = 4.15% + 3.80pp + 0.60pp.

4. **A receivable that can settle as a token.**
   > The approved receivable becomes a permissioned ERC-3643 RWA on Base, with escrow, maturity, and an investor yield. Hanbit: `RAIL-R-2026-0001`, 62% funded — simulated. The same passport exports as print, PDF, and JSON.

**Demo results — three applicants** (table; keep the "conditional" distinction, it is the point):

| Applicant | Type | Grade | Decision | APR | Verified |
|---|---|---|---|---|---|
| Hanbit Electronics | Exporter · Busan | B | KRW 180M approved (full request) | 8.55% | 72.0% |
| Kim Do-hyun | Freelancer · Seoul | B+ | KRW 9M conditional (requested KRW 20M) | 8.12% | 86.9% |
| FiberLogic | Deeptech · Daejeon | C+ | KRW 54M conditional (requested KRW 300M) | 10.18% | 93.7% |

**Results footnote:**

> Two of the three applicants are approved conditionally, at a fraction of their request. The engine does not approve what the evidence does not support.

## 7. Act 5 — Proof of rail (`#proof`)

**Eyebrow:**

> Proof · live data and build record

**H2 — 10 words:**

> Live where it is live. Labelled where it is not.

**Sub — one sentence:**

> Market context comes from public APIs on the server. Credit numbers come from a deterministic engine. The applicants are constructed for the demo and marked as such.

### 7.1 Live data ledger (`as of 22 Oct 2026, Asia/Seoul`)

| Metric | Reading | Source |
|---|---|---|
| Stablecoin float | **$305.0B** across 424 stablecoins (USDT $182.5B, USDC $72.6B — 83.6%)⁴ | DefiLlama |
| USD/KRW | **1,325.57** (≈1,326; ECB reference rate, 21 Oct 2026)⁵ | Frankfurter / ECB |
| 24/7 Korean assets | KOSPI 200, Hyundai Motor, SK Hynix, EWY and USD/KRW trade around the clock as perpetuals on Hyperliquid HIP-3 `xyz`; **$3.6B** daily volume⁶ | Hyperliquid |
| RWA context | **$76.9B** RWA · **$25.6B** tokenized private credit · **$9.3B** tokenized Treasuries⁷ | CoinGecko categories |
| Benchmark | **4.15%** tokenized short-term Treasury yield — research snapshot, not a live quote⁸ | Ondo OUSG / BlackRock BUIDL approximation |

**Aggregation note (small; include it — it is a trust signal for VCs):**

> RWA market size depends on the aggregator. In October 2026, RWA.xyz reported $38.6B, Token Terminal $46.2B, and CoinGecko $76.9B on adjacent dates. RAIL publishes the source next to the number and does not blend the estimates.

**Live-data principle line:**

> All external data is fetched server-side with a timeout, a 30-minute cache, and a labelled fallback. If a feed fails, the page says so instead of rendering an empty panel.

### 7.2 Design and build record

| Evidence | Detail |
|---|---|
| Design benchmark | 60 product sites measured (Linear, Stripe, Ramp, Mercury, Resend, Base, Hyperliquid and others) → 25 reusable recipes → 19 applied⁹ |
| Agentic build | 1 human + 7 agents in one day: research, engine, UI, QA, deployment¹⁰ |
| Product surface | 6 routes live on Vercel: landing, applicant list, agent underwriting run, printable passport (also JSON), market, build log |
| Repository | Public GitHub: engine, evidence schema, MCP servers, research documents, `AGENTS.md` |

**Verification path** (small block for reviewers; this is the "show your work" line):

> The engine is a pure function. Clone the repo, run `npx tsx mcp/server.ts`, call `underwrite_applicant` for `hanbit`, and compare the JSON to the passport on the page. The numbers should match to the decimal.

## 8. Architecture and MCP

**Eyebrow:**

> Architecture · open repo

**H2 — 8 words:**

> A small stack. One engine. Two MCP servers.

**Sub — one sentence:**

> Next.js 16.4 App Router on Vercel, React 19, TypeScript strict, Tailwind v4. No database, no secrets, no server-side model calls.

**Rows:**

| Layer | Detail |
|---|---|
| Credit engine | `lib/engine.ts` — a pure function. All score, grade, limit, APR, flags, covenants, and RWA certificate fields originate here. |
| Credit MCP server | `mcp/server.ts` — dependency-free stdio JSON-RPC. Tools: `list_applicants`, `underwrite_applicant`, `get_rwa_market`. |
| Art MCP server | `mcp/art-server.mjs` — dependency-free stdio JSON-RPC. Tools: `list_art_assets`, `art_pipeline_status`, `regenerate_art`, `regenerate_og`. |
| Market data | `lib/market.ts` — server-side fetch, 7s timeout, 30-minute cache, labelled fallback. No API keys required. |
| Repo | `github.com/Insia88/rail-rwa` — public, includes research and build record. |

**Principle callout** (display this as a pull quote; it is the product's core claim):

> Numbers are computed by a deterministic engine. LLMs never invent them.

**Supporting sentence:**

> Agents collect evidence, cross-check claims, explain the decision, and broker the receivable. The arithmetic stays in code, which is what makes the passport auditable and replayable.

## 9. Act 6 — Closing CTA

**Eyebrow:**

> Nitro Seoul 2 · Seoul · 2026

**H2 — 7 words:**

> Credit begins where the bank's file ends.

**Sub — one sentence:**

> RAIL is applying to Nitro Seoul 2 to turn this demo into a production evidence layer for Korean export credit.

**Primary CTA** (→ `/underwrite`):

> Run the demo

**Secondary CTA** (→ `/agents`):

> Read the build log

**Contact line** (under the buttons, mono):

> Diligence and partnership: [GitHub Issues](https://github.com/Insia88/rail-rwa/issues) — public, on the record.

Implementation note: keep two buttons. The GitHub Issues link is a text link, not a third button.

## 10. Act 6 — Trust block (place directly above Closing)

**Eyebrow:**

> Trust · for partners and reviewers

**H2 — 7 words:**

> What is real, and what is simulated.

**Sub — one sentence:**

> The engine is real. The applicants are not. Here is the line, drawn precisely.

**Real vs simulated table:**

| Layer | Status | Detail |
|---|---|---|
| Market data | **Real** | DefiLlama, Frankfurter/ECB, Hyperliquid and CoinGecko are fetched server-side, cached for 30 minutes, and replaced by a labelled fallback when a feed fails. |
| Underwriting engine | **Real** | Deterministic TypeScript in `lib/engine.ts`, public in the repository. Same input, same passport. |
| Applicant profiles | **Simulated** | Three personas shaped on Korean export-SME, freelancer and deeptech cash-flow patterns. Not real companies or people. |
| Credit decisions | **Engine-computed, simulated** | Scores, grades, limits, APRs and covenants are computed from the simulated evidence. No real credit was extended. |
| Receivable RWA | **Simulated** | `RAIL-R-2026-0001`, Base issuance, ERC-3643 token, investor list, 62% funding, escrow and maturity are demo records. Nothing was deployed or funded. |
| Money movement | **None** | No funds are raised, lent, or invested. RAIL is not a lender, broker-dealer, or investment adviser. |
| 4.15% benchmark | **Research snapshot** | Approximates tokenized Treasury yields as of October 2026. It is a labelled assumption, not a live rate. |

### 10.1 Regulatory path (Korea)

> **Token securities.** Amendments to the Electronic Securities Act and the Capital Markets Act passed the National Assembly on 15 January 2026. Enforcement is expected in January 2027, one year after promulgation.¹¹

> **Distribution.** Two consortia received preliminary approval for fractional-investment OTC venues on 13 February 2026 (NXT and KDX). RAIL is positioned as the issuance, evidence and underwriting layer, not as a venue.

> **Near term.** Financial Services Commission innovative financial services (regulatory sandbox) for receivable verification and brokerage.

> **Settlement.** USDC settlement runs through licensed partners inside existing foreign-exchange and AML frameworks. KRW stablecoin legislation is still pending, which is one reason the demo prices in USD.

**Licence status line** (required):

> RAIL holds no financial licence. The production model is infrastructure: RAIL provides underwriting, evidence and issuance; licensed institutions and LPs provide capital.

### 10.2 Contact

> Contact: GitHub Issues — github.com/Insia88/rail-rwa/issues. Diligence questions stay public and on the record.

## 11. Footer

**Footer tagline** (mono, 10px):

> RAIL Credit Engine · Seoul · Base · USDC

**Footer links:**

> Live demo · One-pager (EN) · GitHub repository · Contact (GitHub Issues)

**Footer disclosure — concise, must appear on `/en`:**

> RAIL is a demo. It is not a financial service. Credit decisions, receivable issuance, ERC-3643 tokens, investor records and funding percentages shown are simulations built from constructed applicant data. Market data comes from public APIs. Nothing here is an offer to buy or sell securities.

**Legal disclosures — full text** (for a legal/detail page, or the expanded footer disclosure):

> RAIL is a demonstration product. It is not a financial service, lender, broker-dealer, investment adviser, or securities issuer. Nothing on this site is an offer, solicitation, or recommendation to buy or sell any security or financial instrument, or to extend credit.
>
> The applicant companies and individuals (Hanbit Electronics, Kim Do-hyun, FiberLogic) are fictional personas constructed for the demo from Korean SME and freelancer cash-flow patterns. Their evidence records, credit decisions, grades, limits, APRs, covenants, receivable identifiers, ERC-3643 token records, investor lists, funding percentages, escrow arrangements and maturity dates are simulated. No credit has been extended, no receivable has been issued, and no funds have been raised or invested.
>
> Market data is retrieved from public APIs (DefiLlama, Frankfurter/ECB, Hyperliquid, CoinGecko) and may be delayed, cached, or replaced by a labelled fallback. The 4.15% benchmark is a research assumption approximating tokenized Treasury yields as of October 2026, not a live quote. RWA market-size figures depend on the aggregator and are labelled with their source.
>
> Forward-looking statements about the Nitro Seoul 2 plan describe intentions, not commitments. Past performance is not indicative of future results.
>
> © 2026 RAIL · Seoul. All product names and trademarks belong to their respective owners.

## 12. Component microcopy (for implementation)

- **Header CTA:** `Run the demo` (already wired in `header.tsx` as the EN label).
- **Language switch:** `KO / EN`, `aria-label="Language"`.
- **Live indicator:** green/acid dot + `Live`; fallback state: neutral dot + `Snapshot`.
- **Fallback labels** (must be visible when a feed fails): `Cached · last updated 22 Oct 2026`, `Fallback · API unavailable`.
- **Buttons:** `Run underwriting`, `Open the passport`, `Run again`, `Read the one-page summary`, `Read the build log`.
- **Alt text:** wordmark `RAIL`; passport card `Credit Passport for Hanbit Electronics — grade B, KRW 180M, 8.55% APR`.
- **Print passport header:** `Credit Passport · RAIL · Demo record — not a financial instrument`.

## 13. Copy mapping to the existing KO page

The `/en` page is not a translation of the KO page. It is the same six acts rewritten for a partner audience. Where the KO page argues from "the bank's grammar", the EN page argues from the evidence and the engine. Keep these fixed English terms across pages and materials:

> RAIL, Credit Passport, SCOUT, VERIFIER, UNDERWRITER, BROKER, RAIL Export Credit Pool I, ERC-3643, Base, USDC, HIP-3, T+0.

## 14. Number ledger (every figure used in this deck)

Engine values are the output of `ALL_RESULTS()` / `underwriteById()` run against `DEFAULT_CONTEXT` on 2026-10-22. They are not typed by hand.

| Figure | Value | Source |
|---|---|---|
| Hanbit score / grade | 73.4 / B | `engine.ts` output |
| Hanbit verified coverage | 72.0% | `engine.ts` output (`evidenceCoverage` 0.7201) |
| Hanbit limit / decision | KRW 180M / approved | `engine.ts` output |
| Hanbit APR | 8.55% (4.15 + 3.80 + 0.60) | `engine.ts` output; `DEFAULT_CONTEXT.benchmarkApr` 4.15; `GRADE_SPREAD.B` 3.8; FX premium 0.6 |
| Hanbit tenor / maturity | 90 days / 2027-01-19 | `engine.ts` output; `profiles.ts` hanbit `tenorDays` |
| Hanbit receivable | RAIL-R-2026-0001 | `engine.ts` `passportId`/`receivableId` |
| Hanbit chain / standard / pool | Base / ERC-3643 / RAIL Export Credit Pool I | `engine.ts` `funding` |
| Hanbit funded | 62% (simulated) | `engine.ts` `fundedPct` for exporter |
| Hanbit evidence | 7 items, 5 verified, 2 unverified | `profiles.ts` hanbit `evidence` |
| Hanbit annual revenue | KRW 2.46B | `profiles.ts` `ev-hb-05` |
| USDC settlements | 87 · KRW 354M | `profiles.ts` `ev-hb-01` |
| Purchase orders | 3 · KRW 214M | `profiles.ts` `ev-hb-02` |
| USD wires | 14 · KRW 96M | `profiles.ts` `ev-hb-03` |
| Bills of lading | 6 · KRW 268M | `profiles.ts` `ev-hb-04` |
| Top-buyer share / USD share / late payments | 58% / 78% / 1 (9 days) | `profiles.ts` hanbit; `buildFlags` |
| Score weights | 30 / 20 / 16 / 12 / 8 / 8 / 6 | `engine.ts` `buildComponents` (exporter) |
| Kim Do-hyun | B+ · KRW 9M conditional · 8.12% · 86.9% verified | `engine.ts` output |
| FiberLogic | C+ · KRW 54M conditional · 10.18% · 93.7% verified | `engine.ts` output |
| Benchmark | 4.15% (research snapshot) | `engine.ts` `DEFAULT_CONTEXT` |
| Stablecoin float | $305.01B / 424 stablecoins | `research/market/raw/defillama_stablecoins.json`; `lib/market.ts` fallback |
| USDT / USDC | $182.5B / $72.6B (83.6%) | `lib/market.ts` fallback rows; `README.md` §3 |
| USD/KRW | 1,325.57 (ECB, 21 Oct 2026) | `research/market/raw/frankfurter.json`; `engine.ts` context |
| Hyperliquid `xyz` | 138 markets, $3.64B daily volume, Korean assets as perps | `research/market/apis.md`; `research/market/landscape.md` §4 |
| RWA context | $76.86B / $25.60B / $9.30B | `lib/market.ts` `RWA_SNAPSHOT` |
| RWA aggregator variance | RWA.xyz $38.61B · Token Terminal $46.2B · CoinGecko $76.9B | `research/market/landscape.md` §0 |
| Design benchmark | 60 → 25 → 19 | `research/design/benchmark-60.md` |
| Agentic build | 1 human + 7 agents, one day | `README.md` §6 |
| Product surface | 6 routes | `README.md` §2 |
| Stack | Next.js 16.4.2, React 19.3.1, TypeScript strict, Tailwind v4 | `rail-app/package.json` |
| MCP tools | credit 3, art 4 | `README.md` §4 |
| Cache | 30 minutes (1800s) | `rail-app/lib/market.ts` |
| New business registrations | 1.3M per year | `README.md` §1; `docs/application.md` §1; `design/onepager/index.html` |
| Export settlement USD share | 84.2% (2025) | `research/market/landscape.md` §3.2 (Bank of Korea) |
| SME policy factoring share | 1.28% (2017–2021) | `research/market/landscape.md` §3.4 (2022 National Assembly data) |
| STO law | passed 2026-01-15, effective Jan 2027 expected | `README.md` §1; `docs/application.md` §2.4; `research/market/landscape.md` §2 |
| OTC venue preliminary approval | 2026-02-13, NXT and KDX consortia | `docs/application.md` §2.4; `research/market/landscape.md` §2 |
| 8-week plan | 20 interviews · 10 passports · 1 factoring LOI · 80% coverage · 1 testnet issuance · 1 LP pilot | `README.md` §7; `docs/application.md` §4 |

## 15. Source footnotes (for on-page superscripts)

- **¹** Korean new-business registrations, ≈1.3M per year. Currently cited only in RAIL's own copy; the primary dataset is not recorded in the repo. Add the primary citation before publishing.
- **²** Bank of Korea, *Trade Settlement Currency in Korea 2025* (published April 2026): USD share of export settlements 84.2%. See also ECB/BOK press data noted in `research/market/landscape.md` §3.2.
- **³** Korea Eximbank export factoring, 2017–2021: KRW 11.71T total, KRW 149.4B (1.28%) to SMEs. 2022 National Assembly submission (Rep. Hong Seong-guk / Eximbank), reported 6 October 2022. 2022 vintage: cite the year whenever quoted.
- **⁴** DefiLlama Stablecoins API, 2026-10-22: $305.01B across 424 stablecoins.
- **⁵** Frankfurter (ECB reference rate), rate date 2026-10-21: USD/KRW 1,325.57.
- **⁶** Hyperliquid HIP-3 `xyz` DEX, 2026-10-22: $3.64B daily volume; Korean equity/index/FX exposure trades as perpetuals, not spot.
- **⁷** CoinGecko categories, 2026-10-22: RWA $76.86B, tokenized private credit $25.60B, tokenized Treasuries $9.30B. Aggregator variance is disclosed in the proof block.
- **⁸** RAIL research snapshot, October 2026: 4.15% approximates tokenized short-term Treasury yields (Ondo OUSG / BlackRock BUIDL). Labelled assumption, not a live quote.
- **⁹** `research/design/benchmark-60.md`: 60 sites, 25 recipes, 19 applied.
- **¹⁰** `README.md` §6: 1 human + 7 agents in one day (2026-10-22).
- **¹¹** `research/market/landscape.md` §2 and `README.md` §1/§8: STO legislation passed 2026-01-15; enforcement expected January 2027; sandbox and OTC venue timeline as stated.

## 16. Implementation notes and open items

1. **`/underwrite` and `/passport` are Korean UI in this build.** The `/en` CTAs can point into them, but a global reviewer will land on Korean screens. Either (a) accept this and label the CTAs honestly, or (b) build a thin English shell for the Hanbit run this round. Copy for (b) is ready in §5 and §6.
2. **1.3M needs a primary source.** The figure is in the repo's own copy, not in the research record. Lead should either add the citation to `research/market/landscape.md` or soften the line.
3. **Do not add a third hero CTA.** The audit target is ≤6 action links on the page.
4. **Footnotes:** the superscripts in §4 and §7 should resolve to the source list in §15. A single "Sources" line in the footer is enough at launch.
5. **Demo label placement:** keep the concise disclosure in the footer (§11) and a one-line label in the hero status area. Do not move the disclosure into an expandable toggle.
6. **OG image:** the existing `opengraph-image.png` is KO/wordmark only. If an EN OG is generated, reuse the title and description from §2 rather than inventing new copy.
