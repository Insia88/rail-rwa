/**
 * og_figures.ts — dump the *computed* demo figures for the share card.
 *
 * Numbers shown on the OG card must come from lib/engine.ts, never be typed by
 * hand. This script reads the Hanbit demo profile through the engine and writes
 * scripts/art/og_figures.json; og_v2.mjs only renders that JSON.
 *
 * Run (from rail-app/):
 *     npx tsx scripts/art/og_figures.ts
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { underwriteById } from "../../lib/engine";
import { PROFILES } from "../../lib/profiles";

const here = path.dirname(fileURLToPath(import.meta.url));
const r = underwriteById("hanbit");

if (!r) {
  throw new Error("engine returned no result for the 'hanbit' demo profile");
}
const profile = PROFILES.find((p) => p.id === "hanbit");
if (!profile) throw new Error("hanbit profile missing from lib/profiles.ts");

const TYPE_LABEL: Record<string, string> = {
  exporter: "EXPORTER",
  creator: "CREATOR",
  deeptech: "DEEP TECH",
};

/** 180000000 -> "1억 8,000만원" (Korean export-loan style, as used in the app). */
function formatKrwShort(v: number): string {
  const eok = Math.floor(v / 100_000_000);
  const man = Math.round((v % 100_000_000) / 10_000);
  if (eok > 0 && man > 0) return `${eok}억 ${man.toLocaleString("en-US")}만원`;
  if (eok > 0) return `${eok}억원`;
  return `${man.toLocaleString("en-US")}만원`;
}

const figures = {
  applicantName: r.applicantName,
  company: r.company,
  // e.g. "부산광역시 사상구 · EXPORTER · EST. 2024"
  profileLine: `${profile.location.split(" ")[0]} · ${TYPE_LABEL[profile.type] ?? profile.type} · EST. ${profile.foundedYear}`,
  passportId: r.passportId,
  score: r.score.toFixed(1),
  grade: r.grade,
  limitKrwText: formatKrwShort(r.limitKrw),
  aprText: `${r.apr.toFixed(2)}%`,
  coverageText: `${(r.evidenceCoverage * 100).toFixed(1)}%`,
  asOf: r.issuedAt.slice(0, 10),
  source: "lib/engine.ts · underwriteById('hanbit')",
};

const out = path.join(here, "og_figures.json");
writeFileSync(out, JSON.stringify(figures, null, 2) + "\n", "utf8");
console.log("og figures ->", out);
console.log(figures);
