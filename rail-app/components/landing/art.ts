/**
 * v2 art assets (locally generated, no external URLs).
 * Paths are stable even before image-smith finishes — missing files simply
 * render no background until QA.
 */
export const ART = {
  heroRail: "/art/hero-rail.webp",
  orangeBand: "/art/orange-band.webp",
  passportChrome: "/art/passport-chrome.webp",
  chromeRibbon: "/art/chrome-ribbon.webp",
  halftoneGrid: "/art/halftone-grid.webp",
  grain: "/art/grain.png",
  agentsScan: "/art/agents-scan.webp",
} as const;

export function artUrl(path: string): string {
  return `url(${path})`;
}
