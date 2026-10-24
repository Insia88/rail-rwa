# AGENTS.md — RAIL

This repository is built and operated by an **agent team**. Humans set direction and make
judgment calls; agents execute, verify, and report. This file tells any agent (DSH, Claude Code,
Cursor, Codex, etc.) how to work in this repo without breaking the product's guarantees.

## Non-negotiable product guarantees

1. **Numbers are computed, never generated.** `lib/engine.ts` is the only source of credit
   numbers (score, grade, limit, APR, discount, flags, covenants). LLMs may narrate but must
   never invent or mutate a number. If a number changes, it changes in `lib/engine.ts` or
   `lib/profiles.ts` and nowhere else.
2. **Determinism.** `underwrite(profile, ctx)` must be a pure function of its inputs.
   No `Date.now()`, no randomness, no network inside the engine.
3. **Live data is fetched server-side with fail-soft.** `lib/market.ts` owns external APIs.
   Every external fetch needs: timeout, cache (`next: { revalidate }`), and a labelled fallback.
4. **Demo honesty.** Any simulated artifact (on-chain issuance, investor list, funding %) must
   stay labelled as a simulation in the UI. Never imply a real financial service.
5. **No secret in client code.** No API keys, wallets, or private endpoints in `components/`.

## Stack & conventions

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4 (tokens in `app/globals.css`).
- Server components by default. `"use client"` only for interaction (e.g. `components/flow/underwriting-run.tsx`).
- Next 16: `params` is a Promise — `const { id } = await params`.
- Korean copy is product copy. Do not "improve" tone by adding hype. Edit only where the SPEC says.
- Design system: `components/ui/*` + tokens `paper`, `ink`, `signal`, `verified`, `gold`, `night`.
  Do not introduce gradients, glassmorphism, emoji, or remote images.

## Commands

```bash
npm install
npm run dev          # local preview
npx tsc --noEmit     # typecheck (run before claiming done)
npm run build        # production build (Lead runs this during integration)
npx vercel deploy --prod
npx tsx mcp/server.ts  # MCP server (stdio)
```

## Ownership map (parallel work)

| Path | Owner |
|---|---|
| `lib/types.ts`, `lib/engine.ts`, `lib/profiles.ts`, `lib/market.ts`, `lib/weather.ts` | Lead |
| `app/layout.tsx`, `app/globals.css`, `components/ui/*`, `components/site/*`, `app/api/*` | Lead |
| `app/page.tsx`, `app/market/*`, `app/agents/*`, `components/landing/*`, `components/market/*` | frontend agent |
| `app/underwrite/*`, `app/passport/*`, `components/flow/*` | flow agent |
| `mcp/*`, `docs/*`, `README.md` | Lead |

If you need a change outside your scope: send a message with the exact file and reason.
Never edit another owner's file silently.

## Definition of done (per change)

- `npx tsc --noEmit` clean.
- No hardcoded credit/market numbers in UI.
- Mobile (390px) and desktop (1440px) reviewed.
- Any new claim about Korea/RWA regulation cites a source in `research/market/landscape.md`.
- Demo disclaimers intact.
