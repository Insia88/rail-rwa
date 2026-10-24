/**
 * og_v2.mjs — render the RAIL v2 share card (1200x630) from og_v2.html.
 *
 * Typography is rendered by Chrome (real text layout + real webfonts), then the
 * 2x framebuffer is downsampled with sharp so glyph edges stay clean at 1x.
 *
 * Numbers on the card come from scripts/art/og_figures.json, which is produced
 * by scripts/art/og_figures.ts from lib/engine.ts — never typed by hand:
 *
 *     npx tsx scripts/art/og_figures.ts     # refresh engine figures
 *     node scripts/art/og_v2.mjs            # render public/art/og-v2.png
 *
 * Run from rail-app/ (puppeteer-core + sharp live there).
 */
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const W = 1200;
const H = 630;
const DSF = 2;

const htmlPath = path.resolve("scripts/art/og_v2.html");
const figuresPath = path.resolve("scripts/art/og_figures.json");
const outPath = path.resolve("public/art/og-v2.png");
const tmpPath = path.join(os.tmpdir(), `rail-og-v2-${process.pid}.png`);

const figures = JSON.parse(readFileSync(figuresPath, "utf8"));
mkdirSync(path.dirname(outPath), { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars", "--font-render-hinting=medium"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: DSF });
  await page.goto("file:///" + htmlPath.replace(/\\/g, "/"), {
    waitUntil: "networkidle0",
    timeout: 60000,
  });

  // inject computed figures (engine output)
  await page.evaluate((f) => {
    for (const el of document.querySelectorAll("[data-fig]")) {
      const key = el.getAttribute("data-fig");
      if (key && key in f) el.textContent = String(f[key]);
    }
  }, figures);

  await page.evaluate(() => document.fonts.ready);
  const fonts = await page.evaluate(() => ({
    pretendard: document.fonts.check('800 74px "Pretendard Variable"'),
    serif: document.fonts.check('italic 400 19px "Instrument Serif"'),
    mono: document.fonts.check('500 12px "IBM Plex Mono"'),
    count: document.fonts.size,
  }));
  console.log("fonts:", fonts);
  if (!fonts.pretendard) console.warn("WARN: Pretendard did not load — Korean type may fall back");

  await new Promise((r) => setTimeout(r, 500)); // let images decode + paint settle
  await page.screenshot({
    path: tmpPath,
    clip: { x: 0, y: 0, width: W, height: H },
    type: "png",
  });
} finally {
  await browser.close();
}

// 2400x1260 -> 1200x630 (supersampled type, crisp at 1x)
await sharp(tmpPath)
  .resize(W, H, { kernel: "lanczos3" })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(outPath);
rmSync(tmpPath, { force: true });

const { size } = await import("node:fs").then((fs) => fs.statSync(outPath));
console.log(`og-v2.png written: ${outPath} (${(size / 1024).toFixed(1)} KB)`);
