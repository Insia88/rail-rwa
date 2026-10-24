/**
 * render.mjs ??headless Chrome screenshotter for the RAIL logo workbench.
 *
 * Usage: node render.mjs <html> <png> [width] [height] [scale] [selector] [mode]
 *   selector : CSS selector to screenshot a single element (optional)
 *   mode     : "full" -> full page screenshot
 * puppeteer-core is resolved from rail-app/node_modules so the script can
 * live in design/logo/_src (outside the app's package scope).
 */
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

const require = createRequire(
  path.resolve("C:/Users/User/Documents/deepseek-harness/default-workspace/rwa-nitro/rail-app/package.json"),
);
const puppeteer = require("puppeteer-core");

const args = process.argv.slice(2);
let [htmlPath, pngPath, width = "1200", height = "1800", scale = "2", selector = "", mode = ""] = args;
if (selector === "full" || selector === "auto") { mode = "full"; selector = ""; }

const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const abs = path.resolve(htmlPath);
if (!fs.existsSync(abs)) throw new Error(`missing html: ${abs}`);

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: [
    "--allow-file-access-from-files",
    "--force-color-profile=srgb",
    "--font-render-hinting=none",
    "--hide-scrollbars",
    "--disable-lcd-text",
  ],
});

try {
  const page = await browser.newPage();
  await page.setViewport({
    width: Number(width),
    height: Number(height),
    deviceScaleFactor: Number(scale),
  });
  await page.goto("file:///" + abs.replace(/\\/g, "/"), { waitUntil: "networkidle0", timeout: 120000 });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  });
  fs.mkdirSync(path.dirname(path.resolve(pngPath)), { recursive: true });
  if (selector) {
    const el = await page.$(selector);
    if (!el) throw new Error(`selector not found: ${selector}`);
    await el.screenshot({ path: path.resolve(pngPath), type: "png" });
  } else {
    await page.screenshot({
      path: path.resolve(pngPath),
      type: "png",
      fullPage: mode === "full",
    });
  }
  console.log(`shot ${pngPath} (${width}x${height} @${scale}x)${selector ? " sel=" + selector : ""}`);
} finally {
  await browser.close();
}
