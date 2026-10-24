import type { MetadataRoute } from "next";

const BASE = "https://rail-rwa.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-22T00:00:00+09:00");
  const paths: Array<[string, number]> = [
    ["", 1],
    ["/en", 0.9],
    ["/nitro", 0.9],
    ["/feedback", 0.8],
    ["/log", 0.8],
    ["/market", 0.8],
    ["/agents", 0.8],
    ["/underwrite", 0.7],
    ["/underwrite/hanbit", 0.7],
    ["/underwrite/kimfreelance", 0.6],
    ["/underwrite/fiberlogic", 0.6],
    ["/passport/hanbit", 0.7],
    ["/passport/kimfreelance", 0.6],
    ["/passport/fiberlogic", 0.6],
    ["/en/underwrite", 0.8],
    ["/en/underwrite/hanbit", 0.8],
    ["/en/passport/hanbit", 0.8],
    ["/en/market", 0.7],
    ["/en/agents", 0.7],
  ];
  return paths.map(([path, priority]) => ({
    url: `${BASE}${path}`,
    lastModified,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
