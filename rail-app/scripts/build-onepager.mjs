import puppeteer from "puppeteer-core";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

/**
 * Build the A4 one-pager PDF(s) from HTML.
 * Usage: node scripts/build-onepager.mjs [ko|en|all]
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const docsDir = path.join(root, "docs");
const publicDir = path.resolve(__dirname, "../public");
fs.mkdirSync(docsDir, { recursive: true });
fs.mkdirSync(publicDir, { recursive: true });

const arg = (process.argv[2] || "all").toLowerCase();
const langs = arg === "all" ? ["ko", "en"] : [arg];

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars"],
});

for (const lang of langs) {
  const htmlPath =
    lang === "en"
      ? path.join(root, "design", "onepager-en", "index.html")
      : path.join(root, "design", "onepager", "index.html");
  if (!fs.existsSync(htmlPath)) {
    console.log(`skip ${lang}: ${htmlPath} not found`);
    continue;
  }
  const fileName = lang === "en" ? "RAIL-onepager-en.pdf" : "RAIL-onepager.pdf";
  const previewPath =
    lang === "en"
      ? path.join(root, "design", "onepager-en", "preview.png")
      : path.join(root, "design", "onepager", "preview.png");

  const page = await browser.newPage();
  await page.goto("file:///" + htmlPath.replace(/\\/g, "/"), {
    waitUntil: "networkidle2",
    timeout: 60000,
  });
  await page.evaluate(() => document.fonts?.ready);
  await new Promise((r) => setTimeout(r, 900));

  await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1.5 });
  await page.screenshot({ path: previewPath });

  const outDocs = path.join(docsDir, fileName);
  await page.pdf({
    path: outDocs,
    format: "A4",
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });
  fs.copyFileSync(outDocs, path.join(publicDir, fileName));
  console.log(
    `${lang}:`,
    outDocs,
    Math.round(fs.statSync(outDocs).size / 1024) + "KB",
    "→ public/" + fileName,
  );
  await page.close();
}

await browser.close();
