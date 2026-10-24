import Link from "next/link";
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
      viewBox="0 -1.5 367.83 103"
      fill="none"
      role="img"
      aria-label={title}
      className={cn("h-[22px] w-auto", className)}
    >
      <title>{title}</title>
      <g transform="translate(0 1.5)">
        <path transform="translate(0 0)" d="M0.06 100V-0.06H63.35Q74.26 -0.06 81.34 3.94Q88.43 7.93 91.95 14.96Q95.48 21.98 95.48 31.11Q95.48 40.52 91.02 48.15Q86.56 55.77 77.64 59.8L98.57 100H76.18L57.81 63.41H20.29V100ZM20.29 46.53H60.03Q67.14 46.53 70.99 42.39Q74.84 38.25 74.84 31.28Q74.84 26.71 73.15 23.54Q71.46 20.38 68.16 18.72Q64.87 17.06 60.03 17.06H20.29Z" fill="currentColor" />
        <path transform="translate(110.54 0)" d="M-0.06 100 43.35 -0.06H67.73L111.23 100H89.16L80.55 79.48H29.36L20.76 100ZM36.44 62.68H73.38L62.68 36.62Q62.04 35.1 61.01 32.49Q59.97 29.88 58.89 26.95Q57.81 24.02 56.85 21.4Q55.89 18.78 55.39 17.41H54.49Q53.44 20.32 52.03 24.11Q50.61 27.9 49.3 31.31Q47.99 34.72 47.14 36.68Z" fill="currentColor" />
        <path transform="translate(231.77 0)" d="M0.06 100V-0.06H20.29V100Z" fill="currentColor" />
        <path transform="translate(262.03 0)" d="M0.06 100V-0.06H20.29V82.3H75.8V100Z" fill="currentColor" />
        <path transform="translate(352.83 0)" d="M0 85h15v15h-15Z" fill="var(--color-signal)" />
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
