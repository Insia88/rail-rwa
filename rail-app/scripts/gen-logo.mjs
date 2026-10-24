import fs from "node:fs";
const svg = fs.readFileSync("../design/logo/A/wordmark-inverse.svg", "utf8");
const m = svg.match(/<svg[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*)<\/svg>/);
if (!m) throw new Error("no svg");
const viewBox = m[1];
const inner = m[2];
const paths = [...inner.matchAll(/<path\s+([^>]*)\/>/g)].map(x => x[1]);
const parsed = paths.map(attrs => {
  const d = (attrs.match(/d="([^"]+)"/) || [])[1];
  const t = (attrs.match(/transform="([^"]+)"/) || [])[1];
  const fill = (attrs.match(/fill="([^"]+)"/) || [])[1] || "none";
  return { d, t, fill };
});
const isSignal = (f) => /FF4B1F|ff4b1f/i.test(f);
const lines = [];
lines.push(`"use client";`); // not really needed; remove
lines.push("");
const tsx = `import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * RAIL identity — v3 "Signal Rail" (adopted from direction A).
 * Wordmark: Archivo 600 width-110 outlines, tracking −0.018em, with one orange
 * signal square at the baseline. No mark, no sublabel in the header.
 * Paths: design/logo/A/wordmark-inverse.svg (self-generated from OFL font).
 */
export function RailWordmark({ className, title = "RAIL" }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="${viewBox}"
      fill="none"
      role="img"
      aria-label={title}
      className={cn("h-[22px] w-auto", className)}
    >
      <title>{title}</title>
      <g transform="translate(0 1.5)">
${parsed
  .map(
    (p) =>
      `        <path${p.t ? ` transform="${p.t}"` : ""} d="${p.d}" fill=${isSignal(p.fill) ? '"var(--color-signal)"' : '"currentColor"'} />`,
  )
  .join("\n")}
      </g>
    </svg>
  );
}

export function RailMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={cn("h-5 w-5", className)}>
      <rect x="1.25" y="1.25" width="21.5" height="21.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M7.2 19 11.2 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" />
      <path d="M12.8 19 16.8 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" opacity="0.5" />
      <circle cx="18.6" cy="5.2" r="1.7" fill="var(--color-signal)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return <span className={cn("inline-flex items-center", className)}><RailWordmark className="h-[21px] text-cream" /></span>;
}

export function Logo({ className, inverse = true }: { className?: string; inverse?: boolean }) {
  return (
    <Link href="/" aria-label="RAIL 홈" className={cn("inline-flex shrink-0 items-center", className)}>
      <RailWordmark
        className={cn(
          "h-[21px] transition-opacity duration-200 hover:opacity-80",
          inverse ? "text-cream" : "text-ink",
        )}
      />
    </Link>
  );
}
`;
fs.writeFileSync("components/ui/logo.tsx", tsx, "utf8");
console.log("paths:", parsed.length, "viewBox:", viewBox);
console.log("signal paths:", parsed.filter(p => isSignal(p.fill)).length);
